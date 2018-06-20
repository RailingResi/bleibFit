const validation = require('./validation');

module.exports = {
  delegateSlotCollectionBodypart() {
    if (this.event.request.dialogState === "STARTED") {            

      var updatedIntent=this.event.request.intent;
      this.emit(":delegate", updatedIntent);
        
    } else if (this.event.request.dialogState !== "COMPLETED") {

      this.emit(":delegate");

    } else {

      return this.event.request.intent;
      
    }
  }, 
  delegateSlotCollectionEvaluation() {
    if (this.event.request.dialogState === "STARTED") {            
        if (validation.isSlotValid(this.event.request, 'bodypart')) {

            var updatedIntent=this.event.request.intent;
            this.emit(":delegate", updatedIntent);

        } else {
              var updatedIntent=this.event.request.intent;
              this.emit(":delegate", updatedIntent);

        }
        
    } else if (this.event.request.dialogState !== "COMPLETED") {

        var updatedIntent=this.event.request.intent;
        this.emit(":delegate");

    } else {
        return this.event.request.intent;
    }
  }
}
