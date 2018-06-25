const validation = require('./validation');

module.exports = {
  delegateSlotCollection() {

    if (this.event.request.dialogState === "STARTED") {            
      console.log('THIS REQUEST (dialogue started): '+ JSON.stringify(this.event.request));
      var updatedIntent=this.event.request.intent;
      this.emit(":delegate", updatedIntent);
        
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log('THIS REQUEST (dialogue not COMPLETED): '+ JSON.stringify(this.event.request));

      this.emit(":delegate");

    } else {
      console.log('THIS REQUEST (dialogue COMPLETED): '+ JSON.stringify(this.event.request));
      return this.event.request;
      
    }
  }
}
