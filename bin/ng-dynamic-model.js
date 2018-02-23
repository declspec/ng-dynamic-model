/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelField = exports.ModelField = function () {
    function ModelField(model, name, value, q) {
        var _this = this;

        _classCallCheck(this, ModelField);

        this.name = name;
        this.label = labelise(name);

        this.$$model = model;
        this.$$value = value;
        this.$$q = q;
        this.$$active = true;
        this.$$dirty = false;
        this.$$listeners = {};
        this.$$validationId = 0;

        // Set up an internal watch to propagate external value changes
        this.watch(function (newValue, oldValue, path) {
            if (newValue !== _this.$$value) {
                _this.$$value = newValue;
                _this.setDirty(true);
            }

            _this.$emit('change', _this, newValue, oldValue);
        });
    }

    _createClass(ModelField, [{
        key: 'isValid',
        value: function isValid() {
            return this.isValidated() && this.$$valid;
        }
    }, {
        key: 'isValidated',
        value: function isValidated() {
            return this.$$validated;
        }
    }, {
        key: 'isDirty',
        value: function isDirty() {
            return this.$$dirty;
        }
    }, {
        key: 'isActive',
        value: function isActive() {
            return this.$$active;
        }
    }, {
        key: 'val',
        value: function val() {
            return this.$$value;
        }
    }, {
        key: 'getErrors',
        value: function getErrors() {
            return this.$$errors;
        }
    }, {
        key: 'hasValidation',
        value: function hasValidation() {
            return this.$$validators && this.$$validators.length || this.$$asyncValidators && this.$$asyncValidators.length;
        }
    }, {
        key: 'setValue',
        value: function setValue(value) {
            // clear out the last active value as it will no longer be relevant.
            if (this.$$lastActiveValue) this.$$lastActiveValue = undefined;

            // This will flow through to the internal watcher.
            this.$$model.set(this.name, value);
        }
    }, {
        key: 'setDirty',
        value: function setDirty(dirty) {
            this.$$dirty = !!dirty;
            this.$$errors = undefined;
            this.setValidated(false);
        }
    }, {
        key: 'setValidated',
        value: function setValidated(validated) {
            this.$$validated = !!validated;
        }
    }, {
        key: 'setActive',
        value: function setActive(active) {
            this.$$active = !!active;

            if (this.$$active && this.$$lastActiveValue) this.setValue(this.$$lastActiveValue);else if (!this.$$active) {
                // Cache the current value for when/if the field is re-activated.
                var last = this.value();
                this.setValue(undefined);
                this.$$lastActiveValue = last;
            }

            this.$emit('toggle', this, this.$$active);
        }
    }, {
        key: 'addValidator',
        value: function addValidator(validator) {
            if (!this.$$validators) this.$$validators = [];
            this.$$validators.push(validator);
            return this;
        }
    }, {
        key: 'addAsyncValidator',
        value: function addAsyncValidator(validator) {
            if (!this.$$asyncValidators) this.$$asyncValidators = [];
            this.$$asyncValidators.push(validator);
            return this;
        }
    }, {
        key: 'validate',
        value: function validate() {
            var _this2 = this;

            var hasAsyncValidators = this.$$asyncValidators && this.$$asyncValidators.length;
            var hasValidators = this.$$validators && this.$$validators.length;

            var errors = [];
            var result = !hasValidators || this.$processValidators(appendError);

            if (!result || !hasAsyncValidators) {
                // Can return early
                this.$completeValidation(result, errors);
                return this.$$q.resolve(result);
            }

            // Run the async validators
            var ref = ++this.$$validationId;

            if (!this.$$deferredValidation) this.$$deferredValidation = this.$$q.defer();

            this.$processAsyncValidators(appendError).then(function (result) {
                if (ref === _this2.$$validationId) _this2.$completeValidation(result, errors);
            }, function (err) {
                if (ref === _this2.$$validationId) {
                    var deferred = _this2.$$deferredValidation;
                    _this2.$$deferredValidation = null;
                    if (deferred) deferred.reject(err);
                }
            });

            return this.$$deferredValidation.promise;

            function appendError(err) {
                if (typeof err === 'string') err = err.replace('%field%', this.label);
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

            if (!this.$$listeners.hasOwnProperty(type)) this.$$listeners[type] = [fn];else this.$$listeners[type].push(fn);

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
        key: '$processValidators',
        value: function $processValidators(appendError) {
            var validators = this.$$validators;

            for (var i = 0, j = validators.length; i < j; ++i) {
                if (!validators[i](this, appendError)) return false;
            }

            return true;
        }
    }, {
        key: '$processAsyncValidators',
        value: function $processAsyncValidators(appendError) {
            var _this4 = this;

            var validators = this.$$asyncValidators;

            if (validators && validators.length) {
                var promises = validators.map(function (v) {
                    return v(_this4, appendError);
                });
                return this.$$q.all(promises).then(function (results) {
                    return results.every(function (result) {
                        return result;
                    });
                });
            }
        }
    }, {
        key: '$completeValidation',
        value: function $completeValidation(valid, errors) {
            var previous = this.$$valid;
            var deferred = this.$$deferredValidation;

            this.$$valid = valid;
            this.$$errors = errors;
            this.$$deferredValidation = null;
            this.setValidated(true);

            // Emit the event and then resolve the promise.
            // This could be a bit racy.
            this.$emit('validate', this, previous);
            if (deferred) deferred.resolve(valid);
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _model = __webpack_require__(2);

Object.keys(_model).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _model[key];
        }
    });
});

var _modelField = __webpack_require__(0);

Object.keys(_modelField).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _modelField[key];
        }
    });
});

