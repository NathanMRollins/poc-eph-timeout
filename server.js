// hello
// redisDemo.js
require('dotenv').config();
var redis = require('redis');
var kue = require('kue');
var express = require('express');
var request = require("request");

var client = kue.redis.createClient(process.env.REDIS_URL);
// var client = redis.createClient();
var queue = kue.createQueue({
    redis: process.env.REDIS_URL
});

var app = express();
var port = 3000;

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});


app.post('/test', function (req, res){
    var job = queue
    .create("test", {
      title: "job ran at " + Date.now()
    })
    .save();
    job.on('complete', result => {
        res.send(`result: ${result}`);
    });
});

app.post('/getData', function (req, res){
    console.log('Recieved getData request.')
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
            if (err) {
                console.log(err);
                if(err.code === 'ESOCKETTIMEDOUT'){
                    if(err.connect === false){
                        // then we have a timeout error so we put this job on the kue queue
                        var job = queue
                            .create("getData", {
                                title: "job ran at " + Date.now(),
                                options: optionsData
                            })
                            .save();
                        job.on('complete', result => {
                            res.send(`result: ${result}`);
                        });
                    }
                }
                // console.log(err.connect); // false means read error, not connection error.  That is, we connected to them but they didn't get the stuff to us in time.
            } else {
                var resultData = JSON.parse(body);
                res.send(resultData);
            }
        });
    });
});
