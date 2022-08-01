function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}


// Harbormaster specific
define("HARBORMASTER", "harbormaster");
define("HARBORMASTER_DOMAIN", "http://www.harbormaster.com");
define("HARBORMASTER_TOKEN", "harbormaster.token");
define("SERVER_CONFIG", "harbormaster.serverConfig");
define("AWS_S3_CONFIG", "harbormaster.awsS3Config");
define("QUIET_MODE", "QUIET_MODE");
define("PLATFORM_URL", "PLATFORM_URL");

// labels
define("SERVICE_REQUEST_TYPE_LABEL", "serviceRequestType");
define("TOKEN_LABEL", "token");

// service request types
define("CREATE_APP", "CREATE_APP");
define("DELETE_APP", "DELETE_APP");
define("DOWNLOAD_APP", "DOWNLOAD_APP");
define("TECH_STACK_PACKAGE_LIST", "TECH_STACK_PACKAGE_LIST");
define("MODEL_LIST", "MODEL_LIST");
define("RESOURCE_LIST", "RESOURCE_LIST");
define("TECH_STACK_PACKAGE_OPTIONS", "TECH_STACK_PACKAGE_OPTIONS");
define("ARCHIVED_APP_LIST", "ARCHIVED_APP_LIST");
define("SERVICE_LIST", "SERVICE_LIST");
define("VALIDATE_TOKEN", "VALIDATE_TOKEN");
define("VALIDATE_MODEL", "VALIDATE_MODEL");
define("VALIDATE_TECH_STACK", "VALIDATE_TECH_STACK");

define("REGISTER_MODEL", "REGISTER_MODEL");
define("REGISTER_TECH_STACK", "REGISTER_TECH_STACK");
define("REGISTER_RESOURCE", "REGISTER_RESOURCE");

define("CREATE_APP", "CREATE_APP");
define("GENERATE_APP", "GENERATE_APP");
define("DELETE_APP", "DELETE_APP");
define("GET_APP", "GET_APP");
define("S3SERVERURL", "s3ServerUrl");
define("S3USERDIR", "s3UsersDir");
define("GET_TECH_STACK", "GET_TECH_STACK");
define("GET_MODEL", "GET_MODEL");
define("GET_RESOURCE", "GET_RESOURCE");
define("DELETE_TECH_STACK", "DELETE_TECH_STACK");
define("DELETE_MODEL", "DELETE_MODEL");
define("DELETE_RESOURCE", "DELETE_RESOURCE");
define("PROMOTE_TECH_STACK", "PROMOTE_TECH_STACK");
define("PROMOTE_MODEL", "PROMOTE_MODEL");
define("PROMOTE_APP", "PROMOTE_APP");
define("PROMOTE_RESOURCE", "PROMOTE_RESOURCE");
define("DEMOTE_TECH_STACK", "DEMOTE_TECH_STACK");
define("DEMOTE_MODEL", "DEMOTE_MODEL");
define("DEMOTE_APP", "DEMOTE_APP");
define("DEMOTE_RESOURCE", "DEMOTE_RESOURCE");
define("REGISTER_PROJECT", "REGISTER_PROJECT");
define("USER_INFO", "USER_INFO");


////////////////////////
// return msg options
////////////////////////
define("SUCCESS", "SUCCESS");
define("ERROR", "ERROR");

