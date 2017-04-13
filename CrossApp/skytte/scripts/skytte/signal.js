define('skytte.signal', function() {

    function Signal() {
        this.receivers = [];
    }

    Signal.prototype.connect = function(receiver) {
        if (typeof receiver !== 'function')
            throw new Error("can't connect receiver to a signal, receiver is not a function");
        for (var i = 0; i < this.receivers.length; i++)
            if (this.receivers[i] === receiver)
                return;
        this.receivers.push(receiver);
    };

    Signal.prototype.disconnect = function(receiver) {
        for (var i = 0; i < this.receivers.length; i++)
            if (this.receivers[i] === receiver) {
                this.receivers.splice(i, 1);
                break;
            }
    };

    Signal.prototype.send = function() {
        for (var i = 0; i < this.receivers.length; i++)
            this.receivers[i].apply(this, arguments);
    };

    return Signal;
});
