// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel/src/builtins/bundle-url.js"}],"styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel/src/builtins/css-loader.js"}],"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"../node_modules/@babel/runtime/regenerator/index.js":[function(require,module,exports) {
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":"../node_modules/regenerator-runtime/runtime.js"}],"../node_modules/@babel/runtime/helpers/asyncToGenerator.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],"calendar/styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel/src/builtins/css-loader.js"}],"../node_modules/@babel/runtime/helpers/classCallCheck.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],"../node_modules/@babel/runtime/helpers/createClass.js":[function(require,module,exports) {
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],"../node_modules/@babel/runtime/helpers/typeof.js":[function(require,module,exports) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],"../node_modules/@babel/runtime/helpers/assertThisInitialized.js":[function(require,module,exports) {
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
},{}],"../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js":[function(require,module,exports) {
var _typeof = require("../helpers/typeof");

var assertThisInitialized = require("./assertThisInitialized");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
},{"../helpers/typeof":"../node_modules/@babel/runtime/helpers/typeof.js","./assertThisInitialized":"../node_modules/@babel/runtime/helpers/assertThisInitialized.js"}],"../node_modules/@babel/runtime/helpers/getPrototypeOf.js":[function(require,module,exports) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
},{}],"../node_modules/@babel/runtime/helpers/setPrototypeOf.js":[function(require,module,exports) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
},{}],"../node_modules/@babel/runtime/helpers/inherits.js":[function(require,module,exports) {
var setPrototypeOf = require("./setPrototypeOf");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;
},{"./setPrototypeOf":"../node_modules/@babel/runtime/helpers/setPrototypeOf.js"}],"../node_modules/@babel/runtime/helpers/defineProperty.js":[function(require,module,exports) {
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{}],"utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.daysInMonth = exports.firstDay = exports.months = void 0;
var months = [{
  short: "Jan",
  full: "Janeiro"
}, {
  short: "Feb",
  full: "Fevereiro"
}, {
  short: "Mar",
  full: "Março"
}, {
  short: "Abr",
  full: "Abril"
}, {
  short: "Mai",
  full: "Maio"
}, {
  short: "Jun",
  full: "Junho"
}, {
  short: "Jul",
  full: "Julho"
}, {
  short: "Aug",
  full: "Agosto"
}, {
  short: "Set",
  full: "Setembro"
}, {
  short: "Out",
  full: "Outubro"
}, {
  short: "Nov",
  full: "Novembro"
}, {
  short: "Dez",
  full: "Dezembro"
}];
/**
 *
 * @param {number} month
 * @param {number} year
 *
 */

exports.months = months;

var firstDay = function firstDay(month, year) {
  return new Date(year, month).getDay();
};
/**
 *
 * @param {number} month
 * @param {number} year
 *
 */


exports.firstDay = firstDay;

var daysInMonth = function daysInMonth(month, year) {
  return 32 - new Date(year, month, 32).getDate();
};

exports.daysInMonth = daysInMonth;
},{}],"../node_modules/@babel/runtime/helpers/arrayWithHoles.js":[function(require,module,exports) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],"../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":[function(require,module,exports) {
function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
},{}],"../node_modules/@babel/runtime/helpers/nonIterableRest.js":[function(require,module,exports) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

module.exports = _nonIterableRest;
},{}],"../node_modules/@babel/runtime/helpers/slicedToArray.js":[function(require,module,exports) {
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":"../node_modules/@babel/runtime/helpers/arrayWithHoles.js","./iterableToArrayLimit":"../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js","./nonIterableRest":"../node_modules/@babel/runtime/helpers/nonIterableRest.js"}],"core/AbstractView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractView = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AbstractView =
/*#__PURE__*/
function () {
  /** @type {HTMLElement} */

  /** @type {Map<string, HTMLElement>} */

  /**
   *
   * @param {HTMLElement} rootElement
   *
   */
  function AbstractView(rootElement) {
    (0, _classCallCheck2.default)(this, AbstractView);
    (0, _defineProperty2.default)(this, "rootElement", void 0);
    (0, _defineProperty2.default)(this, "DOM", void 0);
    this.rootElement = rootElement;
    this.DOM = new Map();
  }

  (0, _createClass2.default)(AbstractView, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                throw Error("Not implemented.");

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
    /**
     *
     * @param {string} key
     *
     */

  }, {
    key: "findDOMById",
    value: function findDOMById(key) {
      if (!this.DOM.has(key)) return;
      return this.DOM.get(key);
    }
    /**
     *
     * @param {string} key
     * @param {HTMLElement} element
     *
     */

  }, {
    key: "setToDom",
    value: function setToDom(key, element) {
      this.DOM.set(key, element);
    }
    /**
     *
     * @param {{[key: string]: HTMLElement}} arg
     */

  }, {
    key: "setAllToDom",
    value: function setAllToDom(arg) {
      var _this = this;

      Object.entries(arg).forEach(function (_ref) {
        var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
            key = _ref2[0],
            val = _ref2[1];

        return _this.setToDom(key, val);
      });
    }
  }]);
  return AbstractView;
}();

