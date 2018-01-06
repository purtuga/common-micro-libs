/**
 * Creates and returns a Vue Component based upon a given `Widget` factory.
 * Each component will have `props` for all widget `defaults` along with
 * the following additional params:
 *
 * -    `options { Object }`: Object with options for the widget.
 *      Can be used instead of setting each individual prop on the component.
 *      Helpful when creating a component from a parent components using the
 *      `:is="component"` directive of `template`.
 *
 * @param {Object} options
 *
 * @param {Object} options.Vue
 *  The Vue class.
 *
 * @param {Widget} options.Widget
 *  The Widget factory constructor (must have a `.create()` method).
 *
 * @param {String} [options.template='<div/>']
 *  The component template. Widget will be appended to this element.
 *
 * @param {Object} [options.watch]
 *  Object with list of vue instance properties to be watched. The object's `key` should
 *  be the simple dot-delimited paths that will be given to Vue's `$watch`, and the `value`
 *  a callback function.
 *
 * @return {Vue}
 *
 * @throws {TypeError}
 */
function getVueComponentFromWidget(
    options = {
        Vue:        null,
        Widget:     null,
        htmlTag:    "div",
        watch:      null
    }
) {
    let {
        Vue,
        Widget: WidgetConstructor,
        template,
        watchExp    } = options;

    if (!Vue || !WidgetConstructor) {
        throw new TypeError("options.Vue and options.Widget are required");
    }

    let widgetDefaults          = WidgetConstructor.defaults;
    let defaultPropNames        = Object.keys(widgetDefaults);
    let widgetComponentProps    = defaultPropNames.reduce(function(wdgOpt, paramName){
        // Build each widget default param into a vue Prop definition that
        // returns the default value on instantiation of each Vue component.
        wdgOpt[paramName] = {
            default() {
                return widgetDefaults[paramName];
            }
        };
        return wdgOpt
    }, {
        options: { type: Object }
    });

    return Vue.extend({
        template:   template || "<div/>",

        props:      widgetComponentProps,

        data() {
            return this.options || {};
        },

        computed: {
            _wdgOptions: function(){
                return defaultPropNames.reduce((wdgOpt, attr) => {
                    wdgOpt[attr] = this[attr];
                    return wdgOpt;
                }, {});
            }
        },

        mounted(){
            let watchers    = [];
            let $watch      = this.$watch.bind(this);
            let widgetInst  = this._wdg = WidgetConstructor.create(this._wdgOptions);

            // If the widget supports EventEmitter, the we assume that EventEmitter
            // implementation also support `on("*")` calling signature. We use that
            // here to `pipe` all of its events to the component's $emit (upstream)
            if (widgetInst.on) {
                widgetInst.on("*", (evName, ...evParams) => {
                    this.$emit(evName, ...evParams);
                });
            }

            // If there are "live options" for this widget, then setup the listeners now.
            // A live options callback will get the following:
            //  function(vueInstance, ...watchArgs){}
            if (watchExp) {
                let options = this.options || {};

                Object.keys(watchExp).forEach((option) => {
                    if (typeof watchExp[option] === "function") {
                        watchers.push($watch(
                            option,
                            (...args) => watchExp[option](this, ...args)
                        ));
                    }
                });
            }

            widgetInst.appendTo(this.$el);
            widgetInst.onDestroy(() => watchers.forEach(unwatch => unwatch()));
        },

        destroyed() {
            if (this._wdg) {
                this._wdg.destroy();
                this._wdg = null;
            }
        }
    });
}

export default getVueComponentFromWidget;
export { getVueComponentFromWidget };