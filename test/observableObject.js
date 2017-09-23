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

    t.test("Emits Events", st => {
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
        st.plan(8);

        let obj = ObservableObject.create({
            firstName: "Paul",
            lastName: "Tavares"
        });

        let generateFullName = function() {
            generateFullName.count++;
            return `${ this.firstName } ${ this.lastName }`;
        };
        generateFullName.count = 0;

        ObservableObject.createComputed(obj, "fullName", generateFullName);

        st.equal(generateFullName.count, 0, "Value Generator does not run on create of computed");
        st.equal(obj.fullName, "Paul Tavares", "creates Computed value");
        st.equal(generateFullName.count, 1, "value generated called once");

        obj.firstName = "Paul1";
        delay()
            .then(() => {
                st.equal(obj.fullName, "Paul1 Tavares", "change to dependency prop updates Computed value");
                st.equal(generateFullName.count, 2, "Value generator called twice");

                obj.firstName = "john";
                obj.lastName = "smith";

                return delay();
            })
            .then(() => {
                st.equal(generateFullName.count, 2, "Value generated NOT called yet after dependency change");
                st.equal(obj.fullName, "john smith", "change to multiple depdencies props updates computed");
                st.equal(generateFullName.count, 3, "Value generator called three times");
            })
            .catch(e => console.log(e));
    });

    t.test("Computed Emits Events", st => {
        st.plan(8);

        let obj = ObservableObject.create({
            firstName: "Paul",
            lastName: "Tavares"
        });

        let generateFullName = function() {
            generateFullName.count++;
            return `${ this.firstName } ${ this.lastName }`;
        };
        generateFullName.count = 0;

        ObservableObject.createComputed(obj, "fullName", generateFullName);

        let fullNameChgListener = () => fullNameChgListener.count++;
        fullNameChgListener.count = 0;

        obj.on("fullName", fullNameChgListener);

        st.equal(fullNameChgListener.count, 0, "computed change event not yet triggered");

        obj.fullName;

        delay()
            .then(() => {
                st.equal(fullNameChgListener.count, 0, "computed changed event not triggered after valueGenerated 1st run");
                obj.firstName = "john";
                return delay();
            })
            .then(() => {
                st.equal(fullNameChgListener.count, 1, "Computed change Event fired");
                st.equal(generateFullName.count, 1, "Computed prop value generator not called after dependency change");

                st.equal(obj.fullName, "john Tavares", "New computed value generated");
                obj.fullName;
                st.equal(generateFullName.count, 2, "New computed value was cached on subsequent calls to getter");

                obj.lastName = "Smith";
                return delay();
            })
            .then(() => {
                st.equal(fullNameChgListener.count, 2, "Computed change Event fired on 2nd dependency change");
                st.equal(obj.fullName, "john Smith", "new Computed value return after 2nd dependency change");
            });
    });

    t.test("Computed properties with dependencies on other Computed", st => {

    });

    t.end();
});