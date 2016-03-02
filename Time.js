
//Time Object - an easy way to represent only hours and minutes
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
    }
};