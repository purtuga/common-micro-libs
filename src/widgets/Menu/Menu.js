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

const PRIVATE = dataStore.create();

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
const Menu = EventEmitter.extend(Widget).extend(/** @lends Menu.prototype */{
    init: function(options){
        var inst = {
            opt: objectExtend({}, this.getFactory().defaults, options)
        };

        PRIVATE.set(this, inst);

        this.$ui = parseHTML(menuTemplate).firstChild;

        if (inst.opt.items) {
            this.setItems(inst.opt.items);
        }

        this.onDestroy(() => {
            // Destroy all Compose object
            Object.keys(inst).forEach(function (prop) {
                if (inst[prop]) {
                    [
                        "destroy",      // Compose
                        "remove",       // DOM Events Listeners
                        "off"           // EventEmitter Listeners
                    ].some((method) => {
                        if (inst[prop][method]) {
                            inst[prop][method]();
                            return true;
                        }
                    });

                    inst[prop] = undefined;
                }
            });

            PRIVATE['delete'](this);
        });
    },

    /**
     * Sets the items of the menu
     *
     * @param {HTMLElement|Array<Object|Widget>} items
     * If an `HTMLElement` is used on input, then the entire element is used as
     * the menu items.
     * An array of `Object` or `Widget` instances can also be used.
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
            // If item is a Widget, then just append that widget to the content
            if (item.appendTo) {
                let $li = parseHTML("<li></li>").firstChild;
                item.appendTo($li);
                content.appendChild($li);

            } else {
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
            }

            return content;
        }, document.createDocumentFragment()));
    }
});

Menu.defaults = {
    items: null
};

export default Menu;
export { Menu };
