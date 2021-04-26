const myFunctions = {  
    isInt: function(value) {
        var x;
        if (isNaN(value)) return false;
        x = parseFloat(value);
        return (x | 0) === x;
    }
}
module.exports = myFunctions;