const logger = new Logger();

Ext.define('LoggerTest.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.main',
    title: 'Logger Test',
    
    viewModel: {
        data: {},
        stores: {}
    },

    controller: {
        initViewModel() {
            logger.method({ scope: this, arguments });
        },

        init() {
            logger.method({ scope: this, arguments });

            this.test(this.getView(), this, this.getViewModel())
        },
        
        test(view, ctlr={ fn: Ext.emptyFn }, vm, arr1=[], obj1={}, dunno, anything) {
            logger.method({ scope: this, arguments });
        }
    }
});

Ext.define('LoggerTest.Application', {
    extend: 'Ext.app.Application',
    name: 'LoggerTest',
    mainView: 'LoggerTest.Main',
    
    launch() {
        logger.method({scope: this, arguments});
    }
});

Ext.application({
    name: 'LoggerTest',
    extend: 'LoggerTest.Application',
});