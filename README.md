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

Tests
=====

Some basic mocha / chai tests are in the tests folder

```npm run test```

Build
=====

Browserify and uglify are used to create the version for the browser

```npm run build```
