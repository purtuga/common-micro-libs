/**
 * Checks the HTTP `Response` Object of a `fetch` to see if there was an HTTP error.
 *
 * @param {Response} response
 *
 * @returns {Response|Promise.reject}
 *  IN case of a Promise.reject, the Error provided will have a property
 *  called `response` that holds the `Response` instance
 */
export function fetchCheckForHttpErrors(response) {
    // If server returned an error code, then reject promise
    if (response.ok) {
        return response;
    }

    var error = new Error(response.statusText);
    error.response = response;
    throw error;
}
export default fetchCheckForHttpErrors;