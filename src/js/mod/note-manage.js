
var Note = require('mod/Note').Note;
var eventHub = require('mod/eventHub');


var noteManage = (function() {
    function add() {
        // var textArea = $('.note-form-wrapper').find('#note-content');
        // var stars = $('.note-form-wrapper').find('.level-wrapper .icon-star');
        //
        // // 激活addForm窗口
        // triggerShadow(true);
        //
        // // active star
        // stars.each(function() {
        //     var self = this;
        //     var index = 0;
        //     $(this).on('click', function() {
        //         index = $(self).attr('data-index');
        //         stars.removeClass('active').slice(0, index).addClass('active');
        //     })
        // })
        //
        // $('.shade-wrapper').on('click', function() {
        //     triggerShadow(false);
        // })
        //
        // $('.note-form-wrapper').find('.icon-close').on('click', function() {
        //     triggerShadow(false);
        // });
        //
        // // 点击「添加」按钮
        // $('.note-form-wrapper').find('.add-bt').on('click', function() {
        //     var content = textArea.val().trim();
        //
        //     var opts = {
        //         content: content || '',
        //         level: 0
        //     };
        //
        //     console.log('content-----------------------', content)
        //     // console.log('opts-----------------------', opts)
        //     // new Note(opts);
        //     triggerShadow(false)
        //     eventHub.emit('waterfall');
        // })



        // // 控制add窗口的遮罩
        // function triggerShadow(status) {
        //     if(status) {
        //         $('.shade-wrapper').addClass('active');
        //         $('.note-form-wrapper').addClass('active');
        //     } else {
        //         $('.shade-wrapper').removeClass('active');
        //         $('.note-form-wrapper').removeClass('active');
        //     }
        // }
        new Note();

    }

    function load() {

    }

    return {
        add: add,
        load: load
    };
})();

module.exports = noteManage;