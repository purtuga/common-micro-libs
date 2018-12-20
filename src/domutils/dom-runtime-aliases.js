import {
    functionBindCall,
    toString
} from "../jsutils/runtime-aliases.js";

//=====================================================================
const HTMLElementPrototype = HTMLElement.prototype;
export const doc = document;
export const head = doc.head;
export const createDocFragment = () => doc.createDocumentFragment();
export const createElement = tagName => doc.createElement(tagName);
export const createTextNode = data => doc.createTextNode(data || "");
export const appendChild = functionBindCall(HTMLElementPrototype.appendChild);
export const insertBefore = functionBindCall(HTMLElementPrototype.insertBefore);
export const hasAttribute = functionBindCall(HTMLElementPrototype.hasAttribute);
export const getAttribute = functionBindCall(HTMLElementPrototype.getAttribute);
export const setAttribute = functionBindCall(HTMLElementPrototype.setAttribute);
export const removeAttribute = functionBindCall(HTMLElementPrototype.removeAttribute);
export const isDocFragment = node => toString(node) === "[object DocumentFragment]";