exports.AbstractView = AbstractView;
},{"@babel/runtime/helpers/slicedToArray":"../node_modules/@babel/runtime/helpers/slicedToArray.js","@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"../node_modules/@babel/runtime/helpers/defineProperty.js"}],"calendar/CalendarView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalendarView = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _utils = require("../utils");

var _AbstractView2 = require("../core/AbstractView");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CalendarView =
/*#__PURE__*/
function (_AbstractView) {
  (0, _inherits2.default)(CalendarView, _AbstractView);

  function CalendarView() {
    (0, _classCallCheck2.default)(this, CalendarView);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CalendarView).apply(this, arguments));
  }

  (0, _createClass2.default)(CalendarView, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.initRenderApp();
                this.populateCalendarDom();

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "initRenderApp",
    value: function initRenderApp() {
      var rootDiv = document.createElement("div");
      rootDiv.classList.add("calendar");
      rootDiv.innerHTML = "\n        <div class=\"calendar-manage-event hiden\">\n            <span class=\"close\"><ion-icon name=\"close-outline\"></ion-icon></span>\n            <div class=\"title\">\n                <span class=\"event-modal-title\">Manage evento @</span> <span class=\"event-id\"></span>\n            </div>\n            <div class=\"input-row\">\n                <label for=\"descricao\">Descri\xE7\xE3o</label>\n                <textarea type=\"text\" id=\"descricao\" rows=\"12\" name=\"description\"></textarea>\n            </div>\n            <div class=\"input-row\">\n                <label for=\"date\">Data</label>\n                <input type=\"datetime-local\" id=\"date\" name=\"date\"/>\n            </div>\n            <div class=\"input-row__submit\">\n                <input type=\"submit\" id=\"ok\" value=\"Confirmar\"/>\n                <input type=\"submit\" id=\"eliminar\" value=\"Eliminar\" class=\"danger\"/>\n            </div>\n        </div>\n        <div class=\"calendar-header\">\n            <button class=\"calendar-prev\">\n                <ion-icon name=\"arrow-back-outline\"></ion-icon>\n            </button>\n            <p class=\"calendar-currDate\"></p>\n            <button class=\"calendar-next\">\n                <ion-icon name=\"arrow-forward-outline\"></ion-icon>\n            </button>\n        </div>\n        <table class=\"calendar-table\">\n            <thead class=\"calendar-head\">\n                <tr>\n                    <th>D</th>\n                    <th>S</th>\n                    <th>T</th>\n                    <th>Q</th>\n                    <th>Q</th>\n                    <th>S</th>\n                    <th>S</th>\n                </tr>\n            </thead>\n            <tbody class=\"calendar-body\">\n                <tr></tr>\n                <tr></tr>\n                <tr></tr>\n                <tr></tr>\n                <tr></tr>\n                <tr></tr>\n            </tbody>\n        </table>";
      this.rootElement.parentNode.replaceChild(rootDiv, this.rootElement);
      this.rootElement = rootDiv;
    }
  }, {
    key: "populateCalendarDom",
    value: function populateCalendarDom() {
      this.setAllToDom({
        calendarTable: this.rootElement.querySelector(".calendar-table"),
        calendarHead: this.rootElement.querySelector(".calendar-head"),
        calendarBody: this.rootElement.querySelector(".calendar-body"),
        calendarPrev: this.rootElement.querySelector(".calendar-prev"),
        calendarNext: this.rootElement.querySelector(".calendar-next"),
        calendarCurrDate: this.rootElement.querySelector(".calendar-currDate"),
        modal: this.rootElement.querySelector(".calendar-manage-event"),
        modalClose: this.rootElement.querySelector(".calendar-manage-event").querySelector(".close"),
        modalInputDescription: this.rootElement.querySelector(".calendar-manage-event").querySelector("#descricao"),
        modalInputDate: this.rootElement.querySelector(".calendar-manage-event").querySelector("#date"),
        modalEventIdShow: this.rootElement.querySelector(".calendar-manage-event").querySelector(".event-id"),
        modalOk: this.rootElement.querySelector(".calendar-manage-event").querySelector("#ok"),
        modalDelete: this.rootElement.querySelector(".calendar-manage-event").querySelector("#eliminar")
      });
    }
    /**
     *
     * @param {Date} date
     * @param {{id: string, description: string, at: Date}[]} events
     *
     */

  }, {
    key: "getEventsForTheDate",
    value: function getEventsForTheDate(date, events) {
      return events.filter(function (event) {
        return event.at.getFullYear() === date.getFullYear() && event.at.getMonth() === date.getMonth() && event.at.getDate() === date.getDate();
      });
    }
    /**
     *
     * @param {import("./CalendarModel").State} state
     *
     */

  }, {
    key: "renderCalendarHeader",
    value: function renderCalendarHeader(state) {
      this.findDOMById("calendarCurrDate").innerHTML = "".concat(_utils.months[state.viewingDate.getMonth()].full, " ").concat(state.viewingDate.getFullYear());
    }
    /**
     *
     * @param {import("./CalendarModel").State} state
     *
     */

  }, {
    key: "renderCalendar",
    value: function renderCalendar(state) {
      var monthStarted = false;
      var day = 1;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.findDOMById("calendarBody").children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var tr = _step.value;

          while (tr.firstChild) {
            tr.removeChild(tr.firstChild);
          }

          for (var dayCel = 0; dayCel < 7; dayCel += 1) {
            var td = document.createElement("td");
            td.className = "";
            if (dayCel >= (0, _utils.firstDay)(state.viewingDate.getMonth(), state.viewingDate.getFullYear())) monthStarted = true;

            if (day > (0, _utils.daysInMonth)(state.viewingDate.getMonth(), state.viewingDate.getFullYear())) {
              td.classList.add("muted");
              tr.appendChild(td);
              continue;
            }

            if (!monthStarted) {
              td.classList.add("muted");
              tr.appendChild(td);
              continue;
            }

            var events = this.getEventsForTheDate(new Date(state.viewingDate.getFullYear(), state.viewingDate.getMonth(), day), state.events);
            var isCurrDay = new Date(state.viewingDate.getFullYear(), state.viewingDate.getMonth(), day).getTime() === new Date(state.currDay.getFullYear(), state.currDay.getMonth(), state.currDay.getDate()).getTime();

            if (events && Array.isArray(events) && events.length > 0) {
              (function () {
                var divEvents = document.createElement("div");
                divEvents.classList.add("events-td");
                events.forEach(function (event) {
                  var divEvent = document.createElement("div");
                  divEvent.setAttribute("eventId", event.id);
                  divEvent.textContent = event.description;
                  divEvents.appendChild(divEvent);
                });
                td.appendChild(divEvents);
              })();
            }

            var createEventIcon = document.createElement("ion-icon");
            createEventIcon.classList.add("add-event");
            createEventIcon.setAttribute("name", "add-outline");
            td.appendChild(createEventIcon);
            if (isCurrDay) td.classList.add("curr");
            var span = document.createElement("span");
            span.classList.add("numDay");
            span.textContent = day;
            td.appendChild(span);
            tr.appendChild(td);
            day += 1;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    /**
     *
     * @param {import("./CalendarModel").State} state
     *
     */

  }, {
    key: "renderManageEventModal",
    value: function renderManageEventModal(state) {
      if (!state.isManageModalOpen) {
        this.findDOMById("modal").classList.add("hidden");
        this.findDOMById("modal").classList.remove("show");
        return;
      }

      if (state.currEventToManageId) {
        var event = state.events.find(function (e) {
          return e.id === state.currEventToManageId;
        });
        this.findDOMById("modalDelete").style.display = "inline-block";
        this.findDOMById("modal").querySelector(".event-modal-title").textContent = "Editar Evento";
        this.findDOMById("modalEventIdShow").textContent = "@".concat(state.currEventToManageId);
        this.findDOMById("modalInputDescription").value = event.description;
        this.findDOMById("modalInputDate").valueAsNumber = event.at.getTime();
      } else {
        this.findDOMById("modal").querySelector(".event-modal-title").textContent = "Criara Evento";
        this.findDOMById("modalDelete").style.display = "none";
        this.findDOMById("modalInputDescription").value = "";
        this.findDOMById("modalEventIdShow").textContent = "";
      }

      this.findDOMById("modal").classList.add("show");
      this.findDOMById("modal").classList.remove("hidden");
    }
    /**
     *
     * @param {string} id
     *
     */

  }, {
    key: "removeEvent",
    value: function removeEvent(id) {
      this.findDOMById("calendarBody").querySelector("[eventId=\"".concat(id, "\"]")).parentNode.removeChild(this.findDOMById("calendarBody").querySelector("[eventId=\"".concat(id, "\"]")));
    }
    /**
     *
     * @param {import("./CalendarModel").State} state
     *
     */

  }, {
    key: "render",
    value: function render(state) {
      this.renderManageEventModal(state);
      this.renderCalendarHeader(state);
      this.renderCalendar(state);
    }
  }]);
  return CalendarView;
}(_AbstractView2.AbstractView);

