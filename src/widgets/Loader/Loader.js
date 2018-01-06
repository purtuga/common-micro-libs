import Widget       from "../../jsutils/Widget"
import parseHTML    from "../../jsutils/parseHTML"

import "./Loader.less"

//==========================================================================

/**
 * Loader Widget display an animated graphic indicating the UI is busy
 *
 * @class Loader
 * @extends Widget
 *
 * @param {Object} options
 */
const Loader = Widget.extend(/** @lends Loader.prototype */{
    init() {
        this.$ui = parseHTML(this.getTemplate()).firstChild;
    },

    /**
     * returns the widget's template
     * @return {String}
     */
    getTemplate(){
        return '<div class="Loader"><span class="Loader-img"></span></div>';
    }
});

/**
 * Global default options for Loader
 *
 * @name Loader.defaults
 * @type {Object}
 */
Loader.defaults = {};

export default Loader;
export {Loader};
