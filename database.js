const mongodb = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/url_shortener';


module.exports = {

storeUrl: function (newEntry){
    mongodb.connect(url, ((err, db) => {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        var collection = db.collection('urls');

      collection.insert(newEntry, function (err, result) {
            if (err) {
              console.log(err);
            }
        db.close();

        });
      }
    }));
  },

findUrl: function (refNum, callback){
    mongodb.connect(url, ((err, db) => {

      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        var collection = db.collection('urls');

      collection.find({ref: Number(refNum)},{ref:0, _id:0}).toArray((err, result) => {

            if (err) {
              console.log(err);
              callback(err, null);
            }else{
              callback(null, result);
            }
        db.close();
      });
      }
    }));
  }
};
