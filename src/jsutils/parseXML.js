// from jQuery: https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/ajax/parseXML.js

/**
 * Parses a string of XML data into an XML document that can be traversed.
 *
 * @param {String} data
 *
 * @returns XMLDocument
 *
 * @throws Error
 */
var parseXML = function(data){
    var xml;

    if (!data || typeof data !== "string") {
        return null;
    }

    // Support: IE9
    try {
        xml = (new window.DOMParser()).parseFromString(data, "text/xml");
    } catch (e) {
        xml = undefined;
    }

    var errors;
    if (!xml || (errors = xml.getElementsByTagName("parsererror")).length) {
        var err;
        try {
            err = new Error( "Invalid XML: " + errors[0].textContent);
            err.xmlData = data;
        } catch (e) {
            err = new Error("Invalid XML: " + data);
        }
        throw err;
    }

    return xml;
};

export default parseXML;