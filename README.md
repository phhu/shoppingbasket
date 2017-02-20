This is a simple shopping basket written in node.js

It accepts items as specified in src/itemspecs.js - garlic, apple, orange, papaya - and generates a receipt (or JSON data) detailing the cost.

Install
=======

Download and then run 

```npm install```

Usage
=====

Command line / node.js 
======================

Pipe a list of items (space / comma / semi-colon / newline separated) to src/shoppingbasketcli.js 

```echo orange orange papaya,garlic | node src/shoppingbasketcli.js```
 
Alternatively you can send arguments to src/shoppingbasket.js (space / comma / semi-colon separated) 

```node src/shoppingbasket.js orange,apple, garlic papaya papaya papaya```

Browser
=======

Altenatively browse the index.html file for a working example in the browser.

https://cdn.rawgit.com/phhu/shoppingbasket/master/index.html

Tests
=====

Some basic mocha / chai tests are in the tests folder

```npm run test```

Build
=====

Browserify and uglify are used to create the version for the browser

```rpm run build```
