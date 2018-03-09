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
    video_element.on(
        "timeupdate",
        function(event){
            console.log(this.currentTime, this.duration);
    });
}

return pub;
})();
