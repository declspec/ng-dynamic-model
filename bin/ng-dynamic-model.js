(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ng-dynamic-model"] = factory();
	else
		root["ng-dynamic-model"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "bin/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getType = getType;
exports.empty = empty;
exports.contains = contains;
exports.matches = matches;
exports.equals = equals;
exports.any = any;
exports.all = all;
function defaultCompare(o1, o2) {
    return o1 == o2;
}

function getType(obj) {
    var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
    switch (type) {
        case 'object':
            if (obj === null) return 'null';
            if (Array.isArray(obj)) return 'array';
            if (obj instanceof RegExp) return 'regexp';
            if (obj instanceof Date) return 'date';
        default:
            return type;
    }
}

function empty(obj) {
    if (obj === null || typeof obj === 'undefined') return true;

    var type = getType(obj);
    switch (type) {
        case 'array':
        case 'string':
            return obj.length === 0;
        case 'date':
            return obj.getTime() === 0;
        case 'object':
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) return false;
            }
            return true;
        default:
            // The empty case for other types is handled at the top of the fn (!obj)
            return false;
    }
}

function contains(target, value) {
    switch (getType(target)) {
        case 'string':
            return target.indexOf(value) >= 0;
        case 'object':
            return target.hasOwnProperty(value);
        case 'array':
            return target.some(function (v) {
                return equals(v, value);
            });
        default:
            // No 'contains' method makes sense, return false.
            return false;
    }
}

function matches(target, to) {
    switch (getType(to)) {
        case 'null':
        case 'undefined':
            return target === to;
        case 'regexp':
            return to.test(target);
        case 'array':
            if (!Array.isArray(target) || target.length < to.length || to.length === 0 && target.length !== 0) return false;

            for (var i = 0, j = to.length; i < j; ++i) {
                for (var ii = 0, jj = target.length; ii < jj; ++ii) {
                    if (matches(target[ii], to[i])) break;else if (ii == jj - 1) return false;
                }
            }

            return true;
        case 'object':
            var keys = Object.keys(to),
                k = keys.length,
                key;

            while (--k >= 0) {
                key = keys[k];
                if (!target.hasOwnProperty(key) || !matches(target[key], to[key])) return false;
            }

            return true;
        case 'string':
        case 'number':
        case 'boolean':
        default:
            // todo: look at a way to implement configurable strict/loose checking.
            // loose checking is useful because a lot of the UI layer always gives back strings,
            // but there are probably times when strict checking will be required.
            return target == to;
    }
}

function equals(target, to, compare) {
    switch (getType(to)) {
        case 'null':
        case 'undefined':
            return target === to;
        case 'array':
            if (!Array.isArray(target) || target.length !== to.length) return false;

            for (var i = to.length - 1; i >= 0; --i) {
                if (!equals(target[i], to[i])) return false;
            }

            return true;
        case 'object':
            var k1 = Object.keys(target),
                k2 = Object.keys(to);

            if (k1.length !== k2.length) return false;

            var k = k2.length,
                key;

            while (--k >= 0) {
                key = k2[k];
                if (!target.hasOwnProperty(key) || !equals(target[key], to[key])) return false;
            }

            return true;
        case 'string':
        case 'number':
        case 'boolean':
        default:
            // todo: look at a way to implement configurable strict/loose checking.
            // loose checking is useful because a lot of the UI layer always gives back strings,
            // but there are probably times when strict checking will be required.
            return (compare || defaultCompare)(target, to);
    }
}

function any(targets, to, comparator) {
    if (!Array.isArray(targets) || targets.length === 0) return false;

    for (var i = targets.length - 1; i >= 0; --i) {
        if (comparator(targets[i], to)) return true;
    }

    return false;
}

