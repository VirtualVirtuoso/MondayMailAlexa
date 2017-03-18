// The aim of this file is to scrape the Monday Mail into a consistent data structure, which can then be read by
// the rest of the system. Usually, an RSS feed would be a consistent way, however we don't have that option. Hence
// we need to crawl over the website, and figure out which parts are useful to us
var scraperjs = require('scraperjs');

var SCRAPE_URL = "http://studentnet.cs.manchester.ac.uk/ugt/mondaymail/";
var INTRO_END = "Your essential links:";

var content = [];

// Module exports is a function of Node.js which allows us to call JavaScript functions from other files. In plain old
// JavaScript, this would usually be achieved by the order in which you declare your script tags in the HTML, but in
// Node.js, there is no HTML file (we're writing a backend script!)
module.exports =

    // Connect to the website hosting the Monday Mail, and grab an array of the messages we want Alexa to be able to
    // talk about.  This approach is very brittle. If you know a better way, send me a pull request!
    scraperjs.StaticScraper.create(SCRAPE_URL)
        .scrape(function($) {
            return $("#issueBody").first().contents().first().each(function() {
                content.push($(this).text().split("\n"));
            });
        }).then(function(){
            content = content[0];
            content = content.filter(String); // Remove empty lines God knows how this works
            var indexToRemoveTo = content.findIndex(containsEssentialLinks);
            content.splice(0, indexToRemoveTo + 1); // Remove Toby's Initial Message
            content.forEach(function(element, index, theArray){
                theArray[index] = removeDegreeTypes(theArray[index]);
            });
            return content;
        });


// Since we're trying to isolate the story topics, we need to identify the end of Toby's introduction
function containsEssentialLinks(element){
    return element.includes(INTRO_END);
}

// The degree classifications don't vocalise well, hence we remove them from the spoken messages
function removeDegreeTypes(unsanitisedString){
    return unsanitisedString.replace(/ *\([^)]*\) */g, " ");
}
