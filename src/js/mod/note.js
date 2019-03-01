require('scss/note.scss');

var Toast = require('mod/toast').Toast;

var eventHub = require('mod/eventHub');

function Note(opts) {
    this.initOpts(opts);
    this.createNote();
    this.bindEvent();
}

Note.prototype = {

    defaultOpts: {
      id: '12',
      uid: '',
      $ct: $('#main-content'),
      content: '',
      done: 0, // 0（未完成）|| 1(已完成)
      level: 1, // 重要等级，从1~5,
      createTime: '2018年5月24日'
    },


    initOpts: function(opts) {
        // 等价于Object.assign({}, this.defaultOpts, opts || {})
        this.opts = $.extend({}, this.defaultOpts, opts || {});

        if(this.opts.id) {
            this.id = this.opts.id;
        }
    },

    createNote: function() {
        // template
        var template =
            '<div class="note">' +
                '<div class="note-header">' +
                    '<span class="create-time">'+ this.opts.createTime +'</span>' +
                    '<svg class="icon icon-close" aria-hidden="true">' +
                        '<use xlink:href="#icon-close"></use>' +
                    '</svg>' +
                '</div>' +
                '<div class="note-content" contenteditable="true">'+ this.opts.content +'</div>' +
                '<div class="note-footer">' +
                    '<div class="level-wrapper">' +
                        '<span class="icon-star-wrapper">' +
                            '<svg class="icon icon-star" aria-hidden="true">' +
                                '<use xlink:href="#icon-star"></use>' +
                            '</svg>' +
                        '</span>'+
                        '<span class="icon-star-wrapper">' +
                            '<svg class="icon icon-star" aria-hidden="true">' +
                                '<use xlink:href="#icon-star"></use>' +
                            '</svg>' +
                        '</span>'+
                        '<span class="icon-star-wrapper">' +
                            '<svg class="icon icon-star" aria-hidden="true">' +
                                '<use xlink:href="#icon-star"></use>' +
                            '</svg>' +
                        '</span>'+
                        '<span class="icon-star-wrapper">' +
                            '<svg class="icon icon-star" aria-hidden="true">' +
                                '<use xlink:href="#icon-star"></use>' +
                            '</svg>' +
                        '</span>'+
                        '<span class="icon-star-wrapper">' +
                            '<svg class="icon icon-star" aria-hidden="true">' +
                                '<use xlink:href="#icon-star"></use>' +
                            '</svg>' +
                        '</span>'+

                    '</div>' +
                    '<span id="status-bt" class="status-bt">' +
                        '<svg class="icon icon-check" aria-hidden="true">' +
                            '<use xlink:href="#icon-check"></use>' +
                        '</svg>' +
                    '</span>' +
                '</div>' +
            '</div>';

        this.$note = $(template);

        // 填充opts属性
        this.$note.find('.note-content').text(this.opts.content);


        this.$note.find('.icon-star-wrapper').slice(0, 4).addClass( "active" );



        // 将note放入note容器中
        this.opts.$ct.append(this.$note);


        // if(!this.id) {
        //     this.$note.css('bottom', '10px');
        // }

        eventHub.emit('waterfall');

    },

    bindEvent: function() {
        var self = this,
            $note = this.$note,
            $noteHead = $note.find('.note-header'),
            $noteCt = $note.find('.note-content'),
            $delete = $note.find('.icon-close');


        $delete.on('click', function() {
            self.delete();
        });

        //contenteditable没有 change 事件，所有这里做了模拟通过判断元素内容变动，执行 save
        $noteCt.on('focus', function() {
            var content = $noteCt.text().trim();
            $noteCt.data('before', content)
        }).on('blur', function() {
           if($noteCt.data('before') !== $noteCt.text().trim()) {
               $noteCt.data('before',$noteCt.text().trim());
               eventHub.emit('waterfall');
               // self.edit($noteCt.text().trim())
           } else {
               $noteCt.text($noteCt.data('before'))
           }
        });

        // 设置标签移动
        $($noteHead).on('mousedown', function(e) {
            var evtX = e.pageX - $note.offset().left,
                evtY = e.pageY - $note.offset().top;
            $note.addClass('draggable').data('evtPos', { x: evtX, y: evtY});
        }).on('mouseup', function() {
            $note.removeClass('draggable').removeData('evtPos');
        });

        $('body').on('mousemove', function(e) {
            $('.draggable').length && $('.draggable').offset({
                top: e.pageY-$('.draggable').data('evtPos').y,    // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
                left: e.pageX-$('.draggable').data('evtPos').x
            });
        })
    },


    delete: function() {
        var self = this;
        $.post('/api/notes/delete', {id: this.id})
            .done(function(ret) {
                if(ret.status === 0) {
                    self.$note.remove();
                    eventHub.emit('waterfall');
                } else {
                    Toast(ret.errorMsg);
                }
            })

    }

}
;

module.exports.Note = Note;