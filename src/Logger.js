// Working on organizing and clearning up all this code. 
class Log {
    type;
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

    constructor(fn, args) {

    }
}


class Logger {
    css = {
        logType: `color: gray; font-weight: bold;`,
        valueType: `color: orange; font-weight: 200;`,
        valueName: `color: magenta;`
    }

    constructor(config) {
        this.console = window.console;
        config = config || {};
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
        
        this.console.log(`
            functionName    : ${functionName}
            namespace       : ${namespace}
            parsed          : `, parsed
        );

        
            const css = [ this.css.logType, this.css.valueType, this.css.valueName ];
        // this.console.groupCollapsed(`${scope.$className}.${parsed.name}`, parsed);
        this.console.group(`${scope.$className}.${parsed.name}`, parsed);
            this.console.log(`\t@filepath ${parsed.stack[0].filepath}`);
            this.console.log(`%c\t@scope %c{${this.getType(scope)}} %cthis`, ...css, scope);
            this.params(...parsed.parameters);
        this.console.groupEnd(`${scope.$className}.${parsed.name}`);
    }

    params(...params) {
        params.forEach(param => this.param(param));
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

    getFunctionParamaters(args, fn) {
     
        const method = parseFunction(fn);
        const params = method.parameters;

        const recievedCount = args.length;
        const expectedCount = params.length;
        const actualCount   = recievedCount > expectedCount ? recievedCount : expectedCount;

        this.console.log({ recievedCount, expectedCount, actualCount });

        for (let currentIndex = 0; currentIndex < actualCount; currentIndex++) {
            
            const definition = {};
            const argument = args[currentIndex];
            const parameter = params[currentIndex];
            const name = String(parameter ? parameter.name : currentIndex).trim();

            this.console.log(parameter)
            
            Object.assign(definition, {
                name: name,
                index: currentIndex,
                isExpected: parameter ? true : false,
                defaultValue: undefined,
                defaultValueType: this.getType(parameter && parameter.defaultValue),
                type: this.getType(argument),
                value: argument
            }, (parameter || {}));

            // this.console.log(definition);

            params.push(definition);
        }

        // var params = Array.from(paramDefinitions).map((arg, index) => {
        //     let name  = String(paramDefinitions[index] && paramDefinitions[index].name || index).trim();
        //     let type  = this.getType(args[index]);
        //     let value = args[index];
        //     let param = Object.assign({}, (paramDefinitions[index] || {}), { type, name, value });
        //     return param;
        // });

        return params;
    }
}
