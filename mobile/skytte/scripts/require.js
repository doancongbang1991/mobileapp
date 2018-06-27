/*
 * Allows for a simple Asynchronous module definition.
 */
function define(moduleName) {
    var dependencies = [], moduleCode, i, args;
    if (moduleName in define.modules && moduleName !== 'settings')
        throw new ReferenceError("module '" + moduleName + "' is already defined");

    if (arguments.length === 3)
        dependencies = arguments[1];
    moduleCode = arguments[arguments.length - 1];

    if (typeof moduleCode === 'function') {
        args = [];
        for (i = 0; i < dependencies.length; i++)
            args.push(require(dependencies[i]));
        moduleCode = moduleCode.apply(this, args);
    }

    if (typeof moduleCode === 'undefined')
        throw new TypeError("module '" + moduleName + "' doesn't export any definitions");

    if (moduleName === 'settings')
        moduleName = '_settings';

    if (moduleName === 'jquery')
        jQuery.noConflict(true);
    define.modules[moduleName] = moduleCode;
}

function require(moduleName) {
    if (moduleName in define.modules)
        return define.modules[moduleName];
    throw new ReferenceError("no module named '" + moduleName + "'");
}

require.jQueryPlugins = function() {
    var jQuery = require('jquery');
    var missing = [];

    for (var i = 0; i < arguments.length; i++)
        if (typeof jQuery.fn[arguments[i]] === 'undefined' && typeof jQuery[arguments[i]] === 'undefined')
            missing.push(arguments[i]);

    if (missing.length)
        throw new ReferenceError("no jQuery plugins named '" + missing.join("', '") + "'");
};

define.amd = {'jQuery': true};
define.modules = {
    /*
     * Custom user settings are stored under a `_settings` alias and the function below acts as a shortcut.
     */
    'settings': function(name, fallback) {
        if (typeof define.modules._settings[name] !== 'undefined')
            return define.modules._settings[name];
        return fallback;
    },
    '_settings': {}
};
