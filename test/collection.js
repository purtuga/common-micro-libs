require             = require('@std/esm')(module, { cjs: true, esm: 'js' });
const test          = require("tape");
const Collection    = require("../src/jsutils/Collection").default;

test("Collection", t => {
    const getCallback = () => {
        const cb = () => {
            cb.callCount++;
        };
        cb.callCount = 0;
        return cb;
    };

    t.equal(typeof Collection, "function", "is Defined");
    t.equal(typeof Collection.create, "function", "has .create() static method");

    // ARRAY LIKE
    t.test("Contains proxied Array Methods", st => {
        const data = Collection.create();

        t.ok(Array.isArray(data), "is instance array");

        // Has all methods
        Object.getOwnPropertyNames(Array.prototype).forEach(arrayMethod => {
            if (arrayMethod === "constructor" || typeof Array.prototype[arrayMethod] !== "function") {
                return;
            }
            st.equal(typeof data[arrayMethod], "function", `has ${ arrayMethod } instance method`);
        });

        st.end();
    });

    // LENGTH
    t.test("Length property returns Array length value", st => {
        let data = Collection.create();
        st.notOk(data.length, "has length 0 when initialized with no input");
        data.destroy();

        data = Collection.create(["one", "two"]);
        st.equal(data.length, 2, "has length is 2 when initialized with array(2)");

        data.push("tree");
        st.equal(data.length, 3, "has length 3 when item is pushed");

        data.pop();
        st.equal(data.length, 2, "has length 2 when item is pop'd");

        st.equal(data.length, data.size(), "size prop equals length prop");

        st.end();
    });

    // EVENTS
    t.test("Emits events", st => {
        let data    = Collection.create(["one", "two", "tree", "four", "five", "six", "seven"]);
        let cb      = getCallback();
        let count   = 0;

        data.on("change", cb);

        // Remove mutating methods
        ['pop', 'shift',].forEach((mutatingMethod, index) => {
            data[mutatingMethod]();
            count++;
            st.equal(cb.callCount, count, `triggers change on ${ mutatingMethod }()`);

        });

        // Add mutating methods
        ['push', 'unshift'].forEach((mutatingMethod, index) => {
            data[mutatingMethod](`test ${ index }`);
            count++
            st.equal(cb.callCount, count, `triggers change on ${ mutatingMethod }()`);
        });

        data.splice(0,0,"splice item");
        count++;
        st.equal(cb.callCount, count, "triggers change on splice()");

        st.end();
    });

    t.test("New collection are returned", st => {
        const data = Collection.create([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        let resp;

        resp = data.filter(item => item < 3);
        st.ok(Array.isArray(resp), ".filter() return array");
        st.equal(resp.length, 2, ".filter()'d array has 2 element");
        st.equal(typeof resp.on, "function", ".filter() returned Collection");

        resp.destroy();
        resp = data.concat([10, 11]);
        st.equal(typeof resp.on, "function", ".concat() returned Collection");
        st.equal(resp.length, 11, ".concat() array has 11 items");

        resp.destroy();
        resp = data.reverse();
        st.ok(resp === data, ".reverse() return original array (mutated)");

        st.end()
    });

    t.end();
});
