
const _GLOBAL = (() => {
    /* global self, window, global */
    if (typeof window !== 'undefined') { return window; }
    if (typeof global !== 'undefined') { return global; }
    if (typeof self !== 'undefined') { return self; }
    return Function('return this;')();
})();

export default function getGlobal() {
    return _GLOBAL;
};