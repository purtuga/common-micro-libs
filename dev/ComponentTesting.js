
(function () {
    const { LoaderCE } = commonMicroLibs;
    const $out = window.$ce_out = document.createElement("div");
    document.body.appendChild($out);

    customElements.define("cml-loader", LoaderCE);

    $out.innerHTML = `<cml-loader></cml-loader>`;

})();