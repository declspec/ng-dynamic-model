import { set } from 'object-path';

export function ReadonlyFieldForDirective(parse) { 
    this.parse = parse;
}

ReadonlyFieldForDirective.prototype = {
    restrict: 'A',
    require: '^^dynamicModel',
    dependencies: [ '$parse' ],
    link: function(scope, $element, attrs, modelCtrl) {
        if (!attrs['readonlyFieldFor'])
            throw new TypeError('readonly-field-for: missing required attribute "readonly-field-for"');

        const model = modelCtrl.model;
        const field = model.field(attrs['readonlyFieldFor']);
        
        let locals, expr;

        if (attrs['expr']) {
            expr = this.parse(attrs['expr']);
            locals = {};
        }

        field.on('change', onUpdated)
        onUpdated(field);

        function onUpdated(f) {
            const val = expr ? expr(scope, model.getState()) : f.value();
            $element.html(val);
        }
    }
};