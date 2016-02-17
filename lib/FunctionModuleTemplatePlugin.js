/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var ConcatSource = require("webpack-sources").ConcatSource;
var PrefixSource = require("webpack-sources").PrefixSource;

function FunctionModuleTemplatePlugin() {}
module.exports = FunctionModuleTemplatePlugin;

function needRequireFunction(module) {
	if(module.arguments && module.arguments.length !== 0) return true;
	if(module.isApiRequired("__webpack_require__")) return true;
	if(module.inlinedModules) {
		if(module.inlinedModules.some(function(m) {
				return m.isApiRequired("__webpack_require__");
			})) return true;
	}
	return false;
}

FunctionModuleTemplatePlugin.prototype.apply = function(moduleTemplate) {
	moduleTemplate.plugin("render", function(moduleSource, module) {
		var source = new ConcatSource();
		var defaultArguments = ["module", "exports"];
		if(needRequireFunction(module)) {
			defaultArguments.push("__webpack_require__");
		}
		source.add("/***/ function(" + defaultArguments.concat(module.arguments || []).join(", ") + ") {\n\n");
		source.add(new PrefixSource(this.outputOptions.sourcePrefix, moduleSource));
		source.add("\n\n/***/ }");
		return source;
	});
	moduleTemplate.plugin("package", function(moduleSource, module) {
		if(this.outputOptions.pathinfo) {
			var requestShortener = this.requestShortener;
			var source = new ConcatSource();
			var req = module.readableIdentifier(requestShortener);
			source.add("/*!****" + req.replace(/./g, "*") + "****!*\\\n");
			if(module.inlinedModules) {
				module.inlinedModules.forEach(function(module) {
					var req = module.readableIdentifier(requestShortener);
					source.add("  !*** inlined: " + req.replace(/\*\//g, "*_/") + " ***!\n");
				});
			}
			source.add("  !*** " + req.replace(/\*\//g, "*_/") + " ***!\n");
			source.add("  \\****" + req.replace(/./g, "*") + "****/\n");
			source.add(moduleSource);
			return source;
		}
		return moduleSource;
	});
	moduleTemplate.plugin("inlined-package", function(moduleSource, module) {
		if(this.outputOptions.pathinfo) {
			var requestShortener = this.requestShortener;
			var source = new ConcatSource();
			var req = module.readableIdentifier(requestShortener);
			source.add("/*!****" + req.replace(/./g, "*") + "****!*\\\n");
			source.add("  !*** " + req.replace(/\*\//g, "*_/") + " ***!\n");
			source.add("  \\****" + req.replace(/./g, "*") + "****/\n");
			source.add(moduleSource);
			return source;
		}
		return moduleSource;
	});
	moduleTemplate.plugin("hash", function(hash) {
		hash.update("FunctionModuleTemplatePlugin");
		hash.update("2");
	});
};
