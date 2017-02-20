const basket = require("./basket");
const receiptGenerator = require("./receiptGeneratorText");
//default list in case one is not entered

list = process.argv.slice(2).join(" ").trim().split(/[\n\s,;]+/);

list.forEach(function(item){
	if (item.match(/\w/)){
		basket.addItem(item);
	}
});

//expose basket and receipt generator if we're in the browser
try {
	if (window != undefined){
		window.basket = basket;
		window.receiptGenerator = receiptGenerator;
	}
} catch(e){}

var cc = basket.getCostedContents();

console.log(receiptGenerator.getReceipt(cc));


