import Base from './Base.js';

export default class Source extends Base {
    filename;
    line;
    column;
    
    constructor(config) {
        super(config);
    }
}
