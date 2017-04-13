try {
    window.sgTrackSdk = function(a, b, c, d, e, f) {
        "use strict";

        function g(a, b, d) {
            m && c && (d ? a >= 3 ? c.error(b, d) : c.log(b, d) : a >= 3 ? c.error(b) : c.log(b))
        }

        function h(a) {
            var b = a.client,
                c = a.type;
            if (!b) throw new d("no client given");
            if ("" === b.trim()) throw new d("invalid client given");
            if (!c) throw new d("no type given");
            if ("" === c.trim()) throw new d("invalid type given")
        }

        function i(b) {
            if (!l) {
                l = !0;
                var c = a.createElement("script");
                c.src = "./4399/jquery-2.1.3.min.js", c.async = !0, c.type = "text/javascript", c.onreadystatechange = c.onload = function() {
                    this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (c.onreadystatechange = c.onload = null, b())
                }, a.getElementsByTagName("head")[0].appendChild(c)
            }
        }

        function j(a) {
            try {
                if (h(a), !e) {
                    var b = new d("No jQuery loaded to track event");
                    throw b.data = {
                        client: client,
                        type: type,
                        data: data
                    }, b
                }
                var c = {
                    client: a.client,
                    type: a.type
                };
                a.countEqualValues && (c.countEqualValues = !0), a.data && (c.data = a.data);
                var f = "./tracking";
                e.ajax({
                    type: "POST",
                    url: f,
                    async: !0,
                    cache: !1,
                    data: JSON.stringify(c),
                    processData: !1,
                    dataType: "json",
                    contentType: "application/json",
                    error: function(a, b, d) {
                        g(3, "Failed to track event due to error: " + d, {
                            url: f,
                            data: c,
                            textStatus: b,
                            errorThrown: d
                        })
                    },
                    success: function(a) {
                        a.status ? g(0, "Successfully tracked event", {
                            postedData: c
                        }) : g(3, "Failed to track event due to invalid response", {
                            postedData: c,
                            response: a
                        })
                    }
                })
            } catch (b) {
                g(3, "Failed to send event due to error: " + b.message, b.data)
            }
        }
        var k = [],
            l = !1,
            e = b.jQuery;
        !e && b.SG_jQuery && (e = b.SG_jQuery);
        var m = !1;
        return {
            trackEvent: function(a, c, d, f) {
                try {
                    var h = {
                        client: a,
                        type: c
                    };
                    f && (h.countEqualValues = !0), d && (h.data = d), e ? j(h) : (k.push(h), i(function() {
                        e = b.jQuery, k.forEach(function(a) {
                            j(a)
                        }), k = []
                    }))
                } catch (l) {
                    g(3, "Failed to send event due to error: " + l.message, l.data)
                }
            },
            enableDebugging: function(a) {
                m = a ? !0 : !1
            }
        }
    }(document, window, console, Error)
} catch (error) {
    console && console.error(error)
}