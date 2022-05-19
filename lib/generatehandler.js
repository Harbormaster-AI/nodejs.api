const requestHandler	= require('./requesthandler');
const fileHandler		= require('./filehandler');
const modelHandler		= require('./modelhandler');
const techStackHandler	= require('./techstackhandler');
var constants 			= require("./constants");
var util 				= require('util');
const Configstore 		= require('configstore');
const conf 				= new Configstore(constants.HARBORMASTER);
const Status 			= require("./status");
const status			= new Status();

let self = module.exports = {

	generateProjectHelper: (appParams, techStackName, modelId, appOptionsPath, gitParams) => {
		return new Promise(async function(resolve, reject) {
			// prep the input payload and apply the user token
			const input 				= requestHandler.packageInputAddToken(constants.CREATE_APP);

			input.techStackPackageId 	= techStackName;
			input.modelId 				= modelId;			
			input.gitParams				= gitParams; 

			var appOptionsFileToUse = appOptionsPath;

			// if one is not provided, use the one designated in the appParams file if using old format style
			if ( appOptionsFileToUse == null ) { 
				appOptionsFileToUse = appParams.appOptionsFile;
			}

			// if undefined, load all app options from the appParams app.options 
			if ( appOptionsFileToUse == undefined) {
			    input.appOptions = appParams.options;

			    ///////////////////////////////////////////////////////////////////////////////
			    // in the event a GIT or JAR/WAR/EAR file is being supplied as the model, 
			    // need the pojo params
			    ///////////////////////////////////////////////////////////////////////////////
			    input.pojoParams = {"javaRootPackageNames":appParams.model.javaRootPackageNames, "primaryKeyPattern": appParams.model.primaryKeyPattern};

			    ///////////////////////////////////////////////////////////////////////////////
			    // assign these directly for backwards compatibility
			    ///////////////////////////////////////////////////////////////////////////////
			    if ( gitParams == null || gitParams == undefined ) { // if provided, it overrides what is discovered in the YAML
					input.gitParams	= appParams.options.git;
				} 
			}
			///////////////////////////////////////////////////////////////////////////////
			//  load from file instead
			///////////////////////////////////////////////////////////////////////////////
			else {
				fileHandler.loadFileToJSON(appOptionsPath, function( err, data ){
					if ( err ) {
						reject( new Status().error( err, "Error parsing JSON options file " + appOptionsPath ) );
					}else {
						input.appOptions = data;
					}
				});
			}

	 		//////////////////////////////////////////////
			// locate the application name
			//////////////////////////////////////////////
		    var appName;

		    if ( appParams.saveParams != undefined )
		        appName = appParams.saveParams.name;
		    else
		    	appName = appParams.options.application.name;

			if ( input.appOptions != null ) {
				var msg = util.format(constants.GENERATE_APP_REQUEST_MSG, appName);

				var reqPromise = requestHandler.asyncHandleRequest( input, msg);

				reqPromise.then(function(data) {
					if ( data.resultCode != constants.SUCCESS) {
						reject(data)
					}
					else {
						resolve( data );
					}
				}, function(err) {
					reject( err );
				}).catch(err => console.log('Catch', err));
			}
		});
	},

	generateProject: (yamlFile, gitFile, appOptionsFile, modelIdentifier) => {

		return new Promise(async function(resolve, reject) {

			let genYamlAsJson = null;

			fileHandler.loadYMLToJSON(yamlFile, function( err, data ){

				if ( err ) {
					reject( status.error( err, "Error parsing project-as-code yaml file " + yamlFile + " to json."));
					return;
				}
				genYamlAsJson = data;

			});

			if ( genYamlAsJson != null ) {

				let techStackName, modelName, modelIdentifierToUse;
				let appParams;
				let oldFormatStyle = true;

				//support starting with app or project
				if ( genYamlAsJson.app != undefined ) {
					if ( genYamlAsJson.app.length == undefined )
				    	appParams = genYamlAsJson.app;				    
					else
				    	 appParams = genYamlAsJson.app[0];
				}
				else if ( genYamlAsJson.project != undefined ) {
					if ( genYamlAsJson.project.length == undefined )
				    	appParams = genYamlAsJson.project;				    
					else
				    	 appParams = genYamlAsJson.project[0];
				} 
				else {
					reject( status.error( null, "Error parsing gen app yaml file due to missing start of either app or project." ));
					return;
				}

				techStackName 	= appParams.techstack.name;
				modelName 		= appParams.model.name;

	    		const fs = require('fs');	    			
	    		if ( fs.existsSync(modelName) == true ) {
	    			console.log('Model name ' + modelName + ' determined to be an existing file.  Validating/publishing model with server...');
	   				modelHandler.register(modelName, 
	   										modelName, 
	   										null, /* use default Scope */
	   										appParams.model.javaRootPackageNames, appParams.model.primaryKeyPattern)
	   					.then(function(result) {
	   						let deleteModel = true; // delete models from the backend that are provided as a file here...need to be explicitly published	   						
	   						modelIdentifierToUse = result;
    						self.internalGitHelper(appParams, techStackName, modelIdentifierToUse, gitFile, appOptionsFile, deleteModel);
	    					}).catch(err => reject(err));
	    		}
	    		else { // treat as an existing model by name
	    			modelIdentifierToUse = modelName;
	    			let deleteModel = false;
	   				self.internalGitHelper(appParams, techStackName, modelIdentifierToUse, gitFile, appOptionsFile, deleteModel)
	    				.then(function(result) {
	    					resolve( result );
	    				}).catch(err => reject(err));
				}
			}

		});
	},


	internalGitHelper: ( appParams, techStackName, modelIdentifier, gitFile, appOptionsFile, deleteModel ) => {

		return new Promise(async function(resolve, reject) {
			// locate the gitParams
			var gitParams;
			var gitFileToUse = gitFile;

			// if one is not provided, use the one designated in the appParams file
			if ( gitFileToUse == null && appParams.gitParams != undefined ) {
				gitFileToUse = appParams.gitParams.file;
			}

			//console.log( 'gitFileToUse = ' + gitFileToUse );

			if( gitFileToUse != null && gitFileToUse != undefined ) {
				fileHandler.loadYMLToJSON(gitFileToUse, function( err, data ){
					if ( err ) {
						reject( new Status().error( err, "Error parsing git yaml file " + gitFileToUse + " to json" ));
					}
					gitYamlAsJson = data;
				});

				for( let __index = 0; gitYamlAsJson.gitParams.length; __index++ ) {				
					if ( gitYamlAsJson.gitParams[__index].name == appParams.gitParams.entry ) {
						gitParams = gitYamlAsJson.gitParams[__index];
						break;
					}
				}
			}

			self.generateProjectHelper( appParams, 
			            techStackName, 
			            modelIdentifier, 
						appOptionsFile,
						gitParams ).then(function(result) {
							if ( deleteModel == true ) {
								console.log( "Unpublishing model..." )
								modelHandler.deleteModel( modelIdentifier ).then(function(result) {
									console.log( "Model unpublished" );
								}).catch(err => console.log(err));
							}
							resolve( result );
						}).catch(err => console.log(err));
		});

	}
}