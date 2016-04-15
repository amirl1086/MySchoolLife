/**/

//globals
var stuOrg; //the main object which will be stored

//on page done loading
$(document).ready(function() {
    //loading previous saved data
    loadData();

    //loading some text
    $("header").text("My School Life");
    $("title").text("My School Life");
    $("footer").html("<h3>&copy 2016 All rights reserved to Amir Lavi & Oron Sason</h3>");

    $("body").click(function(e) {
        if(e.target.id != "calendarButton" && e.target.className != "slideMenu" &&
            e.target.id != "examButton" && e.target.id != "assignmentButton" && e.target.id != "busyDayButton") {
            if($(".dropDown").css("display") != "none") {
                displayWindow("dropDown", "off");
            }
            if($(".popUpWindow").css("display") != "none") {
                displayWindow("popUpWindow", "off");
            }
        }
    });

    //adding listeners to the navigation bar buttons
    var navBar = $(".navigationBar")[0].firstElementChild;
    while(navBar) {
        navBar.addEventListener("click", switchContent, false);
        navBar = navBar.nextElementSibling;
    }

    //setting up the slide down menu
    var slideMenuButton = $(".slideMenu");
    slideMenuButton.text("Beyond");
    slideMenuButton.click(function() {
        displayWindow("dropDown", "on");
    });

    //adding listeners to the drop down menu buttons
    var menuBar = $(".dropDown")[0].firstElementChild;
    while(menuBar) {
        menuBar.addEventListener("click", switchContent, false);
        menuBar = menuBar.nextElementSibling;
    }

    //setting up the some more text
    var navBarButtons = $(".navigationButton");
    navBarButtons[0].innerText = "Home";
    navBarButtons[1].innerText = "Add New Class";
    navBarButtons[2].innerText = "Add New Exam";
    navBarButtons[3].innerText = "Add New Assignment";
    var menuBarButtons = $(".slideMenuButton");
    menuBarButtons[0].innerText = "Weekly Schedule";
    menuBarButtons[1].innerText = "Assignments List";
    menuBarButtons[2].innerText = "Exams List";
    menuBarButtons[3].innerText = "Classes List";
    menuBarButtons[4].innerText = "Delete History";

    //initializing the first appearance
    loadCalendar();
    loadTodayPlan();
    loadLog("");
});

//load previous saved data, if any
function loadData() {
    //load the item
    stuOrg = JSON.parse(localStorage.getItem('stuOrg'));
    if (stuOrg === null) { //if null, then no history to load
        stuOrg = { //create the object apperence
            currentDate:  (new Date()).getTime(),
            classes: [],
            exams: [],
            assignments: [],
            log: []
        };
    }
    else {
        //JSON parse() will parse back the string to a javascript object
        //the prototypes of the objects are not transferred through this process
        //thus there's a need to clone back the main object
        copyConstructor();
    }
}

//retrieve all objects to their original prototypes
function copyConstructor() {
    //reset the log
    stuOrg.log = [];
    //go trough the main object and clone the data
    for(var i = 0 ;i < stuOrg.assignments.length; i++) {
        stuOrg.assignments[i] = cloneAssignment(stuOrg.assignments[i]);
    }
    for(i = 0 ;i < stuOrg.exams.length; i++) {
        stuOrg.exams[i] = cloneExam(stuOrg.exams[i]);
    }
    for(i = 0 ;i < stuOrg.classes.length; i++) {
        stuOrg.classes[i] = cloneClass(stuOrg.classes[i]);
    }
}

