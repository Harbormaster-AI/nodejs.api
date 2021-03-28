const request 			= require('request');
var config 				= require('config');
var constants 			= require("./constants");
const Configstore 		= require('configstore');
const conf 				= new Configstore(constants.HARBORMASTER);
var util 				= require('util');

module.exports =  {

	// input is a JSON structure
	// callback is to handle the results of the request
	handleRequest : (input, msg, callback, multipart) => {
		// load service configuration from config file
		// use PRODUCTION env to shift server from localhost (test) to realMethods server
		//var serverConfig 	= config.get(constants.SERVER_CONFIG);
		//var host 			= serverConfig.host;
		//var endPoint 		= serverConfig.endpoint;
		//var port			= serverConfig.port;
		
		const msgBody		= JSON.stringify(input);

		const CLI         	= require('clui');
		const Spinner     	= CLI.Spinner;
		const status 		= new Spinner(msg + ' please wait...');

		if ( conf.get(constants.QUIET_MODE) == false )
			status.start();
		
		if ( multipart == true ) {
			request({
				method: 'PUT',
			    preambleCRLF: true,
			    postambleCRLF: true,
			    uri: conf.get(constants.PLATFORM_URL),
			    multipart: [
			      {
			        'content-type': 'application/json',
			        body: msgBody
			      }
			    ],
			    function (error, response, body) {
			    	if ( !conf.get(constants.QUIET_MODE))
			    		status.stop();
				
			    	if (!err && resp.statusCode == 200) 
			    		return callback(null, body);
			    	else 
			    		return callback(err, null);
			    }
			})			
		}
		else {
			request(conf.get(constants.PLATFORM_URL) + '?input=' + msgBody, { json: true }, (err, resp, body) => {
				if ( !conf.get(constants.QUIET_MODE))
					status.stop();

				if (!err && resp.statusCode == 200) 
		            callback(null, body);
		        else 
		            callback(err, null);		        
			});
		}
	},
	
	asyncHandleRequest: (input, msg) => {

		// load service configuration from config file
		// use PRODUCTION env to shift server from localhost (test) to realMethods server
		//var serverConfig 	= config.get(constants.SERVER_CONFIG);
		//var host 			= serverConfig.host;
		//var endPoint 		= serverConfig.endpoint;
		//var port			= serverConfig.port;
		
		const msgBody		= JSON.stringify(input);

		if ( !conf.get(constants.QUIET_MODE))
			console.log(msg);
		const queryString = '?input=' + msgBody;
		
		return new Promise(function(resolve, reject) {
			request(conf.get(constants.PLATFORM_URL), { form: queryString, json: true }, (err, resp, body) => {
				if (!err && resp.statusCode == 200 ) {
					resolve(body);
	            } else {
	            	reject(err);	            
				}
			});
		});
	},
	
	packageInput: (token, serviceRequestType ) => {
		return {"token" : token, "serviceRequestType" : serviceRequestType };
	},

	packageInputAddToken: (serviceRequestType ) => {
		return {"token" : conf.get(constants.HARBORMASTER_TOKEN), "serviceRequestType" : serviceRequestType };
	}	
}
