const dynamoFunctions = require('./dynamoDB');
const message = require('./messages');
const training_data = require('./training_data');
const bodypartExercisesJSON = training_data.BODYPART_EXERCISES;


module.exports = {
    'Unhandled': function() {
        this.emit(':ask', HELP_MESSAGE, HELP_MESSAGE);
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
        var params = {
            TableName: 'handler_states',
              Key: {
                'handler_states_id' : '0'
              }
        }
        
        dynamoFunctions.readDynamoItem(params, state=>{
            level_state = state;
        });

        filledSlots = delegateSlotCollection.call(this);
        bodypart_valid = isSlotValid(this.event.request, "bodypart");

        if (filledSlots && bodypart_valid) {
            console.log("Bodypart >>>>>>>>>>>>>>>>>>>>> " + bodypart_valid);

            console.log("Create exercArr >>>>>>>>>>>>>>>>>>>>>");
            //get keys/bodyparts out of JSON

            if (bodypartExercisesJSON[bodypart_valid]) {
                console.log("Create exercArr >>>>>>>>>>>>>>>>>>>>>");
                for(var k in bodypartExercisesJSON[bodypart_valid]) {
                    exercArr.push(k);
                    console.log("KEYS exercArr >>>>>>>>>>>>>>>>>>>>>" + k);
                }
            }

            uebungIndex = Math.floor(Math.random() * exercArr.length);
            randomExercise = exercArr[uebungIndex];
           
            
            console.log("GET EXERCISE OUT OF JSON >>>>>>>>>>>>>>>>>>>>>" + bodypartExercisesJSON[bodypart_valid][randomExercise]);

            if (bodypartExercisesJSON[bodypart_valid][randomExercise] != undefined) {
                console.log("Bodypart EXISTS and is going to be outputed");
                const speechOutput = "Dein Training ist "+bodypartExercisesJSON[bodypart_valid][randomExercise].PrintName+". Wiederhole diese "+bodypartExercisesJSON[bodypart][randomExercise].Repetitions;
                this.response.cardRenderer(this.t('SKILL_NAME'), speechOutput.toString());
                this.response.speak(speechOutput);
                this.emit(':responseReady');
            } 
        }
        else {
            this.emit(":tell", 'Dieser Körperteil existiert nicht.');
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
    },
    'Unhandled': function () {
    this.emit(':ask',message.HELP_MESSAGE, message.HELP_REPROMPT);
    }
}

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      var updatedIntent=this.event.request.intent;
      console.log('UPDATED INTENT:'+JSON.stringify(updatedIntent));
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      this.emit(":delegate");
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}

function isSlotValid(request, slotName){
        var slot = false;
        var slotValue;
        console.log('REQUEST IN ISSLOTVALIE: '+JSON.stringify(request))
        // request = {"type":"IntentRequest","requestId":"amzn1.echo-api.request.29d6d341-a75e-4c55-878d-af35d160fb27","timestamp":"2018-06-12T10:38:51Z","locale":"de-DE","intent":{"name":"ExerciseIntent","confirmationStatus":"NONE","slots":{"bodypart":{"name":"bodypart","value":"trainieren","resolutions":{"resolutionsPerAuthority":[{"authority":"amzn1.er-authority.echo-sdk.amzn1.ask.skill.019fe2b6-9106-4534-b9a9-88de88959209.bodypartSlot","status":{"code":"ER_SUCCESS_NO_MATCH"}}]},"confirmationStatus":"CONFIRMED"},"trainieren":{"name":"trainieren","confirmationStatus":"NONE"}}},"dialogState":"COMPLETED"}
        var request_value = request.intent['slots'][slotName].value

        if (bodypartExercisesJSON[request_value] != undefined) {
            slot = bodypartExercisesJSON[request_value]
        }

        // var slot = request.intent.slots[slotName];
        // console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        
 
        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}
