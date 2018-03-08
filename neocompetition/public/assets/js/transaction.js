/* exported transaction */
var transaction = (function() {

'use strict';

var pub = {};
const provider_address = "AazWg8QK6SmVFUygXJPv2Lb6KB9sW7zAf2"; // hardcode this address for demo

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

// send transaction to the service provider
pub.transfer = function(asset, amount) {
    var sender = user.get('demo_user');
    var receiver = user.get('demo_provider');
    $.ajax({
        url: "http://localhost:20552", // Neo API
        type: "POST",
        data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "sendertoreceiver",
            "params": [sender.asset.tnc, receiver.asset.tnc, sender.channel_name, 'TNC', amount],
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
            alert("error");
        }
    });
}

return pub;
})();
