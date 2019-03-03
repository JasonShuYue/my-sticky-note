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
      id: '',
      uid: '',
      $ct: $('#main-content'),
      content: '',
      done: 0, // 0（未完成）|| 1(已完成)
      level: 1, // 重要等级，从1~5,
      createdAt: ''
    },

    getCurrentTime() {
      var date = new Date();
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + m + '-' + d;
    },


    initOpts: function(opts) {
        // 等价于Object.assign({}, this.defaultOpts, opts || {})
        this.opts = $.extend({}, this.defaultOpts, opts || {});
        if(this.opts.id) {
            this.id = this.opts.id;
        } else {
            this.opts.createdAt = this.getCurrentTime();
        }
    },

    createNote: function() {
        // template
        var template =
            '<div class="note">' +
                '<div class="note-header">' +
                    '<span class="user-name"></span>' +
                    '' +
                    '<svg class="icon icon-close" aria-hidden="true">' +
                        '<use xlink:href="#icon-close"></use>' +
                    '</svg>' +
                '</div>' +
                '<div class="note-content" contenteditable="true">'+
                    this.opts.content +

                '</div>' +
                '<div class="create-time-wrapper">' +
                    '<span class="create-time-title">创建时间：</span>'+
                    '<span class="create-time"></span>'+
                '</div>' +

                '<div class="note-footer">' +
                    '<div class="level-wrapper">' +
                        '<span class="level-title">重要程度:</span>' +
                        '<span class="icon-star-wrapper" data-id = 1 >' +
                            '<svg class="icon icon-star" aria-hidden="true">' +
                                '<use xlink:href="#icon-star"></use>' +
                            '</svg>' +
                        '</span>'+
                        '<span class="icon-star-wrapper" data-id = 2 >' +
                            '<svg class="icon icon-star" aria-hidden="true">' +
                                '<use xlink:href="#icon-star"></use>' +
                            '</svg>' +
                        '</span>'+
                        '<span class="icon-star-wrapper" data-id = 3 >' +
                            '<svg class="icon icon-star" aria-hidden="true">' +
                                '<use xlink:href="#icon-star"></use>' +
                            '</svg>' +
                        '</span>'+
                        '<span class="icon-star-wrapper" data-id = 4 >' +
                            '<svg class="icon icon-star" aria-hidden="true">' +
                                '<use xlink:href="#icon-star"></use>' +
                            '</svg>' +
                        '</span>'+
                        '<span class="icon-star-wrapper" data-id = 5 >' +
                            '<svg class="icon icon-star" aria-hidden="true">' +
                                '<use xlink:href="#icon-star"></use>' +
                            '</svg>' +
                        '</span>'+

                    '</div>' +
                    '<span id="status-bt" class="status-bt">' +
                        '<svg class="icon icon-check" aria-hidden="true">' +
                            '<use xlink:href="#icon-check"></use>' +
                        '</svg>' +
                        '<span class="status-done">已完成</span>' +
                    '</span>' +
                '</div>' +
            '</div>';

        this.$note = $(template);
        var self = this;

        // 填充opts属性
        this.$note.find('.note-content').text(this.opts.content);
        this.$note.find('.user-name').text(this.opts.username + '说：');
        this.$note.find('.create-time').text(this.opts.createdAt.split(' ')[0]);
        if(this.opts.done === 1) {
            this.$note.find('#status-bt').addClass('active');
            this.$note.addClass('completed');
        } else {
            this.$note.find('#status-bt').removeClass('active');
        }


        this.$note.find('.icon-star-wrapper').slice(0, this.opts.level).addClass( "active" );



        // 将note放入note容器中
        self.opts.$ct.append(self.$note);
        eventHub.emit('waterfall');

        if(!this.id) {
            self.add(this.opts.content);
        }



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
        }).on('blur paste', function() {
           if($noteCt.data('before') !== $noteCt.text().trim()) {
               $noteCt.data('before',$noteCt.text().trim());
               eventHub.emit('waterfall');
               self.edit({
                   content: $noteCt.text().trim()
               })
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

        // 改变重要等级star
        $note.find('.icon-star-wrapper').on('click', function(e) {
            var cur = $(e.currentTarget);
            var index = cur.attr('data-id')

            self.edit({
                level: index,
            })
        })



        // 改变note status
        $note.find('#status-bt').on('click', function() {
            if(self.opts.done === 0) {
                $.post('api/notes/edit', {
                    id: self.id,
                    content: self.opts.content,
                    level: self.opts.level,
                    done: 1
                }).done(function(res) {
                    if(res.status === 0) {
                        self.opts.done = 1;
                        $note.find('#status-bt').addClass('active');
                        $note.addClass('completed');
                    } else {
                        Toast(res.errorMsg)
                    }
                })
            } else {
                $.post('api/notes/edit', {
                    id: self.id,
                    content: self.opts.content,
                    level: self.opts.level,
                    done: 0
                }).done(function(res) {
                    if(res.status === 0) {
                        self.opts.done = 0;
                        $note.find('#status-bt').removeClass('active');
                        $note.removeClass('completed');
                    } else {
                        Toast(res.errorMsg)
                    }
                })
            }
        })
    },


    add: function(msg) {
        var self = this;
        $.post('/api/notes/add', {
            content: msg,
            level: self.opts.level,
            done: self.opts.done
        })
            .done(function(res) {
                if(res.status !== 0) {
                    self.$note.remove();
                    eventHub.emit('waterfall')
                    Toast(res.errorMsg);
                }
            })
    },

    edit: function(opts) {
      var self = this;
      var $noteCt = this.$note.find('.note-content');
      $.post('/api/notes/edit', {
          id: self.id,
          content: opts.content || self.opts.content,
          level: opts.level || self.opts.level,
          done: opts.done || self.opts.done,
      })
          .done(function(res) {
              if(res.status !== 0) {
                  Toast(res.errorMsg)
                  //把原本内容恢复原样
                  $noteCt.text(self.opts.content);
              } else {
                  self.$note.find('.icon-star-wrapper').removeClass('active')
                      .slice(0, opts.level).addClass( "active" );
              }
          });
    },

    delete: function() {
        var self = this;
        $.post('/api/notes/delete', {id: this.opts.id})
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