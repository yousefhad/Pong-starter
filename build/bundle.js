/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "62950328eeb6dab419c0"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotMainModule = true; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			hotMainModule = false;
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, (function(name) {
/******/ 					return {
/******/ 						configurable: true,
/******/ 						enumerable: true,
/******/ 						get: function() {
/******/ 							return __webpack_require__[name];
/******/ 						},
/******/ 						set: function(value) {
/******/ 							__webpack_require__[name] = value;
/******/ 						}
/******/ 					};
/******/ 				}(name)));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 					finishChunkLoading();
/******/ 					throw err;
/******/ 				});
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		});
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotMainModule,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotMainModule = true;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				}
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					}
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						}
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = function() {
/******/ 						console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 					};
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					dependency = moduleOutdatedDependencies[j];
/******/ 					idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/pong/";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(15)(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(9)();\n// imports\n\n\n// module\nexports.push([module.i, \"html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {\\n    margin: 0;\\n    padding: 0;\\n    border: 0;\\n    font-size: 100%;\\n    font: inherit;\\n    vertical-align: baseline;\\n}\\n\\n\\n/* HTML5 display-role reset for older browsers */\\n\\narticle, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\\n    display: block;\\n}\\n\\nbody {\\n    line-height: 1;\\n}\\n\\nol, ul {\\n    list-style: none;\\n}\\n\\nblockquote, q {\\n    quotes: none;\\n}\\n\\nblockquote:before, blockquote:after, q:before, q:after {\\n    content: '';\\n    content: none;\\n}\\n\\ntable {\\n    border-collapse: collapse;\\n    border-spacing: 0;\\n}\\n\\n\\n/* Game Styles */\\n\\n@font-face {\\n    font-family: 'PressStart2P Web';\\n    src: url(\" + __webpack_require__(1) + \");\\n    src: url(\" + __webpack_require__(1) + \"?#iefix) format('embedded-opentype'), url(\" + __webpack_require__(13) + \") format('woff2'), url(\" + __webpack_require__(12) + \") format('woff'), url(\" + __webpack_require__(11) + \") format('truetype'), url(\" + __webpack_require__(10) + \"#press_start_2pregular) format('svg');\\n    font-weight: normal;\\n    font-style: normal;\\n}\\n\\nbody {\\n    font-family: 'PressStart2P Web', monospace;\\n    margin: 0 auto;\\n    text-align: center;\\n    background-color: black;\\n}\\n\\nh1 {\\n    margin-top: 50px;\\nfont-size:30px;\\n    color: blue;\\n}\\n\\n#game {\\n    background-color: gray;\\n    display: block;\\n    margin: 20px auto;\\n    height: 300px;\\n    width: 600px;\\n    border: solid 4px green;\\n}\\n\\n.players {\\n    display: inline-flex;\\n    justify-content: space-between;\\n    text-align: center;\\n    width: 750px;\\n    color: white;\\n    font-size: 25px;\\n}\\n\", \"\"]);\n\n// exports\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS5jc3M/NDMxMCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBOzs7QUFHQTtBQUNBLHFnQkFBc2dCLGdCQUFnQixpQkFBaUIsZ0JBQWdCLHNCQUFzQixvQkFBb0IsK0JBQStCLEdBQUcsb0pBQW9KLHFCQUFxQixHQUFHLFVBQVUscUJBQXFCLEdBQUcsWUFBWSx1QkFBdUIsR0FBRyxtQkFBbUIsbUJBQW1CLEdBQUcsNERBQTRELGtCQUFrQixvQkFBb0IsR0FBRyxXQUFXLGdDQUFnQyx3QkFBd0IsR0FBRyx1Q0FBdUMsc0NBQXNDLCtDQUFxRSxnVUFBNmEsMEJBQTBCLHlCQUF5QixHQUFHLFVBQVUsaURBQWlELHFCQUFxQix5QkFBeUIsOEJBQThCLEdBQUcsUUFBUSx1QkFBdUIsaUJBQWlCLGtCQUFrQixHQUFHLFdBQVcsNkJBQTZCLHFCQUFxQix3QkFBd0Isb0JBQW9CLG1CQUFtQiw4QkFBOEIsR0FBRyxjQUFjLDJCQUEyQixxQ0FBcUMseUJBQXlCLG1CQUFtQixtQkFBbUIsc0JBQXNCLEdBQUc7O0FBRWx0RSIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJodG1sLCBib2R5LCBkaXYsIHNwYW4sIGFwcGxldCwgb2JqZWN0LCBpZnJhbWUsIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYsIHAsIGJsb2NrcXVvdGUsIHByZSwgYSwgYWJiciwgYWNyb255bSwgYWRkcmVzcywgYmlnLCBjaXRlLCBjb2RlLCBkZWwsIGRmbiwgZW0sIGltZywgaW5zLCBrYmQsIHEsIHMsIHNhbXAsIHNtYWxsLCBzdHJpa2UsIHN0cm9uZywgc3ViLCBzdXAsIHR0LCB2YXIsIGIsIHUsIGksIGNlbnRlciwgZGwsIGR0LCBkZCwgb2wsIHVsLCBsaSwgZmllbGRzZXQsIGZvcm0sIGxhYmVsLCBsZWdlbmQsIHRhYmxlLCBjYXB0aW9uLCB0Ym9keSwgdGZvb3QsIHRoZWFkLCB0ciwgdGgsIHRkLCBhcnRpY2xlLCBhc2lkZSwgY2FudmFzLCBkZXRhaWxzLCBlbWJlZCwgZmlndXJlLCBmaWdjYXB0aW9uLCBmb290ZXIsIGhlYWRlciwgaGdyb3VwLCBtZW51LCBuYXYsIG91dHB1dCwgcnVieSwgc2VjdGlvbiwgc3VtbWFyeSwgdGltZSwgbWFyaywgYXVkaW8sIHZpZGVvIHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBib3JkZXI6IDA7XFxuICAgIGZvbnQtc2l6ZTogMTAwJTtcXG4gICAgZm9udDogaW5oZXJpdDtcXG4gICAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG5cXG4vKiBIVE1MNSBkaXNwbGF5LXJvbGUgcmVzZXQgZm9yIG9sZGVyIGJyb3dzZXJzICovXFxuXFxuYXJ0aWNsZSwgYXNpZGUsIGRldGFpbHMsIGZpZ2NhcHRpb24sIGZpZ3VyZSwgZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgbWVudSwgbmF2LCBzZWN0aW9uIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbmJvZHkge1xcbiAgICBsaW5lLWhlaWdodDogMTtcXG59XFxuXFxub2wsIHVsIHtcXG4gICAgbGlzdC1zdHlsZTogbm9uZTtcXG59XFxuXFxuYmxvY2txdW90ZSwgcSB7XFxuICAgIHF1b3Rlczogbm9uZTtcXG59XFxuXFxuYmxvY2txdW90ZTpiZWZvcmUsIGJsb2NrcXVvdGU6YWZ0ZXIsIHE6YmVmb3JlLCBxOmFmdGVyIHtcXG4gICAgY29udGVudDogJyc7XFxuICAgIGNvbnRlbnQ6IG5vbmU7XFxufVxcblxcbnRhYmxlIHtcXG4gICAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXG4gICAgYm9yZGVyLXNwYWNpbmc6IDA7XFxufVxcblxcblxcbi8qIEdhbWUgU3R5bGVzICovXFxuXFxuQGZvbnQtZmFjZSB7XFxuICAgIGZvbnQtZmFtaWx5OiAnUHJlc3NTdGFydDJQIFdlYic7XFxuICAgIHNyYzogdXJsKFwiICsgcmVxdWlyZShcIi4uL2ZvbnRzL3ByZXNzc3RhcnQycC13ZWJmb250LmVvdFwiKSArIFwiKTtcXG4gICAgc3JjOiB1cmwoXCIgKyByZXF1aXJlKFwiLi4vZm9udHMvcHJlc3NzdGFydDJwLXdlYmZvbnQuZW90XCIpICsgXCI/I2llZml4KSBmb3JtYXQoJ2VtYmVkZGVkLW9wZW50eXBlJyksIHVybChcIiArIHJlcXVpcmUoXCIuLi9mb250cy9wcmVzc3N0YXJ0MnAtd2ViZm9udC53b2ZmMlwiKSArIFwiKSBmb3JtYXQoJ3dvZmYyJyksIHVybChcIiArIHJlcXVpcmUoXCIuLi9mb250cy9wcmVzc3N0YXJ0MnAtd2ViZm9udC53b2ZmXCIpICsgXCIpIGZvcm1hdCgnd29mZicpLCB1cmwoXCIgKyByZXF1aXJlKFwiLi4vZm9udHMvcHJlc3NzdGFydDJwLXdlYmZvbnQudHRmXCIpICsgXCIpIGZvcm1hdCgndHJ1ZXR5cGUnKSwgdXJsKFwiICsgcmVxdWlyZShcIi4uL2ZvbnRzL3ByZXNzc3RhcnQycC13ZWJmb250LnN2Z1wiKSArIFwiI3ByZXNzX3N0YXJ0XzJwcmVndWxhcikgZm9ybWF0KCdzdmcnKTtcXG4gICAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcXG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xcbn1cXG5cXG5ib2R5IHtcXG4gICAgZm9udC1mYW1pbHk6ICdQcmVzc1N0YXJ0MlAgV2ViJywgbW9ub3NwYWNlO1xcbiAgICBtYXJnaW46IDAgYXV0bztcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG59XFxuXFxuaDEge1xcbiAgICBtYXJnaW4tdG9wOiA1MHB4O1xcbmZvbnQtc2l6ZTozMHB4O1xcbiAgICBjb2xvcjogYmx1ZTtcXG59XFxuXFxuI2dhbWUge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmF5O1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gICAgbWFyZ2luOiAyMHB4IGF1dG87XFxuICAgIGhlaWdodDogMzAwcHg7XFxuICAgIHdpZHRoOiA2MDBweDtcXG4gICAgYm9yZGVyOiBzb2xpZCA0cHggZ3JlZW47XFxufVxcblxcbi5wbGF5ZXJzIHtcXG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgICB3aWR0aDogNzUwcHg7XFxuICAgIGNvbG9yOiB3aGl0ZTtcXG4gICAgZm9udC1zaXplOiAyNXB4O1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL3NyYy9nYW1lLmNzc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"/fonts/pressstart2p-webfont.eot\";//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9mb250cy9wcmVzc3N0YXJ0MnAtd2ViZm9udC5lb3Q/MWUwYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiIxLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiL2ZvbnRzL3ByZXNzc3RhcnQycC13ZWJmb250LmVvdFwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZm9udHMvcHJlc3NzdGFydDJwLXdlYmZvbnQuZW90XG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _paddle = __webpack_require__(8);\n\nvar _paddle2 = _interopRequireDefault(_paddle);\n\nvar _Board = __webpack_require__(5);\n\nvar _Board2 = _interopRequireDefault(_Board);\n\nvar _Ball = __webpack_require__(4);\n\nvar _Ball2 = _interopRequireDefault(_Ball);\n\nvar _ScoreBoard = __webpack_require__(6);\n\nvar _ScoreBoard2 = _interopRequireDefault(_ScoreBoard);\n\nvar _Settings = __webpack_require__(7);\n\nvar _Settings2 = _interopRequireDefault(_Settings);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Game = function () {\n    function Game() {\n        var _this = this;\n\n        _classCallCheck(this, Game);\n\n        var canvas = document.getElementById('game');\n        this.context = canvas.getContext('2d');\n        this.width = canvas.width;\n        this.height = canvas.height;\n        this.context.fillStyle = 'white';\n        this.scorePosition1 = this.width / 2;\n        this.scorePosition2 = this.width - this.width / 2;\n        this.board = new _Board2.default(this.width, this.height);\n        this.ScoreBoard1 = new _ScoreBoard2.default(60, 26);\n        this.ScoreBoard2 = new _ScoreBoard2.default(220, 26);\n        this.player1 = new _paddle2.default(this.height, _Settings2.default.gap, _Settings2.default.p2Keys, this.ScoreBoard1);\n        this.player2 = new _paddle2.default(this.height, this.width - 5 - _Settings2.default.gap, _Settings2.default.p1Keys, this.ScoreBoard2);\n        this.ball = new _Ball2.default(this.height, this.width);\n\n        document.body.addEventListener('keyup', function (event) {\n            switch (event.keyCode) {\n                case p1Keys.addBalls:\n                case p2Keys.addBalls:\n                    _this.addBalls();\n                    break;\n\n                case p1Keys.ballSize:\n                case p2Keys.ballSize:\n                    _this.ball1.radius = Math.floor(Math.random() * (9 - 5) + 5);\n                    break;\n            }\n        });\n    }\n\n    _createClass(Game, [{\n        key: 'render',\n        value: function render() {\n            this.board.render(this.context);\n            this.player1.render(this.context);\n            this.player2.render(this.context);\n            this.ball.render({\n                ctx: this.context,\n                player1: this.player1,\n                player2: this.player2,\n                height: this.height,\n                width: this.width\n            });\n            this.ScoreBoard1.render(this.context);\n            this.ScoreBoard2.render(this.context);\n        }\n    }]);\n\n    return Game;\n}();\n\nexports.default = Game;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvR2FtZS5qcz82ZjI0Il0sIm5hbWVzIjpbIkdhbWUiLCJjYW52YXMiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiY29udGV4dCIsImdldENvbnRleHQiLCJ3aWR0aCIsImhlaWdodCIsImZpbGxTdHlsZSIsInNjb3JlUG9zaXRpb24xIiwic2NvcmVQb3NpdGlvbjIiLCJib2FyZCIsIlNjb3JlQm9hcmQxIiwiU2NvcmVCb2FyZDIiLCJwbGF5ZXIxIiwiZ2FwIiwicDJLZXlzIiwicGxheWVyMiIsInAxS2V5cyIsImJhbGwiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50Iiwia2V5Q29kZSIsImFkZEJhbGxzIiwiYmFsbFNpemUiLCJiYWxsMSIsInJhZGl1cyIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInJlbmRlciIsImN0eCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztJQUVxQkEsSTtBQUNqQixvQkFBYztBQUFBOztBQUFBOztBQUNWLFlBQU1DLFNBQVNDLFNBQVNDLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBZjtBQUNBLGFBQUtDLE9BQUwsR0FBZUgsT0FBT0ksVUFBUCxDQUFrQixJQUFsQixDQUFmO0FBQ0EsYUFBS0MsS0FBTCxHQUFhTCxPQUFPSyxLQUFwQjtBQUNBLGFBQUtDLE1BQUwsR0FBY04sT0FBT00sTUFBckI7QUFDQSxhQUFLSCxPQUFMLENBQWFJLFNBQWIsR0FBeUIsT0FBekI7QUFDQSxhQUFLQyxjQUFMLEdBQXNCLEtBQUtILEtBQUwsR0FBYSxDQUFuQztBQUNBLGFBQUtJLGNBQUwsR0FBc0IsS0FBS0osS0FBTCxHQUFjLEtBQUtBLEtBQUwsR0FBYSxDQUFqRDtBQUNBLGFBQUtLLEtBQUwsR0FBYSxvQkFBVSxLQUFLTCxLQUFmLEVBQXNCLEtBQUtDLE1BQTNCLENBQWI7QUFDQSxhQUFLSyxXQUFMLEdBQW1CLHlCQUFlLEVBQWYsRUFBbUIsRUFBbkIsQ0FBbkI7QUFDQSxhQUFLQyxXQUFMLEdBQW1CLHlCQUFlLEdBQWYsRUFBb0IsRUFBcEIsQ0FBbkI7QUFDQSxhQUFLQyxPQUFMLEdBQWUscUJBQVcsS0FBS1AsTUFBaEIsRUFBd0IsbUJBQVNRLEdBQWpDLEVBQXNDLG1CQUFTQyxNQUEvQyxFQUF1RCxLQUFLSixXQUE1RCxDQUFmO0FBQ0EsYUFBS0ssT0FBTCxHQUFlLHFCQUFXLEtBQUtWLE1BQWhCLEVBQXdCLEtBQUtELEtBQUwsR0FBYSxDQUFiLEdBQWlCLG1CQUFTUyxHQUFsRCxFQUF1RCxtQkFBU0csTUFBaEUsRUFBd0UsS0FBS0wsV0FBN0UsQ0FBZjtBQUNBLGFBQUtNLElBQUwsR0FBWSxtQkFBUyxLQUFLWixNQUFkLEVBQXNCLEtBQUtELEtBQTNCLENBQVo7O0FBR0FKLGlCQUFTa0IsSUFBVCxDQUFjQyxnQkFBZCxDQUErQixPQUEvQixFQUF3QyxVQUFDQyxLQUFELEVBQVc7QUFDL0Msb0JBQVFBLE1BQU1DLE9BQWQ7QUFDSSxxQkFBS0wsT0FBT00sUUFBWjtBQUNBLHFCQUFLUixPQUFPUSxRQUFaO0FBQ0ksMEJBQUtBLFFBQUw7QUFDQTs7QUFFSixxQkFBS04sT0FBT08sUUFBWjtBQUNBLHFCQUFLVCxPQUFPUyxRQUFaO0FBQ0ksMEJBQUtDLEtBQUwsQ0FBV0MsTUFBWCxHQUFvQkMsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLE1BQWlCLElBQUksQ0FBckIsSUFBMEIsQ0FBckMsQ0FBcEI7QUFDQTtBQVRSO0FBV0gsU0FaRDtBQWNIOzs7O2lDQUNRO0FBQ0wsaUJBQUtuQixLQUFMLENBQVdvQixNQUFYLENBQWtCLEtBQUszQixPQUF2QjtBQUNBLGlCQUFLVSxPQUFMLENBQWFpQixNQUFiLENBQW9CLEtBQUszQixPQUF6QjtBQUNBLGlCQUFLYSxPQUFMLENBQWFjLE1BQWIsQ0FBb0IsS0FBSzNCLE9BQXpCO0FBQ0EsaUJBQUtlLElBQUwsQ0FBVVksTUFBVixDQUFpQjtBQUNiQyxxQkFBSyxLQUFLNUIsT0FERztBQUViVSx5QkFBUyxLQUFLQSxPQUZEO0FBR2JHLHlCQUFTLEtBQUtBLE9BSEQ7QUFJYlYsd0JBQVEsS0FBS0EsTUFKQTtBQUtiRCx1QkFBTyxLQUFLQTtBQUxDLGFBQWpCO0FBT0EsaUJBQUtNLFdBQUwsQ0FBaUJtQixNQUFqQixDQUF3QixLQUFLM0IsT0FBN0I7QUFDQSxpQkFBS1MsV0FBTCxDQUFpQmtCLE1BQWpCLENBQXdCLEtBQUszQixPQUE3QjtBQUNIOzs7Ozs7a0JBN0NnQkosSSIsImZpbGUiOiIyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhZGRsZSBmcm9tICcuL3BhZGRsZSc7XG5pbXBvcnQgQm9hcmQgZnJvbSAnLi9Cb2FyZCc7XG5pbXBvcnQgQmFsbCBmcm9tICcuL0JhbGwnO1xuaW1wb3J0IFNjb3JlQm9hcmQgZnJvbSAnLi9TY29yZUJvYXJkJ1xuaW1wb3J0IFNldHRpbmdzIGZyb20gJy4vU2V0dGluZ3MnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy53aWR0aCA9IGNhbnZhcy53aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICAgICAgdGhpcy5zY29yZVBvc2l0aW9uMSA9IHRoaXMud2lkdGggLyAyO1xuICAgICAgICB0aGlzLnNjb3JlUG9zaXRpb24yID0gdGhpcy53aWR0aCAtICh0aGlzLndpZHRoIC8gMik7XG4gICAgICAgIHRoaXMuYm9hcmQgPSBuZXcgQm9hcmQodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICB0aGlzLlNjb3JlQm9hcmQxID0gbmV3IFNjb3JlQm9hcmQoNjAsIDI2KTtcbiAgICAgICAgdGhpcy5TY29yZUJvYXJkMiA9IG5ldyBTY29yZUJvYXJkKDIyMCwgMjYpO1xuICAgICAgICB0aGlzLnBsYXllcjEgPSBuZXcgUGFkZGxlKHRoaXMuaGVpZ2h0LCBTZXR0aW5ncy5nYXAsIFNldHRpbmdzLnAyS2V5cywgdGhpcy5TY29yZUJvYXJkMSk7XG4gICAgICAgIHRoaXMucGxheWVyMiA9IG5ldyBQYWRkbGUodGhpcy5oZWlnaHQsIHRoaXMud2lkdGggLSA1IC0gU2V0dGluZ3MuZ2FwLCBTZXR0aW5ncy5wMUtleXMsIHRoaXMuU2NvcmVCb2FyZDIpO1xuICAgICAgICB0aGlzLmJhbGwgPSBuZXcgQmFsbCh0aGlzLmhlaWdodCwgdGhpcy53aWR0aCk7XG5cblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIHAxS2V5cy5hZGRCYWxsczpcbiAgICAgICAgICAgICAgICBjYXNlIHAyS2V5cy5hZGRCYWxsczpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRCYWxscygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgcDFLZXlzLmJhbGxTaXplOlxuICAgICAgICAgICAgICAgIGNhc2UgcDJLZXlzLmJhbGxTaXplOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGwxLnJhZGl1cyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg5IC0gNSkgKyA1KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5ib2FyZC5yZW5kZXIodGhpcy5jb250ZXh0KTtcbiAgICAgICAgdGhpcy5wbGF5ZXIxLnJlbmRlcih0aGlzLmNvbnRleHQpO1xuICAgICAgICB0aGlzLnBsYXllcjIucmVuZGVyKHRoaXMuY29udGV4dCk7XG4gICAgICAgIHRoaXMuYmFsbC5yZW5kZXIoe1xuICAgICAgICAgICAgY3R4OiB0aGlzLmNvbnRleHQsXG4gICAgICAgICAgICBwbGF5ZXIxOiB0aGlzLnBsYXllcjEsXG4gICAgICAgICAgICBwbGF5ZXIyOiB0aGlzLnBsYXllcjIsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGhcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuU2NvcmVCb2FyZDEucmVuZGVyKHRoaXMuY29udGV4dCk7XG4gICAgICAgIHRoaXMuU2NvcmVCb2FyZDIucmVuZGVyKHRoaXMuY29udGV4dCk7XG4gICAgfVxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR2FtZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(0);\nif(typeof content === 'string') content = [[module.i, content, '']];\n// add the styles to the DOM\nvar update = __webpack_require__(14)(content, {});\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(true) {\n\t// When the styles change, update the <style> tags\n\tif(!content.locals) {\n\t\tmodule.hot.accept(0, function() {\n\t\t\tvar newContent = __webpack_require__(0);\n\t\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\t\t\tupdate(newContent);\n\t\t});\n\t}\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS5jc3M/YmM3YiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRjtBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLGdDQUFnQyxVQUFVLEVBQUU7QUFDNUMiLCJmaWxlIjoiMy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vZ2FtZS5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vZ2FtZS5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9nYW1lLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvZ2FtZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 4 */
/***/ function(module, exports) {

"use strict";
eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar size = 4;\nvar wallSound = document.getElementById('sound-01');\nvar victorySound = document.getElementById('sound-02');\nvar paddleSound = document.getElementById('sound-03');\n\nvar Ball = function () {\n    function Ball(height, width) {\n        _classCallCheck(this, Ball);\n\n        this.x = width / 2;\n        this.y = height / 2;\n        this.vy = Math.floor(Math.random() * 12 - 6);\n        this.vx = 7 - Math.abs(this.vy) - 7;\n        this.size = size;\n        this.height = height;\n        this.width = width;\n    }\n\n    _createClass(Ball, [{\n        key: 'draw',\n        value: function draw(ctx) {\n            ctx.fillStyle = 'white';\n            ctx.beginPath();\n            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);\n            ctx.fill();\n            ctx.closePath();\n        }\n    }, {\n        key: 'wallbounce',\n        value: function wallbounce() {\n            var hitLeft = this.x >= this.width;\n            var hitRight = this.x + this.size <= 0;\n            var hitTop = this.y - this.size <= 0;\n            var hitBottom = this.y + this.size >= this.height;\n\n            if (hitLeft || hitRight) {\n                this.vx = -this.vx;\n                wallSound.play();\n            } else if (hitTop || hitBottom) {\n                this.vy = -this.vy;\n                wallSound.play();\n            }\n        }\n    }, {\n        key: 'goal',\n        value: function goal(width, height) {\n            this.x = width / 2;\n            this.y = height / 2;\n            this.vx = Math.floor(Math.random() * 12 - 6);\n            this.vy = -this.vy;\n        }\n    }, {\n        key: 'paddleCollision',\n        value: function paddleCollision(player1, player2) {\n            if (this.vx > 0) {\n                var inRightEnd = player2.x <= this.x + this.size && player2.x > this.x - this.vx + this.size;\n                if (inRightEnd) {\n                    var collisionDiff = this.x + this.size - player2.x;\n                    var k = collisionDiff / this.vx;\n                    var y = this.vy * k + (this.y - this.vy);\n                    var hitRightPaddle = y >= player2.y && y + this.size <= player2.y + player2.height;\n                    if (hitRightPaddle) {\n                        this.x = player2.x - this.size;\n                        this.y = Math.floor(this.y - this.vy + this.vy * k);\n                        this.vx = -this.vx;\n                        victorySound.play();\n                    }\n                }\n            } else {\n                var inLeftEnd = player1.x + player1.width >= this.x;\n                if (inLeftEnd) {\n                    var _collisionDiff = player1.x + player1.width - this.x;\n                    var _k = _collisionDiff / -this.vx;\n                    var _y = this.vy * _k + (this.y - this.vy);\n                    var hitLeftPaddle = _y >= player1.y && _y + this.size <= player1.y + player1.height;\n                    if (hitLeftPaddle) {\n                        this.x = player1.x + player1.width;\n                        this.y = Math.floor(this.y - this.vy + this.vy * _k);\n                        this.vx = -this.vx;\n                        victorySound.play();\n                    }\n                }\n            }\n        }\n    }, {\n        key: 'render',\n        value: function render(_ref) {\n            var ctx = _ref.ctx;\n            var player1 = _ref.player1;\n            var player2 = _ref.player2;\n            var height = _ref.height;\n            var width = _ref.width;\n\n            this.draw(ctx);\n            this.paddleCollision(player1, player2);\n            this.wallbounce();\n            this.x += this.vx;\n            this.y += this.vy;\n\n            if (this.x <= 0) {\n                player2.addScore();\n                this.goal(width, height);\n                paddleSound.play();\n            } else if (this.x >= width) {\n                player1.addScore();\n                this.goal(width, height);\n                paddleSound.play();\n            }\n        }\n    }]);\n\n    return Ball;\n}();\n\nexports.default = Ball;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQmFsbC5qcz9iODFhIl0sIm5hbWVzIjpbInNpemUiLCJ3YWxsU291bmQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwidmljdG9yeVNvdW5kIiwicGFkZGxlU291bmQiLCJCYWxsIiwiaGVpZ2h0Iiwid2lkdGgiLCJ4IiwieSIsInZ5IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwidngiLCJhYnMiLCJjdHgiLCJmaWxsU3R5bGUiLCJiZWdpblBhdGgiLCJhcmMiLCJQSSIsImZpbGwiLCJjbG9zZVBhdGgiLCJoaXRMZWZ0IiwiaGl0UmlnaHQiLCJoaXRUb3AiLCJoaXRCb3R0b20iLCJwbGF5IiwicGxheWVyMSIsInBsYXllcjIiLCJpblJpZ2h0RW5kIiwiY29sbGlzaW9uRGlmZiIsImsiLCJoaXRSaWdodFBhZGRsZSIsImluTGVmdEVuZCIsImhpdExlZnRQYWRkbGUiLCJkcmF3IiwicGFkZGxlQ29sbGlzaW9uIiwid2FsbGJvdW5jZSIsImFkZFNjb3JlIiwiZ29hbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU1BLE9BQU8sQ0FBYjtBQUNBLElBQU1DLFlBQVlDLFNBQVNDLGNBQVQsQ0FBd0IsVUFBeEIsQ0FBbEI7QUFDQSxJQUFNQyxlQUFlRixTQUFTQyxjQUFULENBQXdCLFVBQXhCLENBQXJCO0FBQ0EsSUFBTUUsY0FBY0gsU0FBU0MsY0FBVCxDQUF3QixVQUF4QixDQUFwQjs7SUFHcUJHLEk7QUFDakIsa0JBQVlDLE1BQVosRUFBb0JDLEtBQXBCLEVBQTJCO0FBQUE7O0FBQ3ZCLGFBQUtDLENBQUwsR0FBU0QsUUFBUSxDQUFqQjtBQUNBLGFBQUtFLENBQUwsR0FBU0gsU0FBUyxDQUFsQjtBQUNBLGFBQUtJLEVBQUwsR0FBVUMsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLEtBQWdCLEVBQWhCLEdBQXFCLENBQWhDLENBQVY7QUFDQSxhQUFLQyxFQUFMLEdBQVcsSUFBSUgsS0FBS0ksR0FBTCxDQUFTLEtBQUtMLEVBQWQsQ0FBSixHQUF3QixDQUFuQztBQUNBLGFBQUtYLElBQUwsR0FBWUEsSUFBWjtBQUNBLGFBQUtPLE1BQUwsR0FBY0EsTUFBZDtBQUNBLGFBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNIOzs7OzZCQUNJUyxHLEVBQUs7QUFDTkEsZ0JBQUlDLFNBQUosR0FBZ0IsT0FBaEI7QUFDQUQsZ0JBQUlFLFNBQUo7QUFDQUYsZ0JBQUlHLEdBQUosQ0FBUSxLQUFLWCxDQUFiLEVBQWdCLEtBQUtDLENBQXJCLEVBQXdCLEtBQUtWLElBQTdCLEVBQW1DLENBQW5DLEVBQXNDLElBQUlZLEtBQUtTLEVBQS9DO0FBQ0FKLGdCQUFJSyxJQUFKO0FBQ0FMLGdCQUFJTSxTQUFKO0FBQ0g7OztxQ0FDWTtBQUNULGdCQUFNQyxVQUFVLEtBQUtmLENBQUwsSUFBVSxLQUFLRCxLQUEvQjtBQUNBLGdCQUFNaUIsV0FBVyxLQUFLaEIsQ0FBTCxHQUFTLEtBQUtULElBQWQsSUFBc0IsQ0FBdkM7QUFDQSxnQkFBTTBCLFNBQVMsS0FBS2hCLENBQUwsR0FBUyxLQUFLVixJQUFkLElBQXNCLENBQXJDO0FBQ0EsZ0JBQU0yQixZQUFZLEtBQUtqQixDQUFMLEdBQVMsS0FBS1YsSUFBZCxJQUFzQixLQUFLTyxNQUE3Qzs7QUFFQSxnQkFBSWlCLFdBQVdDLFFBQWYsRUFBeUI7QUFDckIscUJBQUtWLEVBQUwsR0FBVSxDQUFDLEtBQUtBLEVBQWhCO0FBQ0FkLDBCQUFVMkIsSUFBVjtBQUNILGFBSEQsTUFHTyxJQUFJRixVQUFVQyxTQUFkLEVBQXlCO0FBQzVCLHFCQUFLaEIsRUFBTCxHQUFVLENBQUMsS0FBS0EsRUFBaEI7QUFDQVYsMEJBQVUyQixJQUFWO0FBQ0g7QUFDSjs7OzZCQUVJcEIsSyxFQUFPRCxNLEVBQVE7QUFDaEIsaUJBQUtFLENBQUwsR0FBU0QsUUFBUSxDQUFqQjtBQUNBLGlCQUFLRSxDQUFMLEdBQVNILFNBQVMsQ0FBbEI7QUFDQSxpQkFBS1EsRUFBTCxHQUFVSCxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0IsRUFBaEIsR0FBcUIsQ0FBaEMsQ0FBVjtBQUNBLGlCQUFLSCxFQUFMLEdBQVUsQ0FBQyxLQUFLQSxFQUFoQjtBQUVIOzs7d0NBR2VrQixPLEVBQVNDLE8sRUFBUztBQUM5QixnQkFBSSxLQUFLZixFQUFMLEdBQVUsQ0FBZCxFQUFpQjtBQUNiLG9CQUFNZ0IsYUFBYUQsUUFBUXJCLENBQVIsSUFBYSxLQUFLQSxDQUFMLEdBQVMsS0FBS1QsSUFBM0IsSUFDZjhCLFFBQVFyQixDQUFSLEdBQVksS0FBS0EsQ0FBTCxHQUFTLEtBQUtNLEVBQWQsR0FBbUIsS0FBS2YsSUFEeEM7QUFFQSxvQkFBSStCLFVBQUosRUFBZ0I7QUFDWix3QkFBTUMsZ0JBQWdCLEtBQUt2QixDQUFMLEdBQVMsS0FBS1QsSUFBZCxHQUFxQjhCLFFBQVFyQixDQUFuRDtBQUNBLHdCQUFNd0IsSUFBSUQsZ0JBQWdCLEtBQUtqQixFQUEvQjtBQUNBLHdCQUFNTCxJQUFJLEtBQUtDLEVBQUwsR0FBVXNCLENBQVYsSUFBZSxLQUFLdkIsQ0FBTCxHQUFTLEtBQUtDLEVBQTdCLENBQVY7QUFDQSx3QkFBTXVCLGlCQUFpQnhCLEtBQUtvQixRQUFRcEIsQ0FBYixJQUFrQkEsSUFBSSxLQUFLVixJQUFULElBQWlCOEIsUUFBUXBCLENBQVIsR0FBWW9CLFFBQVF2QixNQUE5RTtBQUNBLHdCQUFJMkIsY0FBSixFQUFvQjtBQUNoQiw2QkFBS3pCLENBQUwsR0FBU3FCLFFBQVFyQixDQUFSLEdBQVksS0FBS1QsSUFBMUI7QUFDQSw2QkFBS1UsQ0FBTCxHQUFTRSxLQUFLQyxLQUFMLENBQVcsS0FBS0gsQ0FBTCxHQUFTLEtBQUtDLEVBQWQsR0FBbUIsS0FBS0EsRUFBTCxHQUFVc0IsQ0FBeEMsQ0FBVDtBQUNBLDZCQUFLbEIsRUFBTCxHQUFVLENBQUMsS0FBS0EsRUFBaEI7QUFDQVgscUNBQWF3QixJQUFiO0FBQ0g7QUFDSjtBQUNKLGFBZkQsTUFlTztBQUNILG9CQUFNTyxZQUFZTixRQUFRcEIsQ0FBUixHQUFZb0IsUUFBUXJCLEtBQXBCLElBQTZCLEtBQUtDLENBQXBEO0FBQ0Esb0JBQUkwQixTQUFKLEVBQWU7QUFDWCx3QkFBTUgsaUJBQWdCSCxRQUFRcEIsQ0FBUixHQUFZb0IsUUFBUXJCLEtBQXBCLEdBQTRCLEtBQUtDLENBQXZEO0FBQ0Esd0JBQU13QixLQUFJRCxpQkFBZ0IsQ0FBQyxLQUFLakIsRUFBaEM7QUFDQSx3QkFBTUwsS0FBSSxLQUFLQyxFQUFMLEdBQVVzQixFQUFWLElBQWUsS0FBS3ZCLENBQUwsR0FBUyxLQUFLQyxFQUE3QixDQUFWO0FBQ0Esd0JBQU15QixnQkFBZ0IxQixNQUFLbUIsUUFBUW5CLENBQWIsSUFBa0JBLEtBQUksS0FBS1YsSUFBVCxJQUFpQjZCLFFBQVFuQixDQUFSLEdBQVltQixRQUFRdEIsTUFBN0U7QUFDQSx3QkFBSTZCLGFBQUosRUFBbUI7QUFDZiw2QkFBSzNCLENBQUwsR0FBU29CLFFBQVFwQixDQUFSLEdBQVlvQixRQUFRckIsS0FBN0I7QUFDQSw2QkFBS0UsQ0FBTCxHQUFTRSxLQUFLQyxLQUFMLENBQVcsS0FBS0gsQ0FBTCxHQUFTLEtBQUtDLEVBQWQsR0FBbUIsS0FBS0EsRUFBTCxHQUFVc0IsRUFBeEMsQ0FBVDtBQUNBLDZCQUFLbEIsRUFBTCxHQUFVLENBQUMsS0FBS0EsRUFBaEI7QUFDQVgscUNBQWF3QixJQUFiO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7OztxQ0FRRTtBQUFBLGdCQUxDWCxHQUtELFFBTENBLEdBS0Q7QUFBQSxnQkFKQ1ksT0FJRCxRQUpDQSxPQUlEO0FBQUEsZ0JBSENDLE9BR0QsUUFIQ0EsT0FHRDtBQUFBLGdCQUZDdkIsTUFFRCxRQUZDQSxNQUVEO0FBQUEsZ0JBRENDLEtBQ0QsUUFEQ0EsS0FDRDs7QUFDQyxpQkFBSzZCLElBQUwsQ0FBVXBCLEdBQVY7QUFDQSxpQkFBS3FCLGVBQUwsQ0FBcUJULE9BQXJCLEVBQThCQyxPQUE5QjtBQUNBLGlCQUFLUyxVQUFMO0FBQ0EsaUJBQUs5QixDQUFMLElBQVUsS0FBS00sRUFBZjtBQUNBLGlCQUFLTCxDQUFMLElBQVUsS0FBS0MsRUFBZjs7QUFFQSxnQkFBSSxLQUFLRixDQUFMLElBQVUsQ0FBZCxFQUFpQjtBQUNicUIsd0JBQVFVLFFBQVI7QUFDQSxxQkFBS0MsSUFBTCxDQUFVakMsS0FBVixFQUFpQkQsTUFBakI7QUFDQUYsNEJBQVl1QixJQUFaO0FBQ0gsYUFKRCxNQUlPLElBQUksS0FBS25CLENBQUwsSUFBVUQsS0FBZCxFQUFxQjtBQUN4QnFCLHdCQUFRVyxRQUFSO0FBQ0EscUJBQUtDLElBQUwsQ0FBVWpDLEtBQVYsRUFBaUJELE1BQWpCO0FBQ0ZGLDRCQUFZdUIsSUFBWjtBQUNEO0FBRUo7Ozs7OztrQkFqR2dCdEIsSSIsImZpbGUiOiI0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc2l6ZSA9IDQ7XG5jb25zdCB3YWxsU291bmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc291bmQtMDEnKTtcbmNvbnN0IHZpY3RvcnlTb3VuZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb3VuZC0wMicpO1xuY29uc3QgcGFkZGxlU291bmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc291bmQtMDMnKTtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYWxsIHtcbiAgICBjb25zdHJ1Y3RvcihoZWlnaHQsIHdpZHRoKSB7XG4gICAgICAgIHRoaXMueCA9IHdpZHRoIC8gMjtcbiAgICAgICAgdGhpcy55ID0gaGVpZ2h0IC8gMjtcbiAgICAgICAgdGhpcy52eSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEyIC0gNik7XG4gICAgICAgIHRoaXMudnggPSAoNyAtIE1hdGguYWJzKHRoaXMudnkpIC0gNyk7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgfVxuICAgIGRyYXcoY3R4KSB7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMuc2l6ZSwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgfVxuICAgIHdhbGxib3VuY2UoKSB7XG4gICAgICAgIGNvbnN0IGhpdExlZnQgPSB0aGlzLnggPj0gdGhpcy53aWR0aDtcbiAgICAgICAgY29uc3QgaGl0UmlnaHQgPSB0aGlzLnggKyB0aGlzLnNpemUgPD0gMDtcbiAgICAgICAgY29uc3QgaGl0VG9wID0gdGhpcy55IC0gdGhpcy5zaXplIDw9IDA7XG4gICAgICAgIGNvbnN0IGhpdEJvdHRvbSA9IHRoaXMueSArIHRoaXMuc2l6ZSA+PSB0aGlzLmhlaWdodDtcblxuICAgICAgICBpZiAoaGl0TGVmdCB8fCBoaXRSaWdodCkge1xuICAgICAgICAgICAgdGhpcy52eCA9IC10aGlzLnZ4O1xuICAgICAgICAgICAgd2FsbFNvdW5kLnBsYXkoKTtcbiAgICAgICAgfSBlbHNlIGlmIChoaXRUb3AgfHwgaGl0Qm90dG9tKSB7XG4gICAgICAgICAgICB0aGlzLnZ5ID0gLXRoaXMudnk7XG4gICAgICAgICAgICB3YWxsU291bmQucGxheSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ29hbCh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMueCA9IHdpZHRoIC8gMjtcbiAgICAgICAgdGhpcy55ID0gaGVpZ2h0IC8gMjtcbiAgICAgICAgdGhpcy52eCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEyIC0gNik7XG4gICAgICAgIHRoaXMudnkgPSAtdGhpcy52eTtcblxuICAgIH1cblxuXG4gICAgcGFkZGxlQ29sbGlzaW9uKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgICAgICAgaWYgKHRoaXMudnggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBpblJpZ2h0RW5kID0gcGxheWVyMi54IDw9IHRoaXMueCArIHRoaXMuc2l6ZSAmJlxuICAgICAgICAgICAgICAgIHBsYXllcjIueCA+IHRoaXMueCAtIHRoaXMudnggKyB0aGlzLnNpemU7XG4gICAgICAgICAgICBpZiAoaW5SaWdodEVuZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbGxpc2lvbkRpZmYgPSB0aGlzLnggKyB0aGlzLnNpemUgLSBwbGF5ZXIyLng7XG4gICAgICAgICAgICAgICAgY29uc3QgayA9IGNvbGxpc2lvbkRpZmYgLyB0aGlzLnZ4O1xuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLnZ5ICogayArICh0aGlzLnkgLSB0aGlzLnZ5KTtcbiAgICAgICAgICAgICAgICBjb25zdCBoaXRSaWdodFBhZGRsZSA9IHkgPj0gcGxheWVyMi55ICYmIHkgKyB0aGlzLnNpemUgPD0gcGxheWVyMi55ICsgcGxheWVyMi5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKGhpdFJpZ2h0UGFkZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMueCA9IHBsYXllcjIueCAtIHRoaXMuc2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy55ID0gTWF0aC5mbG9vcih0aGlzLnkgLSB0aGlzLnZ5ICsgdGhpcy52eSAqIGspO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ4ID0gLXRoaXMudng7XG4gICAgICAgICAgICAgICAgICAgIHZpY3RvcnlTb3VuZC5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgaW5MZWZ0RW5kID0gcGxheWVyMS54ICsgcGxheWVyMS53aWR0aCA+PSB0aGlzLng7XG4gICAgICAgICAgICBpZiAoaW5MZWZ0RW5kKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sbGlzaW9uRGlmZiA9IHBsYXllcjEueCArIHBsYXllcjEud2lkdGggLSB0aGlzLng7XG4gICAgICAgICAgICAgICAgY29uc3QgayA9IGNvbGxpc2lvbkRpZmYgLyAtdGhpcy52eDtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gdGhpcy52eSAqIGsgKyAodGhpcy55IC0gdGhpcy52eSk7XG4gICAgICAgICAgICAgICAgY29uc3QgaGl0TGVmdFBhZGRsZSA9IHkgPj0gcGxheWVyMS55ICYmIHkgKyB0aGlzLnNpemUgPD0gcGxheWVyMS55ICsgcGxheWVyMS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKGhpdExlZnRQYWRkbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54ID0gcGxheWVyMS54ICsgcGxheWVyMS53aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy55ID0gTWF0aC5mbG9vcih0aGlzLnkgLSB0aGlzLnZ5ICsgdGhpcy52eSAqIGspO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZ4ID0gLXRoaXMudng7XG4gICAgICAgICAgICAgICAgICAgIHZpY3RvcnlTb3VuZC5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKHtcbiAgICAgICAgY3R4LFxuICAgICAgICBwbGF5ZXIxLFxuICAgICAgICBwbGF5ZXIyLFxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIHdpZHRoXG4gICAgfSkge1xuICAgICAgICB0aGlzLmRyYXcoY3R4KTtcbiAgICAgICAgdGhpcy5wYWRkbGVDb2xsaXNpb24ocGxheWVyMSwgcGxheWVyMik7XG4gICAgICAgIHRoaXMud2FsbGJvdW5jZSgpO1xuICAgICAgICB0aGlzLnggKz0gdGhpcy52eDtcbiAgICAgICAgdGhpcy55ICs9IHRoaXMudnk7XG5cbiAgICAgICAgaWYgKHRoaXMueCA8PSAwKSB7XG4gICAgICAgICAgICBwbGF5ZXIyLmFkZFNjb3JlKCk7XG4gICAgICAgICAgICB0aGlzLmdvYWwod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICBwYWRkbGVTb3VuZC5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy54ID49IHdpZHRoKSB7XG4gICAgICAgICAgICBwbGF5ZXIxLmFkZFNjb3JlKCk7XG4gICAgICAgICAgICB0aGlzLmdvYWwod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgcGFkZGxlU291bmQucGxheSgpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9CYWxsLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 5 */
/***/ function(module, exports) {

"use strict";
eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Board = function () {\n    function Board(width, height) {\n        _classCallCheck(this, Board);\n\n        this.width = width;\n        this.height = height;\n    }\n\n    _createClass(Board, [{\n        key: \"drawLine\",\n        value: function drawLine(ctx) {\n            ctx.setLineDash([8, 8]);\n            ctx.beginPath();\n            ctx.moveTo(this.width / 2, 0);\n            ctx.lineTo(this.width / 2, this.height);\n            ctx.strokeStyle = \"yellow\";\n            ctx.stroke();\n        }\n    }, {\n        key: \"render\",\n        value: function render(ctx) {\n            ctx.clearRect(0, 0, this.width, this.height);\n            this.drawLine(ctx);\n        }\n    }]);\n\n    return Board;\n}();\n\nexports.default = Board;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQm9hcmQuanM/OWQ5NSJdLCJuYW1lcyI6WyJCb2FyZCIsIndpZHRoIiwiaGVpZ2h0IiwiY3R4Iiwic2V0TGluZURhc2giLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJzdHJva2VTdHlsZSIsInN0cm9rZSIsImNsZWFyUmVjdCIsImRyYXdMaW5lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQXFCQSxLO0FBQ2pCLG1CQUFZQyxLQUFaLEVBQW1CQyxNQUFuQixFQUEyQjtBQUFBOztBQUN2QixhQUFLRCxLQUFMLEdBQWFBLEtBQWI7QUFDQSxhQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFDSDs7OztpQ0FFUUMsRyxFQUFLO0FBQ1ZBLGdCQUFJQyxXQUFKLENBQWdCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBaEI7QUFDQUQsZ0JBQUlFLFNBQUo7QUFDQUYsZ0JBQUlHLE1BQUosQ0FBVyxLQUFLTCxLQUFMLEdBQWEsQ0FBeEIsRUFBMkIsQ0FBM0I7QUFDQUUsZ0JBQUlJLE1BQUosQ0FBVyxLQUFLTixLQUFMLEdBQWEsQ0FBeEIsRUFBMkIsS0FBS0MsTUFBaEM7QUFDQUMsZ0JBQUlLLFdBQUosR0FBa0IsUUFBbEI7QUFDQUwsZ0JBQUlNLE1BQUo7QUFDSDs7OytCQUVNTixHLEVBQUs7QUFDUkEsZ0JBQUlPLFNBQUosQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLEtBQUtULEtBQXpCLEVBQWdDLEtBQUtDLE1BQXJDO0FBQ0EsaUJBQUtTLFFBQUwsQ0FBY1IsR0FBZDtBQUNIOzs7Ozs7a0JBbEJnQkgsSyIsImZpbGUiOiI1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9hcmQge1xuICAgIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB9XG5cbiAgICBkcmF3TGluZShjdHgpIHtcbiAgICAgICAgY3R4LnNldExpbmVEYXNoKFs4LCA4XSk7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbyh0aGlzLndpZHRoIC8gMiwgMCk7XG4gICAgICAgIGN0eC5saW5lVG8odGhpcy53aWR0aCAvIDIsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJ5ZWxsb3dcIjtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIHJlbmRlcihjdHgpIHtcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuZHJhd0xpbmUoY3R4KTtcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQm9hcmQuanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 6 */
/***/ function(module, exports) {

"use strict";
eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar ScoreBoard = function () {\n    function ScoreBoard(x, y, score) {\n        _classCallCheck(this, ScoreBoard);\n\n        this.x = x;\n        this.y = y;\n        this.score = 0;\n    }\n\n    _createClass(ScoreBoard, [{\n        key: \"render\",\n        value: function render(ctx) {\n            ctx.font = \"30px Helvetica\";\n            ctx.fillText(this.score, this.x, this.y);\n        }\n    }]);\n\n    return ScoreBoard;\n}();\n\nexports.default = ScoreBoard;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvU2NvcmVCb2FyZC5qcz8zZjUxIl0sIm5hbWVzIjpbIlNjb3JlQm9hcmQiLCJ4IiwieSIsInNjb3JlIiwiY3R4IiwiZm9udCIsImZpbGxUZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQXFCQSxVO0FBQ2pCLHdCQUFZQyxDQUFaLEVBQWVDLENBQWYsRUFBa0JDLEtBQWxCLEVBQXlCO0FBQUE7O0FBQ3JCLGFBQUtGLENBQUwsR0FBU0EsQ0FBVDtBQUNBLGFBQUtDLENBQUwsR0FBU0EsQ0FBVDtBQUNBLGFBQUtDLEtBQUwsR0FBYSxDQUFiO0FBQ0g7Ozs7K0JBQ01DLEcsRUFBSztBQUNSQSxnQkFBSUMsSUFBSixHQUFXLGdCQUFYO0FBQ0FELGdCQUFJRSxRQUFKLENBQWEsS0FBS0gsS0FBbEIsRUFBeUIsS0FBS0YsQ0FBOUIsRUFBaUMsS0FBS0MsQ0FBdEM7QUFDSDs7Ozs7O2tCQVRnQkYsVSIsImZpbGUiOiI2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NvcmVCb2FyZCB7XG4gICAgY29uc3RydWN0b3IoeCwgeSwgc2NvcmUpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgfVxuICAgIHJlbmRlcihjdHgpIHtcbiAgICAgICAgY3R4LmZvbnQgPSBcIjMwcHggSGVsdmV0aWNhXCI7XG4gICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLnNjb3JlLCB0aGlzLngsIHRoaXMueSk7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1Njb3JlQm9hcmQuanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 7 */
/***/ function(module, exports) {

"use strict";
eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar Settings = {\n\n\tgap: 10,\n\n\tp1keys: {\n\t\tup: 65,\n\t\tdown: 90\n\t},\n\tp2keys: {\n\t\tup: 38,\n\t\tdown: 40\n\t},\n\tfps: 30\n\n};\n\nexports.default = Settings;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvU2V0dGluZ3MuanM/YjA1MyJdLCJuYW1lcyI6WyJTZXR0aW5ncyIsImdhcCIsInAxa2V5cyIsInVwIiwiZG93biIsInAya2V5cyIsImZwcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsSUFBTUEsV0FBVzs7QUFFaEJDLE1BQUssRUFGVzs7QUFJaEJDLFNBQVE7QUFDUEMsTUFBSSxFQURHO0FBRVBDLFFBQU07QUFGQyxFQUpRO0FBUWhCQyxTQUFRO0FBQ1BGLE1BQUksRUFERztBQUVQQyxRQUFNO0FBRkMsRUFSUTtBQVloQkUsTUFBSzs7QUFaVyxDQUFqQjs7a0JBZ0JlTixRIiwiZmlsZSI6IjcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmNvbnN0IFNldHRpbmdzID0ge1xuXG5cdGdhcDogMTAsXG5cblx0cDFrZXlzOiB7XG5cdFx0dXA6IDY1LFxuXHRcdGRvd246IDkwLFxuXHR9LFxuXHRwMmtleXM6IHtcblx0XHR1cDogMzgsXG5cdFx0ZG93bjogNDAsXG5cdH0sXG5cdGZwczogMzBcblxufTtcblxuZXhwb3J0IGRlZmF1bHQgU2V0dGluZ3M7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU2V0dGluZ3MuanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 8 */
/***/ function(module, exports) {

"use strict";
eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Paddle = function () {\n    function Paddle(height, x, control, score) {\n        var _this = this;\n\n        _classCallCheck(this, Paddle);\n\n        this.width = 4;\n        this.height = 60;\n        this.x = x;\n        this.y = height / 2 - this.height / 2;\n        this.speed = 15;\n        this.maxHeight = height;\n        this.score = score;\n\n        document.addEventListener('keydown', function (event) {\n            switch (event.keyCode) {\n                case control.up:\n                    _this.y = Math.max(0, _this.y - _this.speed);\n                    break;\n                case control.down:\n                    _this.y = Math.min(_this.maxHeight - _this.height, _this.y + _this.speed);\n                    break;\n            }\n        });\n    }\n\n    _createClass(Paddle, [{\n        key: 'addScore',\n        value: function addScore(player1, player2) {\n            this.score.score++;\n        }\n    }, {\n        key: 'render',\n        value: function render(ctx) {\n            ctx.fillStyle = 'gray';\n            ctx.fillRect(this.x, this.y, this.width, this.height);\n        }\n    }]);\n\n    return Paddle;\n}();\n\nexports.default = Paddle;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcGFkZGxlLmpzPzkwNTMiXSwibmFtZXMiOlsiUGFkZGxlIiwiaGVpZ2h0IiwieCIsImNvbnRyb2wiLCJzY29yZSIsIndpZHRoIiwieSIsInNwZWVkIiwibWF4SGVpZ2h0IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJrZXlDb2RlIiwidXAiLCJNYXRoIiwibWF4IiwiZG93biIsIm1pbiIsInBsYXllcjEiLCJwbGF5ZXIyIiwiY3R4IiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBcUJBLE07QUFDakIsb0JBQVlDLE1BQVosRUFBb0JDLENBQXBCLEVBQXVCQyxPQUF2QixFQUFnQ0MsS0FBaEMsRUFBdUM7QUFBQTs7QUFBQTs7QUFDbkMsYUFBS0MsS0FBTCxHQUFhLENBQWI7QUFDQSxhQUFLSixNQUFMLEdBQWMsRUFBZDtBQUNBLGFBQUtDLENBQUwsR0FBU0EsQ0FBVDtBQUNBLGFBQUtJLENBQUwsR0FBVUwsU0FBUyxDQUFWLEdBQWdCLEtBQUtBLE1BQUwsR0FBYyxDQUF2QztBQUNBLGFBQUtNLEtBQUwsR0FBYSxFQUFiO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQlAsTUFBakI7QUFDQSxhQUFLRyxLQUFMLEdBQWFBLEtBQWI7O0FBRUFLLGlCQUFTQyxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxpQkFBUztBQUMxQyxvQkFBUUMsTUFBTUMsT0FBZDtBQUNJLHFCQUFLVCxRQUFRVSxFQUFiO0FBQ0ksMEJBQUtQLENBQUwsR0FBU1EsS0FBS0MsR0FBTCxDQUNMLENBREssRUFFTCxNQUFLVCxDQUFMLEdBQVMsTUFBS0MsS0FGVCxDQUFUO0FBSUE7QUFDSixxQkFBS0osUUFBUWEsSUFBYjtBQUNJLDBCQUFLVixDQUFMLEdBQVNRLEtBQUtHLEdBQUwsQ0FDTCxNQUFLVCxTQUFMLEdBQWlCLE1BQUtQLE1BRGpCLEVBRUwsTUFBS0ssQ0FBTCxHQUFTLE1BQUtDLEtBRlQsQ0FBVDtBQUlBO0FBWlI7QUFjSCxTQWZEO0FBZ0JIOzs7O2lDQUNRVyxPLEVBQVNDLE8sRUFBUztBQUN2QixpQkFBS2YsS0FBTCxDQUFXQSxLQUFYO0FBQ0g7OzsrQkFFTWdCLEcsRUFBSztBQUNSQSxnQkFBSUMsU0FBSixHQUFnQixNQUFoQjtBQUNBRCxnQkFBSUUsUUFBSixDQUNJLEtBQUtwQixDQURULEVBQ1ksS0FBS0ksQ0FEakIsRUFFSSxLQUFLRCxLQUZULEVBRWdCLEtBQUtKLE1BRnJCO0FBS0g7Ozs7OztrQkF0Q2dCRCxNIiwiZmlsZSI6IjguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBQYWRkbGUge1xuICAgIGNvbnN0cnVjdG9yKGhlaWdodCwgeCwgY29udHJvbCwgc2NvcmUpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IDQ7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gNjA7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IChoZWlnaHQgLyAyKSAtICh0aGlzLmhlaWdodCAvIDIpO1xuICAgICAgICB0aGlzLnNwZWVkID0gMTU7XG4gICAgICAgIHRoaXMubWF4SGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICB0aGlzLnNjb3JlID0gc2NvcmU7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgY29udHJvbC51cDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy55ID0gTWF0aC5tYXgoXG4gICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55IC0gdGhpcy5zcGVlZFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIGNvbnRyb2wuZG93bjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy55ID0gTWF0aC5taW4oXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1heEhlaWdodCAtIHRoaXMuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55ICsgdGhpcy5zcGVlZFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFkZFNjb3JlKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgICAgICAgdGhpcy5zY29yZS5zY29yZSsrO1xuICAgIH1cblxuICAgIHJlbmRlcihjdHgpIHtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdncmF5JztcbiAgICAgICAgY3R4LmZpbGxSZWN0KFxuICAgICAgICAgICAgdGhpcy54LCB0aGlzLnksXG4gICAgICAgICAgICB0aGlzLndpZHRoLCB0aGlzLmhlaWdodFxuICAgICAgICApO1xuXG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZGRsZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 9 */
/***/ function(module, exports) {

eval("/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\n// css base code, injected by the css-loader\r\nmodule.exports = function() {\r\n\tvar list = [];\r\n\r\n\t// return the list of modules as css string\r\n\tlist.toString = function toString() {\r\n\t\tvar result = [];\r\n\t\tfor(var i = 0; i < this.length; i++) {\r\n\t\t\tvar item = this[i];\r\n\t\t\tif(item[2]) {\r\n\t\t\t\tresult.push(\"@media \" + item[2] + \"{\" + item[1] + \"}\");\r\n\t\t\t} else {\r\n\t\t\t\tresult.push(item[1]);\r\n\t\t\t}\r\n\t\t}\r\n\t\treturn result.join(\"\");\r\n\t};\r\n\r\n\t// import a list of modules into the list\r\n\tlist.i = function(modules, mediaQuery) {\r\n\t\tif(typeof modules === \"string\")\r\n\t\t\tmodules = [[null, modules, \"\"]];\r\n\t\tvar alreadyImportedModules = {};\r\n\t\tfor(var i = 0; i < this.length; i++) {\r\n\t\t\tvar id = this[i][0];\r\n\t\t\tif(typeof id === \"number\")\r\n\t\t\t\talreadyImportedModules[id] = true;\r\n\t\t}\r\n\t\tfor(i = 0; i < modules.length; i++) {\r\n\t\t\tvar item = modules[i];\r\n\t\t\t// skip already imported module\r\n\t\t\t// this implementation is not 100% perfect for weird media query combinations\r\n\t\t\t//  when a module is imported multiple times with different media queries.\r\n\t\t\t//  I hope this will never occur (Hey this way we have smaller bundles)\r\n\t\t\tif(typeof item[0] !== \"number\" || !alreadyImportedModules[item[0]]) {\r\n\t\t\t\tif(mediaQuery && !item[2]) {\r\n\t\t\t\t\titem[2] = mediaQuery;\r\n\t\t\t\t} else if(mediaQuery) {\r\n\t\t\t\t\titem[2] = \"(\" + item[2] + \") and (\" + mediaQuery + \")\";\r\n\t\t\t\t}\r\n\t\t\t\tlist.push(item);\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\treturn list;\r\n};\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0Esd0NBQXdDLGdCQUFnQjtBQUN4RCxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksb0JBQW9CO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiI5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgbGlzdCA9IFtdO1xyXG5cclxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXHJcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzW2ldO1xyXG5cdFx0XHRpZihpdGVtWzJdKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBpdGVtWzFdICsgXCJ9XCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGl0ZW1bMV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oXCJcIik7XHJcblx0fTtcclxuXHJcblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcclxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XHJcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xyXG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XHJcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcclxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcclxuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxyXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xyXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxyXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxyXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xyXG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xyXG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0cmV0dXJuIGxpc3Q7XHJcbn07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"/fonts/pressstart2p-webfont.svg\";//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9mb250cy9wcmVzc3N0YXJ0MnAtd2ViZm9udC5zdmc/ZjRjYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiIxMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIi9mb250cy9wcmVzc3N0YXJ0MnAtd2ViZm9udC5zdmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZvbnRzL3ByZXNzc3RhcnQycC13ZWJmb250LnN2Z1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"/fonts/pressstart2p-webfont.ttf\";//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9mb250cy9wcmVzc3N0YXJ0MnAtd2ViZm9udC50dGY/NTYzNSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiIxMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIi9mb250cy9wcmVzc3N0YXJ0MnAtd2ViZm9udC50dGZcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZvbnRzL3ByZXNzc3RhcnQycC13ZWJmb250LnR0ZlxuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"/fonts/pressstart2p-webfont.woff\";//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9mb250cy9wcmVzc3N0YXJ0MnAtd2ViZm9udC53b2ZmPzEyMGMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMTIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIvZm9udHMvcHJlc3NzdGFydDJwLXdlYmZvbnQud29mZlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZm9udHMvcHJlc3NzdGFydDJwLXdlYmZvbnQud29mZlxuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"/fonts/pressstart2p-webfont.woff2\";//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9mb250cy9wcmVzc3N0YXJ0MnAtd2ViZm9udC53b2ZmMj9kOTUwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6IjEzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiL2ZvbnRzL3ByZXNzc3RhcnQycC13ZWJmb250LndvZmYyXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9mb250cy9wcmVzc3N0YXJ0MnAtd2ViZm9udC53b2ZmMlxuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 14 */
/***/ function(module, exports) {

eval("/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\nvar stylesInDom = {},\r\n\tmemoize = function(fn) {\r\n\t\tvar memo;\r\n\t\treturn function () {\r\n\t\t\tif (typeof memo === \"undefined\") memo = fn.apply(this, arguments);\r\n\t\t\treturn memo;\r\n\t\t};\r\n\t},\r\n\tisOldIE = memoize(function() {\r\n\t\treturn /msie [6-9]\\b/.test(window.navigator.userAgent.toLowerCase());\r\n\t}),\r\n\tgetHeadElement = memoize(function () {\r\n\t\treturn document.head || document.getElementsByTagName(\"head\")[0];\r\n\t}),\r\n\tsingletonElement = null,\r\n\tsingletonCounter = 0,\r\n\tstyleElementsInsertedAtTop = [];\r\n\r\nmodule.exports = function(list, options) {\r\n\tif(typeof DEBUG !== \"undefined\" && DEBUG) {\r\n\t\tif(typeof document !== \"object\") throw new Error(\"The style-loader cannot be used in a non-browser environment\");\r\n\t}\r\n\r\n\toptions = options || {};\r\n\t// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>\r\n\t// tags it will allow on a page\r\n\tif (typeof options.singleton === \"undefined\") options.singleton = isOldIE();\r\n\r\n\t// By default, add <style> tags to the bottom of <head>.\r\n\tif (typeof options.insertAt === \"undefined\") options.insertAt = \"bottom\";\r\n\r\n\tvar styles = listToStyles(list);\r\n\taddStylesToDom(styles, options);\r\n\r\n\treturn function update(newList) {\r\n\t\tvar mayRemove = [];\r\n\t\tfor(var i = 0; i < styles.length; i++) {\r\n\t\t\tvar item = styles[i];\r\n\t\t\tvar domStyle = stylesInDom[item.id];\r\n\t\t\tdomStyle.refs--;\r\n\t\t\tmayRemove.push(domStyle);\r\n\t\t}\r\n\t\tif(newList) {\r\n\t\t\tvar newStyles = listToStyles(newList);\r\n\t\t\taddStylesToDom(newStyles, options);\r\n\t\t}\r\n\t\tfor(var i = 0; i < mayRemove.length; i++) {\r\n\t\t\tvar domStyle = mayRemove[i];\r\n\t\t\tif(domStyle.refs === 0) {\r\n\t\t\t\tfor(var j = 0; j < domStyle.parts.length; j++)\r\n\t\t\t\t\tdomStyle.parts[j]();\r\n\t\t\t\tdelete stylesInDom[domStyle.id];\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n}\r\n\r\nfunction addStylesToDom(styles, options) {\r\n\tfor(var i = 0; i < styles.length; i++) {\r\n\t\tvar item = styles[i];\r\n\t\tvar domStyle = stylesInDom[item.id];\r\n\t\tif(domStyle) {\r\n\t\t\tdomStyle.refs++;\r\n\t\t\tfor(var j = 0; j < domStyle.parts.length; j++) {\r\n\t\t\t\tdomStyle.parts[j](item.parts[j]);\r\n\t\t\t}\r\n\t\t\tfor(; j < item.parts.length; j++) {\r\n\t\t\t\tdomStyle.parts.push(addStyle(item.parts[j], options));\r\n\t\t\t}\r\n\t\t} else {\r\n\t\t\tvar parts = [];\r\n\t\t\tfor(var j = 0; j < item.parts.length; j++) {\r\n\t\t\t\tparts.push(addStyle(item.parts[j], options));\r\n\t\t\t}\r\n\t\t\tstylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};\r\n\t\t}\r\n\t}\r\n}\r\n\r\nfunction listToStyles(list) {\r\n\tvar styles = [];\r\n\tvar newStyles = {};\r\n\tfor(var i = 0; i < list.length; i++) {\r\n\t\tvar item = list[i];\r\n\t\tvar id = item[0];\r\n\t\tvar css = item[1];\r\n\t\tvar media = item[2];\r\n\t\tvar sourceMap = item[3];\r\n\t\tvar part = {css: css, media: media, sourceMap: sourceMap};\r\n\t\tif(!newStyles[id])\r\n\t\t\tstyles.push(newStyles[id] = {id: id, parts: [part]});\r\n\t\telse\r\n\t\t\tnewStyles[id].parts.push(part);\r\n\t}\r\n\treturn styles;\r\n}\r\n\r\nfunction insertStyleElement(options, styleElement) {\r\n\tvar head = getHeadElement();\r\n\tvar lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];\r\n\tif (options.insertAt === \"top\") {\r\n\t\tif(!lastStyleElementInsertedAtTop) {\r\n\t\t\thead.insertBefore(styleElement, head.firstChild);\r\n\t\t} else if(lastStyleElementInsertedAtTop.nextSibling) {\r\n\t\t\thead.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);\r\n\t\t} else {\r\n\t\t\thead.appendChild(styleElement);\r\n\t\t}\r\n\t\tstyleElementsInsertedAtTop.push(styleElement);\r\n\t} else if (options.insertAt === \"bottom\") {\r\n\t\thead.appendChild(styleElement);\r\n\t} else {\r\n\t\tthrow new Error(\"Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.\");\r\n\t}\r\n}\r\n\r\nfunction removeStyleElement(styleElement) {\r\n\tstyleElement.parentNode.removeChild(styleElement);\r\n\tvar idx = styleElementsInsertedAtTop.indexOf(styleElement);\r\n\tif(idx >= 0) {\r\n\t\tstyleElementsInsertedAtTop.splice(idx, 1);\r\n\t}\r\n}\r\n\r\nfunction createStyleElement(options) {\r\n\tvar styleElement = document.createElement(\"style\");\r\n\tstyleElement.type = \"text/css\";\r\n\tinsertStyleElement(options, styleElement);\r\n\treturn styleElement;\r\n}\r\n\r\nfunction createLinkElement(options) {\r\n\tvar linkElement = document.createElement(\"link\");\r\n\tlinkElement.rel = \"stylesheet\";\r\n\tinsertStyleElement(options, linkElement);\r\n\treturn linkElement;\r\n}\r\n\r\nfunction addStyle(obj, options) {\r\n\tvar styleElement, update, remove;\r\n\r\n\tif (options.singleton) {\r\n\t\tvar styleIndex = singletonCounter++;\r\n\t\tstyleElement = singletonElement || (singletonElement = createStyleElement(options));\r\n\t\tupdate = applyToSingletonTag.bind(null, styleElement, styleIndex, false);\r\n\t\tremove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);\r\n\t} else if(obj.sourceMap &&\r\n\t\ttypeof URL === \"function\" &&\r\n\t\ttypeof URL.createObjectURL === \"function\" &&\r\n\t\ttypeof URL.revokeObjectURL === \"function\" &&\r\n\t\ttypeof Blob === \"function\" &&\r\n\t\ttypeof btoa === \"function\") {\r\n\t\tstyleElement = createLinkElement(options);\r\n\t\tupdate = updateLink.bind(null, styleElement);\r\n\t\tremove = function() {\r\n\t\t\tremoveStyleElement(styleElement);\r\n\t\t\tif(styleElement.href)\r\n\t\t\t\tURL.revokeObjectURL(styleElement.href);\r\n\t\t};\r\n\t} else {\r\n\t\tstyleElement = createStyleElement(options);\r\n\t\tupdate = applyToTag.bind(null, styleElement);\r\n\t\tremove = function() {\r\n\t\t\tremoveStyleElement(styleElement);\r\n\t\t};\r\n\t}\r\n\r\n\tupdate(obj);\r\n\r\n\treturn function updateStyle(newObj) {\r\n\t\tif(newObj) {\r\n\t\t\tif(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)\r\n\t\t\t\treturn;\r\n\t\t\tupdate(obj = newObj);\r\n\t\t} else {\r\n\t\t\tremove();\r\n\t\t}\r\n\t};\r\n}\r\n\r\nvar replaceText = (function () {\r\n\tvar textStore = [];\r\n\r\n\treturn function (index, replacement) {\r\n\t\ttextStore[index] = replacement;\r\n\t\treturn textStore.filter(Boolean).join('\\n');\r\n\t};\r\n})();\r\n\r\nfunction applyToSingletonTag(styleElement, index, remove, obj) {\r\n\tvar css = remove ? \"\" : obj.css;\r\n\r\n\tif (styleElement.styleSheet) {\r\n\t\tstyleElement.styleSheet.cssText = replaceText(index, css);\r\n\t} else {\r\n\t\tvar cssNode = document.createTextNode(css);\r\n\t\tvar childNodes = styleElement.childNodes;\r\n\t\tif (childNodes[index]) styleElement.removeChild(childNodes[index]);\r\n\t\tif (childNodes.length) {\r\n\t\t\tstyleElement.insertBefore(cssNode, childNodes[index]);\r\n\t\t} else {\r\n\t\t\tstyleElement.appendChild(cssNode);\r\n\t\t}\r\n\t}\r\n}\r\n\r\nfunction applyToTag(styleElement, obj) {\r\n\tvar css = obj.css;\r\n\tvar media = obj.media;\r\n\r\n\tif(media) {\r\n\t\tstyleElement.setAttribute(\"media\", media)\r\n\t}\r\n\r\n\tif(styleElement.styleSheet) {\r\n\t\tstyleElement.styleSheet.cssText = css;\r\n\t} else {\r\n\t\twhile(styleElement.firstChild) {\r\n\t\t\tstyleElement.removeChild(styleElement.firstChild);\r\n\t\t}\r\n\t\tstyleElement.appendChild(document.createTextNode(css));\r\n\t}\r\n}\r\n\r\nfunction updateLink(linkElement, obj) {\r\n\tvar css = obj.css;\r\n\tvar sourceMap = obj.sourceMap;\r\n\r\n\tif(sourceMap) {\r\n\t\t// http://stackoverflow.com/a/26603875\r\n\t\tcss += \"\\n/*# sourceMappingURL=data:application/json;base64,\" + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + \" */\";\r\n\t}\r\n\r\n\tvar blob = new Blob([css], { type: \"text/css\" });\r\n\r\n\tvar oldSrc = linkElement.href;\r\n\r\n\tlinkElement.href = URL.createObjectURL(blob);\r\n\r\n\tif(oldSrc)\r\n\t\tURL.revokeObjectURL(oldSrc);\r\n}\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanM/Yjk4MCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixtQkFBbUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHNCQUFzQjtBQUN0QztBQUNBO0FBQ0Esa0JBQWtCLDJCQUEyQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLG1CQUFtQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwyQkFBMkI7QUFDNUM7QUFDQTtBQUNBLFFBQVEsdUJBQXVCO0FBQy9CO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxpQkFBaUIsdUJBQXVCO0FBQ3hDO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsaUJBQWlCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxnQ0FBZ0Msc0JBQXNCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7O0FBRUEsNkJBQTZCLG1CQUFtQjs7QUFFaEQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBIiwiZmlsZSI6IjE0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxudmFyIHN0eWxlc0luRG9tID0ge30sXHJcblx0bWVtb2l6ZSA9IGZ1bmN0aW9uKGZuKSB7XHJcblx0XHR2YXIgbWVtbztcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRcdHJldHVybiBtZW1vO1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cdGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIC9tc2llIFs2LTldXFxiLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpO1xyXG5cdH0pLFxyXG5cdGdldEhlYWRFbGVtZW50ID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcblx0fSksXHJcblx0c2luZ2xldG9uRWxlbWVudCA9IG51bGwsXHJcblx0c2luZ2xldG9uQ291bnRlciA9IDAsXHJcblx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AgPSBbXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xyXG5cdGlmKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xyXG5cdFx0aWYodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XHJcblx0fVxyXG5cclxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cclxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XHJcblxyXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiA8aGVhZD4uXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcclxuXHJcblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0KTtcclxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcclxuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XHJcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xyXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XHJcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcclxuXHRcdH1cclxuXHRcdGlmKG5ld0xpc3QpIHtcclxuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0KTtcclxuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcclxuXHRcdH1cclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xyXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XHJcblx0XHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKVxyXG5cdFx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oKTtcclxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKSB7XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XHJcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcclxuXHRcdGlmKGRvbVN0eWxlKSB7XHJcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHBhcnRzID0gW107XHJcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMobGlzdCkge1xyXG5cdHZhciBzdHlsZXMgPSBbXTtcclxuXHR2YXIgbmV3U3R5bGVzID0ge307XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcclxuXHRcdHZhciBpZCA9IGl0ZW1bMF07XHJcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcclxuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XHJcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcclxuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcclxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKVxyXG5cdFx0XHRzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XHJcblx0fVxyXG5cdHJldHVybiBzdHlsZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpIHtcclxuXHR2YXIgaGVhZCA9IGdldEhlYWRFbGVtZW50KCk7XHJcblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XHJcblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcclxuXHRcdGlmKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xyXG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGhlYWQuZmlyc3RDaGlsZCk7XHJcblx0XHR9IGVsc2UgaWYobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0XHR9XHJcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XHJcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XHJcblx0XHRoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnLiBNdXN0IGJlICd0b3AnIG9yICdib3R0b20nLlwiKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcclxuXHRzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdHZhciBpZHggPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlRWxlbWVudCk7XHJcblx0aWYoaWR4ID49IDApIHtcclxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcclxuXHR2YXIgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xyXG5cdHN0eWxlRWxlbWVudC50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xyXG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpO1xyXG5cdHJldHVybiBzdHlsZUVsZW1lbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpIHtcclxuXHR2YXIgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcclxuXHRsaW5rRWxlbWVudC5yZWwgPSBcInN0eWxlc2hlZXRcIjtcclxuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGlua0VsZW1lbnQpO1xyXG5cdHJldHVybiBsaW5rRWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XHJcblx0dmFyIHN0eWxlRWxlbWVudCwgdXBkYXRlLCByZW1vdmU7XHJcblxyXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xyXG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBzaW5nbGV0b25FbGVtZW50IHx8IChzaW5nbGV0b25FbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcclxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIGZhbHNlKTtcclxuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIHRydWUpO1xyXG5cdH0gZWxzZSBpZihvYmouc291cmNlTWFwICYmXHJcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcclxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xyXG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XHJcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XHJcblx0XHRcdGlmKHN0eWxlRWxlbWVudC5ocmVmKVxyXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGVFbGVtZW50LmhyZWYpO1xyXG5cdFx0fTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xyXG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XHJcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKG9iaik7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcclxuXHRcdGlmKG5ld09iaikge1xyXG5cdFx0XHRpZihuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXApXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cdH07XHJcbn1cclxuXHJcbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xyXG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xyXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XHJcblx0fTtcclxufSkoKTtcclxuXHJcbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcoc3R5bGVFbGVtZW50LCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcclxuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XHJcblxyXG5cdGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XHJcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlRWxlbWVudC5jaGlsZE5vZGVzO1xyXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGNzc05vZGUpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZUVsZW1lbnQsIG9iaikge1xyXG5cdHZhciBjc3MgPSBvYmouY3NzO1xyXG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcclxuXHJcblx0aWYobWVkaWEpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcclxuXHR9XHJcblxyXG5cdGlmKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR3aGlsZShzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xyXG5cdFx0fVxyXG5cdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlTGluayhsaW5rRWxlbWVudCwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IG9iai5jc3M7XHJcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XHJcblxyXG5cdGlmKHNvdXJjZU1hcCkge1xyXG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcclxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcclxuXHR9XHJcblxyXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xyXG5cclxuXHR2YXIgb2xkU3JjID0gbGlua0VsZW1lbnQuaHJlZjtcclxuXHJcblx0bGlua0VsZW1lbnQuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XHJcblxyXG5cdGlmKG9sZFNyYylcclxuXHRcdFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcclxufVxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
eval("'use strict';\n\n__webpack_require__(3);\n\nvar _Game = __webpack_require__(2);\n\nvar _Game2 = _interopRequireDefault(_Game);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar game = new _Game2.default();\nvar fps = 30;\n\nfunction gameLoop() {\n    game.render();\n    setTimeout(gameLoop, fps);\n}\ngameLoop();//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanM/OTU1MiJdLCJuYW1lcyI6WyJnYW1lIiwiZnBzIiwiZ2FtZUxvb3AiLCJyZW5kZXIiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOzs7Ozs7QUFFQSxJQUFJQSxPQUFPLG9CQUFYO0FBQ0EsSUFBTUMsTUFBTSxFQUFaOztBQUVBLFNBQVNDLFFBQVQsR0FBb0I7QUFDaEJGLFNBQUtHLE1BQUw7QUFDQUMsZUFBV0YsUUFBWCxFQUFxQkQsR0FBckI7QUFDSDtBQUNEQyIsImZpbGUiOiIxNS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9nYW1lLmNzcyc7XG5pbXBvcnQgR2FtZSBmcm9tICcuL0dhbWUnO1xuXG52YXIgZ2FtZSA9IG5ldyBHYW1lKCk7XG5jb25zdCBmcHMgPSAzMDtcblxuZnVuY3Rpb24gZ2FtZUxvb3AoKSB7XG4gICAgZ2FtZS5yZW5kZXIoKTtcbiAgICBzZXRUaW1lb3V0KGdhbWVMb29wLCBmcHMpO1xufVxuZ2FtZUxvb3AoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ }
/******/ ]);