exports.CalendarView = CalendarView;
(0, _defineProperty2.default)(CalendarView, "DOMKeys", {
  calendarTable: "calendarTable",
  calendarHead: "calendarHead",
  calendarBody: "calendarBody",
  calendarPrev: "calendarPrev",
  calendarNext: "calendarNext",
  calendarCurrDate: "calendarCurrDate",
  modal: "modal",
  modalClose: "modalClose",
  modalInputDescription: "modalInputDescription",
  modalInputDate: "modalInputDate",
  modalEventIdShow: "modalEventIdShow",
  modalOk: "modalOk",
  modalDelete: "modalDelete"
});
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/possibleConstructorReturn":"../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"../node_modules/@babel/runtime/helpers/getPrototypeOf.js","@babel/runtime/helpers/inherits":"../node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/defineProperty":"../node_modules/@babel/runtime/helpers/defineProperty.js","../utils":"utils.js","../core/AbstractView":"core/AbstractView.js"}],"core/AbstractController.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractController = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @template M
 * @template V
 *
 */
var AbstractController =
/** @type {M} */

/** @type {V} */

/**
 *
 * @param {M} model
 * @param {V} view
 * @constructor
 *
 */
function AbstractController(model, view) {
  (0, _classCallCheck2.default)(this, AbstractController);
  (0, _defineProperty2.default)(this, "model", void 0);
  (0, _defineProperty2.default)(this, "view", void 0);
  this.model = model;
  this.view = view;
};

