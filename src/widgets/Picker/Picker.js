import Widget                   from "../../jsutils/Widget"
import fillTemplate             from "../../jsutils/fillTemplate"
import parseHTML                from "../../jsutils/parseHTML"
import objectExtend             from "../../jsutils/objectExtend"
import dataStore                from "../../jsutils/dataStore"
import EventEmitter             from "../../jsutils/EventEmitter"

import DomKeyboardInteraction   from "../../domutils/DomKeyboardInteraction"
import domSetStyle              from "../../domutils/domSetStyle"
import domAddClass              from "../../domutils/domAddClass"
import domTriggerEvent          from "../../domutils/domTriggerEvent"

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
 * @param {String} [options.title="Select..."]
 * @param {String} [options.popupWidth="full"]
 *  A CSS value for the width of the popup, or the word `full` if wanting
 *  the width of the popup to be as wide as the element to which it is attached
 *
 * @triggers Picker#item-selected
 * @triggers Picker#selection-cleared
 */
var Picker = {
    init: function (options){
        var inst = {
            opt:        objectExtend({}, this.getFactory().defaults, options),
            ready:      null,
            choices:    null,
            selected:   null
        };

        PRIVATE.set(this, inst);

        var opt         = inst.opt;
        var popup       = inst.popup    = Popup.create();
        var menu        = inst.menu     = Menu.create();
        var $popupUI    = popup.getEle();
        var $ui         = this.$ui = parseHTML(
            fillTemplate(this.getTemplate(), opt)
        ).firstChild;
        var uiFind              = $ui.querySelector.bind($ui);
        var setPopupWidthOnShow = opt.popupWidth === "full";

        opt.choices = opt.choices || [];
        inst.$title = uiFind(`.${CSS_CLASS_TITLE}`);

        if (opt.choices) {
            this.setChoices(opt.choices);
        }

        if (opt.selected){
            this.setSelected(opt.selected);
        }

        if (!opt.showClear) {
            domAddClass($ui, `${CSS_CLASS_BASE}--noClear`);
        }

        // setup keyboard interaction
        var keyboardInteraction = inst.keyboardInteraction = DomKeyboardInteraction.create({
            input:         inst.$title,
            eleGroup:      $popupUI,
            eleSelector:   "li",
            focusClass:     opt.focusClass
        });

        keyboardInteraction.on("keyEnter", (ev) => {
            domTriggerEvent(ev.focusElement, "click");
        });

        keyboardInteraction.on("keyEsc", () => {
            popup.hide();
        });

        if (!setPopupWidthOnShow) {
            domSetStyle($popupUI, { width: opt.popupWidth });
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


        $popupUI.style.maxHeight = '20em';
        popup.setContent(menu);
        popup.attachTo($ui);

        $ui.addEventListener("click", function(){
            if (setPopupWidthOnShow && !popup.isVisible()) {
                domSetStyle($popupUI, { width: `${ $ui.clientWidth }px` });
            }
            keyboardInteraction.resetFocus();
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
     *  The item will be compared against each of the choices until
     *  a match is found. Match could by by entire Choice (if object),
     *  or by looking at the choice `title` or `value` attributes.
     *
     */
    setSelected: function(item){
        var inst = PRIVATE.get(this);

        if (item) {
            inst.choices.some(choice => {
                if (choice === item || choice.value === item || choice.title === item) {
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
     *  Each choice (object) needs at least a `title` attribute, but if a `value`
     *  attribute is also defined, then that will be used as well by `setSelected`. If
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
    choices:    null,
    selected:   "",
    popupWidth: "full",
    showClear:  true,
    focusClass: "my-menu-selected",
    labels:     {
        title: "Select..."
    }
};

export default Picker;
