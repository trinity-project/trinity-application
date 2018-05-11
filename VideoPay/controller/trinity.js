module.exports = (function () {
    'use strict';

    const mongoose = require('mongoose');
    const bundle = require('../public/js/bundle');
    const config = require('../public/js/config');
    const crypto = require('crypto');
    const request = require('request');
    const userModel = require('./model/modelUser');


    var version = "0.0.1";
    var user = {}

    var trinityChannel = {
        url: config.nodeURL,
        name: null,
        register: null,
        getChannel: null,
        closeChannel: null,
        close: null
    }

    var trinityTransfer = {
        url: config.nodeURL,
        transfer: null,
        rsmcTransfer: null
    };

    var trinityPay = {
        version: version,
        user: user,
        channel: trinityChannel,
        transfer: trinityTransfer,
    };

    function is_valid_url(url) {
        try {
            var url_list = url.split('@');
            if (2 === url_list.length) {
                return url_list;
            }

            console.log('Invalid URL: ', url)
        } catch(e) {
            console.log(e);
        }

        return false;
    }

    function hex_md5(src) {
        var md5 = crypto.createHash('md5').update(src);
        return md5.digest('hex');
    }

    // channel parts
    trinityChannel.register = function(sender, receiver, asset, deposit) {
        var url_list = is_valid_url(this.url);

        if (!url_list) {
            console.log('register channel failed');
            return null;
        }

        var channelName = new Date().getTime().toString() + receiver;
        channelName = hex_md5(channelName);

        var message = {
            "MessageType":"RegisterChannel",
            "Sender": sender,
            "Receiver":receiver,
            "ChannelName":channelName,
            "MessageBody": {
                  "AssetType" : asset,
                  "Deposit": deposit,
                  //"Date":date
              }
            };
        console.log('start to register channel');
        return message;
    }

    trinityChannel.getChannel = function(args){
        var sender = args[0];
        var receiver = args[1];
        var condition = args[2];
        var req = args[3];

        if (!sender || !receiver){
            return false;
        }

        var trinity_url = 'http://' + sender.split('@')[1].split(':')[0] + ':20556';

        request.post({
            url: trinity_url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: {
                "jsonrpc": "2.0",
                "method": "GetChannelState",
                "params": [{'dest_addr': sender, 'src_addr': receiver, 'state':'OPENED'}],
                "id": 1
            }
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body.result && body.result.MessageBody){
                    body.result.MessageBody.forEach((item) => {
                        userModel.updateOne({name: condition}, {$set: {channel: {tnc : {name: item.channel.trim(), state: item.state}}}}, {upsert: true},
                            function(err, res){
                                if (err) {
                                    console.log("Error:" + err);
                                }
                                else {
                                    req.session.channel = item.channel.trim();
                                    //req.session.deposit = item.
                                    console.log('successfully update the database');
                                }
                            });
                    });
                }
            }
            else{
                console.log(error);
            }
        });

        if (req.session.channel){
            console.log(req.session.channel);
            return true;
        }

        return false;
    }

    trinityChannel.closeChannel = function(channel_name, sender){
        var sender_list = sender.split('@');
        var trinity_url = 'http://' + sender_list[1].split(':')[0] + ':20556';

        request.post({
            url: trinity_url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: {
                "jsonrpc": "2.0",
                "method": "CloseChannel",
                "params": [channel_name, sender],
                "id": 1
            }
        }, function(error, response, body) {
            console.log(body);
        });

        return;
    }

    // transaction part
    // send transaction to the service provider
    trinityTransfer.rsmcTransfer = function(sender, receiver, channel_name, amount) {
        var sender_list = sender.split('@');
        var receiver_list = receiver.split('@');
        var trinity_url = 'http://' + sender_list[1].split(':')[0] + ':20556';
        var websocket = arguments[4];

        console.log(sender_list);
        console.log(receiver_list);
        console.log(trinity_url);

        request.post({
            url: trinity_url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: {
                "jsonrpc": "2.0",
                "method": "GenerateRSMCMessage",
                "params": [channel_name, sender_list[0], sender_list[1], receiver_list[0], receiver_list[1], amount, 0],
                "id": 1
            }
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body.result && body.result.MessageType === "Rsmc"){
                    websocket.send(body.result);
                    console.log('send Rsmc message');

                    return true;
                }
            }
            else{
                console.log(error);
            }
        });

        return;
    }

    return trinityPay;
})();