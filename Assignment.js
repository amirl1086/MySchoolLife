//Assignment Object
function Assignment(name, dDay, time, description) {
    this.name = name;
    this.dDay = (new Date(dDay)).getTime();
    this.assignmentTime = time;
    this.description = description;
}

//
function cloneAssignment(other) {
    return new Assignment(other.name, other.dDay,
        new Time(other.assignmentTime.hours, other.assignmentTime.minutes),
        other.description);
}

//the prototype for Assignment
Assignment.prototype = {
    constructor: Assignment, //defining the constructor

    toString: function() {
        //return the object fields concat to string
        var tempDate = new Date(this.dDay);
        return this.name + ", Due date: " +
            months[tempDate.getMonth()] + "-" + tempDate.getDate() + "-" +
            tempDate.getFullYear() + ", Till: " + this.assignmentTime;
    },
    
    dailyToString: function() {
        var tempDate = new Date(this.dDay);
        return "<b>" + this.name + "</b>, Due by: " +
            months[tempDate.getMonth()] + "-" + tempDate.getDate() + "-" + tempDate.getFullYear() + ", " + this.assignmentTime;
    }
};

//load the "add new assignment" form
function loadAddAssignment(dayClicked) {
    $(".mainSection").html("<form class='tasksForm'><fieldset>" +
        "<legend>Assignments Editor - Add A New Assignment</legend>" +
        "<br>Assignment Name:<input type='text' id='nameInput'><br>" +
        "<br>Due Date:<br><input type='date' id='datePicker'><br>" +
        "<br>Until: <input type='number' id='numberInputHours' min='8' max='21' value='8'>:" +
        "<input type='number' id='numberInputMinutes' min='0' max='59' value='0'><br>" +
        "<br>Description:<br><textarea id='textArea'></textarea><br>" +
        "<button type='button' id='submitButton' onclick='addNewAssignment()'>ADD</button>" +
        "</fieldset></form>");
    if(dayClicked) {
        $("#datePicker")[0].defaultValue = dayClicked.getFullYear() + "-" + (dayClicked.getMonth() + 1 < 10? "0" : "") +
            (dayClicked.getMonth() + 1) + "-" + (dayClicked.getDate() < 10? "0" : "") + dayClicked.getDate();
    }
}

function loadEditAssignment(assignmentToEdit, index) {
    loadAddAssignment(null);
    var tempDate = new Date(assignmentToEdit.dDay);
    $("#datePicker")[0].defaultValue = tempDate.getFullYear() + "-" + (tempDate.getMonth() + 1 < 10? "0" : "") +
        (tempDate.getMonth() + 1) + "-" + (tempDate.getDate() < 10? "0" : "") + tempDate.getDate();
    $("#nameInput")[0].defaultValue = assignmentToEdit.name;
    $("#numberInputHours")[0].defaultValue = assignmentToEdit.assignmentTime.hours;
    $("#numberInputMinutes")[0].defaultValue = assignmentToEdit.assignmentTime.minutes;
    $("#textArea")[0].defaultValue = assignmentToEdit.description;
    var submitButton =  $("#submitButton")[0];
    submitButton.innerHTML = "SAVE CHANGES";
    submitButton.onclick = function() {
        var editedAssignment = validateAssignment();
        if(editedAssignment) {
            stuOrg.assignments[index] = editedAssignment;
            loadLog("Assignment " + editedAssignment.name + " edited successfully");
        }
        else
            loadLog("Missing Assignment form input");
        loadCalendar();
    }
}

//validate the assignment input and add it to the main object
function validateAssignment() {
    var form = $(".tasksForm")[0];
    var assignmentName = form[1].value;
    var dueDate = form[2].value;
    var assignmentTime = new Time(form[3].value, form[4].value);
    var description = form[5].value;
    if (assignmentName === "" || dueDate === "" || !assignmentTime.isTimeLegal()) //check conditions
        return null;
    else
        return new Assignment(assignmentName, dueDate, assignmentTime, description);
}

function addNewAssignment() {
    var newAssignment = validateAssignment();
    if(newAssignment) {
        addTask("assignment", newAssignment);
        loadLog("Assignment " + newAssignment.name + " added successfully");
    }
    else
        loadLog("Missing Assignment form input");
    loadCalendar();
}