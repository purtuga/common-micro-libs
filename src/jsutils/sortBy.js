import getObjectPropValue from "./getObjectPropValue"

/**
 * Sorts an Array/Collection of Objects by a given attribute. Sort is done in place,
 * using String matching (case insensitive - values are converted to uppercase).
 *
 * @param {Array<Object>|Collection<Object>} arr
 *
 * @param {String} attr
 *  A key path to the attribute that should be used for sorting.
 *  Examples: `name`, `profile.name'
 *
 * @param {String} [dir="asc"]
 *  Sorting direction. Possible values:
 *  -   `asc`: Ascending (Default)
 *  -   `desc`: Descending
 *
 * @example
 *
 * let arr = [
 *      {
 *          title: "title 5",
 *          profile: { name: "paul" }
 *      },
 *      {
 *          title: "title 9",
 *          profile: { name: "john" }
 *      },
 *      {
 *          title: "title 1",
 *          profile: { name: "mark" }
 *      }
 * ];
 *
 * sortBy(arr, "title");
 * sortBy(arr, "profile.name");
 */
export default function sortBy(arr, attr, dir = "asc"){
    if (!Array.isArray(arr) || !attr) {
        return;
    }

    let isAscending = dir === "asc";

    arr.sort((a, b) => {
        let aVal = String(getObjectPropValue(a, attr)).toUpperCase();
        let bVal = String(getObjectPropValue(b, attr)).toUpperCase();

        if (aVal < bVal) {
            if (isAscending) {
                return -1;
            }
            return 1;
        }

        if (aVal > bVal) {
            if (isAscending) {
                return 1;
            }
            return -1;
        }
        return 0;
    });
}