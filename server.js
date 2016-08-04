const express = require('express');
const app = express();
const databse = require('./database');
const port = process.env.PORT || 8000;

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/new', ((req, res) => {
  var randNum = Math.floor(Math.random() * 9999) + 1;
  var refNum = String('0000' + randNum).slice(-4);
  var refUrl = req.query.url;

  if(refUrl.match(/htt(ps|p):\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)){
    var newEntry = {ref: Number(refNum), refUrl: refUrl};

    database.storeUrl(newEntry, ((err, response) => {

      if(err){

        console.log(err);
        res.status(500).send(`Ooops... Something went wrong, please try again`);

      }else{

      res.status(200).send(`{"ref":${response.ops[0].ref} "refUrl":${response.ops[0].refUrl}}`);

      }

    }));

  }else{

    res.status(400).send(`{"error": "Please supply a vaild URL"}`);

  }

}));

app.use(/\/\d\d\d\d/, ((req, res) => {
  var num = req.baseUrl.replace(/^\//, '');

  database.findUrl(num, ((err, data) =>{

    if(err){
      console.log(`from callback: ${err}`);
    }

    if(data[0]){
      res.redirect(`${data[0].refUrl}`);
    }else{
      res.status(404).send(`<h1>404 - NOT FOUND</h1><br><h3>No redirect URL found this request</h3><br><p>Please check and try again</p>`);
    }

   }));
}));
