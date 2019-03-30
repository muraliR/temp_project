var express = require('express');
var router = express.Router();
var config = require('../../config');
var Schema = require('../../schema');
var geoip = require('geoip-lite');

var EmailComplaint = require('../../models/email_complaint');


/* GET home page. */
router.post('/ses_email_activity', function(req, res, next) {
	if (req.headers['x-amz-sns-message-type'] == 'Notification'){

		var data = req.body;
		var message = JSON.parse(data["Message"]);
		var messageId = message["mail"]["messageId"];
		var event_type = message["eventType"]
		var api_time = data["Timestamp"];

		Schema.mysql_connection.query('select * from email_logs where message_id = "'+messageId+'" order by id desc limit 0,1;', function (err, result) {
	    	if (err) {
	    		// Update admin
	    		// print to error log
	    		console.log("finding messageId from email table failed");
	    		return res.send({}).status(200)
	    	} else {
	    		if(result.length != 0){
	    			var email_log_obj = result[0];
	    			var email_log_id = email_log_obj["id"];
	    			var email_template_id = email_log_obj["email_template_id"];
	    			var version_id = email_log_obj["version_id"];
	    			var campaign_id = email_log_obj["campaign_id"];


	    			// Insert into email log status table
	    			created_at = new Date();
	    			created_at = created_at.toLocaleString();

	    			updated_at = new Date();
	    			updated_at = updated_at.toLocaleString();

	    			var els_insert_sql = "INSERT INTO email_status_logs (email_log_id, api_time, email_template_id, version_id, event_type, campaign_id,created_at,updated_at) VALUES ("+email_log_id+",'"+api_time+"',"+email_template_id+","+version_id+",'"+event_type+"',"+campaign_id+",'"+created_at+"','"+updated_at+"')";
					
					if (event_type == "Click"){

						user_agent = message['click']['userAgent']
						ip_address = message['click']['ipAddress']
						link = message['click']['link']

						var geo = geoip.lookup(ip_address);

						els_insert_sql = "INSERT INTO email_status_logs (email_log_id, api_time, email_template_id, version_id, event_type, campaign_id,created_at,updated_at,user_agent,ip_address,link,country) VALUES ("+email_log_id+",'"+api_time+"',"+email_template_id+","+version_id+",'"+event_type+"',"+campaign_id+",'"+created_at+"','"+updated_at+"','"+user_agent+"','"+ip_address+"','"+link+"','"+ geo['country'] +"')";	
					}


					Schema.mysql_connection.query(els_insert_sql, function (err, result) {
					    if (err){
					    	console.log( "Error inserting into email_status_logs table");
					    	return res.send({}).status(200)
					    } else {

					    	if(event_type == "Bounce"){
					    		if(email_log_obj["environment"] == "live"){
					    			create_data = {email: email_log_obj["to_address"], type: "Bounce", account_id: email_log_obj["account_id"]} 
					    			EmailComplaint.create(create_data,function(createStatus){
					    				console.log("++++++++++++++++++++");
					    				console.log(createStatus);
					    				console.log("++++++++++++++++++++");
					    			})
					    		}
					    	}



							country_update_sql = "update email_status_logs set country = '"+geo['country']+"' where id = " + email_log_obj["id"];
							//geo['country']


					    	email_log_update_sql = "update email_logs set status = '"+event_type+"' where id = " + email_log_obj["id"];

					    	Schema.mysql_connection.query(email_log_update_sql, function (err, result) {
							    if (err){
							    	console.log( "Error updating into email_logs table");
							    	return res.send({}).status(200)
							    } else {
							    	console.log("Updated in email_logs table")
							    	return res.send({success:true, result: els_insert_sql}).status(200)
							    }
							 });
					    }
					 });
	    		} else {
	    			return res.send({}).status(200)
	    		}
	    	}
	    	
	  	});


	} else {
		// TODO to handle
		return res.send({}).status(200)
	}

	
});

module.exports = router;
