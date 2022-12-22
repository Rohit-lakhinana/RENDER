const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var imgModel = require('./models/newsModel');
var multer = require('multer');
//load all key-value pairs in .env file to process.env obj
const dotenv = require('dotenv')
dotenv.config()

const app = express();
app.use(express.json())

/* We cannot serve up the index.html file and expect
 html data to magically appear because there’s 
 no way to add dynamic content to an HTML file.
 so, we have installed EJS template engine to
 generate the HTML. */
 //MIDDLE WARE
 app.use(bodyParser.urlencoded({ extended: false }))
 app.use(bodyParser.json())
  
 // Set EJS as templating engine
 app.set("view engine", "ejs");
//WE NEED TO WRITE THIS TO ADD CSS TO HTML IN VIEWS
//OTHER-WISE IT WONT WORK
app.use(express.static(__dirname + '/views'));

mongoose.connect(process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true }, err => {
      console.log('connected to DATA BASE')

//it will store the data in local storage 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

app.get('/', (req, res) => {
  imgModel.find({}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
        //newsPage is the .ejs html file
          res.render('newsPage', { items: items });
      }
  });
});

app.post('/', upload.single('image'), (req, res, next) => {
 
  var obj = {
      state: req.body.state,
      desc: req.body.desc,
      hline: req.body.hline,
      dist: req.body.dist,
      pincode: req.body.pincode,
      img: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/png'
      }
  }
  imgModel.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
          // item.save();
          res.redirect('/');
      }
  });
});

var port = process.env.PORT
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})

  });