// Working on organizing and clearning up all this code. 
class Log {
    type
    filepath;
    line;
    col;
    isStrict;
    namespace;
    className;
    functionName; 
    functionScope;
    params = [];
    stack = [];
}

class Logger {
    css = {
        logType: `color: gray; font-weight: bold;`,
        valueType: `color: orange; font-weight: 200;`,
        valueName: `color: magenta;`
    }

    constructor(config) {
        this.console = window.console;
        Object.assign(this.css, (config.css || {}));
    }

    overload(args) {
        this.console.log(args.length);
    }

    /**
     * @param {object} name
     */
    method(opts) {
        const strict = isStrictFunction(opts.arguments);
        const scope = opts.scope || window;
        const stack = parseStack();
        const namespace = stack[2].method.split('.');
        const { length, [0]: className, [length-1]: functionName } = namespace;

        const fn = scope[functionName];
        const parsed = parseFunction(fn);

        parsed.parameters = this.getFunctionParamaters((opts.arguments ? Array.from(opts.arguments) : []), fn);
        const css = [ this.css.logType, this.css.valueType, this.css.valueName ];

        this.console.log(`${scope.$className}.${parsed.name}`, parsed);
        this.console.log(`%c\t@filepath %c${parsed.stack[0].filepath}`);
        this.console.log(`%c\t@scope %c{${this.getType(scope)}} %cthis`, ...css, scope);
        this.params(...parsed.parameters);
    }

    params(...params) {
        params.forEach(param => {
            this.param(param);
        });
    }

    param(param) {
        const css = [this.css.logType, this.css.valueType, this.css.valueName];
        this.console.log(`%c\t@param %c{${param.type}} %c${param.name}`, ...css, param.value);
    }

    getType(obj) {
        return (obj != null && obj != undefined && obj.constructor)
            ? (obj.constructor.name === 'constructor' && obj.__proto__.$className || obj.constructor.xtype || obj.constructor.name)
            : (obj && obj.constructor.name || typeof(obj))
        ;
    }

    getFunctionName(argsOrFn) {
        var fn = (argsOrFn.callee || argsOrFn).toString();
        var paramNames = /\((.*?)\)/gi.exec(fn)[0].replace('(', '').replace(')', '').split(',');
        return {
            name: fn.name,
            params: paramNames 
        }
    }

    getFunctionParamaters(args, fn) {
        var paramDefinitions = parseFunction(fn.toString()).parameters;
        var params = Array.from(args).map((arg, index) => {
            let name  = String(paramDefinitions[index] && paramDefinitions[index].name || index).trim();
            let type  = this.getType(arg);
            let value = args[index];
            let param = Object.assign({}, (paramDefinitions[index] || {}), { type, name, value });
            return param;
        });

        return params;
    }

    getFunctionSignature(name, scope) {
        try {
            name = name || 'function';
            var func = name in scope 
                ? scope[name]
                : eval(name)
            ;

            return func.toString();
        }
        catch(e) { 
            return function() {};
        }
    }
}
