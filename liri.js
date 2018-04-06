// IMPORTANT TO DO!
// REPLACE KEYS FOR TWITTER/SPOTIFY/OMDB WITH SECRETS PLEASE PLEASE PLEASE PLEASE AJSFDKLFDASJFADSKLJFDASKLJ

require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');

// THIS BELOW IS VERY VERY BAD MAKE SURE YOU FIX IT LOL
// var spotify = new Spotify({
//     id: 'a2c48b3ad3f44d9eb14c96c481d16855',
//     secret: '5cffd3baff9f4da1a3cdc593d21fb854'
// });

// var client = new Twitter({
//     consumer_key: "xSqARpPIoZiphemdIHxre3s2q",
//     consumer_secret: "A8O7l3QhRF2eDTrdFKctHYB0EXNbktFmy3FxS8ixFKRuU6pyHS",
//     access_token_key: "3388831427-2gDswB5p4kYdkvvWfK5vTSdoxW5SUw9WxP3Nbxn",
//     access_token_secret: "v6AwqoahGuRadYdAdHbTzXkjCNOh75JUcslDgx9NGNyuO",
// })

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// /* uncomment me out to fk everything below me

function runCommand(command, args) {
    switch (command) {
        case 'my-tweets':
            myTweet();
            break;
        case 'spotify-this-song':
            spotifyThis(args);
            break;
        case 'movie-this':
            movieThis(args);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        case undefined:
            console.log('No command detected. Please pass an arguement!');
            break;
        default:
            console.log('Command "' + command + '" not recognized...\nHere are the currently supported commands:');
            console.log('\t> my-tweets');
            console.log('\t> spotify-this-song');
            console.log('\t> movie-this');
            console.log('\t> do-what-it-says');
            break;
    }
}

function myTweet() {
    client.get('statuses/user_timeline', function (err, tweets, res) {
        console.log('=================');
        console.log('Running my-tweets');
        console.log('=================');
        if (err) throw new Error(JSON.stringify(err));
        if (res.statusCode !== 200) {
            console.log("Incorrect response status code: " + res.statusCode);
            return;
        }

        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].created_at);
            console.log(tweets[i].text);
            console.log();
        }
    });
}

function spotifyThis(searchTerm) {
    // Defaults search to 'The Sign' if user didn't enter in a search term
    if (!searchTerm) searchTerm = 'The Sign'

    spotify.search({ type: 'track', query: searchTerm }, function (err, data) {
        console.log('=========================');
        console.log('Running spotify-this-song');
        console.log('=========================');
        if (err) throw new Error(JSON.stringify(err));
        var songData = data.tracks.items[0];
        console.log("Artist(s): " + songData.artists[0].name);
        console.log("Album: " + songData.album.name);
        console.log("Song Title: " + songData.name);
        console.log("Link: " + songData.external_urls.spotify);
    });
}

function movieThis(searchTerm) {
    // Defaults search to 'Mr. Nobody' if user didn't enter in a search term
    if (!searchTerm) searchTerm = 'Mr. Nobody'

    var apiKey = '918eefff'; // PLEASE GOD MAKE THIS A SECRET
    var queryURL = 'http://www.omdbapi.com/?t=' + searchTerm + '&apikey=' + apiKey;
    request(queryURL, function (err, res, body) {
        console.log('==================');
        console.log('Running movie-this');
        console.log('==================');
        var data = JSON.parse(body);
        console.log('Title: ' + data.Title);
        console.log('Year: ' + data.Year);
        console.log('IMDB Rating: ' + data.Ratings[0].Value);
        console.log('RT Rating: ' + data.Ratings[0].Value);
        console.log('Produced: ' + data.Country);
        console.log('Language: ' + data.Language);
        console.log('Plot: ' + data.Plot);
        console.log('Actors: ' + data.Actors);
    })
}

function doWhatItSays() {
    var functionStream = fs.readFile('./random.txt', 'utf8', function (err, data) {
        if (err) throw new Error(JSON.stringify(err));
        console.log('=======================');
        console.log('Running do-what-it-says');
        console.log('=======================');
        commandArr = data.split('\r\n');
        commandArr.forEach(function (ele) {
            var testArr = ele.split(',');
            var command = testArr[0];
            var arg = testArr[1];
            runCommand(command, arg);
        })
    });
}

// This is the "Main Method...?"
var command = process.argv[2];
var arguements = process.argv[3]; // Make this better later please ok
runCommand(command, arguements);