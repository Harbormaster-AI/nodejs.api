# realMethods Node.js API

A Node.js API to programmatically interact with the realMethods Platform.

Use realMethods to manage models and technology stacks to generate, commit, and archive fully functional applications.

Make code generation an essential up-front phase of your development processes.  

Bootstrap your next project with realMethods, generating all the core code and services your applications needs, but you likely do not want to write.

**Model support includes**:

- UML
- SQL Script
- JSON (realMethod custom)
- POJOs (jar file)
- Eclipse Modeling Framework (EMF)

**Current technology stacks support includes**:

- Spring Boot/Core
- Struts 2
- ASP.NET
- AWS Lambda
- Google Functions
- Spark Web Micro-framework
- In Development : __Ruby on Rails, Play, and DJango__

## Installation

```
npm install realmethods
```


## Getting Started

### Available Commands
All commands return a JSON structure containing the following fields:

- resultCode : SUCCESS or any other code indicating a failure in fulfilling the command.
- result : A JSON structure made up of the results for the command.  
- processingMessage : A message providing detail related to the outcome of the command execution.


### authenticate

Before using any of the realMethod services, you must authenticate using the token provided when you created an account on 
http://www.realmethods.com.  If you have not yet registered, you will need to do so first.

#### Example:

```
realmethods.authenticate(yourToken)
			.then(function(result) {
				console.log( result );
			}).catch(err => console.log(err));
```

-----------------

### User Commands

#### userInfo

Gets information about the signed in user.


#### Example:

```
realmethods.userInfo()
		.then(function(data) {
			console.log( data.result ); 
		});
		
{"name":"John Smith", "email":"john.smith@anycompany.com", "company":Any Company, Inc.", "usageLevel":"Professional"}
		
```

----------------------------

### Model Commands

#### listModel

Return a list of models.  Use the scope and filter options to return a more precise list.

#### Example:

```
realmethods.listModels(scope, filter)
	.then(function(data) {
		console.log(JSON.parse(data.result));

```

#### Options

- scope:   __public, private, community__  An empty value returns public and private.
- filter:  __emf, sqlscript, uml, xmi, pojo, json__ An empty value returns all.

------------------------

#### validateModel

Validate a model for possible usage later on for application generation.  A model is not made available until it has been published.

#### Example:

```
realmethods.validateModel(file_path)
	.then(function(data) {
		console.log(data);
	});
```

#### Options

- file_path: the path to the model file.

----------------------------

#### registerModel

Publish a model to make it available to others (public) and to make it available for application generation.

Publish a model using a YAML directives file. Scope: public or private[default].

#### Example:

```
realmethods.registerModel(yaml_file, scope)
		.then(function(data) {
			console.log(data);
		}).catch(err => console.log(err));
```

#### Options

- yaml_file - Path to the YAML file that includes the model registration directives

`<version:            1.0
saveParams:
    name:           CR Entity Model
    description:    Customer relations Eclipse Modeling Framework (EMF) model
modelPath:          ./samples/models/
modelFile:			customer.relations.ecore>`	

- scope - Register the model as public or private [default].

----------------------------

#### downloadModel

Download a model file.  Only owned public models can be downloaded.

#### Example:

```
realmethods.downloadModel(model_id, output_file_path)
		.then(function(data){
			console.log(data);
		}).catch(err => console.log(err));
```

#### Options

- model_id - The unique identifier for the model
- output_file_path - The path and file to copy the model into.
 
----------------------------

#### promoteModel

Any private model can be promoted to public.  Making it public allows it to be accessed by the others. 

#### Example:

```
realmethods.promoteModel(id)
	.then(function(data){
		console.log(data);
	}).catch(err => console.log(err));
```

#### Option

- id : the unique identifier of the model

----------------------------

#### demoteModel

An owned public model can be demoted to private.  

#### Example:

```
realmethods.demoteModel(id)
	.then(function(data){
		console.log(data);
}).catch(err => console.log(err));
```

