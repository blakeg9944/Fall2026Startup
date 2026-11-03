const express = require('express');

const app = express();

// The deployment runs the service on port 4000. A port can be passed on the command line to override it.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Parse JSON request bodies into req.body
app.use(express.json());

// Serve the built React frontend. After deployment the bundle lives in the public directory.
app.use(express.static('public'));

// All service endpoints live under /api so the frontend (and Vite's proxy) can tell them apart from static files
const apiRouter = express.Router();
app.use('/api', apiRouter);

// Anything that isn't a file or an endpoint gets the frontend, so React Router can handle the path
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`GlutenGuard service listening on port ${port}`);
});
