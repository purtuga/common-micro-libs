require         = require('@std/esm')(module, { cjs: true, esm: 'js' });
const test      = require("tape");
const Compose   = require("../src/jsutils/Compose").default;
const delay     = ms => new Promise(resolve => setTimeout(resolve, ms || 0));
const consoleLog    = console.log.bind(console)

test("Compose", t => {
    t.test("Static Methods", st => {
        ["create", "extend", "isInstanceOf", "getDestroyCallback"].forEach(method => st.ok(Compose[method], `has ${ method }()`));
        st.end();
    });


    t.test("Instance Methods", st => {
        const inst = Compose.create();
        ["init", "getFactory", "destroy", "onDestroy"].forEach(method => st.ok(inst[method], `has ${ method }`));
        st.end();
    });

    t.test(".extend(): returns new Factory from multiple mixins", st => {
        const Factory = Compose.extend({
            getValue: function(){
                return "value1";
            },
            init: function(){
                this.staticValue = "value2";
            }
        });
        const Factory2 = Compose.extend({
            init: function(){
                this.initText = "factory2";
            },
            factory2: function(){
                return "factory2";
            }
        });
        const Factory3 = Compose.extend(
            Factory,
            Factory2,
            {
                init: function(){
                    this.initText = "factory3";
                },
                factory3: function(){
                    return "factory3";
                }
            }
        );
        const inst = Factory3.create();

        st.ok(inst.factory2, "Has method from Factory2");
        st.ok(inst.factory3, "Has method from Factory 3");
        st.equal(inst.initText, "factory3", "Called .init() of last object given on input");

        st.equal(inst.getFactory(), Factory3, "getFactory() returns expected Constructor");

        st.end();
    });

    t.test(".create()", st => {
        const init = () => this.staticValue = "value2" && init.count++;
        const Factory = Compose.extend({
            init,
            getValue: function(){
                return "value1";
            }
        });
        init.count = 0;

        const inst = Factory.create();

        st.equal(init.count, 1, "init was called");
        st.equal(inst.getValue(), "value1", "has getValue() method");

        t.end();
    });

    t.test(".destroy() calls callbacks async", st => {
        st.plan(3);

        const inst   = Compose.extend({ init() {} }).create();
        const spy1   = () => spy1.count++;

        spy1.count = 0;
        inst.onDestroy(spy1);

        inst.destroy();
        delay(1)
            .then(() => {
                st.equal(spy1.count, 1, "Destroy executes callbacks");
                st.equal(inst.isDestroyed, true, "inst .isDestroyed is set");
                inst.destroy();
                return delay(1);
            })
            .then(() => {
                st.equal(spy1.count, 1, "destroy callbacks only called once");
            })
            .catch(consoleLog);

    });

    t.test(".destroy() calls callbacks sync", st => {
        const inst   = Compose.extend({ init() {} }).create();
        const spy1   = () => spy1.count++;

        spy1.count = 0;
        inst.onDestroy(spy1);

        inst.destroy(true);
        st.equal(spy1.count, 1, "Destroy executes callbacks");
        st.equal(inst.isDestroyed, true, "inst .isDestroyed is set");

        inst.destroy(true);
        st.equal(spy1.count, 1, "destroy callbacks only called once");

        st.end();
    });
});