#### Option

- id : the unique identifier of the technology stack

----------------------------

#### deleteModel

Use to delete a model.  Can only delete a private model.  

Deletion cannot be undone.

#### Example:

```
realmethods.deleteModel(id)
	.then(function(data){
		console.log(data);
	}).catch(err => console.log(err));

```

#### Option

- id : the unique identifier of the model

---------------------

### Technology Stack Commands

#### listStack

List available technology stacks.

Scope: _public, private, community_
Filter: _serverless, webapp, restfulapi, mobile_

An empty scope value returns both your private and public technology stacks.
An empty filter value returns all technology stack types.

#### Example:

```
realmethods.listStack(scope, filter)
	.then(function(data) {
		console.log(JSON.parse(data.result));
	}).catch(err => console.log(err));

```

#### Options

- scope:   __public, private, community__  
- filter:  __emf, sqlscript, uml, pojo, json__

------------------------

#### validateStack

Validate a technology for possible usage later on for application generation.  

A technology stack is not made available until is has been published. To understand the contents of a technology stack package file, 
consider downloading and unzipping one.

#### Example:

```
realmethods.validateStack(stackZipFilepath)
	.then(function(data) {
		console.log(data);
	});
```

#### Options

- stackZipFilepath: The path to the technology stack package (ZIP) file.

----------------------------

#### registerTechStack

Register a technology stack package to make it available for application generation.

Register uses YAML directives. Scope: public or private[default].

#### Example:

```
realmethods.registerTechStack(yaml_file, scope)
		.then(function(data) {
			console.log(data);
		}).catch(err => console.log(err));
```

#### Options

- yaml_file - Path to the YAML file that includes the registration directives

`version:            1.0
saveParams:
    name:           AWS Lambda RDS Upgraded
    description:    Sprint 2 version of Bowling EMF
stackPath:          ./samples/techstacks/
stackFile:			AWS_Lambda_RDS_Upgraded.zip`	

- scope - Register the technology stack as public or private [default].

----------------------------

#### downloadStack

Download a technology stack package file.  Only an owned or public technology stack packages can be downloaded.

#### Example:

```
realmethods.downloadStack(stack_id, output_file_path)
		.then(function(data){
			console.log(data);
		}).catch(err => console.log(err));
```

#### Options

- stack_id - The unique identifier for the model
- output_file_path - The path and file to copy the model into.
 
----------------------------

#### promoteStack

An owned private technology stack can be promoted to public.  

Making it public allows it to be accessed by others. 

#### Example:

```
realmethods.promoteStack(id)
	.then(function(data){
		console.log(data);
}).catch(err => console.log(err));
```

#### Option

- id : the unique identifier of the technology stack package

----------------------------

#### demoteStack

An owned public technology stack package can be demoted to private.  

#### Example:

```
realmethods.demoteStack(id)
	.then(function(data){
		console.log(data);
}).catch(err => console.log(err));
```

#### Option

- id : the unique identifier of the technology stack package

----------------------------

#### deleteStack

Use to delete a technology stack package.  Can only delete a private technology stack package.  

Deletion cannot be undone.

#### Example:

```
realmethods.deleteStack(id)
	.then(function(data){
		console.log(data);
}).catch(err => console.log(err));

```

#### Option

- id : the unique identifier of the technology stack package

----------
#### stackOptions

Each technology stack has a set of customizable options that are applied during code generation.

Download, modify, and provide these options during code generation.  

#### Example:

```
realmethods.stackOptions(id)
	.then(function(data){
		console.log(data);
}).catch(err => console.log(err));


```

#### Option

- id : the unique identifier of the technology stack

----------

### Application Commands

----------------------------

#### generateApp

Generates an application using the directives of a YAML file. 

This YAML file allows the description of an application generation directive including a model identifier, technology stack identifier, Git options and more.

A model identifier can be either a model YAML file or an ID of an already published model file.

#### Example:

