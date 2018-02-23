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
    const unwatchers = dependentFields.map(name => model.watch(name, evaluateCondition));

    return () => unwatchers.forEach(unwatch => unwatch());

    function evaluateCondition() {
        const result = !!expr(locals, model.getState());

        if (result !== lastResult) {
            lastResult = result;
            callback(lastResult);
        }
    }
}