const dynamoFunctions = require('./dynamoDB');
const message = require('./messages');
const dialogue = require('./dialogue');
const validation = require('./validation');
const training_data = require('./training_data');
const bodypartExercises = training_data.BODYPART_EXERCISES;
let userLevel;


module.exports = {
    'Unhandled'() {
        this.emit(':ask', message.HELP_MESSAGE, message.HELP_MESSAGE);
    },
    'WorkoutIntent'() {
        
        var bodypartValid;
        var excersiceName;
        var levelState;
        var lastLevel;
        var exercArr;

        console.log('In workout intent');

        var params = {
          TableName : 'fitnessappDB',
          Key: {
            userId: this.event.session.user.userId,
            sessionId: this.event.session.sessionId
          }
        };

        //GET CURRENT STATE OUT OF THE DATABASE
        dynamoFunctions.readDynamoItem(params, Item=>{  
            //the actual state defines userLevel and the first exercise in the array
            
            // var nextLevel = (parseInt(levelState) + 1).toString();
          
            console.log(typeof(Item.bodypart)+' : '+Item.bodypart+' '+typeof(Item.bodyExe)+': '+Item.bodyExe);
                
            bodypartValid = Item.bodypart;
            levelState = Item.user_level;
            exercArr = Item.bodyExe;

            userLevel = levelState;
            nextLevel = levelState + 1;
            lastLevel = exercArr.length - 1; 
            excersiceName = exercArr[userLevel];

            console.log( exercArr.length + 'LENGHT OF ARRAY');  
            console.log( userLevel + 'USER LEVEL');
            console.log( lastLevel + 'Last LEVEL');

            if (userLevel <= lastLevel) {
                var params = {
                  TableName : 'fitnessappDB',
                     Item: {
                        created_at: Item.created_at,
                        userId: Item.userId,
                        sessionId: Item.sessionId,
                        user_level: nextLevel,
                        bodypart: bodypartValid,
                        bodyExe: exercArr
                      }
                };

                dynamoFunctions.putDynamoItem(params, data=>{
                    console.log(JSON.stringify(data));
                });
            }

            if (userLevel < lastLevel) {
                var speechOutput = "Bei der " + nextLevel + ". Übung machen wir " + bodypartExercises[bodypartValid][excersiceName].PrintName+"! Wiederhole sie "+bodypartExercises[bodypartValid][excersiceName].Repetitions + ". Bei dieser Übung ist ";
                speechOutput = speechOutput + bodypartExercises[bodypartValid][excersiceName].Desctription + '. Sage nächste Übung, wenn du fertig bist!';
                const nextPrompt = "Sage nächste Übung wenn du fertig bist!";

                this.attributes.lastSpeechOutput = speechOutput;
                this.attributes.lastNextPrompt = nextPrompt;
                this.response.cardRenderer(this.t('SKILL_NAME'), speechOutput.toString());
                this.response.speak(speechOutput).listen(nextPrompt);     
            } else {
                var speechOutput = "Super! Du bist schon sehr weit gekommen. Die " + nextLevel + ". und letzte Übung schaffst du jetzt auch noch. Bei dieser Übung machen wir " + bodypartExercises[bodypartValid][excersiceName].PrintName+"! Wiederhole sie "+bodypartExercises[bodypartValid][excersiceName].Repetitions + ". Bei dieser Übung ist ";
                speechOutput = speechOutput + bodypartExercises[bodypartValid][excersiceName].Desctription + '. Sage Evaluierung, wenn du fertig bist, um deine Trainingsleistung zu bewerten!';                
                const nextPrompt = "Sage Evaluierung, um deine Trainingsleistung zu bewerten!";

                this.attributes.lastSpeechOutput = speechOutput;
                this.attributes.lastNextPrompt = nextPrompt;
                this.handler.state = "_EVALUATION";
                this.response.cardRenderer(this.t('SKILL_NAME'), speechOutput.toString());
                this.response.speak(speechOutput).listen(nextPrompt);
            } 
            this.emit(':responseReady');

        });
    },
    'AMAZON.RepeatIntent'() { 
        this.response.speak('Ich sage dir einfach nocheinmal was ich vorher sagte. '+this.attributes.lastSpeechOutput).listen(this.attributes.lastNextPrompt); 
        this.emit(':responseReady'); 
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


