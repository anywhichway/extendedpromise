(function(exports) {
	// ExtendedPromise (c) 2014, 2015 Simon Y. Blackwell <syblackwell@anywhichway.com>
	function ExtendedPromise(promise,timeout,defaultValue) {
		var me = this;
		Object.defineProperty(me,"promise",{enumerable:false,configurable:false,writable:true,value:undefined});
		Object.defineProperty(me,"onRelief",{enumerable:false,configurable:false,writable:false,value:[]});
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
	ExtendedPromise.all = function(promises) {
		var innerpromises = [];
		promises.forEach(function(promise,i) {
			promise instanceof Promise || (promise = promise.asPromise());
			innerpromises.push(promise);
		});
		var all = Promise.all(innepromises);
		return new ExtenedPromise(all);
	}
	ExtendedPromise.resolve = function(value) {
		return new ExtendedPromise(Promise.resolve(value));
	}
	ExtendedPromise.reject = function(reason) {
		return new ExtendedPromise(Promise.reject(reason));
	}
	ExtendedPromise.race = function(promises,relieve) {
		var innerpromises = [];
		var winner;
		promises.forEach(function(promise,i) {
			promise instanceof Promise || (promise = promise.asPromise());
			innerpromises.push(promise.then(function() { winner!=undefined || (winner = i); }));
		});
		var race = Promise.race(innerpromises);
		race.then(function() {
			Object.defineProperty(extendedrace,"winner",{enumerable:true,configurable:false,writable:false,value:winner});
			if(relieve) {
				for(var i=0;i<promises.length;i++) {
					if(i!==winner && promises[i] instanceof ExtendedPromise) {
						promises[i].relieve("lost race");
					}
				}
			}
		});
		var extendedrace = new ExtendedPromise(race);
		if(!extendedrace.winner) {
			Object.defineProperty(extendedrace,"winner",{enumerable:true,configurable:true,writable:false,value:undefined}); 
		}
		return extendedrace;
	}
	ExtendedPromise.prototype.then = function(onFullfilled,onRejected) {
		var me = this;
		this.promise = this.promise.then((typeof(onFullfilled)==="function" ? function(value) { me.rejected ||  me.relieved || onFullfilled(value) } : undefined) ,(typeof(onRejected)==="function" ? function(value) { me.fulfilled ||  me.relieved || onRejected(value) } : undefined));
		return this;
	}
	ExtendedPromise.prototype.catch = function(onRejected) {
		var me = this;
		this.promise = this.promise.catch(function(value) { me.fulfilled ||  me.relieved || onRejected(value) });
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
