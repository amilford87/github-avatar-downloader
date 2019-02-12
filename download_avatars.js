var request = require('request');
var secrets = require('./secrets.js');
var fs = require("fs");
var arg = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    if (arg[0] === undefined || arg[1] === undefined) {
        console.log("Please input a propery user and repo.");
    }
    else {
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
        var avatarUrls = contributor.avatar_url;
        downloadImageByURL(avatarUrls, `avatars/${contributor.login}jpg`);
    });
   });
  }
}

  function downloadImageByURL(url, filePath) {
    request.get(url)
    
    .on('error', function(err){
        throw err;
    })
    .on('response', function(response){
        console.log("Status: " + response.statusMessage);
    })
    .on('data', function(data){
        console.log('Downloading image...');
    })
    
    .pipe(fs.WriteStream(filePath))
    
    .on('finish', function (response){
        console.log("Download complete");
  });
}

getRepoContributors(arg[0], arg[1], function(err, result) {
    console.log("Errors:", err);
    console.log(result);
    
  });