exports.AbstractController = AbstractController;
},{"@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/defineProperty":"../node_modules/@babel/runtime/helpers/defineProperty.js"}],"calendar/CalendarController.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalendarController = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _CalendarView = require("./CalendarView");

var _AbstractController2 = require("../core/AbstractController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @extends {AbstractController<import("./CalendarModel").CalendarModel, import("./CalendarView").CalendarView>}
 *
 */
var CalendarController =
/*#__PURE__*/
function (_AbstractController) {
  (0, _inherits2.default)(CalendarController, _AbstractController);

  /**
   *
   * @param {import("./CalendarModel").CalendarModel} model
   * @param {import("./CalendarView").CalendarView} view
   *
   */
  function CalendarController(model, view) {
    var _this;

    (0, _classCallCheck2.default)(this, CalendarController);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CalendarController).call(this, model, view));
    _this.moveCalendarNext = _this.moveCalendarNext.bind((0, _assertThisInitialized2.default)(_this));
    _this.moveCalendarPrev = _this.moveCalendarPrev.bind((0, _assertThisInitialized2.default)(_this));
    _this.onDeleteEvent = _this.onDeleteEvent.bind((0, _assertThisInitialized2.default)(_this));
    _this.onEventManagerConfirm = _this.onEventManagerConfirm.bind((0, _assertThisInitialized2.default)(_this));
    _this.onEventManagerClose = _this.onEventManagerClose.bind((0, _assertThisInitialized2.default)(_this));
    _this.onShowCreateModal = _this.onShowCreateModal.bind((0, _assertThisInitialized2.default)(_this));
    _this.onShowEditModal = _this.onShowEditModal.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(CalendarController, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.model.init();

              case 2:
                _context.next = 4;
                return this.view.init();

              case 4:
                this.view.render(this.model.state);
                this.bindEvents();

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      this.view.findDOMById(_CalendarView.CalendarView.DOMKeys.calendarPrev).addEventListener("click", this.moveCalendarPrev);
      this.view.findDOMById(_CalendarView.CalendarView.DOMKeys.calendarNext).addEventListener("click", this.moveCalendarNext);
      this.view.findDOMById(_CalendarView.CalendarView.DOMKeys.modalClose).addEventListener("click", this.onEventManagerClose);
      this.view.findDOMById(_CalendarView.CalendarView.DOMKeys.modalDelete).addEventListener("click", this.onDeleteEvent);
      this.view.findDOMById(_CalendarView.CalendarView.DOMKeys.modalOk).addEventListener("click", this.onEventManagerConfirm);
      this.view.findDOMById(_CalendarView.CalendarView.DOMKeys.calendarBody).addEventListener("click", this.onShowCreateModal);
      this.view.findDOMById(_CalendarView.CalendarView.DOMKeys.calendarBody).addEventListener("dblclick", this.onShowEditModal);
    }
    /**
     *
     * @param {MouseEvent} e
     *
     */

  }, {
    key: "onShowCreateModal",
    value: function onShowCreateModal(e) {
      if (this.model.state.isManageModalOpen) return;
      if (!e.target.classList.contains("add-event")) return;
      var curr = e.target.parentNode.querySelector(".numDay");
      var now = new Date();
      this.view.findDOMById("modalInputDate").valueAsNumber = new Date(this.model.state.viewingDate.getFullYear(), this.model.state.viewingDate.getMonth(), Number(curr.textContent), now.getHours(), now.getMinutes()).getTime();
      this.model.setEventToManage(undefined);
      this.model.setShouldManageModalBeOpen(true);
      this.view.renderManageEventModal(this.model.state);
    }
    /**
     *
     * @param {MouseEvent} e
     *
     */

  }, {
    key: "onShowEditModal",
    value: function onShowEditModal(e) {
      if (this.model.state.isManageModalOpen) return;
      if (!e.target.hasAttribute("eventId")) return;
      var eventId = String(e.target.getAttribute("eventId"));
      this.model.setEventToManage(eventId);
      this.model.setShouldManageModalBeOpen(true);
      this.view.renderManageEventModal(this.model.state);
    }
  }, {
    key: "onEventManagerConfirm",
    value: function onEventManagerConfirm() {
      var description = this.view.findDOMById(_CalendarView.CalendarView.DOMKeys.modalInputDescription).value;
      var at = new Date(this.view.findDOMById(_CalendarView.CalendarView.DOMKeys.modalInputDate).value);

      if (this.model.state.currEventToManageId) {
        this.model.updateEvent(this.model.state.currEventToManageId, {
          description: description,
          at: at
        });
      } else {
        this.model.createEvent({
          description: description,
          at: at
        });
      }

      this.model.setEventToManage(undefined);
      this.model.setShouldManageModalBeOpen(false);
      this.view.renderManageEventModal(this.model.state);
      this.view.renderCalendar(this.model.state);
    }
  }, {
    key: "onEventManagerClose",
    value: function onEventManagerClose() {
      this.model.setEventToManage(undefined);
      this.model.setShouldManageModalBeOpen(false);
      this.view.renderManageEventModal(this.model.state);
    }
  }, {
    key: "moveCalendarNext",
    value: function moveCalendarNext() {
      this.model.moveCalendarNext();
      this.view.renderCalendarHeader(this.model.state);
      this.view.renderCalendar(this.model.state);
    }
  }, {
    key: "moveCalendarPrev",
    value: function moveCalendarPrev() {
      this.model.moveCalendarPrev();
      this.view.renderCalendarHeader(this.model.state);
      this.view.renderCalendar(this.model.state);
    }
  }, {
    key: "onDeleteEvent",
    value: function onDeleteEvent() {
      if (!this.model.state.currEventToManageId) return;
      var id = this.model.state.currEventToManageId;
      this.model.deleteEvent(this.model.state.currEventToManageId);
      this.model.setEventToManage(undefined);
      this.model.setShouldManageModalBeOpen(false);
      this.view.removeEvent(id);
      this.view.renderManageEventModal(this.model.state);
    }
  }]);
  return CalendarController;
}(_AbstractController2.AbstractController);

