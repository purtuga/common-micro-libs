import getGlobal    from "./getGlobal"
import Promise      from "./es6-promise"
import EventEmitter from "./EventEmitter"

//=======================================================================
const globalEvents = EventEmitter.create();

export const fetch = getGlobal().fetch || fakeFetch;

//---------------------------------------------------------------------------------------
// Code below taken from unfetch:
// https://github.com/developit/unfetch
// MIT License © Jason Miller
//
// Altered with:
//
//  -   Support for non-standard `onProgress`
//      So that we can create good upload widgets that report progress
//  -   `fakeFetch.on()` and `fakeFetch.once()`: listen for events on certain topics.
//      Ability to "Globally" intercept HTTP requests and do stuff.
//---------------------------------------------------------------------------------------

/**
 * Fetch data from a remote location. Wrapper around  XMLHttpRequest
 *
 * @param url
 * @param options
 * @param {String} [options.method=`GET`]
 * @param {Function} [options.onProgress]
 * @param {Object} [options.headers]
 * @param {String} [options.body]
 * @param {String} [options.credentials]
 *
 * @returns {Promise}
 *
 * @fires fetch#pre-fetch
 * @fires fetch#post-fetch
 *
 * @see http://devdocs.io/dom/windoworworkerglobalscope/fetch
 */
export function fakeFetch(url, options) {
    options = options || {};
    return new Promise( (resolve, reject) => {
        let request = new XMLHttpRequest();

        // Report progress?
        if (options.onProgress && request.upload && request.upload.addEventListener){
            request.upload.addEventListener('progress', options.onProgress, false);
        }

        request.open(options.method || 'get', url, true);

        for (let i in options.headers) {
            request.setRequestHeader(i, options.headers[i]);
        }

        request.withCredentials = options.credentials=='include';

        request.onload = () => {
            resolve(response());
        };

        request.onerror = (e) => {
            globalEvents.emit("post-fetch", { url, xhr: request });
            reject(e);
        };

        /**
         * fetch (http request) is about to be done
         *
         * @event fetch#pre-fetch
         * @type Object
         * @property {String} url
         * @property {Object} options
         */
        globalEvents.emit("pre-fetch", { url, xhr: request, init: options });

        request.send(options.body);

        function response() {
            let keys = [],
                all = [],
                headers = {},
                header;

            request.getAllResponseHeaders().replace(/^(.*?):\s*?([\s\S]*?)$/gm, (m, key, value) => {
                keys.push(key = key.toLowerCase());
                all.push([key, value]);
                header = headers[key];
                headers[key] = header ? `${header},${value}` : value;
            });

            /**
             * A fetch (http call) was completed.
             *
             * @event fetch#post-fetch
             * @type {Object}
             * @property {String} url
             * @property {XMLHttpRequest} xhr
             */
            globalEvents.emit("post-fetch", { url, xhr: request });

            return {
                ok: (request.status/100|0) == 2,		// 200-299
                status: request.status,
                statusText: request.statusText,
                url: request.responseURL,
                clone: response,
                text: () => Promise.resolve(request.responseText),
                json: () => Promise.resolve(request.responseText).then(JSON.parse),
                blob: () => Promise.resolve(new Blob([request.response])),
                headers: {
                    keys: () => keys,
                    entries: () => all,
                    get: n => headers[n.toLowerCase()],
                    has: n => n.toLowerCase() in headers
                }
            };
        }
    });
}

/**
 * Listen to events emitted by fetch
 *
 * @param {String} eventName
 * @param {Function} callback
 *
 * @return {EventEmitter~EventListener}
 */
fakeFetch.on = globalEvents.on.bind(globalEvents);

/**
 * Listen to events emitted by fetch, but only once
 *
 * @param {String} eventName
 * @param {Function} callback
 *
 * @return {EventEmitter~EventListener}
 */
fakeFetch.once = globalEvents.once.bind(globalEvents);
