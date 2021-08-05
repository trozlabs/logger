import Base from './Base.js';

export default class Param extends Base {
    className;
    methodName;
    type;
    index;
    name;
    value;
    defaultValue;
    
    constructor(config) {
        super(config);
    }
}
