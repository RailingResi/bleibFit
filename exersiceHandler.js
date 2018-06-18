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
        dynamoFunctions.readDynamoItem(params, Item=>{
            //get level state out of dynamo db, is 0 in the first round
            levelState = Item.user_level; 
            console.log(levelState + 'LEVEL STATE');

            //the actual state defines userLevel and the first exercise in the array
            userLevel = levelState;
            arrayIdx = levelState;

            //after finishing this level user gets into a new level this can be safed in the db immediately.has to be done somewhere else. 
        });

        //collected slot values for the dialogue
        filledSlots = dialogue.delegateSlotCollection.call(this);
        //does the bodypart value exsist in my training_data.js
        bodypartValid = validation.isSlotValid(this.event.request, "bodypart");

        // if choosen bodypart does not exsist the intent starts again. 
        if (filledSlots && bodypartValid) {
            if (bodypartExercises[bodypartValid]) {
                //create array with all existing excersices for the bodypart
                for(var k in bodypartExercises[bodypartValid]) {
                    exercArr.push(k);
                }
            }

            //define rounds the user has to pass, depends on amount of existing exersises
            let lastLevel = exercArr.length - 1; 

            // userLevel = userLevel + 1; here somehow the user level needs to be set new!
            excersiceName = exercArr[arrayIdx];
           
            if (bodypartExercises[bodypartValid][excersiceName] != undefined) {
                console.log(JSON.stringify(this.attributes) + 'EXERCISE HANDLER ATRIBUTES');

                if (userLevel <= lastLevel){
                    const speechOutput = "Dein Training ist "+bodypartExercises[bodypartValid][excersiceName].PrintName+". Wiederhole diese "+bodypartExercises[bodypartValid][excersiceName].Repetitions;
                    const nextPrompt = "Sage Next wenn du fertig bist!";
                    this.response.cardRenderer(this.t('SKILL_NAME'), speechOutput.toString());
                    this.response.speak(speechOutput).listen(nextPrompt);     
                } else {
                    const speechOutput = "Du hast dein Training geschafft";
                    const nextPrompt = "Sage Evaluierung, um das Training zu bewerten!";
                    this.response.cardRenderer(this.t('SKILL_NAME'), speechOutput.toString());
                    this.response.speak(speechOutput);     

                }
                this.handler.state = '_EXISTING';
                this.emit(':responseReady');
            } 
        }
        else {
            this.response.cardRenderer(message.SKILL_NAME, this.event.request.intent.slots.bodypart.value + 'Dieser Körperteil existiert nicht. Versuche es nocheinmal. Welchen Körperteil möchtest du trainieren?');
            this.response.speak('Dieser Körperteil existiert nicht. Versuche es nocheinmal. Welchen Körperteil möchtest du trainieren?').listen('Welchen Körperteil möchtest du trainieren?');
            this.handler.state = '_EXISTING';
            this.emit(':responseReady');
        }
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


