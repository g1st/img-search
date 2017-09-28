const express = require('express');
const mongodb = require('mongodb').MongoClient;
const GoogleImages = require('google-images');
require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 3000;
const imgClient = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);

app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/imagesearch/:search_term', (req, res) => {
  // if offset is anything but number - show the first page
  const page = isNaN(req.query.offset) ? 1 : req.query.offset;

  imgClient.search(req.params.search_term, {page: page})
      .then(images => {
        images.map(image => {
          delete image.type;
          delete image.height;
          delete image.size;
          delete image.width;
          image.thumbnail = image.thumbnail.url;
        });
          res.send(images);
      })
      .catch((err) => {
        console.error(err);
      });
});

app.listen(PORT, () => `app is listening on port ${PORT}`);
