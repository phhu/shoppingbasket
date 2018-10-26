const {
    curry, curryN, __
    ,reduce, map, mapObjIndexed
    ,pipe, compose ,converge, juxt, reject, omit, unnest
    ,ifElse,where, isEmpty
    ,concat, join, countBy
    ,gt, divide, add, subtract, multiply
    ,trim, toLower, replace, toUpper
    ,has,prop, propOr, values, keys, defaultTo, evolve
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

// *** basket Checker  
const logInvalidItems_Impure = invalids => console.error(
  '\x1b[31m%s\x1b[0m'     // colour red
  ,`Invalid items will be ignored: ${invalids.join(" ")}\n`
);
const basketChecker = spec => unnest(pipe(
  keys
  ,reject(has(__,spec))
  ,ifElse(isEmpty,identity,tap(logInvalidItems_Impure)) 
  ,omit
));

// *** basket calculator - given a basket, return array with cost and discount
const discounter = ({cost, discountEvery:n=0}) => count => 
	n === 0 ? 0 : cost * Math.floor(count / n);
const calculateItem = spec => (count,item/*,basket*/) => ({
  item
  ,count
  ,unitCost: spec[item].cost
  ,cost: multiply(spec[item].cost)(count) 
  ,discount: discounter(spec[item])(count)
  ,discountName: spec[item].discountName
});
const basketCalculator = pipe(calculateItem,mapObjIndexed);

// *** make receipt lines
const toPounds = divide(__,100);
const capitalise = replace(/^./, toUpper);
const costLessDiscount = converge(subtract,[prop('cost'),prop('discount')]);
const basketTotal = reduceWithAdd(costLessDiscount);
const lineSpecs = {
  header:    {format:`ITEM ${' '.repeat(16)} UNIT CNT    COST\n`}
  ,subHeader:{format:`---- ${' '.repeat(16)} ---- ---    ----\n`}
  ,item:{
    format:'%(item)-21s %(unitCost)3.2f %(count)3d %(cost)7.2f\n' 
    ,mapping: evolve({
      cost:toPounds
      ,unitCost: toPounds
      ,item: capitalise
    }) 
  }
  ,discount: {
    format:'* %(discountName)-28s %(discount)7.2f\n', 
    mapping: evolve({discount:pipe(x=>-x,toPounds),discountName:defaultTo('Discount')})
  }
  ,preTotal: { 
    format:" ".repeat(31) + '=======\n', 
  }
  ,total: {
    format:'TOTAL %32.2f\n', 
    mapping: pipe(basketTotal,toPounds)
  }
};
const receiptLine = converge(pipe, [
  propOr(identity,'mapping') 
  ,pipe(propOr(' !! ERROR line has no format\n','format'),sprintf)
]);
const line = map(receiptLine,lineSpecs);

// *** assemble receipt 
const optionalLine = (test, line) => ifElse(where(test), line, always(''));
const receiptLines = pipe(joinTranformResults,reduceWithConcat);
const receiptText = joinTranformResults([
  line.header
  ,line.subHeader
  ,receiptLines([
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
  'papaya': {cost: 50, discountEvery: 3, discountName: 'Discount 3 for 2'},
};
const list = ['apple','Apple', 'orange','papaya','papaya','papaya','papaya','somethingElse'];

console.log(receiptMaker(itemSpecs)(list));
