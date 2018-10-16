const ExpressionPattern = /^\s*((?:[a-z_$][a-z0-9_$]*)(?:\.[a-z_$][a-z0-9_$]*)*)\s*$/i

export function DynamicModelDirective() {}

class DynamicModelController {
    constructor(scope) {
        if (!scope.model)
            throw new TypeError(`dynamic-model: invalid value found for attribute "dynamic-model"; expected a Model, got ${typeof(scope.model)}`);
        this.model = scope.model
    }

    fieldFor(scope, expr, context) {
        return getField(this.model, scope.$eval(expr), context);
    }

    fieldsFor(scope, expr, context) {
        const fieldNames = scope.$eval(expr);

        if (typeof(fieldNames) !== 'string' && !Array.isArray(fieldNames))
            throw new TypeError(err(context, 'string or array', fieldNames));

        return typeof(fieldNames) === 'string'
            ? [ getField(this.model, fieldNames, context) ]
            : fieldNames.map(name => getField(this.model, name, context));
    }
}

DynamicModelDirective.prototype = {
    restrict: 'A',
    scope: { model: '=dynamicModel' },
    controller: [ '$scope', DynamicModelController ]
};

function err(ctx, types, actual) {
    return `${ctx || 'dynamic-model'}: invalid field identifier value encountered; expected ${types}, got ${typeof(actual)}`; 
}

function getField(model, name, context) {
    if (typeof(name) !== 'string')
        throw new TypeError(err(context, 'string', name));
    
    const match = name.match(ExpressionPattern);
    if (!match)
        throw new TypeError(`${context || 'dynamic-model'}: invalid field identifier encountered: ${name}`);
    return model.field(match[1]);
}