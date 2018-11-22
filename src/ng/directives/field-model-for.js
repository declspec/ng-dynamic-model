export function FieldModelForDirective() {}

FieldModelForDirective.prototype = { 
    restrict: 'A',
    require: ['^^dynamicModel', 'ngModel'],
    link: function(scope, $element, attrs, ctrls) {
        if (!attrs['fieldModelFor'])
            throw new TypeError('field-model-for: missing required attribute "field-model-for"');
        
        const field = ctrls[0].model.field(attrs['fieldModelFor']);
        const modelController = ctrls[1];

        // Orginal ngModel method references
        //  $commitViewValue commits the $viewValue and runs it through
        //      the $parsers to obtain the new $modelValue
        //  $$setModelValue is called whenever the model's value
        //      is programmatically changed
        const commitViewValue = modelController.$commitViewValue;
        const setModelValue = modelController.$$setModelValue;

        if (typeof(setModelValue) === 'undefined')
            throw new TypeError('field-model-for: an internal ngModel function has changed, please complain loudly to the author.');

        // Set up event handling within the field
        scope.$on('$destroy', field.watch(onFieldUpdated));
        onFieldUpdated(field.value());

        // Monkey patch the ngModel methods to hook into the lifecycle
        modelController.$commitViewValue = patch(commitViewValue);
        modelController.$$setModelValue = patch(setModelValue);

        function onFieldUpdated(newFieldValue) {
            // Call original setModelValue (avoid the patched version)
            return setModelValue.call(modelController, newFieldValue);
        }

        function patch(original) {
            return function() {
                const result = original.apply(this, arguments);
                field.setValue(this.$modelValue);
                return result;
            };
        }
    }
};
