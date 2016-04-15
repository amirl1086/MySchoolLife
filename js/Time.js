//Time Object - an easy way to represent only hours and minutes

var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function Time(hours, minutes) {
    this.hours = hours;
    this.minutes = minutes;
}

//the prototype for Time
Time.prototype = {
    constructor: Time,

    toString: function() {
        var temp = "";
        if (this.hours < 10)
            temp += "0";
        temp += this.hours + ":";
        if (this.minutes < 10)
            temp += "0";
        temp += this.minutes;
        return temp;
    },

    //the time suppose to be between 8 am to 9 pm (8 - 21)
    isTimeLegal: function() {
        return ((this.hours >= 8 && this.hours <= 21) && (this.minutes >= 0 && this.minutes <= 59));
    },
    
    //return "< 0" if this > other, "0" if this == other and "> 0" if this < other
    equals : function(other) {
        if(this.hours > other.hours) {
            return -1;
        }
        else if(this.hours == other.hours) {
            if (this.minutes > other.minutes) {
                return -1;
            }
            else if(this.minutes == other.minutes) {
                return 0;
            }
            else {
                return 1;
            }
        }
        else {
            return 1;
        }
    }
};