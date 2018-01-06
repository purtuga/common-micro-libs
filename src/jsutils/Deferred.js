import Promise from "./es6-promise"

export const Deferred = Object.create({
    /**
     * Creates a `Deferred` object which is essentially an un-resolved promise
     * that, in addition to the normal Promise interface, also exposes a `resolve`
     * and `reject` method - thus allowing control over the promise from the "outside".
     *
     * @return {DeferredPromise}
     *
     * @example
     *
     * let dfd = Deferred.create();
     * addToQueue(dfd);
     * return dfd.promise;
     *
     * //... later
     * queue[0].resolve({msg: "done"});
     */
    create() {
        let resolvedDeferred;
        let rejectDeferred;
        /**
         * A Deferred object. A promise that exposes 3 additional attributes
         *
         * @typedef {Promise} DeferredPromise
         *
         * @property {Function} then
         * @property {Promise} promise
         * @property {Function} resolve
         * @property {Function} reject
         */
        let deferred = new Promise((resolve, reject) => {
            resolvedDeferred    = resolve;
            rejectDeferred      = reject;
        });

        deferred.promise    = deferred;
        deferred.resolve    = resolvedDeferred;
        deferred.reject     = rejectDeferred;

        return deferred;
    }
});
export default Deferred;