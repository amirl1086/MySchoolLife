/**/
//beno@balink.net

//globals
var stuOrg;
var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//on page done loading
$(document).ready(function() {
    loadData();
    //adding listeners to the navigation bar buttons
    var navBar = $(".navigationBar")[0].firstElementChild;
    while(navBar) {
        navBar.addEventListener("click", switchContent, false);
        navBar = navBar.nextElementSibling;
    }

    var navButtonLeft = $(".navigationButtonLeft");
    navButtonLeft.click(switchContent);
    navButtonLeft.text("Home");

    var navButtonRight = $(".navigationButtonRight");
    navButtonRight.click(switchContent);
    navButtonRight.text("Add New Assignment");

    var menuBar = $(".dropDown")[0].firstElementChild;
    while(menuBar) {
        menuBar.addEventListener("click", switchContent, false);
        menuBar = menuBar.nextElementSibling;
    }

    //setting up the slide down menu
    $(".slideMenu").click(function(e) {
        $(".dropDown").stop(true, true).slideToggle();
        e.stopPropagation();
    });
    $("html").click(function() {
        $(".dropDown").slideUp();
        $("#popUpWindow").slideUp();
    });

    //setting up the text in the header and the buttons
    $("header")[0].innerText = "My School Life";
    var navBarButtons = $(".navigationButton");
    navBarButtons[0].innerText = "Add New Class";
    navBarButtons[1].innerText = "Add New Exam";

    var menuBarButtons = $(".slideMenuButton");
    menuBarButtons[0].innerText = "Weekly Schedule";
    menuBarButtons[1].innerText = "Assignments List";
    menuBarButtons[2].innerText = "Exams List";
    menuBarButtons[3].innerText = "Classes List";
    menuBarButtons[4].innerText = "Delete History";

    //initializing the calendar as the first appearance
    loadCalendar();
});

//
function loadData() {
    stuOrg = JSON.parse(localStorage.getItem('stuOrg'));
    if (stuOrg === null) {
        stuOrg = {
            currentDate:  (new Date()).getTime(),
            classes: [],
            exams: [],
            assignments: [],
            log: []
        };
        //tester();
    }
    else {
        //JSON parse() will parse back the string to a javascript object
        //the prototypes of the objects are not transferred through this process
        //thus there's a need to clone back the main object
        copyConstructor();
    }
}

function copyConstructor() {
    var  i;
    stuOrg.log = [];
    for(i = 0 ;i < stuOrg.assignments.length; i++) {
        stuOrg.assignments[i] = cloneAssignment(stuOrg.assignments[i]);
    }
    for(i = 0 ;i < stuOrg.exams.length; i++) {
        stuOrg.exams[i] = cloneExam(stuOrg.exams[i]);
    }
    for(i = 0 ;i < stuOrg.classes.length; i++) {
        stuOrg.classes[i] = cloneClass(stuOrg.classes[i]);
    }
}

//this function will be responsible for switching the html code of the main section
function switchContent(e) {
    //get the name of the button that was clicked
    var buttonClicked = e.target.innerText;
    var mainSection =  $(".mainSection");
    mainSection.html("");
    switch (buttonClicked) {
        case "Weekly Schedule":
            loadWeeklySchedule();
            break;
        case "Assignments List":
            loadList(stuOrg.assignments, "Assignments", mainSection);
            break;
        case "Exams List":
            loadList(stuOrg.exams, "Exams", mainSection);
            break;
        case "Classes List":
            loadList(stuOrg.classes, "Classes", mainSection);
            break;
        case "Home":
            loadCalendar();
            break;
        case "Add New Assignment":
            loadAddAssignment();
            break;
        case "Add New Exam":
            loadAddExam();
            break;
        case "Add New Class":
            loadAddClass();
            break;
        case "Delete History":
            deleteStorage();
            break;
    }
}

