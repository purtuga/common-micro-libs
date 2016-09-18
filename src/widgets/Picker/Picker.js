import Widget                   from "../../jsutils/Widget"
import fillTemplate             from "../../jsutils/fillTemplate"
import parseHTML                from "../../jsutils/parseHTML"
import objectExtend             from "../../jsutils/objectExtend"
import dataStore                from "../../jsutils/dataStore"
import EventEmitter             from "../../jsutils/EventEmitter"
import Popup                    from "../Popup/Popup"
import Menu                     from "../Menu/Menu"

import PickerTemplate     from "./Picker.html"
import "./Picker.less"


//-----------------------------------------------------------

var PRIVATE = dataStore.create();

const CSS_CLASS_BASE    = "Picker";
const CSS_CLASS_CLEAR   = `${CSS_CLASS_BASE}-clear`;
const CSS_CLASS_TITLE   = `${CSS_CLASS_BASE}-title`;

/**
 * Display a picker widget.
 *
 * @class Picker
 * @extends Widget
 * @extends EventEmitter
 *
 * @param {Object} [options]
 * @param {Array<Object>} [options.choices]
 *
 * @triggers Picker#item-selected
 * @triggers Picker#selection-cleared
 */
var Picker = {
    init: function (options){
        var inst = {
            opt:        objectExtend({}, Picker.defaults, options),
            ready:      null,
            choices:    null,
            selected:   null
        };
        var popup   = inst.popup    = Popup.create();
        var menu    = inst.menu     = Menu.create();

        PRIVATE.set(this, inst);

        var $ui = this.$ui = parseHTML(
            fillTemplate(this.getTemplate(), inst.opt)
        ).firstChild;
        var uiFind = $ui.querySelector.bind($ui);

        inst.$title = uiFind(`.${CSS_CLASS_TITLE}`);

        if (inst.opt.choices) {
            this.setChoices(int.opt.choices);
        }

        menu.on("item-click", item => {
            this.setSelected(item);
            popup.hide();
            /**
             * Items from the list of choices was selected
             *
             * @event Picker#item-selected
             * @type {Object}
             */
            this.emit("item-selected",item);
        });

        popup.getEle().style.maxHeight = '20em';
        popup.setContent(menu);
        popup.attachTo($ui);

        $ui.addEventListener("click", function(){
            popup.toggle();
        });

        uiFind(`.${CSS_CLASS_CLEAR}`).addEventListener("click", (ev) => {
            var current = inst.selected;

            ev.stopPropagation();
            this.clearSelected();

            /**
             * Selection was cleared from widget by user.
             *
             * @event Picker#selection-cleared
             *
             * @type {Object}
             */
            this.emit('selection-cleared', current);
        });

        this.onDestroy(function(){
            menu.destroy();
            menu = inst.menu = undefined;

            popup.destroy();
            popup = inst.popup = undefined;
        });

    },

    /**
     * Returns the widget's template
     * @returns {String}
     */
    getTemplate: function(){
        return PickerTemplate;
    },

    /**
     * Selects a specific list
     *
     * @param {String|Object} item
     *
     */
    setSelected: function(item){
        var inst = PRIVATE.get(this);

        if (item) {
            inst.choices.some(choice => {
                if (choice === item || choice.title === item) {
                    inst.selected       = choice;
                    inst.$title.textContent  = choice.title;
                    return true;
                }
            });
        }
    },

    /**
     * Returns the selected list (an object as returned by `getSiteListCollection`.
     *
     * @returns {Object}
     */
    getSelected: function(){
        return PRIVATE.get(this).selected;
    },

    /**
     * Clears the current selection
     */
    clearSelected: function(){
        var inst = PRIVATE.get(this);
        inst.selected           = null;
        inst.$title.textContent = inst.opt.title;
    },

    /**
     * Sets the list of choices for the picker
     *
     * @param {Array<Object>} [choices]
     *  If not defined, it will clear out the menu of choices.
     *  Each choice (object) needs at least a `title` attribute. If
     *  `onClick` attribute is defined, it will be called when user clicks on it.
     */
    setChoices: function(choices){
        var inst = PRIVATE.get(this);
        inst.menu.setItems(choices);
        inst.choices = choices || [];
    },

    /**
     * Clears the choices in the Menu. Same as calling `setChoices` with no input
     */
    clearChoices: function() {
        this.clearSelected();
        this.setChoices();
    },

    /**
     * Returns the `Popup` widget used by this picker
     * @return {Popup}
     */
    getPopupWidget: function(){
        return PRIVATE.get(this).popup;
    }
};

Picker = EventEmitter.extend(Widget, Picker);

Picker.defaults = {
    choices: null,
    title: "Select..."
};

export default Picker;
