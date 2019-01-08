// set up server here
var express = require('express')
var app = express()

// https://poc-eph-timeout.herokuapp.com/

var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.send('hi');
    console.log('Finale')
  })

  app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
  
  // app.listen(3000)
