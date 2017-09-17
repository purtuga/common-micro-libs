require                 = require('@std/esm')(module, { cjs: true, esm: 'js' });
const test              = require("tape");
const ObservableObject  = require("../src/jsutils/ObservableObject").default;

test("ObservableObject", t => {
    t.equal(typeof ObservableObject, "function", "is defined");
    t.equal(typeof ObservableObject.create, "function", "has .create() method");

    t.test("Instance Methods", st => {
        const model = ObservableObject.create({name: "paul"});

        st.equal(model.name, "paul", "is instantiated with provided input");

        st.equal(typeof model.emit, "function", "has .emit() method");
        st.equal(typeof model.on, "function", "has .on() method");
        st.equal(typeof model.once, "function", "has .once() method");
        st.equal(typeof model.destroy, "function", "has .destroy() method");

        model.destroy();
        st.equal(model.isDestroyed, true, ".isDestroy is true");

        st.end();
    });

    t.test("Events", st => {
        st.plan(2);

        const model = ObservableObject.create({name: "paul"});

        model.once("name", () => {
            st.ok(true, "change event triggered");
        });
        st.equal(model.name, "paul", "has original value after watch");
        model.name = "paul 1";
    });

    t.end();
});