exports.CalendarController = CalendarController;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/possibleConstructorReturn":"../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"../node_modules/@babel/runtime/helpers/getPrototypeOf.js","@babel/runtime/helpers/assertThisInitialized":"../node_modules/@babel/runtime/helpers/assertThisInitialized.js","@babel/runtime/helpers/inherits":"../node_modules/@babel/runtime/helpers/inherits.js","./CalendarView":"calendar/CalendarView.js","../core/AbstractController":"core/AbstractController.js"}],"core/AbstractModel.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractModel = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AbstractModel =
/*#__PURE__*/
function () {
  function AbstractModel() {
    (0, _classCallCheck2.default)(this, AbstractModel);
    (0, _defineProperty2.default)(this, "state", {});
  }

  (0, _createClass2.default)(AbstractModel, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                throw Error("Not implemented");

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }]);
  return AbstractModel;
}();

exports.AbstractModel = AbstractModel;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/defineProperty":"../node_modules/@babel/runtime/helpers/defineProperty.js"}],"calendar/CalendarModel.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalendarModel = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _AbstractModel2 = require("../core/AbstractModel");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 *
 * @typedef {object} State
 * @property {{id: string, description: string, at: Date}[]} events
 * @property {Date} currDay
 * @property {Date} viewingDate
 * @property {string} currEventToManageId
 * @property {boolean} isManageModalOpen
 *
 */
