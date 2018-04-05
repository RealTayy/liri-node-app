var keys = require("./keys.js");
require("dotenv").config();

var Spotify = require('node-spotify-api');

console.log(keys)
var spotify = new Spotify(keys.spotify);

