/*!
 * tinyTimer jQuery plugin
 * version 0.1.1
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
                var sec = M.round((Date.now() - ref) * dir / 1e3), cur = {
                    S: sec,
                    s: sec % 60,
                    M: M.floor(sec /= 60),
                    H: M.floor(sec /= 60),
                    D: M.floor(sec /= 24)
                };
                cur.m = cur.M % 60, cur.h = cur.H % 24, cur.d = cur.D, cur.text = (options.format || "%-H{:}%0m:%0s").replace(/%(-?)(0?)([dhms])(\s*)(?:\{(.+?)\})?/gi, options.replacer || function(match, omit, zero, part, space, forms) {
                    var v = cur[part], out = (v > 9 ? "" : zero) + v + space;
                    return forms && ((forms = forms.split("|"))[2] = forms[2] || (forms[1] = forms[1] || forms[0]), 
                    out += forms[+(1 != v) + (1 != v && (2 > v % 10 || v % 10 > 4) || v > 10 && 20 > v)]), 
                    !v && omit ? "" : out;
                }), elem ? $(elem).html(cur.text) : elem = tt, (options.onTick || doNothing).call(elem, tt.cur = cur), 
                0 > dir && 0 >= sec && (clearInterval(tt.interval), (options.onEnd || doNothing).call(elem, cur));
            }
        }, 1e3), tick(), tt.pause = tt.stop = function() {
            tt.paused = Date.now();
        }, tt.resume = function() {
            ref -= (tt.paused - Date.now()) * dir, tt.paused = 0;
        }, tt.start = function() {
            tt.paused = 0;
        };
    }, $.fn.tinyTimer = function(options) {
        return this.each(function() {
            $(this).data("tinyTimer", new $.tinyTimer($.extend(options, {
                element: $(this)
            })));
        });
    };
})(jQuery);