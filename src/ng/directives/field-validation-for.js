const InvalidClass = 'ng-invalid';
const ValidClass = 'ng-pristine';

export function FieldValidationForDirective(validatorFactory) { 
    this.validatorFactory = validatorFactory;
}

FieldValidationForDirective.prototype = {
    restrict: 'A',
    require: '^^dynamicForm',
    link: function(scope, $element, attrs, formCtrl) {
        if (!attrs['fieldValidationFor'])
            throw new TypeError('field-validation-for: missing required attribute "field-validation-for"');

        
    }
}