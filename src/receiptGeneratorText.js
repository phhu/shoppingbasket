const sprintf= require('sprintf-js').sprintf;

//used to display items with capitlised first letter
//as they are stored internally in lower case
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
	"getReceipt": function(data){
		var s = "";
		
		s += "Basket receipt\n";
		s += "==============\n";
		s += "\n";
		s += sprintf('%-16s %s   %s\n','Product', 'Quantity', 'Total');
		s += sprintf('%-16s %s   %s\n','-------', '--------', '-----');

		data.items.forEach(function(item){
			s += sprintf('%-21s %3d %7.2f \n',  capitalizeFirstLetter(item.name), item.quantity, item.cost/100);
			if (item.discount && item.discount.amount > 0){
				s += sprintf(
					'%-21s %3d %7.2f\n',  
					"* " + (item.discount.name || "Discount"), 
					item.discount.quantity || 1, 
					item.discount.amount/-100
				);

			}
		});

		if (data.totalDiscount && data.totalDiscount>0){
			s += sprintf('\n%-25s %7.2f\n','Total without discounts',data.totalWithoutDiscount/100);
			s += sprintf('%-25s %7.2f\n','Total discounts',data.totalDiscount/-100);
		}

		s += sprintf('\n%-25s %7.2f','TOTAL',data.total/100);

		return s;
	}
};
