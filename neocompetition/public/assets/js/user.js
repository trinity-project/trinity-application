/* exported user */
var user = (function() {

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

var demo_user_table = {
    'demo_provider': {
        'asset': {
            'tnc': 'AazWg8QK6SmVFUygXJPv2Lb6KB9sW7zAf2',
            'pub_key': '0400080c83cfd497de093c280f5c80918395a5c63efbe0b8032719f18da851b92d8431f390bd1bfd5951dc15891573deead9a8af17ab0b8666b885d38e0e4f1e32'
        },
        'channel_name': undefined
    },
    'demo_user': {
        'asset': {
            'tnc': 'AL3dhjgXJk7g55iC28Udgg48sNsM8apdDr',
            'pri_key': 'd3b661b95977cfc5c8efd07d043f7a31a8647e7e9e751c89cda1f84ec4242e3c',
            'pub_key': '046cc9bbd1eacd74710dc4289d8d39e1f861b80b34d2b397980c8f373343e5739050f0733f4e339d5fe5e5f9e91b477c964d702f0b679a622ac26ee8419e03bd6b'
        },
        'channel_name': undefined
    },
};

pub.update = function(user_name, asset, channel_name) {
    // update the channel firstly
    if (channel_name) {
        demo_user_table[user_name].channel = channel_name;
    }
    // update the asset
    if (asset) {
        try{
            for (var key in asset) {
                demo_user_table[user_name].asset[key] = asset[key]
            }
        } catch ( err ) {
            console.log('Failed to update asset for user ' + user_name + '. Error: ' + err);
            console.log(asset);
        }
    }
}

pub.get = function(user_name) {
    //
    if (demo_user_table.hasOwnProperty(user_name)) {
        var user_info = demo_user_table[user_name];
        user_info['user'] = user_name;
        return user_info;
    }

    return null;
}

pub.trinity_url = function() {
    return "http://localhost:5000";
}

pub.register_address = function(user_name){
    var user_info = this.get(user_name);
    if (!user_info){
        console.log('null user ', user_name);
        return;
    }
    console.log(user_info.user);

    $.ajax({
        url: this.trinity_url(),
        type: "POST",
        data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "registeaddress",
            "params": [user_info.asset.tnc, "", getPublicKeyEncoded(ab2hexstring(user_info.asset.pub_key))],
            "id": 1
        }),
        contentType: 'application/json',
        success: function(message) {
        },
        error: function(message) {
        }
    });
}

// send transaction to the service provider
pub.transfer = function(asset, amount) {
    var sender = this.get('demo_user');
    var receiver = this.get('demo_provider');
    var trinity_url = this.trinity_url();

    $.ajax({
        url: trinity_url,
        type: "POST",
        data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "sendertoreceiver",
            "params": [sender.asset.tnc, receiver.asset.tnc, "b951289c1f74bbacd26390b2ff72a4f2a59bf42a78e75a3eca0dcaf0841b50f1", 'TNC', 2],
            "id": 1
        }),
        contentType: 'application/json',
        success: function(message) {
            if (message.result && message.result.error) {
                console.log('Error result for RPC interface sendertoreceiver: ', message.result);
                return false;
            } else if (message.error) {
                console.log('Error Response for RPC interface sendertoreceiver: ', message.error)
                return false;
            } else {
                console.log('Success to finish the transaction');
                return true;
            }
        },
        error: function(message) {
            console.log(message);
            return false;
        }
    });
}

return pub;
})();