function all(targets, to, comparator) {
    if (!Array.isArray(targets) || targets.length === 0) return false;

    for (var i = targets.length - 1; i >= 0; --i) {
        if (!comparator(targets[i], to)) return false;
    }

    return true;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Model = exports.ValidationTrigger = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectPath = __webpack_require__(5);

var objectPath = _interopRequireWildcard(_objectPath);

var _modelField = __webpack_require__(2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationTrigger = {
    Manual: 0,
    Change: 1
};

exports.ValidationTrigger = ValidationTrigger;

var Model = exports.Model = function () {
    function Model(q, initialState) {
        _classCallCheck(this, Model);

        this.$$state = initialState || {};

        if (_typeof(this.$$state) !== 'object') throw new TypeError('initialState must be a valid object');

        this.$$q = q;
        this.$$subscribers = [];
        this.$$fields = {};
    }

    _createClass(Model, [{
        key: 'getState',
        value: function getState() {
            return this.$$state;
        }
    }, {
        key: 'subscribe',
        value: function subscribe(fn) {
            var _this = this;

            if (typeof fn !== 'function') throw new TypeError('fn must be a valid function');

            this.$$subscribers.push(fn);
            return function () {
                return _this.unsubscribe(fn);
            };
        }
    }, {
        key: 'unsubscribe',
        value: function unsubscribe(fn) {
            var idx = this.$$subscribers.indexOf(fn);
            if (idx >= 0) this.$$subscribers.splice(idx, 1);
        }
    }, {
        key: 'watch',
        value: function watch(path, fn, comparer) {
            comparer = comparer || defaultComparer;
            var currentValue = objectPath.get(this.$$state, path);

            return this.subscribe(function (state) {
                var newValue = objectPath.get(state, path);

                if (!comparer(currentValue, newValue)) {
                    var oldValue = currentValue;
                    currentValue = newValue;

                    fn(newValue, oldValue, path);
                }
            });
        }
    }, {
        key: 'set',
        value: function set(path, value) {
            objectPath.set(this.$$state, path, value);
            var subscribers = this.$$subscribers.slice();

            for (var i = 0, j = subscribers.length; i < j; ++i) {
                subscribers[i](this.$$state);
            }

            return this;
        }
    }, {
        key: 'get',
        value: function get(path, defaultValue) {
            return objectPath.get(this.$$state, path, defaultValue);
        }
    }, {
        key: 'field',
        value: function field(path) {
            if (this.$$fields.hasOwnProperty(path)) return this.$$fields[path];

            var startValue = this.get(path);
            var field = new _modelField.ModelField(this.$$q, this, path, startValue);

            // Use `watch` over `on('change')` to avoid emitting events
            // inside other events (causing event ordering issues).
            if (this.$$validationTrigger === ValidationTrigger.Change) field.watch(function () {
                return field.hasValidation() && field.validate();
            });

            return this.$$fields[path] = field;
        }
    }, {
        key: 'validate',
        value: function validate() {
            var _this2 = this;

            var promises = Object.keys(this.$$fields).map(function (path) {
                var field = _this2.$$fields[path];
                return field.hasValidation() && field.isActive() ? field.isValidated() ? field.isValid() : field.validate() : true;
            });

            return this.$$q.all(promises).then(function (results) {
                return results.every(function (r) {
                    return r;
                });
            });
        }
    }, {
        key: 'setValidationTrigger',
        value: function setValidationTrigger(trigger) {
            this.$$validationTrigger = trigger;
        }
    }, {
        key: '$findChildFields',
        value: function $findChildFields(path) {
            var _this3 = this;

            var value = this.get(path, null);
            var fields = [];

            if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                Object.keys(value).forEach(function (childProp) {
                    var lookup = path + '.' + childProp;
                    if (_this3.$$fields.hasOwnProperty(lookup)) fields.push(_this3.$$fields[lookup]);
                });
            }

            return fields;
        }
    }, {
        key: '$findParentField',
        value: function $findParentField(path) {
            var parentPath = path,
                dot = -1;

            while ((dot = parentPath.lastIndexOf('.')) >= 0) {
                parentPath = parentPath.substring(0, dot);
                if (this.$$fields.hasOwnProperty(parentPath)) return this.$$fields[parentPath];
            }

            return null;
        }
    }]);

    return Model;
}();

function defaultComparer(o1, o2) {
    return o1 === o2;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationState = {
    Valid: 0,
    Invalid: 1,
    Unknown: 2
};

var ModelField = exports.ModelField = function () {
    function ModelField(q, model, name, value) {
        var _this = this;

        _classCallCheck(this, ModelField);

        this.name = name;
        this.label = labelise(name);

        // Private fields
        this.$$model = model;
        this.$$value = value;
        this.$$active = true;
        this.$$q = q;
        this.$$listeners = {};
        this.$$validationState = ValidationState.Unknown;
        this.$$validationRef = 0;

        // Set up an internal watch to propagate external value changes
        this.watch(function (newValue, oldValue, path) {
            if (newValue !== _this.$$value) _this.$$value = newValue;

            _this.setDirty(true);
            _this.$emit('change', _this, newValue, oldValue);
        });
    }

    _createClass(ModelField, [{
        key: 'invalidate',
        value: function invalidate() {
            this.$$validationState = ValidationState.Unknown;
        }
    }, {
        key: 'isValid',
        value: function isValid() {
            return this.$$validationState === ValidationState.Valid;
        }
    }, {
        key: 'isValidated',
        value: function isValidated() {
            return this.$$validationState !== ValidationState.Unknown;
        }
    }, {
        key: 'isDirty',
        value: function isDirty() {
            return this.$$dirty;
        }
    }, {
        key: 'isActive',
        value: function isActive() {
            if (!this.$$active) return false;

            var parent = this.$$model.$findParentField(this.name);
            return parent === null || parent.isActive();
        }
    }, {
        key: 'hasValidation',
        value: function hasValidation() {
            return this.$$validators && this.$$validators.length || this.$$asyncValidators && this.$$asyncValidators.length;
        }
    }, {
        key: 'value',
        value: function value() {
            return this.$$value;
        }
    }, {
        key: 'setValue',
        value: function setValue(value) {
            // This will flow through to the internal watcher.
            this.$$model.set(this.name, value);
        }
    }, {
        key: 'setDirty',
        value: function setDirty(dirty) {
            this.$$dirty = !!dirty;
            this.invalidate();
        }
    }, {
        key: 'setActive',
        value: function setActive(active) {
            this.$$active = !!active;

            if (this.$$active && this.$$lastActiveValue) {
                this.setValue(this.$$lastActiveValue);
            } else if (!this.$$active) {
                var current = this.value();

                // Cache the current value for when/if the field is re-activated.
                if (typeof current !== 'undefined') {
                    this.setValue(undefined);
                    this.$$lastActiveValue = current;
                }
            }

            this.$emit('toggle', this, this.$$active);
        }
    }, {
        key: 'addValidator',
        value: function addValidator(validator) {
            if (typeof validator !== 'function') throw new TypeError('validator must be a valid function');

            if (!this.$$validators) this.$$validators = [];

            this.$$validators.push(validator);
            return this;
        }
    }, {
        key: 'addAsyncValidator',
        value: function addAsyncValidator(validator) {
            if (typeof validator !== 'function') throw new TypeError('validator must be a valid function');

            if (!this.$$asyncValidators) this.$$asyncValidators = [];

            this.$$asyncValidators.push(validator);
            return this;
        }
    }, {
        key: 'validate',
        value: function validate(newValue) {
            var _this2 = this;

            var errors = [];
            var result = this.$processValidators(addError);

            // Can we exit early?
            if (!result || !this.$$asyncValidators || !this.$$asyncValidators.length) {
                this.$completeValidation(result, errors);
                return this.$$q.resolve(result);
            }

            // Run the async validators
            var ref = ++this.$$validationRef;
            this.$$validationSate = ValidationState.Unknown;

            if (!this.$$deferredValidation) this.$$deferredValidation = this.$$q.defer();

            this.$processAsyncValidators(addError).then(function (result) {
                if (ref === _this2.$$validationRef) _this2.$completeValidation(result, errors);
            }, function (err) {
                if (ref === _this2.$$validationRef && _this2.$$deferredValidation) {
                    var deferred = _this2.$$deferredValidation;
                    _this2.$$deferredValidation = null;
                    deferred.reject(err);
                }
            });

            return this.$$deferredValidation.promise;

            function addError(err) {
                errors.push(err);
            }
        }
    }, {
        key: 'watch',
        value: function watch(fn) {
            return this.$$model.watch(this.name, fn);
        }
    }, {
        key: 'on',
        value: function on(type, fn) {
            var _this3 = this;

            if (typeof fn !== 'function') throw new TypeError('fn must be a valid function');

            if (!this.$$listeners.hasOwnProperty(type)) this.$$listeners[type] = [];

            this.$$listeners[type].push(fn);

            return function () {
                return _this3.off(type, fn);
            };
        }
    }, {
        key: 'off',
        value: function off(type, fn) {
            if (typeof fn !== 'function') throw new TypeError('fn must be a valid function');

            if (listeners && listeners.length > 0) {
                var idx = listeners.indexOf(fn);
                if (idx >= 0) listeners.splice(idx, 1);
            }
        }
    }, {
        key: '$emit',
        value: function $emit(type) {
            if (!this.$$listeners.hasOwnProperty(type) || this.$$listeners[type].length === 0) return;

            var listeners = this.$$listeners[type].slice();
            var argLen = arguments.length;
            var args = argLen > 4 ? Array.prototype.slice(arguments, 1) : null;

            for (var i = 0, j = listeners.length; i < j; ++i) {
                var listener = listeners[i];

                switch (argLen) {
                    case 1:
                        listener();
                        break;
                    case 2:
                        listener(arguments[1]);
                        break;
                    case 3:
                        listener(arguments[1], arguments[2]);
                        break;
                    case 4:
                        listener(arguments[1], arguments[2], arguments[3]);
                        break;
                    default:
                        listener.apply(undefined, args);
                        break;
                }
            }
        }
    }, {
        key: '$completeValidation',
        value: function $completeValidation(result, errors) {
            var deferred = this.$$deferredValidation;
            if (deferred) this.$$deferredValidation = null;

            this.$$validationState = result ? ValidationState.Valid : ValidationState.Invalid;
            this.$emit('validate', this, result, errors);

            if (deferred) deferred.resolve(result);
        }
    }, {
        key: '$processValidators',
        value: function $processValidators(addError) {
            var validators = this.$$validators;

            if (validators) {
                for (var i = 0, j = validators.length; i < j; ++i) {
                    if (!validators[i](this, addError)) return false;
                }
            }

            return true;
        }
    }, {
        key: '$processAsyncValidators',
        value: function $processAsyncValidators(addError) {
            var _this4 = this;

            var promises = this.$$asyncValidators.map(function (v) {
                return v(_this4, addError);
            });
            return this.$$q.all(promises).then(function (results) {
                return results.every(function (result) {
                    return result;
                });
            });
        }
    }]);

    return ModelField;
}();

function labelise(name) {
    name = name.substring(name.lastIndexOf('.') + 1);

    var label = name.replace(/([A-Z]+)/g, ' $1').replace(/\W+/g, ' ').replace(/\s{2,}/g, ' ');

    return label[0].toUpperCase() + label.substring(1);
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createCondition = createCondition;

var _util = __webpack_require__(0);

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createCondition(condition, model, parser, locals, callback) {
    if (!callback && typeof locals === 'function') {
        callback = locals;
        locals = null;
    }

    var dependentFields = [];

    condition = condition.replace(/\[([a-zA-Z\$_][\w.]+)\]/g, function (m, fieldName) {
        if (dependentFields.indexOf(fieldName) < 0) dependentFields.push(fieldName);
        return fieldName;
    });

    if (dependentFields.length === 0) console.warn('warning: createCondition: conditional expression does not contain any field references and will only be evaluated once');

    var expr = parser(condition);
    var lastResult = void 0;

    evaluateCondition();
    var unwatchers = dependentFields.map(function (name) {
        return model.watch(name, evaluateCondition);
    });

    return function () {
        return unwatchers.forEach(function (unwatch) {
            return unwatch();
        });
    };

    function evaluateCondition() {
        var context = Object.assign({ '$util': util }, locals);
        var result = !!expr(context, model.getState());

        if (result !== lastResult) {
            lastResult = result;
            callback(lastResult);
        }
    }
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.util = undefined;

var _model = __webpack_require__(1);

Object.keys(_model).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _model[key];
    }
  });
});

