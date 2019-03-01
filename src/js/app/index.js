require('scss/index.scss')


var Toast = require('mod/toast').Toast;
var eventHub = require('mod/eventHub');

var waterFall = require('mod/waterfall');
var noteManage = require('mod/note-manage');


noteManage.load();

// Toast('请先登录', 15000)

$('#add-note').on('click', function(e) {
    noteManage.add();
})





eventHub.on('waterfall', function(){
    var maxHeight = waterFall.init($('#main-content'));
    // 更新main-content页面的高度
    $('#main-content').css('height', 100 + maxHeight + 'px');
});