////////////////////////
// msgs
////////////////////////
define("TOKEN_REQUEST_MSG", "Authenticating your token with Harbormaster.");
define("TOKEN_VALID_MSG", "Token authorized and Harbormaster is now ready to be used.");
define("TOKEN_ALREADY_VALID_MSG", "Token already authorized, Harbormaster ready to be used.");
define("TOKEN_VALIDATION_ERROR", "Unable to validate your token. Check the token and host Url if provided.  Also, verify the user type is at a high enough level.");
define("MODEL_LIST_REQUEST_MSG", "Retrieving a list of models." );
define("TECH_STACK_PKG_LIST_REQUEST_MSG", "Retrieving a list of tech stacks." );
define("RESOURCE_LIST_REQUEST_MSG", "Retrieving a list of resources." );
define("TECH_STACK_OPTIONS_REQUEST_MSG", "Retrieving tech stack package options.");
define("VALIDATE_TECH_STACK_REQUEST_MSG", "Validating tech stack %s on Harbormaster Host.");
define("VALIDATE_MODEL_REQUEST_MSG", "Validating model %s on Harbormaster Host.");
define("REGISTER_MODEL_REQUEST_MSG", "Publishing model %s on Harbormaster Host.");
define("REGISTER_TECH_STACK_REQUEST_MSG", "Publishing tech stack %s on Harbormaster Host.");
define("REGISTER_RESOURCE_REQUEST_MSG", "Publishing resource %s on Harbormaster Host.");
define("GENERATE_APP_REQUEST_MSG", "Generating project %s on Harbormaster Host. Please wait...");
define("APP_ARCHIVELIST_REQUEST_MSG", "Retrieving project archive info." );
define("DELETE_APP_REQUEST_MSG", "Deleting project from archive." );
define("DOWNLOAD_APP_REQUEST_MSG", "Downloading project from archive." );
define("DELETE_MODEL_REQUEST_MSG", "Deleting model." );
define("DELETE_RESOURCE_REQUEST_MSG", "Deleting resource." );
define("DOWNLOAD_MODEL_REQUEST_MSG", "Downloading model." );
define("DELETE_TECH_STACK_REQUEST_MSG", "Deleting tech stack." );
define("DOWNLOAD_TECH_STACK_REQUEST_MSG", "Downloading tech stack." );
define("DOWNLOAD_RESOURCE_REQUEST_MSG", "Downloading resource." );

define("TECH_STACK_VALIDATION_SUCCESS", "Tech stack validation was successful.");
define("TECH_STACK_REGISTRATION_SUCCESS", "Tech stack registration was successful.");
define("DOWNLOAD_COMPLETE", "Download complete.");
define("MAL_FORMED_OPTIONS_JSON_FILE", "Options file is not properly formed as a JSON structure. Validate its structure.");
define("PROMOTE_APP_REQUEST_MSG", "Promoting application from private to public scope.");
define("PROMOTE_MODEL_REQUEST_MSG", "Promoting model from private to public scope.");
define("PROMOTE_TECH_STACK_REQUEST_MSG", "Promoting tech stack from private to public scope.");
define("DEMOTE_APP_REQUEST_MSG", "Demoting application from public to private scope.");
define("DEMOTE_MODEL_REQUEST_MSG", "Demoting model from public to private scope.");
define("DEMOTE_TECH_STACK_REQUEST_MSG", "Demoting tech stack from public to private scope.");
define("APP_GENERATE_SUCCESS", "Application %s was generated, compiled, committed to GitHub, and archived." );
define("COMMAND_SUCCESS", "Successfully executed command %s");
define("COMMAND_ERROR", "Failed to execute command %s." );
define("USER_INFO_REQUEST_MSG", "Retrieving user information.");
define("PROJECT_SAVE_REQUEST_MSG", "Saving project" );

////////////////////////
// enums
////////////////////////

// output format
define("JSON_OUTPUT", 'json');
define("PRETTY_PRINT_OUTPUT", 'pretty');
define("NO_OUTPUT", "none");

// scope of request
define("PRIVATE", 'PRIVATE'); // the default for most to all calls likely
define("PUBLIC", 'PUBLIC');
define("COMMUNITY", 'COMMUNITY');

// AWS S3 Related
define("BUCKET", "bucket");
define("USER_ROOT_DIR", "/cli/users/");
define("PUBLIC_ROOT_DIR", "/public/");
define("TECH_STACK_DIR", "techstacks");
define("MODEL_DIR", "models");
define("RESOURCE_DIR", "resources");

// misc
define("GENERIC", "GENERIC");