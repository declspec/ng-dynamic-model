export function FieldValidationMessageForDirective(validatorFactory) { 
    this.validatorFactory = validatorFactory;
}

FieldValidationMessageForDirective.prototype = {
    restrict: 'A',
    require: '^^dynamicModel',
    link: function(scope, $element, attrs, modelCtrl) {
        const field = modelCtrl.fieldFor(scope, attrs['fieldValidationMessageFor'], 'fieldValidationMessageFor');

        const unbinders = [ 
            field.on('change', () => update(true)), 
            field.on('validate', (f, valid, errors) => update(valid, errors[0])) 
        ];

        scope.$on('$destroy', () => unbinders.forEach(fn => fn()));
        update(true);
    
        function update(valid, error) {
            $element.text(valid ? '' : error);
            $element[!valid && error ? 'show' : 'hide']();
        }
    }
}   