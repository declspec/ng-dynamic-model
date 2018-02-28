export function FieldMultiModelForDirective(parse) {
    this.parse = parse;
}

FieldMultiModelForDirective.prototype = {
    restrict: 'A',
    require: '^^dynamicModel',
    dependencies: [ '$parse' ],
    link: function(scope, $element, attrs, modelCtrl) {
        if (!attrs['fieldMultiModelFor'] || (!attrs['value'] && !attrs['ngValue']))
            throw new TypeError('form-multi-model: missing required attribute "' + (!attrs['fieldMultiModelFor'] ? 'field-multi-model' : 'value') + '"');

        const field = modelCtrl.model.field(attrs['fieldMultiModelFor']);
        const element = $element.get(0);
        const allowMultiple = attrs['type'] === 'checkbox';
        const trackBy = attrs['trackBy'];

        const value = attrs['ngValue']
            ? this.parse(attrs['ngValue'])(scope, modelCtrl.model.getState())
            : attrs['value'];

        $element.on('change', function() {
            if (allowMultiple || this.checked)
                scope.$apply(processChange);
        }); 

        const unbindChange = field.on('change', onUpdate);
        const unbindToggle = field.on('toggle', onUpdate);
        
        // Remove all listeners once the directive is destroyed.
        this.$onDestroy = () => {
            unbindChange();
            unbindToggle();
        };

        onUpdate(field);

        function processChange() {
            if (!allowMultiple)
                return field.setValue(value);
            
            let model = field.value(),
                idx = -1;

            if (!Array.isArray(model))
                model = model ? [ model ] : [];

            for(var i = 0, j = model.length; i < j; ++i) {
                if (compareValues(model[i])) {
                    idx = i;
                    break;
                }
            }

            if (element.checked && idx < 0) {
                model.push(value);
                field.setValue(model);
            }
            else if (!element.checked && idx >= 0) {
                model.splice(idx, 1);
                field.setValue(model);
            }
        }

        function onUpdate(field) {
            const modelValue = field.value();
            const shouldBeChecked = (!Array.isArray(modelValue) && compareValues(modelValue)) 
                || (Array.isArray(modelValue) && modelValue.some(compareValues));

            if (element.checked !== shouldBeChecked)
                element.checked = shouldBeChecked;
        }

        function compareValues(modelValue) {
            if (!trackBy)
                return modelValue == value;

            return modelValue && value
                && typeof(modelValue) === typeof(value)
                && modelValue.hasOwnProperty(trackBy) && value.hasOwnProperty(trackBy)
                && modelValue[trackBy] == value[trackBy];
        }
    }
};