//this function will load the calendar structure
function loadCalendar() {
    var i, j = 0, tableRows, tableCell,
        tempDate = new Date(stuOrg.currentDate),
        currentMonth = tempDate.getMonth(), newRow;
    tempDate.setDate(1);

    $(".mainSection").html("<div id='prevMonth'></div><div id='calendar'>" +
        "<div id='popUpWindow'></div><table id='calendarTable' border='4' width='100%' cellspacing='5'>" +
        "<thead><tr><td colspan='7'>" + months[tempDate.getMonth()] + ", " + tempDate.getFullYear() +
        "</td></tr></thead><tbody id='tableBody'></tbody></table></div></div><div id='nextMonth'></div>");

    tableRows = $("#tableBody"); //get the table body id
    for (i = 0; i < days.length - 1; i++) {
        newRow = createTableRow(days.length);
        tableRows.append(newRow);
    }

    tableCell = tableRows[0].firstElementChild.firstElementChild;
    for (i = 0; i < days.length; i++) {
        tableCell.innerText = days[i];
        tableCell = tableCell.nextElementSibling;
    }

    i = tempDate.getDay();
    tableRows = tableRows[0].childNodes[1];
    while(tableRows) {
        tableCell = tableRows.firstElementChild;
        while(tableCell) {
            if(j++ >= i && currentMonth === tempDate.getMonth()) {
                tableCell.innerHTML = tempDate.getDate();
                var dailyTasks = [getTasksByDate(stuOrg.exams, tempDate), getTasksByDate(stuOrg.assignments, tempDate)];
                tempDate.setDate(tempDate.getDate() + 1);
                if(dailyTasks[0].length || dailyTasks[1].length) {
                    tableCell.addEventListener("click", getDailyDetails, false);
                    if (dailyTasks[0].length && dailyTasks[1].length) {
                        tableCell.id = "busyDayButton";
                    }
                    else if (dailyTasks[0].length && !dailyTasks[1].length) {
                        tableCell.id = "examButton";
                    }
                    else {
                        tableCell.id = "assignmentButton";
                    }
                }
            }
            else {
                tableCell.innerHTML = "";
            }
            tableCell = tableCell.nextElementSibling;
        }
        tableRows = tableRows.nextElementSibling;

        if(!tableRows && tempDate.getMonth() === currentMonth) {
            tableRows = $("#calendarTable")[0].childNodes[1];
            newRow = createTableRow(days.length);
            tableRows.appendChild(newRow);
            tableRows = tableRows.lastElementChild;
        }
    }
    $("#prevMonth").click(changeMonth);
    $("#nextMonth").click(changeMonth);
}

//this function will change the current month according to the direction clicked (forward or backward)
function changeMonth() {
    var tempDate = new Date(stuOrg.currentDate);
    if (this.id == "prevMonth")
        tempDate.setMonth(tempDate.getMonth() - 1);
    else
        tempDate.setMonth(tempDate.getMonth() + 1);
    stuOrg.currentDate = tempDate.getTime();
    loadCalendar();
    localStorage.setItem('stuOrg', JSON.stringify(stuOrg));
}

function getDailyDetails(e) {
    var popUpWindow = $("#popUpWindow");
    popUpWindow.stop(true, true).slideToggle();
    e.stopPropagation();

    var currentCalendar = new Date(stuOrg.currentDate);
    var tempDate = new Date(currentCalendar.getFullYear(), currentCalendar.getMonth(), e.srcElement.innerText);

    var dailyTasks = [getTasksByDate(stuOrg.exams, tempDate), getTasksByDate(stuOrg.assignments, tempDate)];
    popUpWindow.html("");
    loadList(dailyTasks[0], "Exams", popUpWindow);
    loadList(dailyTasks[1], "Assignments", popUpWindow);
}

