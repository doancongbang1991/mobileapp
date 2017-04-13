define('skytte.numbers', function() {
    var numbers = {};

    /*
     * Clips the given value to the range defined by min and max.
     */
    numbers.clip = function(min, n, max) {
        return Math.max(min, Math.min(n, max));
    };

    /*
     * Returns 1 for positive numbers, -1 for negative numbers and 0 in other cases.
     */
    numbers.sign = function(n) {
        return (n > 0) - (n < 0);
    };

    numbers.radians = function(n) {
        return n * Math.PI / 180;
    };

    numbers.degrees = function(n) {
        return n * 180 / Math.PI;
    };

    /*
     * Modulo corrected for negavite numbers.
     */
    numbers.mod = function(n, m) {
        return ((n % m) + m) % m;
    };

    /*
     * Converts number to a hexadecimal string, prefixing with zeros if necessary.
     * Useful for converting RGB components to hexadecimal color strings.
     */
    numbers.toHex = function(n, width) {
        width = typeof width === 'undefined' ? 2 : width;
        var hex = n.toString(16);
        while (hex.length < width)
            hex = '0' + hex;
        return hex;
    };

    /*
     * Checks if value `n` is in range between `min` and `max`.
     */
    numbers.inRange = function(min, n, max, inclusive) {
        return inclusive ? (min <= n && n <= max) : (min < n && n < max);
    };

    /*
     * Converts `n` to string and inserts `separator` every 3 digits.
     */
    numbers.format = function(n, separator) {
        if (typeof separator === 'undefined')
            separator = ' ';
        return String(n).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + separator);
    };

    return numbers;
});
