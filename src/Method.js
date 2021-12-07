
class MethodParameter {
    /**
     * @property {string} name the argument name or `index` if not specified
     */
    name = ''
    
    /**
     * @property {string} signature the part of the `fn.toString()` used to gather info about the argument
     */
    signature = ''

    /**
     * @property {number} index the argument index
     */
    index = 0
    
    /**
     * @property {string} type the name of the type of the actual argument value 
     */
    type = 'undefined'
    
    /**
     * @property {object} value the argument value that the function would/did recieve
     */
    value = undefined

    /**
     * @property {object} defaultValue the argument default value if specified
     */
    defaultValue = undefined
    
    /**
     * @property {string} defaultValueType the argument default values type if specified
     */
    defaultValueType = 'undefined'


    constructor(config) {
        config = (config || {});

        const method    = config.method     || config.fn;
        const args      = config.arguments  || config.args;
        const scope     = config.scope      || globalThis || window;
    }
}

class Method {

    name = 'anonymous'
    scope = {}
    signature = ''
    arguments = []
    stacktrace = []

    parameters = new Map();

    constructor(config) {
        config = (config || {});

        const method = this.method = config.method || config.fn || null;
        const args = this.arguments = config.arguments || config.args || [];
        const scope = this.scope = config.scope || globalThis || window;
    }
}
