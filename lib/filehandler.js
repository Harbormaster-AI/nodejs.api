var constants 			= require("./constants");
var fileHandler			= require('./filehandler');
var AWS 				= require('aws-sdk');
var fs 					= require('fs');
var config 				= require('config');
const Configstore 		= require('configstore');
const conf 				= new Configstore(constants.HARBORMASTER);
var util 				= require('util');
var request 			= require('request');
var path 				= require('path');

fileHandler = module.exports = {

	uploadToS3Bucket: (file, remotePath) => { 
		return new Promise(function(resolve, reject) {
		
	        // if file is a URL, use it as is
	        if ( file.startsWith( "http" ) == true ) {
	        	resolve( file );
	        } // otherwise upload it to the common S3 bucket and return the URL of the object
			else {
				var awsConfig 	= config.get(constants.AWS_S3_CONFIG);
				var s3 			= fileHandler.configureS3();			
				// call S3 to retrieve upload file to specified bucket
				var uploadParams = {Bucket: awsConfig.bucket + remotePath, 
									Key: '', 
									Body: '', 
									ACL: 'public-read'};

				fileStream 	= fs.createReadStream(file);
				uploadParams.Body = fileStream;
	
				// apply the file as a path as the key
				uploadParams.Key 	= path.basename(file);

				s3.upload (uploadParams, function (err, data) {				
					if (err) {
						reject( err);
					} else if (data) {
						resolve( data.Location );
					}
				});	
			}
		});
	},		
	
	removeFromS3Bucket: (file) => {

		// remove the file from the goframework s3 bucket
		var awsConfig 	= config.get(constants.AWS_S3_CONFIG);
		var s3 			= fileHandler.configureS3();

		// likely have to strip the bucket URL prefix from the file arg

		var params = {
	            Bucket: awsConfig.bucket,
	            Key: file
	    };
	    
		s3.deleteObject(params, function (err, data) {
	        if (err) {
	            console.log("Problem deleting file from AWS S3 bucket." + err);
	        }
	    });
	},

	downloadFromS3Bucket: (fileKey, outputFileAndPath) => {
		// remove the file from the goframework s3 bucket
		var awsConfig 	= config.get(constants.AWS_S3_CONFIG);
		var s3 			= fileHandler.configureS3();
		
		// likely have to strip the bucket URL prefix from the file arg
		
	    var params = {
	            Bucket: awsConfig.bucket,
	            Key: fileKey
	    };
	    
	    var file = fs.createWriteStream(outputFileAndPath);
	    s3.getObject(params).createReadStream().pipe(file);
	},

	configureS3: ()  => {
		// configuring the AWS environment

		var awsConfig 	= config.get(constants.AWS_S3_CONFIG);
		AWS.config.update({
			region: awsConfig.region,
			accessKeyId: awsConfig.accessKeyId.split("").reverse().join(""),
			secretAccessKey: awsConfig.secretAccessKey.split("").reverse().join("")
		});
		
		// Create S3 service object
		var s3 = new AWS.S3({apiVersion: awsConfig.apiVersion});
		return( s3 );
	},
	
	loadYMLToJSON: (ymlFilePath, callback) => {
		const yaml = require('js-yaml');
		const fs = require('fs');
		try {
		    const yml = yaml.safeLoad(fs.readFileSync(ymlFilePath, 'utf8'));
		    callback(null, yml);
 		} catch (e) {
			console.log("ymlFilePath=" + ymlFilePath + ", " + e);
		    callback(e, null)
		}
	},
	
	loadFileToJSON: (jsonFilePath, callback ) => {
		const fs = require('fs');
		try {
			const json = JSON.parse( fs.readFileSync( jsonFilePath ) );
			callback(null, json);
		} catch (e) {
			console.log('Failure in loadFileToJSON' + e);
		    callback(e, null)
		}
	},
	
	internalUploadHelper: (file, remotePath, deleteWhenDone, resolve, reject) => {
		var awsConfig 	= config.get(constants.AWS_S3_CONFIG);
		var s3 			= fileHandler.configureS3();			
		// call S3 to retrieve upload file to specified bucket
		var uploadParams = {Bucket: awsConfig.bucket + remotePath, 
							Key: '', 
							Body: '', 
							ACL: 'public-read'};

		fileStream 	= fs.createReadStream(file);
		uploadParams.Body = fileStream;
	
		// apply the file as a path as the key
		uploadParams.Key 	= path.basename(file);

		s3.upload (uploadParams, function (err, data) {
			if ( deleteWhenDone == true )
				fs.unlinkSync( file );
				
			if (err) {
				reject( err);
			} else if (data) {
				resolve( data.Location );
			}
		});
	
	}
}
