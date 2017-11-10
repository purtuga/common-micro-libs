require             = require("@std/esm")(module, { cjs: true, esm: "js" });
const test          = require("tape");
const EventEmitter  = require("../src/jsutils/EventEmitter").default;

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms || 2));

test("EventEmitter", t => {
    t.equal(typeof EventEmitter.mixin, "function", "has .mixin() static method");

    const events        = EventEmitter.create();
    const listener1     = () => {listener1.count = listener1.count || 0;  listener1.count++};
    const listener2     = () => {listener2.count = listener2.count || 0;  listener2.count++};
    const allListener   = () => {allListener.count = allListener.count || 0;  allListener.count++};

    let ev1, ev2, evAll;

    [
        "on",
        "off",
        "emit",
        "once",
        "pipe",
        "hasListeners"
    ].forEach(method => t.ok(events[method], `Instance has ${ method }`));

    t.test("on() and emit()", st => {
        ev1 = events.on("ev1", listener1);
        ev2 = events.on("ev2", listener2);

        st.equal(typeof ev1.off, "function", "EventListener response has off() method");

        events.emit("ev1");
        st.equal(listener1.count, 1, "Listener called");

        const evMultiples = events.on("ev-1 ev-2", allListener);
        st.equal(typeof evMultiples.listeners, "object", "EventListener response has listeners Object");
        st.equal(typeof evMultiples.listeners["ev-1"], "object", "EventListener listeners Object has list each EventListener");

        events.emit("ev-1");
        st.equal(allListener.count, 1);
        events.emit("ev-2");
        st.equal(allListener.count, 2);

        st.end();
    });

    t.test("on(*): Listen to all Events", st => {
        allListener.count = 0;

        // List to all events using the "*" string
        evAll = events.on("*", allListener);
        events.emit("ev1");

        st.equal(allListener.count, 1, "All Events listener triggered");
        events.emit("something");
        st.equal(allListener.count, 2, "All Events listener called on any event");

        evAll.off();
        allListener.count = 0;

        // Listen to all events by passing EventEmitter instance as eventName
        evAll = events.on(events, allListener);
        events.emit("ev1");

        st.equal(allListener.count, 1, "All Events listener triggered when instance is used");
        events.emit("something");
        st.equal(allListener.count, 2, "All Events listener called on any event when instance is used");

        evAll.off();
        allListener.count = 0;

        st.end();
    });

    t.test("once(): Listen to an event only once", st => {
        ev1.off();
        listener1.count = 0;
        ev1 = events.once("ev1", listener1);
        events.emit("ev1");

        st.equal(listener1.count, 1, "Listener was called");
        events.emit("ev1");
        st.equal(listener1.count, 1, "Listener was called once");

        // Using * as event name
        ev1.off();
        listener1.count = 0;
        ev1 = events.once("*", listener1);
        events.emit("ev1");

        st.equal(listener1.count, 1, "using * as eventName: Listener was called");
        events.emit("ev1");
        st.equal(listener1.count, 1, "using * as eventName: Listener was called once");

        // USING instance as event name
        ev1.off();
        listener1.count = 0;
        ev1 = events.once(events, listener1);
        events.emit("ev1");

        st.equal(listener1.count, 1, "using instance as eventName: Listener was called");
        events.emit("ev1");
        st.equal(listener1.count, 1, "using instance as eventName: Listener was called once");

        st.end();
    });

    t.test("pipe(): send events to other EventEmitters", st => {
        const pipeTo = EventEmitter.create();
        const pipeReceiver = () => {pipeReceiver.count = pipeReceiver.count || 0;  pipeReceiver.count++};
        let pipeEv1 = pipeTo.on("ev1", pipeReceiver);
        let toPipeEv = events.pipe(pipeTo);

        events.emit("ev1");
        st.equal(pipeReceiver.count, 1, "pipedTo received event.");

        toPipeEv.off();
        events.emit("ev1");
        st.equal(pipeReceiver.count, 1, "pipedTo event is turned off");

        pipeEv1.off();
        pipeReceiver.count = 0;
        pipeEv1 = pipeTo.on("pre-ev1", pipeReceiver);
        toPipeEv = events.pipe(pipeTo, "pre-");
        events.emit("ev1");
        st.equal(pipeReceiver.count, 1, "piped to received event with prefix");

        pipeTo.destroy();
        events.emit("ev1");
        st.equal(pipeReceiver.count, 1, "no listeners are called after destroy()");

        st.end();
    });

    t.end();
});

