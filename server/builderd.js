// pipeline.js

const { exec } = require('child_process');
const axios = require('axios');

console.log("Builder Daemon started...");

const build = () => {
  var buildCmd = "scripts/build.sh"
  exec(buildCmd, (error, stdout, stderr) => {  
    if( error ) {
      console.error(`exec error: ${error}`);
    }
  });
  console.log("Kicking off build!");
};

const getPullRequest = () => {

};

// Kick-Off Build
setInterval( () => {
  pullRequest = getPullRequest();
  // 1. Lock lab

  // 2. Set status
  axios.post("http://localhost:3001/api/job",
    { pullRequestNo: "43",
      status: "build" 
    })
    .catch( err => {
      console.log(err);
    });

  // 3. Start build
  //build();

}, 10000);

// Check for Completed Build
//setInterval( () => {
  // Peek at end of build log.
  // If completed...
  // 1. Set status.
  // 2. Unlock Lab
//}, 10000);