```
realmethods.generateApp(yaml_file)
	.then(function(data){
		console.log(data);
}).catch(err => console.log(err));
```

#### Option

- yaml_file - path and name of the YAML file.

-------------------

#### downloadApp

Download a previously generated archived application ZIP file.  Only owned or public application archives can be downloaded.

#### Example:

```
realmethods.downloadApp(app_id, output_file_path)
	.then(function(data){
		console.log(data);
}).catch(err => console.log(err));
```

#### Options

- app_id - The unique identifier of a generated application archive (ZIP) file.
- output_file_path - The name and location to download the application into.

----------------------------

#### Delete an Application

Delete a previously generated private application archive.  

#### Example:

```
realmethods.deleteApp(id)
	.then(function(data){
		console.log(data);
}).catch(err => console.log(err));
```

#### Option

- id - The unique identifier of a generated application archive.

----------------------------

#### promoteApp

Promote an application from private scope to public. 

#### Example:

```
realmethods.promoteApp(id)
	.then(function(data){
		console.log(data);
}).catch(err => console.log(err));
```

#### Option

- id - The unique identifier of a generated application archive.

----------------------------

#### promoteApp

Demote an application from public scope to private.  

#### Example:

```
realmethods.demoteApp(id)
	.then(function(data){
		console.log(data);
}).catch(err => console.log(err));
```

#### Option

- id - The unique identifier of a generated application archive.

----------------------------

#### listApps

List previously generated applications that have been archived.

```
realmethods.listApps(scope)
	.then(function(data){
		console.log(JSON.parse(data.result));
}).catch(err => console.log(err));
```

#### Option

-scope: _public, private, or community_. An empty value returns all public and private.

------------------------

## Important YAML Configuration Files

As outlined above, certain commands require a YAML file.  The following details the structure of each YAML file.

### Git Configuration Parameters

This YAML file contains one or more groupings of parameters to control committing an application's files (code, Maven files, Dockerfile, etc..) to GitHub.  This file is referenced by an application generation YAML file.  

Example Contents:

```
gitParams:
  - name:          bitbucket_test
	username:      xxxxxxxxx
	password:      xxxxxxxxx    
	repository:    bb-demo  # public repository
	tag:           latest
	host:          bitbucket.org
	
  - name:          git-hub-test 
	username:      xxxxxxxxx
	password:      xxxxxxxxx    
	repository:    github-demo # public repository
	tag:           latest
	host:          github.com
	```

View an example within the installed package in sub-directory _./samples/github/_

### Application Generation Configuration Parameters

This YAML file contains the directives required to generate an application using a specified model, technology stack, application options, and GitHub entry of an entry found in a specified YAML file.

Example Contents:

```
apps:
    - techStackId:       3
      modelId:           1
      appOptionsFile:    ./samples/options/aws.lambda.rdbms.options.json
      gitHubParams:      
         entry:          app-1-params
         file:           ./samples/github/demo.github.params.yml
      saveParams:
         name:           Bowling App v0.01
         description:    Sprint 1 version of Serverless using Bowling EMF Model

    - techStackId:       AWSLambdaRDS
      modelId:           2
      appOptionsFile:    ./samples/options/aws.lambda.rdbms.options.json
      gitHubParams:      
         entry:          app-2-params
         file:           ./samples/github/demo.github.params.yml
      saveParams:
         name:           Bowling App v0.02
         description:    Sprint 2 version of Serverless using Bowling EMF Model

```

View an example within sub-directory _./samples/yamls/_

### Stack and Model Publish Parameters

This YAML file contains the location of the reference file to publish, along with save and version related details.

Example Contents:

```
version:            1.0
saveParams:
    name:           AWS Lambda RDS Upgraded
    description:    Sprint 2 version of Bowling EMF
stackPath:          ./samples/techstacks/
stackFile:			AWS_Lambda_RDS_Upgraded.zip
```
View an example within sub-directory  _./samples/yamls/_

