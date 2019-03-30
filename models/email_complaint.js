var Schema = require('../schema');

module.exports = {
	create: function(data,callback){
		
		newComplaint = new Schema.MEmailComplaint(data);
		newComplaint.save(function(saveErr){
			if(saveErr){
				callback({success: false, message: saveErr})
			} else {
				callback({success: true});
			}
		})
	}
}