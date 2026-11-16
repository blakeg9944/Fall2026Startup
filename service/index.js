const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const { seedReviews } = require('./seedData');
const googleConfig = require('./googleConfig.json');
const { searchPlaces, getPlaceDetails } = require('./googlePlaces');
const { users } = require('./database');

// The Google key stays on the server. It is gitignored like dbConfig.json, and the browser only ever talks to /api/places.
// Warn at startup so a missing key shows up in the logs right away instead of as a failed search later.
if (!googleConfig.apiKey || googleConfig.apiKey.startsWith('PASTE_')) {
  console.log('Warning: service/googleConfig.json has no Google API key, so place searches will fail');
}

const app = express();

// Accounts live in the users collection (see database.js).
// Each user is { email, userName, password (bcrypt hash), token }

// Reviews also live in memory until the database exists. They start with the seed reviews.
// Each review is { id, restaurantId, userName, date, rating, fryer, grill, prep, menu, celiac, sensitive, staff, comments, photos }
let reviews = [...seedReviews];

const authCookieName = 'token';

// Longest comment a review can have, so one request can't store an enormous string
const maxCommentLength = 2000;

// The deployment runs the service on port 4000. A port can be passed on the command line to override it.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Parse JSON request bodies into req.body
app.use(express.json());

// Parse the auth cookie into req.cookies
app.use(cookieParser());

// Serve the built React frontend. After deployment the bundle lives in the public directory.
app.use(express.static('public'));

// All service endpoints live under /api so the frontend (and Vite's proxy) can tell them apart from static files
const apiRouter = express.Router();
app.use('/api', apiRouter);

// Create a new account and log it in
apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ msg: 'Email and password are required' });
  }
  if (await findUser('email', email)) {
    return res.status(409).send({ msg: 'An account with that email already exists. Try logging in.' });
  }

  const user = await createUser(email, password);
  setAuthCookie(res, user.token);
  res.send({ userName: user.userName });
});

// Log in an existing account
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = email ? await findUser('email', email) : null;
  // The same message for an unknown email and a wrong password, so the response doesn't reveal which emails have accounts
  if (!user || !(await bcrypt.compare(password ?? '', user.password))) {
    return res.status(401).send({ msg: 'Invalid email or password.' });
  }

  // A fresh token on every login means old tokens stop working
  const token = uuid.v4();
  await users.updateOne({ email: user.email }, { $set: { token } });
  setAuthCookie(res, token);
  res.send({ userName: user.userName });
});

// Log out by forgetting the token and clearing the cookie
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    await users.updateOne({ email: user.email }, { $unset: { token: '' } });
  }
  // clearCookie must use the same path the cookie was set with, or the browser keeps it
  res.clearCookie(authCookieName, { path: authCookieOptions.path });
  res.status(204).end();
});

// Middleware for endpoints that need a logged in user.
// It looks up the user that owns the cookie's token and rejects the request if there isn't one.
async function verifyAuth(req, res, next) {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }
  req.user = user;
  next();
}

// Tells the frontend who is logged in, so a page refresh can restore the session from the cookie
apiRouter.get('/auth/me', verifyAuth, (req, res) => {
  res.send({ userName: req.user.userName });
});

// Searches Google Places for restaurants. Each result is { id, name, address, location }.
// GET /api/places?q=text. Google can't list every place, so a missing q returns an empty list.
apiRouter.get('/places', async (req, res) => {
  const text = (req.query.q ?? '').toString().trim();
  if (!text) {
    return res.send([]);
  }
  try {
    res.send(await searchPlaces(text));
  } catch (ex) {
    // The details go to the logs only, because they can mention the key setup
    console.log(ex.message);
    res.status(502).send({ msg: 'Place search is unavailable right now' });
  }
});

// One restaurant by Google place ID: { id, name, address, location, hours }
apiRouter.get('/places/:id', async (req, res) => {
  try {
    const place = await getPlaceDetails(req.params.id);
    if (!place) {
      return res.status(404).send({ msg: 'Place not found' });
    }
    res.send(place);
  } catch (ex) {
    console.log(ex.message);
    res.status(502).send({ msg: 'Place details are unavailable right now' });
  }
});

