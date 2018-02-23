export function DynamicModelDirective() {}

DynamicModelDirective.prototype = {
    restrict: 'A',
    scope: { model: '=dynamicModel' },
    controller: ['$scope', function(scope) {
        if (!scope.model)
            throw new TypeError('dynamic-model: invalid model specified');
        this.model = scope.model;
    }]
};
