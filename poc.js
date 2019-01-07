// set up server here
var express = require('express')
var app = express()





app.get('/', function (req, res) {
    res.send('hi');
    console.log('Finale')
  })
  
  app.listen(3000)
