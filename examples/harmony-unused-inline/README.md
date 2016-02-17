This example demonstrates how webpack tracks the using of ES6 imports and exports. Only used exports are emitted to the resulting bundle. The minimizing step then removes the declarations because they are ununsed. 

Excluding unused exports from bundles is known as "[tree-shaking](http://www.2ality.com/2015/12/webpack-tree-shaking.html)".

In this example, only `add` and `multiply` in `./math.js` are used used by the app. `list` is unused and is not included in the minimized bundle (Look for `Array.from` in the minimized bundle).

In addition to that, `library.js` simulates an entry point to a big library. `library.js` re-exports multiple identifiers from submodules. Often big parts of that is unused, like `abc.js`. Note how the usage information flows from `example.js` through `library.js` into `abc.js` and all declarations in `abc.js` are not included in the minimized bundle (Look for `console.log("a")` in the minimized bundle).

# example.js

``` javascript
import { add } from './math';
import { reexportedMultiply } from "./library";

add(1, 2);
reexportedMultiply(1, 2);
```

# math.js

``` javascript
export function add() {
	var sum = 0, i = 0, args = arguments, l = args.length;
	while (i < l) {
		sum += args[i++];
	}
	return sum;
}

export function multiply() {
	var product = 1, i = 0, args = arguments, l = args.length;
	while (i < l) {
		product *= args[i++];
	}
	return product;
}

export function list() {
	return Array.from(arguments);
}
```

# library.js

``` javascript
export { a, b, c } from "./abc";
export { add as reexportedAdd, multiply as reexportedMultiply } from "./math";
```

# js/output.js

``` javascript
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		var module = installedModules[moduleId];

/******/ 		// Check if module is in cache
/******/ 		if(!module) {

/******/ 			// Create a new module (and put it into the cache)
/******/ 			module = installedModules[moduleId] = {
/******/ 				e: {},
/******/ 				i: moduleId,
/******/ 				l: false
/******/ 			};

/******/ 			// Execute the module function
/******/ 			modules[moduleId].call(module.e, module, module.e, __webpack_require__);

/******/ 			// Flag the module as loaded
/******/ 			module.l = true;
/******/ 		}

/******/ 		// Return the exports of the module
/******/ 		return module.e;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "js/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!********************!*\
  !*** inlined: ./abc.js ***!
  !*** inlined: ./math.js ***!
  !*** inlined: ./library.js ***!
  !*** ./example.js ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	/*!****************!*\
	  !*** ./abc.js ***!
	  \****************/
	var __webpack_module_1__ = {};
	(function(module, exports) {
	/* start of inlined module */
	/* unused harmony export a *//* unused harmony export b *//* unused harmony export c */function a() { console.log("a"); }
	function b() { console.log("b"); }
	function c() { console.log("c"); }
	module.l = true;

	/* end of inlined module */}.call(__webpack_module_1__, {e: __webpack_module_1__, i: 1, l: false}, __webpack_module_1__));

	/*!*****************!*\
	  !*** ./math.js ***!
	  \*****************/
	var __webpack_module_3__ = {};
	(function(module, exports) {
	/* start of inlined module */
	/* harmony export */ exports["a"] = add;/* harmony export */ exports["b"] = multiply;/* unused harmony export list */function add() {
		var sum = 0, i = 0, args = arguments, l = args.length;
		while (i < l) {
			sum += args[i++];
		}
		return sum;
	}

	function multiply() {
		var product = 1, i = 0, args = arguments, l = args.length;
		while (i < l) {
			product *= args[i++];
		}
		return product;
	}

	function list() {
		return Array.from(arguments);
	}
	module.l = true;

	/* end of inlined module */}.call(__webpack_module_3__, {e: __webpack_module_3__, i: 3, l: false}, __webpack_module_3__));

	/*!********************!*\
	  !*** ./library.js ***!
	  \********************/
	var __webpack_module_2__ = {};
	(function(module, exports) {
	/* start of inlined module */
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abc__ = __webpack_module_1__;
	/* unused harmony reexport a *//* unused harmony reexport b *//* unused harmony reexport c *//* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_module_3__;
	/* unused harmony reexport reexportedAdd *//* harmony reexport */ Object.defineProperty(exports, "a", {configurable: false, enumerable: true, get: function() { return __WEBPACK_IMPORTED_MODULE_1__math__["b"]; }});
	module.l = true;

	/* end of inlined module */}.call(__webpack_module_2__, {e: __webpack_module_2__, i: 2, l: false}, __webpack_module_2__));

	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_module_3__;
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__library__ = __webpack_module_2__;



	/* harmony import */__WEBPACK_IMPORTED_MODULE_0__math__["a"].bind()(1, 2);
	/* harmony import */__WEBPACK_IMPORTED_MODULE_1__library__["a"].bind()(1, 2);


/***/ }
/******/ ]);
```

