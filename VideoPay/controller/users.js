const _ = require('underscore');
const userModel = require('./model/modelUser');
const trinityAPI = require('./trinity');
const webSocket = require('./ws');
const timer = require('./timer');

exports.show_signup = function(req, res) {
    res.render('signup', {
        title: '注册'
    });
};

exports.show_signin = function(req, res) {
    res.render('signin', {
        title: '登录'
    });
};

exports.signup = function(req, res) {
    var userInfo = req.body;

    console.log(userInfo);
    console.log(req.body);

    userModel.findOne({ 'name': userInfo.name }, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (user) {
            // 重定向
            console.log('User has already existed！')
            return res.redirect('/signup');
        } else {
            userInfo.asset = {tnc: {address: userInfo.address,
                                    deposit: userInfo.deposit,
                                    private_key: userInfo.private_key,
                                    public_key: userInfo.public_key}};
            userInfo.channel = {tnc: {name: '', state: ''}}
            var newUser = new userModel(userInfo);

            newUser.save(function(err, user) {
                if (err) {
                    console.log(err);
                }

                // console.log(newUser);

                // 重定向
                console.log('Register Successfully！')
                res.redirect('/signin');
            });
        }
    });
};

exports.signin = function(req, res) {
    var name = req.body.name;
    var password = req.body.password;
    var provider = null;

    // 在数据库中查询
    userModel.findOne({ name: name }, function(err, result) {
        if (err) {
            console.log(err);
        }

        if (!result) {
            console.log('user has not registered！');
            return res.redirect('/signin');
        }

        result.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err);
            }

            if (isMatch) {
                // session 存储
                req.session.user = result.name;
                req.session.channel = result.channel.tnc.name;
                console.log(req.session.channel);
                var message = null;
                if (!result.channel.tnc.name) {
                    message = trinityAPI.channel.register(result.asset.tnc.public_key,
                                                      res.locals.provider.public_key,
                                                      'TNC', result.asset.tnc.deposit);
                    webSocket.send(message);
                    timer.run(trinityAPI.channel.getChannel, 10000, 20,
                               result.asset.tnc.public_key, res.locals.provider.public_key, result.name, req);
                }else {
                    req.session.channel = result.channel.tnc.name;
                    console.log('channel: ', req.session.channel);
                }
                console.log('Sign in Successfully！');
//                return res.redirect('/signin');
                return res.redirect('/');
            } else {
                console.log('Error Password！');
                return res.redirect('/signin');
            }
        });
    })
};

exports.signout = function(req, res) {
    delete req.session.user;
    delete req.session.channel;

    res.locals.user = null;
    res.locals.channel = null;

    // 重定向
    console.log('Sign out Successfully！')
    res.redirect('/');
};

exports.close_channel = function(req, res) {

    if (req.session.user) {
        userModel.findOne({ name: req.session.user }, function(err, result) {
            console.log(result);
            trinityAPI.channel.closeChannel(result.channel.tnc.name, result.asset.tnc.public_key);
        });

        userModel.updateOne({name: req.session.user}, {$set: {channel: {tnc : {name: '', state: ''}}}}, {upsert: true},
            function(err, res){
                if (err) {
                    console.log("Error to update the user's channel information: " + err);
                }
                else {
                    req.session.channel = null;
                    //req.session.deposit = item.
                    console.log('Close Channel OK!');
                }
        });
    }
};

// user configuration
exports.show_configuration = function(req, res) {
    if (!req.session.user) {
        console.log('Please signin firstly!');
        res.redirect('/');
        return;
    }
    console.log(id)

    if (id) {
        userModel.findById(id, function(req, user) {
            res.render('add_user', {
                title: '用户配置',
                user: user
            });
        });
    }
};


exports.configure = function(req, res) {
    if (!req.session.user) {
        console.log('Please signin firstly!');
        res.redirect('/');
        return;
    }
    //
};

exports.transfer_tnc = function(req, res) {
    console.log('enter here');
    if (!req.session.user) {
        console.log('Please signin firstly!');
        return;
    }

    console.log('888888888888888888888888888888')
    console.log(req.session.user);
    console.log(res.locals.provider.public_key);
    console.log('********************************')
    console.log(req.session.channel);
    if (req.body.fee){
        console.log(req.body.fee);
    };


    userModel.findOne({ name: req.session.user }, function(err, result) {
        console.log(result);
        trinityAPI.transfer.rsmcTransfer(result.asset.tnc.public_key,
                    res.locals.provider.public_key, result.channel.tnc.name, req.body.fee, webSocket);
    });
};

exports.get_channel_static_info = function(req, res) {
    userModel.findOne({ name: 'user' }, function(err, result) {
        console.log(result);
        res.send(result.channel.tnc);
    });
}
