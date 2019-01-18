import express from 'express';
import { Queue } from 'kue';

const app = express();
// let client: Client;
let queue: Queue;
export const initialize = ( pQueue: Queue) => {
  // client = pClient;
  queue = pQueue;
};
// app.get('/', async (_, res, next) => {
//   try {
//     const result = await client.query('SELECT * FROM hellotable');
//     res.send(`${result.rows[0].name} Success Redis\n`);
//   } catch (error) {
//     next(error);
//   }
// });

app.get('/hello', (req, res)=> {
  console.log('hi');
  res.send('sup');
});
app.get('/intense', (_, res, next) => {
  console.log('hi');
  const job = queue
    .create('mytype', {
      letter: 'a',
      title: 'mytitle',
    })
    .removeOnComplete(true)
    .save((error: any) => {
      if (error) {
        next(error);
        return;
      }
      job.on('complete', result => {
        res.send(`Hello Intense ${result}`);
      });
      job.on('failed', () => {
        const failedError = new Error('failed');
        next(failedError);
      });
    });
});
export default app;
