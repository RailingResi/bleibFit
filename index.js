    /* eslint-disable  func-names */
    /* eslint quote-props: ["error", "consistent"]*/

    'use strict';
    const Alexa = require('alexa-sdk');
    const APP_ID = 'amzn1.ask.skill.019fe2b6-9106-4534-b9a9-88de88959209';

    const SKILL_NAME = 'bleibFit';
    const GET_EXERC = "Hier ist deine Übung: ";
    const HELP_MESSAGE = 'Du kannst zum Beispiel Beine trainieren sagen, oder stop um aufzuhören... Was möchtest du machen?';
    const HELP_REPROMPT = 'Wie kann ich dir helfen?';
    const STOP_MESSAGE = 'Servus Pfiadi!';
    const LAUNCH_MESSAGE = 'Servus und Grüß euch zu fit bleiben. Theresa und ich machen heute mir dir einen Fitness Test. Danach darfst du dir ein Bier holen. Alles klar?';
    const LAUNCH_MESSAGE_REPROMPT = 'Sage mir einfach welchen Körperteil du trainieren möchtest';
    const ERROR_MESSAGE = 'Es ist etwas schief gelaufen';

    const training_data = {
        BODYPART_EXERCISES: {
            "rücken": {
                "Unterarmstütz": {
                    "PrintName": "Rückentraining: Unterarmstütz",
                    "Repetitions": "30 Sekunden lang. Los gehts 1 <break time='4s'/> 5 <break time='4s'/> 10 <break time='4s'/> 15 <break time='4s'/> 20 <break time='4s'/> 25 <break time='4s'/> 30 <say-as interpret-as='interjection'>Training geschafft!</say-as>",
                    "Desctription": "Der Körper bildet vom Kopf bis zu den Fersen eine gerade Linie. Die Ellbogen befinden sich unterhalb der Schultern, die Füße sind geschlossen, und der Blick geht nach unten, lasse die Hüfte nicht nach Untensacken!"
                },
                "Seitstütz": {
                    "PrintName": "Rückentraining: Seitstütz",
                    "Repetitions": "30 Sekunden lang. Los gehts 1 <break time='4s'/> 5 <break time='4s'/> 10 <break time='4s'/> 15 <break time='4s'/> 20 <break time='4s'/> 25 <break time='4s'/> 30 <say-as interpret-as='interjection'>Training geschafft!</say-as>",
                    "Desctription": "Der Körper, in rechter oder linker Seitenlage, bildet vom Kopf bis zu den Füßen eine gerade Linie. Der Ellbogen befindet sich unterhalb der Schulter, die Füße sind geschlossen, und der Kopf ist eine Wirbelsäulenverlängerung, lasse die Hüfte nicht nach Untensacken!"
                },
                "Beckenheben": {
                    "PrintName": "Rückenübung: Beckenheben mit Beinheben",
                    "Repetitions": "30 Sekunden lang. Los gehts 1 <break time='4s'/> 5 <break time='4s'/> 10 <break time='4s'/> 15 <break time='4s'/> 20 <break time='4s'/> 25 <break time='4s'/> 30 <say-as interpret-as='interjection'>Training geschafft!</say-as>",
                    "Desctription": "Dein Körper ist in Rückenlage, Beine angewinkelt. Lege deine Arme neben deinen Körper ab. Hebe dein Becken nach oben, sodass Oberkörper, Becken und Oberschenkel eine gerade Linie bilden. Halte diese Position kurz und senke dein Becken wieder."
                }
            },
            "arm" : {
                "Liegestütz": {
                    "PrintName": "Armtraining: Liegestütz",
                    "Repetitions": "10 mal",
                    "Desctription": "Der Körper ist in Bauchlage. Der Blick auf den Boden gerichtet. Drücke deinen Oberkörper und deine Beine mit deinen Armen vom Boden weg. Schultern, Rücken, Hintern und Beine bilden eine gerade Linie. Langsam wieder senken."
                },
                "Dips mit einem Stuhl": {
                    "PrintName": "Armtraining: Dips mit einem Stuhl",
                    "Repetitions": "10 mal",
                    "Desctription": "Nimm einen Stuhl. Setzt dich an seine Kante. Greife mit Beiden Händen links und rechts die Kante. Strecke eine Beine aus und stütze diese auf den Fersen. Nun hebe und senke dein Gesäß mit Hilfe deiner Arme."
                } 
            },
            "hintern" : {
                "Kniebeugen": {
                    "PrintName": "Potraining: Kniebeugen",
                    "Repetitions": "10 mal",
                    "Desctription": "Schulterbreiter Stand. Arme nach vore ausstrecken. Beine 90 Grad anwinkeln indem du dein Gesäß senkst. Kniee und Zehenspitzen bilden eine vertikale gerade Linie. Mit geradem Rücken wieder nach oben drücken."
                },
                "Ausfallschritte": {
                    "PrintName": "Potraining: Ausfallschritte",
                    "Repetitions": "10 mal",
                    "Desctription": "Mache mit einem Bein einen weiten Schritt nach vorne. Mache diesen so weit nach vorne, dass deine Unter- und Oberschenkel einen Winkel von 90 Grad nicht unterschreiten und deine Knie nicht über deine Fußspitzen hinausragen. Kontrolliere, dass deine Knie in die gleiche Richtung wie deine Fußspitzen zeigen. Anschließend drückst dich gleichzeitig wieder mit der Ferse des vorderen Fußes nach hinten ab, um in die Ausgangsposition zurückzugelangen."
                } 
            },
            "bauch" : {
                "Bauchpressen": {
                    "PrintName": "Bauchtraining: Bauchpressen",
                    "Repetitions": "10 mal",
                    "Desctription": "Der Körper ist in Bauchlage. Der Blick auf den Boden gerichtet. Drücke deinen Oberkörper und deine Beine mit deinen Armen vom Boden weg. Schultern, Rücken, Hintern und Beine bilden eine gerade Linie. Langsam wieder senken."
                },
                "Beine anheben": {
                    "PrintName": "Bauchtraining: Beine anheben",
                    "Repetitions": "10 mal",
                    "Desctription": "Liege dich auf den Rücken und deine Arme flach neben deinen Oberkörper. Spannen deinen Bauch an und hebe deine ausgestreckten Beine bis sie 90 Grad zu deinem Oberkörper stehen. Senke sie danach langsam wieder mit angespannten Bauch."
                } 
            },
            "beine" : {
                "Kniebeugen": {
                    "PrintName": "Potraining: Kniebeugen",
                    "Repetitions": "10 mal",
                    "Desctription": "Schulterbreiter Stand. Arme nach vore ausstrecken. Beine 90 Grad anwinkeln indem du dein Gesäß senkst. Kniee und Zehenspitzen bilden eine vertikale gerade Linie. Mit geradem Rücken wieder nach oben drücken."
                }
            }
        }
    }
                 

    const handlers = {
        'LaunchRequest': function () {
            var speechOutput = LAUNCH_MESSAGE;
            const repromptOutput = LAUNCH_MESSAGE_REPROMPT;

            speechOutput = speechOutput.toString()

            this.response.cardRenderer(SKILL_NAME, speechOutput);
            this.response.speak(speechOutput).listen(repromptOutput);
            this.emit(':responseReady');
        },
        'ExerciseIntent': function () {
            var bodypartExercisesJSON = training_data.BODYPART_EXERCISES;
            console.log("*************************MY LOGS: **************************")

            console.log("Request >>>>>>>>>>>>>>>>>>>>> " + this.event.request);
            console.log("Slots >>>>>>>>>>>>>>>>>>>>>>>"+this.event.request.intent.slots);
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
            const speechOutput = HELP_MESSAGE;
            const reprompt = HELP_REPROMPT;

            this.response.speak(speechOutput).listen(reprompt);
            this.emit(':responseReady');
        },
        'AMAZON.CancelIntent': function () {
            this.response.speak(STOP_MESSAGE);
            this.emit(':responseReady');
        },
        'AMAZON.StopIntent': function () {
            this.response.speak(STOP_MESSAGE);
            this.emit(':responseReady');
        },
        'Unhandled': function () {
        this.emit(':ask',HELP_MESSAGE, HELP_REPROMPT);
        }
    };

    exports.handler = function (event, context, callback) {
        const alexa = Alexa.handler(event, context, callback);
        alexa.APP_ID = APP_ID;
        alexa.registerHandlers(handlers);
        alexa.execute();
    };
