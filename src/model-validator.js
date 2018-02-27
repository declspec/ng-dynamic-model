
import { ModelFieldValidator } from './model-field-validator';

const ValidationTrigger = {
    Change: 0,
    Manual: 1
};

export class ModelValidator {
    constructor(q, model, trigger) {
        this.$$q = q;
        this.$$model = model;
        this.$$trigger = trigger || ValidationTrigger.Change;
        this.$$listeners = {};
        this.$$validators = {};
    }

    watch(path, fn) {
        if (typeof(fn) !== 'function')
            throw new TypeError('fn must be a valid function');

        if (!this.$$listeners.hasOwnProperty(path))
            this.$$listeners[path] = [];

        this.$$listeners[path].push(fn);
    }

    validate() {
        const promises = Object.keys(this.$$validators).map(path => {
            const validator = this.$$validators[path];
            const field = this.$$model.field(path);

            if (!field.isActive())
                return true;
            else if (validator.isValidated())
                return validator.isValid();
      
            return validator.validate(field.value())
                .then(res => res.valid);        
        });

        return this.$$q.all(promises).then(results => results.every(res => res));
    }

    validator(path) {
        if (this.$$validators.hasOwnProperty(path))
            return this.$$validators[path];

        const validator = new ModelFieldValidator(this.$$q, path);

        if (this.$$trigger === ValidationTrigger.Change)
            this.$$model.watch(path, newValue => validator.validate(newValue));

        return this.$$validators[path] = validator;
    }

    $set(path, result, errors) {
        const listeners = this.$$listeners[path];

        if (listeners && listeners.length) {
            for(var i = 0, j = listeners.length; i < j; ++i) 
                listeners[i](result, errors, path);
        }
    }
}
