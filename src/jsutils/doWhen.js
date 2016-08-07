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
 *
 * @example
 *
 *      doWhen({
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
 */
export default function doWhen(options) {
    var promise = new Promise(function(resolve, reject){
        var
        opt = objectExtend({},
            {
                when:       function(){},
                exec:       function(){},
                interval:   100,
                attempts:   100,
                delayed:    0
            },
            options
        ),
        checkId         = null,
        startChecking   = function(){

            // Check condition now and if true, then resolve object
            if (opt.when() === true) {
                opt.exec();
                resolve();
                return;
            }

            // Start checking
            checkId = setInterval(function(){
                if (opt.attempts === 0) {
                    clearInterval(checkId);
                    reject();

                } else {
                    --opt.attempts;

                    if (opt.when() === true) {
                        opt.attempts = 0;
                        clearInterval(checkId);
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
    });

    return promise;
}
