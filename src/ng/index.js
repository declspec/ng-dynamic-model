import { ValidationConfig } from './validation/config';

import { ModelBuilder } from './model-builder';
import { ValidatorFactoryProvider } from './validation/validator-factory';

import { DynamicModelDirective } from './directives/dynamic-model';
import { FieldModelForDirective } from './directives/field-model-for';
import { FieldMultiModelForDirective } from './directives/field-multi-model-for';
import { FieldConditionForDirective } from './directives/field-condition-for';
import { FieldConditionDirective } from './directives/field-condition';
import { ReadonlyFieldForDirective } from './directives/readonly-field-for';
import { FieldRepeatForDirective } from './directives/field-repeat-for';
import { FieldValidationForDirective } from './directives/field-validation-for';
import { FieldValidationMessageForDirective } from './directives/field-validation-message-for';

function directive(ctor) {
    var inject = ctor.dependencies || ctor.prototype.dependencies;
    if (!inject) 
        return () => new ctor();

    var factory = function() { return new ctor(...arguments); };
    factory.$inject = inject;
    return factory;
}

const lib = angular.module('ng-dynamic-model', [])
    .config(ValidationConfig)

    .provider('ValidatorFactory', ValidatorFactoryProvider)

    .service('ModelBuilder', ModelBuilder)

    .directive('dynamicModel', directive(DynamicModelDirective))
    .directive('fieldModelFor', directive(FieldModelForDirective))
    .directive('fieldMultiModelFor', directive(FieldMultiModelForDirective))
    .directive('fieldConditionFor', directive(FieldConditionForDirective))
    .directive('fieldCondition', directive(FieldConditionDirective))
    .directive('fieldValidationFor', directive(FieldValidationForDirective))
    .directive('fieldValidationMessageFor', directive(FieldValidationMessageForDirective))
    .directive('readonlyFieldFor', directive(ReadonlyFieldForDirective))
    .directive('fieldRepeatFor', FieldRepeatForDirective);

export default lib.name;