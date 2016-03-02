//Exam Object
function Exam(name, dDay, time, strengthLevel, description) {
    this.examName = name;
    this.dDay = (new Date(dDay)).getTime();
    this.strengthLevel = strengthLevel;
    this.examTime = time;
    this.description = description;
}

//
function cloneExam(other)
{
    return new Exam(other.examName, other.dDay,
        new Time(other.examTime.hours, other.examTime.minutes),
        other.strengthLevel, other.description);
}
//the prototype for Exam
Exam.prototype = {
    constructor: Exam, //defining the constructor

    toString: function() {
        var tempDate = new Date(this.dDay);
        return this.examName + ", Taking place on: " +
            tempDate.getDate() + "-" + months[tempDate.getMonth()] +
            "-" + tempDate.getFullYear() + ", " + this.examTime;
    }
};

//this function will load the "add new exam" form
function loadAddExam() {
    $(".mainSection").html("<form class='tasksForm'><fieldset>" +
        "<legend>Exams Editor - Add a new Exam</legend><br>Exam Name: " +
        "<input type='text'><br><br>Date:<br><input type='date'><br><br>Time: " +
        "<input type='number' min='8' max='21' value='8'>:" +
        "<input type='number' min='0' max='59' value='0'><br>" +
        "<br>Evaluate your level in that class: " +
        "<input type='number' max='100' value='100'><br>" +
        "<br>Description:<br><textarea id='textArea'></textarea><br>" +
        "<br> <button type='button' onclick='validateExam()'>ADD</button>" +
        "</fieldset></form>");
}

//this function will validate the exam input and add it to the main object
function validateExam() {
    var form = $(".tasksForm")[0];
    var examName = form[1].value;
    var examDate = form[2].value;
    var examTime = new Time(form[3].value, form[4].value);
    var selfGrade = form[5].value;
    var description = form[6].value;

    if (examName === "" || examDate === "" || !examTime.isTimeLegal() || selfGrade < 0 || selfGrade > 100) {
        refreshPage("Missing exam data");
    }
    else {
        var exam = new Exam(examName, examDate, examTime, selfGrade, description);
        addItem("exam", exam);
    }
    loadAddExam();
}