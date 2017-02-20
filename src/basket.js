var itemSpecs = require('./itemSpecs');
var costCalculator = require('./costCalculator');

//This contains item counts: e.g. {"apple":3, "orange":4}
var contents = {};

//used to validiate and standardise name.
// Lower case names are used internally for simplicity
function checkName(name){
	var n = name.toLowerCase().trim();
	if (itemSpecs[n]){
		return n;
	} else {
		return false;
	}
};

// add an api reference to allow chaining
var api = module.exports = {
	"empty": function(){
		contents = {};
		return api;
	},
	"addItem": function(name){
		var n = checkName(name);
		if (!n){
			//throw "Invalid item, cannot be added to basket:" + name;
			console.log("Invalid item, cannot be added to basket:" + name);
			return api; //ignore invalid items
		}
		if (!contents[n]){
			contents[n] = 1;
		} else {
			contents[n] += 1
		} 
		return api;
	},
	"removeItem": function(name){
		var n = checkName(name);
		if (!n){
			//throw "Invalid item, cannot be removed from basket:" + name;
			console.log("Invalid item, cannot be removed from basket:" + name);
			return api; //ignore invalid items
		}
		if (contents[n] && contents[n] > 0){
			contents[n] -= 1;
		} 
		if (contents[n] < 1){contents[n] = undefined;}
		return api;
	},
	"getContents": function(){
		//return a copy rather than the actual object
		return JSON.parse(JSON.stringify(contents));
	},
	"getCostedContents": function(){
		return costCalculator(itemSpecs,this.getContents());
	}
}

