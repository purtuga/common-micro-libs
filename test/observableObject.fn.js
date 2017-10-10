require     = require("@std/esm")(module, { cjs: true, esm: "js" });
const test  = require("tape");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms || 2));
const {
    makeObservable,
    watchObservableProp,
    watchObservablePropOnce,
    createComputed  } = require("../src/jsutils/ObservableObject");

test("makeObservable()", t => {
    t.plan(10);

    let changeNotify = () => {changeNotify.count = changeNotify.count || 0;  changeNotify.count++};
    let obj = { firstName: "paul" };
    let computed;

    makeObservable(obj);

    let ev = watchObservableProp(obj, "firstName", changeNotify);

    t.equal(obj.on, undefined, "No .on() method");
    t.equal(obj.emit, undefined, "No .on() method");
    t.equal(obj.once, undefined, "No .on() method");
    t.equal(obj.destroy, undefined, "No .destroy() method");

    obj.firstName = "PAUL";
    delay()
        .then(() => {
            t.equal(changeNotify.count, 1, "Change on propName received");

            ev.off();
            obj.firstName = "paul";
            return delay();
        })
        .then(() => {
            t.equal(changeNotify.count, 1, "Change event was turned off");

            changeNotify.count = 0;
            watchObservablePropOnce(obj, "firstName", changeNotify);
            obj.firstName = "PAUL";
            return delay();
        })
        .then(() => {
            t.equal(changeNotify.count, 1, "makeObservablePropOnce triggered notifier");

            obj.firstName = "paul";
            return delay();
        })
        .then(() => {
            t.equal(changeNotify.count, 1, "change notifier triggered only once");

            makeObservable(obj, "lastName");
            obj.lastName = "tavares";
            computed = createComputed(obj, "fullName", () => `${ obj.firstName } ${ obj.lastName }`);
            t.equal(obj.fullName, "paul tavares", "computed created");

            obj.lastName = "TAVARES";
            t.equal(obj.fullName, "paul TAVARES", "Updated computed provided");
        })
        .catch(console.error.bind(console));
});
