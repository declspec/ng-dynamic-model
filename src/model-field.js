const ValidationState = {
    Valid: 0,
    Invalid: 1,
    Unknown: 2
};

export class ModelField {
    constructor(q, model, name, value) {
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
        this.watch((newValue, oldValue, path) => {
            if (newValue !== this.$$value) 
                this.$$value = newValue;

            this.setDirty(true);
            this.$emit('change', this, newValue, oldValue);
        });
    }

    invalidate() {
        this.$$validationState = ValidationState.Unknown;
    }

    isValid() {
        return this.$$validationState === ValidationState.Valid;
    }

    isValidated() {
        return this.$$validationState !== ValidationState.Unknown;
    }

    isDirty() {
        return this.$$dirty;
    }

    isActive() {
        if (!this.$$active)
            return false;

        const parent = this.$$model.$findParentField(this.name);
        return parent === null || parent.isActive();
    }

    hasValidation() {
        return (this.$$validators && this.$$validators.length)
            || (this.$$asyncValidators && this.$$asyncValidators.length);
    }

    value() {
        return this.$$value;
    }

    setValue(value) {
        // This will flow through to the internal watcher.
        this.$$model.set(this.name, value);
    }

    setDirty(dirty) {
        this.$$dirty = !!dirty;
        this.invalidate();
    }

    setActive(active) {
        this.$$active = !!active;

        if (this.$$active && this.$$lastActiveValue) {
            this.setValue(this.$$lastActiveValue);
        }
        else if (!this.$$active) {
            const current = this.value();

            // Cache the current value for when/if the field is re-activated.
            if (typeof(current) !== 'undefined') { 
                this.setValue(undefined);
                this.$$lastActiveValue = current;
            }
        }

        this.$emit('toggle', this, this.$$active);
    }

    addValidator(validator) {
        if (typeof(validator) !== 'function')
            throw new TypeError('validator must be a valid function');

        if (!this.$$validators)
            this.$$validators = [];

        this.$$validators.push(validator);
        return this;
    }
    
    addAsyncValidator(validator) {
        if (typeof(validator) !== 'function')
            throw new TypeError('validator must be a valid function');
        
        if (!this.$$asyncValidators)
            this.$$asyncValidators = [];

        this.$$asyncValidators.push(validator);
        return this;
    }

    validate(newValue) {
        const errors = [];
        const result = this.$processValidators(addError);

        // Can we exit early?
        if (!result || (!this.$$asyncValidators || !this.$$asyncValidators.length)) {
            this.$completeValidation(result, errors);
            return this.$$q.resolve(result);
        }

        // Run the async validators
        const ref = ++this.$$validationRef;
        this.$$validationSate = ValidationState.Unknown;

        if (!this.$$deferredValidation)
            this.$$deferredValidation = this.$$q.defer();

        this.$processAsyncValidators(addError).then(result => {
            if (ref === this.$$validationRef)
                this.$completeValidation(result, errors);
        }, err => {
            if (ref === this.$$validationRef && this.$$deferredValidation) {
                const deferred = this.$$deferredValidation;
                this.$$deferredValidation = null;
                deferred.reject(err);
            }
        });

        return this.$$deferredValidation.promise;

        function addError(err) {
            errors.push(err);
        }
    }

    watch(fn) {
        return this.$$model.watch(this.name, fn);
    }

    on(type, fn) {
        if (typeof(fn) !== 'function')
            throw new TypeError('fn must be a valid function');

        if (!this.$$listeners.hasOwnProperty(type))
            this.$$listeners[type] = [];

        this.$$listeners[type].push(fn);

        return () => this.off(type, fn);
    }

    off(type, fn) {
        if (typeof(fn) !== 'function')
            throw new TypeError('fn must be a valid function');

        if (listeners && listeners.length > 0) {
            const idx = listeners.indexOf(fn);
            if (idx >= 0) listeners.splice(idx, 1);
        }
    }

    $emit(type) {
        if (!this.$$listeners.hasOwnProperty(type) || this.$$listeners[type].length === 0)
            return;

        const listeners = this.$$listeners[type].slice();
        const argLen = arguments.length;
        const args = argLen > 4 ? Array.prototype.slice(arguments, 1) : null;

        for(var i = 0, j = listeners.length; i < j; ++i) {
            const listener = listeners[i];

            switch(argLen) {
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

    $completeValidation(result, errors) {
        const deferred = this.$$deferredValidation;
        if (deferred) this.$$deferredValidation = null;

        this.$$validationState = result ? ValidationState.Valid : ValidationState.Invalid;
        this.$emit('validate', this, result, errors);

        if (deferred) deferred.resolve(result);
    }

    $processValidators(addError) {
        const validators = this.$$validators;
    
        if (validators) {
            for(let i = 0, j = validators.length; i < j; ++i) {
                if (!validators[i](this, addError))
                    return false;
            }
        }

        return true;
    }
    
    $processAsyncValidators(addError) {
        const promises = this.$$asyncValidators.map(v => v(this, addError));
        return this.$$q.all(promises).then(results => results.every(result => result));
    }
}

function labelise(name) {
    name = name.substring(name.lastIndexOf('.') + 1);

    var label = name.replace(/([A-Z]+)/g, ' $1')
        .replace(/\W+/g, ' ')
        .replace(/\s{2,}/g, ' ');

    return label[0].toUpperCase() + label.substring(1);
}