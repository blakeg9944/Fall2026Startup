const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const app = express();

// Accounts live in memory until the database exists, so they reset whenever the service restarts.
// Each user is { email, userName, password (bcrypt hash), token }
const users = [];

const authCookieName = 'token';

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
  if (!user) {
    return res.status(401).send({ msg: 'No account found for that email. Use Create Account to make one.' });
  }
  if (!(await bcrypt.compare(password ?? '', user.password))) {
    return res.status(401).send({ msg: 'Incorrect password.' });
  }

  // A fresh token on every login means old tokens stop working
  user.token = uuid.v4();
  setAuthCookie(res, user.token);
  res.send({ userName: user.userName });
});

// Log out by forgetting the token and clearing the cookie
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Anything that isn't a file or an endpoint gets the frontend, so React Router can handle the path
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
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
  users.push(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  const match = field === 'email' ? normalize(value) : value;
  return users.find((user) => user[field] === match) ?? null;
}

function normalize(email) {
  return email.trim().toLowerCase();
}

// httpOnly keeps the token away from frontend JavaScript, and sameSite keeps other sites from sending it
function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`GlutenGuard service listening on port ${port}`);
});
