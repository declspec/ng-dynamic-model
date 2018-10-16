import { createCondition } from './../create-condition';

export function FieldConditionForDirective(parser) { 
    this.parser = parser;
}

FieldConditionForDirective.prototype = {
    restrict: 'A',
    dependencies: ['$parse'],
    require: '^^dynamicModel',
    link: function(scope, $element, attrs, modelCtrl) {
        if (!attrs['condition'])
            throw new TypeError('field-condition-for: missing required attribute "condition"'); 

        const fields = modelCtrl.fieldsFor(scope, attrs['fieldConditionFor'], 'field-condition-for');
        let speed = 0;
        
        const off = createCondition(attrs['condition'], modelCtrl.model, this.parser, scope, result => {
            fields.forEach(f => f.setActive(result));
            $element[result ? 'show' : 'hide'](speed);
        });

        // Update the speed after the first run
        speed = attrs['speed'] ? parseInt(attrs['speed'], 10) : 300;

        // When destroyed, release the condition
        scope.$on('$destroy', off);
    }
};