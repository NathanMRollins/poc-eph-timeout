// set up server here
var express = require('express')
var app = express()
var request = require("request");


// https://poc-eph-timeout.herokuapp.com/

var port = process.env.PORT || 3000;


// function myFunc() {
//   console.log('hi');
// }

// app.post('/', function (req, res) {
//   console.log(req);
//   request = req;
//     res.write('request');
//     console.log('Received post request');
//     setTimeout(myFunc,15000);
//     res.write('\n');
//     res.write('end');
//     var i = 0;
//     while( i < 1000){
//       res.write('test');
//       i++;
//     }
//     res.end();
//   })

  app.post('/getData', function (req, res) {
    var token = '';

    var optionsToken = {
      method: 'POST',
      url: 'https://auth02.reltio.com/oauth/token',
      qs:
      {
        username: 'm__rollins_nathan@network.lilly.com',
        password: '62@DeeDee',
        grant_type: 'password'
      },
      headers:
      {
        'content-type': 'application/json',
        'cache-control': 'no-cache,no-cache',
        authorization: 'Basic cmVsdGlvX3VpOm1ha2l0YQ=='
      },
      body: '{}'
    };

    request(optionsToken, function (error, response, body) {
      if (error) throw new Error(error);
      jBody = JSON.parse(body);
      token = jBody.access_token;

      console.log(body);

      var optionsData = {
        method: 'POST',
        url: 'https://test.reltio.com/reltio/api/KU4OXlAwblI28iC/entities/_scan?filter=(equals(type%2C\'configuration%2FentityTypes%2FHCP\')%20and%20equals(sourceSystems%2C\'CODS\')%20)&max=10',
        qs:
        {
          // filter: '%28equals%28type%2C%27configuration%2FentityTypes%2FHCP%27%29%20and%20equals%28sourceSystems%2C%27CODS%27%29%20%29',
          // max: '10'
        },
        headers:
        {
          'content-type': 'application/json',
          'cache-control': 'no-cache,no-cache',
          authorization: `Bearer ${token}`
        }
      };

      request(optionsData, function (error, response, body) {
        if (error) throw new Error(error);
        console.log('Hmm');

        res.send(JSON.parse(body));
      });
    });




  });

  app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
  
  // app.listen(3000)