var _modelBuilder = __webpack_require__(7);

var _dynamicModel = __webpack_require__(4);

var _fieldModelFor = __webpack_require__(5);

var _fieldConditionFor = __webpack_require__(8);

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

var lib = angular.module('ng-dynamic-model', []).service('ModelBuilder', _modelBuilder.ModelBuilder).directive('dynamicModel', directive(_dynamicModel.DynamicModelDirective)).directive('fieldModelFor', directive(_fieldModelFor.FieldModelForDirective)).directive('fieldConditionFor', directive(_fieldConditionFor.FieldConditionForDirective));

exports.default = lib.name;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Model = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectPath = __webpack_require__(3);

var objectPath = _interopRequireWildcard(_objectPath);

var _modelField = __webpack_require__(0);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = exports.Model = function () {
    function Model(initialState) {
        _classCallCheck(this, Model);

        this.$$state = initialState || {};

        if (_typeof(this.$$state) !== 'object') throw new TypeError('initialState must be a valid object');

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
            return this.$$fields[path] = new _modelField.ModelField(this, path, startValue);
        }
    }]);

    return Model;
}();

function defaultComparer(o1, o2) {
    return o1 === o2;
}

/***/ }),
/* 3 */
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
/* 4 */
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
/* 5 */
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
        field.on('change', onUpdate);
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
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ModelBuilder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _model = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelBuilder = exports.ModelBuilder = function () {
    function ModelBuilder() {
        _classCallCheck(this, ModelBuilder);
    }

    _createClass(ModelBuilder, [{
        key: 'build',
        value: function build(initialState) {
            return new _model.Model(initialState);
        }
    }]);

    return ModelBuilder;
}();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FieldConditionForDirective = FieldConditionForDirective;

var _createCondition = __webpack_require__(9);

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
            field[result ? 'activate' : 'deactivate']();
            $element[result ? 'show' : 'hide'](speed);
        });

        // Update the speed after the first run
        speed = attrs['speed'] ? parseInt(attrs['speed'], 10) : 300;

        // When destroyed, release the condition
        this.$onDestroy = off;
    }
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createCondition = createCondition;
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
        var result = !!expr(locals, model.getState());

        if (result !== lastResult) {
            lastResult = result;
            callback(lastResult);
        }
    }
}

/***/ })
/******/ ]);