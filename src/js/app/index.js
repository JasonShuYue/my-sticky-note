require('scss/index.scss')


var Toast = require('mod/toast').Toast;
var eventHub = require('mod/eventHub');

var waterFall = require('mod/waterfall');
var noteManage = require('mod/note-manage');


noteManage.load();

// Toast('请先登录', 15000)

$('#add-note').on('click', function(e) {
    triggerAddForm(true)
    // noteManage.add();
})



$('#notes-type-wrapper').find("[note-type = 'all']").addClass('active');
$('#notes-type-wrapper').find('.notes-type').on('click', function(e) {
    var noteType = $(e.currentTarget).attr('note-type');
    $(e.currentTarget).addClass('active')
        .siblings().removeClass('active');
    if(noteType === 'completed') {
        // items包括所有不包含completed类的note
        var items = $('#main-content').find('.note:not(.completed)');
        items.addClass('hidden');
    } else {
        var items = $('#main-content').find('.note.hidden');
        items.removeClass('hidden');
    }
    eventHub.emit('waterfall');

})


eventHub.on('waterfall', function(){
    var maxHeight = waterFall.init($('#main-content'));

    // 更新main-content页面的高度
    $('#main-content').css('height', 100 + maxHeight + 'px');
});




var shade = $('.shade-wrapper');
var form = $('.note-form-wrapper');
var content = '';
var index = 1;
var data = {};

shade.on('click', function() {
    triggerAddForm(false)
});
form.find('.icon-close').on('click', function() {
    triggerAddForm(false)
});

form.find('.level-wrapper .star-container').on('click', function(e) {
    index = $(e.currentTarget).attr('data-index');
    $('.level-wrapper .star-container').removeClass('active').slice(0, index).addClass('active');
})

form.find('#add-bt-wrapper').on('click', function() {
    content = form.find('#note-content').val().trim();
    data = {
        content: content,
        level: index
    };

    noteManage.add(data);
    triggerAddForm(false)

})

function triggerAddForm(status) {
    if(status) {
        shade.addClass('active');
        form.addClass('active');
        $('.level-wrapper .star-container').removeClass('active').slice(0, index).addClass('active');
    } else {
        shade.removeClass('active');
        form.removeClass('active');
        form.find('#note-content').val('');
        index = 1;
    }
}











