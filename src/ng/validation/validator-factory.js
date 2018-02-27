export function ValidatorFactoryProvider() {
    const validators = {};

    this.register = register;

    this.$get = () => ({
        get: name => validators[name],
        register: register
    });

    function register(name, isAsync, fn) {
        if (validators.hasOwnProperty(name))
            console.warn('validator-factory: overwriting previously registered validator "' + name + '"');

        if (typeof(isAsync) === 'function') {
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