var _modelField = __webpack_require__(2);

Object.keys(_modelField).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _modelField[key];
    }
  });
});

var _ng = __webpack_require__(6);

var _ng2 = _interopRequireDefault(_ng);

var _util = __webpack_require__(0);

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.util = util;
exports.default = _ng2.default;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory){
  'use strict';

  /*istanbul ignore next:cant test*/
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    // Browser globals
    root.objectPath = factory();
  }
})(this, function(){
  'use strict';

  var toStr = Object.prototype.toString;
  function hasOwnProperty(obj, prop) {
    if(obj == null) {
      return false
    }
    //to handle objects with null prototypes (too edge case?)
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }

  function isEmpty(value){
    if (!value) {
      return true;
    }
    if (isArray(value) && value.length === 0) {
        return true;
    } else if (typeof value !== 'string') {
        for (var i in value) {
            if (hasOwnProperty(value, i)) {
                return false;
            }
        }
        return true;
    }
    return false;
  }

  function toString(type){
    return toStr.call(type);
  }

  function isObject(obj){
    return typeof obj === 'object' && toString(obj) === "[object Object]";
  }

  var isArray = Array.isArray || function(obj){
    /*istanbul ignore next:cant test*/
    return toStr.call(obj) === '[object Array]';
  }

  function isBoolean(obj){
    return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
  }

  function getKey(key){
    var intKey = parseInt(key);
    if (intKey.toString() === key) {
      return intKey;
    }
    return key;
  }

  function factory(options) {
    options = options || {}

    var objectPath = function(obj) {
      return Object.keys(objectPath).reduce(function(proxy, prop) {
        if(prop === 'create') {
          return proxy;
        }

        /*istanbul ignore else*/
        if (typeof objectPath[prop] === 'function') {
          proxy[prop] = objectPath[prop].bind(objectPath, obj);
        }

        return proxy;
      }, {});
    };

    function hasShallowProperty(obj, prop) {
      return (options.includeInheritedProps || (typeof prop === 'number' && Array.isArray(obj)) || hasOwnProperty(obj, prop))
    }

    function getShallowProperty(obj, prop) {
      if (hasShallowProperty(obj, prop)) {
        return obj[prop];
      }
    }

    function set(obj, path, value, doNotReplace){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        return obj;
      }
      if (typeof path === 'string') {
        return set(obj, path.split('.').map(getKey), value, doNotReplace);
      }
      var currentPath = path[0];
      var currentValue = getShallowProperty(obj, currentPath);
      if (path.length === 1) {
        if (currentValue === void 0 || !doNotReplace) {
          obj[currentPath] = value;
        }
        return currentValue;
      }

      if (currentValue === void 0) {
        //check if we assume an array
        if(typeof path[1] === 'number') {
          obj[currentPath] = [];
        } else {
          obj[currentPath] = {};
        }
      }

      return set(obj[currentPath], path.slice(1), value, doNotReplace);
    }

    objectPath.has = function (obj, path) {
      if (typeof path === 'number') {
        path = [path];
      } else if (typeof path === 'string') {
        path = path.split('.');
      }

      if (!path || path.length === 0) {
        return !!obj;
      }

      for (var i = 0; i < path.length; i++) {
        var j = getKey(path[i]);

        if((typeof j === 'number' && isArray(obj) && j < obj.length) ||
          (options.includeInheritedProps ? (j in Object(obj)) : hasOwnProperty(obj, j))) {
          obj = obj[j];
        } else {
          return false;
        }
      }

      return true;
    };

    objectPath.ensureExists = function (obj, path, value){
      return set(obj, path, value, true);
    };

    objectPath.set = function (obj, path, value, doNotReplace){
      return set(obj, path, value, doNotReplace);
    };

    objectPath.insert = function (obj, path, value, at){
      var arr = objectPath.get(obj, path);
      at = ~~at;
      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }
      arr.splice(at, 0, value);
    };

    objectPath.empty = function(obj, path) {
      if (isEmpty(path)) {
        return void 0;
      }
      if (obj == null) {
        return void 0;
      }

      var value, i;
      if (!(value = objectPath.get(obj, path))) {
        return void 0;
      }

      if (typeof value === 'string') {
        return objectPath.set(obj, path, '');
      } else if (isBoolean(value)) {
        return objectPath.set(obj, path, false);
      } else if (typeof value === 'number') {
        return objectPath.set(obj, path, 0);
      } else if (isArray(value)) {
        value.length = 0;
      } else if (isObject(value)) {
        for (i in value) {
          if (hasShallowProperty(value, i)) {
            delete value[i];
          }
        }
      } else {
        return objectPath.set(obj, path, null);
      }
    };

    objectPath.push = function (obj, path /*, values */){
      var arr = objectPath.get(obj, path);
      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }

      arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
    };

    objectPath.coalesce = function (obj, paths, defaultValue) {
      var value;

      for (var i = 0, len = paths.length; i < len; i++) {
        if ((value = objectPath.get(obj, paths[i])) !== void 0) {
          return value;
        }
      }

      return defaultValue;
    };

    objectPath.get = function (obj, path, defaultValue){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        return obj;
      }
      if (obj == null) {
        return defaultValue;
      }
      if (typeof path === 'string') {
        return objectPath.get(obj, path.split('.'), defaultValue);
      }

      var currentPath = getKey(path[0]);
      var nextObj = getShallowProperty(obj, currentPath)
      if (nextObj === void 0) {
        return defaultValue;
      }

      if (path.length === 1) {
        return nextObj;
      }

      return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
    };

    objectPath.del = function del(obj, path) {
      if (typeof path === 'number') {
        path = [path];
      }

      if (obj == null) {
        return obj;
      }

      if (isEmpty(path)) {
        return obj;
      }
      if(typeof path === 'string') {
        return objectPath.del(obj, path.split('.'));
      }

      var currentPath = getKey(path[0]);
      if (!hasShallowProperty(obj, currentPath)) {
        return obj;
      }

      if(path.length === 1) {
        if (isArray(obj)) {
          obj.splice(currentPath, 1);
        } else {
          delete obj[currentPath];
        }
      } else {
        return objectPath.del(obj[currentPath], path.slice(1));
      }

      return obj;
    }

    return objectPath;
  }

  var mod = factory();
  mod.create = factory;
  mod.withInheritedProps = factory({includeInheritedProps: true})
  return mod;
});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = __webpack_require__(7);

