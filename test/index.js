var ExtendedPromise = require("../extendedpromise");

var promise = new ExtendedPromise(new Promise(function(resolve,reject) { resolve("ok"); })).then(function(result) { console.log(result); });
promise = new ExtendedPromise(new Promise(function(resolve,reject) { reject(new Error("err")); })).catch(function(result) { console.log(result); });
