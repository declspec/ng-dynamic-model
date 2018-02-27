function defaultCompare(o1, o2) {
    return o1 == o2;
}

export function getType(obj) {
    var type = typeof(obj);
    switch(type) {
    case 'object':
        if (obj === null) return 'null'
        if (Array.isArray(obj)) return 'array';
        if (obj instanceof RegExp) return 'regexp';
        if (obj instanceof Date) return 'date';
    default:
        return type;
    }
}

export function empty(obj) {
    if (obj === null || typeof(obj) === 'undefined')
        return true;
    
    var type = getType(obj);
    switch(type) {
    case 'array':
    case 'string':
        return obj.length === 0;
    case 'date':
        return obj.getTime() === 0;
    case 'object':
        for(var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    default:
        // The empty case for other types is handled at the top of the fn (!obj)
        return false;
    }
}

export function contains(target, value) {
    switch(getType(target)) {
    case 'string':
        return target.indexOf(value) >= 0;
    case 'object':
        return target.hasOwnProperty(value);
    case 'array':
        return target.some(function(v) {
            return equals(v, value);
        });
    default:
        // No 'contains' method makes sense, return false.
        return false;
    }
}

export function matches(target, to) {
    switch(getType(to)) {
    case 'null':
    case 'undefined':
        return target === to;
    case 'regexp':
        return to.test(target);
    case 'array':
        if (!Array.isArray(target) || target.length < to.length || to.length === 0 && target.length !== 0)
            return false;

        for(var i = 0, j = to.length; i < j; ++i) {
            for(var ii = 0, jj = target.length; ii < jj; ++ii) {
                if (matches(target[ii], to[i]))
                    break;
                else if (ii == (jj-1))
                    return false;
            }
        }

        return true;
    case 'object':
        var keys = Object.keys(to),
            k = keys.length,
            key;

        while(--k >= 0) {
            key = keys[k];
            if (!target.hasOwnProperty(key) || !matches(target[key], to[key]))
                return false;
        }

        return true;
    case 'string':
    case 'number':
    case 'boolean':
    default:
        // todo: look at a way to implement configurable strict/loose checking.
        // loose checking is useful because a lot of the UI layer always gives back strings,
        // but there are probably times when strict checking will be required.
        return target == to;
    }
}

export function equals(target, to, compare) {
    switch(getType(to)) {
    case 'null':
    case 'undefined':
        return target === to;
    case 'array':
        if (!Array.isArray(target) || target.length !== to.length)
            return false;

        for(var i = to.length-1; i >= 0; --i) {
            if (!equals(target[i], to[i]))
                return false;
        }

        return true;
    case 'object':
        var k1 = Object.keys(target),
            k2 = Object.keys(to);

        if (k1.length !== k2.length)
            return false;

        var k = k2.length,
            key;

        while(--k >= 0) {
            key = k2[k];
            if (!target.hasOwnProperty(key) || !equals(target[key], to[key]))
                return false;
        }

        return true;
    case 'string':
    case 'number':
    case 'boolean':
    default:
        // todo: look at a way to implement configurable strict/loose checking.
        // loose checking is useful because a lot of the UI layer always gives back strings,
        // but there are probably times when strict checking will be required.
        return (compare || defaultCompare)(target, to);
    }
}

export function any(targets, to, comparator) {
    if (!Array.isArray(targets) || targets.length === 0)
        return false;

    for(var i = targets.length-1; i >= 0; --i) {
        if (comparator(targets[i], to))
            return true;
    }
    
    return false;
}

export function all(targets, to, comparator) {
    if (!Array.isArray(targets) || targets.length === 0)
        return false;
    
    for(var i = targets.length-1; i >= 0; --i) {
        if (!comparator(targets[i], to))
            return false;
    }

    return true;
}