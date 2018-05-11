(function($) {
	$(function() {
        $('video').each(function () {
            // here we need to count the total time for statistics.
            VideoEvent.on($(this));
        });

        ChannelEvent.CloseChannel();
    });
})(jQuery);

