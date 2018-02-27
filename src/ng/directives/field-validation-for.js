const InvalidClass = 'ng-invalid';
const ValidClass = 'ng-pristine';

export function FieldValidationForDirective(validatorFactory) { 
    this.validatorFactory = validatorFactory;
}

FieldValidationForDirective.prototype = {
    restrict: 'A',
    require: '^^dynamicModel',
    dependencies: [ 'ValidatorFactory' ],
    link: function(scope, $element, attrs, modelCtrl) {
        if (!attrs['fieldValidationFor'])
            throw new TypeError('field-validation-for: missing required attribute "field-validation-for"');

        const invalidClass = attrs['invalidClass'] || InvalidClass;
        const validClass = attrs['validClass'] || ValidClass;

        const fields = attrs['fieldValidationFor'].split(',').map(name => {
            return modelCtrl.model.field(name.trim());
        });

        const unbinders = fields.reduce((acc, f) => {
            acc.push(f.on('change', onUpdated));
            acc.push(f.on('validate', onUpdated));
            return acc;
        }, []);

        this.$onDestroy = () => unbinders.forEach(fn => fn());

        if (attrs.hasOwnProperty('validators')) {
            const unwatch = scope.$watch(attrs['validators'], newValue => {
                if (typeof(newValue) !== 'undefined') {
                    unwatch();
                    this.$initialise(fields, newValue)
                }
            });
        }

        onUpdated();

        function onUpdated() {
            const validated = fields.every(f => f.isValidated());
            const valid = fields.every(f => f.isValid());

            $element[validated && valid ? 'addClass' : 'removeClass'](validClass);
            $element[validated && !valid ? 'removeClass' : 'addClass'](invalidClass);
        }
    },

    $initialise(fields, validatorMetadata) {
        const validators = Array.isArray(validatorMetadata)
            ? validatorMetadata.map(meta => createValidator(meta, this.validatorFactory))
            : [ createValidator(validatorMetadata), this.validatorFactory ];

        // Add the validators to all fields
        fields.forEach(field => {
            validators.forEach(validator => {
                if (validator.async)
                    field.addAsyncValidator(validator);
                else
                    field.addValidator(validator);
            });
        });
    }
}   

function createValidator(metadata, factory) {
    let args, validator;

    if (typeof(metadata) === 'string')
        validator = factory.get(metadata);
    else if (obj && typeof(obj) === 'object' && obj.hasOwnProperty('name')) {
        validator = factory.get(metadata.name);
        args = obj;
    }

    if (!validator)
        throw new Error(`field-validation-for: unknown validator encountered (${JSON.stringify(obj)})`);
    
    const fn = (field, addError) => validator.fn.call(validator, field, addError, args);
    fn.async = validator.async;

    return fn;
}