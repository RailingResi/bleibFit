const training_data = require('./training_data');
const bodypartExercisesJSON = training_data.BODYPART_EXERCISES;

module.exports = {
    isSlotValid(request, slotName){
        var slot_type;
        var slotValue;
        var requested_slotType;
        //ERROR OR SUCCESS
        var request_status_code = request.intent.slots.bodypart.resolutions.resolutionsPerAuthority[0].status.code;
        //SLOTVALUES 
        var request_values = request.intent.slots.bodypart.resolutions.resolutionsPerAuthority[0]['values'];

        if (request_values != undefined) {
            requested_slotType = request.intent.slots.bodypart.resolutions.resolutionsPerAuthority[0]['values'][0].value.id;
        }
        
        if (request_status_code == 'ER_SUCCESS_MATCH' && requested_slotType && bodypartExercisesJSON[requested_slotType] != undefined ) {
            slot_type = requested_slotType;
            console.log('MY SLOT STRINGIFYED' + JSON.stringify(slot_type));
        }
        //if we have a slot, get the text and store it into speechOutput
        if (slot_type) {
            //we have a value in the slot
            return slot_type;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
    }
}
