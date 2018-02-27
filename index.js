export * from './src/model';
export * from './src/model-field';

import { ModelBuilder } from './src/ng/model-builder';
import { ModelValidatorBuilder } from './src/ng-model-validator-builder';

import { DynamicModelDirective } from './src/ng/directives/dynamic-model';
import { FieldModelForDirective } from './src/ng/directives/field-model-for';
import { FieldConditionForDirective } from './src/ng/directives/field-condition-for';

function directive(ctor) {
    var inject = ctor.dependencies || ctor.prototype.dependencies;
    if (!inject) 
        return () => new ctor();

    var factory = function() { return new ctor(...arguments); };
    factory.$inject = inject;
    return factory;
}

const lib = angular.module('ng-dynamic-model', [])
    .service('ModelBuilder', ModelBuilder)
    .service('ModelValidatorBuilder', ModelValidatorBuilder)
    
    .directive('dynamicModel', directive(DynamicModelDirective))
    .directive('fieldModelFor', directive(FieldModelForDirective))
    .directive('fieldConditionFor', directive(FieldConditionForDirective));

export default lib.name;