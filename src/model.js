import * as objectPath from 'object-path';
import { ModelField } from './model-field';

const ValidationTrigger = {
    Manual: 0,
    Change: 1
};

export { ValidationTrigger };

export class Model {
    constructor(q, initialState) {
        this.$$state = initialState || {};

        if (typeof(this.$$state) !== 'object')
            throw new TypeError('initialState must be a valid object');

        this.$$q = q;
        this.$$subscribers = [];
        this.$$fields = {};
    }

    getState() {
        return this.$$state;
    }

    subscribe(fn) {
        if (typeof(fn) !== 'function')
            throw new TypeError('fn must be a valid function');

        this.$$subscribers.push(fn);
        return () => this.unsubscribe(fn);
    }

    unsubscribe(fn) {
        const idx = this.$$subscribers.indexOf(fn);
        if (idx >= 0) this.$$subscribers.splice(idx, 1);
    }

    watch(path, fn, comparer) {
        comparer = comparer || defaultComparer;
        let currentValue = objectPath.get(this.$$state, path);

        return this.subscribe(state => {
            const newValue = objectPath.get(state, path);

            if (!comparer(currentValue, newValue)) {
                const oldValue = currentValue;
                currentValue = newValue;

                fn(newValue, oldValue, path);
            }
        });
    }

    set(path, value) {
        if (typeof(path) !== 'string') {
            value = path;
            path = null;
        }

        if (path !== null)
            objectPath.set(this.$$state, path, value);
        else {
            // Update the entire state when no path is specified.
            this.$$state = value;
        }
    
        // Invoke all the subscribers
        const subscribers = this.$$subscribers.slice();

        for(var i = 0, j = subscribers.length; i < j; ++i) {
            subscribers[i](this.$$state, path);
        }

        return this;
    }

    get(path, defaultValue) {
        return objectPath.get(this.$$state, path, defaultValue);
    }

    field(path) {
        if (this.$$fields.hasOwnProperty(path))
            return this.$$fields[path];

        const startValue = this.get(path);
        const field = new ModelField(this.$$q, this, path, startValue);

        // Use `watch` over `on('change')` to avoid emitting events
        // inside other events (causing event ordering issues).
        if (this.$$validationTrigger === ValidationTrigger.Change)
            field.watch(() => field.hasValidation() && field.validate());

        return (this.$$fields[path] = field);
    }

    validate() {
        const promises = Object.keys(this.$$fields).map(path => {
            const field = this.$$fields[path];
            return field.hasValidation() && field.isActive()
                ? (field.isValidated() ? field.isValid() : field.validate())
                : true;
        });

        return this.$$q.all(promises).then(results => results.every(r => r));
    }

    setValidationTrigger(trigger) {
        this.$$validationTrigger = trigger;
    }

    setPristine() {
        for(var path in this.$$fields) {
            if (this.$$fields.hasOwnProperty(path)) {
                const field = this.$$fields[path];
                field.setDirty(false);
            }
        }
    }

    hasDirtyFields() {
        for(var path in this.$$fields) {
            if (!this.$$fields.hasOwnProperty(path))
                continue;

            const field = this.$$fields[path];
            if (field.isDirty() && field.isActive())
                return true;
        }   

        return false;
    }

    $findChildFields(path) {
        const value = this.get(path, null);
        const fields = [];

        if (value && typeof(value) === 'object') {
            Object.keys(value).forEach(childProp => {
                const lookup = path + '.' + childProp;
                if (this.$$fields.hasOwnProperty(lookup))
                    fields.push(this.$$fields[lookup]);
            });
        }

        return fields;
    }

    $findParentField(path) {
        let parentPath = path,
            dot = -1;

        while((dot = parentPath.lastIndexOf('.')) >= 0) {
            parentPath = parentPath.substring(0, dot);
            if (this.$$fields.hasOwnProperty(parentPath))
                return this.$$fields[parentPath];
        }

        return null;
    }
}

function defaultComparer(o1, o2) {
    return o1 === o2;
}