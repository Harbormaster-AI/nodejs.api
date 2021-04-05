#!/usr/bin/env node
process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

const user				= require('./lib/user');
const modelHandler		= require('./lib/modelhandler');
const techStackHandler	= require('./lib/techstackhandler');
const resourceHandler	= require('./lib/resourcehandler');
const archiveHandler	= require('./lib/archivehandler');
const requestHandler	= require('./lib/requesthandler');
const generateHandler	= require('./lib/generatehandler');
const projectHandler	= require('./lib/projecthandler');
const constants 		= require("./lib/constants");
const Status 			= require("./lib/status");
const status			= new Status();

self = module.exports =  {

	////////////////////////////////////////////////////
	// Handles the authentication of the user,
	// the user to provide their unique token, assigned
	// within their profile during registration
	////////////////////////////////////////////////////		
	async authenticate (inputToken, hostUrl)  {

		return new Promise(async function(resolve, reject) {
			if ( inputToken ) {	// authenticate the token from the remote server
				const Configstore 	= require('configstore');
				const conf 			= new Configstore(constants.HARBORMASTER);

				// pull from the config
				if ( hostUrl == undefined || hostUrl == null || hostUrl.length == 0 ) { 
					var config 			= require('config');
					var serverConfig 	= config.get(constants.SERVER_CONFIG);
					var host 			= serverConfig.host;
//					var endPoint 		= serverConfig.endpoint;
//					var port			= serverConfig.port;
					
//					hostUrl = host + ':' + port + endPoint;
					hostUrl = host;
				}
				
				conf.set(constants.PLATFORM_URL, hostUrl);
				
				await user.authenticate(inputToken, function(err, data){
			    	if ( err )  {
			    		reject( status.error(err, constants.TOKEN_VALIDATION_ERROR ) );
			    	}else {
			    		if ( data != null && data.resultCode == constants.SUCCESS ) {
			    			if (inputToken == JSON.parse(data.result).token) {
			    				user.storeToken(inputToken);	// authenticated
			    				resolve( data );
			    			}
			    		} 
			    		else
			    			reject( status.error("", constants.TOKEN_VALIDATION_ERROR ) ); 
			    	}
			    });
			}
			else
				reject( status.error("", constants.TOKEN_VALIDATION_ERROR ) );
		});
	},

	////////////////////////////////////////////////////
	// Model Related Functions
	////////////////////////////////////////////////////

	userInfo : () => {	
		return new Promise(function(resolve, reject) {
			user.userInfo()
				.then(function(result) {
					resolve(result);
			}).catch(err => reject(err));
		});
	},

	////////////////////////////////////////////////////
	// Model Related Functions
	////////////////////////////////////////////////////

	listModels : (scope, filter) => {	
		return new Promise(function(resolve, reject) {
			modelHandler.list(scope, filter)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},

	validateModel : (file, javaRootPackageName) => {	
		return new Promise(function(resolve,reject) {
			modelHandler.validate(file, javaRootPackageName)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},
	
	registerModel : (yamlFile, name, scope, javaRootPackageName, primaryKeyPattern ) => {	
		return new Promise(function(resolve,reject) {
			if ( yamlFile == null )
				reject( status.error(null, "Invalid YAML file provided." ));
			else {				
				modelHandler.register(yamlFile, name, scope == null ? constants.PRIVATE : scope, javaRootPackageName, primaryKeyPattern )
					.then(function(result) {
						resolve( result );
				}).catch(err => reject(err));
			}
		});
	},
	
	downloadModel : (model_id_or_name, output_file_path) => {
		return new Promise(function(resolve,reject) {
			modelHandler.downloadModel( model_id_or_name, output_file_path )
				.then(function(result) {
					resolve(result);
			}).catch(err => reject(err));
		});
	},
	
	deleteModel (model_id_or_name)  {
		return new Promise(function(resolve,reject) {
			modelHandler.deleteModel(model_id_or_name)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},
	
	promoteModel (model_id_or_name) {
		return new Promise(function(resolve,reject) {
			modelHandler.promoteModel(model_id_or_name)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
		
	},

	demoteModel (model_id_or_name) {
		return new Promise(function(resolve,reject) {
			modelHandler.demoteModel(model_id_or_name)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
		
	},
	

	////////////////////////////////////////////////////
	// Tech Stack Related Functions
	////////////////////////////////////////////////////
	
	listTechStacks  : (scope, filter) => {	
		
		return new Promise(function(resolve, reject) {
			techStackHandler.list(scope, filter)
				.then(function(result) {
					resolve(result);
			}).catch(err => reject(err));
		});
	},
	
	validateTechStack : (file) => {	
		return new Promise(function(resolve, reject) {
			techStackHandler.validate(file)
				.then(function(result) {
					resolve(result);
			}).catch(err => reject(err));
		});
	},
	
	registerTechStack : (yamlFile, scope) => {	
		return new Promise(function(resolve, reject) {
			if ( yamlFile == null )
				reject( status.error(null, "Invalid YAML file provided." ) );
			else {
				techStackHandler.register(yamlFile, scope == null ? constants.PRIVATE : scope)
				 .then(function(result) {
						resolve( result );
				}).catch(err => reject(err) );
			}
		});
	},
	
	stackOptions : (stack_name_or_id) => {
		return new Promise(function(resolve, reject) {
			techStackHandler.options(stack_name_or_id)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},
	
	downloadStack : (stack_name_or_id, output_file_path) => {
		return new Promise(function(resolve, reject) {
			techStackHandler.downloadStack( stack_name_or_id, output_file_path )
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},
	
	async deleteStack (stack_name_or_id) {
		return new Promise(function(resolve, reject) {
			techStackHandler.deleteStack(stack_name_or_id)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},
	
	promoteStack (stack_name_or_id) {
		return new Promise(function(resolve, reject) {
			techStackHandler.promoteStack(stack_name_or_id)
				.then(function(result) {
					resolve( result );
				}).catch(err => reject(err));
		});
	},

	demoteStack (stack_name_or_id) {
		return new Promise(function(resolve, reject) {
			techStackHandler.demoteStack(stack_name_or_id)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},

	////////////////////////////////////////////////////
	// Resource Related Functions
	////////////////////////////////////////////////////

	listResources : (scope, resourceType) => {	
		return new Promise(function(resolve, reject) {
			resourceHandler.list(scope, resourceType)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},

	registerResource : (resourceFile, uniqueName, type, cost, scope) => {	
		return new Promise(function(resolve,reject) {
			if ( resourceFile == null )
				reject( status.error(null, "Empty or invalid resource file provided." ));
			else if ( cost==null || Number(cost) === Number.NaN )
				reject( status.error(null, "Empty or invalid cost provided" ));
			else {
				resourceHandler.register(resourceFile, uniqueName, type, cost, scope == null ? constants.PRIVATE : scope)
					.then(function(result) {
						resolve( result );
				}).catch(err => reject(err));
			}
		});
	},
	
	downloadResource : (resource_name_or_id, output_file_path) => {
		return new Promise(function(resolve,reject) {
			resourceHandler.downloadResource( resource_name_or_id, output_file_path )
				.then(function(result) {
					resolve(result);
			}).catch(err => reject(err));
		});
	},
	
	deleteResource (resource_name_or_id)  {
		return new Promise(function(resolve,reject) {
			resourceHandler.deleteResource(resource_name_or_id)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
	},
	
	promoteResource (resource_name_or_id) {
		return new Promise(function(resolve,reject) {
			resourceHandler.promoteResource(resource_name_or_id)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
		
	},

	demoteResource (resource_name_or_id) {
		return new Promise(function(resolve,reject) {
			resourceHandler.demoteResource(resource_name_or_id)
				.then(function(result) {
					resolve( result );
			}).catch(err => reject(err));
		});
		
	},
	

	////////////////////////////////////////////////////
	// Project Related Functions
	////////////////////////////////////////////////////
	
	generateProject : (yamlFilePath, gitFile, appOptionsFile, modelIdentifier) => {	
		return new Promise(function(resolve, reject) {
			generateHandler.generateProject(yamlFilePath, gitFile, appOptionsFile, modelIdentifier)
				.then(function(result) {
					resolve( result );
				}).catch(err => reject(err));
		});
	},

	saveProject : (yamlFilePath, name) => {
		return new Promise(function(resolve,reject) {
			projectHandler.saveProject(yamlFilePath, name)
				.then(function(result) {
					resolve( result );
				}).catch(err => reject(err));
		});
	},

	
	////////////////////////////////////////////////////
	//Archive Related Functions
	////////////////////////////////////////////////////
	
	listApps : (scope) => {
		return new Promise(function(resolve, reject) {
			archiveHandler.listApps(scope)
				.then(function(result) {
					resolve( result );
				}).catch(err => reject(err));
		});
	},
	
	downloadApp : (app_name_or_id, output_file_path) => {
		archiveHandler.downloadApp(app_name_or_id, output_file_path)
			.then(function(result) {
				resolve( result );
			}).catch(err => reject(err));
	},
	
	deleteApp : (app_name_or_id) => {
		return new Promise(function(resolve,reject) {
			archiveHandler.deleteApp(app_name_or_id)
				.then(function(result) {
					resolve( result );
				}).catch(err => reject(err));
		});
	},
	
	promoteApp : (app_name_or_id) => {
		return new Promise(function(resolve,reject) {
			archiveHandler.promoteApp(app_name_or_id)
				.then(function(result) {
					resolve( result );
				}).catch(err => reject(err));
		});
	},

	demoteApp : (app_name_or_id) => {
		return new Promise(function(resolve,reject) {
			archiveHandler.demoteApp(app_name_or_id)
				.then(function(result) {
					resolve( result );
				}).catch(err => reject(err));
		});
	},


}