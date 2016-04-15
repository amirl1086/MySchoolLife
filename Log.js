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

//
function loadLog(logMsg) {
    var logText = "<h4>Log</h4>";
    if(logMsg != "") {
        var tempDate = new Date();
        addTask("log", new Log(logMsg, new Time(tempDate.getHours(), tempDate.getMinutes())));
        logText += loadList(stuOrg.log, "", "",  "full");
    }
    $(".log").html(logText);
}