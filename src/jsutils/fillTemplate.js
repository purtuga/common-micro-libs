import getObjectPropValue from "./getObjectPropValue";

/**
 * An extremely lightweight template engine for replacing
 * tokens in the form of {{name}} with values from an object
 * or a list (array) of objects
 *
 * @function fillTemplate
 *
 * @param {String|HTMLElement} template
 *  Template should use double curly braces for data attributes.
 *  These can be defined in dot notation for deep values in the data.
 *
 * @param {Object|Array<Object>} data
 *  The Object containing the data that will be applied to the
 *  template. An array of objects can also be defined
 *
 * @return {String}
 */
export function fillTemplate(template, data) {

    var opt = {},
        i,j,x,y,item, tokenVal, tmp;

    // If user used an object to define input param, then parse that now
    if (typeof template === "object" && arguments.length === 1) {
        data        = template.data;
        template    = template.template;
    }

    opt.response = "";

    if (typeof template !== "string") {
        tmp = document.createElement("div");
        tmp.appendChild(template);
        template = tmp.innerHTML;

    } else {
        opt.template = template;
    }

    opt.tokens = opt.template.match(/(\{\{.*?\}\})/g);

    if (!Array.isArray(data)) {
        if (!data) {
            data = [{}];

        } else {
            data = [ data ];
        }
    }

    // If we have tokens in the template, then replace them
    if (opt.tokens !== null) {
        // If data tokens were passed in on input, then use them
        // in looking for that token in the template and replacing
        // it with the value defined.
        for(x=0,y=data.length; x<y; x++){
            item = opt.template;

            for(i=0,j=opt.tokens.length; i<j; i++){
                opt.tokens[i]   = opt.tokens[i].replace(/[{}]/g, "");
                tokenVal        = getObjectPropValue(data[x], opt.tokens[i]) || '';
                //tokenVal        = data[x][ opt.tokens[i] ] || '';

                if (typeof tokenVal === "function") {
                    let fnContext = data[x];

                    // Function should be called with the same context as it was originally created.
                    if (opt.tokens[i].indexOf(".") !== -1) {
                        fnContext = getObjectPropValue(data[x], opt.tokens[i].substr(0, opt.tokens[i].lastIndexOf(".")));
                    }

                    tokenVal = tokenVal.call(fnContext);
                }

                item = item.replace("{{" + opt.tokens[i] + "}}", tokenVal);
            }

            opt.response += item;
        }

    } else {
        opt.response = opt.template;
    }

    return opt.response;
}

export default fillTemplate;
