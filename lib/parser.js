
const regex = {
    // any whitespace character, newline, tab, etc
    whitespace: /(\s)+/gmi,
    // captures anything between open and close banana-braces™: `(...)`
    bananas: /\.?(\(|\))/gmi,
    // captures anything between open and close curly braces: `{...}`
    curlies: /\.?(\{.+\})/gmi,
    // captures anything between open and close curly braces: `[...]`
    brackets: /\.?(\[.+\])/gmi,
    // will capture first line of a function string `function fnName(...) {`
    function_signature: /^.+{$/gmi,
    function_signature_end: /\).+\{/gmi,
    // function_signature_end: /(\)\s+{?)/mi,
    function_parameters_level_1: /(\w+.?\=.?(\{.+?\})|\w+.?\=.?(\[.+?\])|\w+.?\=.?(\".+?\")|\.{3}\w+.?|\w+)/gmi,

    url: /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/i,

    // stacktrace_sourcemap: /\/([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+)|(\:\d+\:\d+)/,
    // stacktrace_sourcemap: /(^.*\ )|\/([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+)|\:(\d+)\:(\d+)/g,
    stacktrace_sourcemap: /(^.*[.]?\ )|\/([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+)|\:(\d*)\:(\d*)/g,
};

// don't think this will ever return true
function isStrictFunction(args) {
    try {
        return args && args.callee && args.callee.name ? false : true;
    } 
    catch (error) {
        return true;
    }
}

function parseFunction(string) {
    string = typeof(string) === 'function' ? string.toString() : string;
    let match = string && string.split(regex.function_signature);
    let signature = match && match[0] ? match[0] + ')' : string;
    let [ name, openBanana, parameters, closeBanana ] = signature ? signature.split(regex.bananas) : [];
    return { 
        name, 
        // signature, 
        stack: parseStack().slice(3),
        parameters: signature ? parseFunctionParameters(parameters) : {} 
    };
}

function parseFunctionParameters(string) {
    let params = [];
    let match = null;
    let index = 0;
    let doIndex = 0;
    do {
        // console.log('do');
        try {
            match = regex.function_parameters_level_1.exec(string);
            if (!match) continue;
            let signature = match[0];
            let [ name, defaultValueString, ] = signature.split('=').map(s => s.trim());
            let { value, type } = parseFunctionParameterDefaultValue(defaultValueString);
            let param = {
                index: index++,
                signature: signature,
                name: name,
                defaultValue: value,
                inferredType: type == 'undefined' || type == 'null' ? 'any' : type,
            }
            params.push(param);
        } catch (error) {
            console.error(error.message);
        }
        doIndex++;
    } while (doIndex < 100 && match)

    return params;
}

function parseFunctionParameterDefaultValue(string) {
    var value;
    var type;

    try {
        value = eval(`value = ${string}`);
    }
    catch (error) {
        console.log(`Failed to parse default parameter value "${string}" \n${error.message}`);
    }
    
    // todo: updgrade to more specific types.
    type = typeof(value);

    return { input: string, value, type };
}

function parseStack(error) {
    error = error || new Error();
    const stack = [];
    String(error.stack)
        .split(/\n/gm)
        .forEach((line, index, items) => {
            
            let trace = parseStackTrace(line, index);
            
            if (index === 0) {
                // title of stack trace doesn't conform to {method, filepath, line, col}
            }
            else if (index === items.length-1) {
                // last line of stack trace doesn't conform to {method, filepath, line, col}
            }
            else {
                stack.push(trace);
            }
        });
    return stack;
}

function parseStackTrace(line, index) {
    var [ method, filepath ] = (line||'')
        .replace('at', '')
        .replace(')', '')
        .replace('(', '')
        .trim()
        .split(' ')
    ;

    var { line, col } = parseStackTraceUrl(filepath);

    return {
        index,
        method,
        filepath,
        line,
        col
    };
}

function parseStackTraceUrl(string) {
    var match = /\d+\:\d+/g.exec(string);
    var [ line, col ] = match && match.length ? match[0].split(':') : [ undefined, undefined ];
    return { url: string, line, col };
}