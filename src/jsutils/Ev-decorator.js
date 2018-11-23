import  {Ev} from "./Ev.js";

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
            classDescriptor.elements.push({
                key: memberName,
                kind: "method",
                placement: "prototype",
                descriptor: Object.getOwnPropertyDescriptor(Ev.prototype, memberName)
            });
        });
        return classDescriptor;
    }
}
