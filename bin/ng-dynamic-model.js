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
            if (typeof path !== 'string') {
                value = path;
                path = null;
            }

            if (path !== null) objectPath.set(this.$$state, path, value);else {
                // Update the entire state when no path is specified.
                this.$$state = value;
            }

            // Invoke all the subscribers
            var subscribers = this.$$subscribers.slice();

            for (var i = 0, j = subscribers.length; i < j; ++i) {
                subscribers[i](this.$$state, path);
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
        key: 'setPristine',
        value: function setPristine() {
            for (var path in this.$$fields) {
                if (this.$$fields.hasOwnProperty(path)) {
                    var field = this.$$fields[path];
                    field.setDirty(false);
                }
            }
        }
    }, {
        key: 'hasDirtyFields',
        value: function hasDirtyFields() {
            for (var path in this.$$fields) {
                if (!this.$$fields.hasOwnProperty(path)) continue;

                var field = this.$$fields[path];
                if (field.isDirty() && field.isActive()) return true;
            }

            return false;
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
exports.ModelField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationState = {
    Valid: 0,
    Invalid: 1,
    Unknown: 2
};

function fieldValueComparer(v1, v2) {
    if (v1 !== v2) return false;

    var type = (0, _util.getType)(v1);
    return type !== 'object' && type !== 'array';
}

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
        value: function watch(fn, comparer) {
            return this.$$model.watch(this.name, fn, comparer || fieldValueComparer);
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

            var listeners = this.$$listeners[type];

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

function fieldValueComparer(v1, v2) {
    if (v1 !== v2) return false;

    var type = util.getType(v1);
    return type !== 'object' && type !== 'array';
}

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
        return model.watch(name, evaluateCondition, fieldValueComparer);
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

var _fieldConditionFor = __webpack_require__(13);

var _fieldCondition = __webpack_require__(14);

var _readonlyFieldFor = __webpack_require__(15);

var _fieldRepeatFor = __webpack_require__(16);

var _fieldValidationFor = __webpack_require__(17);

var _fieldValidationMessageFor = __webpack_require__(18);

var _addPolyfills = __webpack_require__(19);

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

var lib = angular.module('ng-dynamic-model', []).config(_config.ValidationConfig).provider('ValidatorFactory', _validatorFactory.ValidatorFactoryProvider).service('ModelBuilder', _modelBuilder.ModelBuilder).directive('dynamicModel', directive(_dynamicModel.DynamicModelDirective)).directive('fieldModelFor', directive(_fieldModelFor.FieldModelForDirective)).directive('fieldConditionFor', directive(_fieldConditionFor.FieldConditionForDirective)).directive('fieldCondition', directive(_fieldCondition.FieldConditionDirective)).directive('fieldValidationFor', directive(_fieldValidationFor.FieldValidationForDirective)).directive('fieldValidationMessageFor', directive(_fieldValidationMessageFor.FieldValidationMessageForDirective)).directive('readonlyFieldFor', directive(_readonlyFieldFor.ReadonlyFieldForDirective)).directive('fieldRepeatFor', _fieldRepeatFor.FieldRepeatForDirective).run(_addPolyfills.AddPolyfills);

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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.DynamicModelDirective = DynamicModelDirective;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExpressionPattern = /^\s*((?:[a-z_$][a-z0-9_$]*)(?:\.[a-z_$][a-z0-9_$]*)*)\s*$/i;

function DynamicModelDirective() {}

var DynamicModelController = function () {
    function DynamicModelController(scope) {
        _classCallCheck(this, DynamicModelController);

        if (!scope.model) throw new TypeError('dynamic-model: invalid value found for attribute "dynamic-model"; expected a Model, got ' + _typeof(scope.model));
        this.model = scope.model;
    }

    _createClass(DynamicModelController, [{
        key: 'fieldFor',
        value: function fieldFor(scope, expr, context) {
            return getField(this.model, scope.$eval(expr), context);
        }
    }, {
        key: 'fieldsFor',
        value: function fieldsFor(scope, expr, context) {
            var _this = this;

            var fieldNames = scope.$eval(expr);

            if (typeof fieldNames !== 'string' && !Array.isArray(fieldNames)) throw new TypeError(err(context, 'string or array', fieldNames));

            return typeof fieldNames === 'string' ? [getField(this.model, fieldNames, context)] : fieldNames.map(function (name) {
                return getField(_this.model, name, context);
            });
        }
    }]);

    return DynamicModelController;
}();

DynamicModelDirective.prototype = {
    restrict: 'A',
    scope: { model: '=dynamicModel' },
    controller: ['$scope', DynamicModelController]
};

function err(ctx, types, actual) {
    return (ctx || 'dynamic-model') + ': invalid field identifier value encountered; expected ' + types + ', got ' + (typeof actual === 'undefined' ? 'undefined' : _typeof(actual));
}

function getField(model, name, context) {
    if (typeof name !== 'string') throw new TypeError(err(context, 'string', name));

    var match = name.match(ExpressionPattern);
    if (!match) throw new TypeError((context || 'dynamic-model') + ': invalid field identifier encountered: ' + name);
    return model.field(match[1]);
}

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
        var field = ctrls[0].fieldFor(scope, attrs['fieldModelFor'], 'field-model-for');
        var modelController = ctrls[1];

        // Override model controller methods     
        var commitViewValue = modelController.$commitViewValue;
        var render = modelController.$render;

        // Set up change handlers and update the UI
        scope.$on('$destroy', field.watch(onUpdate));
        onUpdate(field.value());

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

        function onUpdate(fieldValue) {
            var uiValue = modelController.$modelValue || modelController.$viewValue;

            if (uiValue !== fieldValue) {
                modelController.$viewValue = fieldValue;
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
        if (!attrs['condition']) throw new TypeError('field-condition-for: missing required attribute "condition"');

        var fields = modelCtrl.fieldsFor(scope, attrs['fieldConditionFor'], 'field-condition-for');
        var speed = 0;

        var off = (0, _createCondition.createCondition)(attrs['condition'], modelCtrl.model, this.parser, scope, function (result) {
            fields.forEach(function (f) {
                return f.setActive(result);
            });
            $element[result ? 'show' : 'hide'](speed);
        });

        // Update the speed after the first run
        speed = attrs['speed'] ? parseInt(attrs['speed'], 10) : 300;

        // When destroyed, release the condition
        scope.$on('$destroy', off);
    }
};

/***/ }),
/* 14 */
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
        scope.$on('$destroy', off);
    }
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReadonlyFieldForDirective = ReadonlyFieldForDirective;
function ReadonlyFieldForDirective(parse) {
    this.parse = parse;
}

