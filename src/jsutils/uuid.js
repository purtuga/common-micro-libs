// Some of the code below was taken from from https://github.com/ericelliott/cuid/

/**
 * Generates a unique id. This is really a CUID.
 *
 * @namespace uuid
 */
var
base    = 36,
counter = 1,
letter  = "c",
pad     = function(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length-size);
},

globalCount = (function() {
    var i, count = 0;
    for (i in window) {
      count++;
    }
    return count;
}()),

fingerprint = (function() {
    return pad(
        (navigator.mimeTypes.length + navigator.userAgent.length).toString(36) + globalCount.toString(36),
        4
    );
}());


var uuid = Object.create(/** @lends uuid */{
    generate: function(){
        var
        timestamp   = (new Date().getTime()).toString(base),
        nextCounter = pad((counter++).toString(base), 4),
        random      = 'xxxxxxxx'.replace(/[x]/g, function() {
            // This code from: http://stackoverflow.com/a/2117523/471188
            var v = Math.random()*16|0;
            return v.toString(16);
        });

        return (letter + timestamp + nextCounter + fingerprint + random);

    }
});

export default uuid;
