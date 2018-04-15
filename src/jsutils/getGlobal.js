
export const GLOBAL = (() => {
    const undef = 'undefined';
    /* global self, window, global */
    if (typeof window !== undef) { return window; }
    if (typeof global !== undef) { return global; }
    if (typeof self !== undef) { return self; }
    return Function('return this;')();
})();

export function getGlobal() {
    return GLOBAL;
}
export default getGlobal;