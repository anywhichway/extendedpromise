(function(exports) {
	// http://blog.getify.com/promises-part-4/
	function ExtendedPromise(promise,timeout,defaultValue) {
		var me = this;
		Object.defineProperty(me,"onRelief",{enumerable:true,configurable:false,writable:false,value:[]});
		Object.defineProperty(me,"made",{enumerable:true,configurable:false,writable:false,value:new Date()});
		Object.defineProperty(me,"pending",{enumerable:true,configurable:true,writable:false,value:true});
		Object.defineProperty(me,"settled",{enumerable:true,configurable:true,writable:false,value:undefined});
		Object.defineProperty(me,"fulfilled",{enumerable:true,configurable:true,writable:false,value:false});
		Object.defineProperty(me,"rejected",{enumerable:true,configurable:true,writable:false,value:false});
		Object.defineProperty(me,"relieved",{enumerable:true,configurable:true,writable:false,value:false});
		Object.defineProperty(me,"timedout",{enumerable:true,configurable:true,writable:false,value:false});
		var promises = [promise];
		if(timeout) {
			promises.push(new Promise(function(resolveTimer,rejectTimer) {
				setTimeout(function() { 
					if(!me.settled) {
						Object.defineProperty(me,"timedout",{enumerable:true,configurable:false,writable:false,value:true});
						(defaultValue!==undefined ? resolveTimer(defaultValue) : rejectTimer(new Error("Promise timed out")));
					}
				},timeout);
			}));
		}
		me.promise = new Promise(function(resolve,reject) {
			Promise.race(promises).then(function(value) {
					if(!me.settled) {
						Object.defineProperty(me,"pending",{enumerable:true,configurable:false,writable:false,value:false});
						Object.defineProperty(me,"settled",{enumerable:true,configurable:false,writable:false,value:new Date()});
						Object.defineProperty(me,"fulfilled",{enumerable:true,configurable:false,writable:false,value:true});
						resolve(value);
					}
				}).catch(function(err) {
					if(!me.settled) {
						Object.defineProperty(me,"pending",{enumerable:true,configurable:false,writable:false,value:false});
						Object.defineProperty(me,"settled",{enumerable:true,configurable:false,writable:false,value:new Date()});
						Object.defineProperty(me,"rejected",{enumerable:true,configurable:false,writable:false,value:true});
						reject(err);
					}
				});
		});
		return me;
	}
	ExtendedPromise.race = function(promises) {
		var innerpromises = [];
		var winner;
		promises.forEach(function(promise,i) {
			innerpromises.push(promise.asPromise().then(function() { winner!=undefined || (winner = i); }));
		});
		var race = Promise.race(innerpromises);
		race.then(function() {
			Object.defineProperty(extendedrace,"winner",{enumerable:true,configurable:false,writable:false,value:winner}); 
		});
		return extendedrace = new ExtendedPromise(race);
	}
	ExtendedPromise.prototype.then = function(onFullfilled,onRejected) {
		this.promise = this.promise.then(onFullfilled,onRejected);
		return this;
	}
	ExtendedPromise.prototype.catch = function(onRejected) {
		this.promise = this.promise.catch(onRejected);
		return this;
	}
	ExtendedPromise.prototype.relief = function(onRelief) {
		this.onRelief.push(onRelief);
	}
	ExtendedPromise.prototype.relieve = function(reason) {
		if(!this.settled) {
			Object.defineProperty(this,"pending",{enumerable:true,configurable:false,writable:false,value:false});
			Object.defineProperty(this,"settled",{enumerable:true,configurable:false,writable:false,value:new Date()});
			Object.defineProperty(this,"relieved",{enumerable:true,configurable:false,writable:false,value:true});
			this.onRelief.forEach(function(f) {
				f(reason);
			});
		}
	}
	ExtendedPromise.prototype.asPromise = function() {
		return this.promise;
	}
	exports.ExtendedPromise = ExtendedPromise;
	return exports.ExtendedPromise
})("undefined"!=typeof exports&&"undefined"!=typeof global?global:window);
