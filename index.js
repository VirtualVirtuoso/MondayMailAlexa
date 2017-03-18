// Alexa is the object which we're given, so we can interact with the Alexa API
var Alexa = require('alexa-sdk');
var WebsiteData = require('./util/scrape');
var APP_ID = require('./exclude/id'); // Replace with your own application ID

var mailMessages;
var alreadyRetrieved = false;

var languageStrings = {
    "en": {
        "translation": {
            "SKILL_NAME": "The Monday Mail",
            "WELCOME_MESSAGE": "Welcome to Kilburn's Monday Mail. If you need help, just ask!",
            "HELP_MESSAGE": "You can ask me what's new. While a message is playing, you can also ask to skip the message, to go back, or to repeat the message, just like an answer phone! What can I help you with?",
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "UNHANDLED_MESSAGE": "Sorry, I didn't understand your question. How can I help?"
        }
    },
    "de": {
        "translation": {
            "TODO": "Do we have any Germans in Kilburn?"
        }
    }
};

// Alexa is based around an event system, anything we code is a reaction to a series of events, so we need
// to register everything we code here, so we're able to react to how the user speaks to the system
exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function(){
        this.emit('Welcome');
    },
    'Welcome': function(){
        var speechOutput = this.t("WELCOME_MESSAGE");
        this.emit(':tellWithCard', speechOutput, this.t("SKILL_NAME"), speechOutput);
    },
    'OverviewIntent': function(){
        var thisAlexa = this;
        if(!alreadyRetrieved){
            WebsiteData.then(function (result) {
                alreadyRetrieved = true;
                mailMessages = result;
                var speechOutput = mailMessages[0];
                thisAlexa.emit(':tellWithCard', speechOutput, thisAlexa.t("SKILL_NAME"), speechOutput);
            });
        } else {
            var speechOutput = mailMessages[0];
            thisAlexa.emit(':tellWithCard', speechOutput, thisAlexa.t("SKILL_NAME"), speechOutput);
        }
    },
    'AMAZON.HelpIntent': function(){
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function(){
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function(){
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'Unhandled': function(){
        this.emit(':ask', this.t("UNHANDLED_MESSAGE"));
    }
};