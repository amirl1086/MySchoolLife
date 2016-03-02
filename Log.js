function Log(log, time) {
    this.log = log;
    this.time = time;
}

Log.prototype = {
    constructor: Log,

    toString: function() {
        return this.time + ": " + this.log;
    }
};