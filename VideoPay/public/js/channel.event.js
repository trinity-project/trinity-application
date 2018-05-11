var ChannelEvent = (function() {

var event = {UpdateChannelFixedInfo: null};

function parse_arguments(args) {
    console.log(args);
    var result = {};
    var index = 0
    for(k in args){
        if (k > 2){
            result[index] = args[k]
            index += 1;
        }
    }

    return result;
}

function timer_hook(hook, interval) {
    var timer_id;
    var execute_times   = 0;
    var stop_timer_flag = false;
    var max_loop_times  = arguments[2];

    var args = parse_arguments(arguments);

    timer_id = setInterval(function() {
        try {
            stop_timer_flag = hook(args);
        } catch (e) {
            clearInterval(timer_id);
        }

        // cancel timer if timeout
        if (true == stop_timer_flag || (undefined != max_loop_times && execute_times >= max_loop_times)) {
            clearInterval(timer_id);
        }

        execute_times++;
    }, interval);

    return timer_id;
};


function getChannelFixedInfo() {
    var result = false;
    var ChNameElem = document.getElementById('StateChannelName');
    var ChDepositElem = document.getElementById('StateChannelDeposit');
    var login_href = document.getElementById('login_href');

    if (login_href || -1 === ChNameElem.innerText.indexOf('Invalid')) {
        console.log('found channel')
        return true;
    }

    $.ajax({
        url: "/channel/static",
        type: "GET",
        dataType: 'json',
        success: function(data) {
            console.log(data);
            if (data.name) {
                ChNameElem.innerText = "Channel：" + data.name;
            }
        },
        error: function(message) {
            console.log('Error Response to get channel static information. message: ', message);
        }
    });

    if (-1 === ChNameElem.innerText.indexOf('Invalid')) {
        return true;
    }

    return result;
}

function close_channel() {
     $.ajax({
        url: "/channel/close",
        type: "POST",
        dataType: 'json',
        success: function(message) {
            console.log('Successfully with payment. fee: ', fee)
        },
        error: function(message) {
            console.log('Error response with payment. fee: ', fee);
        }
    });
}

event.UpdateChannelFixedInfo = function(interval, retry){
    timer_hook(getChannelFixedInfo, interval, retry);
}

event.CloseChannel = function() {
     $('#CloseStateChannel').click(close_channel);
}

return event;
})();
