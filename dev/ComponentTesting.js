
(function () {
    const DomDataBind = window.DomDataBind.default;
    const {
        LoaderCE,
        MenuCE
    } = commonMicroLibs;
    const $out = window.$ce_out = document.createElement("div");
    document.body.appendChild($out);

    LoaderCE.registerAs("cml-loader");
    MenuCE.registerAs("cml-menu");

    $out.innerHTML = `
<h2>Components</h2>

<hr/>
<h3>Loader</h3>
<cml-loader></cml-loader>

<hr/>
<h3>Picker</h3>

<hr/>
<h3>Menu</h3>
<cml-menu _on.item-click="menu.onItemClick" _prop.items="menu.menuItems"></cml-menu>

<hr/>
<h3>Popup</h3>

`;

    const data = window.data = {
        menu: {
            menuItems: [
                { title: "menu 1" },
                { title: "menu 2" },
                { title: "menu 3" }
            ],
            onItemClick() {
                console.log("menu item was clicked");
            }
        }
    };
    const binder = DomDataBind.create($out, data);
})();