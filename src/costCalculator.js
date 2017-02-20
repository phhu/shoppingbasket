module.exports = function(itemSpecs,contents){
	//basic structure to return
	var cc = {
		items:[],
		totalWithoutDiscount: 0,
		totalDiscount: 0,
		total: 0
	};

	//do costings for each item in contents
	Object.keys(contents).forEach(function(item){
		var cost = contents[item] * itemSpecs[item].price;	
		cc.totalWithoutDiscount += cost;		
		
		var itemDetails = {
			"name": item,
			"quantity": contents[item],
			"unitPrice": itemSpecs[item].price,
			"cost":cost
		};

		//do discount if there is one
		if (itemSpecs[item].discountFunction && typeof(itemSpecs[item].discountFunction) === 'function'){
			itemDetails.discount = itemSpecs[item].discountFunction(contents[item]);
			
			//add discount to discount total
			if (itemDetails.discount && itemDetails.discount.amount){
				cc.totalDiscount += itemDetails.discount.amount;
			}
		}

		cc.items.push(itemDetails);
	});

	cc.total = cc.totalWithoutDiscount - cc.totalDiscount;
	return cc;
};