import  {Ev} from "./Ev.js";
import {getElementDescriptor} from "./decorator-utils.js";

//========================================================================
const MEMBERS = ["on", "emit", "clear"];

/**
 * Add basic Eventful methods ([MinimalEventEmitter]{@link MinimalEventEmitter}) to the given class.
 *
 * @returns {function(*): *}
 */
export function eventful() {
    return function (classDescriptor) {
        MEMBERS.forEach(memberName => {
            classDescriptor.elements.push(
                getElementDescriptor(
                    memberName,
                    Object.getOwnPropertyDescriptor(Ev.prototype, memberName)
                )
            );
        });
        return classDescriptor;
    }
}
