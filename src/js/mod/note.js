
var Toast = require('mod/toast').Toast;

var eventHub = require('mod/eventHub');

function Note(opts) {
    this.initOpts(opts);
    this.createNote();
    this.bindEvent();
}

Note.prototype = {

    defaultOpts: {
      id: '',
      uid: '',
      $ct: $('#main-content'),
      content: 'input content'
    },

    initOpts: function(opts) {
        // 等价于Object.assign({}, this.defaultOpts, opts || {})
        this.opts = $.extend({}, this.defaultOpts, opts || {});

        if(this.opts.id) {
            this.id = this.opts.id;
        }
    },

    createNote: function() {
        var temlate =
            '<div class="note">' +
            '</div>'
    },
};