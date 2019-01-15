// set up server here
require('dotenv').config();
var express = require('express');
var app = express();
var request = require("request");
var kue = require("kue");
var responseTime = require('response-time');

var client = require('redis').createClient(process.env.REDIS_URL);
// const queue = kue.createQueue({
//   redis: process.env.REDIS_URL,
// });
// var initialize = (pClient, pQueue) => {
//   Client = pClient;
//   Queue = pQueue;
//   return this;
// };

// var pair = initialize(client, queue);


var port = process.env.PORT || 3000;

app.post('/setRedis', function(req, res){
  client.set('foo', 'bar');
  client.get('foo', function (err, reply) {
      console.log(reply.toString()); // Will print `bar`
  });
  res.send('success');
});

app.post('/getRedis', function(req, res){
  client.get('bob', function(error, result) {
    if (error) throw error;
    console.log('GET result ->', result)
    res.send(result);
  });

});


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
      timeout: 10,
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
        res.send('Sorry, your request is taking too long and has been given to a background process.  We will send you the results of your data in a bit!s');
      } else {
        res.send(JSON.parse(body));
      }
    });
  });
});


  app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
  
  // app.listen(3000)
