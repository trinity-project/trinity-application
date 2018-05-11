const express = require('express');
const homeIndex = require('../controller/index');
const users = require('../controller/users');
const videoconfig = require('../public/js/config');

const router = function(app) {
    app.use(function(req, res, next) {
        res.locals.user = req.session.user;
        res.locals.provider = {name: 'provider',
                               public_key: videoconfig.nodeURL};
        res.locals.channel = req.session.channel;
        res.locals.balance = req.session.balance;
        next();
    });

    // index
    app.get('/', homeIndex.index);

    app.get('/signup', users.show_signup);
    app.get('/signin', users.show_signin);
    app.post('/signup', users.signup);
    app.post('/signin', users.signin);

    app.get('/index', users.signout);

    app.get('/play', homeIndex.play);
    app.post('/play', users.transfer_tnc);

    app.get('/channel/static', users.get_channel_static_info);
    app.post('/channel/close', users.close_channel);
};

module.exports = router;
