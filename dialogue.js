const validation = require('./validation');

module.exports = {
    delegateSlotCollection(){
      console.log("in delegateSlotCollection");
      console.log("current dialogState: "+this.event.request.dialogState);
        if (this.event.request.dialogState === "STARTED") {
            console.log(JSON.stringify(this.event.request) + 'THIS REQUEST IN BEGINNING'); //{"type":"IntentRequest","requestId":"amzn1.echo-api.request.3de85e9e-bc4c-42cb-b54e-bd083e6f468d","timestamp":"2018-06-13T13:11:29Z","locale":"de-DE","intent":{"name":"ExerciseIntent","confirmationStatus":"NONE","slots":{"bodypart":{"name":"bodypart","value":"bauch","resolutions":{"resolutionsPerAuthority":[{"authority":"amzn1.er-authority.echo-sdk.amzn1.ask.skill.019fe2b6-9106-4534-b9a9-88de88959209.bodypartSlot","status":{"code":"ER_SUCCESS_MATCH"},"values":[{"value":{"name":"Bauch","id":"bauch"}}]}]},"confirmationStatus":"NONE"},"trainieren":{"name":"trainieren","confirmationStatus":"NONE"}}},"dialogState":"STARTED"}
            
            if (validation.isSlotValid(this.event.request, 'bodypart')){
                
                console.log('ENTERED SLOT IS VALID');
                var updatedIntent=this.event.request.intent;
                this.emit(":delegate", updatedIntent);

            } else {
                console.log('ENTERED SLOT IS NOT VALID');
                  console.log("...in Beginning");
                  var updatedIntent=this.event.request.intent;
                  console.log('UPDATED INTENT DIALOGUE STARTED:'+JSON.stringify(updatedIntent)); //{"name":"ExerciseIntent","confirmationStatus":"NONE","slots":{"bodypart":{"name":"bodypart","value":"bauch","resolutions":{"resolutionsPerAuthority":[{"authority":"amzn1.er-authority.echo-sdk.amzn1.ask.skill.019fe2b6-9106-4534-b9a9-88de88959209.bodypartSlot","status":{"code":"ER_SUCCESS_MATCH"},"values":[{"value":{"name":"Bauch","id":"bauch"}}]}]},"confirmationStatus":"NONE"},"trainieren":{"name":"trainieren","confirmationStatus":"NONE"}}}
                  //optionally pre-fill slots: update the intent object with slot values for which
                  //you have defaults, then return Dialog.Delegate with this updated intent
                  // in the updatedIntent property
                  this.emit(":delegate", updatedIntent);

            }
            
        }  else if (this.event.request.dialogState !== "COMPLETED") {

          console.log("...in not completed");
            var updatedIntent=this.event.request.intent;
          console.log('UPDATED INTENT DIALOGUE IN' + this.event.request.dialogState + ' : '+ JSON.stringify(updatedIntent));

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
}
