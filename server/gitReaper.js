// gitReaper.js
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

const redisClient = require('redis').createClient();

console.log('Starting the Git Reaper!');

cmd = "scripts/gitReaper.sh";

const getGitLog = () => {
  stdout = execSync(cmd);
  return String(stdout);
};

const getSourceBranch = (json) => {
  subject = json["subject"];
  var sourceBranch = subject.match(/^Merged in (.*) \(pull request #/i)[1];
  return sourceBranch;
};

const getPullRequestNo = (json) => {
  subject = json["subject"];
  var pullRequestNo = subject.match(/\(pull request #(\d*)/i)[1];
  return pullRequestNo;
};

const parseGitLog = (data) => {
  data = data.trim().split("\n");
  data.map( (record) => {
    record = record.replace(/\\n$/, "");
    record = JSON.parse(record); 

    // Fix the Date
    var mergeDate = new Date(record["date"]);
    record["date"] = mergeDate;

    // Inject the Pull Request No. into the JSON record.
    var pullRequestNo = getPullRequestNo(record);
    record["pullRequestNo"] = pullRequestNo;

    var sourceBranch = getSourceBranch(record);
    record["sourceBranch"] = sourceBranch;

    //console.log(sourceBranch);

    // Inject the Status field into the JSON record.
    record["status"] = "scheduled";

    const collection = db.collection('jobs');
    // Search for an existing JSON record in the DB.
    collection.findOne( { "pullRequestNo": pullRequestNo },
      (err, result) => {
        // If Pull Request not found, insert it.
        if( !result ) {
          collection.insertOne( record, (err, result) => {
            assert.equal(null, err);
            assert.equal(1, result.insertedCount);
            redisClient.publish("insert-job", JSON.stringify(record));
          });
        }
      }
    );
  });
};

setInterval( () => {
  var data = getGitLog();
  //console.log(data);
  if( data !== "" ) {
    parseGitLog(data);
  }
}, 10000);