//
function loadWeeklySchedule() {
    var i, j = 0 , k = 0, m;
    //finding the minimum and maximum school hours
    if (!stuOrg.classes.length) {
        refreshPage("No classes to show");
        return;
    }

    var weeklyTable = "<table id='scheduleTable' border='4' width='100%' cellspacing='1'>" +
        "<thead><tr><td colspan='8'>Weekly Schedule</td></tr></thead>" +
        "<tbody id><tr id='columnNumber'><th>Time\\Day</th><th>Sunday</th>" +
        "<th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th>" +
        "</tr><tr id='rowNumber'><td>8:00</td><td></td><td></td><td></td><td></td><td></td></tr>";

    //14 school hours every day, 6 days a week + 1 for the time - 14 X 7 table
    for(i = 1; i < 14; i++) {
        weeklyTable += "<tr>";
        for(j = 0; j < 7; j++) {
            if (j == 0)
                weeklyTable += "<td>" + (i + j + 8) + ":00</td>";
            else
                weeklyTable += "<td></td>";
        }
        weeklyTable += "</tr>";
    }
    //closing the table
    weeklyTable +=
        "</tbody>" +
        "</table>";
    $(".mainSection")[0].innerHTML = weeklyTable;

    //
    for(i = 0; i < stuOrg.classes.length; i++) {
        // row - number, column - string

        var column = $("#columnNumber")[0].firstElementChild;

        //find the column index by name
        for (j = 0; column.innerText != stuOrg.classes[i].dDay; j++) {
            column = column.nextElementSibling;
        }

        //find the row and the column meeting point index by some calculations
        var row = stuOrg.classes[i].startTime.hours - 8;
        var tempTableRow = $("#rowNumber")[0];
        while (k < row) {
            tempTableRow = tempTableRow.nextElementSibling;
            k++;
        }

        //stepping on the cells to find the correct place
        var tempTableCell = tempTableRow.firstElementChild;
        for(k = 0; k < j; k++)
            tempTableCell = tempTableCell.nextElementSibling;

        tempTableCell.innerHTML = stuOrg.classes[i].className + "<br>" +stuOrg.classes[i].startTime + " - " + stuOrg.classes[i].endTime;

        for(m = stuOrg.classes[i].startTime.hours; m < stuOrg.classes[i].endTime.hours - 1; m++) {
            tempTableRow = tempTableRow.nextElementSibling;
            tempTableCell = tempTableRow.firstElementChild;
            for(k = 0; k < j; k++)
                tempTableCell = tempTableCell.nextElementSibling;
            tempTableCell.innerText = stuOrg.classes[i].className;
        }

        if(stuOrg.classes[i].endTime.minutes > 0) {
            tempTableRow = tempTableRow.nextElementSibling;
            tempTableCell = tempTableRow.firstElementChild;
            for (k = 0; k < j; k++)
                tempTableRow = tempTableRow.nextElementSibling;
            tempTableRow.innerText = stuOrg.classes[i].className;
        }
    }
}

//
function loadList(list, title, location) {
    if(!list.length) {
        return null;
    }
    var ulList = location.append("<ul>" + title + ":</ul>");
    for(var i = 0; i < list.length; i++) {
        ulList.append("<li>" + list[i].toString() + "</li>");
    }
}

//
function loadLog() {
    var tempLog = "Log<ul>";
    for(var i = 0; i < stuOrg.log.length; i++) {
        if (i == 0)
            tempLog += "<li><b>" + stuOrg.log[i] + "</b></li>";
        else
            tempLog += "<li>" + stuOrg.log[i] + "</li>";
    }
    tempLog += "</ul>";
    $(".log")[0].innerHTML = tempLog;
}

function refreshPage(logMsg) {
    var tempDate = new Date();
    var log = new Log(logMsg, new Time(tempDate.getHours(), tempDate.getMinutes()));
    stuOrg.log.unshift(log);
    loadLog();
    loadCalendar();
}

function deleteStorage() {
    var res = confirm("Are you sure?\nAll your data will be deleted!");
    if (res) {
        localStorage.removeItem("stuOrg");
        loadData();
        loadCalendar();
    }
}

function addItem(type, item) {
    switch (type) {
        case "class":
            stuOrg.classes.unshift(item);
            sortByDay(stuOrg.classes);
            break;
        case "exam":
            stuOrg.exams.unshift(item);
            sortByDay(stuOrg.exams);
            break;
        case "assignment":
            stuOrg.assignments.unshift(item);
            sortByDay(stuOrg.assignments);
            break;
    }
    localStorage.setItem('stuOrg', JSON.stringify(stuOrg));
}

function sortByDay(list) {
    if(list.length <= 1)
        return;
    for (var i = 0; i < list.length; i++) {
        if(list[i].dDay > list[i + 1]) {
            var temp = list[i + 1];
            list[i] = list[i + 1];
            list[i + 1] = temp;
        }
    }
}

