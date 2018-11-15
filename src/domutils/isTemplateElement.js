import {toString} from "../jsutils/runtime-aliases.js";

/**
 * Returns a boolean indicating if provided element on input is a HTML Template element (like).
 *
 * @param {HTMLElement} ele
 *
 * @returns {boolean}
 */
export function isTemplateElement(ele) {
    const eleToStringValue = toString(ele);
    return eleToStringValue === "[object HTMLTemplateElement]" ||
        (eleToStringValue === "[object HTMLUnknownElement]" && !!ele.content);
}