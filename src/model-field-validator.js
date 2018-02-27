const ValidationState = {
    Valid: 0,
    Invalid: 1,
    Unknown: 2
};

export class ModelFieldValidator {
    constructor(q, path) {
        this.path = path;
        this.$$validators = [];
        this.$$asyncValidators = [];
        this.$$state = ValidationState.Unknown;
        this.$$ref = 0;
        this.$$q = q;
    }

    isValidated() {
        return this.$$state !== ValidationState.Unknown;
    }

    isValid() {
        return this.$$state === ValidationState.Valid;
    }

    invalidate() {
        this.$$state = ValidationState.Unknown;
    }

    validate(newValue) {
        const errors = [];
        const result = this.$processValidators(newValue, addError);

        // Can we exit early?
        if (!result || !this.$$asyncValidators.length) {
            this.$completeValidation(result, errors);
            return this.$$q.resolve({ valid: result, errors: errors });
        }

        // Run the async validators
        const ref = ++this.$$ref;
        this.$$state = ValidationState.Unknown;

        if (!this.$$deferred)
            this.$$deferred = this.$$q.defer();

        this.$processAsyncValidators(newValue, addError).then(result => {
            if (ref === this.$$ref)
                this.$completeValidation(result, errors);
        }, err => {
            if (ref === this.$$ref && this.$$deferred) {
                const deferred = this.$$deferred;
                this.$$deferred = null;
                deferred.reject(err);
            }
        });

        return this.$$deferred.promise;

        function addError(err) {
            errors.push(err);
        }
    }

    $completeValidation(result, errors) {
        const deferred = this.$$deferred;
        if (deferred) this.$$deferred = null;

        this.$$state = result ? ValidationState.Valid : ValidationState.Invalid;
        this.$$parent.$set(this.path, result, errors);

        if (deferred) deferred.resolve({ valid: result, errors: errors });
    }

    addValidator(validator) {
        if (typeof(validator) !== 'function')
            throw new TypeError('validator must be a valid function');

        this.$$validators.push(validator);
        return this;
    }
    
    addAsyncValidator(validator) {
        if (typeof(validator) !== 'function')
            throw new TypeError('validator must be a valid function');
            
        this.$$asyncValidators.push(validator);
        return this;
    }
    
    $processValidators(newValue, addError) {
        const validators = this.$$validators;
    
        for(let i = 0, j = validators.length; i < j; ++i) {
            if (!validators[i](this.path, newValue, addError))
                return false;
        }
    
        return true;
    }
    
    $processAsyncValidators(newValue, addError) {
        const promises = this.$$asyncValidators.map(v => v(this.path, newValue, addError));
        return this.$$q.all(promises).then(results => results.every(result => result));
    }
}    

