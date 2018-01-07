import getCustomElementFromWidget from "../utils/getCustomElementFromWidget"
import Picker from "./Picker"

export const PickerCE = getCustomElementFromWidget({
    Widget: Picker,
    tagName: "cml-picker",
    className: "Picker-CE",
    liveProps: {
        choices(newValue, pickerWdg) {
            pickerWdg.setChoices(newValue);
        },

        selected(newValue, pickerWdg) {
            pickerWdg.setSelected(newValue);
        }
    }
});
export default PickerCE;
