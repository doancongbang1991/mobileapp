define('skytte.utils', function() {

    function copy(other) {
        if (typeof other === 'undefined' || other === null)
            return other;
        var target = other instanceof Array ? [] : {}, property;
        for (property in other)
            if (other.hasOwnProperty(property))
                target[property] = typeof other[property] === 'object' ? copy(other[property]) : other[property];
        return target;
    }

    function _merge(target, other) {
        if (typeof target === 'undefined' || target === null)
            return typeof other === 'object' ? copy(other) : other;
        for (var property in other)
            if (other.hasOwnProperty(property)) {
                if (typeof target[property] === 'object' || typeof other[property] === 'object')
                    target[property] = _merge(target[property], other[property]);
                else
                    target[property] = other[property];
            }
        return target;
    }

    function merge() {
        var target = copy(arguments[0]), i;
        for (i = 1; i < arguments.length; i++)
            target = _merge(target, arguments[i]);
        return target;
    }

    function inArray(item, array) {
        for (var i = 0; i < array.length; i++)
            if (array[i] === item)
                return true;
        return false;
    }

    return {'copy': copy, 'merge': merge, '_merge': _merge, 'inArray': inArray};
});
