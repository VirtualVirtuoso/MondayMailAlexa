// Alexa is the object which we're given, so we can interact with the Alexa API
var Alexa = require('alexa-sdk');
var WebsiteData = require('./util/scrape');
var APP_ID = require('./exclude/id'); // Replace with your own application ID

var mailMessages;
var alreadyRetrieved = false;
var currentIndex = 0;
var positions = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth",
    "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth",
    "Nineteenth", "Twentieth"];

var languageStrings = {
    "en": {
        "translation": {
            "SKILL_NAME": "The Monday Mail",
            "WELCOME_MESSAGE": "Welcome to Kilburn's Monday Mail. Say start to continue, or help for instructions.",
            "HELP_MESSAGE": "While a message is playing, you can say Alexa Next, Alexa Repeat or Alexa Back to navigate. Say start to continue...",
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "UNHANDLED_MESSAGE": "Sorry, I didn't understand your question. How can I help?",
            "NEXT_INDICATIOR": "Say next to continue...",
            "CANT_GO_BACK": "There isn't a previous entry. What would you like me to do now?",
            "END_OF_MESSAGES": "There are no more messages to read. To continue, say Alexa Restart"
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
    alexa.appId = APP_ID;
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
        currentIndex = 0;
        this.emit(':ask', speechOutput, this.t("HELP_REPROMPT"));
    },
    'AMAZON.NextIntent': function(){
        var thisAlexa = this;
        var articleNumber = positions[currentIndex];

        if(!alreadyRetrieved){
            WebsiteData.then(function (result) {
                alreadyRetrieved = true;
                mailMessages = result;
                var speechOutput = articleNumber + " Entry: " + mailMessages[currentIndex]
                    + " Say next to continue...";
                currentIndex++;
                thisAlexa.emit(':ask', speechOutput, thisAlexa.t("HELP_REPROMPT"));
            });
        } else {
            var speechOutput;
            if(currentIndex < mailMessages.length){
                speechOutput = articleNumber + " Entry: " + mailMessages[currentIndex]
                    + " Say next to continue...";
                currentIndex++;
                thisAlexa.emit(':ask', speechOutput, thisAlexa.t("HELP_REPROMPT"));
            } else {
                speechOutput = thisAlexa.t("END_OF_MESSAGES");
                thisAlexa.emit(':ask', speechOutput, speechOutput);
            }

        }
    },
    'AMAZON.PreviousIntent': function(){
        if(currentIndex == 1 || currentIndex == 0) {
            this.emit(':ask', this.t("CANT_GO_BACK"))
        } else {
            currentIndex -= 2;
            var articleNumber = positions[currentIndex];
            var speechOutput = articleNumber + " Entry: " + mailMessages[currentIndex]
                + " Say next to continue...";
            currentIndex++;
            this.emit(':ask', speechOutput, this.t("HELP_REPROMPT"));
        }
    },
    'AMAZON.StartOverIntent': function(){
        currentIndex = 0;
        var articleNumber = positions[currentIndex];
        var speechOutput = articleNumber + " Entry: " + mailMessages[currentIndex]
            + " Say next to continue...";
        currentIndex++;
        this.emit(':ask', speechOutput, this.t("HELP_REPROMPT"));
    },
    'AMAZON.RepeatIntent': function(){
        currentIndex--;
        var articleNumber = positions[currentIndex];
        var thisAlexa = this;
        if(!alreadyRetrieved){
            WebsiteData.then(function (result) {
                alreadyRetrieved = true;
                mailMessages = result;
                var speechOutput = articleNumber + " Entry: " + mailMessages[currentIndex]
                    + " Say next to continue...";
                currentIndex++;
                thisAlexa.emit(':ask', speechOutput, thisAlexa.t("HELP_REPROMPT"));
            });
        } else {
            var speechOutput = articleNumber + " Entry: " + mailMessages[currentIndex]
                + " Say next to continue...";
            currentIndex++;
            thisAlexa.emit(':ask', speechOutput, thisAlexa.t("HELP_REPROMPT"));
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