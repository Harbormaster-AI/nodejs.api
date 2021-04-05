const requestHandler	= require('./requesthandler');
const fileHandler		= require('./filehandler');
var constants 			= require("./constants");
const Status 			= require("./status");
const status			= new Status();
const user				= require('./user');
var config 				= require('config');
const Configstore 		= require('configstore');
var util 				= require('util');
const conf 				= new Configstore(constants.HARBORMASTER);

module.exports = {


	register: (resourcePath, uniqueName, resourceType, cost, scope, defaultResourceId ) => {

		return new Promise(function(resolve, reject) {
			
			if ( resourcePath != null ) {
				
				var s3Path 			= user.deduceDir(scope, constants.RESOURCE_DIR);
				var s3UploadPromise = fileHandler.uploadToS3Bucket( resourcePath, s3Path );
				
				s3UploadPromise.then(function(s3FileLocation) {

					const input 			= requestHandler.packageInputAddToken(constants.REGISTER_RESOURCE);
					const msg 				= util.format(constants.REGISTER_RESOURCE_REQUEST_MSG, resourcePath );					

					input.s3FileLocation 	= s3FileLocation;
					input.resourceType		= resourceType.toUpperCase();					
					input.scopeType			= scope != null ? scope.toUpperCase() : null; // server likes uppercase enum types
					input.saveParams 		= {"name":uniqueName, "description":"Directly loaded resource file"};
					input.cost				= cost;
					var reqPromise 			= requestHandler.asyncHandleRequest( input, msg);
					
					reqPromise.then(function(data) {
						resolve(data); 
					}, function(err) {
						resolve(err);
					}).catch(err => console.log('Catch', err));
				}, function(err) {
					resolve(err);
				}).catch(err => console.log('Catch', err));
			} else {
				if ( defaultResourceId != null )
					resolve( status.success(defaultModelId, 
												util.format(constants.COMMAND_, constants.REGISTER_RESOURCE)));
				else {
					reject( status.error(null,"Null YAML file arg provided with no default resource id arg" ));
				}
			}
		});
	},		
	
	list: (scope, resourceType) => {

		return new Promise(function(resolve, reject) {
	
			const input		= requestHandler.packageInputAddToken( constants.RESOURCE_LIST );
			input.scopeType	= scope != null ? scope.toUpperCase() : null; // server likes uppercase enum types
			input.resourceType = resourceType != null ? resourceType.toUpperCase() : constants.GENERIC;
			
			return requestHandler.handleRequest( input, constants.RESOURCE_LIST_REQUEST_MSG, function(err, data) {
		    	if ( err ) {
		    		reject( status.error(err, 
		    						util.format(constants.COMMAND_ERROR, constants.RESOURCE_LIST_REQUEST_MSG) ));
		    	} else {
		    		resolve( data );
		    	}
			});
		});
	},
	
	deleteResource: (name_or_id) => {
		
		return new Promise(function(resolve, reject) {
	
			const input	 		= requestHandler.packageInputAddToken(constants.DELETE_RESOURCE);

			if ( Number.isNaN(name_or_id) === false )
				input.resourceId 	= name_or_id;
			else
				input.saveParams	= {"name":name_or_id};
			
			return requestHandler.handleRequest( input, constants.DELETE_RESOURCE_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( status.error(err,
											util.format(constants.COMMAND_ERROR, constants.DELETE_RESOURCE)));
				} else if ( data != null ){
					resolve(data);
				}
			});
		});
	},
	
	promoteResource: (name_or_id) => {
		
		return new Promise(function(resolve, reject) {
	
			const input = requestHandler.packageInputAddToken(constants.PROMOTE_RESOURCE);

			if ( Number.isNaN(name_or_id) === false )
				input.resourceId 	= name_or_id;
			else
				input.saveParams	= {"name":name_or_id};
			
			return requestHandler.handleRequest( input, constants.PROMOTE_RESOURCE_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( status.error(err,
							util.format(constants.COMMAND_ERROR, constants.PROMOTE_RESOURCE)));
				} else if ( data != null ){
					resolve( data );
				}
			});
		});
	},

	demoteResource: (name_or_id) => {
		
		return new Promise(function(resolve, reject) {
	
			const input = requestHandler.packageInputAddToken(constants.DEMOTE_RESOURCE);

			if ( Number.isNaN(name_or_id) === false )
				input.resourceId 	= name_or_id;
			else
				input.saveParams	= {"name":name_or_id};
			
			return requestHandler.handleRequest( input, constants.DEMOTE_RESOURCE_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( status.error(err,
							util.format(constants.COMMAND_ERROR, constants.DEMOTE_RESOURCE)));
				} else if ( data != null ){
					resolve( data );
				}
			});
		});
	},

	downloadResource: (name_or_id, outputFileAndPath) => {

		return new Promise(function(resolve, reject) {
			const input = requestHandler.packageInputAddToken(constants.GET_RESOURCE);

			if ( Number.isNaN(name_or_id) === false ) 
				input.resourceId 	= name_or_id;
			else
				input.saveParams	= {"name":name_or_id};

			return requestHandler.handleRequest( input, constants.DOWNLOAD_RESOURCE_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( status.error(err,
							util.format(constants.COMMAND_ERROR, constants.GET_RESOURCE)));
				} else if ( data != null ){
					var fileKey 	= JSON.parse(data.result).filePath;
					fileHandler.downloadFromS3Bucket( fileKey, outputFileAndPath );
					resolve( status.success( data.processingMessage, constants.DOWNLOAD_COMPLETE));
				}
			});
		});
	}

}
