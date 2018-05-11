module.exports = (function() {
    "use strict";
    const WebSocketClient = require('websocket').client;
    var WebSocketConnection = require('websocket').connection;
    const websocket_url = require("../public/js/config.js").websocketURL;
    const trinityApi = require("./trinity");

    var ws_client = new WebSocketClient();

    function ws_receive(message, connection) {
        var msg = JSON.parse(message);
        console.log("Received message type: '" + msg.MessageType + "'");
        if ('NodeList' === msg.MessageType) {
            ;
        } else if ("Founder" === msg.MessageType){
            trinityApi.channel.founderSign(msg, connection);
        } else if(type == "FounderSign"){
            trinityApi.channel.rawTransaction(msg);
        }
    }

    var ws_service = {
        version: '0.0.1',
        connect: function() {
            ws_client.connect(websocket_url);
        },

        receive: ws_receive,
        send: function(message){
            console.log('start to send message, ', message);
            if (!ws_client) {
                console.log('No client is connected to the server. ');
                return false;
            }

            var connection = new WebSocketConnection(ws_client.socket, [], ws_client.protocol, true, ws_client.config);
            connection.send(JSON.stringify(message));

            console.log('Send ' + message.MessageType + ' successfully');

            return true;
        }
    };

    ws_client.on('connectFailed', function(error) {
        console.log('connectFailed: ' + error.toString());
    });

    ws_client.on('connect', function(connection) {
        connection.on('error', function(error) {
            console.log("Connection Error: " + error.toString());
        });

        connection.on('close', function() {
            console.log('Websocket Connection was closed');
        });

        connection.on('message', function(message) {
            ws_receive(message.utf8Data, connection);
        });
    });

    return ws_service;
})();