/* exported channel */
var channel = (function() {

'use strict';

var pub = {};

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, '');
    };
}

pub.raw_transaction = function(trad_info, user_name) {
    var user_info = user.get(user_name);
    if (!user) {
        console.log(user_name + ' not found');
        return false;
    }

    var pubKeyEncoded =getPublicKeyEncoded(ab2hexstring(user_info.asset.pub_key));
    var signre = signatureData( trad_info, user_info.asset.pri_key);
    $.ajax({
        url: "http://47.254.39.10:20552",
        type: "POST",
        data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "sendrawtransaction",
            "params": [message.result.trad_info, signre, pubKeyEncoded],
            "id": 1
        }),
        contentType: 'application/json',
        success: function(message) {
            if(message.result =="fail"){
                console.log('response message result is equal "fail"');
                return false;
            } else {
                console.log('Succeed to add the channel')
                return true;
            }
        },
        error: function(message) {
            alert("error");
            return false;
        }
    });

    return true;
}

pub.register = function(user_name, deposit) {
    var sender = user.get('demo_user');
    var receiver = user.get(user_name);

    if (!sender || !receiver) {
        console.log('sender: ', sender, ' receiver: ', receiver);
        return;
    }

    $.ajax({
        url: "http://47.254.39.10:20552",
        type: "POST",
        data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "registchannel",
            "params": [sender.asset.tnc, receiver.asset.tnc, 'TNC', deposit, "1"],
            "id": 1
        }),
        contentType: 'application/json',
        success: function(message) {
            if (message.result.error) {
                console.log('Error in response: ', message.result.error);
                return;
            }
            if(message.result.channel_name == null){
                console.log('channel name is null, trad_info: ', message.result.trad_info);
                return;
            }

            // update the user channel information
            user.update('demo_user', null, message.result.channel_name);

            raw_transaction('demo_user');
        },
        error: function(message) {
            alert("error");
        }
    });
}

return pub;
})();
