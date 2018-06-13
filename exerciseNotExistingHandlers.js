const dynamoFunctions = require('./dynamoDB');
const message = require('./messages');
const dialogue = require('./dialogue');
const validation = require('./validation');
const training_data = require('./training_data');
const bodypartExercisesJSON = training_data.BODYPART_EXERCISES;


module.exports = {
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
            filledSlots = dialogue.delegateSlotCollection.call(this);
            this.emit(":delegate", 'Dieser Körperteil existiert nicht. Versuche es nocheinmal.');
        }
    }
}