//switching the html code of the main section
function switchContent(e) {
    //get the name of the button that was clicked
    var buttonClicked = e.target.innerText;
    var mainSection =  $(".mainSection");
    mainSection.html(""); //reset the main section html
    var displayedList = "";
    //activate a function according to the button clicked
    switch (buttonClicked) {
        case "Weekly Schedule":
        {
            loadWeeklySchedule();
            break;
        }
        case "Assignments List":
        {
            //function loadList(list, title, id, style, format) {
            if (!(displayedList = loadList(stuOrg.assignments, "Assignments", "", "full")).length) {
                loadLog("No Assignments to display");
                loadCalendar();
            }
            else {
                mainSection.html(displayedList);
                applyEditingTasks();
            }
            break;
        }
        case "Exams List":
        {
            if (!(displayedList = loadList(stuOrg.exams, "Exams", "", "full")).length) {
                loadLog("No Exams to display");
                loadCalendar();
            }
            else {
                mainSection.html(displayedList);
                applyEditingTasks();
            }
            break;
        }
        case "Classes List":
        {
            if (!(displayedList = loadList(stuOrg.classes, "Classes", "", "full")).length) {
                loadLog("No Classes to display");
                loadCalendar();
            }
            else {
                mainSection.html(displayedList);
                applyEditingTasks();
            }
            break;
        }
        case "Home":
        {
            loadCalendar();
            break;
        }
        case "Add New Assignment":
        {
            loadAddAssignment(null);
            break;
        }
        case "Add New Exam":
        {
            loadAddExam(null);
            break;
        }
        case "Add New Class":
        {
            loadAddClass();
            break;
        }
        case "Delete History":
        {
            deleteStorage();
            break;
        }
    }
}

