import Base from './Base.js';
// import Param from './Param';

export default class Method extends Base {

    static parse(argsOrFn) {
        const fn = (argsOrFn && argsOrFn.callee || argsOrFn);
        const signature = this.getSignature(fn);
        const name = this.getName(fn);
        const paramNames = this.getParamNames(fn);
        return { name, signature, paramNames };
    }

    static getSignature(argsOrFn) {
        const fn = (argsOrFn && argsOrFn.callee || argsOrFn);
        return /\w(.*?)\)/gi.exec(fn)[0];
    }

    static getName(argsOrFn) {
        const fn = (argsOrFn && argsOrFn.callee || argsOrFn);
        return /[^(]*/i.exec(fn)[0];
    }

    static getParamNames(argsOrFn) {
        const fn = (argsOrFn && argsOrFn.callee || argsOrFn);
        return /\((.*?)\)/gi.exec(fn)[0].replace('(', '').replace(')', '').split(',').map(param => param.trim());
    }

    name;
    signature;
    className;
    method;
    params;
    scope;
    strict;

    constructor(config) {
        super(config);

        const configType = this.getType(config);
        
        // console.log('configType', configType);

        if (configType !== 'function') return this;

        this.method = config;
        this.stict = this.method ? true : false;

        const { name, signature, paramNames } = this.parse(config);

        this.name = name;
        this.signature = signature;
        this.params = paramNames;
    }
}
