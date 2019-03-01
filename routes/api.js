var express = require('express');
var router = express.Router();
var Note = require('../models/note');

router.get('/notes', function(req, res, next) {
    var opts = { raw: true };
    Note.findAll(opts).then(function(notes) {
        res.send({
            status: 0,
            data: notes
        })
    }).catch({
        status: 1,
        errorMsg: '数据库异常'
    });
});


router.post('/notes/add', function(req, res, next) {
    console.log('add')

});

router.post('/notes/edit', function(req, res, next) {
    console.log('edit')

});

router.post('/notes/delete', function(req, res, next) {
    console.log('delete')

})

module.exports = router;