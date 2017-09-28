const express = require('express');
const mongodb = require('mongodb').MongoClient;
const GoogleImages = require('google-images');

const img_key = process.env.IMG_KEY || 'AIzaSyAKELwNHTYoh572KXd1DLIWn-dW-1VuBso';
const cse_id = process.env.CSE_ID || '017784079179170889714:reot0j32gsm'
const PORT = process.env.PORT || 3000;

const imgClient = new GoogleImages(cse_id, img_key);

const app = express();

app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api', (req, res) => {
  imgClient.search('funny cat')
      .then(images => {
        images.map(image => {
          delete image.type;
          delete image.height;
          delete image.size;
          delete image.width;
          image.thumbnail = image.thumbnail.url;
        });
        // console.log(images);
          // [{
          //     "url": "http://steveangello.com/boss.jpg",
          //     "type": "image/jpeg",
          //     "width": 1024,
          //     "height": 768,
          //     "size": 102451,
          //     "thumbnail": {
          //         "url": "http://steveangello.com/thumbnail.jpg",
          //         "width": 512,
          //         "height": 512
          //     }
          // }];
          res.send(images);
      })
      .catch((err) => {
        console.error(err);
      });
});

// paginate results
// imgClient.search('Steve Angello', {page: 2});

// search for certain size
// imgClient.search('Steve Angello', {size: 'large'});

app.listen(PORT, () => `app is listening on port ${PORT}`);
