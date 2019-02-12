var request = require('request');
var secrets = require('./secrets.js');
var fs = require("fs");
var arg = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

//Error message if arguments are undefined and getting the repo contributors via github.com/repos
function getRepoContributors(repoOwner, repoName, cb) {
    if (repoOwner === undefined || repoName === undefined) {
        console.log("Please input a propery user and repo.");
    } else {
        var options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
        }
        };
        
        //parsing through the contributors information to only collect the avatar URLS
        request(options, function(err, res, body) {
            var bodyContent = JSON.parse(body);
            cb(err, bodyContent);
            bodyContent.forEach(function (contributor){
                var avatarUrls = contributor.avatar_url;
                downloadImageByURL(avatarUrls, `avatars/${contributor.login}jpg`);
            });
        });
    }
}

//the function that actually writes the image from the urls to a filepath
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

//final function call to pull the callback functions from whatever user and repo is entered.
getRepoContributors(arg[0], arg[1], function(err, result) {
    console.log("Errors:", err);
    console.log(result);
});