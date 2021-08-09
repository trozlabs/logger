const logger = new Logger();

Ext.define('LoggerTest.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.main',
    title: 'Logger Test',
    items: [{
        xtype: 'toolbar',
        docked: 'top',
        items: [{
            text: 'clear'
        }]
    }, {
        xtype: 'panel',
        html: 'Panel Body'
    }],
    viewModel: {
        data: {},
        stores: {}
    },
    controller: {
        init() {
            this.test(this.getView(), this, this.getViewModel())
        },
        initViewModel() {
        },
        test(view, ctlr={ fn: Ext.emptyFn }, vm) {
            logger.method({
                scope: this,
                arguments
            });
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