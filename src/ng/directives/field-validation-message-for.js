const InvalidClass = 'ng-invalid';
const ValidClass = 'ng-pristine';

export function FieldValidationMessageForDirective(validatorFactory) { 
    this.validatorFactory = validatorFactory;
}

FieldValidationMessageForDirective.prototype = {
    restrict: 'A',
    require: '^^dynamicModel',
    link: function(scope, $element, attrs, modelCtrl) {
        if (!attrs['fieldValidationMessageFor'])
            throw new TypeError('field-validation-message-for: missing required attribute "field-validation-message-for"');

        const field = modelCtrl.model.field(attrs['fieldValidationMessageFor']);

        const unbinders = [ 
            field.on('change', () => update(true)), 
            field.on('validate', (f, valid, errors) => update(valid, errors[0])) 
        ];

        this.$onDestroy = () => unbinders.forEach(fn => fn());
    
        function update(valid, error) {
            $element.text(valid ? '' : error);
            $element[!valid && error ? 'show' : 'hide']();
        }
    }
}   