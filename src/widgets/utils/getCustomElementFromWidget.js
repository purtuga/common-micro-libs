import Component from "../../jsutils/Component"

/**
 * Returns a Custom Element for the given Widget constructor provided on input.
 *
 * @param {Object} options
 * @param {Widget} options.Widget
 *  The Widget Class.
 *
 * @return {HTMLElement}
 */
export function getCustomElementFromWidget({ Widget }) {
    return class extends Component {
        connectedCallback() {
            const wdg = new Widget();
            this.appendChild(wdg.getEle());

            this.onDestroy(() => {
                wdg.destroy();
            })
        }

        disconnectedCallback() {
            this.destroy();
        }
    }
}

export default getCustomElementFromWidget;