const myFunctions = {  
    isInt: function(value) {
        var x;
        if (isNaN(value)) return false;
        x = parseFloat(value);
        return (x | 0) === x;
    },
    sqlTimestomp: function() {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
}
module.exports = myFunctions;