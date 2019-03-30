var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./config');
var mongo_url = config.db_url;
var mysql = require('mysql');
var mysql_connection = mysql.createConnection(config.mysql_credentials);

mysql_connection.connect(function(err) {
  if (err) throw err;
  console.log("Mysql Connection Established!");
});


var mongoose_connection = mongoose.connect(mongo_url);

//Testing
//User Schema Definition
var complaintSchema = new Schema({
    email: { type: String, required: true},
    account_id: { type: Number, required: true},
    type: {type: String, required: true},
  	created_at: { type: Date, default: Date.now },
  	updated_at: { type: Date, default: Date.now }
});


var MEmailComplaint = mongoose.model('m_email_compliants',complaintSchema);



module.exports = {
  mysql_connection: mysql_connection,
  MEmailComplaint: MEmailComplaint
}