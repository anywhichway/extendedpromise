require("../extendedpromise");

var promise0 = ExtendedPromise.resolve(1).then(console.log("Resolved promise generated"));
var promise1 = new ExtendedPromise(Promise.resolve("ok"));
promise1.then(function(result) { 
	console.log(result);
	console.log(JSON.stringify(promise1));
});
var promise2 = new ExtendedPromise(Promise.reject(new Error("error")));
promise2.catch(function(result) { 
	console.log(result);
	console.log(JSON.stringify(promise2)); 
});
var promise3 = new ExtendedPromise(new Promise(function(resolve,reject) { resolve("ok"); }));
promise3.then(function(result) { 
	console.log(result);
	console.log(JSON.stringify(promise3));
});
var promise4 = new ExtendedPromise(new Promise(function(resolve,reject) { setTimeout(function() { resolve("ok"); },5000); }),2000);
promise4.then(function(result) { 
	console.log(result);
	console.log(JSON.stringify(promise4)); 
});
promise4.catch(function(result) { 
	console.log(result);
	console.log(JSON.stringify(promise4)); 
});
var promise5 = new ExtendedPromise(new Promise(function(resolve,reject) { setTimeout(function() { resolve("ok"); },5000); }),10000);
promise5.then(function(result) { 
	console.log(result);
	console.log(JSON.stringify(promise5)); 
});
var promise6 = new ExtendedPromise(new Promise(function(resolve,reject) { setTimeout(function() { resolve("should be relieved and not print"); },1000); }),2000);
promise6.then(function(result) { 
	console.log(result);
	console.log(JSON.stringify(promise6)); 
});
promise6.relieve("no longer needed");
var promise7 = new ExtendedPromise(new Promise(function(resolve,reject) { setTimeout(function() { resolve("should be relieved and not print"); },3000); }),6000);
promise7.then(function(result) { 
	console.log(result);
	console.log(JSON.stringify(promise7));
});
promise7.relief(function(reason) {
	console.log("Thanks for the relief because " + reason);
	console.log(JSON.stringify(promise7));
});
setTimeout(function() { promise7.relieve("no longer needed"); },1000);
var promise8 = new ExtendedPromise(new Promise(function(resolve,reject) { setTimeout(function() { resolve(); },10000); })).then(function() { console.log("should be beaten and not print") });
var promise9 = new ExtendedPromise(new Promise(function(resolve,reject) { setTimeout(function() { resolve(); },5000); })).then(function() { console.log("should win and print") });;
var promise10 = new ExtendedPromise(new Promise(function(resolve,reject) { setTimeout(function() { resolve(); },6000); })).then(function() { console.log("should be beaten and not print") });
var promise11 = ExtendedPromise.race([promise8,promise9,promise10],true).then(function() { console.log("The winner is " + promise11.winner + "!"); console.log(JSON.stringify(promise11)); });
promise5.then(function() { console.log("delayed addition of then to promise 5 ... ok"); });
promise6.then(function() { console.log("delayed addition of then to promise 6 ...  relieved and should not print"); });

