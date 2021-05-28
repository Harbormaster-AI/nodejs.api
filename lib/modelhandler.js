const requestHandler	= require('./requesthandler');
const fileHandler		= require('./filehandler');
const user				= require('./user');
const Status 			= require("./status");
const status			= new Status();
var constants 			= require("./constants");
var config 				= require('config');
const Configstore 		= require('configstore');
const conf 				= new Configstore(constants.HARBORMASTER);
var util 				= require('util');

module.exports = {

	validate: (file, javaRootPackageNames, primaryKeyPattern) => {
		
		return new Promise(async function(resolve, reject) {

			// upload the file to an S3 bucket and get's it's key
			var s3Path = user.deduceDir( constants.PUBLIC, constants.MODEL_DIR);
			var s3UploadPromise = fileHandler.uploadToS3Bucket(file, s3Path);
			s3UploadPromise.then(function(s3FileLocation) {
				const input = requestHandler.packageInputAddToken(constants.VALIDATE_MODEL);
				
				//////////////////////////////////////////////////////////
				// assign the provided S3 Url of the uploaded file
				//////////////////////////////////////////////////////////		
				input.s3FileLocation = s3FileLocation;
				
				//////////////////////////////////////////////////////////
				// assign the pojoParams
				//////////////////////////////////////////////////////////
				input.pojoParams = {"javaRootPackageNames":javaRootPackageNames, "primaryKeyPattern": primaryKeyPattern};
				
				const msg = util.format(constants.VALIDATE_MODEL_REQUEST_MSG, file);
				if ( input.s3FileLocation != null ) {				
					return requestHandler.handleRequest( input, msg, function(err, data) {
						if ( err ) {
							reject( status.error(err, 
										util.format(constants.COMMAND_ERROR, constants.VALIDATE_MODEL )));
						} else {
							resolve( data )
						}
					});
				}
			}).catch(err => reject( status.error(err, 
										util.format(constants.COMMAND_ERROR, constants.VALIDATE_MODEL ))));
		});
	},	

	list: (scope, filter) => {
		return new Promise(function(resolve, reject) {
			const input = requestHandler.packageInputAddToken(constants.MODEL_LIST);
			input.scopeType	= scope != null ? scope.toUpperCase() : null; // server likes uppercase enum types
			input.filter = filter;
			return requestHandler.handleRequest( input, constants.MODEL_LIST_REQUEST_MSG, function(err, data) {
				if ( err ) {
		    		reject( status.error(err, 
							util.format(constants.COMMAND_ERROR, constants.TECH_STACK_PKG_LIST_REQUEST_MSG) ));
		    	}else {
		    		resolve( data );
		    	}
			}, false);
		});
	},
	
	register: (modelFilePath, modelName, scope, javaRootPackageNames, primaryKeyPattern ) => {

		return new Promise(function(resolve, reject) {
			
			if ( modelFilePath != null ) {	
				const path 				= require('path');
				var modelFilePathToUse 	= modelFilePath;				
				var saveParams 			= {"name":modelName, "description":"Directly loaded model file"};
				var s3Path 				= user.deduceDir(scope, constants.MODEL_DIR);
				var s3UploadPromise 	= fileHandler.uploadToS3Bucket( modelFilePathToUse, s3Path);
					
				s3UploadPromise.then(function(s3FileLocation) {
					const input 			= requestHandler.packageInputAddToken(constants.REGISTER_MODEL);
					input.modelId			= modelName;
					input.saveParams 		= saveParams;
					input.s3FileLocation 	= s3FileLocation;
						
					input.pojoParams = {"javaRootPackageNames":javaRootPackageNames, "primaryKeyPattern": primaryKeyPattern};
					const msg 				= util.format(constants.REGISTER_MODEL_REQUEST_MSG, saveParams.name);
					input.scopeType			= scope != null ? scope.toUpperCase() : "PRIVATE"; // server likes uppercase enum types
					var reqPromise 			= requestHandler.asyncHandleRequest(input, msg);
						
					reqPromise.then(function(data) {
						resolve(data); // should be the newly created model id.
					}, function(err) {
						reject(err);
					}).catch(err => reject( new Status()
											.error( null, util.format(constants.COMMAND_ERROR, constants.REGISTER_MODEL))));
				}, function(err) {
					reject(err);
				}).catch(err => reject( new Status()
				.error( null, util.format(constants.COMMAND_ERROR, constants.REGISTER_MODEL))));
			} 
		});
	},		
	
	deleteModel: (name_or_id) => {
		return new Promise(async function(resolve, reject) {
			const input = requestHandler.packageInputAddToken(constants.DELETE_MODEL);
			
			if ( Number.isNaN(name_or_id) === false )
				input.modelId 		= name_or_id;
			else
				input.saveParams	= {"name":name_or_id};
			
			return requestHandler.handleRequest( input, constants.DELETE_MODEL_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( status.error(err,
											util.format(constants.COMMAND_ERROR, constants.DELETE_MODEL)));
				} else if ( data != null ){
					resolve(data);
				}
			});
		});
	},

	promoteModel: (name_or_id) => {
		return new Promise(async function(resolve, reject) {

			const input = requestHandler.packageInputAddToken(constants.PROMOTE_MODEL);

			if ( Number.isNaN(name_or_id) === false )
				input.modelId 		= name_or_id;
			else
				input.saveParams	= {"name":name_or_id};
			
			return requestHandler.handleRequest( input, constants.PROMOTE_MODEL_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( status.error(err,
							util.format(constants.COMMAND_ERROR, constants.PROMOTE_MODEL)));
				} else if ( data != null ){
					resolve( data );
				}
			});	
		});
	},

	demoteModel: (name_or_id) => {
		return new Promise(async function(resolve, reject) {

			const input = requestHandler.packageInputAddToken(constants.DEMOTE_MODEL);

			if ( Number.isNaN(name_or_id) === false )
				input.modelId 		= name_or_id;
			else
				input.saveParams	= {"name":name_or_id};
			
			return requestHandler.handleRequest( input, constants.DEMOTE_MODEL_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( status.error(err,
							util.format(constants.COMMAND_ERROR, constants.DEMOTE_MODEL)));
				} else if ( data != null ){
					resolve( data );
				}
			});	
		});
	},

	downloadModel: (name_or_id, outputFileAndPath) => {
		return new Promise(async function(resolve, reject) {
			
			const input = requestHandler.packageInputAddToken(constants.GET_MODEL);

			if ( Number.isNaN(name_or_id) === false )
				input.modelId 		= name_or_id;
			else
				input.saveParams	= {"name":name_or_id};

			return requestHandler.handleRequest( input, constants.DOWNLOAD_MODEL_REQUEST_MSG, function(err, data) {
				if ( err == null &&  data != null ){
					if ( data.resultCode == constants.SUCCESS ) {
						var fileKey 	= JSON.parse(data.result).filePath;
						
						fileHandler.downloadFromS3Bucket( fileKey, outputFileAndPath );
						resolve(status.success(data, constants.DOWNLOAD_COMPLETE));
					}
				}
				else {
					reject( status.error(data,
								util.format(constants.GET_MODEL, constants.GET_MODEL)));
				}
			});	
		});
	}
}
