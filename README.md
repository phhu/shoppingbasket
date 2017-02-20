This is a simple shopping basket written in node.js

It accepts items as specified in src/itemspecs.js - garlic, apple, orange, papaya - and generates a receipt (or JSON data) detailing the cost.

```
Basket receipt
==============

Product          Quantity   Total
-------          --------   -----
Papaya                  3    1.50 
* Papaya 3 for 2        1   -0.50
Orange                  2    0.60 
Garlic                  1    0.15 

Total without discounts      2.25
Total discounts             -0.50

TOTAL                        1.75
```

Install
=======

Download and then run 

```npm install```

Usage
=====

Command line / node.js 
======================
You can send arguments to src/shoppingbasket.js (space / comma / semi-colon separated) 

```node src/shoppingbasket.js orange,apple, garlic papaya papaya papaya```

Alternatively pipe a list of items (space / comma / semi-colon / newline separated) to src/shoppingbasket_stdin.js 

```echo orange orange papaya,garlic | node src/shoppingbasket_stdin.js```

Specify a JSON argument with this to get the output in JSON instead:

```echo orange orange papaya,garlic | node src/shoppingbasket_stdin.js json```

Browser
=======

Altenatively browse the index.html file for a working example in the browser.

https://cdn.rawgit.com/phhu/shoppingbasket/master/index.html

From the browser console ```basket``` and ```receiptGenerator``` objects are available.

```
basket.empty().addItem("garlic").addItem("orange").removeItem("orange").addItem("papaya");
console.log(basket.getContents());
console.log(receiptGenerator.getReceipt(basket.getCostedContents()));
```

Tests
=====

Some basic mocha / chai tests are in the tests folder

```npm run test```

Build
=====

Browserify and uglify are used to create the version for the browser

```npm run build```
