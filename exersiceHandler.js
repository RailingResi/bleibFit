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
    'ExerciseIntent'() {
        var levelState = '';
        var exercArr = [];
        var arrayIdx;
        var bodypartValid;
        var filledSlots = '';

        var params = {
          TableName : 'fitnessappDB',
          Key: {
            userId: this.event.session.user.userId,
            sessionId: this.event.session.sessionId
          }
        };

        //GET CURRENT STATE OUT OF THE DATABASE
        dynamoFunctions.readDynamoItem(params, Item => {  
            
            filledSlots = dialogue.delegateSlotCollectionBodypart.call(this);
            //does the bodypart value exsist in my training_data.js
            bodypartValid = validation.isSlotValid(this.event.request, "bodypart");

            if (filledSlots && bodypartValid) {
                
                if (bodypartExercises[bodypartValid]) {
                    //create array with all existing excersices for the bodypart
                    for(var k in bodypartExercises[bodypartValid]) {
                        exercArr.push(k);
                    }
                }

                var params = {
                  TableName : 'fitnessappDB',
                     Item: {
                        userId: Item.userId,
                        sessionId: Item.sessionId,
                        user_level: 0,
                        bodypart: bodypartValid,
                        bodyExe: exercArr
                      }
                };

                dynamoFunctions.putDynamoItem(params, data=>{
                    console.log(JSON.stringify(data));
                });

            } else {
                this.response.cardRenderer(message.SKILL_NAME, this.event.request.intent.slots.bodypart.value + 'Dieser Körperteil existiert nicht. Versuche es nocheinmal. Welchen Körperteil möchtest du trainieren?');
                this.response.speak('Dieser Körperteil existiert nicht. Versuche es nocheinmal. Welchen Körperteil möchtest du trainieren?').listen('Welchen Körperteil möchtest du trainieren?');
                this.emit(':responseReady');
            }

            //after finishing this level user gets into a new level this can be safed in the db immediately.has to be done somewhere else. 

            // if choosen bodypart does not exsist the intent starts again. 
            if (bodypartValid) {

                var speechOutput = "Gute Wahl! Du hast dich für ein "+ bodypartValid +" Training entschieden. ";
                speechOutput = speechOutput +  "Es warten "+ exercArr.length +" Übungen auf dich! ";

                for ( name in exercArr ){
                    speechOutput = speechOutput + exercArr[name] + '. ';
                }

                speechOutput = speechOutput +  "Wenn du bereit bist das Workout zu starten sage: 'Workout Starten'";
                const nextPrompt = "Sage  'Workout Starten' wenn du bereit bist.";
                this.response.cardRenderer(this.t('SKILL_NAME'), speechOutput.toString());
                this.response.speak(speechOutput).listen(nextPrompt);
                this.handler.state = '_WORKOUT';
                this.emit(':responseReady');
            }
        });
    },
    'AMAZON.RepeatIntent'() {

    },
    'AMAZON.PauseIntent'() {

    },
    'AMAZON.YesIntent'() {

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