ReadonlyFieldForDirective.prototype = {
    restrict: 'A',
    require: '^^dynamicModel',
    dependencies: ['$parse'],
    link: function link(scope, $element, attrs, modelCtrl) {
        var model = modelCtrl.model;
        var fields = modelCtrl.fieldsFor(scope, attrs['readonlyFieldFor'], 'readonly-field-for');
        var expr = attrs['expr'] ? this.parse(attrs['expr']) : null;

        if (fields.length > 1 && !expr) throw new TypeError('readonly-field-for: invalid value found for attribute "readonly-field-for"; expected a string when "expr" is not provided');

        var unbinders = fields.map(function (f) {
            return f.on('change', onUpdated);
        });
        onUpdated(fields[0]);

        scope.$on('$destroy', function () {
            return unbinders.forEach(function (fn) {
                return fn();
            });
        });

        function onUpdated(f) {
            var val = expr ? expr(scope, model.getState()) : f.value();
            $element.html(val);
        }
    }
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FieldRepeatForDirective = FieldRepeatForDirective;

var _util = __webpack_require__(0);

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var RemovedFlag = '$$removed';
var FilterContext = { '$util': util };

function findBlockIndexByValue(blocks, value) {
    for (var i = 0, j = blocks.length; i < j; ++i) {
        if (blocks[i].value === value) return i;
    }

    return -1;
}

FieldRepeatForDirective.$inject = ['$q', '$animate', '$parse', 'ModelBuilder'];

function FieldRepeatForDirective(q, animate, parse, modelBuilder) {
    return {
        restrict: 'A',
        transclude: 'element',
        terminal: true,
        priority: 10,
        require: '^^dynamicModel',

        compile: function compile($element, attrs) {
            return function (scope, $element, attrs, ctrl, transclude) {
                var field = ctrl.fieldFor(scope, attrs['fieldRepeatFor'], 'field-repeat-for');
                var filter = attrs['filter'] && parse(attrs['filter']);

                var lastBlocks = [];

                field.addAsyncValidator(function (f, addError) {
                    return q.all(lastBlocks.map(function (b) {
                        return b.model.validate();
                    })).then(function (results) {
                        return results.every(function (r) {
                            return r;
                        });
                    });
                });

                field.watch(onFieldUpdated);
                onFieldUpdated(field.value());

                function onFieldUpdated(newValue) {
                    var nextBlocks = [];

                    if (Array.isArray(newValue)) {
                        for (var i = 0, j = newValue.length; i < j; ++i) {
                            var value = newValue[i];

                            if (filter && !filter(FilterContext, value)) continue;

                            var idx = findBlockIndexByValue(lastBlocks, value);

                            var nextBlock = idx >= 0 ? lastBlocks.splice(idx, 1)[0] // previous block
                            : { value: value, model: createModel(field, value) }; // new block since last run  

                            // Keep track of the reference in relation to the source data set.
                            nextBlock.index = i;
                            nextBlocks.push(nextBlock);
                        }
                    }

                    // Remove blocks that weren't transferred
                    for (var _i = 0, _j = lastBlocks.length; _i < _j; ++_i) {
                        var block = lastBlocks[_i];
                        animate.leave(block.clone);

                        if (block.clone[0].parentNode) block.clone[0][RemovedFlag] = true;

                        block.scope.$destroy();
                    }

                    var previousNode = $element[0];

                    var _loop = function _loop(_i2, _j2) {
                        var block = nextBlocks[_i2];

                        if (!block.scope) {
                            // Brand new block
                            transclude(function (clone, scope) {
                                block.scope = scope;
                                animate.enter(clone, null, previousNode);
                                previousNode = clone[0];
                                block.clone = clone;
                                updateBlock(block, _i2, nextBlocks.length, newValue.length);
                            });
                        } else {
                            // Re-use the element
                            var nextNode = previousNode;

                            do {
                                nextNode = previousNode.nextSibling;
                            } while (nextNode && nextNode[RemovedFlag]);

                            if (block.clone[0] !== nextNode) {
                                // Order for this node doesn't match
                                animate.move(block.clone[0], null, previousNode);
                            }

                            previousNode = block.clone[0];
                            updateBlock(block, _i2, nextBlocks.length, newValue.length);
                        }
                    };

                    for (var _i2 = 0, _j2 = nextBlocks.length; _i2 < _j2; ++_i2) {
                        _loop(_i2, _j2);
                    }

                    lastBlocks = nextBlocks;
                }
            };

            function updateBlock(block, index, currentBlocks, totalBlocks) {
                block.scope.$model = block.model;
                block.scope.$index = index;
                block.scope.$count = currentBlocks;
                block.scope.$sourceIndex = block.index;
                block.scope.$sourceCount = totalBlocks;
            }

            function createModel(parentField, state) {
                var model = modelBuilder.build(state);
                model.subscribe(function () {
                    return parentField.setDirty(true);
                });
                return model;
            }
        }
    };
}

/***/ }),
/* 17 */
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

        var fields = modelCtrl.fieldsFor(scope, attrs['fieldValidationFor'], 'field-validation-for');
        var invalidClass = attrs['invalidClass'] || InvalidClass;
        var validClass = attrs['validClass'] || ValidClass;

        var unbinders = fields.reduce(function (acc, f) {
            acc.push(f.on('change', onUpdated));
            acc.push(f.on('validate', onUpdated));
            return acc;
        }, []);

        scope.$on('$destroy', function () {
            return unbinders.forEach(function (fn) {
                return fn();
            });
        });

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
            var valid = fields.every(function (f) {
                return f.isValidated() && f.isValid();
            });
            var invalid = fields.some(function (f) {
                return f.isValidated() && !f.isValid();
            });

            $element[valid ? 'addClass' : 'removeClass'](validClass);
            $element[invalid ? 'addClass' : 'removeClass'](invalidClass);
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FieldValidationMessageForDirective = FieldValidationMessageForDirective;
function FieldValidationMessageForDirective(validatorFactory) {
    this.validatorFactory = validatorFactory;
}

