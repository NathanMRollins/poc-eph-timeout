// set up server here
require('dotenv').config();
var express = require('express');
var request = require("request");
var kue = require("kue");
var client = require('redis').createClient(process.env.REDIS_URL);

var app = express();


const queue = kue.createQueue({
redis: process.env.REDIS_URL,
});


queue.process("test", (job, done) => {
  console.log("job data", job.data);
});

app.post('/test', function (req, res){
  var job = queue
    .create("test", {
      title: "job ran at " + Date.now()
    })
    .save(function(err) {
      if (!err) console.log(job.id);
    })
    .on('complete', result => {
      res.send(result);
    });

});


var port = process.env.PORT || 3000;

  app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
  
  // app.listen(3000)


  /*
  
  job = queue.create('requestData', function (result){
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

    request(optionsData, function (err, response, body) {
      if(err){
        console.log(err);
        console.log(err.connect); // false means read error, not connection error.  That is, we connected to them but they didn't get the stuff to us in time.
       } else {
        response.result = JSON.parse(body);
      }
    });
    result = response.result;
  });
  });
  */