var CalendarModel =
/*#__PURE__*/
function (_AbstractModel) {
  (0, _inherits2.default)(CalendarModel, _AbstractModel);

  function CalendarModel() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, CalendarModel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(CalendarModel)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      events: [],
      currDay: undefined,
      viewingDate: undefined,
      currEventToManageId: undefined,
      isManageModalOpen: false
    });
    return _this;
  }

  (0, _createClass2.default)(CalendarModel, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.state.currDay = new Date();
                this.state.viewingDate = new Date(this.state.currDay.getFullYear(), this.state.currDay.getMonth(), this.state.currDay.getDate());
                this.state.events = localStorage.getItem("@events") ? JSON.parse(localStorage.getItem("@events")).map(function (e) {
                  return _objectSpread({}, e, {
                    at: new Date(e.at)
                  });
                }) : [];

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "moveCalendarPrev",
    value: function moveCalendarPrev() {
      var currentYear = this.state.viewingDate.getMonth() === 0 ? this.state.viewingDate.getFullYear() - 1 : this.state.viewingDate.getFullYear();
      var currentMonth = this.state.viewingDate.getMonth() === 0 ? 11 : this.state.viewingDate.getMonth() - 1;
      this.state.viewingDate = new Date(currentYear, currentMonth);
    }
  }, {
    key: "moveCalendarNext",
    value: function moveCalendarNext() {
      var currentYear = this.state.viewingDate.getMonth() === 11 ? this.state.viewingDate.getFullYear() + 1 : this.state.viewingDate.getFullYear();
      var currentMonth = (this.state.viewingDate.getMonth() + 1) % 12;
      this.state.viewingDate = new Date(currentYear, currentMonth);
    }
  }, {
    key: "setShouldManageModalBeOpen",
    value: function setShouldManageModalBeOpen(isOpen) {
      this.state.isManageModalOpen = isOpen;
    }
  }, {
    key: "setEventToManage",
    value: function setEventToManage(id) {
      this.state.currEventToManageId = id;
    }
  }, {
    key: "deleteEvent",
    value: function deleteEvent(id) {
      this.state.events = this.state.events.filter(function (e) {
        return e.id !== id;
      });
      this.saveEventsInLocalStorage();
    }
  }, {
    key: "updateEvent",
    value: function updateEvent(id, _ref) {
      var description = _ref.description,
          at = _ref.at;
      this.state.events = this.state.events.map(function (e) {
        return e.id !== id ? e : _objectSpread({}, e, {
          description: description ? description : e.description,
          at: at ? at : e.at
        });
      });
      this.saveEventsInLocalStorage();
    }
  }, {
    key: "createEvent",
    value: function createEvent(_ref2) {
      var description = _ref2.description,
          at = _ref2.at;
      this.state.events.push({
        id: Math.random().toString(32).slice(2),
        description: description,
        at: at
      });
      this.saveEventsInLocalStorage();
    }
  }, {
    key: "saveEventsInLocalStorage",
    value: function saveEventsInLocalStorage() {
      localStorage.setItem("@events", JSON.stringify(this.state.events));
    }
  }]);
  return CalendarModel;
}(_AbstractModel2.AbstractModel);

