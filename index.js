require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({extended: true}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const originalUrls = [];
const shortnerUrls = [];

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const findIndex = originalUrls.indexOf(url);

  if(!url.includes("https://") && !url.includes("http://")){
    res.json({error: "invalid url"});
  }

  if(findIndex < 0) {
    originalUrls.push(url);
    shortnerUrls.push(shortnerUrls.length)

    return res.json({
      original_url: url,
      short_url: shortnerUrls.length - 1
    });
  }

  return res.json({
    original_url: url,
    short_url: shortnerUrls[findIndex]
  })

})

app.get("/api/shorturl/:shorturl", (req, res) => {
  const p_shorturl = req.params.shorturl;
  const findIndex = shortnerUrls.indexOf(p_shorturl);

  if(findIndex < 0) {
    res.json({
      error: "No short URL found for the given input"
    })
  }

  res.redirect(originalUrls[findIndex]);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
