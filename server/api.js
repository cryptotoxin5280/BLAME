const express = require('express')
const app = express();
const assert = require('assert');
const redisClient = require('redis').createClient();

// DB CONNECTION
var db;
const mongoClient = require('mongodb').MongoClient;
mongoClient.connect(
  'mongodb://localhost:27017', 
  { useNewUrlParser: true },
  (err, client) => {
    db = client.db('jobsdb');
  }
);

app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api', (req, res) => {
  res.status(200).send('Welcome to BLAME API!');
});

app.get('/api/lab', (req, res) => {
  const labs = db.collection('labs');
  labs.findOne(
    { "labName": req.params.labName },
    (err, doc) => {
      assert.equal(err, null);
      res.json(doc.data);
    }
  );
});

app.post('/api/lab', (req, res) => {
  const labs = db.collection('labs');
  labs.findOneAndUpdate(
    { "labName": req.params.labName },
    { "labLockState": req.params.lockState },
    { "upsert": true },
    (err, result) => {
      assert.equal(err, null);
      assert.equal(result.ok, 1);
      redisClient.publish('update-job', req.params); 
    }
  );
});

app.get('/api/job', (req, res) => {
  const jobs = db.collection('jobs');
  jobs.find( 
    { },
    { "sort": { "date": -1 } }).toArray(
    (err, docs) => {
      if (err) {
        console.log(err);
      }
      res.json(docs);
    });
});

app.post('/api/job', (req, res) => {
  const jobs = db.collection('jobs');
  console.logs("STATUS: %s", req.body.status);
  jobs.findOneAndUpdate(
    { "pullRequestNo": req.body.pullRequestNo },
    { $set: { "status": req.body.status } },
    { "upsert": true },
    (err, result) => {
      assert.equal(err, null);
      assert.equal(result.ok, 1);
      //redisClient.publish('update-job-status', JSON.stringify(req.params)); 
    }
  );
});

app.listen(3001);
console.log('BLAME API listening on PORT %s', 3001);
