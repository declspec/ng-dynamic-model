export function ReadonlyFieldForDirective(parse) { 
    this.parse = parse;
}

ReadonlyFieldForDirective.prototype = {
    restrict: 'A',
    require: '^^dynamicModel',
    dependencies: [ '$parse' ],
    link: function(scope, $element, attrs, modelCtrl) {
        const model = modelCtrl.model;
        const fields = modelCtrl.fieldsFor(scope, attrs['readonlyFieldFor'], 'readonly-field-for');
        const expr = attrs['expr'] ? this.parse(attrs['expr']) : null;

        if (fields.length > 1 && !expr)
            throw new TypeError('readonly-field-for: invalid value found for attribute "readonly-field-for"; expected a string when "expr" is not provided');

        const unbinders = fields.map(f => f.on('change', onUpdated));
        onUpdated(fields[0]);

        scope.$on('$destroy', () => unbinders.forEach(fn => fn()));

        function onUpdated(f) {
            const val = expr ? expr(scope, model.getState()) : f.value();
            $element.html(val);
        }
    }
};