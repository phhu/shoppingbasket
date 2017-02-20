module.exports = {
	"apple": {
		"price": 25
	},
	"orange": {
		"price":30
	},
	"garlic": {
		"price":15
	},
	"papaya": {
		"price":50,
		"discountFunction": function(quantity){
			var quantity = Math.floor(quantity/3);
			var amount = quantity * this.price;
			if (quantity > 0){ 
				return {
					"quantity": quantity,
					"amount": amount,
					"name": "Papaya 3 for 2"
				};
			} else {
				return undefined;
			}
		}
	}
};