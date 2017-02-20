const basket = require("./basket");
const receiptGenerator = require("./receiptGeneratorText");
const getStdin = require('get-stdin');

getStdin().then(function(stdinData) {
	
	var list = stdinData.trim().split(/[\n\s,;]+/);

	list.forEach(function(item){
		if (item.match(/\w/)){
			basket.addItem(item);
		}
	});

	var cc = basket.getCostedContents();

	if (process.argv[2].match(/^json$/i)){
		console.log(JSON.stringify(cc));
	} else {
		console.log(receiptGenerator.getReceipt(cc));
	}
});

