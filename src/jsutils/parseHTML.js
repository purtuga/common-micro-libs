var DOCUMENT = document;

/**
 * Parses a string into native HTML element
 *
 * @function parseHTML
 *
 * @param {String} htmlString
 *
 * @return {DocumentFragment}
 *  A document fragmenet object with all of the HTMl in it.
 *
 * @example
 *
 * var myUI = parseHTML("<div>something</div>");
 *  // myUI.firstChild === <div>something</div>
 *
 *
 * @example
 *
 * var myUI = parseHTML("<!-- Comment here --> <div>Something</div>");
 *  // myUI.firstChild === <!-- Comment here -->
 *  // myUI..childNodes[0] === <div>Something</div>
 *
 */
export function parseHTML(htmlString){
    var
    fragment    = DOCUMENT.createDocumentFragment(),
    div         = DOCUMENT.createElement("div");

    // If fragment does not have a .children porperty, then create it by
    // point it at childNodes
    if (!("children" in fragment)) {
        fragment.children = fragment.childNodes;
    }

    div.innerHTML = htmlString;

    if (div.childNodes.length) {
        Array.prototype.slice.call(div.childNodes, 0).forEach(function(node){
            fragment.appendChild(node);
        });
    }

    return fragment;
}
export default parseHTML;