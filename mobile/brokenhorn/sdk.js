! function() {
    var requirejs, require, define;
    ! function(e) {
        function t(e, t) {
            return v.call(e, t)
        }

        function n(e, t) {
            var n, i, r, o, a, s, u, c, l, d, f = t && t.split("/"),
                p = g.map,
                h = p && p["*"] || {};
            if (e && "." === e.charAt(0))
                if (t) {
                    for (f = f.slice(0, f.length - 1), e = f.concat(e.split("/")), c = 0; c < e.length; c += 1)
                        if (d = e[c], "." === d) e.splice(c, 1), c -= 1;
                        else if (".." === d) {
                        if (1 === c && (".." === e[2] || ".." === e[0])) break;
                        c > 0 && (e.splice(c - 1, 2), c -= 2)
                    }
                    e = e.join("/")
                } else 0 === e.indexOf("./") && (e = e.substring(2));
            if ((f || h) && p) {
                for (n = e.split("/"), c = n.length; c > 0; c -= 1) {
                    if (i = n.slice(0, c).join("/"), f)
                        for (l = f.length; l > 0; l -= 1)
                            if (r = p[f.slice(0, l).join("/")], r && (r = r[i])) {
                                o = r, a = c;
                                break
                            }
                    if (o) break;
                    !s && h && h[i] && (s = h[i], u = c)
                }!o && s && (o = s, a = u), o && (n.splice(0, a, o), e = n.join("/"))
            }
            return e
        }

        function i(t, n) {
            return function() {
                return l.apply(e, y.call(arguments, 0).concat([t, n]))
            }
        }

        function r(e) {
            return function(t) {
                return n(t, e)
            }
        }

        function o(e) {
            return function(t) {
                p[e] = t
            }
        }

        function a(n) {
            if (t(h, n)) {
                var i = h[n];
                delete h[n], m[n] = !0, c.apply(e, i)
            }
            if (!t(p, n) && !t(m, n)) throw new Error("No " + n);
            return p[n]
        }

        function s(e) {
            var t, n = e ? e.indexOf("!") : -1;
            return n > -1 && (t = e.substring(0, n), e = e.substring(n + 1, e.length)), [t, e]
        }

        function u(e) {
            return function() {
                return g && g.config && g.config[e] || {}
            }
        }
        var c, l, d, f, p = {},
            h = {},
            g = {},
            m = {},
            v = Object.prototype.hasOwnProperty,
            y = [].slice;
        d = function(e, t) {
            var i, o = s(e),
                u = o[0];
            return e = o[1], u && (u = n(u, t), i = a(u)), u ? e = i && i.normalize ? i.normalize(e, r(t)) : n(e, t) : (e = n(e, t), o = s(e), u = o[0], e = o[1], u && (i = a(u))), {
                f: u ? u + "!" + e : e,
                n: e,
                pr: u,
                p: i
            }
        }, f = {
            require: function(e) {
                return i(e)
            },
            exports: function(e) {
                var t = p[e];
                return "undefined" != typeof t ? t : p[e] = {}
            },
            module: function(e) {
                return {
                    id: e,
                    uri: "",
                    exports: p[e],
                    config: u(e)
                }
            }
        }, c = function(n, r, s, u) {
            var c, l, g, v, y, b, w = [];
            if (u = u || n, "function" == typeof s) {
                for (r = !r.length && s.length ? ["require", "exports", "module"] : r, y = 0; y < r.length; y += 1)
                    if (v = d(r[y], u), l = v.f, "require" === l) w[y] = f.require(n);
                    else if ("exports" === l) w[y] = f.exports(n), b = !0;
                else if ("module" === l) c = w[y] = f.module(n);
                else if (t(p, l) || t(h, l) || t(m, l)) w[y] = a(l);
                else {
                    if (!v.p) throw new Error(n + " missing " + l);
                    v.p.load(v.n, i(u, !0), o(l), {}), w[y] = p[l]
                }
                g = s.apply(p[n], w), n && (c && c.exports !== e && c.exports !== p[n] ? p[n] = c.exports : g === e && b || (p[n] = g))
            } else n && (p[n] = s)
        }, requirejs = require = l = function(t, n, i, r, o) {
            return "string" == typeof t ? f[t] ? f[t](n) : a(d(t, n).f) : (t.splice || (g = t, n.splice ? (t = n, n = i, i = null) : t = e), n = n || function() {}, "function" == typeof i && (i = r, r = o), r ? c(e, t, n, i) : setTimeout(function() {
                c(e, t, n, i)
            }, 4), l)
        }, l.config = function(e) {
            return g = e, g.deps && l(g.deps, g.callback), l
        }, define = function(e, n, i) {
            n.splice || (i = n, n = []), t(p, e) || t(h, e) || (h[e] = [e, n, i])
        }, define.amd = {
            jQuery: !0
        }
    }(), define("almond", function() {}), this.JSON || (this.JSON = {}),
        function() {
            function f(e) {
                return 10 > e ? "0" + e : e
            }

            function quote(e) {
                return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function(e) {
                    var t = meta[e];
                    return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + e + '"'
            }

            function str(e, t) {
                var n, i, r, o, a, s = gap,
                    u = t[e];
                switch (u && "object" == typeof u && "function" == typeof u.toJSON && (u = u.toJSON(e)), "function" == typeof rep && (u = rep.call(t, e, u)), typeof u) {
                    case "string":
                        return quote(u);
                    case "number":
                        return isFinite(u) ? String(u) : "null";
                    case "boolean":
                    case "null":
                        return String(u);
                    case "object":
                        if (!u) return "null";
                        if (gap += indent, a = [], "[object Array]" === Object.prototype.toString.apply(u)) {
                            for (o = u.length, n = 0; o > n; n += 1) a[n] = str(n, u) || "null";
                            return r = 0 === a.length ? "[]" : gap ? "[\n" + gap + a.join(",\n" + gap) + "\n" + s + "]" : "[" + a.join(",") + "]", gap = s, r
                        }
                        if (rep && "object" == typeof rep)
                            for (o = rep.length, n = 0; o > n; n += 1) i = rep[n], "string" == typeof i && (r = str(i, u), r && a.push(quote(i) + (gap ? ": " : ":") + r));
                        else
                            for (i in u) Object.hasOwnProperty.call(u, i) && (r = str(i, u), r && a.push(quote(i) + (gap ? ": " : ":") + r));
                        return r = 0 === a.length ? "{}" : gap ? "{\n" + gap + a.join(",\n" + gap) + "\n" + s + "}" : "{" + a.join(",") + "}", gap = s, r
                }
            }
            "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
            }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
                return this.valueOf()
            });
            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                gap, indent, meta = {
                    "\b": "\\b",
                    "	": "\\t",
                    "\n": "\\n",
                    "\f": "\\f",
                    "\r": "\\r",
                    '"': '\\"',
                    "\\": "\\\\"
                },
                rep;
            "function" != typeof JSON.stringify && (JSON.stringify = function(e, t, n) {
                var i;
                if (gap = "", indent = "", "number" == typeof n)
                    for (i = 0; n > i; i += 1) indent += " ";
                else "string" == typeof n && (indent = n); if (rep = t, t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length)) throw new Error("JSON.stringify");
                return str("", {
                    "": e
                })
            }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
                function walk(e, t) {
                    var n, i, r = e[t];
                    if (r && "object" == typeof r)
                        for (n in r) Object.hasOwnProperty.call(r, n) && (i = walk(r, n), void 0 !== i ? r[n] = i : delete r[n]);
                    return reviver.call(e, t, r)
                }
                var j;
                if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(e) {
                    return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                    "": j
                }, "") : j;
                throw new SyntaxError("JSON.parse")
            })
        }(), define("easyXDM/json2", function() {}),
        function() {
            var e = this,
                t = e._,
                n = {},
                i = Array.prototype,
                r = Object.prototype,
                o = Function.prototype,
                a = i.push,
                s = i.slice,
                u = i.concat,
                c = r.toString,
                l = r.hasOwnProperty,
                d = Array.isArray,
                f = Object.keys,
                p = o.bind,
                h = function(e) {
                    return e instanceof h ? e : this instanceof h ? void(this._wrapped = e) : new h(e)
                };
            h.VERSION = "1.6.0", h.each = h.forEach = function(e, t, i) {
                if (null == e) return e;
                if (e.length === +e.length) {
                    for (var r = 0, o = e.length; o > r; r++)
                        if (t.call(i, e[r], r, e) === n) return
                } else
                    for (var a = h.keys(e), r = 0, o = a.length; o > r; r++)
                        if (t.call(i, e[a[r]], a[r], e) === n) return; return e
            }, h.map = h.collect = function(e, t, n) {
                var i = [];
                return null == e ? i : (h.each(e, function(e, r, o) {
                    i.push(t.call(n, e, r, o))
                }), i)
            };
            var g = "Reduce of empty array with no initial value";
            h.reduce = h.foldl = h.inject = function(e, t, n, i) {
                var r = arguments.length > 2;
                if (null == e && (e = []), h.each(e, function(e, o, a) {
                    r ? n = t.call(i, n, e, o, a) : (n = e, r = !0)
                }), !r) throw new TypeError(g);
                return n
            }, h.reduceRight = h.foldr = function(e, t, n, i) {
                var r = arguments.length > 2;
                null == e && (e = []);
                var o = e.length;
                if (o !== +o) {
                    var a = h.keys(e);
                    o = a.length
                }
                if (h.each(e, function(s, u, c) {
                    u = a ? a[--o] : --o, r ? n = t.call(i, n, e[u], u, c) : (n = e[u], r = !0)
                }), !r) throw new TypeError(g);
                return n
            }, h.find = h.detect = function(e, t, n) {
                var i;
                return h.some(e, function(e, r, o) {
                    return t.call(n, e, r, o) ? (i = e, !0) : void 0
                }), i
            }, h.filter = h.select = function(e, t, n) {
                var i = [];
                return null == e ? i : (h.each(e, function(e, r, o) {
                    t.call(n, e, r, o) && i.push(e)
                }), i)
            }, h.reject = function(e, t, n) {
                return h.filter(e, h.negate(t), n)
            }, h.every = h.all = function(e, t, i) {
                t || (t = h.identity);
                var r = !0;
                return null == e ? r : (h.each(e, function(e, o, a) {
                    return (r = r && t.call(i, e, o, a)) ? void 0 : n
                }), !!r)
            }, h.some = h.any = function(e, t, i) {
                t || (t = h.identity);
                var r = !1;
                return null == e ? r : (h.each(e, function(e, o, a) {
                    return r || (r = t.call(i, e, o, a)) ? n : void 0
                }), !!r)
            }, h.contains = h.include = function(e, t) {
                return null == e ? !1 : e.length === +e.length ? h.indexOf(e, t) >= 0 : h.some(e, function(e) {
                    return e === t
                })
            }, h.invoke = function(e, t) {
                var n = s.call(arguments, 2),
                    i = h.isFunction(t);
                return h.map(e, function(e) {
                    return (i ? t : e[t]).apply(e, n)
                })
            }, h.pluck = function(e, t) {
                return h.map(e, h.property(t))
            }, h.where = function(e, t) {
                return h.filter(e, h.matches(t))
            }, h.findWhere = function(e, t) {
                return h.find(e, h.matches(t))
            }, h.max = function(e, t, n) {
                var i, r, o = -1 / 0,
                    a = -1 / 0;
                if (!t && h.isArray(e))
                    for (var s = 0, u = e.length; u > s; s++) i = e[s], i > o && (o = i);
                else h.each(e, function(e, i, s) {
                    r = t ? t.call(n, e, i, s) : e, (r > a || r === -1 / 0 && o === -1 / 0) && (o = e, a = r)
                });
                return o
            }, h.min = function(e, t, n) {
                var i, r, o = 1 / 0,
                    a = 1 / 0;
                if (!t && h.isArray(e))
                    for (var s = 0, u = e.length; u > s; s++) i = e[s], o > i && (o = i);
                else h.each(e, function(e, i, s) {
                    r = t ? t.call(n, e, i, s) : e, (a > r || 1 / 0 === r && 1 / 0 === o) && (o = e, a = r)
                });
                return o
            }, h.shuffle = function(e) {
                var t, n = 0,
                    i = [];
                return h.each(e, function(e) {
                    t = h.random(n++), i[n - 1] = i[t], i[t] = e
                }), i
            }, h.sample = function(e, t, n) {
                return null == t || n ? (e.length !== +e.length && (e = h.values(e)), e[h.random(e.length - 1)]) : h.shuffle(e).slice(0, Math.max(0, t))
            };
            var m = function(e, t) {
                return null == e ? h.identity : h.isFunction(e) ? t ? function() {
                    return e.apply(t, arguments)
                } : e : h.property(e)
            };
            h.sortBy = function(e, t, n) {
                return t = m(t, n), h.pluck(h.map(e, function(e, n, i) {
                    return {
                        value: e,
                        index: n,
                        criteria: t(e, n, i)
                    }
                }).sort(function(e, t) {
                    var n = e.criteria,
                        i = t.criteria;
                    if (n !== i) {
                        if (n > i || void 0 === n) return 1;
                        if (i > n || void 0 === i) return -1
                    }
                    return e.index - t.index
                }), "value")
            };
            var v = function(e) {
                return function(t, n, i) {
                    var r = {};
                    return n = m(n, i), h.each(t, function(i, o) {
                        var a = n(i, o, t);
                        e(r, i, a)
                    }), r
                }
            };
            h.groupBy = v(function(e, t, n) {
                h.has(e, n) ? e[n].push(t) : e[n] = [t]
            }), h.indexBy = v(function(e, t, n) {
                e[n] = t
            }), h.countBy = v(function(e, t, n) {
                h.has(e, n) ? e[n]++ : e[n] = 1
            }), h.sortedIndex = function(e, t, n, i) {
                n = m(n, i);
                for (var r = n(t), o = 0, a = e.length; a > o;) {
                    var s = o + a >>> 1;
                    n(e[s]) < r ? o = s + 1 : a = s
                }
                return o
            }, h.toArray = function(e) {
                return e ? h.isArray(e) ? s.call(e) : e.length === +e.length ? h.map(e, h.identity) : h.values(e) : []
            }, h.size = function(e) {
                return null == e ? 0 : e.length === +e.length ? e.length : h.keys(e).length
            }, h.first = h.head = h.take = function(e, t, n) {
                return null == e ? void 0 : null == t || n ? e[0] : 0 > t ? [] : s.call(e, 0, t)
            }, h.initial = function(e, t, n) {
                return s.call(e, 0, Math.max(0, e.length - (null == t || n ? 1 : t)))
            }, h.last = function(e, t, n) {
                return null == e ? void 0 : null == t || n ? e[e.length - 1] : s.call(e, Math.max(e.length - t, 0))
            }, h.rest = h.tail = h.drop = function(e, t, n) {
                return s.call(e, null == t || n ? 1 : t)
            }, h.compact = function(e) {
                return h.filter(e, h.identity)
            };
            var y = function(e, t, n, i) {
                if (t && h.every(e, h.isArray)) return u.apply(i, e);
                for (var r = 0, o = e.length; o > r; r++) {
                    var s = e[r];
                    h.isArray(s) || h.isArguments(s) ? t ? a.apply(i, s) : y(s, t, n, i) : n || i.push(s)
                }
                return i
            };
            h.flatten = function(e, t) {
                return y(e, t, !1, [])
            }, h.without = function(e) {
                return h.difference(e, s.call(arguments, 1))
            }, h.partition = function(e, t, n) {
                t = m(t, n);
                var i = [],
                    r = [];
                return h.each(e, function(e, n, o) {
                    (t(e, n, o) ? i : r).push(e)
                }), [i, r]
            }, h.uniq = h.unique = function(e, t, n, i) {
                if (null == e) return [];
                h.isFunction(t) && (i = n, n = t, t = !1);
                for (var r = [], o = [], a = 0, s = e.length; s > a; a++) {
                    var u = e[a];
                    n && (u = n.call(i, u, a, e)), (t ? a && o === u : h.contains(o, u)) || (t ? o = u : o.push(u), r.push(e[a]))
                }
                return r
            }, h.union = function() {
                return h.uniq(y(arguments, !0, !0, []))
            }, h.intersection = function(e) {
                if (null == e) return [];
                for (var t = [], n = arguments.length, i = 0, r = e.length; r > i; i++) {
                    var o = e[i];
                    if (!h.contains(t, o)) {
                        for (var a = 1; n > a && h.contains(arguments[a], o); a++);
                        a === n && t.push(o)
                    }
                }
                return t
            }, h.difference = function(e) {
                var t = y(s.call(arguments, 1), !0, !0, []);
                return h.filter(e, function(e) {
                    return !h.contains(t, e)
                })
            }, h.zip = function() {
                for (var e = h.max(h.pluck(arguments, "length").concat(0)), t = new Array(e), n = 0; e > n; n++) t[n] = h.pluck(arguments, "" + n);
                return t
            }, h.object = function(e, t) {
                if (null == e) return {};
                for (var n = {}, i = 0, r = e.length; r > i; i++) t ? n[e[i]] = t[i] : n[e[i][0]] = e[i][1];
                return n
            }, h.indexOf = function(e, t, n) {
                if (null == e) return -1;
                var i = 0,
                    r = e.length;
                if (n) {
                    if ("number" != typeof n) return i = h.sortedIndex(e, t), e[i] === t ? i : -1;
                    i = 0 > n ? Math.max(0, r + n) : n
                }
                for (; r > i; i++)
                    if (e[i] === t) return i;
                return -1
            }, h.lastIndexOf = function(e, t, n) {
                if (null == e) return -1;
                for (var i = null == n ? e.length : n; i--;)
                    if (e[i] === t) return i;
                return -1
            }, h.range = function(e, t, n) {
                arguments.length <= 1 && (t = e || 0, e = 0), n = arguments[2] || 1;
                for (var i = Math.max(Math.ceil((t - e) / n), 0), r = 0, o = new Array(i); i > r;) o[r++] = e, e += n;
                return o
            };
            var b = function() {};
            h.bind = function(e, t) {
                var n, i;
                if (p && e.bind === p) return p.apply(e, s.call(arguments, 1));
                if (!h.isFunction(e)) throw new TypeError("Bind must be called on a function");
                return n = s.call(arguments, 2), i = function() {
                    if (!(this instanceof i)) return e.apply(t, n.concat(s.call(arguments)));
                    b.prototype = e.prototype;
                    var r = new b;
                    b.prototype = null;
                    var o = e.apply(r, n.concat(s.call(arguments)));
                    return Object(o) === o ? o : r
                }
            }, h.partial = function(e) {
                var t = s.call(arguments, 1);
                return function() {
                    for (var n = 0, i = t.slice(), r = 0, o = i.length; o > r; r++) i[r] === h && (i[r] = arguments[n++]);
                    for (; n < arguments.length;) i.push(arguments[n++]);
                    return e.apply(this, i)
                }
            }, h.bindAll = function(e) {
                var t = s.call(arguments, 1);
                if (0 === t.length) throw new Error("bindAll must be passed function names");
                return h.each(t, function(t) {
                    e[t] = h.bind(e[t], e)
                }), e
            }, h.memoize = function(e, t) {
                var n = {};
                return t || (t = h.identity),
                    function() {
                        var i = t.apply(this, arguments);
                        return h.has(n, i) ? n[i] : n[i] = e.apply(this, arguments)
                    }
            }, h.delay = function(e, t) {
                var n = s.call(arguments, 2);
                return setTimeout(function() {
                    return e.apply(null, n)
                }, t)
            }, h.defer = function(e) {
                return h.delay.apply(h, [e, 1].concat(s.call(arguments, 1)))
            }, h.throttle = function(e, t, n) {
                var i, r, o, a = null,
                    s = 0;
                n || (n = {});
                var u = function() {
                    s = n.leading === !1 ? 0 : h.now(), a = null, o = e.apply(i, r), i = r = null
                };
                return function() {
                    var c = h.now();
                    s || n.leading !== !1 || (s = c);
                    var l = t - (c - s);
                    return i = this, r = arguments, 0 >= l || l > t ? (clearTimeout(a), a = null, s = c, o = e.apply(i, r), i = r = null) : a || n.trailing === !1 || (a = setTimeout(u, l)), o
                }
            }, h.debounce = function(e, t, n) {
                var i, r, o, a, s, u = function() {
                    var c = h.now() - a;
                    t > c && c > 0 ? i = setTimeout(u, t - c) : (i = null, n || (s = e.apply(o, r), o = r = null))
                };
                return function() {
                    o = this, r = arguments, a = h.now();
                    var c = n && !i;
                    return i || (i = setTimeout(u, t)), c && (s = e.apply(o, r), o = r = null), s
                }
            }, h.once = function(e) {
                var t, n = !1;
                return function() {
                    return n ? t : (n = !0, t = e.apply(this, arguments), e = null, t)
                }
            }, h.wrap = function(e, t) {
                return h.partial(t, e)
            }, h.negate = function(e) {
                return function() {
                    return !e.apply(this, arguments)
                }
            }, h.compose = function() {
                var e = arguments;
                return function() {
                    for (var t = arguments, n = e.length - 1; n >= 0; n--) t = [e[n].apply(this, t)];
                    return t[0]
                }
            }, h.after = function(e, t) {
                return function() {
                    return --e < 1 ? t.apply(this, arguments) : void 0
                }
            }, h.keys = function(e) {
                if (!h.isObject(e)) return [];
                if (f) return f(e);
                var t = [];
                for (var n in e) h.has(e, n) && t.push(n);
                return t
            }, h.values = function(e) {
                for (var t = h.keys(e), n = t.length, i = new Array(n), r = 0; n > r; r++) i[r] = e[t[r]];
                return i
            }, h.pairs = function(e) {
                for (var t = h.keys(e), n = t.length, i = new Array(n), r = 0; n > r; r++) i[r] = [t[r], e[t[r]]];
                return i
            }, h.invert = function(e) {
                for (var t = {}, n = h.keys(e), i = 0, r = n.length; r > i; i++) t[e[n[i]]] = n[i];
                return t
            }, h.functions = h.methods = function(e) {
                var t = [];
                for (var n in e) h.isFunction(e[n]) && t.push(n);
                return t.sort()
            }, h.extend = function(e) {
                return h.isObject(e) ? (h.each(s.call(arguments, 1), function(t) {
                    for (var n in t) e[n] = t[n]
                }), e) : e
            }, h.pick = function(e, t, n) {
                var i = {};
                if (h.isFunction(t))
                    for (var r in e) {
                        var o = e[r];
                        t.call(n, o, r, e) && (i[r] = o)
                    } else
                        for (var a = u.apply([], s.call(arguments, 1)), c = 0, l = a.length; l > c; c++) {
                            var r = a[c];
                            r in e && (i[r] = e[r])
                        }
                return i
            }, h.omit = function(e, t, n) {
                var i;
                return h.isFunction(t) ? t = h.negate(t) : (i = h.map(u.apply([], s.call(arguments, 1)), String), t = function(e, t) {
                    return !h.contains(i, t)
                }), h.pick(e, t, n)
            }, h.defaults = function(e) {
                return h.isObject(e) ? (h.each(s.call(arguments, 1), function(t) {
                    for (var n in t) void 0 === e[n] && (e[n] = t[n])
                }), e) : e
            }, h.clone = function(e) {
                return h.isObject(e) ? h.isArray(e) ? e.slice() : h.extend({}, e) : e
            }, h.tap = function(e, t) {
                return t(e), e
            };
            var w = function(e, t, n, i) {
                if (e === t) return 0 !== e || 1 / e == 1 / t;
                if (null == e || null == t) return e === t;
                e instanceof h && (e = e._wrapped), t instanceof h && (t = t._wrapped);
                var r = c.call(e);
                if (r != c.call(t)) return !1;
                switch (r) {
                    case "[object String]":
                        return e == String(t);
                    case "[object Number]":
                        return e != +e ? t != +t : 0 == e ? 1 / e == 1 / t : e == +t;
                    case "[object Date]":
                    case "[object Boolean]":
                        return +e == +t;
                    case "[object RegExp]":
                        return e.source == t.source && e.global == t.global && e.multiline == t.multiline && e.ignoreCase == t.ignoreCase
                }
                if ("object" != typeof e || "object" != typeof t) return !1;
                for (var o = n.length; o--;)
                    if (n[o] == e) return i[o] == t;
                var a = e.constructor,
                    s = t.constructor;
                if (a !== s && !(h.isFunction(a) && a instanceof a && h.isFunction(s) && s instanceof s) && "constructor" in e && "constructor" in t) return !1;
                n.push(e), i.push(t);
                var u = 0,
                    l = !0;
                if ("[object Array]" == r) {
                    if (u = e.length, l = u == t.length)
                        for (; u-- && (l = w(e[u], t[u], n, i)););
                } else {
                    for (var d in e)
                        if (h.has(e, d) && (u++, !(l = h.has(t, d) && w(e[d], t[d], n, i)))) break;
                    if (l) {
                        for (d in t)
                            if (h.has(t, d) && !u--) break;
                        l = !u
                    }
                }
                return n.pop(), i.pop(), l
            };
            h.isEqual = function(e, t) {
                return w(e, t, [], [])
            }, h.isEmpty = function(e) {
                if (null == e) return !0;
                if (h.isArray(e) || h.isString(e) || h.isArguments(e)) return 0 === e.length;
                for (var t in e)
                    if (h.has(e, t)) return !1;
                return !0
            }, h.isElement = function(e) {
                return !(!e || 1 !== e.nodeType)
            }, h.isArray = d || function(e) {
                return "[object Array]" == c.call(e)
            }, h.isObject = function(e) {
                return e === Object(e)
            }, h.each(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(e) {
                h["is" + e] = function(t) {
                    return c.call(t) == "[object " + e + "]"
                }
            }), h.isArguments(arguments) || (h.isArguments = function(e) {
                return !(!e || !h.has(e, "callee"))
            }), "function" != typeof / . / && (h.isFunction = function(e) {
                return "function" == typeof e
            }), h.isFinite = function(e) {
                return isFinite(e) && !isNaN(parseFloat(e))
            }, h.isNaN = function(e) {
                return h.isNumber(e) && e != +e
            }, h.isBoolean = function(e) {
                return e === !0 || e === !1 || "[object Boolean]" == c.call(e)
            }, h.isNull = function(e) {
                return null === e
            }, h.isUndefined = function(e) {
                return void 0 === e
            }, h.has = function(e, t) {
                return l.call(e, t)
            }, h.noConflict = function() {
                return e._ = t, this
            }, h.identity = function(e) {
                return e
            }, h.constant = function(e) {
                return function() {
                    return e
                }
            }, h.noop = function() {}, h.property = function(e) {
                return function(t) {
                    return t[e]
                }
            }, h.matches = function(e) {
                return function(t) {
                    if (null == t) return h.isEmpty(e);
                    if (t === e) return !0;
                    for (var n in e)
                        if (e[n] !== t[n]) return !1;
                    return !0
                }
            }, h.times = function(e, t, n) {
                for (var i = Array(Math.max(0, e)), r = 0; e > r; r++) i[r] = t.call(n, r);
                return i
            }, h.random = function(e, t) {
                return null == t && (t = e, e = 0), e + Math.floor(Math.random() * (t - e + 1))
            }, h.now = Date.now || function() {
                return (new Date).getTime()
            };
            var _ = {
                escape: {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#x27;"
                }
            };
            _.unescape = h.invert(_.escape);
            var k = {
                escape: new RegExp("[" + h.keys(_.escape).join("") + "]", "g"),
                unescape: new RegExp("(" + h.keys(_.unescape).join("|") + ")", "g")
            };
            h.each(["escape", "unescape"], function(e) {
                h[e] = function(t) {
                    return null == t ? "" : ("" + t).replace(k[e], function(t) {
                        return _[e][t]
                    })
                }
            }), h.result = function(e, t) {
                if (null == e) return void 0;
                var n = e[t];
                return h.isFunction(n) ? e[t]() : n
            }, h.mixin = function(e) {
                h.each(h.functions(e), function(t) {
                    var n = h[t] = e[t];
                    h.prototype[t] = function() {
                        var e = [this._wrapped];
                        return a.apply(e, arguments), T.call(this, n.apply(h, e))
                    }
                })
            };
            var x = 0;
            h.uniqueId = function(e) {
                var t = ++x + "";
                return e ? e + t : t
            }, h.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            };
            var S = /(.)^/,
                E = {
                    "'": "'",
                    "\\": "\\",
                    "\r": "r",
                    "\n": "n",
                    "\u2028": "u2028",
                    "\u2029": "u2029"
                },
                O = /\\|'|\r|\n|\u2028|\u2029/g,
                R = function(e) {
                    return "\\" + E[e]
                };
            h.template = function(e, t, n) {
                n = h.defaults({}, n, h.templateSettings);
                var i = new RegExp([(n.escape || S).source, (n.interpolate || S).source, (n.evaluate || S).source].join("|") + "|$", "g"),
                    r = 0,
                    o = "__p+='";
                e.replace(i, function(t, n, i, a, s) {
                    return o += e.slice(r, s).replace(O, R), r = s + t.length, n ? o += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'" : i ? o += "'+\n((__t=(" + i + "))==null?'':__t)+\n'" : a && (o += "';\n" + a + "\n__p+='"), t
                }), o += "';\n", n.variable || (o = "with(obj||{}){\n" + o + "}\n"), o = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + o + "return __p;\n";
                try {
                    var a = new Function(n.variable || "obj", "_", o)
                } catch (s) {
                    throw s.source = o, s
                }
                if (t) return a(t, h);
                var u = function(e) {
                        return a.call(this, e, h)
                    },
                    c = n.variable || "obj";
                return u.source = "function(" + c + "){\n" + o + "}", u
            }, h.chain = function(e) {
                return h(e).chain()
            };
            var T = function(e) {
                return this._chain ? h(e).chain() : e
            };
            h.mixin(h), h.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(e) {
                var t = i[e];
                h.prototype[e] = function() {
                    var n = this._wrapped;
                    return t.apply(n, arguments), "shift" != e && "splice" != e || 0 !== n.length || delete n[0], T.call(this, n)
                }
            }), h.each(["concat", "join", "slice"], function(e) {
                var t = i[e];
                h.prototype[e] = function() {
                    return T.call(this, t.apply(this._wrapped, arguments))
                }
            }), h.extend(h.prototype, {
                chain: function() {
                    return this._chain = !0, this
                },
                value: function() {
                    return this._wrapped
                }
            }), "function" == typeof define && define.amd && define("underscore", [], function() {
                return h
            })
        }.call(this), define("utils/wrapper", ["underscore"], function(e) {
            return function(t) {
                if (t && t.hasOwnProperty("hasCallback")) return t;
                var n;
                return e.isFunction(t) ? (n = function(n) {
                    var i = n;
                    if (n || (i = null), e.isString(n)) try {
                        i = JSON.parse(n)
                    } catch (r) {
                        window.console && (console.log(r), console.log(n))
                    }
                    return t(i)
                }, n.hasCallback = !0) : (n = function() {
                    return null
                }, n.hasCallback = !1), n
            }
        }), define("utils/dom_ready", [], function() {
            function e() {
                if (n) {
                    for (var e; e = n.shift();) e();
                    n = null
                }
            }

            function t(e) {
                return n ? void n.push(e) : void e()
            }
            var n, i = "readyState" in document ? /loaded|complete/.test(document.readyState) : !!document.body;
            if (!i && (n = [], document.addEventListener ? (document.addEventListener("DOMContentLoaded", e, !1), window.addEventListener("load", e, !1)) : document.attachEvent && (document.attachEvent("onreadystatechange", e), window.attachEvent("onload", e)), document.documentElement.doScroll && window == window.top)) {
                var r = function() {
                    try {
                        document.documentElement.doScroll("left")
                    } catch (t) {
                        return void setTimeout(r, 0)
                    }
                    e()
                };
                r()
            }
            return t
        }), define("utils/dom_helper", {
            hasClass: function(e, t) {
                var n = " " + t + " ";
                return n.indexOf(" " + e.className + " ") >= 0
            },
            addClass: function(e, t) {
                this.hasClass(e, t) || (e.className = e.className ? e.className + " " + t : t)
            },
            removeClass: function(e, t) {
                if (this.hasClass(e, t)) {
                    var n = new RegExp("(?:^|\\s)" + t + "(?!\\S)", "g");
                    e.className = e.className.replace(n, "").trim()
                }
            },
            on: function(e, t, n) {
                window.attachEvent ? e.attachEvent("on" + t, n) : e.addEventListener(t, n, !1)
            },
            addEventListener: function(e, t, n) {
                "addEventListener" in window ? e.addEventListener(t, n, !1) : "attachEvent" in window && e.attachEvent("on" + t, n)
            },
            removeEventListener: function(e, t, n) {
                e && ("removeEventListener" in window ? e.removeEventListener(t, n, !1) : "detachEvent" in window && e.detachEvent("on" + t, n))
            }
        }), define("utils/uri_helper", ["underscore"], function(e) {
            var t = function(n, i) {
                    var r = [];
                    if (e.isObject(i))
                        for (var o in i) i.hasOwnProperty(o) && r.push(t(n + "[" + o + "]", i[o]));
                    else r.push(n + "=" + encodeURIComponent(i));
                    return r.join("&")
                },
                n = function(n) {
                    if (e.isString(n)) return n;
                    var i = [];
                    for (var r in n) e.has(n, r) && i.push(t(r, n[r]));
                    return i.join("&")
                },
                i = function(e, t) {
                    var i = n(t);
                    return i ? e + (e.indexOf("?") > -1 ? "&" : "?") + i : e
                };
            return {
                buildQuery: n,
                appendToUrl: i
            }
        }),
        function(e, t, n, i, r, o) {
            function a(e, t) {
                var n = typeof e[t];
                return "function" == n || !("object" != n || !e[t]) || "unknown" == n
            }

            function s(e, t) {
                return !("object" != typeof e[t] || !e[t])
            }

            function u(e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            }

            function c() {
                var e = "Shockwave Flash",
                    t = "application/x-shockwave-flash";
                if (!b(navigator.plugins) && "object" == typeof navigator.plugins[e]) {
                    var n = navigator.plugins[e].description;
                    n && !b(navigator.mimeTypes) && navigator.mimeTypes[t] && navigator.mimeTypes[t].enabledPlugin && (T = n.match(/\d+/g))
                }
                if (!T) {
                    var i;
                    try {
                        i = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), T = Array.prototype.slice.call(i.GetVariable("$version").match(/(\d+),(\d+),(\d+),(\d+)/), 1), i = null
                    } catch (r) {}
                }
                if (!T) return !1;
                var o = parseInt(T[0], 10),
                    a = parseInt(T[1], 10);
                return C = o > 9 && a > 0, !0
            }

            function l() {
                if (!W) {
                    W = !0;
                    for (var e = 0; e < q.length; e++) q[e]();
                    q.length = 0
                }
            }

            function d(e, t) {
                return W ? void e.call(t) : void q.push(function() {
                    e.call(t)
                })
            }

            function f() {
                var e = parent;
                if ("" !== N)
                    for (var t = 0, n = N.split("."); t < n.length; t++) e = e[n[t]];
                return e.easyXDM
            }

            function p(t) {
                return e.easyXDM = B, N = t, N && (U = "easyXDM_" + N.replace(".", "_") + "_"), F
            }

            function h(e) {
                return e.match(I)[3]
            }

            function g(e) {
                return e.match(I)[4] || ""
            }

            function m(e) {
                var t = e.toLowerCase().match(I),
                    n = t[2],
                    i = t[3],
                    r = t[4] || "";
                return ("http:" == n && ":80" == r || "https:" == n && ":443" == r) && (r = ""), n + "//" + i + r
            }

            function v(e) {
                if (e = e.replace(L, "$1/"), !e.match(/^(http||https):\/\//)) {
                    var t = "/" === e.substring(0, 1) ? "" : n.pathname;
                    "/" !== t.substring(t.length - 1) && (t = t.substring(0, t.lastIndexOf("/") + 1)), e = n.protocol + "//" + n.host + t + e
                }
                for (; D.test(e);) e = e.replace(D, "");
                return e
            }

            function y(e, t) {
                var n = "",
                    i = e.indexOf("#"); - 1 !== i && (n = e.substring(i), e = e.substring(0, i));
                var r = [];
                for (var a in t) t.hasOwnProperty(a) && r.push(a + "=" + o(t[a]));
                return e + (X ? "#" : -1 == e.indexOf("?") ? "?" : "&") + r.join("&") + n
            }

            function b(e) {
                return "undefined" == typeof e
            }

            function w(e, t, n) {
                var i;
                for (var r in t) t.hasOwnProperty(r) && (r in e ? (i = t[r], "object" == typeof i ? w(e[r], i, n) : n || (e[r] = t[r])) : e[r] = t[r]);
                return e
            }

            function _() {
                var e = t.body.appendChild(t.createElement("form")),
                    n = e.appendChild(t.createElement("input"));
                n.name = U + "TEST" + H, R = n !== e.elements[n.name], t.body.removeChild(e)
            }

            function k(e) {
                b(R) && _();
                var n;
                R ? n = t.createElement('<iframe name="' + e.props.name + '"/>') : (n = t.createElement("IFRAME"), n.name = e.props.name), n.id = n.name = e.props.name, delete e.props.name, "string" == typeof e.container && (e.container = t.getElementById(e.container)), e.container || (w(n.style, {
                    position: "absolute",
                    top: "-2000px",
                    left: "0px"
                }), e.container = t.body);
                var i = e.props.src;
                if (e.props.src = "javascript:false", w(n, e.props), n.border = n.frameBorder = 0, n.allowTransparency = !0, e.container.appendChild(n), e.onLoad && A(n, "load", e.onLoad), e.usePost) {
                    var r, o = e.container.appendChild(t.createElement("form"));
                    if (o.target = n.name, o.action = i, o.method = "POST", "object" == typeof e.usePost)
                        for (var a in e.usePost) e.usePost.hasOwnProperty(a) && (R ? r = t.createElement('<input name="' + a + '"/>') : (r = t.createElement("INPUT"), r.name = a), r.value = e.usePost[a], o.appendChild(r));
                    o.submit(), o.parentNode.removeChild(o)
                } else n.src = i;
                return e.props.src = i, n
            }

            function x(e, t) {
                "string" == typeof e && (e = [e]);
                for (var n, i = e.length; i--;)
                    if (n = e[i], n = new RegExp("^" == n.substr(0, 1) ? n : "^" + n.replace(/(\*)/g, ".$1").replace(/\?/g, ".") + "$"), n.test(t)) return !0;
                return !1
            }

            function S(i) {
                var r, o = i.protocol;
                if (i.isHost = i.isHost || b(G.xdm_p), X = i.hash || !1, i.props || (i.props = {}), i.isHost) i.remote = v(i.remote), i.channel = i.channel || "default" + H++, i.secret = Math.random().toString(16).substring(2), b(o) && (o = m(n.href) == m(i.remote) ? "4" : a(e, "postMessage") || a(t, "postMessage") ? "1" : i.swf && a(e, "ActiveXObject") && c() ? "6" : "Gecko" === navigator.product && "frameElement" in e && -1 == navigator.userAgent.indexOf("WebKit") ? "5" : i.remoteHelper ? "2" : "0");
                else if (i.channel = G.xdm_c.replace(/["'<>\\]/g, ""), i.secret = G.xdm_s, i.remote = G.xdm_e.replace(/["'<>\\]/g, ""), o = G.xdm_p, i.acl && !x(i.acl, i.remote)) throw new Error("Access denied for " + i.remote);
                switch (i.protocol = o, o) {
                    case "0":
                        if (w(i, {
                            interval: 100,
                            delay: 2e3,
                            useResize: !0,
                            useParent: !1,
                            usePolling: !1
                        }, !0), i.isHost) {
                            if (!i.local) {
                                for (var s, u = n.protocol + "//" + n.host, l = t.body.getElementsByTagName("img"), d = l.length; d--;)
                                    if (s = l[d], s.src.substring(0, u.length) === u) {
                                        i.local = s.src;
                                        break
                                    }
                                i.local || (i.local = e)
                            }
                            var f = {
                                xdm_c: i.channel,
                                xdm_p: 0
                            };
                            i.local === e ? (i.usePolling = !0, i.useParent = !0, i.local = n.protocol + "//" + n.host + n.pathname + n.search, f.xdm_e = i.local, f.xdm_pa = 1) : f.xdm_e = v(i.local), i.container && (i.useResize = !1, f.xdm_po = 1), i.remote = y(i.remote, f)
                        } else w(i, {
                            channel: G.xdm_c,
                            remote: G.xdm_e,
                            useParent: !b(G.xdm_pa),
                            usePolling: !b(G.xdm_po),
                            useResize: i.useParent ? !1 : i.useResize
                        });
                        r = [new F.stack.HashTransport(i), new F.stack.ReliableBehavior({}), new F.stack.QueueBehavior({
                            encode: !0,
                            maxLength: 4e3 - i.remote.length
                        }), new F.stack.VerifyBehavior({
                            initiate: i.isHost
                        })];
                        break;
                    case "1":
                        r = [new F.stack.PostMessageTransport(i)];
                        break;
                    case "2":
                        i.isHost && (i.remoteHelper = v(i.remoteHelper)), r = [new F.stack.NameTransport(i), new F.stack.QueueBehavior, new F.stack.VerifyBehavior({
                            initiate: i.isHost
                        })];
                        break;
                    case "3":
                        r = [new F.stack.NixTransport(i)];
                        break;
                    case "4":
                        r = [new F.stack.SameOriginTransport(i)];
                        break;
                    case "5":
                        r = [new F.stack.FrameElementTransport(i)];
                        break;
                    case "6":
                        T || c(), r = [new F.stack.FlashTransport(i)]
                }
                return r.push(new F.stack.QueueBehavior({
                    lazy: i.lazy,
                    remove: !0
                })), r
            }

            function E(e) {
                for (var t, n = {
                    incoming: function(e, t) {
                        this.up.incoming(e, t)
                    },
                    outgoing: function(e, t) {
                        this.down.outgoing(e, t)
                    },
                    callback: function(e) {
                        this.up.callback(e)
                    },
                    init: function() {
                        this.down.init()
                    },
                    destroy: function() {
                        this.down.destroy()
                    }
                }, i = 0, r = e.length; r > i; i++) t = e[i], w(t, n, !0), 0 !== i && (t.down = e[i - 1]), i !== r - 1 && (t.up = e[i + 1]);
                return t
            }

            function O(e) {
                e.up.down = e.down, e.down.up = e.up, e.up = e.down = null
            }
            var R, T, C, A, M, j = this,
                H = Math.floor(1e4 * Math.random()),
                P = Function.prototype,
                I = /^((http.?:)\/\/([^:\/\s]+)(:\d+)*)/,
                D = /[\-\w]+\/\.\.\//,
                L = /([^:])\/\//g,
                N = "",
                F = {},
                B = e.easyXDM,
                U = "easyXDM_",
                X = !1;
            if (a(e, "addEventListener")) A = function(e, t, n) {
                e.addEventListener(t, n, !1)
            }, M = function(e, t, n) {
                e.removeEventListener(t, n, !1)
            };
            else {
                if (!a(e, "attachEvent")) throw new Error("Browser not supported");
                A = function(e, t, n) {
                    e.attachEvent("on" + t, n)
                }, M = function(e, t, n) {
                    e.detachEvent("on" + t, n)
                }
            }
            var z, W = !1,
                q = [];
            if ("readyState" in t ? (z = t.readyState, W = "complete" == z || ~navigator.userAgent.indexOf("AppleWebKit/") && ("loaded" == z || "interactive" == z)) : W = !!t.body, !W) {
                if (a(e, "addEventListener")) A(t, "DOMContentLoaded", l);
                else if (A(t, "readystatechange", function() {
                    "complete" == t.readyState && l()
                }), t.documentElement.doScroll && e === top) {
                    var J = function() {
                        if (!W) {
                            try {
                                t.documentElement.doScroll("left")
                            } catch (e) {
                                return void i(J, 1)
                            }
                            l()
                        }
                    };
                    J()
                }
                A(e, "load", l)
            }
            var G = function(e) {
                    e = e.substring(1).split("&");
                    for (var t, n = {}, i = e.length; i--;) t = e[i].split("="), n[t[0]] = r(t[1]);
                    return n
                }(/xdm_e=/.test(n.search) ? n.search : n.hash),
                Q = function() {
                    var e = {},
                        t = {
                            a: [1, 2, 3]
                        },
                        n = '{"a":[1,2,3]}';
                    return "undefined" != typeof JSON && "function" == typeof JSON.stringify && JSON.stringify(t).replace(/\s/g, "") === n ? JSON : (Object.toJSON && Object.toJSON(t).replace(/\s/g, "") === n && (e.stringify = Object.toJSON), "function" == typeof String.prototype.evalJSON && (t = n.evalJSON(), t.a && 3 === t.a.length && 3 === t.a[2] && (e.parse = function(e) {
                        return e.evalJSON()
                    })), e.stringify && e.parse ? (Q = function() {
                        return e
                    }, e) : null)
                };
            w(F, {
                    version: "2.4.18.25",
                    query: G,
                    stack: {},
                    apply: w,
                    getJSONObject: Q,
                    whenReady: d,
                    noConflict: p
                }), F.DomHelper = {
                    on: A,
                    un: M,
                    requiresJSON: function(n) {
                        s(e, "JSON") || t.write('<script type="text/javascript" src="' + n + '"></script>')
                    }
                },
                function() {
                    var e = {};
                    F.Fn = {
                        set: function(t, n) {
                            e[t] = n
                        },
                        get: function(t, n) {
                            var i = e[t];
                            return n && delete e[t], i
                        }
                    }
                }(), F.Socket = function(e) {
                    var t = E(S(e).concat([{
                            incoming: function(t, n) {
                                e.onMessage(t, n)
                            },
                            callback: function(t) {
                                e.onReady && e.onReady(t)
                            }
                        }])),
                        n = m(e.remote);
                    this.origin = m(e.remote), this.destroy = function() {
                        t.destroy()
                    }, this.postMessage = function(e) {
                        t.outgoing(e, n)
                    }, t.init()
                }, F.Rpc = function(e, t) {
                    if (t.local)
                        for (var n in t.local)
                            if (t.local.hasOwnProperty(n)) {
                                var i = t.local[n];
                                "function" == typeof i && (t.local[n] = {
                                    method: i
                                })
                            }
                    var r = E(S(e).concat([new F.stack.RpcBehavior(this, t), {
                        callback: function(t) {
                            e.onReady && e.onReady(t)
                        }
                    }]));
                    this.origin = m(e.remote), this.destroy = function() {
                        r.destroy()
                    }, r.init()
                }, F.stack.SameOriginTransport = function(e) {
                    var t, r, o, a;
                    return t = {
                        outgoing: function(e, t, n) {
                            o(e), n && n()
                        },
                        destroy: function() {
                            r && (r.parentNode.removeChild(r), r = null)
                        },
                        onDOMReady: function() {
                            a = m(e.remote), e.isHost ? (w(e.props, {
                                src: y(e.remote, {
                                    xdm_e: n.protocol + "//" + n.host + n.pathname,
                                    xdm_c: e.channel,
                                    xdm_p: 4
                                }),
                                name: U + e.channel + "_provider"
                            }), r = k(e), F.Fn.set(e.channel, function(e) {
                                return o = e, i(function() {
                                        t.up.callback(!0)
                                    }, 0),
                                    function(e) {
                                        t.up.incoming(e, a)
                                    }
                            })) : (o = f().Fn.get(e.channel, !0)(function(e) {
                                t.up.incoming(e, a)
                            }), i(function() {
                                t.up.callback(!0)
                            }, 0))
                        },
                        init: function() {
                            d(t.onDOMReady, t)
                        }
                    }
                }, F.stack.FlashTransport = function(e) {
                    function r(e) {
                        i(function() {
                            s.up.incoming(e, c)
                        }, 0)
                    }

                    function a(n) {
                        var i = e.swf + "?host=" + e.isHost,
                            r = "easyXDM_swf_" + Math.floor(1e4 * Math.random());
                        F.Fn.set("flash_loaded" + n.replace(/[\-.]/g, "_"), function() {
                            F.stack.FlashTransport[n].swf = l = f.firstChild;
                            for (var e = F.stack.FlashTransport[n].queue, t = 0; t < e.length; t++) e[t]();
                            e.length = 0
                        }), e.swfContainer ? f = "string" == typeof e.swfContainer ? t.getElementById(e.swfContainer) : e.swfContainer : (f = t.createElement("div"), w(f.style, C && e.swfNoThrottle ? {
                            height: "20px",
                            width: "20px",
                            position: "fixed",
                            right: 0,
                            top: 0
                        } : {
                            height: "1px",
                            width: "1px",
                            position: "absolute",
                            overflow: "hidden",
                            right: 0,
                            top: 0
                        }), t.body.appendChild(f));
                        var a = "callback=flash_loaded" + o(n.replace(/[\-.]/g, "_")) + "&proto=" + j.location.protocol + "&domain=" + o(h(j.location.href)) + "&port=" + o(g(j.location.href)) + "&ns=" + o(N);
                        f.innerHTML = "<object height='20' width='20' type='application/x-shockwave-flash' id='" + r + "' data='" + i + "'><param name='allowScriptAccess' value='always'></param><param name='wmode' value='transparent'><param name='movie' value='" + i + "'></param><param name='flashvars' value='" + a + "'></param><embed type='application/x-shockwave-flash' FlashVars='" + a + "' allowScriptAccess='always' wmode='transparent' src='" + i + "' height='1' width='1'></embed></object>"
                    }
                    var s, u, c, l, f;
                    return s = {
                        outgoing: function(t, n, i) {
                            l.postMessage(e.channel, t.toString()), i && i()
                        },
                        destroy: function() {
                            try {
                                l.destroyChannel(e.channel)
                            } catch (t) {}
                            l = null, u && (u.parentNode.removeChild(u), u = null)
                        },
                        onDOMReady: function() {
                            c = e.remote, F.Fn.set("flash_" + e.channel + "_init", function() {
                                i(function() {
                                    s.up.callback(!0)
                                })
                            }), F.Fn.set("flash_" + e.channel + "_onMessage", r), e.swf = v(e.swf);
                            var t = h(e.swf),
                                o = function() {
                                    F.stack.FlashTransport[t].init = !0, l = F.stack.FlashTransport[t].swf, l.createChannel(e.channel, e.secret, m(e.remote), e.isHost), e.isHost && (C && e.swfNoThrottle && w(e.props, {
                                        position: "fixed",
                                        right: 0,
                                        top: 0,
                                        height: "20px",
                                        width: "20px"
                                    }), w(e.props, {
                                        src: y(e.remote, {
                                            xdm_e: m(n.href),
                                            xdm_c: e.channel,
                                            xdm_p: 6,
                                            xdm_s: e.secret
                                        }),
                                        name: U + e.channel + "_provider"
                                    }), u = k(e))
                                };
                            F.stack.FlashTransport[t] && F.stack.FlashTransport[t].init ? o() : F.stack.FlashTransport[t] ? F.stack.FlashTransport[t].queue.push(o) : (F.stack.FlashTransport[t] = {
                                queue: [o]
                            }, a(t))
                        },
                        init: function() {
                            d(s.onDOMReady, s)
                        }
                    }
                }, F.stack.PostMessageTransport = function(t) {
                    function r(e) {
                        if (e.origin) return m(e.origin);
                        if (e.uri) return m(e.uri);
                        if (e.domain) return n.protocol + "//" + e.domain;
                        throw "Unable to retrieve the origin of the event"
                    }

                    function o(e) {
                        var n = r(e);
                        n == c && e.data.substring(0, t.channel.length + 1) == t.channel + " " && a.up.incoming(e.data.substring(t.channel.length + 1), n)
                    }
                    var a, s, u, c;
                    return a = {
                        outgoing: function(e, n, i) {
                            u.postMessage(t.channel + " " + e, n || c), i && i()
                        },
                        destroy: function() {
                            M(e, "message", o), s && (u = null, s.parentNode.removeChild(s), s = null)
                        },
                        onDOMReady: function() {
                            if (c = m(t.remote), t.isHost) {
                                var r = function(n) {
                                    n.data == t.channel + "-ready" && (u = "postMessage" in s.contentWindow ? s.contentWindow : s.contentWindow.document, M(e, "message", r), A(e, "message", o), i(function() {
                                        a.up.callback(!0)
                                    }, 0))
                                };
                                A(e, "message", r), w(t.props, {
                                    src: y(t.remote, {
                                        xdm_e: m(n.href),
                                        xdm_c: t.channel,
                                        xdm_p: 1
                                    }),
                                    name: U + t.channel + "_provider"
                                }), s = k(t)
                            } else A(e, "message", o), u = "postMessage" in e.parent ? e.parent : e.parent.document, u.postMessage(t.channel + "-ready", c), i(function() {
                                a.up.callback(!0)
                            }, 0)
                        },
                        init: function() {
                            d(a.onDOMReady, a)
                        }
                    }
                }, F.stack.FrameElementTransport = function(r) {
                    var o, a, s, u;
                    return o = {
                        outgoing: function(e, t, n) {
                            s.call(this, e), n && n()
                        },
                        destroy: function() {
                            a && (a.parentNode.removeChild(a), a = null)
                        },
                        onDOMReady: function() {
                            u = m(r.remote), r.isHost ? (w(r.props, {
                                src: y(r.remote, {
                                    xdm_e: m(n.href),
                                    xdm_c: r.channel,
                                    xdm_p: 5
                                }),
                                name: U + r.channel + "_provider"
                            }), a = k(r), a.fn = function(e) {
                                return delete a.fn, s = e, i(function() {
                                        o.up.callback(!0)
                                    }, 0),
                                    function(e) {
                                        o.up.incoming(e, u)
                                    }
                            }) : (t.referrer && m(t.referrer) != G.xdm_e && (e.top.location = G.xdm_e), s = e.frameElement.fn(function(e) {
                                o.up.incoming(e, u)
                            }), o.up.callback(!0))
                        },
                        init: function() {
                            d(o.onDOMReady, o)
                        }
                    }
                }, F.stack.NameTransport = function(e) {
                    function t(t) {
                        var n = e.remoteHelper + (s ? "#_3" : "#_2") + e.channel;
                        u.contentWindow.sendMessage(t, n)
                    }

                    function n() {
                        s ? 2 !== ++l && s || a.up.callback(!0) : (t("ready"), a.up.callback(!0))
                    }

                    function r(e) {
                        a.up.incoming(e, p)
                    }

                    function o() {
                        f && i(function() {
                            f(!0)
                        }, 0)
                    }
                    var a, s, u, c, l, f, p, h;
                    return a = {
                        outgoing: function(e, n, i) {
                            f = i, t(e)
                        },
                        destroy: function() {
                            u.parentNode.removeChild(u), u = null, s && (c.parentNode.removeChild(c), c = null)
                        },
                        onDOMReady: function() {
                            s = e.isHost, l = 0, p = m(e.remote), e.local = v(e.local), s ? (F.Fn.set(e.channel, function(t) {
                                s && "ready" === t && (F.Fn.set(e.channel, r), n())
                            }), h = y(e.remote, {
                                xdm_e: e.local,
                                xdm_c: e.channel,
                                xdm_p: 2
                            }), w(e.props, {
                                src: h + "#" + e.channel,
                                name: U + e.channel + "_provider"
                            }), c = k(e)) : (e.remoteHelper = e.remote, F.Fn.set(e.channel, r));
                            var t = function() {
                                var r = u || this;
                                M(r, "load", t), F.Fn.set(e.channel + "_load", o),
                                    function a() {
                                        "function" == typeof r.contentWindow.sendMessage ? n() : i(a, 50)
                                    }()
                            };
                            u = k({
                                props: {
                                    src: e.local + "#_4" + e.channel
                                },
                                onLoad: t
                            })
                        },
                        init: function() {
                            d(a.onDOMReady, a)
                        }
                    }
                }, F.stack.HashTransport = function(t) {
                    function n(e) {
                        if (g) {
                            var n = t.remote + "#" + p+++"_" + e;
                            (u || !v ? g.contentWindow : g).location = n
                        }
                    }

                    function r(e) {
                        f = e, s.up.incoming(f.substring(f.indexOf("_") + 1), y)
                    }

                    function o() {
                        if (h) {
                            var e = h.location.href,
                                t = "",
                                n = e.indexOf("#"); - 1 != n && (t = e.substring(n)), t && t != f && r(t)
                        }
                    }

                    function a() {
                        c = setInterval(o, l)
                    }
                    var s, u, c, l, f, p, h, g, v, y;
                    return s = {
                        outgoing: function(e) {
                            n(e)
                        },
                        destroy: function() {
                            e.clearInterval(c), (u || !v) && g.parentNode.removeChild(g), g = null
                        },
                        onDOMReady: function() {
                            if (u = t.isHost, l = t.interval, f = "#" + t.channel, p = 0, v = t.useParent, y = m(t.remote), u) {
                                if (w(t.props, {
                                    src: t.remote,
                                    name: U + t.channel + "_provider"
                                }), v) t.onLoad = function() {
                                    h = e, a(), s.up.callback(!0)
                                };
                                else {
                                    var n = 0,
                                        r = t.delay / 50;
                                    ! function o() {
                                        if (++n > r) throw new Error("Unable to reference listenerwindow");
                                        try {
                                            h = g.contentWindow.frames[U + t.channel + "_consumer"]
                                        } catch (e) {}
                                        h ? (a(), s.up.callback(!0)) : i(o, 50)
                                    }()
                                }
                                g = k(t)
                            } else h = e, a(), v ? (g = parent, s.up.callback(!0)) : (w(t, {
                                props: {
                                    src: t.remote + "#" + t.channel + new Date,
                                    name: U + t.channel + "_consumer"
                                },
                                onLoad: function() {
                                    s.up.callback(!0)
                                }
                            }), g = k(t))
                        },
                        init: function() {
                            d(s.onDOMReady, s)
                        }
                    }
                }, F.stack.ReliableBehavior = function() {
                    var e, t, n = 0,
                        i = 0,
                        r = "";
                    return e = {
                        incoming: function(o, a) {
                            var s = o.indexOf("_"),
                                u = o.substring(0, s).split(",");
                            o = o.substring(s + 1), u[0] == n && (r = "", t && t(!0)), o.length > 0 && (e.down.outgoing(u[1] + "," + n + "_" + r, a), i != u[1] && (i = u[1], e.up.incoming(o, a)))
                        },
                        outgoing: function(o, a, s) {
                            r = o, t = s, e.down.outgoing(i + "," + ++n + "_" + o, a)
                        }
                    }
                }, F.stack.QueueBehavior = function(e) {
                    function t() {
                        if (e.remove && 0 === s.length) return void O(n);
                        if (!u && 0 !== s.length && !a) {
                            u = !0;
                            var r = s.shift();
                            n.down.outgoing(r.data, r.origin, function(e) {
                                u = !1, r.callback && i(function() {
                                    r.callback(e)
                                }, 0), t()
                            })
                        }
                    }
                    var n, a, s = [],
                        u = !0,
                        c = "",
                        l = 0,
                        d = !1,
                        f = !1;
                    return n = {
                        init: function() {
                            b(e) && (e = {}), e.maxLength && (l = e.maxLength, f = !0), e.lazy ? d = !0 : n.down.init()
                        },
                        callback: function(e) {
                            u = !1;
                            var i = n.up;
                            t(), i.callback(e)
                        },
                        incoming: function(t, i) {
                            if (f) {
                                var o = t.indexOf("_"),
                                    a = parseInt(t.substring(0, o), 10);
                                c += t.substring(o + 1), 0 === a && (e.encode && (c = r(c)), n.up.incoming(c, i), c = "")
                            } else n.up.incoming(t, i)
                        },
                        outgoing: function(i, r, a) {
                            e.encode && (i = o(i));
                            var u, c = [];
                            if (f) {
                                for (; 0 !== i.length;) u = i.substring(0, l), i = i.substring(u.length), c.push(u);
                                for (; u = c.shift();) s.push({
                                    data: c.length + "_" + u,
                                    origin: r,
                                    callback: 0 === c.length ? a : null
                                })
                            } else s.push({
                                data: i,
                                origin: r,
                                callback: a
                            });
                            d ? n.down.init() : t()
                        },
                        destroy: function() {
                            a = !0, n.down.destroy()
                        }
                    }
                }, F.stack.VerifyBehavior = function(e) {
                    function t() {
                        i = Math.random().toString(16).substring(2), n.down.outgoing(i)
                    }
                    var n, i, r;
                    return n = {
                        incoming: function(o, a) {
                            var s = o.indexOf("_"); - 1 === s ? o === i ? n.up.callback(!0) : r || (r = o, e.initiate || t(), n.down.outgoing(o)) : o.substring(0, s) === r && n.up.incoming(o.substring(s + 1), a)
                        },
                        outgoing: function(e, t, r) {
                            n.down.outgoing(i + "_" + e, t, r)
                        },
                        callback: function() {
                            e.initiate && t()
                        }
                    }
                }, F.stack.RpcBehavior = function(e, t) {
                    function n(e) {
                        e.jsonrpc = "2.0", o.down.outgoing(a.stringify(e))
                    }

                    function i(e, t) {
                        var i = Array.prototype.slice;
                        return function() {
                            var r, o = arguments.length,
                                a = {
                                    method: t
                                };
                            o > 0 && "function" == typeof arguments[o - 1] ? (o > 1 && "function" == typeof arguments[o - 2] ? (r = {
                                success: arguments[o - 2],
                                error: arguments[o - 1]
                            }, a.params = i.call(arguments, 0, o - 2)) : (r = {
                                success: arguments[o - 1]
                            }, a.params = i.call(arguments, 0, o - 1)), c["" + ++s] = r, a.id = s) : a.params = i.call(arguments, 0), e.namedParams && 1 === a.params.length && (a.params = a.params[0]), n(a)
                        }
                    }

                    function r(e, t, i, r) {
                        if (!i) return void(t && n({
                            id: t,
                            error: {
                                code: -32601,
                                message: "Procedure not found."
                            }
                        }));
                        var o, a;
                        t ? (o = function(e) {
                            o = P, n({
                                id: t,
                                result: e
                            })
                        }, a = function(e, i) {
                            a = P;
                            var r = {
                                id: t,
                                error: {
                                    code: -32099,
                                    message: e
                                }
                            };
                            i && (r.error.data = i), n(r)
                        }) : o = a = P, u(r) || (r = [r]);
                        try {
                            var s = i.method.apply(i.scope, r.concat([o, a]));
                            b(s) || o(s)
                        } catch (c) {
                            a(c.message)
                        }
                    }
                    var o, a = t.serializer || Q(),
                        s = 0,
                        c = {};
                    return o = {
                        incoming: function(e) {
                            var i = a.parse(e);
                            if (i.method) t.handle ? t.handle(i, n) : r(i.method, i.id, t.local[i.method], i.params);
                            else {
                                var o = c[i.id];
                                i.error ? o.error && o.error(i.error) : o.success && o.success(i.result), delete c[i.id]
                            }
                        },
                        init: function() {
                            if (t.remote)
                                for (var n in t.remote) t.remote.hasOwnProperty(n) && (e[n] = i(t.remote[n], n));
                            o.down.init()
                        },
                        destroy: function() {
                            for (var n in t.remote) t.remote.hasOwnProperty(n) && e.hasOwnProperty(n) && delete e[n];
                            o.down.destroy()
                        }
                    }
                }, j.easyXDM = F
        }(window, document, location, window.setTimeout, decodeURIComponent, encodeURIComponent), define("easyXDM/easyXDM", function(e) {
            return function() {
                var t, n;
                return n = function() {
                    return this.easyXDM.noConflict()
                }, t = n.apply(e, arguments)
            }
        }(this)), define("utils/guid", [], function() {
            return function() {
                return "id-" + (Math.random() * (1 << 30)).toString(16).replace(".", "")
            }
        }), define("event", [], function() {
            return {
                subscribers: function() {
                    return this._subscribersMap || (this._subscribersMap = {}), this._subscribersMap
                },
                subscribe: function(e, t) {
                    var n = this.subscribers();
                    n[e] ? n[e].push(t) : n[e] = [t]
                },
                unsubscribe: function(e, t) {
                    var n = this.subscribers()[e];
                    if (n)
                        for (var i = 0; i < n.length; i++)
                            if (n[i] === t) {
                                n.splice(i, 1);
                                break
                            }
                },
                monitor: function(e, t) {
                    if (!t()) {
                        var n = this,
                            i = function() {
                                t.apply(t, arguments) && n.unsubscribe(e, i)
                            };
                        this.subscribe(e, i)
                    }
                },
                clear: function(e) {
                    delete this.subscribers()[e]
                },
                fire: function(e) {
                    var t, n = Array.prototype.slice.call(arguments, 1),
                        i = this.subscribers()[e];
                    if (i)
                        for (var r = 0; r < i.length; r++) t = i[r], t && t.apply(this, n)
                }
            }
        }), define("utils/user_agent", [], function() {
            function e() {
                if (!g) {
                    g = !0;
                    var e = navigator.userAgent,
                        m = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))/.exec(e),
                        v = /(Mac OS X)|(Windows)|(Linux)/.exec(e);
                    if (d = /\b(iPhone|iP[ao]d)/.exec(e), f = /\b(iP[ao]d)/.exec(e), c = /Android/i.exec(e), p = /FBAN\/\w+;/i.exec(e), h = /Mobile/i.exec(e), l = !!/Win64/.exec(e), m ? (t = m[1] ? parseFloat(m[1]) : 0 / 0, t && document.documentMode && (t = document.documentMode), n = m[2] ? parseFloat(m[2]) : 0 / 0, i = m[3] ? parseFloat(m[3]) : 0 / 0, r = m[4] ? parseFloat(m[4]) : 0 / 0, r ? (m = /(?:Chrome\/(\d+\.\d+))/.exec(e), o = m && m[1] ? parseFloat(m[1]) : 0 / 0) : o = 0 / 0) : t = n = i = o = r = 0 / 0, v) {
                        if (v[1]) {
                            var y = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(e);
                            a = y ? parseFloat(y[1].replace("_", ".")) : !0
                        } else a = !1;
                        s = !!v[2], u = !!v[3]
                    } else a = s = u = !1
                }
            }
            var t, n, i, r, o, a, s, u, c, l, d, f, p, h, g = !1,
                m = {
                    ie: function() {
                        return e() || t
                    },
                    ie64: function() {
                        return m.ie() && l
                    },
                    firefox: function() {
                        return e() || n
                    },
                    opera: function() {
                        return e() || i
                    },
                    webkit: function() {
                        return e() || r
                    },
                    safari: function() {
                        return m.webkit()
                    },
                    chrome: function() {
                        return e() || o
                    },
                    windows: function() {
                        return e() || s
                    },
                    osx: function() {
                        return e() || a
                    },
                    linux: function() {
                        return e() || u
                    },
                    iphone: function() {
                        return e() || d
                    },
                    mobile: function() {
                        return e() || d || f || c || h
                    },
                    nativeApp: function() {
                        return e() || p
                    },
                    android: function() {
                        return e() || c
                    },
                    ipad: function() {
                        return e() || f
                    }
                };
            return m
        }), define("dialog/position", ["event", "utils/user_agent"], function(e, t) {
            return {
                pos: function() {
                    function e(e, n, i) {
                        var r, o;
                        r = (e.docHeight() - i) / 2, o = (e.docWidth() - n) / 2, r = 10 > r ? 10 : r, o = 0 > o ? 0 : o, t.mobile() && (r += document.body.scrollTop), e.setTop(r), e.setLeft(o)
                    }
                    this.subscribe("dialog.resize", function(t, n) {
                        e(this, t, n)
                    }), e(this, this.width(), this.height())
                },
                docTop: function() {
                    return document.documentElement.scrollTop || document.body.scrollTop
                },
                docWidth: function() {
                    return self.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
                },
                docHeight: function() {
                    return self.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
                },
                hide: function() {
                    this.hidden = !0, this.setTop(-1e4), this.hideMask(), e.fire("dialog.hide", this)
                },
                show: function() {
                    this.hidden = !1, this.pos(), this.showMask(), e.fire("dialog.show", this)
                },
                resizeMask: function() {
                    var e = document.body,
                        t = document.documentElement;
                    this.mask.style.height = Math.max(Math.max(e.scrollHeight, t.scrollHeight), Math.max(e.clientHeight, t.clientHeight)) + "px", this.mask.style.width = Math.max(Math.max(e.scrollWidth, t.scrollWidth), Math.max(e.clientWidth, t.clientWidth)) + "px"
                },
                showMask: function() {
                    this.resizeMask(), this.mask.style.display = "block"
                },
                hideMask: function() {
                    this.mask.style.display = "none"
                }
            }
        }), define("dialog/resize", ["underscore", "dialog/position"], function(e, t) {
            function n(e, t, n, i, r) {
                var o = t - e,
                    a = e + Math.pow(1 / n * i, r) * o;
                return Math.ceil(a)
            }
            var i = e.extend({}, t);
            return i.animate = function(t, i, r, o, a, s, u, c) {
                if (a && s && u) {
                    var l = t,
                        d = i,
                        f = r,
                        p = o,
                        h = u,
                        g = u;
                    this.ai && window.clearInterval(this.ai);
                    var m = 0;
                    this.ai = window.setInterval(e.bind(function() {
                        t > i && (h = 1 / u), r > o && (g = 1 / u);
                        var e = n(l, d, a, m, h),
                            s = n(f, p, a, m, g);
                        this.setWidth(e), this.setHeight(s), m++, m > a && (window.clearInterval(this.ai), this.inform("dialog.resize", i, o, c)), this.pos()
                    }, this), s)
                }
            }, i.resize = function(e, t, n) {
                return this.animate(this.width(), e, this.height(), t, 30, 1, 2, n), this
            }, i
        }), define("observable", ["underscore"], function(e) {
            return {
                inform: function(e) {
                    for (var t = Array.prototype.slice.call(arguments, 1), n = Array.prototype.slice.call(this.getSubscribers(e)), i = 0; i < n.length; i++)
                        if (null !== n[i]) try {
                            n[i].apply(this, t)
                        } catch (r) {
                            setTimeout(function() {
                                throw r
                            }, 0)
                        }
                        return this
                },
                getSubscribers: function(e) {
                    return this.__observableEvents[e] || (this.__observableEvents[e] = [])
                },
                clearSubscribers: function(e) {
                    return e && (this.__observableEvents[e] = []), this
                },
                clearAllSubscribers: function() {
                    return this.__observableEvents = {}, this
                },
                subscribe: function(e, t) {
                    var n = this.getSubscribers(e);
                    return n.push(t), this
                },
                unsubscribe: function(e, t) {
                    for (var n = this.getSubscribers(e), i = 0; i < n.length; i++)
                        if (n[i] === t) {
                            n.splice(i, 1);
                            break
                        }
                    return this
                },
                monitor: function(t, n) {
                    if (!n()) {
                        var i = e.bind(function() {
                            n.apply(n, arguments) && this.unsubscribe(t, i)
                        }, this);
                        this.subscribe(t, i)
                    }
                    return this
                }
            }
        }), define("utils/constants", {
            root_url: "https://www.id.net",
            tracking_url: "http://cdn.id.net/api/tracking.html",
            analytics_url: "https://t.id.net/log",
            playtomic_url: "https://playtomic.id.net/v1",
            cdnUrl: "https://scdn.id.net",
            y8_appid: "4fbb62b133968d57c10041b0",
            iframe_width: 433,
            iframe_height: 300,
            name_helper_url: "https://scdn.id.net/Xd/name.html",
            xd_handler_helper_url: "https://scdn.id.net/Xd/xd_handler.html?version=37",
            assetsRootUrl: function() {
                return "https:" == document.location.protocol ? "https://scdn.id.net" : "http://cdn.id.net"
            }
        }), define("dialog", ["underscore", "easyXDM/easyXDM", "utils/guid", "utils/dom_helper", "dialog/resize", "observable", "utils/user_agent", "utils/constants"], function(e, t, n, i, r, o, a, s) {
            var u = function() {
                this.hidden = !0, this.mask = null, this.id = n(), this.__observableEvents = {}, this.elt = this.create(), this.contentWidth = null, this.contentHeight = null
            };
            return u.prototype = e.extend(u.prototype, r), u.prototype = e.extend(u.prototype, o), u.prototype.create = function() {
                if (this.elt) return this.elt;
                var t, n, r, o;
                return o = document.createElement("div"), i.addClass(o, "id-dialog-mask"), this.mask = o, i.on(window, "resize", e.bind(function() {
                    this.resizeMask()
                }, this)), t = document.createElement("div"), i.addClass(t, "id-dialog-box"), n = document.createElement("div"), i.addClass(n, "id-dialog-inner"), r = document.createElement("div"), i.addClass(r, "id-dialog-content"), r.appendChild(n), t.appendChild(r), document.body.appendChild(o), t.style.top = "-10000px", t.style.display = "block", t.style.left = this.docWidth() / 2 + "px", this.innerElt = n, t.setAttribute("style", "position:absolute; z-index:9000; overflow:hidden;"), r.style.overflow = "hidden", n.setAttribute("style", "background: url(" + s.assetsRootUrl() + "/assets/tinybox/preload.gif) no-repeat 50% 50%; overflow:hidden; line-height:0;"), o.setAttribute("style", 'position:absolute; top:0px; left:0px; height:100%; width:100%; background:#000; z-index:800; opacity:0.8; -moz-opacity:0.8; filter:alpha(opacity=80); overflow:hidden; zoom:1; -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)"; -khtml-opacity:0.5;'), this.subscribe("dialog.resize", function(e, n) {
                    var i = document.body,
                        r = document.documentElement,
                        o = Math.max(i.scrollHeight, i.offsetHeight, r.clientHeight, r.scrollHeight, r.offsetHeight),
                        a = o - 20;
                    this.contentHeight && (a = this.contentHeight);
                    var s = n > a;
                    t.style.width = e + "px", s ? (t.style.height = a + "px", t.style.overflowY = "scroll") : (t.style.height = n + "px", t.style.overflowY = "visible"), this.resizeMask()
                }), t
            }, u.prototype.destroy = function() {
                this.hide(), document.body.removeChild(this.mask);
                var t = function() {
                    this.__observableEvents = {}, this.elt.parentNode.removeChild(this.elt)
                };
                return window.setTimeout(e.bind(t, this), 5e3), !0
            }, u.prototype.findContent = function() {
                return this.innerElt
            }, u.prototype.visible = function() {
                return this.hidden
            }, u.prototype.replaceContent = function(t) {
                t && (e.isString(t) ? this.findContent().innerHTML = t : (this.findContent().innerHTML = "", this.findContent().appendChild(t)))
            }, u.prototype.setWidth = function(e) {
                this.innerElt && (this.innerElt.style.width = e + "px")
            }, u.prototype.setHeight = function(e) {
                this.innerElt && (this.innerElt.style.height = e + "px")
            }, u.prototype.setTop = function(e) {
                this.elt && (this.elt.style.top = e + "px")
            }, u.prototype.setLeft = function(e) {
                this.elt && (this.elt.style.left = e + "px")
            }, u.prototype.width = function() {
                return this.innerElt.offsetWidth
            }, u.prototype.height = function() {
                return this.innerElt.offsetHeight
            }, u.prototype.top = function() {
                return this.elt.offsetTop
            }, u.prototype.left = function() {
                return this.elt.offsetLeft
            }, u.prototype.call = function(e) {
                return this.called ? void 0 : (this.called = !0, this.successFn(e))
            }, u.prototype.error = function(e, t) {
                return this.errorFn(e, t)
            }, u.prototype.scrollBarWidth = function() {
                return 30
            }, u
        }), define("utils/hide_plugin", ["underscore", "easyXDM/easyXDM", "rpc", "event"], function(e, t, n, i) {
            function r(e) {
                e._hideunity_savedstyle = {}, e._hideunity_savedstyle.left = e.style.left, e._hideunity_savedstyle.position = e.style.position, e._hideunity_savedstyle.width = e.style.width, e._hideunity_savedstyle.height = e.style.height, e.style.left = "-10000px", e.style.position = "absolute", e.style.width = "1px", e.style.height = "1px"
            }

            function o(e) {
                e._hideunity_savedstyle && (e.style.left = e._hideunity_savedstyle.left, e.style.position = e._hideunity_savedstyle.position, e.style.width = e._hideunity_savedstyle.width, e.style.height = e._hideunity_savedstyle.height)
            }

            function a(e) {
                e._old_visibility = e.style.visibility, e.style.visibility = "hidden"
            }

            function s(e) {
                e.style.visibility = e._old_visibility || "", delete e._old_visibility
            }

            function u(e) {
                var t = e.type ? e.type.toLowerCase() : null,
                    n = "application/x-shockwave-flash" === t || e.classid && e.classid.toUpperCase() == g;
                if (!n) return !1;
                var i = /opaque|transparent/i;
                if (i.test(e.getAttribute("wmode"))) return !1;
                for (var r = 0; r < e.childNodes.length; r++) {
                    var o = e.childNodes[r];
                    if (/param/i.test(o.nodeName) && /wmode/i.test(o.name) && i.test(o.value)) return !1
                }
                return !0
            }

            function c(e) {
                var t = e.type ? e.type.toLowerCase() : null;
                return "application/vnd.unity" === t || e.classid && e.classid.toUpperCase() == m
            }

            function l(t) {
                var n = e.union(e.toArray(window.document.getElementsByTagName("object")), e.toArray(window.document.getElementsByTagName("embed")));
                e.each(n, function(e) {
                    var n = u(e),
                        i = c(e);
                    if (n || i) {
                        var l = function() {
                            "opened" === t.state ? n ? a(e) : i && r(e) : n ? s(e) : i && o(e)
                        };
                        if (v) {
                            var d = {
                                state: t.state,
                                element: e
                            };
                            v(d), setTimeout(l, 200)
                        } else l()
                    }
                })
            }

            function d(e) {
                u(e) ? a(e) : c(e) && r(e)
            }

            function f(e) {
                u(e) ? s(e) : c(e) && o(e)
            }

            function p() {
                l({
                    state: "opened"
                })
            }

            function h() {
                l({
                    state: "closed"
                })
            }
            var g = "CLSID:D27CDB6E-AE6D-11CF-96B8-444553540000",
                m = "CLSID:444785F1-DE89-4295-863A-D46C3A781394",
                v = null;
            return i.subscribe("dialog.show", p), i.subscribe("dialog.hide", h), {
                _setHidePluginCallback: function(e) {
                    v = e
                },
                hidePluginElement: d,
                showPluginElement: f,
                hidePluginObjects: p,
                showPluginObjects: h
            }
        }), define("runtime", ["underscore", "utils/dom_ready", "utils/hide_plugin", "event"], function(e, t, n, i) {
            return {
                __options: {},
                setOptions: function(e) {
                    n._setHidePluginCallback(e.hidePluginCallback), this.__options.appId = e.appId, this.__options.remoteHelper = e.channelUrl, this.__options.meta = e.meta, this.__options.responseType = e.responseType || "token", this.__options.globalRedirectUri = e.redirectUri, e.authResponse && this.setAuthResponse(e.authResponse)
                },
                init: function(e) {
                    this.initialized() || (this.checkOptions() || this.setOptions(e), this.checkOptions() && (this.__options.initialized = !0, i.fire("id.init")))
                },
                reset: function() {
                    this.__options = {}
                },
                getAppId: function() {
                    return this.__options.appId
                },
                initialized: function() {
                    return !!this.__options.initialized
                },
                checkOptions: function() {
                    return !!this.__options.appId
                },
                setStatus: function(e) {
                    this.__options.status = e
                },
                getLoginStatus: function() {
                    return {
                        status: this.__options.status,
                        authResponse: this.__options.authResponse
                    }
                },
                setAuthResponse: function(e) {
                    this.__options.authResponse = e
                },
                getOAuthToken: function() {
                    var e = this.getAuthResponse();
                    return e && e.access_token ? e.access_token : null
                },
                getAuthResponse: function() {
                    return this.__options.authResponse
                },
                getRedirectUri: function(t) {
                    return e.isString(t) ? t : this.__options.globalRedirectUri || document.location.href
                },
                getDefaultMeta: function() {
                    return this.__options.meta || {}
                },
                getDefaultResponseType: function() {
                    return this.__options.responseType
                }
            }
        }), define("rpc", ["utils/constants", "runtime", "easyXDM/easyXDM"], function(e, t, n) {
            var i = {
                    events: {}
                },
                r = {},
                o = {
                    local: {
                        sendEvent: function(e) {
                            var t = i.events[e];
                            if (t) {
                                var n = Array.prototype.slice.call(arguments, 1);
                                t.apply({}, n)
                            }
                        }
                    }
                },
                a = null;
            return t.channelUrl && (r.local = t.channelUrl), r.remoteHelper = e.name_helper_url, r.remote = e.xd_handler_helper_url, r.channel = "id_xd_api", i.config = r, i.jsonRpcConfig = o, i.xdHandler = function() {
                return null === a && (a = new n.Rpc(r, o)), a
            }, i
        }), define("sdk/ui", ["utils/wrapper", "utils/dom_ready", "utils/dom_helper", "utils/uri_helper", "dialog", "rpc"], function(e, t, n, i, r, o) {
            var a = {
                __dialogs: {},
                root: null,
                getRoot: function() {
                    if (this.root) return this.root;
                    var e = document.getElementById("id-root");
                    return e ? n.addClass(e, "id-reset") : (e = document.createElement("div"), e.id = "id-root", n.addClass(e, "id-reset"), document.body.appendChild(e)), this.root = e, this.root
                },
                createDialog: function(t, i) {
                    var o = new r,
                        a = this;
                    return o.successFn = e(t), o.errorFn = e(i), o.subscribe("dialog.closed", o.call), this.__dialogs[o.id] = o, n.addEventListener(o.mask, "click", function() {
                        a.destroy(o.id)
                    }), o
                },
                getDialog: function(e) {
                    return this.__dialogs[e]
                },
                destroy: function(e) {
                    var t = this.getDialog(e);
                    t.destroy(), delete this.__dialogs[t.id]
                },
                createIframeDialog: function(e, t, r, o) {
                    var a = this.createDialog(e, t);
                    if (document.attachEvent) {
                        this.getRoot().appendChild(a.elt);
                        var s = '<iframe id="' + a.id + '" name="' + a.id + '" style="border:none; overflowX:hidden; visibility:hidden;" src="javascript:false;"></iframe>';
                        a.replaceContent('<iframe src="javascript:false" frameborder="0" scrolling="no" style="height:1px; display:none; visibility:hidden;"></iframe>'), o._sdk = a.id, setTimeout(function() {
                            a.replaceContent(s);
                            var e = i.buildQuery(o);
                            a.findContent().firstChild.src = i.appendToUrl(r, e)
                        }, 0)
                    } else {
                        var u = document.createElement("iframe");
                        u.name = "dialog-frame-" + a.id, u.id = a.id, u.style.border = "none", u.style.overflowX = "hidden", u.style.visibility = "hidden", o._sdk = a.id;
                        var c = i.buildQuery(o);
                        this.getRoot().appendChild(a.elt), u.src = i.appendToUrl(r, c), a.replaceContent(u)
                    }
                    a.subscribe("dialog.resize", function(e, t) {
                        if (e && t) {
                            var n = document.getElementById(a.id);
                            n.style.visibility = "visible";
                            var i = document.body,
                                r = document.documentElement,
                                o = Math.max(i.scrollHeight, i.offsetHeight, r.clientHeight, r.scrollHeight, r.offsetHeight),
                                s = o - 20,
                                u = t > s;
                            n.style.overflow = "hidden", n.width = e + "px", n.height = u ? s + "px" : t + "px"
                        }
                    });
                    var l = this;
                    return n.addEventListener(window, "resize", function() {
                        l.centerDialog(a)
                    }), a.show(), a
                },
                centerDialog: function(e) {
                    if (!e.hidden) {
                        var t = window,
                            n = document,
                            i = n.documentElement,
                            r = n.getElementsByTagName("body")[0],
                            o = t.innerWidth || i.clientWidth || r.clientWidth,
                            a = t.innerHeight || i.clientHeight || r.clientHeight;
                        this.sizeMask(e, o, a), this.sizeFrame(e, o, a);
                        var s = (o - e.width()) / 2,
                            u = (a - e.height()) / 2;
                        e.setLeft(s), e.setTop(u)
                    }
                },
                sizeMask: function(e, t, n) {
                    e.mask.style.width = t + "px", e.mask.style.height = n + "px"
                },
                sizeFrame: function(e) {
                    var t = e.contentHeight > e.height();
                    e.inform("dialog.resize", e.contentWidth, e.contentHeight, t)
                }
            };
            return t(function() {
                a.getRoot()
            }), o.events["dialog.close"] = function(e) {
                var t = a.getDialog(e.dialog_id);
                t.inform("dialog.closed", null), a.destroy(t.id)
            }, a
        }), define("utils/time", [], function() {
            return {
                local: function(e) {
                    return "unix" == e ? (Date.now || (Date.now = function() {
                        return (new Date).getTime()
                    }), Math.floor(Date.now() / 1e3)) : void 0
                }
            }
        }), define("logger", ["utils/time"], function(e) {
            var t = [],
                n = 0;
            return {
                history: [],
                log: function() {
                    if ("undefined" != typeof console && "undefined" != typeof console.log && console.log)
                        for (var e = 0; e < arguments.length; e++) console.log(arguments[e]), this.history.push(arguments[e])
                },
                addCall: function() {
                    t.push(e.local("unix")), t.length >= 50 && this.log("WANRING: Too many API calls are being made to id.net");
                    for (var n = 0; n < t.length; n++) t[n] + 300 < e.local("unix") && delete t[n]
                },
                getCalls: function() {
                    for (var n = 0; n < t.length; n++) t[n] + 300 < e.local("unix") && delete t[n];
                    return t.length
                },
                setSaveSize: function(e) {
                    "string" == typeof e && (n = e.length)
                },
                getSaveSize: function() {
                    return n
                }
            }
        }), define("sdk/api", ["utils/constants", "utils/wrapper", "runtime", "easyXDM/easyXDM", "sdk/ui", "rpc", "logger"], function(e, t, n, i, r, o, a) {
            i.apply(o.jsonRpcConfig, {
                remote: {
                    api: {}
                },
                local: {
                    postLoginInfo: function(e, t) {
                        var n, i = r.getDialog(e);
                        i && (n = JSON.parse(t), i.call(n)), r.destroy(e)
                    },
                    setSize: function(e, t, n) {
                        dialog = r.getDialog(e), dialog.resize(t, n)
                    }
                }
            }, !0);
            var s = {
                getXdHandler: function() {
                    return o.xdHandler()
                },
                api: function(i, r, o, u) {
                    url = e.root_url + "/api/v1/json" + (i.match(/^\//) ? i : "/" + i);
                    var c = n.getOAuthToken();
                    c ? (a.addCall(), "user_data/submit" == i && a.setSaveSize(o.value), s.getXdHandler().api({
                        method: r,
                        url: url,
                        data: o || {},
                        headers: {
                            Authorization: "Bearer " + c
                        }
                    }, t(u), t(u))) : t(u).call({}, null)
                },
                apiOpen: function(n, i, r, o) {
                    a.addCall(), url = e.root_url + "/api/v1/json" + (n.match(/^\//) ? n : "/" + n), s.getXdHandler().api({
                        method: i,
                        url: url,
                        data: r || {}
                    }, t(o), t(o))
                }
            };
            return s
        }), define("sdk", ["sdk/ui", "sdk/api"], function(e, t) {
            var n = {
                init: function() {
                    t.getXdHandler()
                },
                ui: e,
                api: t
            };
            return n
        }), define("utils/cookies", [], function() {
            return {
                setCookie: function(e, t, n) {
                    var i = new Date;
                    i.setTime(i.getTime() + 24 * n * 60 * 60 * 1e3);
                    var r = "expires=" + i.toUTCString();
                    document.cookie = e + "=" + t + "; " + r
                },
                getCookie: function(e) {
                    for (var t = e + "=", n = document.cookie.split(";"), i = 0; i < n.length; i++) {
                        for (var r = n[i];
                            " " == r.charAt(0);) r = r.substring(1);
                        if (0 == r.indexOf(t)) return r.substring(t.length, r.length)
                    }
                    return ""
                }
            }
        }), define("options", ["utils/constants", "runtime", "sdk/api", "event", "logger", "utils/cookies"], function(e, t, n, i, r, o) {
            return {
                get: {},
                update: function() {
                    var e = this,
                        a = o.getCookie("co" + t.__options.appId);
                    if (a) try {
                        a = JSON.parse(a), e.get = a, i.fire("options")
                    } catch (s) {
                        r.log("options cache failed", s)
                    } else n.apiOpen("client_options/" + t.getAppId(), "GET", null, function(n) {
                        n.success ? (e.get = n.options, o.setCookie("co" + t.__options.appId, JSON.stringify(n.options), 10), i.fire("options")) : r.log(n)
                    })
                },
                reset: function() {
                    this.get = {}, o.setCookie("co" + t.__options.appId, "", -1)
                }
            }
        }), define("utils/domain", [], function() {
            return {
                getDomain: function() {
                    var e = null;
                    if (!e) try {
                        e = window.top.location.href
                    } catch (t) {}
                    if (!e) try {
                        e = document.referrer
                    } catch (t) {}
                    return e || (e = window.location.href), e
                },
                isFramed: window.self !== window.top
            }
        }), define("analytics", ["utils/constants", "utils/wrapper", "runtime", "easyXDM/easyXDM", "sdk/ui", "rpc", "options", "logger", "utils/cookies", "utils/domain"], function(e, t, n, i, r, o, a, s, u, c) {
            i.apply(o.jsonRpcConfig, {
                remote: {
                    api: {}
                },
                local: {
                    analyticsEvent: function(e) {
                        s.log("Analytics event with params", e)
                    }
                }
            }, !0);
            var l, d = !1,
                f = !1,
                p = !1,
                h = {
                    getXdHandler: function() {
                        return o.xdHandler()
                    },
                    ieVersion: function() {
                        var e = 0;
                        if ("Microsoft Internet Explorer" == navigator.appName) {
                            var t = navigator.userAgent,
                                n = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
                            null != n.exec(t) && (e = parseFloat(RegExp.$1))
                        }
                        return e
                    },
                    reset: function() {
                        d = !1, u.setCookie(n.__options.appId, "", -1)
                    },
                    init: function(e) {
                        h.ieVersion() > 0 && h.ieVersion() < 10 ? h.trackWithPixel("play") : h.trackWithCORS(e)
                    },
                    trackWithCORS: function(e) {
                        e.Event.monitor("options", function() {
                            d = !1, a.get.stats ? h.tracker({
                                event: "play",
                                game_id: n.__options.appId,
                                domain: c.getDomain()
                            }) : d = !0
                        })
                    },
                    trackWithPixel: function(e) {
                        var t, i = document.getElementsByTagName("body")[0],
                            r = "//t.id.net/px.gif?game_id=" + n.__options.appId + "&event=" + e + "&domain=" + c.getDomain();
                        t = document.createElement("img"), t.src = r, t.style = "visibility:hidden; position:absolute", i.appendChild(t)
                    },
                    tracker: function(t) {
                        if (h.ieVersion() > 0 && h.ieVersion() < 10) return void h.trackWithPixel(t.event);
                        if (!d) {
                            "play" != t.event || f ? "play" == t.event && f && s.log("play event already sent") : f = !0;
                            var n = function(e) {
                                    try {
                                        e = JSON.parse(e)
                                    } catch (t) {
                                        s.log("failed setting uuid" + t)
                                    }
                                    h.set_uuid(e.uuid)
                                },
                                i = function(e) {
                                    s.log("tracker failed", e)
                                };
                            h.get_uuid(function(r) {
                                r && (t.uuid = r), t.user_agent = navigator.userAgent, t.sdk = "js", h.getXdHandler().api({
                                    method: "POST",
                                    url: e.analytics_url,
                                    data: t
                                }, n, i)
                            })
                        }
                    },
                    get_uuid: function(t) {
                        l && t(l), h.getXdHandler().api({
                            method: "GET",
                            url: e.root_url + "/api/v1/json/tracking/get_uuid",
                            data: null
                        }, function(e) {
                            try {
                                e = JSON.parse(e)
                            } catch (n) {
                                s.log("failed to parse json data", n)
                            }
                            t(e && e.hasOwnProperty("uuid") && e.uuid ? e.uuid : u.getCookie("uuid"))
                        }, function(e) {
                            s.log("get uuid failed", e)
                        })
                    },
                    set_uuid: function(t) {
                        p || (this.uuid = t, h.getXdHandler().api({
                            method: "POST",
                            url: e.root_url + "/api/v1/json/tracking/set_uuid",
                            data: {
                                uuid: t
                            }
                        }, function() {}, function(e) {
                            h.log("set_uuid error"), h.log(e)
                        }), u.setCookie("uuid", t, 365), p = !0)
                    },
                    developer: {
                        custom_event: function(e, t) {
                            var i = {
                                event: "custom",
                                game_id: n.__options.appId,
                                domain: c.getDomain(),
                                custom_event: {
                                    name: e,
                                    value: t
                                }
                            };
                            h.tracker(i)
                        }
                    }
                };
            return h
        }), define("auth", ["underscore", "utils/uri_helper", "utils/constants", "utils/wrapper", "sdk/api", "runtime", "dialog", "sdk/ui", "event", "analytics", "utils/domain"], function(e, t, n, i, r, o, a, s, u, c, l) {
            var d = function(e) {
                    var t;
                    if (!e) return null;
                    try {
                        t = e.authResponse.redirect_uri, t && (document.location.href = t)
                    } catch (n) {
                        "undefined" != typeof console && "undefined" != typeof console.log && console.log(n)
                    }
                    return null
                },
                f = function(t, n) {
                    return function(r) {
                        var a = t(r),
                            s = i(n);
                        return a && a.authResponse && "register" == a.authResponse.event_action && c.tracker({
                            event: "reg",
                            game_id: o.__options.appId,
                            domain: l.getDomain()
                        }), e.isFunction(s) && s.hasCallback ? s(a) : void d(a)
                    }
                },
                p = {
                    login_or_register: function(t, r, a, u) {
                        t = n.root_url + "/widgets/" + (t || "login"), r = r || {};
                        var c, l;
                        c = e.clone(o.getDefaultMeta()), c = e.extend(c, r.meta || {}), c = {
                            prefill: c
                        }, l = {
                            client_id: o.getAppId(),
                            redirect_uri: o.getRedirectUri(r.redirect_uri),
                            response_type: r.response_type || o.getDefaultResponseType()
                        }, l = e.extend(l, c), l.scope = r.scope || "", r.state && (l.state = r.state);
                        var d = s.createIframeDialog(i(f(this.storeLoginResponse, a, t)), u, t, l);
                        return d
                    },
                    login: function(e, t, n) {
                        return p.login_or_register("login", e, t, n)
                    },
                    register: function(e, t, n) {
                        return p.login_or_register("register", e, t, n)
                    },
                    storeLoginResponse: function(e) {
                        return e && (e.status = e.result, o.setStatus(e.status), delete e.result, o.setAuthResponse(e.authResponse), u.fire("auth.authResponseChange", e)), e
                    },
                    fetchLoginStatus: function(e, t, a) {
                        a = a || {}, e = e || function() {}, t = t || function() {};
                        var s = n.root_url + "/oauth/status",
                            u = r.getXdHandler();
                        u.api({
                            method: "GET",
                            url: s,
                            data: {
                                redirect_uri: a.redirect_uri || o.getRedirectUri(),
                                _sdk: 1,
                                response_type: a.response_type || o.getDefaultResponseType(),
                                client_id: o.getAppId()
                            }
                        }, i(f(this.storeLoginResponse, e, "login", !1)), i(t))
                    }
                };
            return p
        }), define("dialogs_manager", ["underscore", "utils/constants", "utils/wrapper", "runtime", "sdk/ui", "rpc"], function(e, t, n, i, r, o) {
            var a = function(e) {
                    return t.root_url + "/dialogs/" + e
                },
                s = {
                    open: function(t, n, o) {
                        switch (t = t || {}, t.app_id = i.getAppId(), t.method) {
                            case "apprequests":
                                r.createIframeDialog(n, o, a("app_requests/new"), e.pick(t, "message", "redirect_uri", "data", "app_id", "to"));
                                break;
                            case "friends":
                                r.createIframeDialog(n, o, a("friends/new"), e.pick(t, "redirect_uri", "app_id", "id"));
                                break;
                            case "feed":
                                t = e.pick(t, "link", "description", "picture", "source", "name", "caption", "message", "redirect_uri", "app_id"), r.createIframeDialog(n, o, a("feeds/new"), t);
                                break;
                            case "leaderboard":
                                r.createIframeDialog(n, o, a("leaderboard"), e.pick(t, "redirect_uri", "app_id"));
                                break;
                            case "achievements":
                                return r.createIframeDialog(n, o, a("achievements"), e.pick(t, "redirect_uri", "app_id", "h", "q"));
                            case "advanced_scores":
                                return r.createIframeDialog(n, o, a("advanced_scores"), e.pick(t, "redirect_uri", "app_id", "h", "q", "u"));
                            case "certification":
                                r.createIframeDialog(n, o, a("certification"), e.pick(t, "redirect_uri", "app_id"));
                                break;
                            case "points_leaderboard":
                                r.createIframeDialog(n, o, a("leaderboard/points"), t)
                        }
                    }
                };
            return o.events["dialog.finished"] = function(e) {
                var t = r.getDialog(e.dialog_id);
                t.inform("dialog.finished", null), t.call(e.data)
            }, o.events["dialog.error"] = function(e) {
                var t = r.getDialog(e.dialog_id);
                t.inform("dialog.error", null), t.error(e.error, e.data)
            }, o.events["dialog.resize"] = function(e) {
                var t = r.getDialog(e.dialog_id);
                t.inform("dialog.resize", e.width, e.height, e.overflow), t.contentWidth = e.width, t.contentHeight = e.height, r.centerDialog(t)
            }, s
        }), define("tracking", ["utils/constants", "utils/uri_helper"], function(e, t) {
            return {
                track: function(n, i) {
                    var r, o, a, s = t.appendToUrl(e.tracking_url, i);
                    s = t.appendToUrl(s, {
                        client_id: n
                    }), o = document.getElementsByTagName("body")[0], document.attachEvent ? (r = '<iframe style="border:none;overflow:hidden;display:none;" src="javascript:false;"></iframe>', a = document.createElement(r), o.appendChild(a), a.src = s) : (a = document.createElement("iframe"), a.style.border = "none", a.style.overflow = "hidden", a.style.display = "none", a.src = s, o.appendChild(a)), setTimeout(function() {
                        a.parentNode && a.parentNode.removeChild(a)
                    }, 2500)
                }
            }
        }), define("app_image", ["sdk/api"], function(e) {
            return {
                submit: function(t, n) {
                    e.api("/profile/app_image", "POST", {
                        picture: t
                    }, function(e) {
                        n && n(e)
                    })
                }
            }
        }),
        function(e) {
            function t(e, t, l) {
                var d = 0,
                    f = [0],
                    p = "",
                    h = null,
                    p = l || "UTF8";
                if ("UTF8" !== p && "UTF16BE" !== p && "UTF16LE" !== p) throw "encoding must be UTF8, UTF16BE, or UTF16LE";
                if ("HEX" === t) {
                    if (0 !== e.length % 2) throw "srcString of HEX type must be in byte increments";
                    h = i(e), d = h.binLen, f = h.value
                } else if ("TEXT" === t || "ASCII" === t) h = n(e, p), d = h.binLen, f = h.value;
                else if ("B64" === t) h = o(e), d = h.binLen, f = h.value;
                else {
                    if ("BYTES" !== t) throw "inputFormat must be HEX, TEXT, ASCII, B64, or BYTES";
                    h = r(e), d = h.binLen, f = h.value
                }
                this.getHash = function(e, t, n, i) {
                    var r, o = null,
                        l = f.slice(),
                        p = d;
                    if (3 === arguments.length ? "number" != typeof n && (i = n, n = 1) : 2 === arguments.length && (n = 1), n !== parseInt(n, 10) || 1 > n) throw "numRounds must a integer >= 1";
                    switch (t) {
                        case "HEX":
                            o = a;
                            break;
                        case "B64":
                            o = s;
                            break;
                        case "BYTES":
                            o = u;
                            break;
                        default:
                            throw "format must be HEX, B64, or BYTES"
                    }
                    if ("SHA-224" === e)
                        for (r = 0; n > r; r += 1) l = w(l, p, e), p = 224;
                    else {
                        if ("SHA-256" !== e) throw "Chosen SHA variant is not supported";
                        for (r = 0; n > r; r += 1) l = w(l, p, e), p = 256
                    }
                    return o(l, c(i))
                }, this.getHMAC = function(e, t, l, h, g) {
                    var m, v, y, b, _ = [],
                        k = [];
                    switch (m = null, h) {
                        case "HEX":
                            h = a;
                            break;
                        case "B64":
                            h = s;
                            break;
                        case "BYTES":
                            h = u;
                            break;
                        default:
                            throw "outputFormat must be HEX, B64, or BYTES"
                    }
                    if ("SHA-224" === l) v = 64, b = 224;
                    else {
                        if ("SHA-256" !== l) throw "Chosen SHA variant is not supported";
                        v = 64, b = 256
                    } if ("HEX" === t) m = i(e), y = m.binLen, m = m.value;
                    else if ("TEXT" === t || "ASCII" === t) m = n(e, p), y = m.binLen, m = m.value;
                    else if ("B64" === t) m = o(e), y = m.binLen, m = m.value;
                    else {
                        if ("BYTES" !== t) throw "inputFormat must be HEX, TEXT, ASCII, B64, or BYTES";
                        m = r(e), y = m.binLen, m = m.value
                    } if (e = 8 * v, t = v / 4 - 1, y / 8 > v) {
                        for (m = w(m, y, l); m.length <= t;) m.push(0);
                        m[t] &= 4294967040
                    } else if (v > y / 8) {
                        for (; m.length <= t;) m.push(0);
                        m[t] &= 4294967040
                    }
                    for (v = 0; t >= v; v += 1) _[v] = 909522486 ^ m[v], k[v] = 1549556828 ^ m[v];
                    return l = w(k.concat(w(_.concat(f), e + d, l)), e + b, l), h(l, c(g))
                }
            }

            function n(e, t) {
                var n, i, r, o, a = [],
                    s = [],
                    u = 0;
                if ("UTF8" === t)
                    for (i = 0; i < e.length; i += 1)
                        for (n = e.charCodeAt(i), s = [], 128 > n ? s.push(n) : 2048 > n ? (s.push(192 | n >>> 6), s.push(128 | 63 & n)) : 55296 > n || n >= 57344 ? s.push(224 | n >>> 12, 128 | n >>> 6 & 63, 128 | 63 & n) : (i += 1, n = 65536 + ((1023 & n) << 10 | 1023 & e.charCodeAt(i)), s.push(240 | n >>> 18, 128 | n >>> 12 & 63, 128 | n >>> 6 & 63, 128 | 63 & n)), r = 0; r < s.length; r += 1) {
                            for (o = u >>> 2; a.length <= o;) a.push(0);
                            a[o] |= s[r] << 24 - u % 4 * 8, u += 1
                        } else if ("UTF16BE" === t || "UTF16LE" === t)
                            for (i = 0; i < e.length; i += 1) {
                                for (n = e.charCodeAt(i), "UTF16LE" === t && (r = 255 & n, n = r << 8 | n >> 8), o = u >>> 2; a.length <= o;) a.push(0);
                                a[o] |= n << 16 - u % 4 * 8, u += 2
                            }
                        return {
                            value: a,
                            binLen: 8 * u
                        }
            }

            function i(e) {
                var t, n, i, r = [],
                    o = e.length;
                if (0 !== o % 2) throw "String of HEX type must be in byte increments";
                for (t = 0; o > t; t += 2) {
                    if (n = parseInt(e.substr(t, 2), 16), isNaN(n)) throw "String of HEX type contains invalid characters";
                    for (i = t >>> 3; r.length <= i;) r.push(0);
                    r[t >>> 3] |= n << 24 - t % 8 * 4
                }
                return {
                    value: r,
                    binLen: 4 * o
                }
            }

            function r(e) {
                var t, n, i, r = [];
                for (n = 0; n < e.length; n += 1) t = e.charCodeAt(n), i = n >>> 2, r.length <= i && r.push(0), r[i] |= t << 24 - n % 4 * 8;
                return {
                    value: r,
                    binLen: 8 * e.length
                }
            }

            function o(e) {
                var t, n, i, r, o, a = [],
                    s = 0;
                if (-1 === e.search(/^[a-zA-Z0-9=+\/]+$/)) throw "Invalid character in base-64 string";
                if (n = e.indexOf("="), e = e.replace(/\=/g, ""), -1 !== n && n < e.length) throw "Invalid '=' found in base-64 string";
                for (n = 0; n < e.length; n += 4) {
                    for (o = e.substr(n, 4), i = r = 0; i < o.length; i += 1) t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(o[i]), r |= t << 18 - 6 * i;
                    for (i = 0; i < o.length - 1; i += 1) {
                        for (t = s >>> 2; a.length <= t;) a.push(0);
                        a[t] |= (r >>> 16 - 8 * i & 255) << 24 - s % 4 * 8, s += 1
                    }
                }
                return {
                    value: a,
                    binLen: 8 * s
                }
            }

            function a(e, t) {
                var n, i, r = "",
                    o = 4 * e.length;
                for (n = 0; o > n; n += 1) i = e[n >>> 2] >>> 8 * (3 - n % 4), r += "0123456789abcdef".charAt(i >>> 4 & 15) + "0123456789abcdef".charAt(15 & i);
                return t.outputUpper ? r.toUpperCase() : r
            }

            function s(e, t) {
                var n, i, r, o = "",
                    a = 4 * e.length;
                for (n = 0; a > n; n += 3)
                    for (r = n + 1 >>> 2, i = e.length <= r ? 0 : e[r], r = n + 2 >>> 2, r = e.length <= r ? 0 : e[r], r = (e[n >>> 2] >>> 8 * (3 - n % 4) & 255) << 16 | (i >>> 8 * (3 - (n + 1) % 4) & 255) << 8 | r >>> 8 * (3 - (n + 2) % 4) & 255, i = 0; 4 > i; i += 1) o += 8 * n + 6 * i <= 32 * e.length ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(r >>> 6 * (3 - i) & 63) : t.b64Pad;
                return o
            }

            function u(e) {
                var t, n, i = "",
                    r = 4 * e.length;
                for (t = 0; r > t; t += 1) n = e[t >>> 2] >>> 8 * (3 - t % 4) & 255, i += String.fromCharCode(n);
                return i
            }

            function c(e) {
                var t = {
                    outputUpper: !1,
                    b64Pad: "="
                };
                try {
                    e.hasOwnProperty("outputUpper") && (t.outputUpper = e.outputUpper), e.hasOwnProperty("b64Pad") && (t.b64Pad = e.b64Pad)
                } catch (n) {}
                if ("boolean" != typeof t.outputUpper) throw "Invalid outputUpper formatting option";
                if ("string" != typeof t.b64Pad) throw "Invalid b64Pad formatting option";
                return t
            }

            function l(e, t) {
                return e >>> t | e << 32 - t
            }

            function d(e, t, n) {
                return e & t ^ ~e & n
            }

            function f(e, t, n) {
                return e & t ^ e & n ^ t & n
            }

            function p(e) {
                return l(e, 2) ^ l(e, 13) ^ l(e, 22)
            }

            function h(e) {
                return l(e, 6) ^ l(e, 11) ^ l(e, 25)
            }

            function g(e) {
                return l(e, 7) ^ l(e, 18) ^ e >>> 3
            }

            function m(e) {
                return l(e, 17) ^ l(e, 19) ^ e >>> 10
            }

            function v(e, t) {
                var n = (65535 & e) + (65535 & t);
                return ((e >>> 16) + (t >>> 16) + (n >>> 16) & 65535) << 16 | 65535 & n
            }

            function y(e, t, n, i) {
                var r = (65535 & e) + (65535 & t) + (65535 & n) + (65535 & i);
                return ((e >>> 16) + (t >>> 16) + (n >>> 16) + (i >>> 16) + (r >>> 16) & 65535) << 16 | 65535 & r
            }

            function b(e, t, n, i, r) {
                var o = (65535 & e) + (65535 & t) + (65535 & n) + (65535 & i) + (65535 & r);
                return ((e >>> 16) + (t >>> 16) + (n >>> 16) + (i >>> 16) + (r >>> 16) + (o >>> 16) & 65535) << 16 | 65535 & o
            }

            function w(e, t, n) {
                var i, r, o, a, s, u, c, l, w, _, k, x, S, E, O, R, T, C, A, M, j, H, P, I, D, L, N = [],
                    F = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
                if (_ = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], r = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], "SHA-224" !== n && "SHA-256" !== n) throw "Unexpected error in SHA-2 implementation";
                for (k = 64, i = (t + 65 >>> 9 << 4) + 15, E = 16, O = 1, D = Number, R = v, T = y, C = b, A = g, M = m, j = p, H = h, I = f, P = d, _ = "SHA-224" === n ? _ : r; e.length <= i;) e.push(0);
                for (e[t >>> 5] |= 128 << 24 - t % 32, e[i] = t, L = e.length, x = 0; L > x; x += E) {
                    for (t = _[0], i = _[1], r = _[2], o = _[3], a = _[4], s = _[5], u = _[6], c = _[7], S = 0; k > S; S += 1) 16 > S ? (w = S * O + x, l = e.length <= w ? 0 : e[w], w = e.length <= w + 1 ? 0 : e[w + 1], N[S] = new D(l, w)) : N[S] = T(M(N[S - 2]), N[S - 7], A(N[S - 15]), N[S - 16]), l = C(c, H(a), P(a, s, u), F[S], N[S]), w = R(j(t), I(t, i, r)), c = u, u = s, s = a, a = R(o, l), o = r, r = i, i = t, t = R(l, w);
                    _[0] = R(t, _[0]), _[1] = R(i, _[1]), _[2] = R(r, _[2]), _[3] = R(o, _[3]), _[4] = R(a, _[4]), _[5] = R(s, _[5]), _[6] = R(u, _[6]), _[7] = R(c, _[7])
                }
                if ("SHA-224" === n) e = [_[0], _[1], _[2], _[3], _[4], _[5], _[6]];
                else {
                    if ("SHA-256" !== n) throw "Unexpected error in SHA-2 implementation";
                    e = _
                }
                return e
            }
            "function" == typeof define && define.amd ? define("utils/jssha", [], function() {
                return t
            }) : "undefined" != typeof exports ? "undefined" != typeof module && module.exports ? module.exports = exports = t : exports = t : e.jsSHA = t
        }(this), define("playtomic", ["utils/jssha", "logger", "runtime", "dialogs_manager", "utils/constants"], function(e, t, n, i, r) {
            function o(e, t) {
                return {
                    success: e,
                    errorcode: t
                }
            }

            function a(e, t) {
                i.open({
                    method: "achievements",
                    redirect_uri: n.getRedirectUri(),
                    h: e,
                    q: t
                })
            }

            function s(e, t) {
                var r = {
                    method: "advanced_scores",
                    redirect_uri: n.getRedirectUri(),
                    h: e,
                    q: t
                };
                n.getOAuthToken() && (r.u = n.getAuthResponse().details.pid), i.open(r)
            }

            function u(e, t, n) {
                e && e(n)
            }

            function c(e) {
                return e && "http:" == window.location.protocol && -1 != e.search("https") && (e = e.split("https").join("http")), e
            }
            var l = {
                apiurl: c(r.playtomic_url),
                appid: null,
                appsession: "",
                loaded: !1,
                debug: !1,
                init: function(e, n, i) {
                    var r = this;
                    if (this.appid = e, this.loaded) return void(this.debug && t.log("Game API already initialized"));
                    var o = function(e, n, i, o) {
                        if (e) {
                            if (!o.success) return void e(i, o);
                            r.loaded = !0, r.appsession = i.appsession, this.debug && t.log("playtomic init"), e(i, o)
                        }
                    };
                    this.sendAPIRequest("init", "start", o, i, null)
                },
                Achievements: {
                    list: function(e) {
                        e || (e = {}), n.getOAuthToken() && (e.playerid = n.getAuthResponse().details.pid), l.requestForwarder("achievements", "list", a, e)
                    },
                    listCustom: function(e, t) {
                        e || (e = {}), n.getOAuthToken() && (e.playerid = n.getAuthResponse().details.pid), l.sendAPIRequest("achievements", "list", u, t, e)
                    },
                    save: function(e, i) {
                        return n.getOAuthToken() ? (e.hasOwnProperty("playerid") || (e.playerid = n.getAuthResponse().details.pid), e.hasOwnProperty("playername") || (e.playername = n.getAuthResponse().details.nickname), void l.sendAPIRequest("achievements", "save", u, i, e)) : void(this.debug && t.log("user must login before saving an achievement"))
                    }
                },
                Leaderboards: {
                    tables: function(e, t) {
                        l.sendAPIRequest("leaderboards", "tables", u, t, e)
                    },
                    list: function(e) {
                        e.page = 1, e.perpage = 10, l.requestForwarder("leaderboards", "list", s, e)
                    },
                    listCustom: function(e, t) {
                        l.sendAPIRequest("leaderboards", "list", u, t, e)
                    },
                    save: function(e, i) {
                        return n.getOAuthToken() ? (e.hasOwnProperty("playerid") || (e.playerid = n.getAuthResponse().details.pid), e.hasOwnProperty("playername") || (e.playername = n.getAuthResponse().details.nickname), void l.sendAPIRequest("leaderboards", "save", u, i, e)) : void(this.debug && t.log("user must login before saving an achievement"))
                    }
                },
                PlayerLevels: {},
                Stats: {},
                sendAPIRequest: function(n, i, r, a, s) {
                    var u = this;
                    s = s || {}, s.section = n, s.action = i, s.appid || (s.appid = this.appid, "init" != n && !this.loaded && this.debug && t.log("init has yet to be called, trying to send anyway"));
                    var c = JSON.stringify(s),
                        l = new e(c + this.appsession, "TEXT"),
                        d = l.getHash("SHA-256", "HEX");
                    d = d.substring(0, 20);
                    var f = this.apiurl + "?hash=" + d,
                        p = c,
                        h = window.XDomainRequest ? new XDomainRequest : new XMLHttpRequest;
                    h.onerror = function() {
                        r(a, s, {}, o(!1, 1))
                    }, h.onload = function() {
                        u.debug && t.log(h.responseText);
                        var e = JSON.parse(h.responseText);
                        r(a, s, e, o(e.success, e.errorcode))
                    }, window.XDomainRequest ? h.open("POST", f) : h.open("POST", f, !0), h.send(p)
                },
                requestForwarder: function(t, n, i, r) {
                    r = r || {}, r.section = t, r.action = n, r.appid = this.appid;
                    var o = JSON.stringify(r),
                        a = new e(o + this.appsession, "TEXT"),
                        s = a.getHash("SHA-256", "HEX");
                    s = s.substring(0, 20);
                    this.apiurl + "?hash=" + s;
                    i && i(s, o)
                }
            };
            return l
        }), define("protection", ["utils/domain", "sdk/api", "logger"], function(e, t, n) {
            var i = e.getDomain(),
                r = [],
                o = [],
                a = null,
                s = null,
                u = null,
                c = function(e) {
                    0 === r.length ? (t.apiOpen("protection-lists", "GET", null, function(t) {
                        t.hasOwnProperty("approved_domains") && (r = t.approved_domains, o = t.blacklisted_urls, clearTimeout(u)), e()
                    }), u = setTimeout(function() {
                        e()
                    }, 1e4)) : e()
                };
            return {
                isSponsor: function(e) {
                    return a ? void e(a) : void c(function() {
                        for (var t = 0; t < r.length; t++)
                            if (-1 != i.search(r[t])) return a = !0, void e(!0);
                        a = !1, e(!1)
                    })
                },
                isBlacklisted: function(e) {
                    return s ? void e(s) : void c(function() {
                        // for (var t = 0; t < o.length; t++)
                        //     if (-1 != i.search(o[t])) return s = !0, void e(!0);
                        s = !1, e(!1)
                    })
                },
                debug: function() {
                    n.log("domain " + i), n.log("approved", r), n.log("blacklist", o);
                    for (var e = 0; e < o.length; e++) n.log(-1 != i.search(o[e]));
                    n.log("---");
                    for (var e = 0; e < r.length; e++) n.log(-1 != i.search(r[e]))
                }
            }
        }), define("dialogv2", ["utils/dom_helper", "utils/constants"], function(e, t) {
            var n = {
                iframe: null,
                mask: null,
                loaded: !1,
                loadedCallback: null,
                width: 0,
                height: 0,
                create: function(i, r, o) {
                    this.iframe && this.destroy();
                    var a = document.createElement("iframe");
                    this.iframe = a, a.setAttribute("style", "position: absolute; z-index: 10000; border: 0;"), a.style.width = r + "px", a.style.height = o + "px", this.width = r, this.height = o;
                    var s = '<html><head><link rel="stylesheet" href="' + t.cdnUrl + '/dialogv2/default.css"></head><body>' + i + "</body></html>",
                        u = document.createElement("div");
                    this.mask = u, u.setAttribute("style", "position: absolute; z-index: 9999; border: 0; top: 0; left: 0;"), u.style.background = "rgba(0, 0, 0, 0.5)", u.style.width = "100%", u.style.height = "100%", u.appendChild(a), document.body.appendChild(u), a.contentWindow.document.open(), a.contentWindow.document.write(s), a.contentWindow.document.close(), this.center(), a.onload = function() {
                        n.loaded = !0, n.loadedCallback && n.loadedCallback()
                    }, e.addEventListener(window, "resize", n.center)
                },
                destroy: function() {
                    this.iframe && (e.removeEventListener(window, "resize", n.center), document.body.removeChild(this.mask), this.iframe = null, this.mask = null, this.loaded = !1, this.loadedCallback = null, window.focus())
                },
                center: function() {
                    var e = window,
                        t = document,
                        i = t.documentElement,
                        r = t.getElementsByTagName("body")[0],
                        o = e.innerWidth || i.clientWidth || r.clientWidth,
                        a = e.innerHeight || i.clientHeight || r.clientHeight,
                        s = (o - n.width) / 2,
                        u = (a - n.height) / 2;
                    n.iframe.style.left = s + "px", n.iframe.style.top = u + "px"
                },
                loadStyle: function(e) {
                    if (n.iframe) {
                        for (var t = n.iframe.contentWindow.document, i = 0; i < t.styleSheets.length; i++)
                            if (t.styleSheets.href == e) return;
                        var r = t.getElementsByTagName("head")[0],
                            o = t.createElement("link");
                        o.rel = "stylesheet", o.type = "text/css", o.href = e, r.appendChild(o)
                    }
                }
            };
            return n
        }), define("secret_menu", ["logger", "utils/dom_helper", "dialogv2", "runtime", "utils/constants"], function(e, t, n, i, r) {
            var o = ['<div class="wrap">', '  <div class="innerwrap">', '    <div id="close" class="close">&times;</div>', "    <h2>Secret Menu</h2>", '    <div id="logoutput" class="logoutput"></div>', '    <div id="appid"></div>', '    <div id="callcount"></div>', '    <div id="savesize"></div>', "  </div>", "</div>"].join(""),
                a = {
                    open: !1,
                    init: function() {
                        var a = this;
                        r.y8_appid != i.getAppId() && t.addEventListener(window, "keydown", function(s) {
                            s.shiftKey && s.altKey && s.ctrlKey && (a.open ? (n.destroy(), a.open = !1, t.removeEventListener(a.closeDiv, "click", a.close)) : (n.loadedCallback = function() {
                                var r = n.iframe.contentWindow.document,
                                    o = r.getElementById("logoutput"),
                                    s = r.getElementById("appid"),
                                    u = r.getElementById("callcount"),
                                    c = r.getElementById("savesize");
                                a.closeDiv = r.getElementById("close"), t.addEventListener(a.closeDiv, "click", a.close), o.innerHTML = "";
                                for (var l = 0; l < e.history.length; l++) o.innerHTML = o.innerHTML + e.history[l];
                                s.innerHTML = i.getAppId(), u.innerHTML = e.getCalls() + " call in last 5 mins", c.innerHTML = e.getSaveSize() + " bytes saved last"
                            }, n.create(o, 400, 350), n.loadStyle(r.cdnUrl + "/dialogv2/secret_menu.css"), a.open = !0))
                        })
                    },
                    close: function() {
                        a.open = !1, n.destroy(), t.removeEventListener(a.closeDiv, "click", a.close)
                    }
                };
            return a
        }), define("multiplayer", ["logger"], function(e) {
            return {
                room: {},
                appid: "",
                appsession: "",
                callback: null,
                matchingCallback: null,
                matchingScope: null,
                session: "",
                userid: "",
                nodes: [
                    ["playtomic1.nl1.id.net", 3201],
                    ["playtomic2.nl1.id.net", 3201]
                ],
                host: "",
                port: 0,
                proto: "https:" === document.location.protocol ? "wss://" : "ws://",
                msgQue: [],
                socket: null,
                _message: "",
                reconnects: 0,
                reconnectDelay: 5e3,
                switchingServer: !1,
                timedout: !1,
                debugLevel: 2,
                open: function(t, n, i) {
                    t || e.log("SMP: missing appid"), n || e.log("SMP: missing Game API appsession"), this.appid = t, this.appsession = n, this.callback = i;
                    var r = Math.floor(Math.random() * (this.nodes.length - 1 + 1)) + 1 - 1;
                    this.host = this.nodes[r][0], this.port = this.nodes[r][1], this.openSocket(this.host, this.port), this.debugLevel > 0 && e.log("connecting to " + this.host + ":" + this.port)
                },
                openSocket: function(t, n) {
                    var i = this;
                    this.socket = new WebSocket("ws://" + t + ":" + n), this.socket.onopen = function() {
                        i.reconnects = 0;
                        var e = {
                            section: "users",
                            action: "start",
                            appid: i.appid,
                            appsession: i.appsession,
                            uid: i.userid
                        };
                        i.sendObject(e), this.switchingServer = !1
                    }, this.socket.onmessage = function(e) {
                        for (var t = e.data.split("!@"), n = 0; n < t.length; n++) i._message += t[n], n < t.length - 1 && (0 !== i._message.indexOf("{") && (i._message = i._message.substring(i._message.indexOf("{"), i._message.length)), i.onMessage(i._message), i._message = "")
                    }, this.socket.onerror = function(t) {
                        e.log("SMP: error" + t.data)
                    }, this.socket.onclose = function(t) {
                        i.debugLevel > 0 && (e.log("SMP: disconnected"), e.log(t)), 4e3 == t.code && (i.timedout = !0), i.switchingServer || i.timedout || (i.reconnects = 1, i.startReconnect())
                    }
                },
                onMessage: function(t) {
                    try {
                        var n = JSON.parse(t);
                        this.callback && this.callback(n), this.matchingCallback && this.matchingCallback(n, this.matchingScope)
                    } catch (i) {
                        return void e.log(i)
                    }
                    if (n.hasOwnProperty("action")) {
                        if ("users" == n.section && "start" == n.action && 0 == n.errorcode && (this.session = n.usersession, this.userid = n.userid, this.msgQue.length > 0)) {
                            for (var r in this.msgQue) {
                                var t = this.msgQue[r];
                                this.sendObject(t), this.debugLevel > 0 && e.log("sending que" + JSON.stringify(t))
                            }
                            this.msgQue = []
                        }
                        "rooms" == n.section && "playerjoined" == n.action && (this.room.players[n.playerid] = n.meta), "rooms" == n.section && "playerleft" == n.action && delete this.room.players[n.playerid], "rooms" == n.section && "playerupdate" == n.action && (this.room.players[n.playerid] = n.meta), "rooms" == n.section && "join" == n.action && (this.room = n.room)
                    } else e.log("possible error " + t)
                },
                roomList: function(e, t, n, i) {
                    var r = {
                        section: "rooms",
                        action: "list",
                        appid: this.appid
                    };
                    e && (r.type = e), t && (r.roomid = t), n && (r.custom = n), i && (r.pt = i), this.sendObject(r)
                },
                roomJoin: function(t, n, i) {
                    var r = n.split(":"),
                        o = {
                            section: "rooms",
                            action: "join",
                            appid: this.appid,
                            roomid: t
                        };
                    i && (o.pt = i), r[0] != this.host || r[1].substring(1) != this.port.toString().substring(1) ? (this.host = r[0], this.port = r[1], this.switchServer(this.host, this.port), this.debugLevel > 0 && e.log("switch to " + n), this.msgQue.push(o)) : this.sendObject(o)
                },
                roomCreate: function(e, t, n, i, r) {
                    var o = {
                        section: "rooms",
                        action: "create",
                        type: e,
                        appid: this.appid
                    };
                    for (key in r) o[key] = r[key];
                    t && (o.roomid = t), n && (o.custom = n), i && (o.pt = i), this.sendObject(o)
                },
                roomUpdate: function(e, t, n) {
                    var i = {
                        section: "rooms",
                        action: "update",
                        appid: this.appid,
                        custom: e
                    };
                    t && (i.pt = t);
                    for (key in n) i[key] = n[key];
                    this.sendObject(i)
                },
                roomLeave: function(e) {
                    var t = {
                        section: "rooms",
                        action: "leave",
                        appid: this.appid
                    };
                    e && (t.pt = e), this.sendObject(t)
                },
                broadcast: function(t) {
                    (!t || "object" != typeof t || Array.isArray(t)) && e.log("SMP: broadcast takes an object for the argument"), this.sendObject({
                        section: "rooms",
                        action: "broadcast",
                        appid: this.appid,
                        message: t
                    })
                },
                broadcastAll: function(t) {
                    (!t || "object" != typeof t || Array.isArray(t)) && e.log("SMP: broadcast takes an object for the argument"), this.sendObject({
                        section: "rooms",
                        action: "broadcast",
                        appid: this.appid,
                        message: t
                    }), this.callback({
                        section: "rooms",
                        action: "broadcast",
                        message: t,
                        success: !0,
                        errorcode: 0
                    })
                },
                sendTo: function(e, t) {
                    this.sendObject({
                        section: "rooms",
                        action: "sendTo",
                        appid: this.appid,
                        userid: e,
                        message: t
                    })
                },
                userMeta: function(e, t) {
                    var n = {
                        section: "users",
                        action: "meta",
                        meta: e,
                        appid: this.appid
                    };
                    t && (n.pt = t), this.sendObject(n)
                },
                ping: function(e) {
                    var t = {
                        section: "users",
                        action: "ping",
                        appid: this.appid
                    };
                    e && (t.pt = e), this.sendObject(t)
                },
                sendObject: function(t) {
                    var n = JSON.stringify(t);
                    this.socket.send(n), this.debugLevel > 1 && "broadcast" == t.action && e.log("SMP: sending " + n), this.debugLevel > 0 && "broadcast" != t.action && e.log("SMP: sending " + n)
                },
                switchServer: function(e, t) {
                    this.switchingServer = !0, this.socket.close(), this.host = e, this.port = t, this.openSocket(e, t)
                },
                startReconnect: function() {
                    var t = this;
                    return 1 === this.socket.readyState ? (this.reconnects = 0, void e.log("SMP: reconnected")) : 0 === this.socket.readyState ? (setTimeout(function() {
                        t.reconnects++, t.startReconnect()
                    }, 3e3 * t.reconnects * 1.5), void e.log("SMP: waiting for pending connection")) : void setTimeout(function() {
                        e.log("SMP: Trying to reconnect"), t.openSocket(t.host, t.port), t.reconnects++, t.startReconnect()
                    }, 3e3 * t.reconnects * 1.5)
                },
                api: function(e) {
                    this.sendObject(e)
                }
            }
        }), define("matchmaking", ["logger", "multiplayer", "playtomic", "runtime"], function(e, t, n, i) {
            return {
                enabled: !1,
                availableRooms: [],
                playerRank: 0,
                lonleyPlayerTimeout: null,
                minPlayers: 2,
                maxPlayers: 10,
                joinAnytime: !0,
                playerRankTable: "",
                highest: !0,
                useAchievements: !1,
                startMatchmaking: function() {
                    return enabled = !0, t.appid ? n.loaded ? (t.matchingCallback = this.callback, void(t.matchingScope = this)) : void e.log("Matchmaking Error: The Game API must be initialized before startMatchmaking") : void e.log("Matchmaking Error: Multiplayer.open must be called before startMatchmaking")
                },
                autoJoinGame: function() {
                    var e = this;
                    t.roomList("game", null, {
                        mm: !0
                    }, "mm-list");
                    var n = setInterval(function() {
                        e.availableRooms.length > 0 && (clearInterval(n), e.playerRankTable || e.useAchievements ? e.joinBestRoom() : e.joinFullestRoom())
                    }, 100)
                },
                callback: function(e, t) {
                    var n = t;
                    "mm-list" == e.pt && n.updateRooms(e.rooms), "mm-make" == e.pt && this.roomList("game", null, {
                        mm: !0
                    }, "mm-list"), "mm-join" == e.pt && this.userMeta({
                        rank: n.playerRank
                    }, "mm-meta"), "rooms" == e.section && "leave" == e.action && (n.availableRooms = [], n.playerRank = 0), "playerjoined" == e.action && clearTimeout(n.lonleyPlayerTimeout), "mm-list-check" == e.pt && (e.rooms && 1 != e.rooms[0].playerCount || (clearTimeout(n.lonleyPlayerTimeout), this.roomLeave(), setTimeout(function() {
                        n.autoJoinGame()
                    }, 100)))
                },
                getPlayersRank: function() {
                    if (this.playerRankTable && i.getAuthResponse()) {
                        var e = {
                            table: this.playerRankTable,
                            highest: this.highest,
                            playerid: i.getAuthResponse().details.pid
                        };
                        n.Leaderboards.listCustom(e, this.setPlayerRank)
                    } else this.useAchievements && i.getAuthResponse() ? n.Achievements.listCustom(null, this.setPlayerRank) : this.joinFullestRoom()
                },
                setPlayerRank: function(e) {
                    var t = this.ID.Matchmaking;
                    if (e.hasOwnProperty("achievements")) {
                        for (var n = 0, i = 0; i < e.achievements.length; i++) e.achievements[i].hasOwnProperty("player") && ("easy" == e.achievements[i].difficulty ? n += 1 : "medium" == e.achievements[i].difficulty ? n += 3 : "hard" == e.achievements[i].difficulty && (n += 9));
                        t.playerRank = n
                    } else t.playerRank = e.hasOwnProperty("scores") && e.scores.length > 0 ? e.scores[0].points : 1
                },
                joinBestRoom: function() {
                    this.getPlayersRank();
                    var e = 0,
                        t = this,
                        n = setInterval(function() {
                            e++, 0 != t.playerRank && (clearInterval(n), t.sortRoomsByRank()), e > 100 && (clearInterval(n), t.playerRank = 1, t.sortRoomsByRank())
                        }, 100)
                },
                sortRoomsByRank: function() {
                    for (var e = 0; e < this.availableRooms.length; e++) {
                        var n = 0;
                        for (var i in this.availableRooms[e].players) this.availableRooms[e].players[i].hasOwnProperty("rank") && (n += availableRooms[e].players[i].rank);
                        0 != this.availableRooms[e].playerCount && (n = Math.round(n / this.availableRooms[e].playerCount)), this.availableRooms[e].roomRank = n
                    }
                    for (var r = {
                        closeness: 1e5,
                        roomid: null,
                        node: null
                    }, o = 0; o < this.availableRooms.length; o++) {
                        var a = Math.abs(this.availableRooms[o].roomRank - this.playerRank);
                        a < r.closeness && (r.closeness = a, r.roomid = this.availableRooms[o].roomid, r.node = this.availableRooms[o].webnode), t.roomJoin(r.roomid, r.node, "mm-join"), this.lonleyPlayerTimeout = setTimeout(function() {
                            t.roomList(null, r.roomid, {
                                mm: !0
                            }, "mm-list-check")
                        }, 15e3)
                    }
                },
                joinFullestRoom: function() {
                    this.availableRooms = this.availableRooms.sort(function(e, t) {
                        return e.playerCount > t.playerCount ? 1 : e.playerCount < t.playerCount ? -1 : 0
                    });
                    var e = this.availableRooms[this.availableRooms.length - 1];
                    t.roomJoin(e.roomid, e.webnode, "mm-join")
                },
                updateRooms: function(e) {
                    if (this.availableRooms = [], this.joinAnytime)
                        for (var n = 0; n < e.length; n++) e[n].playerCount != e[n].maxPlayers && this.availableRooms.push(e[n]);
                    else
                        for (var i = 0; i < e.length; i++) e[i].playerCount != e[i].maxPlayers && e[i].isOpen && this.availableRooms.push(e[i]);
                    0 == this.availableRooms.length && t.roomCreate("game", null, {
                        mm: !0
                    }, "mm-make", {
                        maxPlayers: this.maxPlayers
                    })
                }
            }
        }), define("id", ["underscore", "utils/wrapper", "utils/dom_ready", "sdk", "runtime", "auth", "event", "utils/hide_plugin", "rpc", "dialogs_manager", "tracking", "analytics", "options", "logger", "app_image", "playtomic", "protection", "secret_menu", "matchmaking", "multiplayer"], function(e, t, n, i, r, o, a, s, u, c, l, d, f, p, h, g, m, v, y, b) {
            return function(w) {
                w.ID = {
                    Event: a,
                    track: function(e) {
                        var t = setInterval(function() {
                            r.initialized() && (l.track(r.getAppId(), e), clearInterval(t))
                        }, 500)
                    },
                    underscore: e,
                    api: function(e, t, n, r) {
                        i.api.api(e, t, n, r)
                    },
                    login: function(e, n) {
                        o.login(n, t(e), t(e)), p.addCall()
                    },
                    register: function(e, n) {
                        o.register(n, t(e), t(e)), p.addCall()
                    },
                    getAuthResponse: function(e) {
                        return t(e).call({}, r.getAuthResponse())
                    },
                    getLoginStatus: function(e, n, i) {
                        var a = r.getLoginStatus() || {};
                        return n ? (p.addCall(), o.fetchLoginStatus(e, e, i)) : a.status && a.authResponse ? t(e).call({}, a) : void o.fetchLoginStatus(e, e, i)
                    },
                    ui: function(e, t, n) {
                        c.open(e, t, n), p.addCall()
                    },
                    leaderboard: function() {
                        c.open({
                            method: "leaderboard",
                            redirect_uri: r.getRedirectUri()
                        }), p.addCall()
                    },
                    certification: function() {
                        c.open({
                            method: "certification",
                            redirect_uri: r.getRedirectUri()
                        }), p.addCall()
                    },
                    points_leaderboard: function() {
                        c.open({
                            method: "points_leaderboard",
                            redirect_uri: r.getRedirectUri()
                        })
                    },
                    submit_image: function(e, t) {
                        h.submit(e, t), p.addCall()
                    },
                    GameAPI: g,
                    Protection: m,
                    Matchmaking: y,
                    Multiplayer: b,
                    Analytics: d.developer,
                    hidePluginElement: s.hidePluginElement,
                    showPluginElement: s.showPluginElement,
                    init: function(e) {
                        if (e.forceInit) r.reset(), f.reset(), d.reset();
                        else if (r.initialized()) return;
                        if (r.init(e), r.initialized()) try {
                            u.xdHandler(), f.update(), d.init(this), v.init()
                        } catch (t) {
                            p.log("Error in id " + t)
                        }
                        e && e.status && ID.getLoginStatus()
                    }
                }, n(function() {
                    e.isFunction(w.idAsyncInit) && w.idAsyncInit()
                })
            }
        }), require(["id"], function(e) {
            e(window)
        }), define("main", function() {})
}();
//# sourceMappingURL=sdk.js.map