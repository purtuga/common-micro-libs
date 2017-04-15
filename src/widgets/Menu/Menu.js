import Widget               from "../../jsutils/Widget";
import EventEmitter         from "../../jsutils/EventEmitter";
import dataStore            from "../../jsutils/dataStore";
import objectExtend         from "../../jsutils/objectExtend";
import parseHTML            from "../../jsutils/parseHTML";
import fillTemplate         from "../../jsutils/fillTemplate";
import domAddEventListener  from "../../domutils/domAddEventListener";
import menuTemplate         from "./menu.html";
import menuItemTemplate     from "./menuItem.html";
import "./menu.less";

var
PRIVATE = dataStore.create(),

/**
 * Menu widget
 *
 * @class Menu
 * @extends {Widget}
 * @extends {EventEmitter}
 *
 * @param {Object} [options]
 * @param {Array<Object>} [options.items]
 *  Each menu item can have `title` (String) and `onClick` (Function)
 *
 * @fires Menu#item-click
 */
Menu = {
    init: function(options){
        var inst = {
            opt: objectExtend({}, Menu.defaults, options)
        };

        PRIVATE.set(this, inst);

        this.$ui = parseHTML(menuTemplate).firstChild;

        if (inst.opt.items) {
            this.setItems(inst.opt.items);
        }
    },

    /**
     * Sets the items of the menu
     *
     * @param {HTMLElement|Array<Object>} items
     */
    setItems: function(items){
        var $ui = this.getEle();

        $ui.textContent = "";

        if (!items) {
            return;
        }

        // if items is an HTML element, then just append it to
        // the menu container... caller must have defined the
        // actions they need
        if ("appendChild" in items) {
            $ui.appendChild(items);
            return;
        }

        // else, if not an array, exit.
        if (!Array.isArray(items)) {
            return;
        }

        $ui.appendChild(items.reduce((content, item) => {
            var itemSetup = objectExtend({
                    title:      'na',
                    onClick:    null
                }, item),
                menuItem = parseHTML(fillTemplate(menuItemTemplate, itemSetup)).firstChild;

            domAddEventListener(menuItem, "click", () => {
                /**
                 * User clicked on an item
                 *
                 * @event Menu#item-click
                 * @type {Object}
                 */
                this.emit("item-click", item);

                if (itemSetup.onClick) {
                    itemSetup.onClick();
                }
            }, false);

            content.appendChild(menuItem);

            return content;
        }, document.createDocumentFragment()));
    }
};

Menu = EventEmitter.extend(Widget, Menu);

Menu.defaults = {
    items: null
};

export default Menu;

