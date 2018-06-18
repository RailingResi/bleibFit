const message = require('./messages');
const dynamoFunctions = require('./dynamoDB');


module.exports = {
    'LaunchRequest'() {
        var speechOutput = message.LAUNCH_MESSAGE;
        const repromptOutput = message.LAUNCH_MESSAGE_REPROMPT;

        var params = {
          TableName : 'fitnessappDB',
          Item: {
            userId: this.event.session.user.userId,
            sessionId: this.event.session.sessionId,
            user_level: '0'
          }
        };

         //GET CURRENT STATE OUT OF THE DATABASE
        dynamoFunctions.putDynamoItem(params, data=>{
            console.log(JSON.stringify(data));
        });


        speechOutput = speechOutput;
        this.handler.state = '_EXERSICE';
        this.response.cardRenderer(message.SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(repromptOutput);
        this.emit(':responseReady');
    }, 
    'Unhandled'() {
        if (this.handler.state) {
            // pass to state specific 'Unhandled' handler
            this.emitWithState('Unhandled');
          } else {
            // default 'Unhandled' handling
            this.emit(':ask', message.HELP_MESSAGE, message.HELP_MESSAGE);
          }
    }
}


