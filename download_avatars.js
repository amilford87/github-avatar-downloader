var request = require('request');
var secrets = require('./secrets.js');
var fs = require("fs");

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
        var avatarUrls = contributor.avatar_url;
        downloadImageByURL(avatarUrls, `avatars/${contributor.login}jpg`);
    });
   });
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

//   downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");

  

  getRepoContributors("jquery", "jquery", function(err, result) {
    console.log("Errors:", err);
    // console.log("Result:", result);
  });