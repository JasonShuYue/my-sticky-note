var express = require('express');
var router = express.Router();
var Note = require('../models/note');

// 获取notes
router.get('/notes', function(req, res, next) {
    var opts = { raw: true };
    var query = req.query;
    if(req.session && req.session.user){
        opts.where = {uid:req.session.user.id }
    }

    if(query.type === 'complete') {
        Object.assign(opts, {done: 1});
    }


    Note.findAll(opts).then(function(notes) {
        // console.log(notes)
        res.send({
            status: 0,
            data: notes
        })
    }).catch({
        status: 1,
        errorMsg: '数据库异常'
    });
});


// 添加note
router.post('/notes/add', function(req, res, next) {
    var opts = req.body;
    var user = req.session.user;

    if(!user) {
        res.send({
            status: 1,
            errorMsg: '请先登录'
        })
    }

    if(!req.body.content) {
        return res.send({status: 2, errorMsg: '内容不能为空'});
    }

    var username = req.session.user.username;

    Object.assign(opts, {uid: user.id, username: username});

    Note.create(opts).then(function() {
        res.send({status: 0});
    }).catch(function() {
        res.send({
            status: 1,
            errorMsg: '数据库异常或者你没有权限'
        })
    });

});

// 修改note
router.post('/notes/edit', function(req, res, next) {
    var content = req.body.content;
    var id = req.body.id;
    var level = req.body.level;
    var done = req.body.done;
    var user = req.session.user;
    if(user) {
        Note.update({
            content: content,
            level: level,
            done: done
        }, {
            where: { id: id, uid: user.id}
        }).then(function() {
            res.send({status: 0})
        }).catch(function() {
            res.send({
                status: 1,
                errorMsg: '数据库异常或者你没有权限'
            })
        });
    } else {
        res.send({
            status: 1,
            errorMsg: '请先登录'
        })
    }

});

// 删除note
router.post('/notes/delete', function(req, res, next) {
    var id = req.body.id;
    var user = req.session.user;
    if(user) {
        Note.destroy({
            where: {id: id, uid: user.id}
        }).then(function() {
            res.send({
                status: 0
            })
        }).catch(function() {
            res.send({
                status: 1,
                errorMsg: '数据库异常或者你没有权限'
            })
        })
    } else {
        res.send({
            status: 1,
            errorMsg: '请先登录'
        })
    }


})

module.exports = router;