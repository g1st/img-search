const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const GoogleImages = require('google-images');
require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 3000;
const imgClient = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);
const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/img';

app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/imagesearch/:search_term', (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    console.log('Connected correctly to server');

    const collection = db.collection('img');

    collection.insertOne({
      term: req.params.search_term,
      when: new Date()
    });

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
    .catch(err => {
      console.error(err);
    });
    db.close();
  });
});

app.get('/api/latest/imagesearch/', (req, res) => {
  MongoClient.connect(url, (err, db) => {
    const collection = db.collection('img');
    collection.find({}, {_id: 0}).sort( {when: -1 }).limit(10).toArray((err, results) => {
      if (err) throw err;
      res.send(results);
    });
    db.close();
  });
});

app.listen(PORT, () => console.log(`app is listening on port ${PORT}`));
