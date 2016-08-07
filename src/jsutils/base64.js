/*
    Code below was taken from:
    https://github.com/dankogai/js-base64
    and stripped down to only the encode/decode methods.

    Copyright (c) 2014, Dan Kogai All rights reserved.
    Licensed under the BSD 3-Clause License.
        http://opensource.org/licenses/BSD-3-Clause
*/

/* jshint ignore:start */

var global = window;
var fromCharCode = String.fromCharCode;

// encoder stuff
var cb_utob = function(c) {
    if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 0x80 ? c
            : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                            + fromCharCode(0x80 | (cc & 0x3f)))
            : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
               + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
               + fromCharCode(0x80 | ( cc         & 0x3f)));
    } else {
        var cc = 0x10000
            + (c.charCodeAt(0) - 0xD800) * 0x400
            + (c.charCodeAt(1) - 0xDC00);
        return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                + fromCharCode(0x80 | ( cc         & 0x3f)));
    }
};

var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;

var utob = function(u) {
    return u.replace(re_utob, cb_utob);
};

var btoa = function(b) {
    return global.btoa(b);
};

var _encode = function(u) {
    return btoa(utob(u));
};

var encode = function(u, urisafe) {
    return !urisafe
        ? _encode(String(u))
        : _encode(String(u)).replace(/[+\/]/g, function(m0) {
            return m0 == '+' ? '-' : '_';
        }).replace(/=/g, '');
};

// decoder stuff
var re_btou = new RegExp([
    '[\xC0-\xDF][\x80-\xBF]',
    '[\xE0-\xEF][\x80-\xBF]{2}',
    '[\xF0-\xF7][\x80-\xBF]{3}'
].join('|'), 'g');

var cb_btou = function(cccc) {
    switch(cccc.length) {
    case 4:
        var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
            |    ((0x3f & cccc.charCodeAt(1)) << 12)
            |    ((0x3f & cccc.charCodeAt(2)) <<  6)
            |     (0x3f & cccc.charCodeAt(3)),
        offset = cp - 0x10000;
        return (fromCharCode((offset  >>> 10) + 0xD800)
                + fromCharCode((offset & 0x3FF) + 0xDC00));
    case 3:
        return fromCharCode(
            ((0x0f & cccc.charCodeAt(0)) << 12)
                | ((0x3f & cccc.charCodeAt(1)) << 6)
                |  (0x3f & cccc.charCodeAt(2))
        );
    default:
        return  fromCharCode(
            ((0x1f & cccc.charCodeAt(0)) << 6)
                |  (0x3f & cccc.charCodeAt(1))
        );
    }
};


var btou = function(b) {
    return b.replace(re_btou, cb_btou);
};

var atob = function(a) {
    return global.atob(a);
};

var _decode = function(a) {
    return btou(atob(a));
};

var decode = function(a) {
    return _decode(String(a).replace(/[-_]/g, function(m0) {
        return m0 == '-' ? '+' : '/';
    }).replace(/[^A-Za-z0-9\+\/]/g, ''));
};

var
/**
 * Base64 helper utilities
 *
 * @namespace base64
 */
base64 = /** @lends base64 */{
    /**
     * Encodes a String to Base64 using btoa, but also ensure that if the string
     * has non-Latin values, that those are properly handled (converted to utf-8).
     *
     * @param {String} stringValue
     *
     * @return {String}
     */
    encode: encode,

    /**
     * Encodes a String to Base64 using btoa, but also ensure that if the string
     * has non-Latin values, that those are properly handled (converted to utf-8).
     *
     * @param {String} stringValue
     *
     * @return {String}
     */
    decode: decode,

    /**
     * reference to global `btoa` method
     */
    btoa: btoa,

    /**
     * Reference to global `atob` method
     */
    atob: atob
};

export default base64;

/* jshint ignore:end */

