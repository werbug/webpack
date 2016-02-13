/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var ConcatSource = require("webpack-sources").ConcatSource;
var Template = require("../Template");

function HoistInlinePlugin() {

}
module.exports = HoistInlinePlugin;

function getInlineRoot(module) {
	if(module.inlinedInto) return getInlineRoot(module.inlinedInto);
	return module;
}

function isOnlyReferencedModule(referencedModule, module) {
	module = getInlineRoot(module);
	return referencedModule.reasons.every(function(reason) {
		var m = getInlineRoot(reason.module);
		if(m !== module) return false;
		return true;
	});
}

HoistInlinePlugin.prototype.apply = function apply(compiler) {
	compiler.plugin("compilation", function(compilation) {
		compilation.plugin("optimize-tree", function(chunks, modules, callback) {
			var consideredModules = modules.slice();
			for(var i = 0; i < consideredModules.length; i++) {
				var module = consideredModules[i];
				// check which dependency can be inlined
				var hoistPossible = true;
				module.dependencies.forEach(function(dependency) {
					if(!dependency.module) return;

					// is inline supported?
					if(!dependency.getSupportedInlineModes) return hoistPossible = false;
					var hoistSupported = dependency.getSupportedInlineModes().indexOf("hoist") >= 0;
					var inlineSupported = dependency.getSupportedInlineModes().indexOf("inline") >= 0;
					if(!inlineSupported) return hoistPossible = false;
					if(hoistSupported && !inlineSupported) return hoistPossible = false; // no supported currently, because order would be incorrect

					// is already inlined?
					if(dependency.module.inlineMode === "hoist") return;
					if(dependency.module.inlineMode === "inline" && hoistPossible && hoistSupported) {
						// upgrade inline mode to hoist
						dependency.module.inlineMode = "hoist";
						return;
					}
					if(dependency.module.inlineMode) return hoistPossible = false;

					// is the only reference
					if(!isOnlyReferencedModule(dependency.module, module)) return hoistPossible = false;

					// inline module now
					var inlinedModule = dependency.module;
					var inlineRoot = getInlineRoot(module);
					inlinedModule.inlineMode = hoistPossible && hoistSupported ? "hoist" : "inline";
					if(!inlineRoot.inlinedModules) {
						inlineRoot.inlinedModules = [];
					}
					var newInlinedModules = [];
					if(inlinedModule.inlinedModules) {
						inlinedModule.inlinedModules.forEach(function(m) {
							newInlinedModules.push(m);
							m.inlinedInto = inlineRoot;
						});
					}
					newInlinedModules.push(inlinedModule);
					if(inlineRoot !== module) {
						var inlineIndex;
						inlineIndex = inlineRoot.inlinedModules.indexOf(module);
						Array.prototype.splice.apply(inlineRoot.inlinedModules, [inlineIndex, 0].concat(newInlinedModules));
					} else {
						inlineRoot.inlinedModules = inlineRoot.inlinedModules.concat(newInlinedModules);
					}
					inlinedModule.inlinedModules = null;
					inlinedModule.inlinedInto = inlineRoot;

					// reconsider all affected modules for inlining
					inlineRoot.inlinedModules.concat(inlineRoot).forEach(function(m) {
						if(consideredModules.lastIndexOf(m) < i)
							consideredModules.push(m);
					});

					return;
				})
			}
			callback();
		});
		compilation.moduleTemplate.plugin("inlined-render", function(moduleSource, module, inlineRootModule) {
			var id = Template.toIdentifier(module.id, true);
			var source;
			if(module.inlineMode === "hoist") {
				source = new ConcatSource();
				source.add("var __webpack_module_" + id + "__ = {};\n");
				source.add("(function(module, exports) {\n");
				source.add("/* start of inlined module */\n");
				source.add(moduleSource);
				source.add("module.l = true;\n");
				source.add("\n/* end of inlined module */}.call(__webpack_module_" + id + "__, {e: __webpack_module_" + id + "__, i: " + JSON.stringify(module.id) + ", l: false}, __webpack_module_" + id + "__));\n\n");
				return source;
			} else if(module.inlineMode === "inline") {
				source = new ConcatSource();
				source.add("var __webpack_module_" + id + "__ = {e:{}, i:" + JSON.stringify(module.id) + ", l:false, x:false}; // cache of the module\n");
				source.add("function __webpack_require_" + id + "__() {\n");
				source.add("if(__webpack_module_" + id + "__.x) return __webpack_module_" + id + "__.e;\n");
				source.add("__webpack_module_" + id + "__.x = true;\n");
				source.add("(function(module, exports) {\n");
				source.add("/* start of inlined module */\n");
				source.add(moduleSource);
				source.add("\n/* end of inlined module */}.call(__webpack_module_" + id + "__.e, __webpack_module_" + id + "__, __webpack_module_" + id + "__.e));\n");
				source.add("__webpack_module_" + id + "__.l = true;\n");
				source.add("return __webpack_module_" + id + "__.e;\n");
				source.add("}\n\n");
				return source;
			}
			return moduleSource;
		})
	});
};
