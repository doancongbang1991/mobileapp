define('skytte.per_second', function() {

    /*
     * Executes the `func` number of `timesPerSecond` (but no more than once per frame).
     */
    function PerSecond(timesPerSecond, func) {
        this.fps = timesPerSecond;
        this.func = func;
        this.delay = 0;
    }

    PerSecond.prototype.logic = function(timeDelta) {
        this.delay -= timeDelta;
        if (this.delay <= 0) {
            this.delay += 1000 / this.fps / 1000;
            this.func();
        }
    };

    return PerSecond;
});
