    /* eslint-disable  func-names */
    /* eslint quote-props: ["error", "consistent"]*/

    'use strict';
    const Alexa = require('alexa-sdk');
    const APP_ID = 'amzn1.ask.skill.019fe2b6-9106-4534-b9a9-88de88959209';
    const newSessionHandler = require('./newSessionHandler');
    const exersiceHandler = Alexa.CreateStateHandler('_EXERSICE',require('./exersiceHandler'));
    const workoutHandler = Alexa.CreateStateHandler('_WORKOUT', require('./workoutHandler')); 
    const evaluationHandler = Alexa.CreateStateHandler('_EVALUATION', require('./evaluationHandler'));

    exports.handler = function (event, context, callback) {
        const alexa = Alexa.handler(event, context, callback);
        alexa.appId = APP_ID;
        alexa.registerHandlers(newSessionHandler, exersiceHandler, workoutHandler, evaluationHandler);
        alexa.execute();
    };
