const requestHandler	= require('./requesthandler');
const _           		= require('lodash');
var constants 			= require("./constants");
const Configstore 		= require('configstore');
const conf 				= new Configstore(constants.HARBORMASTER);
const Status 			= require("./status");

self = module.exports = {

	// handles checking the local configuration storage if the token exists in it, if so
	// the user has already been authenticated. For added security, the discovered key should
	// then be authenticated against the back end
	authenticated: () => {
		//conf.set(constants.HARBORMASTER_TOKEN, null); // for testing only to reset to retest authentication
		var token = conf.get(constants.HARBORMASTER_TOKEN);
		if( token == null ) 	
			return false;
		else 
			return true;
	},
	
	authenticate: (token, callback) => {
		const input = requestHandler.packageInput( token, constants.VALIDATE_TOKEN );
		return requestHandler.handleRequest( input, constants.TOKEN_REQUEST_MSG, callback );
	},

	userInfo: () => {
		return new Promise(async function(resolve, reject) {
			const input = requestHandler.packageInputAddToken(constants.USER_INFO);
		
			return requestHandler.handleRequest( input, constants.USER_INFO_REQUEST_MSG, function(err, data) {
				if ( err ) {
					reject( new constants.Status().error(err,
											util.format(constants.COMMAND_ERROR, constants.USER_INFO)));
				} else if ( data != null ){
					resolve(data);
				}
			});
		});
	},
	
	getToken : () => {
		   return conf.get(constants.HARBORMASTER_TOKEN);
	},
	
	storeToken : (token) => {
		conf.set(constants.HARBORMASTER_TOKEN, token);
	},
	
	deduceDir : (scope, appendDir) => {
		var s3Path = (scope == constants.PUBLIC ? constants.PUBLIC_ROOT_DIR : constants.USER_ROOT_DIR);
		s3Path = s3Path + conf.get(constants.HARBORMASTER_TOKEN) + '/' + appendDir;

		return s3Path;
		
	}
}
