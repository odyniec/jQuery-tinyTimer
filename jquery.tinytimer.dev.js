/*!
 * tinyTimer jQuery plugin
 * version 0.1.4
 *
 * Copyright (c) 2013 Michal Wojciechowski (odyniec.net)
 *
 * Dual licensed under the MIT (http://opensource.org/licenses/MIT)
 * and GPL (http://opensource.org/licenses/GPL-2.0) licenses.
 *
 */

(function ($) {

$.tinyTimer = function (options) {
    var
        /* This instance of tinyTimer */
        tt = this,

        /* The jQuery object or DOM element to display the timer */
        elem = (tt.options = options).element,

        /* Reference time (what we're counting from or counting to) */
        ref = (new Date(options.from || options.to)).getTime(),
        
        /* Direction (1 when counting up, -1 when counting down) */
        dir = !!options.from||-1,

        /* The function that will be called every second */
        tick,

        /* "Math" is too long to type */
        M = Math,

        /* A function that does nothing, to be used as the default callback */
        doNothing = function () {};

    tt.interval = setInterval(tick = function () {
        /* Don't do anything if the timer is paused */
        if (tt.paused) return;

        /* Calculate the number of seconds from/to the reference time */
        var sec = M.max(M.round((Date.now() - ref) * dir / 1000), 0);

        var val = {
            S: sec,                     /* Total number of seconds */
            s: sec % 60,                /* Seconds */
            M: M.floor(sec /= 60),      /* Total minutes */
            H: M.floor(sec /= 60),      /* Total hours */
            D: M.floor(sec /= 24)       /* Total days */
        };
        val.m = val.M % 60;             /* Minutes */
        val.h = val.H % 24;             /* Hours */
        val.d = val.D;                  /* Days */

        /* Format the timer */
        val.text = (options.format || '%-H{:}%0m:%0s').replace(
            /%(-?)(0?)([dhms])(\s*)(?:\{(.+?)\})?/ig,
            options.replacer || function (match, omit, zero, part, space, forms) {
                /* The value of the selected part */
                var v = val[part];

                /*
                 * 'day'      -> [ 'day', 'day', 'day' ]
                 * 'day|days' -> [ 'day', 'days', 'days' ]
                 */
                (forms = (forms||'').split('|'))[2] =
                    forms[2] || (forms[1] = forms[1] || forms[0]);

                /* 
                 * Return the output text, or an empty string if the value is
                 * zero and isn't supposed to be shown
                 */
                return !v && omit ? '' :
                    /*
                     * Initialize the output text with the value (and optionally
                     * a leading zero)
                     */
                    (v > 9 ? '' : zero) + v + space +
                    
                    /* Add the appropriate form */
                    forms[+(v != 1) +
                        (v != 1 && (v%10 < 2 || v%10 > 4) ||
                            (v > 10 && v < 20))];
            });

        /* 
         * If we have an element, put the formatted text inside it
         * (otherwise, set "elem" to this instance of tinyTimer, so that it gets
         * passed to callbacks)
         */
        elem ? $(elem).html(val.text) : elem = tt;

        /* Invoke the onTick callback (if defined) */
        (options.onTick || doNothing).call(elem, tt.val = val);

        /* Did we just count down to zero? */
        if (dir < 0 && !sec) {
            /* No more ticking */
            clearInterval(tt.interval);
            /* Invoke the onEnd callback (if defined) */
            (options.onEnd || doNothing).call(elem, val);
        }
    }, 1000);

    /* Do the first tick */
    tick();

    /* Instance methods */

    tt.pause = tt.stop = function () {
        tt.paused = Date.now();
    };

    /* reset the timer to another date while it is running */
    tt.resetFrom = function (newDate) {
      ref = newDate;
    }

    tt.resume = function () {
        ref -= (tt.paused - Date.now()) * dir;
        tt.paused = 0;
    };

    tt.start = function () {
        tt.paused = 0;
    };
};

$.fn.tinyTimer = function (options) {
    return this.each(function () {
        $(this).data('tinyTimer',
            new $.tinyTimer($.extend(options, { element: $(this) })));
    });
};

})(jQuery);
