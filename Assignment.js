//Assignment Object
function Assignment(name, dDay, time, description) {
    this.assignmentName = name;
    this.dDay = (new Date(dDay)).getTime();
    this.assignmentTime = time;
    this.description = description;
}

//
function cloneAssignment(other) {
    return new Assignment(other.assignmentName, other.dDay,
        new Time(other.assignmentTime.hours, other.assignmentTime.minutes),
        other.description);
}

//the prototype for Assignment
Assignment.prototype = {
    constructor: Assignment, //defining the constructor

    toString: function() {
        //return the object fields concat to string
        var tempDate = new Date(this.dDay);
        return + this.assignmentName + ", Due date: " +
            months[tempDate.getMonth()] + "-" + tempDate.getDate() + "-" +
            tempDate.getFullYear() + ", Till: " + this.assignmentTime;
    }
};

//this function will load the "add new assignment" form
function loadAddAssignment() {
    $(".mainSection").html("<form class='tasksForm'>" +
        "<fieldset>" +
        "<legend>Assignments Editor - Add a new Assignment</legend>" +
        "<br>Assignment Name:" +
        "<input type='text'><br>" +
        "<br>Due Date:<br>" +
        "<input type='date'><br>" +
        "<br>Until: <input type='number' min='8' max='21' value='8'>:" +
        "<input type='number' min='0' max='59' value='0'><br>" +
        "<br>Description:<br>" +
        "<textarea id='textArea'></textarea><br>" +
        "<br> <button type='button' onclick='validateAssignment()'>ADD</button>" +
        "</fieldset>" +
        "</form>");
}

//this function will validate the assignment input and add it to the main object
function validateAssignment() {
    var form = $(".tasksForm")[0];
    var assignmentName = form[1].value;
    var dueDate = form[2].value;
    var assignmentTime = new Time(form[3].value, form[4].value);
    var description = form[5].value;

    if (assignmentName === "" || dueDate === "" || !assignmentTime.isTimeLegal()) {//check conditions
        refreshPage("Illegal Assignment input");
    }
    else {
        var assignment = new Assignment(assignmentName, dueDate, assignmentTime, description);
        addItem("assignment", assignment);
    }
    loadAddAssignment();
}