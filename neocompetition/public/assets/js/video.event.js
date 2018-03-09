/* exported VideoEvent */
var VideoEvent = (function() {

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

pub.on = function(video_element) {
    var watch_time = 0;

    video_element.on(
        "timeupdate",
        function(event){
            watch_time = this.currentTime;
            //console.log(this.currentTime, this.duration);
            console.log('watch time: ', time_interval);
    });

    video_element.on(
        "pause",  // simulate stop or close event in order to finish payment.
        function(event){
            var fee = Math.ceil(100*watch_time/60) / 100;
            // finish the payment
            user.transfer(null, fee);
    )
}

return pub;
})();