var _modelBuilder = __webpack_require__(9);

var _validatorFactory = __webpack_require__(10);

var _dynamicModel = __webpack_require__(11);

var _fieldModelFor = __webpack_require__(12);

var _fieldMultiModelFor = __webpack_require__(13);

var _fieldConditionFor = __webpack_require__(14);

var _fieldCondition = __webpack_require__(15);

var _fieldValidationFor = __webpack_require__(16);

var _fieldValidationMessageFor = __webpack_require__(17);

function directive(ctor) {
    var inject = ctor.dependencies || ctor.prototype.dependencies;
    if (!inject) return function () {
        return new ctor();
    };

    var factory = function factory() {
        return new (Function.prototype.bind.apply(ctor, [null].concat(Array.prototype.slice.call(arguments))))();
    };
    factory.$inject = inject;
    return factory;
}

var lib = angular.module('ng-dynamic-model', []).config(_config.ValidationConfig).provider('ValidatorFactory', _validatorFactory.ValidatorFactoryProvider).service('ModelBuilder', _modelBuilder.ModelBuilder).directive('dynamicModel', directive(_dynamicModel.DynamicModelDirective)).directive('fieldModelFor', directive(_fieldModelFor.FieldModelForDirective)).directive('fieldMultiModelFor', directive(_fieldMultiModelFor.FieldMultiModelForDirective)).directive('fieldConditionFor', directive(_fieldConditionFor.FieldConditionForDirective)).directive('fieldCondition', directive(_fieldCondition.FieldConditionDirective)).directive('fieldValidationFor', directive(_fieldValidationFor.FieldValidationForDirective)).directive('fieldValidationMessageFor', directive(_fieldValidationMessageFor.FieldValidationMessageForDirective));

