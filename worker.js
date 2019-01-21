var request = require("request");
var kue = require("kue");
require('dotenv').config();

try {
  const queue = kue.createQueue({
    redis: process.env.REDIS_URL,
  });
  queue.process('mytype', (job, done) => {
    //job is passed in for job.data.whatever or some such
    console.log(job.data.title);
    console.log('Hey we be working here!');
    done(null, 'Hey we finished!');
  });
} catch (error) {
  console.log(error);
}