// Anyone can read reviews. Optional filters: ?restaurantId=... or ?userName=...
apiRouter.get('/reviews', (req, res) => {
  const { restaurantId, userName } = req.query;
  res.send(reviews.filter((review) => (!restaurantId || review.restaurantId === restaurantId) && (!userName || review.userName === userName)));
});

apiRouter.get('/reviews/:id', (req, res) => {
  const review = reviews.find((r) => r.id === req.params.id);
  if (!review) {
    return res.status(404).send({ msg: 'Review not found' });
  }
  res.send(review);
});

// Writing reviews requires a logged in user. The author comes from the token, never from the request body.
apiRouter.post('/reviews', verifyAuth, (req, res) => {
  const fields = pickReviewFields(req.body);
  if (!fields || !req.body.restaurantId) {
    return res.status(400).send({ msg: 'Invalid review' });
  }

  const review = {
    ...fields,
    id: uuid.v4(),
    restaurantId: req.body.restaurantId,
    userName: req.user.userName,
    date: today(),
    photos: [],
  };
  reviews.push(review);
  res.send(review);
});

// Only the author can edit or delete a review
apiRouter.put('/reviews/:id', verifyAuth, (req, res) => {
  const review = reviews.find((r) => r.id === req.params.id);
  if (!review) {
    return res.status(404).send({ msg: 'Review not found' });
  }
  if (review.userName !== req.user.userName) {
    return res.status(403).send({ msg: 'You can only edit your own reviews' });
  }
  const fields = pickReviewFields(req.body);
  if (!fields) {
    return res.status(400).send({ msg: 'Invalid review' });
  }

  Object.assign(review, fields);
  res.send(review);
});

apiRouter.delete('/reviews/:id', verifyAuth, (req, res) => {
  const review = reviews.find((r) => r.id === req.params.id);
  if (!review) {
    return res.status(404).send({ msg: 'Review not found' });
  }
  if (review.userName !== req.user.userName) {
    return res.status(403).send({ msg: 'You can only delete your own reviews' });
  }

  reviews = reviews.filter((r) => r.id !== review.id);
  res.status(204).end();
});

// Copies only the editable fields from a request body, or returns null if any are invalid.
// This keeps clients from setting things like id, userName, or date themselves.
function pickReviewFields(body) {
  const answers = ['yes', 'no', 'unsure'];
  const scores = [1, 2, 3, 4, 5];
  const { rating, fryer, grill, prep, menu, celiac, sensitive, staff, comments } = body ?? {};

  const valid = [fryer, grill, prep, menu].every((answer) => answers.includes(answer)) && scores.includes(rating) && scores.includes(celiac) && scores.includes(sensitive) && typeof staff === 'boolean' && typeof comments === 'string' && comments.length <= maxCommentLength;
  return valid ? { rating, fryer, grill, prep, menu, celiac, sensitive, staff, comments } : null;
}

// YYYY-MM-DD in the server's time zone
function today() {
  return new Date().toLocaleDateString('en-CA');
}

async function createUser(email, password) {
  const key = normalize(email);
  const user = {
    email: key,
    // The display name is the part of the email before the @, so celiac_sarah@example.com shows as celiac_sarah
    userName: key.split('@')[0],
    // Only the bcrypt hash is stored, never the password itself
    password: await bcrypt.hash(password, 10),
    token: uuid.v4(),
  };
  await users.insertOne(user);
  return user;
}

// field is 'email' or 'token'. Both are only ever passed in by this file, never taken from a request.
// The value is forced to a string so a JSON body like { "email": { "$ne": "" } } can't turn into a query operator.
async function findUser(field, value) {
  if (!value || typeof value !== 'string') return null;
  const match = field === 'email' ? normalize(value) : value;
  return users.findOne({ [field]: match });
}

function normalize(email) {
  return email.trim().toLowerCase();
}

// httpOnly keeps the token away from frontend JavaScript, and sameSite keeps other sites from sending it.
// The path limits the cookie to the service endpoints. Secure is on unless NODE_ENV=development,
// since some browsers refuse Secure cookies over plain http://localhost.
const authCookieOptions = {
  path: '/api',
  secure: process.env.NODE_ENV !== 'development',
  httpOnly: true,
  sameSite: 'strict',
};

function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, authCookieOptions);
}

// Anything that isn't a file or an endpoint gets the frontend, so React Router can handle the path
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`GlutenGuard service listening on port ${port}`);
});
