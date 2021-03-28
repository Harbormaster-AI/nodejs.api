class Status {
	constructor() {
		this.theResultCode = "SUCCESS";
		this.theResult 	= "";
		this.theProcessingMessage = "";
	}

	get resultCode() {
		return this.theResultCode;
	}

	get result() {
		return this.theResult;
	}
	
	get processingMessage() {
		return this.theProcessingMessage;
	}

	set resultCode(val) {
		this.theResultCode = val;
	}

	set result(val) {
		this.theResult = val;
	}
	
	set processingMessage(msg) {
		this.theProcessingMessage = msg;
	}

	// Method
	success( result, processMsg) {
		this.theResultCode = "SUCCESS";
		this.theResult = result;
		this.theProcessingMessage = processMsg;
		return this.json();
	}
	
	error( result, processMsg) {
		this.theResultCode = "ERROR";
		this.theResult = result;
		this.theProcessingMessage = processMsg;
		return this.json();
	}
	
	json() {
		return { "resultCode":this.theResultCode, "result":this.theResult, "processingMessage":this.theProcessingMessage };
	}
}

module.exports = Status;