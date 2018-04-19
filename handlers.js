const dynamoFunctions = require('./dynamoDB');
const message = require('./messages');
const training_data = require('./training_data');

const params = {
    TableName: 'handler_states',
    Key:{ "handler_states_id": '0' }
};

module.exports = {
    'LaunchRequest': function () {
        var speechOutput = message.LAUNCH_MESSAGE;
        const repromptOutput = message.LAUNCH_MESSAGE_REPROMPT;

        speechOutput = speechOutput;

        this.response.cardRenderer(message.SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(repromptOutput);
        this.emit(':responseReady');
    },
    'ExerciseIntent': function () {
        var bodypartExercisesJSON = training_data.BODYPART_EXERCISES;
        dynamoFunctions.readDynamoItem(params, myResult=>{
            console.log("DynamoDB>>>>>>>>>>>>>>>>>>>>>>"+ myResult);
        });

        if (this.event.request.dialogState == "STARTED" || this.event.request.dialogState == "IN_PROGRESS"){
            this.context.succeed({
                "response": {
                    "directives": [
                        {
                            "type": "Dialog.Delegate"
                        }
                    ],
                    "shouldEndSession": false
                },
                "sessionAttributes": {}
            });
        } else {
            
            var bodypart = this.event.request.intent.slots.bodypart.value.toLowerCase();
            var exercArr = [];
            console.log("Bodypart >>>>>>>>>>>>>>>>>>>>> " + bodypart);

            console.log("Create exercArr >>>>>>>>>>>>>>>>>>>>>");
            //get keys/bodyparts out of JSON
            if (bodypartExercisesJSON[bodypart]) {
                console.log("Create exercArr >>>>>>>>>>>>>>>>>>>>>");
                for(var k in bodypartExercisesJSON[bodypart]) {
                    exercArr.push(k);
                    console.log("KEYS exercArr >>>>>>>>>>>>>>>>>>>>>" + k);
                }
            }

            const uebungIndex = Math.floor(Math.random() * exercArr.length);
            const randomExercise = exercArr[uebungIndex];
            
            console.log("GET EXERCISE OUT OF JSON >>>>>>>>>>>>>>>>>>>>>" + bodypartExercisesJSON[bodypart][randomExercise]);

            if (bodypartExercisesJSON[bodypart][randomExercise] != undefined) {
                console.log("Bodypart EXISTS and is going to be outputed");

                const speechOutput = "Dein Training ist "+bodypartExercisesJSON[bodypart][randomExercise].PrintName+". Wiederhole diese "+bodypartExercisesJSON[bodypart][randomExercise].Repetitions;
                this.response.cardRenderer(this.t('SKILL_NAME'), speechOutput.toString());
                this.response.speak(speechOutput);
                this.emit(':responseReady');
            } else {
                console.log("Something went wrong. Bodypart does not exist?");

                this.event.request.dialogState = "IN_PROGRESS";
                this.context.succeed({
                    "response": {
                        "directives": [
                            {
                                "type": "Dialog.Delegate"
                            }
                        ],
                        "shouldEndSession": false
                    },
                    "sessionAttributes": {}
                });
            }
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
