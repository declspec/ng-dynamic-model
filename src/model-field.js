export class ModelField {
    constructor(model, name, value, q) {
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
        this.watch((newValue, oldValue, path) => {
            if (newValue !== this.$$value) {
                this.$$value = newValue;
                this.setDirty(true);
            }

            this.$emit('change', this, newValue, oldValue);
        });
    }

    isValid() {
        return this.isValidated() && this.$$valid;
    }

    isValidated() {
        return this.$$validated;
    }

    isDirty() {
        return this.$$dirty;
    }

    isActive() {
        return this.$$active;
    }

    val() {
        return this.$$value;
    }

    getErrors() {
        return this.$$errors;
    }

    hasValidation() {
        return (this.$$validators && this.$$validators.length)
            || (this.$$asyncValidators && this.$$asyncValidators.length);
    }

    setValue(value) {
        // clear out the last active value as it will no longer be relevant.
        if (this.$$lastActiveValue)
            this.$$lastActiveValue = undefined;

        // This will flow through to the internal watcher.
        this.$$model.set(this.name, value);
    }

    setDirty(dirty) {
        this.$$dirty = !!dirty;
        this.$$errors = undefined;
        this.setValidated(false);
    }

    setValidated(validated) {
        this.$$validated = !!validated;
    }

    setActive(active) {
        this.$$active = !!active;

        if (this.$$active && this.$$lastActiveValue)
            this.setValue(this.$$lastActiveValue);
        else if (!this.$$active) {
            // Cache the current value for when/if the field is re-activated.
            const last = this.value();
            this.setValue(undefined);
            this.$$lastActiveValue = last;
        }

        this.$emit('toggle', this, this.$$active);
    }

    addValidator(validator) {
        if (!this.$$validators)
            this.$$validators = [];
        this.$$validators.push(validator);
        return this;
    }

    addAsyncValidator(validator) {
        if (!this.$$asyncValidators)
            this.$$asyncValidators = [];
        this.$$asyncValidators.push(validator);
        return this;
    }

    validate() {
        const hasAsyncValidators = this.$$asyncValidators && this.$$asyncValidators.length;
        const hasValidators = this.$$validators && this.$$validators.length;

        const errors = [];
        const result = !hasValidators || this.$processValidators(appendError);

        if (!result || !hasAsyncValidators) {
            // Can return early
            this.$completeValidation(result, errors);
            return this.$$q.resolve(result);
        }

        // Run the async validators
        const ref = ++this.$$validationId;

        if (!this.$$deferredValidation)
            this.$$deferredValidation = this.$$q.defer();

        this.$processAsyncValidators(appendError).then(result => {
            if (ref === this.$$validationId)
                this.$completeValidation(result, errors);
        }, err => {
            if (ref === this.$$validationId) {
                const deferred = this.$$deferredValidation;
                this.$$deferredValidation = null;
                if (deferred) deferred.reject(err);
            }
        });

        return this.$$deferredValidation.promise;

        function appendError(err) {
            if (typeof(err) === 'string')
                err = err.replace('%field%', this.label);
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
            this.$$listeners[type] = [ fn ];
        else
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

    $processValidators(appendError) {
        const validators = this.$$validators;

        for(let i = 0, j = validators.length; i < j; ++i) {
            if (!validators[i](this, appendError))
                return false;
        }

        return true;
    }

    $processAsyncValidators(appendError) {
        const validators = this.$$asyncValidators;

        if (validators && validators.length) {
            const promises = validators.map(v => v(this, appendError));
            return this.$$q.all(promises).then(results => results.every(result => result));
        }
    }

    $completeValidation(valid, errors) {
        const previous = this.$$valid;
        const deferred = this.$$deferredValidation;

        this.$$valid = valid;
        this.$$errors = errors;
        this.$$deferredValidation = null;
        this.setValidated(true);

        // Emit the event and then resolve the promise.
        // This could be a bit racy.
        this.$emit('validate', this, previous);  
        if (deferred) deferred.resolve(valid); 
    }
}

function labelise(name) {
    name = name.substring(name.lastIndexOf('.') + 1);

    var label = name.replace(/([A-Z]+)/g, ' $1')
        .replace(/\W+/g, ' ')
        .replace(/\s{2,}/g, ' ');

    return label[0].toUpperCase() + label.substring(1);
}