//Class Object
function Class(name, classDay, startTime, endTime, description) {
    this.name = name;
    this.dDay = classDay;
    this.startTime = startTime;
    this.endTime = endTime;
    this.description = description;
}

//Class copy constructor
function cloneClass(other) {
    return new Class(other.name, other.dDay,
        new Time(other.startTime.hours, other.startTime.minutes),
        new Time(other.endTime.hours, other.endTime.minutes),
        other.description);
}

//the prototype for the Class
Class.prototype = {
    constructor: Class,  //defining the constructor

    toString: function() {
        return this.name + ", Taking place on: " +
            days[this.dDay] + ", " +
            this.startTime + " - " + this.endTime +
            ", Description: " + this.description;
    },

    dailyToString: function() {
        return "<b>" + this.name + "</b>, On " +
            this.startTime + " Till " + this.endTime;
    }
};

//load the "add new class" form
function loadAddClass() {
    $(".mainSection").html("<form class='tasksForm'>" +
        "<fieldset><legend>Classes Editor - Add A New Class</legend>" +
        "<br>Class Name: <input type='text' id='nameInput'><br><br>Taking place on Day: " +
        "<select id='inputDay'><option>Sunday</option><option>Monday</option>" +
        "<option>Tuesday</option><option>Wednesday</option>" +
        "<option>Thursday</option><option>Friday</option>" +
        "</select><br><br>Start Time:<input type='number' id='startInputHours' min='8' max='21' " +
        "value='8'>:<input type='number' id='startInputMinutes' min='0' max='59' value='0'><br>" +
        "<br>Finish Time:<input type='number' id='endInputHours' min='8' max='21' value='8'>:" +
        "<input type='number' id='endInputMinutes' min='0' max='59' value='0'><br><br>Description:" +
        "<br><textarea id='textArea'></textarea><br>" +
        "<button type='button' id='submitButton' onclick='addNewClass()'>ADD</button>" +
        "</fieldset></form>");
}

//load the "edit class" form
function loadEditClass(classToEdit, index) {
    loadAddClass();
    $("#nameInput")[0].defaultValue = classToEdit.name;
    $("#inputDay")[0].defaultValue = days[classToEdit.dDay];
    $("#startInputHours")[0].defaultValue = classToEdit.startTime.hours;
    $("#startInputMinutes")[0].defaultValue = classToEdit.startTime.minutes;
    $("#endInputHours")[0].defaultValue = classToEdit.endTime.hours;
    $("#endInputMinutes")[0].defaultValue = classToEdit.endTime.minutes;
    $("#textArea")[0].defaultValue = classToEdit.description;

    $("fieldset").append($("<button />").click(function(e) {
        e.preventDefault();
        $(".mainSection").html(loadList(stuOrg.classes, "Classes", "", "full"));
        applyEditingTasks();
    }).text("CANCEL").attr("id", "cancelButton"));
    
    var submitButton =  $("#submitButton")[0];
    submitButton.innerHTML = "SAVE CHANGES";
    submitButton.onclick = function(e) {
        e.preventDefault();
        var editedClass = validateClass();
        if(editedClass) {
            stuOrg.classes[index] = editedClass;
            loadLog("Class " + editedClass.name + " edited successfully");
        }
        else
            loadLog("Missing Class form input");
        loadCalendar();
    }
}

//validate the input given in the form
function validateClass() {
    var form = $(".tasksForm")[0];
    var className = form[1].value;
    var classDay = form[2].value;
    var startTime = new Time(form[3].value, form[4].value);
    var endTime = new Time(form[5].value, form[6].value);
    var description = form[7].value;
    if (className === "" || className.length > 60|| classDay === "" || 
        !startTime.isTimeLegal() || !endTime.isTimeLegal() || startTime.equals(endTime) <= 0) {
        return null;
    }
    else {
        var newClass = new Class(className, getDayNumberByName(classDay), startTime, endTime, description);
        if(checkForOverlap(stuOrg.classes, newClass)) {
            if (confirm("Class " + newClass.name + " is overlapping, would you like to add it nevertheless?")) {
                return newClass;
            }
        }
        else {
            return newClass;
        }
    }
    return null;
}

//add the new class to the local storage
function addNewClass() {
    var newClass = validateClass();
    if(newClass) {
        addTask("class", newClass);
        loadLog("Class " + newClass.name + " added successfully");
    }
    else
        loadLog("Illegal Class form input");
    loadCalendar();
}

//check for overlapping classes
function checkForOverlap(list, item) {
    var classesToday = getClassesByDay(list, item.dDay);
    var isOverLapping = false;
    for(var i = 0; i < classesToday.length; i++)
        if(item.endTime.equals(classesToday[i].startTime) > 0 || item.startTime.equals(classesToday[i].endTime) > 0)
            isOverLapping = true;
    return isOverLapping;
}