// Alexa is the object which we're given, so we can interact with the Alexa API
var Alexa = require('alexa-sdk');
var WebsiteData = require('./util/scrape');

// Alexa is based around an event system, anything we code is a reaction to a series of events, so we need
// to register everything we code here, so we're able to react to how the user speaks to the system
exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
};

WebsiteData.then(function(result){
    console.log(result);
});


