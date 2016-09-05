import Widget               from "../../jsutils/Widget";
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
 *
 * @param {Object} [options]
 * @param {Array<Object>} [options.items]
 *
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

        $ui.innerHTML = "";

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

        $ui.appendChild(items.reduce(function(content, item){
            var itemSetup = objectExtend({
                    title:      'na',
                    onClick:    null
                }, item),
                menuItem = parseHTML(fillTemplate(menuItemTemplate, itemSetup)).firstChild;

            if (itemSetup.onClick) {
                domAddEventListener(menuItem, "click", itemSetup.onClick, false);
            }

            content.appendChild(menuItem);

            return content;
        }, document.createDocumentFragment()));
    }
};

Menu = Widget.extend(Menu);

Menu.defaults = {
    items: null
};

export default Menu;

