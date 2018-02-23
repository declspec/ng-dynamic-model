export function FieldModelForDirective() {}

FieldModelForDirective.prototype = { 
    restrict: 'A',
    require: ['^^dynamicModel', 'ngModel'],
    link: function(scope, $element, attrs, ctrls) {
        if (!attrs['fieldModelFor'])
            throw new TypeError('form-model-for: missing required attribute "field-model-for"');
        
        const field = ctrls[0].model.field(attrs['fieldModelFor']);
        const modelController = ctrls[1];

        // Override model controller methods     
        const commitViewValue = modelController.$commitViewValue;
        const render = modelController.$render;

        // Set up change handlers and update the UI
        field.on('change', onUpdate);
        onUpdate();

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

        function onUpdate() {
            const uiValue = modelController.$modelValue || modelController.$viewValue;
            const modelValue = field.value();

            if (uiValue !== modelValue) {
                modelController.$viewValue = modelValue;
                // Make sure to call the original functions to avoid infinitely recursing.
                commitViewValue.call(modelController);
                render.call(modelController);
            }
        }
    }
};
