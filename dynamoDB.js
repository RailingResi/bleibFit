module.exports = {
    readDynamoItem(params, callback) {

        var AWS = require('aws-sdk');
        AWS.config.update({region: 'eu-west-1'});

        var docClient = new AWS.DynamoDB.DocumentClient();

        console.log('reading item from DynamoDB table');

        docClient.get(params, (err, data) => {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));

                callback(data.Item.handler_state);  // this particular row has an attribute called message

            }
        });

    }
}
