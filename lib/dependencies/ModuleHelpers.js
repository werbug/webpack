/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var Template = require("../Template");
var ModuleHelpers = exports;

ModuleHelpers.loadModule = function(module, outputOptions, requestInfo) {
	var comment = outputOptions.pathinfo ? "/*! " + requestInfo + " */ " : "";
	switch(module.inlineMode) {
		case null:
			return "__webpack_require__(" + comment + JSON.stringify(module.id) + ")";
		case "hoist":
			return "__webpack_module_" + Template.toIdentifier(module.id, true) + "__";
		case "inline":
			return "__webpack_require_" + Template.toIdentifier(module.id, true) + "__()";
	}
};

function asComment(str) {
	if(!str) return "";
	return "/* " + str + " */";
}


ModuleHelpers.requiredApiForLoadModule = function(module) {
	switch(module.inlineMode) {
		case "inline":
		case "hoist":
			return [];
	}
	return ["__webpack_require__", "__webpack_require__()"];
};
