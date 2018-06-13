const dynamoFunctions = require('./dynamoDB');
const message = require('./messages');
const dialogue = require('./dialogue');
const validation = require('./validation');
const training_data = require('./training_data');
const bodypartExercisesJSON = training_data.BODYPART_EXERCISES;


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
    'LaunchRequest': function () {
        var speechOutput = message.LAUNCH_MESSAGE;
        const repromptOutput = message.LAUNCH_MESSAGE_REPROMPT;
        speechOutput = speechOutput;

        this.response.cardRenderer(message.SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(repromptOutput);
        this.emit(':responseReady');
    },
    'ExerciseIntent': function () {
        var uebungIndex = '';
        var randomExercise = '';
        var level_state = '';
        var exercArr = [];
        var bodypart_valid;
        var filledSlots = '';
        var handler_state;
        var params = {
            TableName: 'handler_states',
              Key: {
                'handler_states_id' : '0'
              }
        }
        
        // dynamoFunctions.readDynamoItem(params, state=>{
        //     level_state = state;
        // });

        filledSlots = dialogue.delegateSlotCollection.call(this);
        bodypart_valid = validation.isSlotValid(this.event.request, "bodypart");

        console.log('FILLED SLOTS'+ JSON.stringify(filledSlots));
        if (filledSlots && bodypart_valid) {
            if (bodypartExercisesJSON[bodypart_valid]) {
                //create array with all existing excersices for the bodypart
                for(var k in bodypartExercisesJSON[bodypart_valid]) {
                    exercArr.push(k);
                }
            }

        // if (this.handler.state == ''){
        //     this.handler.state = exercArr.length; 
        // }

         // console.log('this handler stat' + this.handler.state);


        exercArrIdx = 1;

            //create random index
            //uebungIndex = Math.floor(Math.random() * exercArr.length);
            //randomExercise = exercArr[uebungIndex];


            excersiceName = exercArr[exercArrIdx];
           
            
            console.log("GET EXERCISE OUT OF JSON >>>>>>>>>>>>>>>>>>>>>" + JSON.stringify(bodypartExercisesJSON[bodypart_valid][excersiceName]));

            if (bodypartExercisesJSON[bodypart_valid][excersiceName] != undefined) {
                console.log("Bodypart EXISTS and is going to be outputed");
                const speechOutput = "Dein Training ist "+bodypartExercisesJSON[bodypart_valid][excersiceName].PrintName+". Wiederhole diese "+bodypartExercisesJSON[bodypart_valid][excersiceName].Repetitions;
                this.response.cardRenderer(this.t('SKILL_NAME'), speechOutput.toString());
                this.response.speak(speechOutput);
                this.handler.state = this.handler.state -1;
                this.emit(':responseReady');
            } 
        }
        else {
            this.handler.state = '_NOTEXISTING';
            this.response.speak('Dieser Körperteil existiert nicht. Versuche es nocheinmal.').listen('Welchen Körperteil möchtest du trainieren?');
            this.emitWithState(':responseReady');
        }
    },
    'AMAZON.RepeatIntent': function () {

    },
    'AMAZON.PauseIntent': function () {

    },
    'AMAZON.YesIntent': function () {

    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = message.HELP_MESSAGE;
        const reprompt = message.HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(message.STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(message.STOP_MESSAGE);
        this.emit(':responseReady');
    }

}


