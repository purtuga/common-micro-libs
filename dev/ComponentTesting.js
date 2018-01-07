
(function () {
    const DomDataBind = window.DomDataBind.default;
    const {
        LoaderCE,
        MenuCE,
        PickerCE
    } = commonMicroLibs;
    const $out = window.$ce_out = document.createElement("div");

    LoaderCE.register();
    MenuCE.register();
    PickerCE.register();

    $out.innerHTML = `
<h2>Components</h2>

<hr/>
<h3>Loader</h3>
<cml-loader></cml-loader>

<hr/>
<h3>Picker</h3>
<cml-picker 
    _prop.choices="picker.choices" 
    _prop.selected="picker.selected"
    _on.item-selected="console.log('item selected: ' + $ev.target.textContent)"
    _on.selection-cleared="console.log('selected cleard!')"
    style="width: 30em;"></cml-picker>

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
        },
        picker: {
            choices: [
                { title: "pick 1" },
                { title: "pick 2" },
                { title: "pick 3" }
            ],
            selected: "pick 3"
        }
    };
    const binder = DomDataBind.create($out, data);
    document.body.appendChild($out);
})();
