    /* eslint-disable  func-names */
    /* eslint quote-props: ["error", "consistent"]*/

    'use strict';
    const Alexa = require('alexa-sdk');
    const APP_ID = 'amzn1.ask.skill.019fe2b6-9106-4534-b9a9-88de88959209';
    const handlers = require('./handlers');
    const exeNotExsitingHandler = require('./exerciseNotExistingHandler');
    const exerciseNotExistingStateHandler = Alexa.CreateStateHandler('_NOTEXISTING', exeNotExsitingHandler)

    exports.handler = function (event, context, callback) {
        const alexa = Alexa.handler(event, context, callback);
        alexa.appId = APP_ID;
        //alexa.dynamoDBTableName = 'handler_states'; // creates new table for session.attributes
        alexa.registerHandlers(handlers, exerciseNotExistingStateHandler);
        alexa.execute();
    };
