const message = require('./messages');

module.exports = {
    'LaunchRequest'() {
        var speechOutput = message.LAUNCH_MESSAGE;
        const repromptOutput = message.LAUNCH_MESSAGE_REPROMPT;
        speechOutput = speechOutput;
        this.handler.state = '_EXERSICE';
        this.response.cardRenderer(message.SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(repromptOutput);
        this.emit(':responseReady');
    }
}


