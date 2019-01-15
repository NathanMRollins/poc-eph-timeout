var request = require("request");
var kue = require("kue");
require('dotenv').config();

// try {
//   const queue = kue.createQueue({
//     redis: process.env.REDIS_URL,
//   });
//   queue.process('mytype', (job, done) => {
//     console.log('Hey we be working here!');
//     switch (job.data.letter) {
//       case 'a':
//         done(null, 'apple');
//         break;
//       default:
//         done(null, 'unknown');
//     }
//   });
// } catch (error) {
//   console.log(error);
// }


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
    timeout: 2800,
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
      console.log('Sorry, your request is taking too long and has been given to a background process.  We will send you the results of your data in a bit!s');
    } else {
      console.log(JSON.parse(body));
    }
  });
});
