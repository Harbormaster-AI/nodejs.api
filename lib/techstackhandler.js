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

		validate: (file) => {
		
		return new Promise(async function(resolve, reject) {
	
			// upload the file to an S3 bucket and get's it's key
			var s3Path 			= user.deduceDir( constants.PUBLIC, constants.TECH_STACK_DIR);
			var s3UploadPromise = fileHandler.uploadToS3Bucket(file, s3Path);
			s3UploadPromise.then(function(s3FileLocation) {
				const input 			= requestHandler.packageInputAddToken(constants.VALIDATE_TECH_STACK);
				const msg 				= util.format(constants.VALIDATE_TECH_STACK_REQUEST_MSG, file);
				input.s3FileLocation 	= s3FileLocation;
				if ( input.s3FileLocation != null ) {				
					return requestHandler.handleRequest( input, msg, function(err, data) {
						if ( err ) {
							reject( status.error( null, err ));
						} else {
							resolve( data );
						}
					});
				}
			}).catch(err => console.log('Catch in tech stack validate function', err));
		});
	},	

	register: (ymlFilePath, scope, defaultTeckStackId ) => {

		return new Promise(function(resolve, reject) {
			
			var ymlFilePathAsJson 	= null;
			
			if ( ymlFilePath != null ) {
				
				fileHandler.loadYMLToJSON(ymlFilePath, function( err, data ) {
					if ( err ) {
						reject( status.error( null, "Error parsing JSON file " + ymlFilePath + " : " + err ) );
					}
					else 
						ymlFilePathAsJson = data;
				});

				var s3Path 			= user.deduceDir(scope, constants.TECH_STACK_DIR);
				var s3UploadPromise = fileHandler.uploadToS3Bucket( ymlFilePathAsJson.stackPath 
																	+ ymlFilePathAsJson.stackFile, 
																	s3Path);
				s3UploadPromise.then(function(s3FileLocation) {
					const input 			= requestHandler.packageInputAddToken(constants.REGISTER_TECH_STACK);
					input.saveParams 		= ymlFilePathAsJson.saveParams;
					input.s3FileLocation 	= s3FileLocation;					
					input.scopeType			= scope != null ? scope.toUpperCase() : null; // server likes uppercase enum types
					const msg 				= util.format(constants.REGISTER_TECH_STACK_REQUEST_MSG, ymlFilePathAsJson.saveParams.name );					
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
				if ( defaultModelId != null )
					resolve( status.success(defaultModelId, 
												util.format(constants.COMMAND_, constants.REGISTER_TECH_STACK )));
				else {
					reject( status.error(null,"Null YAML file arg provided with no default model id arg" ));
				}
			}
		});
	},		
	
	options: (name_or_id) => {

		return new Promise(function(resolve, reject) {

			const input = requestHandler.packageInputAddToken(constants.TECH_STACK_PACKAGE_OPTIONS);

			if ( Number.isNaN(name_or_id) === false )
				input.techStackPackageId	= name_or_id;
			else
				input.saveParams		= {"name":name_or_id};

			return requestHandler.handleRequest( input, constants.TECH_STACK_OPTIONS_REQUEST_MSG, function(err, data) {
				if ( err ) {
		    		reject( status.error(err, 
    						util.format(constants.COMMAND_ERROR, constants.TECH_STACK_PACKAGE_OPTIONS) ));
				} else {
					resolve(data);
				}
			});
		});
	},	
	
	list: (scope, outputFormatType, filter) => {

		return new Promise(function(resolve, reject) {
	
			const input		= requestHandler.packageInputAddToken( constants.TECH_STACK_PACKAGE_LIST );
			input.scopeType	= scope != null ? scope.toUpperCase() : null; // server likes uppercase enum types
			input.filter 	= filter;
			
			return requestHandler.handleRequest( input, constants.TECH_STACK_PKG_LIST_REQUEST_MSG, function(err, data) {
		    	if ( err ) {
		    		reject( status.error(err, 
		    						util.format(constants.COMMAND_ERROR, constants.TECH_STACK_PKG_LIST_REQUEST_MSG) ));
		    	} else {
		    		resolve( data );
		    	}
			});
		});
	},
	
	deleteStack: (name_or_id) => {
		return new Promise(function(resolve, reject) {
	
			const input = requestHandler.packageInputAddToken(constants.DELETE_TECH_STACK);
			if ( Number.isNaN(name_or_id) === false )
				input.techStackPackageId	= name_or_id;
			else
				input.saveParams		= {"name":name_or_id};
			
			return requestHandler.handleRequest( input, constants.DELETE_TECH_STACK_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( status.error(err,
											util.format(constants.COMMAND_ERROR, constants.DELETE_MODEL)));
				} else if ( data != null ){
					resolve(data);
				}
			});
		});
	},
	
	promoteStack: (name_or_id) => {
		
		return new Promise(function(resolve, reject) {
	
			const input = requestHandler.packageInputAddToken(constants.PROMOTE_TECH_STACK);

			if ( Number.isNaN(name_or_id) === false )
				input.techStackPackageId	= name_or_id;
			else
				input.saveParams		= {"name":name_or_id};
			
			return requestHandler.handleRequest( input, constants.PROMOTE_TECH_STACK_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( status.error(err,
							util.format(constants.COMMAND_ERROR, constants.PROMOTE_TECH_STACK)));
				} else if ( data != null ){
					resolve( data );
				}
			});
		});
	},

	demoteStack: (name_or_id) => {
		
		return new Promise(function(resolve, reject) {
	
			const input = requestHandler.packageInputAddToken(constants.DEMOTE_TECH_STACK);

			if ( Number.isNaN(name_or_id) === false )
				input.techStackPackageId	= name_or_id;
			else
				input.saveParams		= {"name":name_or_id};
			
			return requestHandler.handleRequest( input, constants.DEMOTE_TECH_STACK_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( status.error(err,
							util.format(constants.COMMAND_ERROR, constants.DEMOTE_TECH_STACK)));
				} else if ( data != null ){
					resolve( data );
				}
			});
		});
	},

	downloadStack: (name_or_id, outputFileAndPath) => {

		return new Promise(function(resolve, reject) {
	
			const input = requestHandler.packageInputAddToken(constants.GET_TECH_STACK);
			
			if ( Number.isNaN(name_or_id) === false )
				input.techStackPackageId	= name_or_id;
			else
				input.saveParams		= {"name":name_or_id};
			
			return requestHandler.handleRequest( input, constants.DOWNLOAD_TECH_STACK_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( status.error(err,
							util.format(constants.COMMAND_ERROR, constants.GET_TECH_STACK)));
				} else if ( data != null ){
					var fileKey 	= JSON.parse(data.result).filePath;
					fileHandler.downloadFromS3Bucket( fileKey, outputFileAndPath );
					resolve( status.success( data, constants.DOWNLOAD_COMPLETE));
				}
			});
		});
	}

}
