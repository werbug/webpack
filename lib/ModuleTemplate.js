/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var Template = require("./Template");
var ConcatSource = require("webpack-sources").ConcatSource;

function ModuleTemplate(outputOptions) {
	Template.call(this, outputOptions);
}
module.exports = ModuleTemplate;

ModuleTemplate.prototype = Object.create(Template.prototype);
ModuleTemplate.prototype.render = function(module, dependencyTemplates, chunk) {
	var _this = this;
	var inlinedModulesSources = (module.inlinedModules || []).map(function(inlineModule) {
		var moduleSource = inlineModule.source(dependencyTemplates, _this.outputOptions, _this.requestShortener);
		moduleSource = _this.applyPluginsWaterfall("inlined-module", moduleSource, inlineModule, module, chunk, dependencyTemplates);
		moduleSource = _this.applyPluginsWaterfall("inlined-render", moduleSource, inlineModule, module, chunk, dependencyTemplates);
		return _this.applyPluginsWaterfall("inlined-package", moduleSource, inlineModule, module, chunk, dependencyTemplates);
	})
	var moduleSource = module.source(dependencyTemplates, this.outputOptions, this.requestShortener);
	moduleSource = this.applyPluginsWaterfall("module", moduleSource, module, chunk, dependencyTemplates);
	var completeSource;
	if(inlinedModulesSources.length > 0) {
		completeSource = new ConcatSource();
		inlinedModulesSources.forEach(function(source) {
			completeSource.add(source);
		});
		completeSource.add(moduleSource);
	} else {
		completeSource = moduleSource;
	}
	completeSource = this.applyPluginsWaterfall("render", completeSource, module, chunk, dependencyTemplates);
	return this.applyPluginsWaterfall("package", completeSource, module, chunk, dependencyTemplates);
};

ModuleTemplate.prototype.updateHash = function(hash) {
	hash.update("1");
	this.applyPlugins("hash", hash);
};
