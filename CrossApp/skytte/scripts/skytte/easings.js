define('skytte.easings', function() {
    var easings = {};

    easings.toggle = function(p) {
        return 2*Math.abs(p - .5);
    };

    easings.toggleShifted = function(p) {
        return 1 - easings.toggle(p);
    };

    easings.linear = function(p) {
        return p;
    };

    // Modeled after the parabola y = x^2
    easings.quadraticIn = function(p) {
        return p * p;
    };

    // Modeled after the parabola y = -x^2 + 2x
    easings.quadraticOut = function(p) {
        return -(p * (p - 2));
    };

    // Modeled after the piecewise quadratic
    // y = (1/2)((2x)^2)             ; [0, 0.5)
    // y = -(1/2)((2x-1)*(2x-3) - 1) ; [0.5, 1]
    easings.quadraticInOut = function(p) {
        if (p < 0.5)
            return 2 * p * p;
        else
            return (-2 * p * p) + (4 * p) - 1;
    };

    // Modeled after the cubic y = x^3
    easings.cubicIn = function(p) {
        return p * p * p;
    };

    // Modeled after the cubic y = (x - 1)^3 + 1
    easings.cubicOut = function(p) {
        var f = p - 1;
        return f * f * f + 1;
    };

    // Modeled after the piecewise cubic
    // y = (1/2)((2x)^3)       ; [0, 0.5)
    // y = (1/2)((2x-2)^3 + 2) ; [0.5, 1]
    easings.cubicInOut = function(p) {
        if (p < 0.5)
            return 4 * p * p * p;
        else {
            var f = ((2 * p) - 2);
            return 0.5 * f * f * f + 1;
        }
    };

    // Modeled after the quartic x^4
    easings.quarticIn = function(p) {
        return p * p * p * p;
    };

    // Modeled after the quartic y = 1 - (x - 1)^4
    easings.quarticOut = function(p) {
        var f = p - 1;
        return f * f * f * (1 - p) + 1;
    };

    // Modeled after the piecewise quartic
    // y = (1/2)((2x)^4)        ; [0, 0.5)
    // y = -(1/2)((2x-2)^4 - 2) ; [0.5, 1]
    easings.quarticInOut = function(p) {
        if (p < 0.5)
            return 8 * p * p * p * p;
        else {
            var f = p - 1;
            return -8 * f * f * f * f + 1;
        }
    };

    // Modeled after the quintic y = x^5
    easings.quinticIn = function(p) {
        return p * p * p * p * p;
    };

    // Modeled after the quintic y = (x - 1)^5 + 1
    easings.quinticOut = function(p) {
        var f = p - 1;
        return f * f * f * f * f + 1;
    };

    // Modeled after the piecewise quintic
    // y = (1/2)((2x)^5)       ; [0, 0.5)
    // y = (1/2)((2x-2)^5 + 2) ; [0.5, 1]
    easings.quinticInOut = function(p) {
        if (p < .5)
            return 16 * p * p * p * p * p;
        else {
            var f = (2*p - 2);
            return  .5 * f * f * f * f * f + 1;
        }
    };

    // Modeled after quarter-cycle of sine wave
    easings.sineIn = function(p) {
        return Math.sin((p - 1) * Math.PI / 2) + 1;
    };

    // Modeled after quarter-cycle of sine wave (different phase)
    easings.sineOut = function(p) {
        return Math.sin(p * Math.PI / 2);
    };

    // Modeled after half sine wave
    easings.sineInOut = function(p) {
        return .5 * (1 - Math.cos(p * Math.PI));
    };

    // Modeled after shifted quadrant IV of unit circle
    easings.circularIn = function(p) {
        return 1 - Math.sqrt(1 - p*p);
    };

    // Modeled after shifted quadrant II of unit circle
    easings.circularOut = function(p) {
        return Math.sqrt((2 - p) * p);
    };

    // Modeled after the piecewise circular function
    // y = (1/2)(1 - sqrt(1 - 4x^2))           ; [0, 0.5)
    // y = (1/2)(sqrt(-(2x - 3)*(2x - 1)) + 1) ; [0.5, 1]
    easings.circularInOut = function(p) {
        if (p < .5)
            return .5 * (1 - Math.sqrt(1 - 4*p*p));
        else
            return .5 * (Math.sqrt(-(2*p - 3) * (2*p - 1)) + 1);
    };

    // Modeled after the exponential function y = 2^(10(x - 1))
    easings.exponentialIn = function(p) {
        return (p == 0) ? p : Math.pow(2, 10 * (p - 1));
    };

    // Modeled after the exponential function y = -2^(-10x) + 1
    easings.exponentialOut = function(p) {
        return (p == 1) ? p : 1 - Math.pow(2, -10 * p);
    };

    // Modeled after the piecewise exponential
    // y = (1/2)2^(10(2x - 1))         ; [0,0.5)
    // y = -(1/2)*2^(-10(2x - 1))) + 1 ; [0.5,1]
    easings.exponentialInOut = function(p) {
        if (p == 0.0 || p == 1.0)
            return p;

        if (p < .5)
            return .5 * Math.pow(2, 20*p - 10);
        else
            return -.5 * Math.pow(2, -20*p + 10) + 1;
    };

    // Modeled after the damped sine wave y = sin(13pi/2*x)*pow(2, 10 * (x - 1))
    easings.elasticIn = function(p) {
        return Math.sin(13 * Math.PI / 2 * p) * Math.pow(2, 10 * (p - 1));
    };

    // Modeled after the damped sine wave y = sin(-13pi/2*(x + 1))*pow(2, -10x) + 1
    easings.elasticOut = function(p) {
        return Math.sin(-13 * Math.PI / 2 * (p + 1)) * Math.pow(2, -10 * p) + 1;
    };

    // Modeled after the piecewise exponentially-damped sine wave:
    // y = (1/2)*sin(13pi/2*(2*x))*pow(2, 10 * ((2*x) - 1))      ; [0,0.5)
    // y = (1/2)*(sin(-13pi/2*((2x-1)+1))*pow(2,-10(2*x-1)) + 2) ; [0.5, 1]
    easings.elasticInOut = function(p) {
        if (p < .5)
            return .5 * Math.sin(13 * Math.PI / 2 * 2 * p) * Math.pow(2, 10 * (2*p - 1));
        else
            return .5 * (Math.sin(-13 * Math.PI / 2 * ((2*p - 1) + 1)) * Math.pow(2, -10 * (2*p - 1)) + 2);
    };

    // Modeled after the overshooting cubic y = x^3-x*sin(x*pi)
    easings.backIn = function(p) {
        return p * p * p - p * Math.sin(p * Math.PI);
    };

    // Modeled after overshooting cubic y = 1-((1-x)^3-(1-x)*sin((1-x)*pi))
    easings.backOut = function(p) {
        var f = 1 - p;
        return 1 - (f * f * f - f * Math.sin(f * Math.PI));
    };

    // Modeled after the piecewise overshooting cubic function:
    // y = (1/2)*((2x)^3-(2x)*sin(2*x*pi))           ; [0, 0.5)
    // y = (1/2)*(1-((1-x)^3-(1-x)*sin((1-x)*pi))+1) ; [0.5, 1]
    easings.backInOut = function(p) {
        if (p < .5) {
            var f = 2 * p;
            return .5 * (f * f * f - f * Math.sin(f * Math.PI));
        } else {
            var f = (1 - (2*p - 1));
            return .5 * (1 - (f * f * f - f * Math.sin(f * Math.PI))) + .5;
        }
    };

    easings.bounceIn = function(p) {
        return 1 - easings.bounceOut(1 - p);
    };

    easings.bounceOut = function(p) {
        if (p < 4/11)
            return (121 * p * p) / 16;
        else if (p < 8/11)
            return (363/40 * p * p) - (99/10 * p) + 17/5;
        else if (p < 9/10)
            return (4356/361 * p * p) - (35442/1805 * p) + 16061/1805;
        else
            return (54/5 * p * p) - (513/25 * p) + 268/25;
    };

    easings.bounceInOut = function(p) {
        if (p < .5)
            return .5 * easings.bounceIn(p * 2);
        else
            return .5 * easings.bounceOut(p * 2 - 1) + .5;
    };

    return easings;
});
