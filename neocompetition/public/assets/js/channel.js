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
    var trinity_url = user.trinity_url();

    if (!user) {
        console.log(user_name + ' not found');
        return false;
    }
    
    var pub_key = getPublicKey(user_info.asset.pri_key, 0)
    var pubKeyEncoded = getPublicKeyEncoded(ab2hexstring(pub_key));
    var signre = signatureData( trad_info, user_info.asset.pri_key);
    $.ajax({
        url: trinity_url,
        type: "POST",
        data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "sendrawtransaction",
            "params": [trad_info, signre, pubKeyEncoded],
            "id": 1
        }),
        contentType: 'application/json',
        success: function(message) {
            if(message.result =="fail"){
                console.log('response message result is equal "fail"');
                return false;
            } else {
                alert('Add channel successfully for user '+ user_name);
                console.log('Succeed to add the channel')
                return true;
            }
        },
        error: function(message) {
            console.log("Error response after calling JSONRPC API 'sendrawtransaction'");
            return false;
        }
    });

    return true;
}

pub.register = function(user_name, deposit) {
    var sender = user.get('demo_user');
    var receiver = user.get(user_name);
    var trinity_url = user.trinity_url();

    if (!sender || !receiver) {
        console.log('sender: ', sender, ' receiver: ', receiver);
        return;
    }

    $.ajax({
        url: trinity_url,
        type: "POST",
        data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "registchannel",
            "params": [sender.asset.tnc, receiver.asset.tnc, 'TNC', deposit, "1"],
            "id": 1
        }),
        contentType: 'application/json',
        success: function(message) {
            if (message.hasOwnProperty('result')){
                if (message.result.error) {
                    if (message.result.error == "channel already exist") {
                        console.log('channel already exist');
                        // re-get the channel-name
                        return pub.getChannel();
                    }
                    console.log('Error in response: ', message.result.error);
                    return false;
                }
                if(message.result.channel_name == null){
                    console.log('channel name is null, trad_info: ', message.result.trad_info);
                    return false;
                }
                
                // update the user channel information
                user.update('demo_user', null, message.result.channel_name);
                pub.raw_transaction(message.result.trad_info, 'demo_user');
            } else {
                console.log('error occurred during response');
                if (message.hasOwnProperty('error')){console.log(message.error);}
                return false;
            }
        },
        error: function(message) {
            console.log("Error response after call JSONRPC API 'registchannel'");
            return false;
        }
    });
}

pub.getChannel = function(){
    var demo_user = user.get('demo_user');
    var trinity_url = user.trinity_url();

    if (demo_user.channel_name) {
        console.log("channel name is: ", demo_user.channel_name);
        return false;
    }

    // need to get the channel name to update in the user info
    $.ajax({
        url: trinity_url,
        type: "POST",
        data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "getchannelstate",
            "params": [demo_user.asset.tnc],
            "id": 1
        }),
        contentType: 'application/json',
        success: function(message) {
            if(message.result.type == "transaction"){
                if (message.result.message) {
                    message.result.message.forEach((item) => {
                        if (item.tx_info[0].address === demo_user.asset.tnc) {
                            user.update('demo_user', null, item.channel_name);
                            console.log('Update user info. user: ' + demo_user.user + '. channel: '+ item.channel_name);
                            alert('Update user info. user: ' + demo_user.user + '. channel: '+ item.channel_name);
                            return true;
                        }
                    });
                }
            } else if (message.result.type == "signature"){
            } else {
                console.log('Error response via API-getchannelstate. Msg: ', message);
            }
        },
        error: function(message) {
            console.log('Error response to call JSONRPC API getchannelstate. Msg: ', message)
            return false;
        }
    });

    return false;
}

return pub;
})();
