var GBAPI = function()
{	
	this.targetFile = "https://gr08642576.com/Scores.php";
	this.sharedKey = null;
	this.lastEncryption = false;
	this.defaultPerPage = 20;
	this.defaultPageNumber = 1;
}

GBAPI.prototype = new GBAPI;

GBAPI.prototype.setSharedKey = function(key)
{
	this.sharedKey = key;
}

GBAPI.prototype.sendScore = function(parameters, callBack)
{
	if(!this._keyIsValid()) return;
		
	var delim = " .|:=-=:|. ";
	var name = Aes.Ctr.encrypt(parameters.name, this.sharedKey, 256);
	var score = Aes.Ctr.encrypt(parameters.score, this.sharedKey, 256);
	var encrypted = Aes.Ctr.encrypt(name + delim + score, this.sharedKey, 256);
	var parameters =
	{
		val : encrypted
	}

	this.lastEncryption = parameters;

	this._makeCall('add', parameters, callBack);
}

GBAPI.prototype.getScores = function(parameters, callBack)
{
	parameters.perPage = parameters.perPage || this.defaultPerPage;
	parameters.pageNumber = parameters.pageNumber || this.defaultPageNumber;

	this._makeCall('get', parameters, callBack);	
}

GBAPI.prototype._makeCall = function(func, parameters, callBack)
{
	var that = this;

	qwest.post(this.targetFile, 
	{
		f : func,
		params : JSON.stringify(parameters)
	},
	{
		type : 'json'
	}).success(function(response)
	{
		if(typeof(callBack) === "function")
		{
			callBack(response);
		}

	}).error(function(message)
	{	
		console.log("AJAX ERROR ::");
		console.log(message);
	});
}

GBAPI.prototype._keyIsValid = function()
{
	if(this.sharedKey === null || this.sharedKey === '' || typeof(this.sharedKey) === "undefined") 
	{
		console.log("ERROR :: No shared key found, aborting.");
		return false;
	}

	return true;
}