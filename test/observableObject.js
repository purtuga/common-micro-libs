require                 = require('@std/esm')(module, { cjs: true, esm: 'js' });
const test              = require("tape");
const ObservableObject  = require("../src/jsutils/ObservableObject").default;
const delay             = (ms) => new Promise(resolve => setTimeout(resolve, ms || 2));

test("ObservableObject", t => {
    t.equal(typeof ObservableObject, "function", "is defined");
    t.equal(typeof ObservableObject.create, "function", "has .create() method");
    t.equal(typeof ObservableObject.mixin, "function", "has .mixin() method");
    t.equal(typeof ObservableObject.createComputed, "function", "has .createComputed() method");

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
        st.plan(3);

        const model = ObservableObject.create({name: "paul"});

        model.once("name", () => {
            st.ok(true, "change event triggered");
        });

        st.equal(model.name, "paul", "has original value after calling .on()");
        model.name = "paul 1";

        const changeCallback = () => changeCallback.count++;
        changeCallback.count = 0;

        model.on("name", changeCallback);
        [1, 2, 3].forEach(n => model.name = `paul-${n}`);

        setTimeout(() => {
            st.equal(changeCallback.count, 1, "Callbacks are executed only once per event loop");
        }, 40);
    });

    t.test("Supports existing getters and setters", st => {
        st.plan(4);

        let obj = ObservableObject.create();
        let value = "paul";
        let getter = () => {
            getter.count++;
            return value;
        };
        let setter = (val) => {
            setter.count++;
            return value = val;
        };

        getter.count = 0;
        setter.count = 0;

        Object.defineProperty(obj, "name", {
            configurable: true,
            get: getter,
            set: setter
        });

        obj.once("name", () => {
            st.equal(setter.count, 1, "Original Setter is called");
        });

        st.equal(getter.count, 0, "getter has not been called");
        st.equal(obj.name, "paul", "getter return original value");
        st.equal(getter.count, 1, "Original Getter is called");

        obj.name = "paul1";
    });

    t.test("Computed properties", st => {
        st.plan(3);

        let obj = ObservableObject.create({
            firstName: "Paul",
            lastName: "Tavares"
        });

        ObservableObject.createComputed(obj, "fullName", function() {
            return `${ this.firstName } ${ this.lastName }`;
        });

        st.equal(obj.fullName, "Paul Tavares", "creates Computed value");

        obj.firstName = "Paul1";
        delay()
            .then(() => {
                st.equal(obj.fullName, "Paul1 Tavares", "change to dependency prop updates Computed value")

                obj.firstName = "john";
                obj.lastName = "smith";

                return delay();
            })
            .then(() => {
                st.equal(obj.fullName, "john smith", "change to multiple depdencies propse updates computed");
            })
            .catch(e => console.log(e));
    });


    t.end();
});