exports.default = lib.name;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ValidationConfig = ValidationConfig;

var _required = __webpack_require__(8);

ValidationConfig.$inject = ['ValidatorFactoryProvider'];
function ValidationConfig(provider) {
    provider.register('required', _required.RequiredValidator);
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RequiredValidator = RequiredValidator;

var _util = __webpack_require__(0);

function RequiredValidator(field, addError, args) {
    if (!(0, _util.empty)(field.value())) return true;

    addError(args && args.message || field.label + ' is a required field');
    return false;
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ModelBuilder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _model = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelBuilder = exports.ModelBuilder = function () {
    function ModelBuilder(q) {
        _classCallCheck(this, ModelBuilder);

        this.$$q = q;
    }

    _createClass(ModelBuilder, [{
        key: 'build',
        value: function build(initialState) {
            return new _model.Model(this.$$q, initialState);
        }
    }]);

    return ModelBuilder;
}();

ModelBuilder.$inject = ['$q'];

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ValidatorFactoryProvider = ValidatorFactoryProvider;
function ValidatorFactoryProvider() {
    var validators = {};

    this.register = register;

    this.$get = function () {
        return {
            get: function get(name) {
                return validators[name];
            },
            register: register
        };
    };

    function register(name, isAsync, fn) {
        if (validators.hasOwnProperty(name)) console.warn('validator-factory: overwriting previously registered validator "' + name + '"');

        if (typeof isAsync === 'function') {
            fn = isAsync;
            isAsync = false;
        }

        validators[name] = {
            async: isAsync,
            name: name,
            fn: fn
        };

        return this;
    }
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DynamicModelDirective = DynamicModelDirective;
function DynamicModelDirective() {}

DynamicModelDirective.prototype = {
    restrict: 'A',
    scope: { model: '=dynamicModel' },
    controller: ['$scope', function (scope) {
        if (!scope.model) throw new TypeError('dynamic-model: invalid model specified');
        this.model = scope.model;
    }]
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FieldModelForDirective = FieldModelForDirective;
function FieldModelForDirective() {}

FieldModelForDirective.prototype = {
    restrict: 'A',
    require: ['^^dynamicModel', 'ngModel'],
    link: function link(scope, $element, attrs, ctrls) {
        if (!attrs['fieldModelFor']) throw new TypeError('form-model-for: missing required attribute "field-model-for"');

        var field = ctrls[0].model.field(attrs['fieldModelFor']);
        var modelController = ctrls[1];

        // Override model controller methods     
        var commitViewValue = modelController.$commitViewValue;
        var render = modelController.$render;

        // Set up change handlers and update the UI
        field.watch(onUpdate);
        onUpdate();

        modelController.$render = function () {
            var value = this.$modelValue || this.$viewValue;
            if (value || modelController.$dirty) field.setValue(value);
            return render.call(this);
        };

        modelController.$commitViewValue = function () {
            var result = commitViewValue.call(this);
            field.setValue(this.$modelValue || this.$viewValue);
            return result;
        };

        function onUpdate() {
            var uiValue = modelController.$modelValue || modelController.$viewValue;
            var modelValue = field.value();

            if (uiValue !== modelValue) {
                modelController.$viewValue = modelValue;
                // Make sure to call the original functions to avoid infinitely recursing.
                commitViewValue.call(modelController);
                render.call(modelController);
            }
        }
    }
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.FieldMultiModelForDirective = FieldMultiModelForDirective;
function FieldMultiModelForDirective(parse) {
    this.parse = parse;
}

FieldMultiModelForDirective.prototype = {
    restrict: 'A',
    require: '^^dynamicModel',
    dependencies: ['$parse'],
    link: function link(scope, $element, attrs, modelCtrl) {
        if (!attrs['fieldMultiModelFor'] || !attrs['value'] && !attrs['ngValue']) throw new TypeError('form-multi-model: missing required attribute "' + (!attrs['fieldMultiModelFor'] ? 'field-multi-model' : 'value') + '"');

        var field = modelCtrl.model.field(attrs['fieldMultiModelFor']);
        var element = $element.get(0);
        var allowMultiple = attrs['type'] === 'checkbox';
        var trackBy = attrs['trackBy'];

        var value = attrs['ngValue'] ? this.parse(attrs['ngValue'])(scope, modelCtrl.model.getState()) : attrs['value'];

        $element.on('change', function () {
            if (allowMultiple || this.checked) scope.$apply(processChange);
        });

        var unbindChange = field.on('change', onUpdate);
        var unbindToggle = field.on('toggle', onUpdate);

        // Remove all listeners once the directive is destroyed.
        this.$onDestroy = function () {
            unbindChange();
            unbindToggle();
        };

        onUpdate(field);

        function processChange() {
            if (!allowMultiple) return field.setValue(value);

            var model = field.value(),
                idx = -1;

            if (!Array.isArray(model)) model = model ? [model] : [];

            for (var i = 0, j = model.length; i < j; ++i) {
                if (compareValues(model[i])) {
                    idx = i;
                    break;
                }
            }

            if (element.checked && idx < 0) {
                model.push(value);
                field.setValue(model);
            } else if (!element.checked && idx >= 0) {
                model.splice(idx, 1);
                field.setValue(model);
            }
        }

        function onUpdate(field) {
            var modelValue = field.value();
            var shouldBeChecked = !Array.isArray(modelValue) && compareValues(modelValue) || Array.isArray(modelValue) && modelValue.some(compareValues);

            if (element.checked !== shouldBeChecked) element.checked = shouldBeChecked;
        }

        function compareValues(modelValue) {
            if (!trackBy) return modelValue == value;

            return modelValue && value && (typeof modelValue === 'undefined' ? 'undefined' : _typeof(modelValue)) === (typeof value === 'undefined' ? 'undefined' : _typeof(value)) && modelValue.hasOwnProperty(trackBy) && value.hasOwnProperty(trackBy) && modelValue[trackBy] == value[trackBy];
        }
    }
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FieldConditionForDirective = FieldConditionForDirective;

var _createCondition = __webpack_require__(3);

function FieldConditionForDirective(parser) {
    this.parser = parser;
}

FieldConditionForDirective.prototype = {
    restrict: 'A',
    dependencies: ['$parse'],
    require: '^^dynamicModel',
    link: function link(scope, $element, attrs, modelCtrl) {
        if (!attrs['fieldConditionFor'] || !attrs['condition']) throw new TypeError('field-condition-for: missing required attribute "' + (attrs['condition'] ? 'field-condition-for' : 'condition') + '"');

        var field = modelCtrl.model.field(attrs['fieldConditionFor']);
        var speed = 0;

        var off = (0, _createCondition.createCondition)(attrs['condition'], modelCtrl.model, this.parser, scope, function (result) {
            field.setActive(result);
            $element[result ? 'show' : 'hide'](speed);
        });

        // Update the speed after the first run
        speed = attrs['speed'] ? parseInt(attrs['speed'], 10) : 300;

        // When destroyed, release the condition
        this.$onDestroy = off;
    }
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FieldConditionDirective = FieldConditionDirective;

var _createCondition = __webpack_require__(3);

function FieldConditionDirective(parser) {
    this.parser = parser;
}

FieldConditionDirective.prototype = {
    restrict: 'A',
    dependencies: ['$parse'],
    require: '^^dynamicModel',
    link: function link(scope, $element, attrs, modelCtrl) {
        if (!attrs['fieldCondition']) throw new TypeError('field-condition-for: missing required attribute "field-condition"');

        var speed = 0;

        var off = (0, _createCondition.createCondition)(attrs['fieldCondition'], modelCtrl.model, this.parser, scope, function (result) {
            $element[result ? 'show' : 'hide'](speed);
        });

        // Update the speed after the first run
        speed = attrs['speed'] ? parseInt(attrs['speed'], 10) : 300;

        // When destroyed, release the condition
        this.$onDestroy = off;
    }
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.FieldValidationForDirective = FieldValidationForDirective;
var InvalidClass = 'ng-invalid';
var ValidClass = 'ng-pristine';

function FieldValidationForDirective(validatorFactory) {
    this.validatorFactory = validatorFactory;
}

FieldValidationForDirective.prototype = {
    restrict: 'A',
    require: '^^dynamicModel',
    dependencies: ['ValidatorFactory'],
    link: function link(scope, $element, attrs, modelCtrl) {
        var _this = this;

        if (!attrs['fieldValidationFor']) throw new TypeError('field-validation-for: missing required attribute "field-validation-for"');

        var invalidClass = attrs['invalidClass'] || InvalidClass;
        var validClass = attrs['validClass'] || ValidClass;

        var fields = attrs['fieldValidationFor'].split(',').map(function (name) {
            return modelCtrl.model.field(name.trim());
        });

        var unbinders = fields.reduce(function (acc, f) {
            acc.push(f.on('change', onUpdated));
            acc.push(f.on('validate', onUpdated));
            return acc;
        }, []);

        this.$onDestroy = function () {
            return unbinders.forEach(function (fn) {
                return fn();
            });
        };

        if (attrs.hasOwnProperty('validators')) {
            var unwatch = scope.$watch(attrs['validators'], function (newValue) {
                if (typeof newValue !== 'undefined') {
                    unwatch();
                    _this.$initialise(fields, newValue);
                }
            });
        }

        onUpdated();

        function onUpdated() {
            var validated = fields.every(function (f) {
                return f.isValidated();
            });
            var valid = fields.every(function (f) {
                return f.isValid();
            });

            $element[validated && valid ? 'addClass' : 'removeClass'](validClass);
            $element[validated && !valid ? 'addClass' : 'removeClass'](invalidClass);
        }
    },

    $initialise: function $initialise(fields, validatorMetadata) {
        var _this2 = this;

        var validators = Array.isArray(validatorMetadata) ? validatorMetadata.map(function (meta) {
            return createValidator(meta, _this2.validatorFactory);
        }) : [createValidator(validatorMetadata), this.validatorFactory];

        // Add the validators to all fields
        fields.forEach(function (field) {
            validators.forEach(function (validator) {
                if (validator.async) field.addAsyncValidator(validator);else field.addValidator(validator);
            });
        });
    }
};

function createValidator(metadata, factory) {
    var args = void 0,
        validator = void 0;

    if (typeof metadata === 'string') validator = factory.get(metadata);else if (metadata && (typeof metadata === 'undefined' ? 'undefined' : _typeof(metadata)) === 'object' && metadata.hasOwnProperty('name')) {
        validator = factory.get(metadata.name);
        args = metadata;
    }

    if (!validator) throw new Error('field-validation-for: unknown validator encountered (' + JSON.stringify(metadata) + ')');

    var fn = function fn(field, addError) {
        return validator.fn.call(validator, field, addError, args);
    };
    fn.async = validator.async;

    return fn;
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FieldValidationMessageForDirective = FieldValidationMessageForDirective;
var InvalidClass = 'ng-invalid';
var ValidClass = 'ng-pristine';

function FieldValidationMessageForDirective(validatorFactory) {
    this.validatorFactory = validatorFactory;
}

FieldValidationMessageForDirective.prototype = {
    restrict: 'A',
    require: '^^dynamicModel',
    link: function link(scope, $element, attrs, modelCtrl) {
        if (!attrs['fieldValidationMessageFor']) throw new TypeError('field-validation-message-for: missing required attribute "field-validation-message-for"');

        var field = modelCtrl.model.field(attrs['fieldValidationMessageFor']);

        var unbinders = [field.on('change', function () {
            return update(true);
        }), field.on('validate', function (f, valid, errors) {
            return update(valid, errors[0]);
        })];

        this.$onDestroy = function () {
            return unbinders.forEach(function (fn) {
                return fn();
            });
        };
        update(true);

        function update(valid, error) {
            $element.text(valid ? '' : error);
            $element[!valid && error ? 'show' : 'hide']();
        }
    }
};

/***/ })
/******/ ]);
});