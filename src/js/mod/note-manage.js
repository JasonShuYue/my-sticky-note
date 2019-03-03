
var Note = require('mod/Note').Note;
var eventHub = require('mod/eventHub');
var Toast = require('mod/toast').Toast;


var noteManage = (function() {
    function add(data) {
        new Note(data);
    }


    function load() {
        $.get('/api/notes').done(function(res) {

            if(res.status === 0) {
                $.each(res.data, function(idx, article) {

                    new Note(article)
                })

                eventHub.emit('waterfall');
            } else {
                Toast(res.errorMsg);
            }
        });
    }



    return {
        add: add,
        load: load
    };
})();

module.exports = noteManage;