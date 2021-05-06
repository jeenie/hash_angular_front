const express = require('express')
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser'); 



app.use(bodyParser.json({ limit:"50mb"}));
app.use(express.urlencoded({ limit:"50mb", extended: false }));



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.post('/api', function(req, res) {
    
    console.log(JSON.stringify(req.body))
    // fs.writeFile('src/assets/x.xml', JSON.stringify(a), function (err) {
    //     if (err) throw err;
    //     console.log('File is created successfully.');
    //   });

 
});


app.get('/api', function(req, res) {
     const file = path.resolve('./src/assets',x.xml);
     console.log(res)

     res.download(file);

});
app.listen(3000, () => console.log('Example~ app listening on port 3000!!'))

app.use(cors());