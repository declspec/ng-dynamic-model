import * as util from '../util';

function fieldValueComparer(v1, v2) {
    if (v1 !== v2)
        return false;

    let type = util.getType(v1)
    return type !== 'object' && type !== 'array';
}

export function createCondition(condition, model, parser, locals, callback) {
    if (!callback && typeof(locals) === 'function') {
        callback = locals;
        locals = null;
    }

    const dependentFields = [];

    condition = condition.replace(/\[([a-zA-Z\$_][\w.]+)\]/g, (m, fieldName) => {
        if (dependentFields.indexOf(fieldName) < 0)
            dependentFields.push(fieldName);
        return fieldName;
    });

    if (dependentFields.length === 0)
        console.warn('warning: createCondition: conditional expression does not contain any field references and will only be evaluated once');

    const expr = parser(condition);
    let lastResult;

    evaluateCondition();
    const unwatchers = dependentFields.map(name => model.watch(name, evaluateCondition, fieldValueComparer));

    return () => unwatchers.forEach(unwatch => unwatch());

    function evaluateCondition() {
        const context = Object.assign({ '$util' : util }, locals);
        const result = !!expr(context, model.getState());

        if (result !== lastResult) {
            lastResult = result;
            callback(lastResult);
        }
    }
}