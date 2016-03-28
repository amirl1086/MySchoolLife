//Exam Object
function Exam(name, dDay, time, description) {
    this.name = name;
    this.dDay = (new Date(dDay)).getTime();
    this.examTime = time;
    this.description = description;
}

//
function cloneExam(other)
{
    return new Exam(other.name, other.dDay,
        new Time(other.examTime.hours, other.examTime.minutes),
        other.description);
}
//the prototype for Exam
Exam.prototype = {
    constructor: Exam, //defining the constructor

    toString: function() {
        var tempDate = new Date(this.dDay);
        return this.name + ", Taking place on: " +
            months[tempDate.getMonth()] + "-" + tempDate.getDate() +
            "-" + tempDate.getFullYear() + ", " + this.examTime;
    },
    
    dailyToString: function() {
        var tempDate = new Date(this.dDay);
        return "<b>" + this.name + "</b>, On: " +
            months[tempDate.getMonth()] + "-" + tempDate.getDate() + "-" + tempDate.getFullYear() + ", " + this.examTime;
    }
};

//load the "add new exam" form
function loadAddExam(dayClicked) {
    $(".mainSection").html("<form class='tasksForm'><fieldset>" +
        "<legend>Exams Editor - Add A New Exam</legend><br>Exam Name: " +
        "<input type='text' id='nameInput'><br><br>Date: <input type='date' id='datePicker'><br><br>Time: " +
        "<input type='number' id='numberInputHours' min='8' max='21' value='8'>:" +
        "<input type='number' id='numberInputMinutes' min='0' max='59' value='0'><br>" +
        "<br>Description:<br><textarea id='textArea'></textarea><br>" +
        "<button type='button' id='submitButton' onclick='addNewExam()'>ADD</button> " +
        "</fieldset></form>");
    if(dayClicked) {
        $("#datePicker")[0].defaultValue = dayClicked.getFullYear() + "-" + (dayClicked.getMonth() + 1 < 10? "0" : "") +
            (dayClicked.getMonth() + 1) + "-" + (dayClicked.getDate() < 10? "0" : "") + dayClicked.getDate();
    }
}

function loadEditExam(examToEdit, index) {
    loadAddExam(null);
    var tempDate = new Date(examToEdit.dDay);
    $("#datePicker")[0].defaultValue = tempDate.getFullYear() + "-" + (tempDate.getMonth() + 1 < 10? "0" : "") +
        (tempDate.getMonth() + 1) + "-" + (tempDate.getDate() < 10? "0" : "") + tempDate.getDate();
    $("#nameInput")[0].defaultValue = examToEdit.name;
    $("#numberInputHours")[0].defaultValue = examToEdit.examTime.hours;
    $("#numberInputMinutes")[0].defaultValue = examToEdit.examTime.minutes;
    $("#textArea")[0].defaultValue = examToEdit.description;
    var submitButton =  $("#submitButton")[0];
    submitButton.innerHTML = "SAVE CHANGES";
    submitButton.onclick = function() {
        var editedExam = validateExam();
        if(editedExam) {
            stuOrg.exams[index] = editedExam;
            loadLog("Assignment " + editedExam.name + " edited successfully");
        }
        else
            loadLog("Missing Assignment form input");
        loadCalendar();
    }
}

//validate the exam input and add it to the main object
function validateExam() {
    var form = $(".tasksForm")[0];
    var examName = form[1].value;
    var examDate = form[2].value;
    var examTime = new Time(form[3].value, form[4].value);
    var description = form[5].value;
    if (examName === "" || examDate === "" || !examTime.isTimeLegal())
        return null;
    else
        return new Exam(examName, examDate, examTime, description);
}

function addNewExam() {
    var newExam = validateExam();
    if(newExam) {
        addTask("exam", newExam);
        loadLog("Exam " + newExam.name + " added successfully");
    }
    else
        loadLog("Missing Exam form input");
    loadCalendar();
}