//load the home page (the calendar)
function loadCalendar() {
    var i, j = 0, tableRows, tableCell,
        tempDate = new Date(stuOrg.currentDate),
        currentMonth = tempDate.getMonth(), newRow;
    tempDate.setDate(1);

    //load initial html
    $(".mainSection").html("<div id='prevMonth'></div><div id='calendar'>" +
        "<div class='popUpWindow'></div><table id='calendarTable' border='4' width='100%' cellspacing='5'>" +
        "<thead><tr><td colspan='7' id='month'>" + months[tempDate.getMonth()] + ", " + tempDate.getFullYear() +
        "</td></tr></thead><tbody id='calendarTableBody'></tbody></table></div></div><div id='nextMonth'></div>");

    //create the table as an element
    tableRows = createTable(days.length - 1, days.length, "calendarTableBody");

    //insert the week days names
    tableCell = tableRows[0].firstElementChild.firstElementChild;
    for (i = 0; i < days.length; i++) {
        tableCell.innerText = days[i];
        tableCell.id="days";
        tableCell = tableCell.nextElementSibling;
    }

    //insert days by numbers and colors according to the task
    i = tempDate.getDay();
    tableRows = tableRows[0].childNodes[1];
    //go through the rows
    while(tableRows) {
        tableCell = tableRows.firstElementChild;
        //go through the columns
        while(tableCell) {
            //if j is in range of the days of the current month
            if(j++ >= i && currentMonth === tempDate.getMonth()) {
                tableCell.innerText = tempDate.getDate(); //insert the number of the day

                //get the tasks on the current day as a [ [], [] ] array
                var dailyTasks = [getTasksByDate(stuOrg.exams, tempDate), getTasksByDate(stuOrg.assignments, tempDate)];
                tempDate.setDate(tempDate.getDate() + 1);

                //if there are any tasks color the table cell accordingly by insert a new id to the cell
                if(dailyTasks[0].length || dailyTasks[1].length) {

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
                else {
                    tableCell.id = "calendarButton";
                }
                tableCell.addEventListener("click", calendarClicked, false);
            }
            else { //if the day is not in range, erase previous data
                tableCell.innerText = "";
                tableCell.id="emptyButton";
            }
            tableCell = tableCell.nextElementSibling;
        }
        tableRows = tableRows.nextElementSibling;

        //a check to allow a dynamic number of rows according to the length of the current month
        if(!tableRows && tempDate.getMonth() === currentMonth) {
            tableRows = $("#calendarTable")[0].childNodes[1];
            newRow = createTableRow(days.length);
            tableRows.appendChild(newRow);
            tableRows = tableRows.lastElementChild;
        }
    }
    //adding listeners to the buttons
    $("#prevMonth").click(changeMonth);
    $("#nextMonth").click(changeMonth);
}

//change the current month according to the arrow clicked (forward or backward)
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



//load the weekly schedule
function loadWeeklySchedule() {
    var i, j, k = 0, m;
    if (!stuOrg.classes.length) {
        loadLog("No Classes to display");
        loadCalendar();
        return;
    }
    $(".mainSection").html("<table id='weeklyTable' border='4' width='100%' cellspacing='5'>" +
        "<thead><tr><td colspan='8'>Weekly Schedule</td></tr></thead>" +
        "<tbody id='weeklyTableBody'></tbody></table>");

    //14 school hours every day + 2 for the header and the days , 6 days a week + 1 for the time - 16 X 7 table
    var tableBody = createTable(15, 7, "weeklyTableBody");

    //insert the week days names
    var tableCell = tableBody[0].firstElementChild.firstElementChild;
    tableCell.innerText = "Time\\Day";
    tableCell = tableCell.nextElementSibling;
    for (i = 1; tableCell; i++) {
        tableCell.innerText = days[i - 1];
        tableCell = tableCell.nextElementSibling;
    }


    tableBody = tableBody[0].childNodes[1];
    for(i = 8; tableBody; tableBody = tableBody.nextElementSibling, i++) {
        tableBody.firstElementChild.innerText = i + ":00";
    }
    tableBody = $("#weeklyTableBody");

    for(i = 0; i < stuOrg.classes.length; i++) {
        var startTime = stuOrg.classes[i].startTime;
        var endTime = stuOrg.classes[i].endTime;

        //find the column index by name
        var column = tableBody[0].firstElementChild.firstElementChild;
        for (j = 0; column.innerText != days[stuOrg.classes[i].dDay]; j++) {
            column = column.nextElementSibling;
        }

        //find the row by the start time of the class
        var row = tableBody[0].childNodes[1];
        for (k = 8; parseInt(row.firstElementChild.innerText) != startTime.hours; k++) {
            row = row.nextElementSibling;
        }

        //stepping on the cells to find the correct column
        var tempTableCell = row.firstElementChild;
        for(k = 0; k < j; k++)
            tempTableCell = tempTableCell.nextElementSibling;

        //put the value
        if(tempTableCell.innerHTML != "") {
            if(tempTableCell.style.backgroundColor == "cornflowerblue") {
                tempTableCell.innerHTML += ", " + stuOrg.classes[i].name + "<br>" +stuOrg.classes[i].startTime + " - " + stuOrg.classes[i].endTime;
            }
            else {
                tempTableCell.innerHTML += ",<br>Overlapping:<br>" + stuOrg.classes[i].name + "<br>" +stuOrg.classes[i].startTime + " - " + stuOrg.classes[i].endTime;
                tempTableCell.style.backgroundColor = "cornflowerblue";
            }
        }
        else {
            tempTableCell.innerHTML = stuOrg.classes[i].name + "<br>" +stuOrg.classes[i].startTime + " - " + stuOrg.classes[i].endTime;
        }

        //go to below cells if necessary
        if(startTime.hours < endTime.hours) {
            for(m = startTime.hours; m < endTime.hours - 1; m++) {
                row = row.nextElementSibling;
                tempTableCell = row.firstElementChild;
                for(k = 0; k < j; k++)
                    tempTableCell = tempTableCell.nextElementSibling;
                if(tempTableCell.innerHTML != "") {
                    if(tempTableCell.style.backgroundColor == "cornflowerblue") {
                        tempTableCell.innerHTML += ", " + stuOrg.classes[i].name;
                    }
                    else {
                        tempTableCell.innerHTML += ",<br>Overlapping:<br>" + stuOrg.classes[i].name;
                        tempTableCell.style.backgroundColor = "cornflowerblue";
                    }
                }
                else {
                    tempTableCell.innerHTML = stuOrg.classes[i].name;
                }
            }
            //check if there is a need to add more rows
            if(endTime.minutes > 0) {
                row = row.nextElementSibling;
                tempTableCell = row.firstElementChild;
                for (k = 0; k < j; k++)
                    tempTableCell = tempTableCell.nextElementSibling;
                if(tempTableCell.innerHTML != "") {
                    if(tempTableCell.style.backgroundColor == "cornflowerblue") {
                        tempTableCell.innerHTML += ", " + stuOrg.classes[i].name;
                    }
                    else {
                        tempTableCell.innerHTML += ",<br>Overlapping:<br>" + stuOrg.classes[i].name;
                        tempTableCell.style.backgroundColor = "cornflowerblue";
                    }
                }
                else {
                    tempTableCell.innerHTML = stuOrg.classes[i].name;
                }
            }
        }
    }
}

//generic function that returns a ul and li's list as a string
function loadList(list, title, additionalHeader, format) {
    if(!list.length) {
        return "";
    }
    var ulList = "<ul><h1>" + title + "</h1> <h2>" + additionalHeader + "</h2>";
    for(var i = 0; i < list.length; i++) {
        if(format == "full")
            ulList += "<li><h3>" + list[i].toString() + "</h3></li>";
        else if (format == "partial")
            ulList += "<li><h3>" + list[i].dailyToString() + "</h3></li>";
    }
    ulList += "</ul>";
    return ulList;
}

//pop up a window that will show the daily tasks
function calendarClicked(e) {
    var popUp = $(".popUpWindow");
    if(popUp.css('display') != 'block')
        displayWindow("popUpWindow", "on");
    var dayClicked = getDayClicked(e);
    var dailyTasksText = "<h1>" + dayClicked.getDate() + " - " + months[dayClicked.getMonth()] +
        " - " + dayClicked.getFullYear() + "</h1>";

    //get the tasks on the current day as a [ [], [] ] array
    var dailyTasks = [getTasksByDate(stuOrg.exams, dayClicked), getTasksByDate(stuOrg.assignments, dayClicked)];

    //load the list according to the choice
    dailyTasksText += loadList(dailyTasks[0], "Exams", "", "partial");
    dailyTasksText += loadList(dailyTasks[1], "Assignments", "", "partial");
    dailyTasksText += "<ul><h2>Would you like to add a Task?</h2>" +
        "<li id='editExamFromPop'><h3>Exam on that day?</h3></li>" +
        "<br><li id='editAssignmentFromPop'><h3>Assignment to hand in?</h3></li></ul>";
    popUp.html(dailyTasksText);
    $("#editExamFromPop").click(function () { loadAddExam(dayClicked)});
    $("#editAssignmentFromPop").click(function () { loadAddAssignment(dayClicked)});
}

//get the day clicked on the calendar
function getDayClicked(e) {
    var dayClicked = new Date(stuOrg.currentDate);
    dayClicked.setDate(e.currentTarget.innerText);
    return dayClicked;
}

//display the pop up window
function displayWindow(section, status) {
    var popUpWindow = $("." + section);
    if(status == "on")
        popUpWindow.stop(true, true).slideToggle();
    else
        popUpWindow.slideUp("slow");
}

//load the daily planner
function loadTodayPlan() {
    var tempText = "<h4>Daily Planner</h4>";
    var dailyPlanner = $(".todayPlan");

    //print the classes on the current day
    var todayClasses = getClassesByDay(stuOrg.classes, new Date().getDay());
    if(todayClasses.length) {
        tempText += loadList(todayClasses, "Classes", "today:", "partial");
    }

    //print the exams in the near month
    var monthlyExams = getTasksByTime(stuOrg.exams, 30);
    if(monthlyExams.length) {
        tempText += loadList(monthlyExams, "Exams", "in the near month:", "partial");
    }

    //print the assignments to hand-in in the next week
    var weeklyAssignments = getTasksByTime(stuOrg.assignments, 7);
    if(weeklyAssignments.length) {
        tempText += loadList(weeklyAssignments, "Assignments", "due by the next week:", "partial");
    }
    dailyPlanner.html(tempText);
}

//adding design features and editing options to the lists
function applyEditingTasks() {
    var mainSection = $(".mainSection");
    mainSection.find("ul").attr("id", "mainSectionList");
    var index = 0;
    mainSection.find("li").each(function () {
        var temp = $(this).text().split(',');
        temp[3] = "</br>" + temp[3];
        temp = temp.join();
        temp = "<h3>" + temp + "</h3>";
        $(this).html(temp);
        $(this).append($("<button />").click(function(e){
            editTask(e);
        }).text("EDIT").attr("id", index));
        $(this).append($("<button />").click(function(e){
            removeTask(e);
        }).text("REMOVE").attr("id", index));
        index++;
    });
}

//change a task details
function editTask(e) {
    var index = parseInt(e.target.id);
    var listPresented = $("#mainSectionList")[0].firstElementChild.innerHTML;
    if(listPresented == "Exams") {
        loadEditExam(stuOrg.exams[index], index);
    }
    else if(listPresented == "Assignments") {
        loadEditAssignment(stuOrg.assignments[index], index);
    }
    else {
        loadEditClass(stuOrg.classes[index], index);
    }
}

//remove a task from the local storage
function removeTask(e) {
    var res = confirm("Are you sure?\nThis task will be deleted");
        if (res) {
        var index = parseInt(e.target.id);
        var listPresented = $("#mainSectionList")[0].firstElementChild.innerHTML;
        if(listPresented == "Exams") {
            stuOrg.exams.splice(index, 1);
            loadLog("Exam deleted successfully");
        }
        else if(listPresented == "Assignments") {
            stuOrg.assignments.splice(index, 1);
            loadLog("Assignment deleted successfully");
        }
        else {
            stuOrg.classes.splice(index, 1);
            loadLog("Class deleted successfully");
        }
        loadCalendar();
        localStorage.setItem('stuOrg', JSON.stringify(stuOrg));
    }
    loadTodayPlan();
}

//remove the entire history
function deleteStorage() {
    var res = confirm("Are you sure?\nAll your data will be deleted!");
    if (res) {
        localStorage.removeItem('stuOrg');
        loadData();
    }
    loadCalendar();
    loadTodayPlan();
    loadLog("");
}

//add a task to the local storage
function addTask(type, item) {
    if(!item)
        return;
    switch (type) {
        case "class":
            stuOrg.classes.unshift(item);
            sortTasksByDate(stuOrg.classes);
            break;
        case "exam":
            stuOrg.exams.unshift(item);
            sortTasksByDate(stuOrg.exams);
            break;
        case "assignment":
            stuOrg.assignments.unshift(item);
            sortTasksByDate(stuOrg.assignments);
            break;
        case "log":
            stuOrg.log.unshift(item);
            break;
    }
    if(type != "log") {
        loadTodayPlan();
        localStorage.setItem('stuOrg', JSON.stringify(stuOrg));
    }
}

//get tasks by a specific date
function getTasksByDate(list, thisDate) {
    if(!list.length)
        return [];
    var dailyTasks = [], otherDate;
    for(var i = 0; i < list.length; i++) {
        otherDate = new Date(list[i].dDay);
        if(thisDate.getMonth() == otherDate.getMonth() &&
            thisDate.getDate() == otherDate.getDate() &&
            thisDate.getFullYear() == otherDate.getFullYear()) {
                dailyTasks.unshift(list[i]);
        }
    }
    if(dailyTasks.length) {
        return dailyTasks;
    }
    return [];
}

//get all the classes that are taking place on a specific day
function getClassesByDay(list, day) {
    var classesToday = [];
    for(var i = 0; i < list.length; i++) {
        if(list[i].dDay === day)
            classesToday.unshift(list[i]);
    }
    return classesToday;
}

//get the day back as a number 0 - 6
function getDayNumberByName(givenDay) {
    for(var i = 0; i < days.length; i++) {
        if(days[i] === givenDay)
            return i;
    }
    return null;
}

//get tasks from now on + the range given
function getTasksByTime(list, range) {
    var today = (new Date()).getTime();
    var todayPlusRange = new Date();
    todayPlusRange.setDate(todayPlusRange.getDate() + range);
    todayPlusRange = todayPlusRange.getTime();
    var monthlyTasks = [];

    for(var i = 0; i < list.length; i++) {
        if (list[i].dDay >= today && list[i].dDay < todayPlusRange)
            monthlyTasks.push(list[i]);
    }
    return monthlyTasks;
}

//sort the tasks by their date
function sortTasksByDate(list) {
    if(list.length <= 1)
        return;
    for (var i = 0; i < list.length - 1; i++) {
        if(list[i].dDay > list[i + 1].dDay) {
            var temp = list[i + 1];
            list[i + 1] = list[i];
            list[i] = temp;
        }
    }
}

//create a table as an element
function createTable(numOfRows, numOfColumns, section) {
    var tableRows = $("#" + section); //get the table body id
    for(var i = 0; i < numOfRows; i++)
        tableRows.append(createTableRow(numOfColumns));
    return tableRows;
}

//create a table row as an element
function createTableRow(length) {
    var newRow = document.createElement("TR");
    for(var i = 0; i < length; i++)
        newRow.insertCell(i);
    return newRow;
}