FieldValidationMessageForDirective.prototype = {
    restrict: 'A',
    require: '^^dynamicModel',
    link: function link(scope, $element, attrs, modelCtrl) {
        var field = modelCtrl.fieldFor(scope, attrs['fieldValidationMessageFor'], 'fieldValidationMessageFor');

        var unbinders = [field.on('change', function () {
            return update(true);
        }), field.on('validate', function (f, valid, errors) {
            return update(valid, errors[0]);
        })];

        scope.$on('$destroy', function () {
            return unbinders.forEach(function (fn) {
                return fn();
            });
        });
        update(true);

        function update(valid, error) {
            $element.text(valid ? '' : error);
            $element[!valid && error ? 'show' : 'hide']();
        }
    }
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AddPolyfills = AddPolyfills;
var DataKey = 'ng-dm-polyfill-display';

function AddPolyfills() {
    // Add show/hide polyfills if jQuery isn't present
    if (typeof angular.element.prototype.show === 'undefined') angular.element.prototype.show = show;

    if (typeof angular.element.prototype.hide === 'undefined') angular.element.prototype.hide = hide;
}

function show() {
    var previous = this.data(DataKey) || 'block';
    this.css('display', previous);
}

function hide() {
    // Try store the original display (defaults to block)
    if (!this.data(DataKey)) {
        // TODO: look at perf on getComputedStyle
        var display = this.css('display') || getComputedStyle(this[0], null).display;
        this.data(DataKey, display && display !== 'none' ? display : 'block');
    }

    this.css('display', 'none');
}

/***/ })
/******/ ]);
});