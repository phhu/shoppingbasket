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

	console.log(receiptGenerator.getReceipt(cc));
});

