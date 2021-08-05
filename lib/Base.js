

export default class Base {

    self;

    constructor(config) {
        // convienience property to access from instance. 
        this.self = this.constructor;
        // check to see if the config is an object before calling applyConfig
        if (this.getType(config) === 'object') {
            this.applyConfig(config);
        }
        this.applyStaticMethods();
    }

    /**
     * Lazily set class property values with an object but don't 
     * add properties that aren't defined on the class to keep it clean.
     * @param {object} config
     * @returns {void}
     */
    applyConfig(config) {
        for (let prop in config) {
            if (!this.hasOwnProperty(prop)) {
                console.warn(`${prop} does not exist on ${this.constructor.name}`);
                continue;
            }

            this[prop] = config[prop];
        }
    }

    /**
     * Nerge static methods with instance so they can be easily reached.
     * @returns {void}
     */
    applyStaticMethods() {
        const self = this.self;
        const statics = Object.getOwnPropertyNames(self).filter(prop => !['length', 'prototype', 'name'].includes(prop));
        
        for (let prop of statics) {
            if (this.getType(self[prop]) === 'function') {
                if (this.hasOwnProperty(prop)) {
                    console.warn(`static ${prop} conflicts with instance property`);
                    continue;
                }
                this[prop] = self[prop];
            }
        }
    }

    /**
     * Get the primitive type of a value. 
     * @param {any} obj the value to check
     * @returns {string} primitive type
     */
    getType(obj) {
        return typeof(obj);
    }

    /**
     * Check if a value is empty.
     * @param {any} obj
     * @returns {boolean}
     */
    isEmpty(obj) {
        return obj === null 
            || obj === undefined 
            || Array.isArray(obj) && obj.length === 0
            || this.getType(obj) === 'object' && Object.keys(obj).length === 0
        ;
    }
}
