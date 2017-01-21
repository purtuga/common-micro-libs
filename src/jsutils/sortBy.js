/**
 * Sorts an Array/Collection of Objects by a given attribute. Sort is done in place
 *
 * @param {Array<Object>|Collection<Object>} arr
 * @param {String} attr
 * @param {String} [dir="asc"]
 *  Sorting direction. Possible values:
 *  -   `asc`: Ascending (Default)
 *  -   `desc`: Descending
 *
 * @example
 *
 * let arr = [
 *      {
 *          title: "title 5"
 *      },
 *      {
 *          title: "title 9"
 *      },
 *      {
 *          title: "title 1"
 *      }
 * ];
 *
 * sortBy(arr, "title");
 */
export default function sortBy(arr, attr, dir = "asc"){
    if (!Array.isArray(arr) || !attr) {
        return;
    }

    let isAscending = dir === "asc";

    arr.sort((a, b) => {
        let aVal = a[attr];
        let bVal = b[attr];

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