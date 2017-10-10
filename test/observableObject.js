require     = require("@std/esm")(module, { cjs: true, esm: "js" });
const test  = require("tape");
const {
    default:ObservableObject,
    setDependencyTracker,
    unsetDependencyTracker,
    stopDependeeNotifications }  = require("../src/jsutils/ObservableObject");
const delay             = ms => new Promise(resolve => setTimeout(resolve, ms || 2));

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
        st.equal(typeof model.assign, "function", "has .assign() method");
        st.equal(typeof model.setProp, "function", "has .setObservableProp() method");

        model.destroy();
        st.equal(model.isDestroyed, true, ".isDestroy is true");

        st.end();
    });

    t.test(".assign() method auto create watchable properties", st => {
        st.plan(7);

        const model = ObservableObject.create({name: "paul"});
        model.assign({ state: "NJ" }, { country: "USA" });

        st.equal(model.state, "NJ", "observable includes new properties");
        st.equal(model.country, "USA");

        const allValueGenerator = () => {
            allValueGenerator.count++;
            return Object.keys(model).reduce((all, key) => {
                if (key === "all") {
                    return all;
                }
                return all += model[key];
            }, "");
        };
        allValueGenerator.count = 0;

        const allValueChangeListener = () => allValueChangeListener.count++;
        allValueChangeListener.count = 0;

        ObservableObject.createComputed(model, "all", allValueGenerator);

        st.equal(/USA/.test(model.all), true, "Computed was created");
        st.equal(allValueGenerator.count, 1, "value generator called once");

        model.once("all", allValueChangeListener);
        model.country = "Portugal";

        delay()
            .then(() => {
                st.equal(allValueChangeListener.count, 1, "Change to a property created with assign emits events");
                st.equal(/Portugal/.test(model.all), true);
                st.equal(allValueGenerator.count, 2, "value generator called twice");
            });
    });

    t.test(".setObservableProp() method", st => {
        st.plan(3);

        const obj = ObservableObject.create();
        let setReturnValue = obj.setProp("name", "paul");

        st.equal(setReturnValue, "paul", "setObservableProp() return value that was given on input");
        obj.once("name", () => {
            st.pass("prop was created as watchable");
            st.equal(obj.name, "john", "new value was set");
        });
        obj.name = "john";
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
        st.plan(11);

        let obj = ObservableObject.create({
            firstName: "Paul",
            lastName: "Tavares"
        });

        let generateFullName = function() {
            generateFullName.count++;
            return `${ this.firstName } ${ this.lastName }`;
        };
        generateFullName.count = 0;

        const fullNameComputedProp = ObservableObject.createComputed(obj, "fullName", generateFullName);

        st.equal(typeof fullNameComputedProp.destroy, "function", "Computed returns object with .destroy() method");
        st.equal(generateFullName.count, 0, "Value Generator does not run on create of computed");
        st.equal(obj.fullName, "Paul Tavares", "creates Computed value");
        st.equal(generateFullName.count, 1, "value generated called once");

        obj.firstName = "Paul1";
        st.equal(obj.fullName, "Paul1 Tavares", "change to dependency prop updates Computed value imediately (no delay)");

        delay()
            .then(() => {
                st.equal(generateFullName.count, 2, "Value generator called twice");

                obj.firstName = "john";
                obj.lastName = "smith";

                return delay();
            })
            .then(() => {
                st.equal(generateFullName.count, 2, "Value generated NOT called yet after dependency change");
                st.equal(obj.fullName, "john smith", "change to multiple depdencies props updates computed");
                st.equal(generateFullName.count, 3, "Value generator called three times");

                fullNameComputedProp.destroy();
                obj.firstName = "Tony";

                return delay();
            })
            .then(() => {
                st.equal(obj.fullName, "john smith", "Computed preserves last value after computed.destroy()");
                st.equal(generateFullName.count, 3, "Computed value generator is NOT called after computed.destroy()");
            })
            .catch(e => console.log(e));
    });

    t.test("Computed properties from different observable objects", st => {
        st.plan(3);

        let objFirst = ObservableObject.create({
            firstName: "Paul"
        });

        let objLast = ObservableObject.create({
            lastName: "Tavares"
        });

        let objFull = ObservableObject.create();

        let generateFullName = function() {
            generateFullName.count++;
            return `${ objFirst.firstName } ${ objLast.lastName }`;
        };
        generateFullName.count = 0;
        ObservableObject.createComputed(objFull, "fullName", generateFullName);

        let fullNameChgListener = () => fullNameChgListener.count++;
        fullNameChgListener.count = 0;

        //-----------------------------------------
        st.equal(objFull.fullName, "Paul Tavares", "Value generated returned expected value");

        objFirst.firstName = "John";
        delay()
            .then(() => {
                st.equal(objFull.fullName, "John Tavares", "Changes to dependencies triggers new computed value");

                objFull.on("fullName", fullNameChgListener);
                objLast.lastName = "Tavares 1";
                return delay();
            })
            .then(() => {
                st.equal(fullNameChgListener.count, 1, "Triggers event when dependency changes");
            });
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
        st.plan(6);

        let obj = ObservableObject.create({
            firstName: "Paul",
            lastName: "Tavares",
            location: "NJ"
        });

        let generateFullName = function() {
            generateFullName.count++;
            return `${ this.firstName } ${ this.lastName }`;
        };
        generateFullName.count = 0;

        ObservableObject.createComputed(obj, "fullName", generateFullName);

        let generateNameAndLocation = function() {
            generateNameAndLocation.count++;
            return `${ this.fullName } (${ this.location })`;
        };
        generateNameAndLocation.count = 0;

        ObservableObject.createComputed(obj, "nameAndLocation", generateNameAndLocation);

        let nameAndLocationChgListener = () => nameAndLocationChgListener.count++;
        nameAndLocationChgListener.count = 0;

        //------------------------------------------------------------
        st.equal(obj.nameAndLocation, "Paul Tavares (NJ)", "Computed is generated");

        obj.firstName = "John";
        delay()
            .then(() => {
                st.equal(obj.nameAndLocation, "John Tavares (NJ)", "Computed has change from computed dependency");

                obj.location = "NY";
                return delay();
            })
            .then(() => {
                st.equal(obj.nameAndLocation, "John Tavares (NY)", "Computed reflects changes dependency change");

                obj.on("nameAndLocation", nameAndLocationChgListener);
                obj.location = "NJ";
                return delay();
            })
            .then(() => {
                st.equal(nameAndLocationChgListener.count, 1, "Change of direct dependency trigger event");

                obj.firstName = "Paul";
                return delay();
            })
            .then(() => {
                st.equal(nameAndLocationChgListener.count, 2, "Change of computed dependency trigger event");
                st.equal(obj.nameAndLocation, "Paul Tavares (NJ)", "Computed has expected value");
            });
    });

    t.test("Track dependency externally", st => {
        st.plan(4);

        const dependeeNotifier = () => {
            dependeeNotifier.count++;
        };
        dependeeNotifier.count = 0;

        const obj1 = ObservableObject.create({ first: "paul" });
        const obj2 = ObservableObject.create({ last: "tavares" });

        setDependencyTracker(dependeeNotifier);
        obj1.first;
        obj2.last;
        unsetDependencyTracker(dependeeNotifier);

        obj1.first = "paul1";
        delay()
            .then(() => {
                st.equal(dependeeNotifier.count, 1, "Dependee Notifier callback executed on obj1 change");
                obj2.last = "tavares1";
                return delay();
            })
            .then(() => {
                st.equal(dependeeNotifier.count, 2, "Dependee Notifier callback executed on obj2 change");
                dependeeNotifier.count = 0;
                obj1.first = "paul";
                obj2.last = "tavares";
                return delay();
            })
            .then(() => {
                st.equal(dependeeNotifier.count, 1, "Dependee notifier called only once per/event loop");
                stopDependeeNotifications(dependeeNotifier);
                dependeeNotifier.count = 0;
                obj1.first = "paul";
                return delay();
            })
            .then(() => {
                st.equal(dependeeNotifier.count, 0, "Stop calling dependee notifier");
            });
    });

    t.end();
});