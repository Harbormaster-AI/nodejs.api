const requestHandler	= require('./requesthandler');
const fileHandler		= require('./filehandler');
const modelHandler		= require('./modelhandler');
var constants 			= require("./constants");
var util 				= require('util');
const Configstore 		= require('configstore');
const conf 				= new Configstore(constants.HARBORMASTER);
const Status 			= require("./status");
const status			= new Status();

let self = module.exports = {

	saveProjectHelper: (appParams, techStackId, modelId, saveParams) => {
		return new Promise(async function(resolve, reject) {
            // ================================================================
			// prep the input payload and apply the user token
            // ================================================================
			var input 				    = requestHandler.packageInputAddToken(constants.REGISTER_PROJECT);
	
			input.techStackPackageId 	= techStackId;
			input.modelId 				= modelId;			

            // ================================================================
            // assign the application options
            // ================================================================
            input.appOptions = appParams.options;
            
            // ================================================================
            // in the event a GIT or JAR/WAR/EAR file is being supplied as the model, 
            // need the pojo params
            // ================================================================
            if ( appParams.model.javaRootPackageNames != null )
                input.pojoParams = {"javaRootPackageNames":appParams.model.javaRootPackageNames, "primaryKeyPattern": appParams.model.primaryKeyPattern};
                        
            // ================================================================
            // assign save params
            // ================================================================
            input.saveParams = saveParams;

            // ================================================================
            // assign Git params directly
            // ================================================================
            input.gitParams	= appParams.options.git;

            // ================================================================
			// assign the project name
			// ================================================================
		    var projectName = appParams.name;

			if ( input.appOptions != null ) {
				var msg = util.format(constants.PROJECT_SAVE_REQUEST_MSG, projectName);
				var reqPromise = requestHandler.asyncHandleRequest( input, msg);
				
				reqPromise.then(function(data) {
					if ( data.resultCode != constants.SUCCESS)
						reject(data)
					else {
						resolve( data );
					}
				}, function(err) {
					reject( err );
				}).catch(err => console.log('Catch', err));
			}
		});
	},
	
	saveProject: (yamlFile) => {
		
		return new Promise(async function(resolve, reject) {
	
			let genYamlAsJson = null;
			
            // ================================================================
            // load the YAML into JSON
            // ================================================================
			fileHandler.loadYMLToJSON(yamlFile, function( err, data ){

				if ( err ) {
					reject( status.error( err, "Error parsing project-as-code yaml file " + yamlFile + " to json."));
					return;
				}
				genYamlAsJson = data;
								
			});
			
			if ( genYamlAsJson != null ) {
	
				let techStackId, modelIdentifierToUse, appParams, saveParams;
				
                // ==============================================
				// support starting with app or project
                // ==============================================
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

                // ==============================================
				// assign the model identifier
                // ==============================================
	   			modelIdentifierToUse = appParams.model.identifier;

                // ==============================================
				// assign the tech stack identifier
                // ==============================================
				techStackId = appParams.techstack.id;

                // ==============================================
				// assign the save params
                // ==============================================
                saveParams = {"name":appParams.name, "description":appParams.description};

                // ================================================================
	    		// if the model identifier is a file, it should be publish to the remove
	    		// realmethods server and if successful, use the return ID as the model identified
	    		// ================================================================
	    		if ( Number.isInteger(modelIdentifierToUse) == false ) {
	    			console.log('Model identifer ' + modelIdentifierToUse + ' determined to be a file.  Validating/publishing model with server...');
	   				modelHandler.register(modelIdentifierToUse.toString(), 
	   										null, /* use default Scope */
	   										appParams.model.javaRootPackageNames, appParams.model.primaryKeyPattern)
	   					.then(function(result) {
	   						modelIdentifierToUse = result;
    						self.saveProjectHelper(appParams, techStackId, modelIdentifierToUse, saveParams);
	    					}).catch(err => reject(err));
	    		}
	    		else {
	   				self.saveProjectHelper(appParams, techStackId, modelIdentifierToUse, saveParams)
	    				.then(function(result) {
	    					resolve(result);
	    				}).catch(err => reject(err));
				}
			}			
		});
	}	
}
