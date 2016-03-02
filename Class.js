/* */

//Class constructor
function Class(name, classDay, startTime, endTime, description) {
    this.className = name;
    this.dDay = getDayByName(classDay);
    this.startTime = startTime;
    this.endTime = endTime;
    this.description = description;
}

//Class copy constructor
function cloneClass(other) {
    return new Class(other.className, other.dDay,
        new Time(other.startTime.hours, other.startTime.minutes),
        new Time(other.endTime.hours, other.endTime.minutes),
        other.description);
}

//the prototype for the Class
Class.prototype = {
    constructor: Class,  //defining the constructor

    toString: function() {
        return this.className + ", Taking place on: " +
            this.dDay + ", " +
            this.startTime + " - " + this.endTime;
    }
};

//this function will load the "add new class" form
function loadAddClass() {
    $(".mainSection").html("<form class='tasksForm'>" +
        "<fieldset><legend>Classes Editor - Add a new Class</legend>" +
        "<br>Class Name: <input type='text'><br>" +
        "<br>Taking place on Day: <select>" +
        "<option>Sunday</option><option>Monday</option>" +
        "<option>Tuesday</option><option>Wednesday</option>" +
        "<option>Thursday</option><option>Friday</option>" +
        "</select><br><br>Start Time: " +
        "<input type='number' min='8' max='21' value='8'>:" +
        "<input type='number' min='0' max='59' value='0'><br>" +
        "<br>Finish Time: " +
        "<input type='number' min='8' max='21' value='8'>:" +
        "<input type='number' min='0' max='59' value='0'><br>" +
        "<br>Description:<br>" +
        "<textarea id='textArea'></textarea><br>" +
        "<br> <button type='button' onclick='validateClass()'>ADD</button>" +
        "</fieldset></form>");
}

//
function validateClass() {
    var form = $(".tasksForm")[0];
    var className = form[1].value;
    var classDay = form[2].value;
    var startTime = new Time(form[3].value, form[4].value);
    var endTime = new Time(form[5].value, form[6].value);
    var description = form[7].value;
    if (className === "" || classDay === "" || !startTime.isTimeLegal() || !endTime.isTimeLegal()) {
        refreshPage("Missing class input");
    }
    else {
        var newClass = new Class(className, classDay, startTime, endTime, description);
        addItem("class", newClass);
    }
    loadAddClass();
}