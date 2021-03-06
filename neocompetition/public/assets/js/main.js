/*
	NEO Competition base on free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

(function($) {
	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 360px)'
	});

	$(function() {
		var	$window = $(window),
        $body = $('body');
        $body.addClass('is-loading');

        $window.on('load', function() {
            window.setTimeout(function() {
                $body.removeClass('is-loading');
            }, 100);

            // Welcome information
            user.action();
        });

		// Items.
        $('.item').each(function() {
        });

        $('video').each(function () {
            // here we need to count the total time for statistics.
            VideoEvent.on($(this));
        });
        
        user.register_address('demo_user');
        user.register_address('demo_provider');

	window.setTimeout(function() {
            channel.register('demo_provider', 10);
        }, 2000);
        
    });
})(jQuery);

