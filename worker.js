var kue = require("kue");
var request = require("request");

var queue = kue.createQueue({
  redis: process.env.REDIS_URL // this is for heroku redis instead of local
});

// Here the worker is designed to handle different job types
// it will process them one at a time off the kue queue
queue.process("test", (job, done) => {
    console.log("job data", job.data);
    done(null, 'Success!');
});

// this getData job requires whatever options you need for the request to be processed
// This is a generic get data via request
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
