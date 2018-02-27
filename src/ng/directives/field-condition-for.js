import { createCondition } from './../create-condition';

export function FieldConditionForDirective(parser) { 
    this.parser = parser;
}

FieldConditionForDirective.prototype = {
    restrict: 'A',
    dependencies: ['$parse'],
    require: '^^dynamicModel',
    link: function(scope, $element, attrs, modelCtrl) {
        if (!attrs['fieldConditionFor'] || !attrs['condition'])
            throw new TypeError('field-condition-for: missing required attribute "' + (attrs['condition'] ? 'field-condition-for' : 'condition') + '"'); 

        const field = modelCtrl.model.field(attrs['fieldConditionFor']);
        let speed = 0;
        
        const off = createCondition(attrs['condition'], modelCtrl.model, this.parser, scope, result => {
            field.setActive(result);
            $element[result ? 'show' : 'hide'](speed);
        });

        // Update the speed after the first run
        speed = attrs['speed'] ? parseInt(attrs['speed'], 10) : 300;

        // When destroyed, release the condition
        this.$onDestroy = off;
    }
};