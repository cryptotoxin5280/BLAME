// gitHarvest.js

const { execSync } = require('child_process');
const assert = require('assert');

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

console.log('Starting the Git Harvester!');

cmd = "scripts/gitReaper.sh";

getGitLog = () => {
  console.log("Executing %s...", cmd);
  return execSync(cmd, { encoding: 'utf-8' });
};

getPullRequestNo = (json) => {
  subject = json["subject"];
  var pullRequestNo = subject.match(/\(pull request #(\d*)/i)[1];
  return pullRequestNo;
};

parseGitLog = (data) => {
  data = data.trim().split("\n");
  data.map( (record) => {
    record = record.replace(/\\n$/, "");
    console.log("Parsing: %s", record);
    record = JSON.parse(record); 

    // Get the Pull Request No. 
    var pullRequestNo = getPullRequestNo(record);

    // Insert the Pull Request No. into the JSON record.
    record["pullRequestNo"] = pullRequestNo;

    // Insert the Status field into the JSON record.
    record["status"] = "scheduled";

    const collection = db.collection('jobs');
    // Search for an existing JSON record in the DB.
    collection.findOne( {"pullRequestNo": pullRequestNo},
      (err, result) => {
        // If Pull Request not found, 
        // insert the record into the DB.
        alert(result);
        if( result != 1 ) {
          collection.insertOne( record, (err, result) => {
            assert.equal(null, err);
            assert.equal(1, result.insertedCount);
          });
        }
      }
    );

      /*
      if(!isFound) {
      collection.insertOne( record, (err, result) => {
        assert.equal(null, err);
        assert.equal(1, result.insertedCount);
      });
      */
  });
};

setInterval( () => {
  var data = getGitLog();
  parseGitLog(data);
}, 10000);
