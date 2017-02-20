const chai = require('chai');
const expect = chai.expect;

const basket = require('../src/basket.js');
const receiptGenerator = require("../src/receiptGeneratorText");

//it's useful to be able to refer to items by name
function addItemsByName(c){
    c.itemsByName = {};
    c.items.forEach(function(item){
        c.itemsByName[item.name] = item;
    });
}

var list = ["apple","garlic","papaya","papaya","papaya","papaya","papaya","papaya","papaya"];

list.forEach(function(item){basket.addItem(item);})

var c = basket.getCostedContents();
addItemsByName(c);
//console.log(c);

it('should count items correctly', function(done) {
	// 	_.find(c, function (item) { return item.name === 'join' });
    expect(c.itemsByName.apple.quantity).to.equal(1);
    expect(c.itemsByName.papaya.quantity).to.equal(7);
    expect(c.itemsByName.garlic.quantity).to.equal(1);
    //expect(c.itemsByName.orange.quantity).to.equal(0);
    done();
});

it('should calculate item totals correctly', function(done) {
    expect(c.itemsByName.apple.cost).to.equal(c.itemsByName.apple.quantity * 25);
    expect(c.itemsByName.papaya.cost).to.equal(7 * 50);
    expect(c.itemsByName.garlic.cost).to.equal(1 * 15);
    //expect(c.orange.total).to.equal(0);
    done();
});

it('should apply discounts correctly', function(done) {
    expect(c.itemsByName.papaya.discount.amount).to.equal(2 * 50);
    done();
});

it('should calculate the totals correctly', function(done) {
    expect(c.total).to.equal(290);
    expect(c.totalWithoutDiscount).to.equal(390);
    expect(c.totalDiscount).to.equal(100);
    done();
});

it('should produces a receipt', function(done) {
   	var receipt = receiptGenerator.getReceipt(c);
    expect(receipt).to.match(/^Basket Receipt[\s\S]*TOTAL[\s\S]*$/i);
    done();
});

it('should apply a discount on papayas', function(done) {
    basket.empty().addItem("papaya").addItem("papaya").addItem("papaya");
    var c = basket.getCostedContents();
    addItemsByName(c);
    expect(c.total).to.equal(100);
    expect(c.itemsByName.papaya.quantity).to.equal(3);
    expect(c.itemsByName.papaya.discount.amount).to.equal(50);
    expect(c.totalDiscount).to.equal(50);
    //expect(c.itemsByName.orange.quantity).to.equal(0);
    done();
});

it('should not apply a discount to papayas when there are only two', function(done) {
    basket.empty().addItem("papaya").addItem("papaya");
    var c = basket.getCostedContents();
    addItemsByName(c);

    expect(c.total).to.equal(100);
    expect(c.itemsByName.papaya.quantity).to.equal(2);
    expect(c.itemsByName.papaya.discount).to.equal(undefined);
    expect(c.totalDiscount).to.equal(0);
    //expect(c.orange.total).to.equal(0);
    done();
});
