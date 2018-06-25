const dynamoFunctions = require('./dynamoDB');
const message = require('./messages');
const dialogue = require('./dialogue');
const validation = require('./validation');
const training_data = require('./training_data');
const bodypartExercises = training_data.BODYPART_EXERCISES;
let userLevel;


module.exports = {
    'Unhandled'() {
        if (this.handler.state) {
            // pass to state specific 'Unhandled' handler
            this.emitWithState('Unhandled');
          } else {
            // default 'Unhandled' handling
            this.emit(':ask', message.HELP_MESSAGE, message.HELP_MESSAGE);
          }
    },
    'EvaluationIntent'() {
        
        filledSlots = dialogue.delegateSlotCollection.call(this);

        var evaluateExhaustingValue = this.event.request.intent.slots.evaluateExhausting.value;
        var evaluateTechniqueValue = this.event.request.intent.slots.evaluateTechnique.value;


        if (evaluateTechniqueValue && evaluateExhaustingValue) {
             var params = {
              TableName : 'fitnessappDB',
              Key: {
                userId: this.event.session.user.userId,
                sessionId: this.event.session.sessionId
              }
            };

            dynamoFunctions.readDynamoItem(params, Item => {  
                
                params = {

                  TableName : 'fitnessappDB',
                     Item: {
                        created_at: Item.created_at,
                        userId: Item.userId,
                        sessionId: Item.sessionId,
                        user_level: Item.user_level,
                        bodypart: Item.bodypart,
                        bodyExe: Item.bodyExe,
                        evaluateExhausting: evaluateExhaustingValue,
                        evaluateTechnique: evaluateTechniqueValue
                      }
                  }

                dynamoFunctions.putDynamoItem(params, data=>{
                    this.response.speak('Danke dass du an diesem Experiment teilgenommen hast. Bitte fülle jetzt noch den Fragebogen aus!');
                    this.emit(':responseReady');  
                });
            });
        }
    },
    'AMAZON.HelpIntent'() {
        const speechOutput = message.HELP_MESSAGE;
        const reprompt = message.HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent'() {
        this.response.speak(message.STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent'() {
        this.response.speak(message.STOP_MESSAGE);
        this.emit(':responseReady');
    }
}


