This is a simple shopping basket written in node.js

It accepts items as specified in src/itemspecs.js - garlic, apple, orange, papaya

Install
=======

Download and then run 

 npm install

Usage
=====

Command line / node.js 
======================

Pipe a list of items (space / comma / semi-colon separated) to src/shoppingbasketcli.js 

 echo orange orange papaya,garlic | node src/shoppingbasketcli.js
 
Alternatively you can send arguments to rc/shoppingbasket.js

 node src/shoppingbasket.js orange,apple, garlic papaya papaya papaya

Browser
=======

Altenatively browse the index.html file for a working example in the browser.

https://cdn.rawgit.com/phhu/shoppingbasket/master/index.html
