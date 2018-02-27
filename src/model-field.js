export class ModelField {
    constructor(model, name, value, q) {
        this.name = name;
        this.label = labelise(name);

        this.$$model = model;
        this.$$value = value;
        this.$$active = true;
        this.$$listeners = {};

        // Set up an internal watch to propagate external value changes
        this.watch((newValue, oldValue, path) => {
            if (newValue !== this.$$value) 
                this.$$value = newValue;

            this.$emit('change', this, newValue, oldValue);
        });
    }

    isDirty() {
        return this.$$dirty;
    }

    isActive() {
        return this.$$active;
    }

    value() {
        return this.$$value;
    }

    setValue(value) {
        // This will flow through to the internal watcher.
        this.$$model.set(this.name, value);
    }

    setValidated(validated) {
        this.$$validated = !!validated;
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
}

function labelise(name) {
    name = name.substring(name.lastIndexOf('.') + 1);

    var label = name.replace(/([A-Z]+)/g, ' $1')
        .replace(/\W+/g, ' ')
        .replace(/\s{2,}/g, ' ');

    return label[0].toUpperCase() + label.substring(1);
}