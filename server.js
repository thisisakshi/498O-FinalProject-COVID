const express = require('express');
const cors = require('cors');
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile)

var app = express();
app.use(cors()); // enable cors
app.use(express.static('.'))

app.get('/', function(req, res){
      readFile("data/healthdata.json")
      .then(raw  => {
        var jsonTuples = JSON.parse(raw);
        res.send(jsonTuples)
      })
      .catch( e => { console.log(e) });
    });
    

app.listen(8080, function() {
  console.log("DataVizFinal Data Server is running at localhost: 8080")
});