console.error( //eslint-disable-line
    new Error('[comon-micro-libs] MenuCE.js is NO LONGER SUPPORTED')
);

import Menu from "./Menu"
export {Menu};
export default Menu;


// import getCustomElementFromWidget from "../utils/getCustomElementFromWidget"
// import Menu from "./Menu"
//
// export const MenuCE = getCustomElementFromWidget({
//     Widget: Menu,
//     tagName: "cml-menu",
//     className: "my-menu-CE",
//     liveProps: {
//         items(newItems, wdg) {
//             if (wdg) {
//                 this.wdg.setItems(newItems);
//             }
//         }
//     }
// });
// export default MenuCE;
