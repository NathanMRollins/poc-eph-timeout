// hi
require('dotenv').config();
var kue = require("kue");
var request = require("request");

var queue = kue.createQueue({
  redis: process.env.REDIS_URL
});

console.log('Waiting for work!');

queue.process("test", (job, done) => {
    console.log("job data", job.data);
    done(null, 'Success!');
});

queue.process("getData", (job, done) => {
  console.log("job data", job.data.title);
  options = job.data.options;
  delete options.timeout;
  request(options, function (err, response, body) {
    if (err) {
      console.log(err);
      done(err);
    }
    console.log('Worker finished getData job.')
    done(null, body);
  });
 
});
