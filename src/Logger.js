
export default class Logger {

    constructor() {
        this.console = window.console;
    }
    
    // ATTENTION: ALL OF THIS BELOW IS KINDA GROSS... PLEASE DON'T JUDGE.
    //
    log(opts) {

        // all of this could be made 100% More Better with regwx™. 
        //
        var stack = new Error().stack
            .split('\n').splice(1).map(trace => String(trace).trim()).filter(trace => trace.length)
            .map(trace => {
                // all of this stack trace line could be better.
                let words = trace.split(' ').splice(1);
                let { length, [0]: first, [words.length-1]: last } = words;
                let method = length > 2 || length === 1 ? 'anonymous' : first;
                let file = last.replace('(', '').replace(')', '');
                let [ protocol, path, line, column ] = file.split(':');
                
                return {
                    method, 
                    file: {
                        trace,
                        path: protocol + path, // lazy fix for splitting on ':'
                        line,
                        column
                    } 
                };
            });
        
        // not sure if there wouldn't be a stack[1] or not
        var trace = stack.length > 1 ? stack[1] : stack[0];
        var name = trace.method;
        var file = trace.file.path;
        var line = trace.file.line;
        var column = trace.file.column;
        // this might not be ok but using window as fallback for now.
        var scope = opts.scope || window;
        // todo: this is probably not reliable or safe. Need to verify
        var fn = this.getFunctionSignature(name, scope);
        var args = this.getFunctionArguments((opts.arguments ? Array.from(opts.arguments) : []), fn);

        this.console.log.apply(scope, [ name, { ['this']: scope, args, file, line, column } ]);
    }

    getType(obj) {
        return (obj != null && obj != undefined && obj.constructor)
            ? (obj.constructor.name === 'constructor' && obj.__proto__.$className || obj.constructor.xtype || obj.constructor.name)
            : (obj && obj.constructor.name || typeof(obj))
        ;
    }

    /**
     * If the function is not in 'strict mode' you 
     * can just pass arguments.
     * @param {arguments|Function} argsOrFn
     */
    getFunctionName(argsOrFn) {
        var fn = (argsOrFn.callee || argsOrFn).toString();
        var paramNames = /\((.*?)\)/gi.exec(fn)[0].replace('(', '').replace(')', '').split(',');
        // this.console.log(fn);
        // this.console.log(paramNames);
        return {
            name: fn.name,
            params: paramNames 
        }
    }
    
    getFunctionArguments(args, fn) {
        var names = /\((.*?)\)/gi.exec(fn)[0].replace('(', '').replace(')', '').split(',');
        var params = Array.from(args).map((arg, index) => {
            let name = String(names[index] || index).trim();
            let type = this.getType(arg);
            let value = args[index];

            return {
                type,
                name,
                value
            };
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


    functionParser(fn) {
        return {
            fn: fn,
            name: this.getFunctionName(fn),
            params: this.getFunctionArguments()
        }
    }
}
