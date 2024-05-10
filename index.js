require('dotenv').config();
const express = require('express');
const cors = require('cors');
const validUrl = require('valid-url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Object to store original and shortened URLs
const urlMap = {};

// Function to generate unique short URL ID
function generateShortUrlId() {
  return Object.keys(urlMap).length + 1; // You can use a more sophisticated method for generating unique IDs
}

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;

  if (!validUrl.isWebUri(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  if (urlMap[url]) {
    return res.json({ original_url: url, short_url: urlMap[url] });
  }

  const shortUrlId = generateShortUrlId();
  urlMap[url] = shortUrlId;

  return res.json({ original_url: url, short_url: shortUrlId });
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shortUrlId = req.params.shorturl;
  const originalUrl = Object.keys(urlMap).find(url => urlMap[url] == shortUrlId);

  if (!originalUrl) {
    return res.status(404).json({ error: "No URL found for the given short URL" });
  }

  res.redirect(originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
