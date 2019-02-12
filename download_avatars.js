var request = require('request');
var secrets = require('./secrets.js');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
       url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
       headers: {
           'User-Agent': 'request',
       }

   };

   request(options, function(err, res, body) {
       cb(err, body);
       var bodyContent = JSON.parse(body);
    bodyContent.forEach(function (contributor){
        console.log(contributor.avatar_url);
    });
   });
  }

  getRepoContributors("jquery", "jquery", function(err, result) {
    console.log("Errors:", err);
    // console.log("Result:", result);
  });