function createTableRow(length)
{
    var newRow = document.createElement("TR");
    for(var i = 0; i < length; i++)
        newRow.insertCell(i);
    return newRow;
}

function getTasksByDate(list, otherDate)
{
    if(!list.length) {
        return [];
    }
    var dailyTasks = [],
        thisDate;
    for(var i = 0; i < list.length; i++) {
        thisDate = new Date(list[i].dDay);
        if(otherDate.getMonth() == thisDate.getMonth() && otherDate.getDate() == thisDate.getDate())
            dailyTasks.unshift(list[i]);
    }
    if(dailyTasks.length) {
        return dailyTasks;
    }
    return [];
}

function getDayByName(name)
{
    for(var i = 0; i < days.length; i++)
        if(name === days[i])
            return i;
}

function tester() {
    var c1 = new Class("Polynomials", "Sunday", new Time(8, 0), new Time(11, 0), "des: Hassin");
    var c2 = new Class("Operation Systems", "Sunday", new Time(10, 0), new Time(13, 0), "des: miri");
    var c3 = new Class("Computers communication", "Monday", new Time(15, 0), new Time(18, 0), "des: axman");
    var c4 = new Class("Linear Algebra", "Wednesday", new Time(8, 30), new Time(10, 30), "des: Oshrit otisrotzki");
    var c5 = new Class("Discrete Math", "Tuesday", new Time(10, 0), new Time(14, 0), "des: Yoav rodeh");
    var c6 = new Class("ODD", "Tuesday", new Time(10, 0), new Time(14, 0), "des: Yoav rodeh");
    var c7 = new Class("Discrete Math", "Tuesday", new Time(10, 0), new Time(14, 0), "des: Yoav rodeh");
    var c8 = new Class("Discrete Math", "Tuesday", new Time(10, 0), new Time(14, 0), "des: Yoav rodeh");
    var c9 = new Class("Discrete Math", "Tuesday", new Time(10, 0), new Time(14, 0), "des: Yoav rodeh");
    var c10 = new Class("Discrete Math", "Tuesday", new Time(10, 0), new Time(14, 0), "des: Yoav rodeh");
    var c11 = new Class("Discrete Math", "Tuesday", new Time(10, 0), new Time(14, 0), "des: Yoav rodeh");

    addItem("class", c1);
    addItem("class", c2);
    addItem("class", c3);
    addItem("class", c4);
    addItem("class", c5);
    addItem("class", c6);
    addItem("class", c7);
    addItem("class", c8);
    addItem("class", c9);
    addItem("class", c10);
    addItem("class", c11);

    var a1 = new Assignment("poly - ex2", new Date(0, 0, 2016), new Time(17, 0), "Very important test");
    var a2 = new Assignment("OS - ex12", new Date(1, 1, 2016), new Time(10, 0), "Kinda important test");
    var a3 = new Assignment("C. Communication - ex1", new Date(2, 2, 2016), new Time(13, 0), "Just important test");
    var a4 = new Assignment("Lin Algebra - ex6", new Date(3, 4, 2016), new Time(9, 30), "Medium important test");
    var a5 = new Assignment("Dis math - ex4", new Date(7, 5, 2016), new Time(11, 0), "important test");

    addItem("assignment", a1);
    addItem("assignment", a2);
    addItem("assignment", a3);
    addItem("assignment", a4);
    addItem("assignment", a5);

    var e1 = new Exam("Poly - exam", new Date(5, 5, 2016), new Time(13, 30), 90, "pretty good");
    var e2 = new Exam("OS - exam", new Date(1, 5, 2016), new Time(8, 0), 60, "not very good");
    var e3 = new Exam("CC - exam", new Date(2, 10, 2016), new Time(16, 0), 0, "very bad");
    var e4 = new Exam("LA - exam", new Date(9, 6, 2016), new Time(20, 0), 40, "medium minus");
    var e5 = new Exam("DM - exam", new Date(11, 11, 2016), new Time(11, 30), 80, "good");

    addItem("exam", e1);
    addItem("exam", e2);
    addItem("exam", e3);
    addItem("exam", e4);
    addItem("exam", e5);
}

