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
        });

		// Fix: Placeholder polyfill.
        /*$('form').placeholder();

		// Prioritize "important" elements on medium.
        skel.on('+medium -medium', function() {
            $.prioritize(
                '.important\\28 medium\\29',
                skel.breakpoint('medium').active
            );
        });*/

		// Items.
        $('.item').each(function() {
        });

        $('video').each(function () {
            // here we need to count the total time for statistics.
            console.log('here');
            $(this).on(
                "timeupdate",
                function(event){
                    console.log(this.currentTime, this.duration);
                }
            )
        });
        
        user.register_address('demo_user');
	    user.register_address('demo_provider');
        channel.register('demo_provider', 10);
        //user.transfer(null, 10);
    });
})(jQuery);

