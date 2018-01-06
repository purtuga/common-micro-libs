import getCustomElementFromWidget from "../utils/getCustomElementFromWidget"
import Menu from "./Menu"

export const MenuCE = getCustomElementFromWidget({
    Widget: Menu,
    className: "my-menu-CE",
    liveProps: {
        items(newItems) {
            this.wdg.setItems(newItems);
        }
    }
});
export default MenuCE;
