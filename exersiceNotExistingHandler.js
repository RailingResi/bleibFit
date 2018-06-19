const dynamoFunctions = require('./dynamoDB');
const message = require('./messages');
const dialogue = require('./dialogue');
const validation = require('./validation');
const training_data = require('./training_data');
const bodypartExercises = training_data.BODYPART_EXERCISES;


module.exports = {
    'ExerciseIntent': function () {
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
            //the actual state defines userLevel and the first exercise in the array
            levelState = Item.user_level;
            var nextLevel = (parseInt(levelState) + 1).toString();
          
            if (Item.bodypart && Item.bodyExe) {
                
                bodypartValid = Item.bodypart;
                exercArr = Item.bodyExe;
                //get level state out of dynamo db, is 0 in the first round

                //set next level value if there are still rounds to do
                if (nextLevel < exercArr.length) {
                    var params = {
                      TableName : 'fitnessappDB',
                         Item: {
                            userId: Item.userId,
                            sessionId: Item.sessionId,
                            user_level: nextLevel
                          }
                    };

                    dynamoFunctions.putDynamoItem(params, data=>{
                        console.log(JSON.stringify(data));
                    });
                }

            } else {
                //collected slot values for the dialogue
                filledSlots = dialogue.delegateSlotCollection.call(this);
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
                            bodypart: bodypartValid,
                            bodyExe: exercArr,
                            user_level: nextLevel
                          }
                    };

                    dynamoFunctions.putDynamoItem(params, data=>{
                        console.log(JSON.stringify(data));
                    });

                } else {
                    this.response.cardRenderer(message.SKILL_NAME, this.event.request.intent.slots.bodypart.value + 'Dieser Körperteil existiert nicht. Versuche es nocheinmal. Welchen Körperteil möchtest du trainieren?');
                    this.response.speak('Dieser Körperteil existiert nicht. Versuche es nocheinmal. Welchen Körperteil möchtest du trainieren?').listen('Welchen Körperteil möchtest du trainieren?');
                    this.handler.state = '_NOTEXISTING';
                    this.emit(':responseReady');
                }
            }

            userLevel = levelState;
            arrayIdx = levelState;
            //after finishing this level user gets into a new level this can be safed in the db immediately.has to be done somewhere else. 

            // if choosen bodypart does not exsist the intent starts again. 
            if (bodypartValid) {

                //define rounds the user has to pass, depends on amount of existing exersises
                let lastLevel = exercArr.length - 1; 

                // userLevel = userLevel + 1; here somehow the user level needs to be set new!
                excersiceName = exercArr[arrayIdx];
               
                if (bodypartExercises[bodypartValid][excersiceName] != undefined) {
                    console.log(JSON.stringify(this.attributes) + 'EXERCISE HANDLER ATRIBUTES');

                    if (userLevel <= lastLevel){
                        const speechOutput = "Dein Training ist "+bodypartExercises[bodypartValid][excersiceName].PrintName+". Wiederhole diese "+bodypartExercises[bodypartValid][excersiceName].Repetitions + "Sage Next wenn du fertig bist!";
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

        });
    },
    'Unhandled'() {
        if (this.handler.state) {
            this.response.speak(message.HELP_MESSAGE + 'IN NOT EXISTING HANDLER').listen(message.HELP_MESSAGE);
            // pass to state specific 'Unhandled' handler
            this.emit(':responseReady');
          } else {
            // default 'Unhandled' handling
            this.emit(':ask', message.HELP_MESSAGE, message.HELP_MESSAGE);
          }
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(message.STOP_MESSAGE);
        this.emit(':responseReady');
    }
}
