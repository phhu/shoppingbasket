const {
    curry, curryN, __
    ,reduce, map, mapObjIndexed
    ,pipe, compose ,converge, juxt, reject, omit, unnest
    ,ifElse,where, isEmpty
    ,concat, join, countBy
    ,gt, divide, add, subtract, multiply
    ,trim, toLower, replace, toUpper
    ,has,prop, values, keys, defaultTo, evolve
    ,always, identity ,tap
  } = require('ramda')
  ,sprintf= curryN(2,require('sprintf-js').sprintf)
;

// *** support funcs
const reduceWith = curry((combiner,seed, fn) => reduce((acc,i)=>combiner(acc,fn(i)), seed));
const reduceWithAdd = reduceWith(add,0);
const reduceWithConcat = reduceWith(concat,'');
// passes an argument to an array of transforms and concatenates the resulting array
const joinTranformResults = transforms => pipe(juxt(transforms),join(''));
//logging
const toJSON = curryN(3,JSON.stringify)(__,null,2);
const log = tap(pipe(toJSON,console.log));

// *** list to basket
const toString = concat('');
const tidyItem = pipe(toString,toLower,trim);
const listToBasket = countBy(tidyItem);

// *** basket Checker  - impure 
const err = invalids => console.error(
  `\x1b[31m%s\x1b[0m`     // colour red
  ,`Invalid items will be ignored: ${invalids.join(" ")}`
);
const basketChecker = spec => unnest(pipe(
  keys
  ,reject(has(__,spec))
  ,ifElse(isEmpty,always([]),tap(err))
  ,omit
));

// *** basket calculator - given a basket, return array with cost and discount
const discounter = ({cost, discountEvery:n=0}) => count => 
	n === 0 ? 0 : cost * Math.floor(count / n);
const calculateItem = spec => (count,item/*,basket*/) => ({
  item
  ,count
  ,valid: has(item, spec) 
  ,cost: multiply(spec[item].cost)(count) 
  ,discount: discounter(spec[item])(count)
  ,discountName: spec[item].discountName
});
const basketCalculator = pipe(calculateItem,mapObjIndexed);

// *** make receipt lines
const costLessDiscount = converge(subtract,[prop('cost'),prop('discount')]);
const basketTotal = reduceWithAdd(costLessDiscount);
const lineSpecs = {
  item:{
    format:'%(item)-21s %(count)3d %(cost)7.2f\n'
    ,mapping: evolve({cost:divide(__,100),item:replace(/^./, toUpper)}) 
  }
  ,discount: {
    format:'* %(discountName)-23s %(discount)7.2f\n', 
    mapping: evolve({discount:divide(__,-100),discountName:defaultTo('Discount')})
  }
  ,preTotal: {
    format:" ".repeat(26) + '=======\n', 
    mapping: identity
  }
  ,total: {
    format:'TOTAL %27.2f\n', 
    mapping: pipe(basketTotal,divide(__,100))
  }
};
const receiptLine = converge(pipe, [
  prop('mapping')
  ,pipe(prop('format'),sprintf)
]);
const line = map(receiptLine,lineSpecs);

// *** assemble receipt 
const optionalLine = (test, fn) => ifElse(where(test), fn, always(''));
const receiptLines = pipe(joinTranformResults,reduceWithConcat);
const receiptText = joinTranformResults([
  receiptLines([
    line.item
    ,optionalLine({discount:gt(__,0)},line.discount)
  ])
  ,line.preTotal
  ,line.total
]);

// *** receipt maker 
const receiptMaker = spec => pipe(
	listToBasket, 
  basketChecker(spec),
	basketCalculator(spec), 
	values,	// object of objects to array of objects
	receiptText
);

// *** data
const itemSpecs = {
	'apple':  {cost: 25},
	'orange': {cost: 30},
	'garlic': {cost: 15},
	'papaya': {cost: 50	,discountEvery: 3	,discountName: 'Discount 3 for 2'},
};
const list = ['apple','Apple', 'orange','papaya','papaya','papaya','papaya','somethingElse'];

console.log(receiptMaker(itemSpecs)(list));