exports.CalendarModel = CalendarModel;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/possibleConstructorReturn":"../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"../node_modules/@babel/runtime/helpers/getPrototypeOf.js","@babel/runtime/helpers/assertThisInitialized":"../node_modules/@babel/runtime/helpers/assertThisInitialized.js","@babel/runtime/helpers/inherits":"../node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/defineProperty":"../node_modules/@babel/runtime/helpers/defineProperty.js","../core/AbstractModel":"core/AbstractModel.js"}],"calendar/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Calendar = Calendar;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("./styles.css");

var _CalendarController = require("./CalendarController");

var _CalendarModel = require("./CalendarModel");

var _CalendarView = require("./CalendarView");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {HTMLElement} rootEle
 *
 */
function Calendar(_x) {
  return _Calendar.apply(this, arguments);
}

function _Calendar() {
  _Calendar = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(rootEle) {
    var ctl;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ctl = new _CalendarController.CalendarController(new _CalendarModel.CalendarModel(), new _CalendarView.CalendarView(rootEle));
            _context.next = 3;
            return ctl.init();

          case 3:
            return _context.abrupt("return", ctl);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _Calendar.apply(this, arguments);
}
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","./styles.css":"calendar/styles.css","./CalendarController":"calendar/CalendarController.js","./CalendarModel":"calendar/CalendarModel.js","./CalendarView":"calendar/CalendarView.js"}],"index.js":[function(require,module,exports) {
"use strict";

require("./styles.css");

var _calendar = require("./calendar");

(0, _calendar.Calendar)(document.getElementById("calendar"));
},{"./styles.css":"styles.css","./calendar":"calendar/index.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "6772" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map