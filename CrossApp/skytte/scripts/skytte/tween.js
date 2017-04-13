define('skytte.tween', function() {

    function Tween(begin, change, duration, easingFunc, mode) {
        this.begin = begin;
        this.change = change;
        // Do play once or repeat?
        this.mode = mode || Tween.MODE_ONCE;
        // Total time in milliseconds, how long this animation should take.
        this.duration = duration / 1000;
        this.easingFunc = easingFunc;
        this.restart();
    }

    Tween.MODE_ONCE = 'once';  // Play animation once.
    Tween.MODE_REPEAT = 'repeat';  // Repeat animation indefinitely.

    Tween.prototype.restart = function() {
        this.time = 0;
        this.hasEnded = false;
    };

    Tween.prototype.toEnd = function() {
        this.time = this.duration;
        this.value = this.begin + this.change;
        this.hasEnded = true;
    };

    Tween.prototype.logic = function(timeDelta) {
        if (this.hasEnded)
            return;

        this.value = this.begin + this.easingFunc(this.time / this.duration) * this.change;

        if (this.time >= this.duration && this.mode == Tween.MODE_REPEAT)
            this.restart();
        else
            this.time = Math.min(this.time + timeDelta, this.duration);

        if (this.time >= this.duration && this.mode == Tween.MODE_ONCE)
            this.toEnd();
    };

    Tween.prototype.toNumber = function() {
        return this.value;
    };

    return Tween;
});
