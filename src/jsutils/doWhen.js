import Promise      from "./es6-promise"
import objectExtend from "./objectExtend"

/**
 * Delays the execution of a function until an expression
 * returns true. The expression is checked every 100 milliseconds
 * for as many tries as defined in in the attempts option
 *
 * @param {Object} options
 *
 * @param {Function} options.when
 *  Function to execute on every interval. Must return true (boolean) in order for
 *  options.do to be executed.
 *
 * @param {Function} [options.exec]
 *  Function to be executed once options.when() returns true.
 *
 * @param {Number} [options.interval=100]
 *  How long to wait in-between tries.
 *
 * @param {Number} [options.attempts=100]
 *  How many tries to use before its considered a failure.
 *
 * @param {Number} [options.delayed=0]
 *  Number of miliseconds to wait before execution is started. Default is imediately.
 *
 * @return {Promise}
 *  The returned promise will have one additional property - a method called `abort()`
 *  which can be called to cancel the execution if not already completed. Calling
 *  `abort` will cause the Promise to be `reject`ed if it has not yet been resolved
 *
 * @example
 *
 *      var future = doWhen({
 *          when: function(){
 *              return false;
 *          },
 *          exec: function(){
 *              alert("never called given false response on when param!");
 *          }
 *      })
 *      .catch(function(){
 *          alert('ALERT: FAILED CONDITION');
 *      })
 *      .then(function(){
 *          alert("resolved.");
 *      });
 *
 *      // later...
 *      future.abort();
 *
 */
export function doWhen(options) {
    let abort;
    let promise = new Promise(function(resolve, reject){
        let opt = objectExtend({},
            {
                when:       function(){},
                exec:       function(){},
                interval:   100,
                attempts:   100,
                delayed:    0
            },
            options
        );
        let checkId         = null;
        let stopChecking    = function(){
            if (checkId) {
                clearInterval(checkId);
                checkId = null;
            }
            opt.attempts = 0;
        };
        let startChecking   = function(){
            // Check condition now and if true, then resolve object
            if (opt.when() === true) {
                opt.exec();
                resolve();
                return;
            }

            // Start checking
            checkId = setInterval(function(){
                if (opt.attempts === 0) {
                    stopChecking();
                    reject(new Error("Timeout"));

                } else {
                    --opt.attempts;

                    if (opt.when() === true) {
                        stopChecking();
                        opt.exec();
                        resolve();
                    }
                }
            }, opt.interval);
        };

        if (opt.delayed > 0) {
            setTimeout(startChecking, Number(opt.delayed));

        } else {
            startChecking();
        }

        abort = function(){
            if (checkId) {
                stopChecking();
                reject(new Error("Aborted"));
            }
        };
    });

    promise.abort = abort;

    return promise;
}
export default doWhen;