const express = require('express')
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser'); 
const path = require('path');
const fs = require('fs')

var multer = require("multer");

app.use(bodyParser.json({ limit:"50mb"}));
app.use(express.urlencoded({ limit:"50mb", extended: false }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/assets')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname+".xml")
    }
})
const upload = multer({
    storage: storage
})




app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.post('/api', upload.single('xmldata'), function(req, res) {

 
});


app.get('/api', function(req, res) {
     const file = path.resolve('./src/assets');
     console.log("hi!")
     res.download(file);

});
app.listen(3000, () => console.log('Example~ app listening on port 3000!!'))

app.use(cors());

