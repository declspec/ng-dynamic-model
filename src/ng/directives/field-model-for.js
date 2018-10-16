export function FieldModelForDirective() {}

FieldModelForDirective.prototype = { 
    restrict: 'A',
    require: ['^^dynamicModel', 'ngModel'],
    link: function(scope, $element, attrs, ctrls) {
        const field = ctrls[0].fieldFor(scope, attrs['fieldModelFor'], 'field-model-for');
        const modelController = ctrls[1];

        // Override model controller methods     
        const commitViewValue = modelController.$commitViewValue;
        const render = modelController.$render;

        // Set up change handlers and update the UI
        scope.$on('$destroy', field.watch(onUpdate));
        onUpdate(field.value());

        modelController.$render = function() {
            const value = this.$modelValue || this.$viewValue;
            if (value || modelController.$dirty)
                field.setValue(value);
            return render.call(this);
        };

        modelController.$commitViewValue = function() {
            const result = commitViewValue.call(this);
            field.setValue(this.$modelValue || this.$viewValue);
            return result;
        };

        function onUpdate(fieldValue) {
            const uiValue = modelController.$modelValue || modelController.$viewValue;

            if (uiValue !== fieldValue) {
                modelController.$viewValue = fieldValue;
                // Make sure to call the original functions to avoid infinitely recursing.
                commitViewValue.call(modelController);
                render.call(modelController);
            }
        }
    }
};
