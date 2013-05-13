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
(function($) {
    $.tinyTimer = function(options) {
        var tick, tt = this, elem = (tt.options = options).element, ref = new Date(options.from || options.to).getTime(), dir = !!options.from || -1, M = Math, doNothing = function() {};
        tt.interval = setInterval(tick = function() {
            if (!tt.paused) {
                var sec = M.max(M.round((Date.now() - ref) * dir / 1e3), 0), val = {
                    S: sec,
                    s: sec % 60,
                    M: M.floor(sec /= 60),
                    H: M.floor(sec /= 60),
                    D: M.floor(sec /= 24)
                };
                val.m = val.M % 60, val.h = val.H % 24, val.d = val.D, val.text = (options.format || "%-H{:}%0m:%0s").replace(/%(-?)(0?)([dhms])(\s*)(?:\{(.+?)\})?/gi, options.replacer || function(match, omit, zero, part, space, forms) {
                    var v = val[part];
                    return (forms = (forms || "").split("|"))[2] = forms[2] || (forms[1] = forms[1] || forms[0]), 
                    !v && omit ? "" : (v > 9 ? "" : zero) + v + space + forms[+(1 != v) + (1 != v && (2 > v % 10 || v % 10 > 4) || v > 10 && 20 > v)];
                }), elem ? $(elem).html(val.text) : elem = tt, (options.onTick || doNothing).call(elem, tt.val = val), 
                0 > dir && !sec && (clearInterval(tt.interval), (options.onEnd || doNothing).call(elem, val));
            }
        }, 1e3), tick(), tt.pause = tt.stop = function() {
            tt.paused = Date.now();
        }, tt.resume = function() {
            ref -= (tt.paused - Date.now()) * dir, tt.paused = 0;
        }, tt.start = function() {
            tt.paused = 0;
        }, tt.resetFrom = function(newDate) {
            ref = newDate;
        };
    }, $.fn.tinyTimer = function(options) {
        return this.each(function() {
            $(this).data("tinyTimer", new $.tinyTimer($.extend(options, {
                element: $(this)
            })));
        });
    };
})(jQuery);