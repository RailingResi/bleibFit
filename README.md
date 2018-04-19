# Alexa Skill 'fit bleiben'

## Bespoken
Using [Bespoken](https://github.com/bespoken/bst) for Alexa Skill testing. 
Runing Lambda function local. 

> $ bst proxy lambda index.js

Starting lambda fuction local.

## ASK CLI
Ask cli is used to be able to configer the skill local and be able to deploy in to the alexa development console. 

### 1. Install ASK Cli 
[Via Npm](https://www.npmjs.com/package/ask-cli)

Installation creates necessary folder within the intents und utterances to be able to test the skill via Bespoken. 

### 2. Add DynamoDB 

[Adding Dynamo DB](https://github.com/alexa/alexa-cookbook/tree/master/aws/Amazon-DynamoDB/read)

[Adding Dynamo DB](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-document-client.html)

### 3. Installed Phyton to install aws cli FUCK OFF THAT SHIT USE BREW
why is this explained on the docu??????????
I need to create an aws credential file with the aws cli
[Install PHYTON](https://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html#awscli-install-osx-pip)

> brew install awscli

=========

Continue developing
