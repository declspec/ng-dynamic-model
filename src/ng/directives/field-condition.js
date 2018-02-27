import { createCondition } from './../create-condition';

export function FieldConditionDirective(parser) { 
    this.parser = parser;
}

FieldConditionDirective.prototype = {
    restrict: 'A',
    dependencies: ['$parse'],
    require: '^^dynamicModel',
    link: function(scope, $element, attrs, modelCtrl) {
        if (!attrs['fieldCondition'])
            throw new TypeError('field-condition-for: missing required attribute "field-condition"'); 

        let speed = 0;
        
        const off = createCondition(attrs['fieldCondition'], modelCtrl.model, this.parser, scope, result => {
            $element[result ? 'show' : 'hide'](speed);
        });

        // Update the speed after the first run
        speed = attrs['speed'] ? parseInt(attrs['speed'], 10) : 300;

        // When destroyed, release the condition
        this.$onDestroy = off;
    }
};