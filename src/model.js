import * as objectPath from 'object-path';
import { ModelField } from './model-field';

export class Model {
    constructor(initialState) {
        this.$$state = initialState || {};

        if (typeof(this.$$state) !== 'object')
            throw new TypeError('initialState must be a valid object');

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
        objectPath.set(this.$$state, path, value);
        const subscribers = this.$$subscribers.slice();

        for(var i = 0, j = subscribers.length; i < j; ++i) {
            subscribers[i](this.$$state);
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
        return this.$$fields[path] = new ModelField(this, path, startValue);
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
}

function defaultComparer(o1, o2) {
    return o1 === o2;
}