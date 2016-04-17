## My School Life Web Application

### Summery
	This application will help the user organize his academic material schedule in an easy and a fun way.
	The user will be able to save, edit and delete tasks from his profile such as Exams, Assignments and Classes taken.
	The main view will present all the details of the user’s tasks.
	The user will find in the navigation bar 3 forms and lists, each for every kind of task, in addition to that a weekly schedule with overlapping view and a deletion of the entire history.
	Specifications
### Within the repository you will find the following
	* Index.html: the entry point and the general structure of the app.
	* Functionality.js: contains the main functionality of the app, documentation within the file.
	* Class.js, Exam.js, Assignment.js: The tasks; contains the prototype of the object and some functionally related to it.
	* Time.js: prototype that will represent a standard clock time (HH:MM).
	* Log.js: contains the log object prototype.
### Views Information
	* Navigation Bar
	 - Home – Will show the calendar
	 - Add New Class/Exam/Assignment – Will show the tasks forms to fill in (in case of classes overlapping the user will get a notice).
	* Beyond
	 - Weekly Schedule: Will show the weekly schedule that painted with blue in case of classes overlapping.
	 - Assignments/Exams/Classes List: Will show the lists of the tasks the user created.
	 - Delete History: Using local storage. The user is able to delete all of his activity in one action.
	* Calendar View
	 - Clicking on the days in the calendar will show a pop up window with the tasks currently on that day and an option to add new tasks to that day.
	 - Colors: Exams will be painted with blue, Assignments will be painted with green and a busy day (more than one tasks) will be painted with crimson.
	 - The user can move through the months of the year with the arrows on the sides of the calendar.
	* Daily Planner
		Will show the Classes on the current day, the assignments to hand in within the next week and the exams that are taking place a month since today.
	* Log
		Will show the success or failure after every action by the user.
