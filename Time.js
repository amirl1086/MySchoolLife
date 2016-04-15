
//Time Object - an easy way to represent only hours and minutes
//globals
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

    isTimeLegal: function() {
        return ((this.hours >= 8 && this.hours <= 21) && (this.minutes >= 0 && this.minutes <= 59));
    },
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