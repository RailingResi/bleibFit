const message = require('./messages');
const dynamoFunctions = require('./dynamoDB');


module.exports = {
    'LaunchRequest'() {
        var speechOutput = message.LAUNCH_MESSAGE;
        const nextPrompt = message.LAUNCH_MESSAGE_REPROMPT;
        var d = new Date();
        d = d.toString();

        var params = {
          TableName : 'fitnessappDB',
          Item: {
            created_at: d,
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
        this.attributes.lastSpeechOutput = speechOutput;
        this.attributes.lastNextPrompt = nextPrompt;

        this.handler.state = '_EXERSICE';
        this.response.cardRenderer(message.SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(nextPrompt);
        this.emit(':responseReady');
    }, 
    'AMAZON.RepeatIntent'() { 
        this.response.speak('Ich sage dir einfach nocheinmal was ich vorher sagte. '+this.attributes.lastSpeechOutput).listen(this.attributes.lastNextPrompt); 
        this.emit(':responseReady'); 
    },
    'Unhandled'() {
        this.emit(':ask', message.HELP_MESSAGE, message.HELP_MESSAGE);
    }
}


