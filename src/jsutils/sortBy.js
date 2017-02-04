/**
 * Sorts an Array/Collection of Objects by a given attribute. Sort is done in place,
 * using String matching (case insensitive - values are converted to uppercase).
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
        let aVal = String(a[attr]).toUpperCase();
        let bVal = String(b[attr]).toUpperCase();

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