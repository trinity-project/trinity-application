module.exports = (function() {

var timer = {run: null};

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

timer.run = function(hook, interval) {
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

return timer;
})();