# js/output.js

``` javascript
!function(n){function r(a){var t=e[a];return t||(t=e[a]={e:{},i:a,l:!1},n[a].call(t.e,t,t.e,r),t.l=!0),t.e}var e={};return r.m=n,r.c=e,r.p="js/",r(r.s=0)}([function(n,r,e){var a={};(function(n,r){n.l=!0}).call(a,{e:a,i:1,l:!1},a);var t={};(function(n,r){function e(){for(var n=0,r=0,e=arguments,a=e.length;a>r;)n+=e[r++];return n}function a(){for(var n=1,r=0,e=arguments,a=e.length;a>r;)n*=e[r++];return n}r.a=e,r.b=a,n.l=!0}).call(t,{e:t,i:3,l:!1},t);var l={};(function(n,r){var e=t;Object.defineProperty(r,"a",{configurable:!1,enumerable:!0,get:function(){return e.b}}),n.l=!0}).call(l,{e:l,i:2,l:!1},l);var u=t,i=l;u.a.bind()(1,2),i.a.bind()(1,2)}]);
```

# Info

## Uncompressed

```
Hash: 263715f87c915965d5e3
Version: webpack 2.0.7-beta
Time: 117ms
    Asset  Size  Chunks             Chunk Names
output.js  4 kB       0  [emitted]  main
chunk    {0} output.js (main) 728 bytes [rendered]
    > main [0] ./example.js 
    [0] ./example.js 121 bytes {0} [built]
    [1] ./abc.js 129 bytes {0} [inlined into [0]] [built]
        harmony import ./abc [2] ./library.js 1:0-32
    [2] ./library.js 112 bytes {0} [inlined into [0]] [built]
        harmony import ./library [0] ./example.js 2:0-47
    [3] ./math.js 366 bytes {0} [inlined into [0]] [built]
        harmony import ./math [0] ./example.js 1:0-29
        harmony import ./math [2] ./library.js 2:0-78
```

## Minimized (uglify-js, no zip)

```
Hash: 263715f87c915965d5e3
Version: webpack 2.0.7-beta
Time: 193ms
    Asset       Size  Chunks             Chunk Names
output.js  653 bytes       0  [emitted]  main
chunk    {0} output.js (main) 728 bytes [rendered]
    > main [0] ./example.js 
    [0] ./example.js 121 bytes {0} [built]
    [1] ./abc.js 129 bytes {0} [inlined into [0]] [built]
        harmony import ./abc [2] ./library.js 1:0-32
    [2] ./library.js 112 bytes {0} [inlined into [0]] [built]
        harmony import ./library [0] ./example.js 2:0-47
    [3] ./math.js 366 bytes {0} [inlined into [0]] [built]
        harmony import ./math [0] ./example.js 1:0-29
        harmony import ./math [2] ./library.js 2:0-78

WARNING in output.js from UglifyJs
Dropping unused function a [./abc.js:1,0]
Dropping unused function b [./abc.js:2,0]
Dropping unused function c [./abc.js:3,0]
Dropping unused function list [./math.js:17,0]
```
