/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var DependenciesBlock = require("./DependenciesBlock");
var ModuleReason = require("./ModuleReason");
var Template = require("./Template");
var HarmonyModulesHelpers = require("./dependencies/HarmonyModulesHelpers");

var debugId = 1000;

function Module() {
	DependenciesBlock.call(this);
	this.context = null;
	this.reasons = [];
	this.debugId = debugId++;
	this.lastId = -1;
	this.id = null;
	this.index = null;
	this.index2 = null;
	this.used = null;
	this.usedExports = null;
	this.chunks = [];
	this.warnings = [];
	this.dependenciesWarnings = [];
	this.errors = [];
	this.dependenciesErrors = [];

	// parser plugins can set this to false to mark module not inlinable
	this.inlinable = true;

	// null: normal module (load with __webpack_require__(<id>))
	// "hoist": executed before (load with __webpack_module_<id>__)
	// "inline": executed when requested (load with __webpack_require_id__())
	this.inlineMode = null;

	// this module is inlined into that module (inlineMode !== null)
	this.inlinedInto = null;

	// that modules are inlined into this module
	this.inlinedModules = null;
}
module.exports = Module;

Module.prototype = Object.create(DependenciesBlock.prototype);
Module.prototype.constructor = Module;

Module.prototype.disconnect = function() {
	this.reasons.length = 0;
	this.lastId = this.id;
	this.id = null;
	this.index = null;
	this.index2 = null;
	this.used = null;
	this.usedExports = null;
	this.inlineMode = null;
	this.inlinedModules = null;
	this.inlinedInto = null;
	this.chunks.length = 0;
	DependenciesBlock.prototype.disconnect.call(this);
};

Module.prototype.addChunk = function(chunk) {
	var idx = this.chunks.indexOf(chunk);
	if(idx < 0)
		this.chunks.push(chunk);
};

Module.prototype._removeAndDo = require("./removeAndDo");

Module.prototype.removeChunk = function(chunk) {
	return this._removeAndDo("chunks", chunk, "removeModule");
};

Module.prototype.addReason = function(module, dependency) {
	this.reasons.push(new ModuleReason(module, dependency));
};

Module.prototype.removeReason = function(module, dependency) {
	for(var i = 0; i < this.reasons.length; i++) {
		var r = this.reasons[i];
		if(r.module === module && r.dependency === dependency) {
			this.reasons.splice(i, 1);
			return true;
		}
	}
	return false;
};

Module.prototype.hasReasonForChunk = function(chunk) {
	for(var i = 0; i < this.reasons.length; i++) {
		var r = this.reasons[i];
		if(r.chunks) {
			if(r.chunks.indexOf(chunk) >= 0)
				return true;
		} else if(r.module.chunks.indexOf(chunk) >= 0)
			return true;
	}
	return false;
};

function addToSet(set, items) {
	items.forEach(function(item) {
		if(set.indexOf(item) < 0)
			set.push(item);
	});
}

Module.prototype.rewriteChunkInReasons = function(oldChunk, newChunks) {
	this.reasons.forEach(function(r) {
		if(!r.chunks) {
			if(r.module.chunks.indexOf(oldChunk) < 0)
				return;
			r.chunks = r.module.chunks;
		}
		r.chunks = r.chunks.reduce(function(arr, c) {
			addToSet(arr, c !== oldChunk ? [c] : newChunks);
			return arr;
		}, []);
	});
};

Module.prototype.isUsed = function(exportName) {
	if(this.used === null) return exportName;
	if(!exportName) return this.used ? true : false;
	if(!this.used) return false;
	if(!this.usedExports) return false;
	if(this.usedExports === true) return exportName;
	var idx = this.usedExports.indexOf(exportName);
	if(idx < 0) return false;
	if(HarmonyModulesHelpers.isExportedByHarmony(this, exportName))
		return Template.numberToIdentifer(idx);
	return exportName;
};

Module.prototype.toString = function() {
	return "Module[" + (this.id || this.debugId) + "]";
};

Module.prototype.needRebuild = function( /* fileTimestamps, contextTimestamps */ ) {
	return true;
};

Module.prototype.updateHash = function(hash) {
	hash.update(this.id + "" + this.used);
	hash.update(JSON.stringify(this.usedExports));
	DependenciesBlock.prototype.updateHash.call(this, hash);
};

Module.prototype.identifier = null;
Module.prototype.readableIdentifier = null;
Module.prototype.build = null;
Module.prototype.source = null;
Module.prototype.size = null;
