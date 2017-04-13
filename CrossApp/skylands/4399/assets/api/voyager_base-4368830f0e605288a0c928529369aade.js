/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */
(function(e, t) {
    function P(e) {
        var t = e.length,
            n = b.type(e);
        return b.isWindow(e) ? !1 : e.nodeType === 1 && t ? !0 : n === "array" || n !== "function" && (t === 0 || typeof t == "number" && t > 0 && t - 1 in e)
    }

    function B(e) {
        var t = H[e] = {};
        return b.each(e.match(E) || [], function(e, n) {
            t[n] = !0
        }), t
    }

    function I(e, n, r, i) {
        if (!b.acceptData(e)) return;
        var s, o, u = b.expando,
            a = typeof n == "string",
            f = e.nodeType,
            c = f ? b.cache : e,
            h = f ? e[u] : e[u] && u;
        if ((!h || !c[h] || !i && !c[h].data) && a && r === t) return;
        h || (f ? e[u] = h = l.pop() || b.guid++ : h = u), c[h] || (c[h] = {}, f || (c[h].toJSON = b.noop));
        if (typeof n == "object" || typeof n == "function") i ? c[h] = b.extend(c[h], n) : c[h].data = b.extend(c[h].data, n);
        return s = c[h], i || (s.data || (s.data = {}), s = s.data), r !== t && (s[b.camelCase(n)] = r), a ? (o = s[n], o == null && (o = s[b.camelCase(n)])) : o = s, o
    }

    function q(e, t, n) {
        if (!b.acceptData(e)) return;
        var r, i, s, o = e.nodeType,
            u = o ? b.cache : e,
            a = o ? e[b.expando] : b.expando;
        if (!u[a]) return;
        if (t) {
            s = n ? u[a] : u[a].data;
            if (s) {
                b.isArray(t) ? t = t.concat(b.map(t, b.camelCase)) : t in s ? t = [t] : (t = b.camelCase(t), t in s ? t = [t] : t = t.split(" "));
                for (r = 0, i = t.length; r < i; r++) delete s[t[r]];
                if (!(n ? U : b.isEmptyObject)(s)) return
            }
        }
        if (!n) {
            delete u[a].data;
            if (!U(u[a])) return
        }
        o ? b.cleanData([e], !0) : b.support.deleteExpando || u != u.window ? delete u[a] : u[a] = null
    }

    function R(e, n, r) {
        if (r === t && e.nodeType === 1) {
            var i = "data-" + n.replace(F, "-$1").toLowerCase();
            r = e.getAttribute(i);
            if (typeof r == "string") {
                try {
                    r = r === "true" ? !0 : r === "false" ? !1 : r === "null" ? null : +r + "" === r ? +r : j.test(r) ? b.parseJSON(r) : r
                } catch (s) {}
                b.data(e, n, r)
            } else r = t
        }
        return r
    }

    function U(e) {
        var t;
        for (t in e) {
            if (t === "data" && b.isEmptyObject(e[t])) continue;
            if (t !== "toJSON") return !1
        }
        return !0
    }

    function it() {
        return !0
    }

    function st() {
        return !1
    }

    function ct(e, t) {
        do e = e[t]; while (e && e.nodeType !== 1);
        return e
    }

    function ht(e, t, n) {
        t = t || 0;
        if (b.isFunction(t)) return b.grep(e, function(e, r) {
            var i = !!t.call(e, r, e);
            return i === n
        });
        if (t.nodeType) return b.grep(e, function(e) {
            return e === t === n
        });
        if (typeof t == "string") {
            var r = b.grep(e, function(e) {
                return e.nodeType === 1
            });
            if (at.test(t)) return b.filter(t, r, !n);
            t = b.filter(t, r)
        }
        return b.grep(e, function(e) {
            return b.inArray(e, t) >= 0 === n
        })
    }

    function pt(e) {
        var t = dt.split("|"),
            n = e.createDocumentFragment();
        if (n.createElement)
            while (t.length) n.createElement(t.pop());
        return n
    }

    function Mt(e, t) {
        return e.getElementsByTagName(t)[0] || e.appendChild(e.ownerDocument.createElement(t))
    }

    function _t(e) {
        var t = e.getAttributeNode("type");
        return e.type = (t && t.specified) + "/" + e.type, e
    }

    function Dt(e) {
        var t = Ct.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function Pt(e, t) {
        var n, r = 0;
        for (;
            (n = e[r]) != null; r++) b._data(n, "globalEval", !t || b._data(t[r], "globalEval"))
    }

    function Ht(e, t) {
        if (t.nodeType !== 1 || !b.hasData(e)) return;
        var n, r, i, s = b._data(e),
            o = b._data(t, s),
            u = s.events;
        if (u) {
            delete o.handle, o.events = {};
            for (n in u)
                for (r = 0, i = u[n].length; r < i; r++) b.event.add(t, n, u[n][r])
        }
        o.data && (o.data = b.extend({}, o.data))
    }

    function Bt(e, t) {
        var n, r, i;
        if (t.nodeType !== 1) return;
        n = t.nodeName.toLowerCase();
        if (!b.support.noCloneEvent && t[b.expando]) {
            i = b._data(t);
            for (r in i.events) b.removeEvent(t, r, i.handle);
            t.removeAttribute(b.expando)
        }
        if (n === "script" && t.text !== e.text) _t(t).text = e.text, Dt(t);
        else if (n === "object") t.parentNode && (t.outerHTML = e.outerHTML), b.support.html5Clone && e.innerHTML && !b.trim(t.innerHTML) && (t.innerHTML = e.innerHTML);
        else if (n === "input" && xt.test(e.type)) t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value);
        else if (n === "option") t.defaultSelected = t.selected = e.defaultSelected;
        else if (n === "input" || n === "textarea") t.defaultValue = e.defaultValue
    }

    function jt(e, n) {
        var r, s, o = 0,
            u = typeof e.getElementsByTagName !== i ? e.getElementsByTagName(n || "*") : typeof e.querySelectorAll !== i ? e.querySelectorAll(n || "*") : t;
        if (!u)
            for (u = [], r = e.childNodes || e;
                (s = r[o]) != null; o++)!n || b.nodeName(s, n) ? u.push(s) : b.merge(u, jt(s, n));
        return n === t || n && b.nodeName(e, n) ? b.merge([e], u) : u
    }

    function Ft(e) {
        xt.test(e.type) && (e.defaultChecked = e.checked)
    }

    function tn(e, t) {
        if (t in e) return t;
        var n = t.charAt(0).toUpperCase() + t.slice(1),
            r = t,
            i = en.length;
        while (i--) {
            t = en[i] + n;
            if (t in e) return t
        }
        return r
    }

    function nn(e, t) {
        return e = t || e, b.css(e, "display") === "none" || !b.contains(e.ownerDocument, e)
    }

    function rn(e, t) {
        var n, r, i, s = [],
            o = 0,
            u = e.length;
        for (; o < u; o++) {
            r = e[o];
            if (!r.style) continue;
            s[o] = b._data(r, "olddisplay"), n = r.style.display, t ? (!s[o] && n === "none" && (r.style.display = ""), r.style.display === "" && nn(r) && (s[o] = b._data(r, "olddisplay", an(r.nodeName)))) : s[o] || (i = nn(r), (n && n !== "none" || !i) && b._data(r, "olddisplay", i ? n : b.css(r, "display")))
        }
        for (o = 0; o < u; o++) {
            r = e[o];
            if (!r.style) continue;
            if (!t || r.style.display === "none" || r.style.display === "") r.style.display = t ? s[o] || "" : "none"
        }
        return e
    }

    function sn(e, t, n) {
        var r = $t.exec(t);
        return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
    }

    function on(e, t, n, r, i) {
        var s = n === (r ? "border" : "content") ? 4 : t === "width" ? 1 : 0,
            o = 0;
        for (; s < 4; s += 2) n === "margin" && (o += b.css(e, n + Zt[s], !0, i)), r ? (n === "content" && (o -= b.css(e, "padding" + Zt[s], !0, i)), n !== "margin" && (o -= b.css(e, "border" + Zt[s] + "Width", !0, i))) : (o += b.css(e, "padding" + Zt[s], !0, i), n !== "padding" && (o += b.css(e, "border" + Zt[s] + "Width", !0, i)));
        return o
    }

    function un(e, t, n) {
        var r = !0,
            i = t === "width" ? e.offsetWidth : e.offsetHeight,
            s = qt(e),
            o = b.support.boxSizing && b.css(e, "boxSizing", !1, s) === "border-box";
        if (i <= 0 || i == null) {
            i = Rt(e, t, s);
            if (i < 0 || i == null) i = e.style[t];
            if (Jt.test(i)) return i;
            r = o && (b.support.boxSizingReliable || i === e.style[t]), i = parseFloat(i) || 0
        }
        return i + on(e, t, n || (o ? "border" : "content"), r, s) + "px"
    }

    function an(e) {
        var t = s,
            n = Qt[e];
        if (!n) {
            n = fn(e, t);
            if (n === "none" || !n) It = (It || b("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(t.documentElement), t = (It[0].contentWindow || It[0].contentDocument).document, t.write("<!doctype html><html><body>"), t.close(), n = fn(e, t), It.detach();
            Qt[e] = n
        }
        return n
    }

    function fn(e, t) {
        var n = b(t.createElement(e)).appendTo(t.body),
            r = b.css(n[0], "display");
        return n.remove(), r
    }

    function vn(e, t, n, r) {
        var i;
        if (b.isArray(t)) b.each(t, function(t, i) {
            n || cn.test(e) ? r(e, i) : vn(e + "[" + (typeof i == "object" ? t : "") + "]", i, n, r)
        });
        else if (!n && b.type(t) === "object")
            for (i in t) vn(e + "[" + i + "]", t[i], n, r);
        else r(e, t)
    }

    function _n(e) {
        return function(t, n) {
            typeof t != "string" && (n = t, t = "*");
            var r, i = 0,
                s = t.toLowerCase().match(E) || [];
            if (b.isFunction(n))
                while (r = s[i++]) r[0] === "+" ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
        }
    }

    function Dn(e, t, n, r) {
        function o(u) {
            var a;
            return i[u] = !0, b.each(e[u] || [], function(e, u) {
                var f = u(t, n, r);
                if (typeof f == "string" && !s && !i[f]) return t.dataTypes.unshift(f), o(f), !1;
                if (s) return !(a = f)
            }), a
        }
        var i = {},
            s = e === An;
        return o(t.dataTypes[0]) || !i["*"] && o("*")
    }

    function Pn(e, n) {
        var r, i, s = b.ajaxSettings.flatOptions || {};
        for (i in n) n[i] !== t && ((s[i] ? e : r || (r = {}))[i] = n[i]);
        return r && b.extend(!0, e, r), e
    }

    function Hn(e, n, r) {
        var i, s, o, u, a = e.contents,
            f = e.dataTypes,
            l = e.responseFields;
        for (u in l) u in r && (n[l[u]] = r[u]);
        while (f[0] === "*") f.shift(), s === t && (s = e.mimeType || n.getResponseHeader("Content-Type"));
        if (s)
            for (u in a)
                if (a[u] && a[u].test(s)) {
                    f.unshift(u);
                    break
                }
        if (f[0] in r) o = f[0];
        else {
            for (u in r) {
                if (!f[0] || e.converters[u + " " + f[0]]) {
                    o = u;
                    break
                }
                i || (i = u)
            }
            o = o || i
        } if (o) return o !== f[0] && f.unshift(o), r[o]
    }

    function Bn(e, t) {
        var n, r, i, s, o = {},
            u = 0,
            a = e.dataTypes.slice(),
            f = a[0];
        e.dataFilter && (t = e.dataFilter(t, e.dataType));
        if (a[1])
            for (i in e.converters) o[i.toLowerCase()] = e.converters[i];
        for (; r = a[++u];)
            if (r !== "*") {
                if (f !== "*" && f !== r) {
                    i = o[f + " " + r] || o["* " + r];
                    if (!i)
                        for (n in o) {
                            s = n.split(" ");
                            if (s[1] === r) {
                                i = o[f + " " + s[0]] || o["* " + s[0]];
                                if (i) {
                                    i === !0 ? i = o[n] : o[n] !== !0 && (r = s[0], a.splice(u--, 0, r));
                                    break
                                }
                            }
                        }
                    if (i !== !0)
                        if (i && e["throws"]) t = i(t);
                        else try {
                            t = i(t)
                        } catch (l) {
                            return {
                                state: "parsererror",
                                error: i ? l : "No conversion from " + f + " to " + r
                            }
                        }
                }
                f = r
            }
        return {
            state: "success",
            data: t
        }
    }

    function zn() {
        try {
            return new e.XMLHttpRequest
        } catch (t) {}
    }

    function Wn() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {}
    }

    function Yn() {
        return setTimeout(function() {
            Xn = t
        }), Xn = b.now()
    }

    function Zn(e, t) {
        b.each(t, function(t, n) {
            var r = (Gn[t] || []).concat(Gn["*"]),
                i = 0,
                s = r.length;
            for (; i < s; i++)
                if (r[i].call(e, t, n)) return
        })
    }

    function er(e, t, n) {
        var r, i, s = 0,
            o = Qn.length,
            u = b.Deferred().always(function() {
                delete a.elem
            }),
            a = function() {
                if (i) return !1;
                var t = Xn || Yn(),
                    n = Math.max(0, f.startTime + f.duration - t),
                    r = n / f.duration || 0,
                    s = 1 - r,
                    o = 0,
                    a = f.tweens.length;
                for (; o < a; o++) f.tweens[o].run(s);
                return u.notifyWith(e, [f, s, n]), s < 1 && a ? n : (u.resolveWith(e, [f]), !1)
            },
            f = u.promise({
                elem: e,
                props: b.extend({}, t),
                opts: b.extend(!0, {
                    specialEasing: {}
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: Xn || Yn(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var r = b.Tween(e, f.opts, t, n, f.opts.specialEasing[t] || f.opts.easing);
                    return f.tweens.push(r), r
                },
                stop: function(t) {
                    var n = 0,
                        r = t ? f.tweens.length : 0;
                    if (i) return this;
                    i = !0;
                    for (; n < r; n++) f.tweens[n].run(1);
                    return t ? u.resolveWith(e, [f, t]) : u.rejectWith(e, [f, t]), this
                }
            }),
            l = f.props;
        tr(l, f.opts.specialEasing);
        for (; s < o; s++) {
            r = Qn[s].call(f, e, l, f.opts);
            if (r) return r
        }
        return Zn(f, l), b.isFunction(f.opts.start) && f.opts.start.call(e, f), b.fx.timer(b.extend(a, {
            elem: e,
            anim: f,
            queue: f.opts.queue
        })), f.progress(f.opts.progress).done(f.opts.done, f.opts.complete).fail(f.opts.fail).always(f.opts.always)
    }

    function tr(e, t) {
        var n, r, i, s, o;
        for (i in e) {
            r = b.camelCase(i), s = t[r], n = e[i], b.isArray(n) && (s = n[1], n = e[i] = n[0]), i !== r && (e[r] = n, delete e[i]), o = b.cssHooks[r];
            if (o && "expand" in o) {
                n = o.expand(n), delete e[r];
                for (i in n) i in e || (e[i] = n[i], t[i] = s)
            } else t[r] = s
        }
    }

    function nr(e, t, n) {
        var r, i, s, o, u, a, f, l, c, h = this,
            p = e.style,
            d = {},
            v = [],
            m = e.nodeType && nn(e);
        n.queue || (l = b._queueHooks(e, "fx"), l.unqueued == null && (l.unqueued = 0, c = l.empty.fire, l.empty.fire = function() {
            l.unqueued || c()
        }), l.unqueued++, h.always(function() {
            h.always(function() {
                l.unqueued--, b.queue(e, "fx").length || l.empty.fire()
            })
        })), e.nodeType === 1 && ("height" in t || "width" in t) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], b.css(e, "display") === "inline" && b.css(e, "float") === "none" && (!b.support.inlineBlockNeedsLayout || an(e.nodeName) === "inline" ? p.display = "inline-block" : p.zoom = 1)), n.overflow && (p.overflow = "hidden", b.support.shrinkWrapBlocks || h.always(function() {
            p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
        }));
        for (i in t) {
            o = t[i];
            if ($n.exec(o)) {
                delete t[i], a = a || o === "toggle";
                if (o === (m ? "hide" : "show")) continue;
                v.push(i)
            }
        }
        s = v.length;
        if (s) {
            u = b._data(e, "fxshow") || b._data(e, "fxshow", {}), "hidden" in u && (m = u.hidden), a && (u.hidden = !m), m ? b(e).show() : h.done(function() {
                b(e).hide()
            }), h.done(function() {
                var t;
                b._removeData(e, "fxshow");
                for (t in d) b.style(e, t, d[t])
            });
            for (i = 0; i < s; i++) r = v[i], f = h.createTween(r, m ? u[r] : 0), d[r] = u[r] || b.style(e, r), r in u || (u[r] = f.start, m && (f.end = f.start, f.start = r === "width" || r === "height" ? 1 : 0))
        }
    }

    function rr(e, t, n, r, i) {
        return new rr.prototype.init(e, t, n, r, i)
    }

    function ir(e, t) {
        var n, r = {
                height: e
            },
            i = 0;
        t = t ? 1 : 0;
        for (; i < 4; i += 2 - t) n = Zt[i], r["margin" + n] = r["padding" + n] = e;
        return t && (r.opacity = r.width = e), r
    }

    function sr(e) {
        return b.isWindow(e) ? e : e.nodeType === 9 ? e.defaultView || e.parentWindow : !1
    }
    var n, r, i = typeof t,
        s = e.document,
        o = e.location,
        u = e.jQuery,
        a = e.$,
        f = {},
        l = [],
        c = "1.9.1",
        h = l.concat,
        p = l.push,
        d = l.slice,
        v = l.indexOf,
        m = f.toString,
        g = f.hasOwnProperty,
        y = c.trim,
        b = function(e, t) {
            return new b.fn.init(e, t, r)
        },
        w = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        E = /\S+/g,
        S = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        x = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        T = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        N = /^[\],:{}\s]*$/,
        C = /(?:^|:|,)(?:\s*\[)+/g,
        k = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        L = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
        A = /^-ms-/,
        O = /-([\da-z])/gi,
        M = function(e, t) {
            return t.toUpperCase()
        },
        _ = function(e) {
            if (s.addEventListener || e.type === "load" || s.readyState === "complete") D(), b.ready()
        },
        D = function() {
            s.addEventListener ? (s.removeEventListener("DOMContentLoaded", _, !1), e.removeEventListener("load", _, !1)) : (s.detachEvent("onreadystatechange", _), e.detachEvent("onload", _))
        };
    b.fn = b.prototype = {
        jquery: c,
        constructor: b,
        init: function(e, n, r) {
            var i, o;
            if (!e) return this;
            if (typeof e == "string") {
                e.charAt(0) === "<" && e.charAt(e.length - 1) === ">" && e.length >= 3 ? i = [null, e, null] : i = x.exec(e);
                if (i && (i[1] || !n)) {
                    if (i[1]) {
                        n = n instanceof b ? n[0] : n, b.merge(this, b.parseHTML(i[1], n && n.nodeType ? n.ownerDocument || n : s, !0));
                        if (T.test(i[1]) && b.isPlainObject(n))
                            for (i in n) b.isFunction(this[i]) ? this[i](n[i]) : this.attr(i, n[i]);
                        return this
                    }
                    o = s.getElementById(i[2]);
                    if (o && o.parentNode) {
                        if (o.id !== i[2]) return r.find(e);
                        this.length = 1, this[0] = o
                    }
                    return this.context = s, this.selector = e, this
                }
                return !n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e)
            }
            return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : b.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), b.makeArray(e, this))
        },
        selector: "",
        length: 0,
        size: function() {
            return this.length
        },
        toArray: function() {
            return d.call(this)
        },
        get: function(e) {
            return e == null ? this.toArray() : e < 0 ? this[this.length + e] : this[e]
        },
        pushStack: function(e) {
            var t = b.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function(e, t) {
            return b.each(this, e, t)
        },
        ready: function(e) {
            return b.ready.promise().done(e), this
        },
        slice: function() {
            return this.pushStack(d.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (e < 0 ? t : 0);
            return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
        },
        map: function(e) {
            return this.pushStack(b.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: p,
        sort: [].sort,
        splice: [].splice
    }, b.fn.init.prototype = b.fn, b.extend = b.fn.extend = function() {
        var e, n, r, i, s, o, u = arguments[0] || {},
            a = 1,
            f = arguments.length,
            l = !1;
        typeof u == "boolean" && (l = u, u = arguments[1] || {}, a = 2), typeof u != "object" && !b.isFunction(u) && (u = {}), f === a && (u = this, --a);
        for (; a < f; a++)
            if ((s = arguments[a]) != null)
                for (i in s) {
                    e = u[i], r = s[i];
                    if (u === r) continue;
                    l && r && (b.isPlainObject(r) || (n = b.isArray(r))) ? (n ? (n = !1, o = e && b.isArray(e) ? e : []) : o = e && b.isPlainObject(e) ? e : {}, u[i] = b.extend(l, o, r)) : r !== t && (u[i] = r)
                }
            return u
    }, b.extend({
        noConflict: function(t) {
            return e.$ === b && (e.$ = a), t && e.jQuery === b && (e.jQuery = u), b
        },
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? b.readyWait++ : b.ready(!0)
        },
        ready: function(e) {
            if (e === !0 ? --b.readyWait : b.isReady) return;
            if (!s.body) return setTimeout(b.ready);
            b.isReady = !0;
            if (e !== !0 && --b.readyWait > 0) return;
            n.resolveWith(s, [b]), b.fn.trigger && b(s).trigger("ready").off("ready")
        },
        isFunction: function(e) {
            return b.type(e) === "function"
        },
        isArray: Array.isArray || function(e) {
            return b.type(e) === "array"
        },
        isWindow: function(e) {
            return e != null && e == e.window
        },
        isNumeric: function(e) {
            return !isNaN(parseFloat(e)) && isFinite(e)
        },
        type: function(e) {
            return e == null ? String(e) : typeof e == "object" || typeof e == "function" ? f[m.call(e)] || "object" : typeof e
        },
        isPlainObject: function(e) {
            if (!e || b.type(e) !== "object" || e.nodeType || b.isWindow(e)) return !1;
            try {
                if (e.constructor && !g.call(e, "constructor") && !g.call(e.constructor.prototype, "isPrototypeOf")) return !1
            } catch (n) {
                return !1
            }
            var r;
            for (r in e);
            return r === t || g.call(e, r)
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        error: function(e) {
            throw new Error(e)
        },
        parseHTML: function(e, t, n) {
            if (!e || typeof e != "string") return null;
            typeof t == "boolean" && (n = t, t = !1), t = t || s;
            var r = T.exec(e),
                i = !n && [];
            return r ? [t.createElement(r[1])] : (r = b.buildFragment([e], t, i), i && b(i).remove(), b.merge([], r.childNodes))
        },
        parseJSON: function(t) {
            if (e.JSON && e.JSON.parse) return e.JSON.parse(t);
            if (t === null) return t;
            if (typeof t == "string") {
                t = b.trim(t);
                if (t && N.test(t.replace(k, "@").replace(L, "]").replace(C, ""))) return (new Function("return " + t))()
            }
            b.error("Invalid JSON: " + t)
        },
        parseXML: function(n) {
            var r, i;
            if (!n || typeof n != "string") return null;
            try {
                e.DOMParser ? (i = new DOMParser, r = i.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n))
            } catch (s) {
                r = t
            }
            return (!r || !r.documentElement || r.getElementsByTagName("parsererror").length) && b.error("Invalid XML: " + n), r
        },
        noop: function() {},
        globalEval: function(t) {
            t && b.trim(t) && (e.execScript || function(t) {
                e.eval.call(e, t)
            })(t)
        },
        camelCase: function(e) {
            return e.replace(A, "ms-").replace(O, M)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t, n) {
            var r, i = 0,
                s = e.length,
                o = P(e);
            if (n)
                if (o)
                    for (; i < s; i++) {
                        r = t.apply(e[i], n);
                        if (r === !1) break
                    } else
                        for (i in e) {
                            r = t.apply(e[i], n);
                            if (r === !1) break
                        } else if (o)
                            for (; i < s; i++) {
                                r = t.call(e[i], i, e[i]);
                                if (r === !1) break
                            } else
                                for (i in e) {
                                    r = t.call(e[i], i, e[i]);
                                    if (r === !1) break
                                }
                        return e
        },
        trim: y && !y.call("﻿ ") ? function(e) {
            return e == null ? "" : y.call(e)
        } : function(e) {
            return e == null ? "" : (e + "").replace(S, "")
        },
        makeArray: function(e, t) {
            var n = t || [];
            return e != null && (P(Object(e)) ? b.merge(n, typeof e == "string" ? [e] : e) : p.call(n, e)), n
        },
        inArray: function(e, t, n) {
            var r;
            if (t) {
                if (v) return v.call(t, e, n);
                r = t.length, n = n ? n < 0 ? Math.max(0, r + n) : n : 0;
                for (; n < r; n++)
                    if (n in t && t[n] === e) return n
            }
            return -1
        },
        merge: function(e, n) {
            var r = n.length,
                i = e.length,
                s = 0;
            if (typeof r == "number")
                for (; s < r; s++) e[i++] = n[s];
            else
                while (n[s] !== t) e[i++] = n[s++];
            return e.length = i, e
        },
        grep: function(e, t, n) {
            var r, i = [],
                s = 0,
                o = e.length;
            n = !!n;
            for (; s < o; s++) r = !!t(e[s], s), n !== r && i.push(e[s]);
            return i
        },
        map: function(e, t, n) {
            var r, i = 0,
                s = e.length,
                o = P(e),
                u = [];
            if (o)
                for (; i < s; i++) r = t(e[i], i, n), r != null && (u[u.length] = r);
            else
                for (i in e) r = t(e[i], i, n), r != null && (u[u.length] = r);
            return h.apply([], u)
        },
        guid: 1,
        proxy: function(e, n) {
            var r, i, s;
            return typeof n == "string" && (s = e[n], n = e, e = s), b.isFunction(e) ? (r = d.call(arguments, 2), i = function() {
                return e.apply(n || this, r.concat(d.call(arguments)))
            }, i.guid = e.guid = e.guid || b.guid++, i) : t
        },
        access: function(e, n, r, i, s, o, u) {
            var a = 0,
                f = e.length,
                l = r == null;
            if (b.type(r) === "object") {
                s = !0;
                for (a in r) b.access(e, n, a, r[a], !0, o, u)
            } else if (i !== t) {
                s = !0, b.isFunction(i) || (u = !0), l && (u ? (n.call(e, i), n = null) : (l = n, n = function(e, t, n) {
                    return l.call(b(e), n)
                }));
                if (n)
                    for (; a < f; a++) n(e[a], r, u ? i : i.call(e[a], a, n(e[a], r)))
            }
            return s ? e : l ? n.call(e) : f ? n(e[0], r) : o
        },
        now: function() {
            return (new Date).getTime()
        }
    }), b.ready.promise = function(t) {
        if (!n) {
            n = b.Deferred();
            if (s.readyState === "complete") setTimeout(b.ready);
            else if (s.addEventListener) s.addEventListener("DOMContentLoaded", _, !1), e.addEventListener("load", _, !1);
            else {
                s.attachEvent("onreadystatechange", _), e.attachEvent("onload", _);
                var r = !1;
                try {
                    r = e.frameElement == null && s.documentElement
                } catch (i) {}
                r && r.doScroll && function o() {
                    if (!b.isReady) {
                        try {
                            r.doScroll("left")
                        } catch (e) {
                            return setTimeout(o, 50)
                        }
                        D(), b.ready()
                    }
                }()
            }
        }
        return n.promise(t)
    }, b.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        f["[object " + t + "]"] = t.toLowerCase()
    }), r = b(s);
    var H = {};
    b.Callbacks = function(e) {
        e = typeof e == "string" ? H[e] || B(e) : b.extend({}, e);
        var n, r, i, s, o, u, a = [],
            f = !e.once && [],
            l = function(t) {
                r = e.memory && t, i = !0, o = u || 0, u = 0, s = a.length, n = !0;
                for (; a && o < s; o++)
                    if (a[o].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
                        r = !1;
                        break
                    }
                n = !1, a && (f ? f.length && l(f.shift()) : r ? a = [] : c.disable())
            },
            c = {
                add: function() {
                    if (a) {
                        var t = a.length;
                        (function i(t) {
                            b.each(t, function(t, n) {
                                var r = b.type(n);
                                r === "function" ? (!e.unique || !c.has(n)) && a.push(n) : n && n.length && r !== "string" && i(n)
                            })
                        })(arguments), n ? s = a.length : r && (u = t, l(r))
                    }
                    return this
                },
                remove: function() {
                    return a && b.each(arguments, function(e, t) {
                        var r;
                        while ((r = b.inArray(t, a, r)) > -1) a.splice(r, 1), n && (r <= s && s--, r <= o && o--)
                    }), this
                },
                has: function(e) {
                    return e ? b.inArray(e, a) > -1 : !!a && !!a.length
                },
                empty: function() {
                    return a = [], this
                },
                disable: function() {
                    return a = f = r = t, this
                },
                disabled: function() {
                    return !a
                },
                lock: function() {
                    return f = t, r || c.disable(), this
                },
                locked: function() {
                    return !f
                },
                fireWith: function(e, t) {
                    return t = t || [], t = [e, t.slice ? t.slice() : t], a && (!i || f) && (n ? f.push(t) : l(t)), this
                },
                fire: function() {
                    return c.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!i
                }
            };
        return c
    }, b.extend({
        Deferred: function(e) {
            var t = [
                    ["resolve", "done", b.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", b.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", b.Callbacks("memory")]
                ],
                n = "pending",
                r = {
                    state: function() {
                        return n
                    },
                    always: function() {
                        return i.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var e = arguments;
                        return b.Deferred(function(n) {
                            b.each(t, function(t, s) {
                                var o = s[0],
                                    u = b.isFunction(e[t]) && e[t];
                                i[s[1]](function() {
                                    var e = u && u.apply(this, arguments);
                                    e && b.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[o + "With"](this === r ? n.promise() : this, u ? [e] : arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    promise: function(e) {
                        return e != null ? b.extend(e, r) : r
                    }
                },
                i = {};
            return r.pipe = r.then, b.each(t, function(e, s) {
                var o = s[2],
                    u = s[3];
                r[s[1]] = o.add, u && o.add(function() {
                    n = u
                }, t[e ^ 1][2].disable, t[2][2].lock), i[s[0]] = function() {
                    return i[s[0] + "With"](this === i ? r : this, arguments), this
                }, i[s[0] + "With"] = o.fireWith
            }), r.promise(i), e && e.call(i, i), i
        },
        when: function(e) {
            var t = 0,
                n = d.call(arguments),
                r = n.length,
                i = r !== 1 || e && b.isFunction(e.promise) ? r : 0,
                s = i === 1 ? e : b.Deferred(),
                o = function(e, t, n) {
                    return function(r) {
                        t[e] = this, n[e] = arguments.length > 1 ? d.call(arguments) : r, n === u ? s.notifyWith(t, n) : --i || s.resolveWith(t, n)
                    }
                },
                u, a, f;
            if (r > 1) {
                u = new Array(r), a = new Array(r), f = new Array(r);
                for (; t < r; t++) n[t] && b.isFunction(n[t].promise) ? n[t].promise().done(o(t, f, n)).fail(s.reject).progress(o(t, a, u)) : --i
            }
            return i || s.resolveWith(f, n), s.promise()
        }
    }), b.support = function() {
        var t, n, r, o, u, a, f, l, c, h, p = s.createElement("div");
        p.setAttribute("className", "t"), p.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = p.getElementsByTagName("*"), r = p.getElementsByTagName("a")[0];
        if (!n || !r || !n.length) return {};
        u = s.createElement("select"), f = u.appendChild(s.createElement("option")), o = p.getElementsByTagName("input")[0], r.style.cssText = "top:1px;float:left;opacity:.5", t = {
            getSetAttribute: p.className !== "t",
            leadingWhitespace: p.firstChild.nodeType === 3,
            tbody: !p.getElementsByTagName("tbody").length,
            htmlSerialize: !!p.getElementsByTagName("link").length,
            style: /top/.test(r.getAttribute("style")),
            hrefNormalized: r.getAttribute("href") === "/a",
            opacity: /^0.5/.test(r.style.opacity),
            cssFloat: !!r.style.cssFloat,
            checkOn: !!o.value,
            optSelected: f.selected,
            enctype: !!s.createElement("form").enctype,
            html5Clone: s.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
            boxModel: s.compatMode === "CSS1Compat",
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0,
            boxSizingReliable: !0,
            pixelPosition: !1
        }, o.checked = !0, t.noCloneChecked = o.cloneNode(!0).checked, u.disabled = !0, t.optDisabled = !f.disabled;
        try {
            delete p.test
        } catch (d) {
            t.deleteExpando = !1
        }
        o = s.createElement("input"), o.setAttribute("value", ""), t.input = o.getAttribute("value") === "", o.value = "t", o.setAttribute("type", "radio"), t.radioValue = o.value === "t", o.setAttribute("checked", "t"), o.setAttribute("name", "t"), a = s.createDocumentFragment(), a.appendChild(o), t.appendChecked = o.checked, t.checkClone = a.cloneNode(!0).cloneNode(!0).lastChild.checked, p.attachEvent && (p.attachEvent("onclick", function() {
            t.noCloneEvent = !1
        }), p.cloneNode(!0).click());
        for (h in {
            submit: !0,
            change: !0,
            focusin: !0
        }) p.setAttribute(l = "on" + h, "t"), t[h + "Bubbles"] = l in e || p.attributes[l].expando === !1;
        return p.style.backgroundClip = "content-box", p.cloneNode(!0).style.backgroundClip = "", t.clearCloneStyle = p.style.backgroundClip === "content-box", b(function() {
            var n, r, o, u = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
                a = s.getElementsByTagName("body")[0];
            if (!a) return;
            n = s.createElement("div"), n.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", a.appendChild(n).appendChild(p), p.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", o = p.getElementsByTagName("td"), o[0].style.cssText = "padding:0;margin:0;border:0;display:none", c = o[0].offsetHeight === 0, o[0].style.display = "", o[1].style.display = "none", t.reliableHiddenOffsets = c && o[0].offsetHeight === 0, p.innerHTML = "", p.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", t.boxSizing = p.offsetWidth === 4, t.doesNotIncludeMarginInBodyOffset = a.offsetTop !== 1, e.getComputedStyle && (t.pixelPosition = (e.getComputedStyle(p, null) || {}).top !== "1%", t.boxSizingReliable = (e.getComputedStyle(p, null) || {
                width: "4px"
            }).width === "4px", r = p.appendChild(s.createElement("div")), r.style.cssText = p.style.cssText = u, r.style.marginRight = r.style.width = "0", p.style.width = "1px", t.reliableMarginRight = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), typeof p.style.zoom !== i && (p.innerHTML = "", p.style.cssText = u + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = p.offsetWidth === 3, p.style.display = "block", p.innerHTML = "<div></div>", p.firstChild.style.width = "5px", t.shrinkWrapBlocks = p.offsetWidth !== 3, t.inlineBlockNeedsLayout && (a.style.zoom = 1)), a.removeChild(n), n = p = o = r = null
        }), n = u = a = f = r = o = null, t
    }();
    var j = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        F = /([A-Z])/g;
    b.extend({
        cache: {},
        expando: "jQuery" + (c + Math.random()).replace(/\D/g, ""),
        noData: {
            embed: !0,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: !0
        },
        hasData: function(e) {
            return e = e.nodeType ? b.cache[e[b.expando]] : e[b.expando], !!e && !U(e)
        },
        data: function(e, t, n) {
            return I(e, t, n)
        },
        removeData: function(e, t) {
            return q(e, t)
        },
        _data: function(e, t, n) {
            return I(e, t, n, !0)
        },
        _removeData: function(e, t) {
            return q(e, t, !0)
        },
        acceptData: function(e) {
            if (e.nodeType && e.nodeType !== 1 && e.nodeType !== 9) return !1;
            var t = e.nodeName && b.noData[e.nodeName.toLowerCase()];
            return !t || t !== !0 && e.getAttribute("classid") === t
        }
    }), b.fn.extend({
        data: function(e, n) {
            var r, i, s = this[0],
                o = 0,
                u = null;
            if (e === t) {
                if (this.length) {
                    u = b.data(s);
                    if (s.nodeType === 1 && !b._data(s, "parsedAttrs")) {
                        r = s.attributes;
                        for (; o < r.length; o++) i = r[o].name, i.indexOf("data-") || (i = b.camelCase(i.slice(5)), R(s, i, u[i]));
                        b._data(s, "parsedAttrs", !0)
                    }
                }
                return u
            }
            return typeof e == "object" ? this.each(function() {
                b.data(this, e)
            }) : b.access(this, function(n) {
                if (n === t) return s ? R(s, e, b.data(s, e)) : null;
                this.each(function() {
                    b.data(this, e, n)
                })
            }, null, n, arguments.length > 1, null, !0)
        },
        removeData: function(e) {
            return this.each(function() {
                b.removeData(this, e)
            })
        }
    }), b.extend({
        queue: function(e, t, n) {
            var r;
            if (e) return t = (t || "fx") + "queue", r = b._data(e, t), n && (!r || b.isArray(n) ? r = b._data(e, t, b.makeArray(n)) : r.push(n)), r || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = b.queue(e, t),
                r = n.length,
                i = n.shift(),
                s = b._queueHooks(e, t),
                o = function() {
                    b.dequeue(e, t)
                };
            i === "inprogress" && (i = n.shift(), r--), s.cur = i, i && (t === "fx" && n.unshift("inprogress"), delete s.stop, i.call(e, o, s)), !r && s && s.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return b._data(e, n) || b._data(e, n, {
                empty: b.Callbacks("once memory").add(function() {
                    b._removeData(e, t + "queue"), b._removeData(e, n)
                })
            })
        }
    }), b.fn.extend({
        queue: function(e, n) {
            var r = 2;
            return typeof e != "string" && (n = e, e = "fx", r--), arguments.length < r ? b.queue(this[0], e) : n === t ? this : this.each(function() {
                var t = b.queue(this, e, n);
                b._queueHooks(this, e), e === "fx" && t[0] !== "inprogress" && b.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                b.dequeue(this, e)
            })
        },
        delay: function(e, t) {
            return e = b.fx ? b.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
                var r = setTimeout(t, e);
                n.stop = function() {
                    clearTimeout(r)
                }
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, n) {
            var r, i = 1,
                s = b.Deferred(),
                o = this,
                u = this.length,
                a = function() {
                    --i || s.resolveWith(o, [o])
                };
            typeof e != "string" && (n = e, e = t), e = e || "fx";
            while (u--) r = b._data(o[u], e + "queueHooks"), r && r.empty && (i++, r.empty.add(a));
            return a(), s.promise(n)
        }
    });
    var z, W, X = /[\t\r\n]/g,
        V = /\r/g,
        $ = /^(?:input|select|textarea|button|object)$/i,
        J = /^(?:a|area)$/i,
        K = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
        Q = /^(?:checked|selected)$/i,
        G = b.support.getSetAttribute,
        Y = b.support.input;
    b.fn.extend({
        attr: function(e, t) {
            return b.access(this, b.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                b.removeAttr(this, e)
            })
        },
        prop: function(e, t) {
            return b.access(this, b.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return e = b.propFix[e] || e, this.each(function() {
                try {
                    this[e] = t, delete this[e]
                } catch (n) {}
            })
        },
        addClass: function(e) {
            var t, n, r, i, s, o = 0,
                u = this.length,
                a = typeof e == "string" && e;
            if (b.isFunction(e)) return this.each(function(t) {
                b(this).addClass(e.call(this, t, this.className))
            });
            if (a) {
                t = (e || "").match(E) || [];
                for (; o < u; o++) {
                    n = this[o], r = n.nodeType === 1 && (n.className ? (" " + n.className + " ").replace(X, " ") : " ");
                    if (r) {
                        s = 0;
                        while (i = t[s++]) r.indexOf(" " + i + " ") < 0 && (r += i + " ");
                        n.className = b.trim(r)
                    }
                }
            }
            return this
        },
        removeClass: function(e) {
            var t, n, r, i, s, o = 0,
                u = this.length,
                a = arguments.length === 0 || typeof e == "string" && e;
            if (b.isFunction(e)) return this.each(function(t) {
                b(this).removeClass(e.call(this, t, this.className))
            });
            if (a) {
                t = (e || "").match(E) || [];
                for (; o < u; o++) {
                    n = this[o], r = n.nodeType === 1 && (n.className ? (" " + n.className + " ").replace(X, " ") : "");
                    if (r) {
                        s = 0;
                        while (i = t[s++])
                            while (r.indexOf(" " + i + " ") >= 0) r = r.replace(" " + i + " ", " ");
                        n.className = e ? b.trim(r) : ""
                    }
                }
            }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e,
                r = typeof t == "boolean";
            return b.isFunction(e) ? this.each(function(n) {
                b(this).toggleClass(e.call(this, n, this.className, t), t)
            }) : this.each(function() {
                if (n === "string") {
                    var s, o = 0,
                        u = b(this),
                        a = t,
                        f = e.match(E) || [];
                    while (s = f[o++]) a = r ? a : !u.hasClass(s), u[a ? "addClass" : "removeClass"](s)
                } else if (n === i || n === "boolean") this.className && b._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : b._data(this, "__className__") || ""
            })
        },
        hasClass: function(e) {
            var t = " " + e + " ",
                n = 0,
                r = this.length;
            for (; n < r; n++)
                if (this[n].nodeType === 1 && (" " + this[n].className + " ").replace(X, " ").indexOf(t) >= 0) return !0;
            return !1
        },
        val: function(e) {
            var n, r, i, s = this[0];
            if (!arguments.length) {
                if (s) return r = b.valHooks[s.type] || b.valHooks[s.nodeName.toLowerCase()], r && "get" in r && (n = r.get(s, "value")) !== t ? n : (n = s.value, typeof n == "string" ? n.replace(V, "") : n == null ? "" : n);
                return
            }
            return i = b.isFunction(e), this.each(function(n) {
                var s, o = b(this);
                if (this.nodeType !== 1) return;
                i ? s = e.call(this, n, o.val()) : s = e, s == null ? s = "" : typeof s == "number" ? s += "" : b.isArray(s) && (s = b.map(s, function(e) {
                    return e == null ? "" : e + ""
                })), r = b.valHooks[this.type] || b.valHooks[this.nodeName.toLowerCase()];
                if (!r || !("set" in r) || r.set(this, s, "value") === t) this.value = s
            })
        }
    }), b.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = e.attributes.value;
                    return !t || t.specified ? e.value : e.text
                }
            },
            select: {
                get: function(e) {
                    var t, n, r = e.options,
                        i = e.selectedIndex,
                        s = e.type === "select-one" || i < 0,
                        o = s ? null : [],
                        u = s ? i + 1 : r.length,
                        a = i < 0 ? u : s ? i : 0;
                    for (; a < u; a++) {
                        n = r[a];
                        if ((n.selected || a === i) && (b.support.optDisabled ? !n.disabled : n.getAttribute("disabled") === null) && (!n.parentNode.disabled || !b.nodeName(n.parentNode, "optgroup"))) {
                            t = b(n).val();
                            if (s) return t;
                            o.push(t)
                        }
                    }
                    return o
                },
                set: function(e, t) {
                    var n = b.makeArray(t);
                    return b(e).find("option").each(function() {
                        this.selected = b.inArray(b(this).val(), n) >= 0
                    }), n.length || (e.selectedIndex = -1), n
                }
            }
        },
        attr: function(e, n, r) {
            var s, o, u, a = e.nodeType;
            if (!e || a === 3 || a === 8 || a === 2) return;
            if (typeof e.getAttribute === i) return b.prop(e, n, r);
            o = a !== 1 || !b.isXMLDoc(e), o && (n = n.toLowerCase(), s = b.attrHooks[n] || (K.test(n) ? W : z));
            if (r === t) return s && o && "get" in s && (u = s.get(e, n)) !== null ? u : (typeof e.getAttribute !== i && (u = e.getAttribute(n)), u == null ? t : u);
            if (r !== null) return s && o && "set" in s && (u = s.set(e, r, n)) !== t ? u : (e.setAttribute(n, r + ""), r);
            b.removeAttr(e, n)
        },
        removeAttr: function(e, t) {
            var n, r, i = 0,
                s = t && t.match(E);
            if (s && e.nodeType === 1)
                while (n = s[i++]) r = b.propFix[n] || n, K.test(n) ? !G && Q.test(n) ? e[b.camelCase("default-" + n)] = e[r] = !1 : e[r] = !1 : b.attr(e, n, ""), e.removeAttribute(G ? n : r)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!b.support.radioValue && t === "radio" && b.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function(e, n, r) {
            var i, s, o, u = e.nodeType;
            if (!e || u === 3 || u === 8 || u === 2) return;
            return o = u !== 1 || !b.isXMLDoc(e), o && (n = b.propFix[n] || n, s = b.propHooks[n]), r !== t ? s && "set" in s && (i = s.set(e, r, n)) !== t ? i : e[n] = r : s && "get" in s && (i = s.get(e, n)) !== null ? i : e[n]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var n = e.getAttributeNode("tabindex");
                    return n && n.specified ? parseInt(n.value, 10) : $.test(e.nodeName) || J.test(e.nodeName) && e.href ? 0 : t
                }
            }
        }
    }), W = {
        get: function(e, n) {
            var r = b.prop(e, n),
                i = typeof r == "boolean" && e.getAttribute(n),
                s = typeof r == "boolean" ? Y && G ? i != null : Q.test(n) ? e[b.camelCase("default-" + n)] : !!i : e.getAttributeNode(n);
            return s && s.value !== !1 ? n.toLowerCase() : t
        },
        set: function(e, t, n) {
            return t === !1 ? b.removeAttr(e, n) : Y && G || !Q.test(n) ? e.setAttribute(!G && b.propFix[n] || n, n) : e[b.camelCase("default-" + n)] = e[n] = !0, n
        }
    };
    if (!Y || !G) b.attrHooks.value = {
        get: function(e, n) {
            var r = e.getAttributeNode(n);
            return b.nodeName(e, "input") ? e.defaultValue : r && r.specified ? r.value : t
        },
        set: function(e, t, n) {
            if (!b.nodeName(e, "input")) return z && z.set(e, t, n);
            e.defaultValue = t
        }
    };
    G || (z = b.valHooks.button = {
        get: function(e, n) {
            var r = e.getAttributeNode(n);
            return r && (n === "id" || n === "name" ||
                n === "coords" ? r.value !== "" : r.specified) ? r.value : t
        },
        set: function(e, n, r) {
            var i = e.getAttributeNode(r);
            return i || e.setAttributeNode(i = e.ownerDocument.createAttribute(r)), i.value = n += "", r === "value" || n === e.getAttribute(r) ? n : t
        }
    }, b.attrHooks.contenteditable = {
        get: z.get,
        set: function(e, t, n) {
            z.set(e, t === "" ? !1 : t, n)
        }
    }, b.each(["width", "height"], function(e, t) {
        b.attrHooks[t] = b.extend(b.attrHooks[t], {
            set: function(e, n) {
                if (n === "") return e.setAttribute(t, "auto"), n
            }
        })
    })), b.support.hrefNormalized || (b.each(["href", "src", "width", "height"], function(e, n) {
        b.attrHooks[n] = b.extend(b.attrHooks[n], {
            get: function(e) {
                var r = e.getAttribute(n, 2);
                return r == null ? t : r
            }
        })
    }), b.each(["href", "src"], function(e, t) {
        b.propHooks[t] = {
            get: function(e) {
                return e.getAttribute(t, 4)
            }
        }
    })), b.support.style || (b.attrHooks.style = {
        get: function(e) {
            return e.style.cssText || t
        },
        set: function(e, t) {
            return e.style.cssText = t + ""
        }
    }), b.support.optSelected || (b.propHooks.selected = b.extend(b.propHooks.selected, {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        }
    })), b.support.enctype || (b.propFix.enctype = "encoding"), b.support.checkOn || b.each(["radio", "checkbox"], function() {
        b.valHooks[this] = {
            get: function(e) {
                return e.getAttribute("value") === null ? "on" : e.value
            }
        }
    }), b.each(["radio", "checkbox"], function() {
        b.valHooks[this] = b.extend(b.valHooks[this], {
            set: function(e, t) {
                if (b.isArray(t)) return e.checked = b.inArray(b(e).val(), t) >= 0
            }
        })
    });
    var Z = /^(?:input|select|textarea)$/i,
        et = /^key/,
        tt = /^(?:mouse|contextmenu)|click/,
        nt = /^(?:focusinfocus|focusoutblur)$/,
        rt = /^([^.]*)(?:\.(.+)|)$/;
    b.event = {
            global: {},
            add: function(e, n, r, s, o) {
                var u, a, f, l, c, h, p, d, v, m, g, y = b._data(e);
                if (!y) return;
                r.handler && (l = r, r = l.handler, o = l.selector), r.guid || (r.guid = b.guid++), (a = y.events) || (a = y.events = {}), (h = y.handle) || (h = y.handle = function(e) {
                    return typeof b === i || !!e && b.event.triggered === e.type ? t : b.event.dispatch.apply(h.elem, arguments)
                }, h.elem = e), n = (n || "").match(E) || [""], f = n.length;
                while (f--) {
                    u = rt.exec(n[f]) || [], v = g = u[1], m = (u[2] || "").split(".").sort(), c = b.event.special[v] || {}, v = (o ? c.delegateType : c.bindType) || v, c = b.event.special[v] || {}, p = b.extend({
                        type: v,
                        origType: g,
                        data: s,
                        handler: r,
                        guid: r.guid,
                        selector: o,
                        needsContext: o && b.expr.match.needsContext.test(o),
                        namespace: m.join(".")
                    }, l);
                    if (!(d = a[v])) {
                        d = a[v] = [], d.delegateCount = 0;
                        if (!c.setup || c.setup.call(e, s, m, h) === !1) e.addEventListener ? e.addEventListener(v, h, !1) : e.attachEvent && e.attachEvent("on" + v, h)
                    }
                    c.add && (c.add.call(e, p), p.handler.guid || (p.handler.guid = r.guid)), o ? d.splice(d.delegateCount++, 0, p) : d.push(p), b.event.global[v] = !0
                }
                e = null
            },
            remove: function(e, t, n, r, i) {
                var s, o, u, a, f, l, c, h, p, d, v, m = b.hasData(e) && b._data(e);
                if (!m || !(l = m.events)) return;
                t = (t || "").match(E) || [""], f = t.length;
                while (f--) {
                    u = rt.exec(t[f]) || [], p = v = u[1], d = (u[2] || "").split(".").sort();
                    if (!p) {
                        for (p in l) b.event.remove(e, p + t[f], n, r, !0);
                        continue
                    }
                    c = b.event.special[p] || {}, p = (r ? c.delegateType : c.bindType) || p, h = l[p] || [], u = u[2] && new RegExp("(^|\\.)" + d.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = s = h.length;
                    while (s--) o = h[s], (i || v === o.origType) && (!n || n.guid === o.guid) && (!u || u.test(o.namespace)) && (!r || r === o.selector || r === "**" && o.selector) && (h.splice(s, 1), o.selector && h.delegateCount--, c.remove && c.remove.call(e, o));
                    a && !h.length && ((!c.teardown || c.teardown.call(e, d, m.handle) === !1) && b.removeEvent(e, p, m.handle), delete l[p])
                }
                b.isEmptyObject(l) && (delete m.handle, b._removeData(e, "events"))
            },
            trigger: function(n, r, i, o) {
                var u, a, f, l, c, h, p, d = [i || s],
                    v = g.call(n, "type") ? n.type : n,
                    m = g.call(n, "namespace") ? n.namespace.split(".") : [];
                f = h = i = i || s;
                if (i.nodeType === 3 || i.nodeType === 8) return;
                if (nt.test(v + b.event.triggered)) return;
                v.indexOf(".") >= 0 && (m = v.split("."), v = m.shift(), m.sort()), a = v.indexOf(":") < 0 && "on" + v, n = n[b.expando] ? n : new b.Event(v, typeof n == "object" && n), n.isTrigger = !0, n.namespace = m.join("."), n.namespace_re = n.namespace ? new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, n.result = t, n.target || (n.target = i), r = r == null ? [n] : b.makeArray(r, [n]), c = b.event.special[v] || {};
                if (!o && c.trigger && c.trigger.apply(i, r) === !1) return;
                if (!o && !c.noBubble && !b.isWindow(i)) {
                    l = c.delegateType || v, nt.test(l + v) || (f = f.parentNode);
                    for (; f; f = f.parentNode) d.push(f), h = f;
                    h === (i.ownerDocument || s) && d.push(h.defaultView || h.parentWindow || e)
                }
                p = 0;
                while ((f = d[p++]) && !n.isPropagationStopped()) n.type = p > 1 ? l : c.bindType || v, u = (b._data(f, "events") || {})[n.type] && b._data(f, "handle"), u && u.apply(f, r), u = a && f[a], u && b.acceptData(f) && u.apply && u.apply(f, r) === !1 && n.preventDefault();
                n.type = v;
                if (!o && !n.isDefaultPrevented() && (!c._default || c._default.apply(i.ownerDocument, r) === !1) && (v !== "click" || !b.nodeName(i, "a")) && b.acceptData(i) && a && i[v] && !b.isWindow(i)) {
                    h = i[a], h && (i[a] = null), b.event.triggered = v;
                    try {
                        i[v]()
                    } catch (y) {}
                    b.event.triggered = t, h && (i[a] = h)
                }
                return n.result
            },
            dispatch: function(e) {
                e = b.event.fix(e);
                var n, r, i, s, o, u = [],
                    a = d.call(arguments),
                    f = (b._data(this, "events") || {})[e.type] || [],
                    l = b.event.special[e.type] || {};
                a[0] = e, e.delegateTarget = this;
                if (l.preDispatch && l.preDispatch.call(this, e) === !1) return;
                u = b.event.handlers.call(this, e, f), n = 0;
                while ((s = u[n++]) && !e.isPropagationStopped()) {
                    e.currentTarget = s.elem, o = 0;
                    while ((i = s.handlers[o++]) && !e.isImmediatePropagationStopped())
                        if (!e.namespace_re || e.namespace_re.test(i.namespace)) e.handleObj = i, e.data = i.data, r = ((b.event.special[i.origType] || {}).handle || i.handler).apply(s.elem, a), r !== t && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation())
                }
                return l.postDispatch && l.postDispatch.call(this, e), e.result
            },
            handlers: function(e, n) {
                var r, i, s, o, u = [],
                    a = n.delegateCount,
                    f = e.target;
                if (a && f.nodeType && (!e.button || e.type !== "click"))
                    for (; f != this; f = f.parentNode || this)
                        if (f.nodeType === 1 && (f.disabled !== !0 || e.type !== "click")) {
                            s = [];
                            for (o = 0; o < a; o++) i = n[o], r = i.selector + " ", s[r] === t && (s[r] = i.needsContext ? b(r, this).index(f) >= 0 : b.find(r, this, null, [f]).length), s[r] && s.push(i);
                            s.length && u.push({
                                elem: f,
                                handlers: s
                            })
                        }
                return a < n.length && u.push({
                    elem: this,
                    handlers: n.slice(a)
                }), u
            },
            fix: function(e) {
                if (e[b.expando]) return e;
                var t, n, r, i = e.type,
                    o = e,
                    u = this.fixHooks[i];
                u || (this.fixHooks[i] = u = tt.test(i) ? this.mouseHooks : et.test(i) ? this.keyHooks : {}), r = u.props ? this.props.concat(u.props) : this.props, e = new b.Event(o), t = r.length;
                while (t--) n = r[t], e[n] = o[n];
                return e.target || (e.target = o.srcElement || s), e.target.nodeType === 3 && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, u.filter ? u.filter(e, o) : e
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(e, t) {
                    return e.which == null && (e.which = t.charCode != null ? t.charCode : t.keyCode), e
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(e, n) {
                    var r, i, o, u = n.button,
                        a = n.fromElement;
                    return e.pageX == null && n.clientX != null && (i = e.target.ownerDocument || s, o = i.documentElement, r = i.body, e.pageX = n.clientX + (o && o.scrollLeft || r && r.scrollLeft || 0) - (o && o.clientLeft || r && r.clientLeft || 0), e.pageY = n.clientY + (o && o.scrollTop || r && r.scrollTop || 0) - (o && o.clientTop || r && r.clientTop || 0)), !e.relatedTarget && a && (e.relatedTarget = a === e.target ? n.toElement : a), !e.which && u !== t && (e.which = u & 1 ? 1 : u & 2 ? 3 : u & 4 ? 2 : 0), e
                }
            },
            special: {
                load: {
                    noBubble: !0
                },
                click: {
                    trigger: function() {
                        if (b.nodeName(this, "input") && this.type === "checkbox" && this.click) return this.click(), !1
                    }
                },
                focus: {
                    trigger: function() {
                        if (this !== s.activeElement && this.focus) try {
                            return this.focus(), !1
                        } catch (e) {}
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        if (this === s.activeElement && this.blur) return this.blur(), !1
                    },
                    delegateType: "focusout"
                },
                beforeunload: {
                    postDispatch: function(e) {
                        e.result !== t && (e.originalEvent.returnValue = e.result)
                    }
                }
            },
            simulate: function(e, t, n, r) {
                var i = b.extend(new b.Event, n, {
                    type: e,
                    isSimulated: !0,
                    originalEvent: {}
                });
                r ? b.event.trigger(i, null, t) : b.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
            }
        }, b.removeEvent = s.removeEventListener ? function(e, t, n) {
            e.removeEventListener && e.removeEventListener(t, n, !1)
        } : function(e, t, n) {
            var r = "on" + t;
            e.detachEvent && (typeof e[r] === i && (e[r] = null), e.detachEvent(r, n))
        }, b.Event = function(e, t) {
            if (!(this instanceof b.Event)) return new b.Event(e, t);
            e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? it : st) : this.type = e, t && b.extend(this, t), this.timeStamp = e && e.timeStamp || b.now(), this[b.expando] = !0
        }, b.Event.prototype = {
            isDefaultPrevented: st,
            isPropagationStopped: st,
            isImmediatePropagationStopped: st,
            preventDefault: function() {
                var e = this.originalEvent;
                this.isDefaultPrevented = it;
                if (!e) return;
                e.preventDefault ? e.preventDefault() : e.returnValue = !1
            },
            stopPropagation: function() {
                var e = this.originalEvent;
                this.isPropagationStopped = it;
                if (!e) return;
                e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0
            },
            stopImmediatePropagation: function() {
                this.isImmediatePropagationStopped = it, this.stopPropagation()
            }
        }, b.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function(e, t) {
            b.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function(e) {
                    var n, r = this,
                        i = e.relatedTarget,
                        s = e.handleObj;
                    if (!i || i !== r && !b.contains(r, i)) e.type = s.origType, n = s.handler.apply(this, arguments), e.type = t;
                    return n
                }
            }
        }), b.support.submitBubbles || (b.event.special.submit = {
            setup: function() {
                if (b.nodeName(this, "form")) return !1;
                b.event.add(this, "click._submit keypress._submit", function(e) {
                    var n = e.target,
                        r = b.nodeName(n, "input") || b.nodeName(n, "button") ? n.form : t;
                    r && !b._data(r, "submitBubbles") && (b.event.add(r, "submit._submit", function(e) {
                        e._submit_bubble = !0
                    }), b._data(r, "submitBubbles", !0))
                })
            },
            postDispatch: function(e) {
                e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && b.event.simulate("submit", this.parentNode, e, !0))
            },
            teardown: function() {
                if (b.nodeName(this, "form")) return !1;
                b.event.remove(this, "._submit")
            }
        }), b.support.changeBubbles || (b.event.special.change = {
            setup: function() {
                if (Z.test(this.nodeName)) {
                    if (this.type === "checkbox" || this.type === "radio") b.event.add(this, "propertychange._change", function(e) {
                        e.originalEvent.propertyName === "checked" && (this._just_changed = !0)
                    }), b.event.add(this, "click._change", function(e) {
                        this._just_changed && !e.isTrigger && (this._just_changed = !1), b.event.simulate("change", this, e, !0)
                    });
                    return !1
                }
                b.event.add(this, "beforeactivate._change", function(e) {
                    var t = e.target;
                    Z.test(t.nodeName) && !b._data(t, "changeBubbles") && (b.event.add(t, "change._change", function(e) {
                        this.parentNode && !e.isSimulated && !e.isTrigger && b.event.simulate("change", this.parentNode, e, !0)
                    }), b._data(t, "changeBubbles", !0))
                })
            },
            handle: function(e) {
                var t = e.target;
                if (this !== t || e.isSimulated || e.isTrigger || t.type !== "radio" && t.type !== "checkbox") return e.handleObj.handler.apply(this, arguments)
            },
            teardown: function() {
                return b.event.remove(this, "._change"), !Z.test(this.nodeName)
            }
        }), b.support.focusinBubbles || b.each({
            focus: "focusin",
            blur: "focusout"
        }, function(e, t) {
            var n = 0,
                r = function(e) {
                    b.event.simulate(t, e.target, b.event.fix(e), !0)
                };
            b.event.special[t] = {
                setup: function() {
                    n++ === 0 && s.addEventListener(e, r, !0)
                },
                teardown: function() {
                    --n === 0 && s.removeEventListener(e, r, !0)
                }
            }
        }), b.fn.extend({
            on: function(e, n, r, i, s) {
                var o, u;
                if (typeof e == "object") {
                    typeof n != "string" && (r = r || n, n = t);
                    for (o in e) this.on(o, n, r, e[o], s);
                    return this
                }
                r == null && i == null ? (i = n, r = n = t) : i == null && (typeof n == "string" ? (i = r, r = t) : (i = r, r = n, n = t));
                if (i === !1) i = st;
                else if (!i) return this;
                return s === 1 && (u = i, i = function(e) {
                    return b().off(e), u.apply(this, arguments)
                }, i.guid = u.guid || (u.guid = b.guid++)), this.each(function() {
                    b.event.add(this, e, i, r, n)
                })
            },
            one: function(e, t, n, r) {
                return this.on(e, t, n, r, 1)
            },
            off: function(e, n, r) {
                var i, s;
                if (e && e.preventDefault && e.handleObj) return i = e.handleObj, b(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
                if (typeof e == "object") {
                    for (s in e) this.off(s, n, e[s]);
                    return this
                }
                if (n === !1 || typeof n == "function") r = n, n = t;
                return r === !1 && (r = st), this.each(function() {
                    b.event.remove(this, e, r, n)
                })
            },
            bind: function(e, t, n) {
                return this.on(e, null, t, n)
            },
            unbind: function(e, t) {
                return this.off(e, null, t)
            },
            delegate: function(e, t, n, r) {
                return this.on(t, e, n, r)
            },
            undelegate: function(e, t, n) {
                return arguments.length === 1 ? this.off(e, "**") : this.off(t, e || "**", n)
            },
            trigger: function(e, t) {
                return this.each(function() {
                    b.event.trigger(e, t, this)
                })
            },
            triggerHandler: function(e, t) {
                var n = this[0];
                if (n) return b.event.trigger(e, t, n, !0)
            }
        }),
        function(e, t) {
            function rt(e) {
                return J.test(e + "")
            }

            function it() {
                var e, t = [];
                return e = function(n, r) {
                    return t.push(n += " ") > i.cacheLength && delete e[t.shift()], e[n] = r
                }
            }

            function st(e) {
                return e[w] = !0, e
            }

            function ot(e) {
                var t = c.createElement("div");
                try {
                    return e(t)
                } catch (n) {
                    return !1
                } finally {
                    t = null
                }
            }

            function ut(e, t, n, r) {
                var i, s, o, u, a, f, h, v, m, y;
                (t ? t.ownerDocument || t : E) !== c && l(t), t = t || c, n = n || [];
                if (!e || typeof e != "string") return n;
                if ((u = t.nodeType) !== 1 && u !== 9) return [];
                if (!p && !r) {
                    if (i = K.exec(e))
                        if (o = i[1]) {
                            if (u === 9) {
                                s = t.getElementById(o);
                                if (!s || !s.parentNode) return n;
                                if (s.id === o) return n.push(s), n
                            } else if (t.ownerDocument && (s = t.ownerDocument.getElementById(o)) && g(t, s) && s.id === o) return n.push(s), n
                        } else {
                            if (i[2]) return _.apply(n, D.call(t.getElementsByTagName(e), 0)), n;
                            if ((o = i[3]) && S.getByClassName && t.getElementsByClassName) return _.apply(n, D.call(t.getElementsByClassName(o), 0)), n
                        }
                    if (S.qsa && !d.test(e)) {
                        h = !0, v = w, m = t, y = u === 9 && e;
                        if (u === 1 && t.nodeName.toLowerCase() !== "object") {
                            f = ht(e), (h = t.getAttribute("id")) ? v = h.replace(Y, "\\$&") : t.setAttribute("id", v), v = "[id='" + v + "'] ", a = f.length;
                            while (a--) f[a] = v + pt(f[a]);
                            m = $.test(e) && t.parentNode || t, y = f.join(",")
                        }
                        if (y) try {
                            return _.apply(n, D.call(m.querySelectorAll(y), 0)), n
                        } catch (b) {} finally {
                            h || t.removeAttribute("id")
                        }
                    }
                }
                return Et(e.replace(R, "$1"), t, n, r)
            }

            function at(e, t) {
                var n = t && e,
                    r = n && (~t.sourceIndex || A) - (~e.sourceIndex || A);
                if (r) return r;
                if (n)
                    while (n = n.nextSibling)
                        if (n === t) return -1;
                return e ? 1 : -1
            }

            function ft(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return n === "input" && t.type === e
                }
            }

            function lt(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return (n === "input" || n === "button") && t.type === e
                }
            }

            function ct(e) {
                return st(function(t) {
                    return t = +t, st(function(n, r) {
                        var i, s = e([], n.length, t),
                            o = s.length;
                        while (o--) n[i = s[o]] && (n[i] = !(r[i] = n[i]))
                    })
                })
            }

            function ht(e, t) {
                var n, r, s, o, u, a, f, l = C[e + " "];
                if (l) return t ? 0 : l.slice(0);
                u = e, a = [], f = i.preFilter;
                while (u) {
                    if (!n || (r = U.exec(u))) r && (u = u.slice(r[0].length) || u), a.push(s = []);
                    n = !1;
                    if (r = z.exec(u)) n = r.shift(), s.push({
                        value: n,
                        type: r[0].replace(R, " ")
                    }), u = u.slice(n.length);
                    for (o in i.filter)(r = V[o].exec(u)) && (!f[o] || (r = f[o](r))) && (n = r.shift(), s.push({
                        value: n,
                        type: o,
                        matches: r
                    }), u = u.slice(n.length));
                    if (!n) break
                }
                return t ? u.length : u ? ut.error(e) : C(e, a).slice(0)
            }

            function pt(e) {
                var t = 0,
                    n = e.length,
                    r = "";
                for (; t < n; t++) r += e[t].value;
                return r
            }

            function dt(e, t, n) {
                var i = t.dir,
                    s = n && i === "parentNode",
                    o = T++;
                return t.first ? function(t, n, r) {
                    while (t = t[i])
                        if (t.nodeType === 1 || s) return e(t, n, r)
                } : function(t, n, u) {
                    var a, f, l, c = x + " " + o;
                    if (u) {
                        while (t = t[i])
                            if (t.nodeType === 1 || s)
                                if (e(t, n, u)) return !0
                    } else
                        while (t = t[i])
                            if (t.nodeType === 1 || s) {
                                l = t[w] || (t[w] = {});
                                if ((f = l[i]) && f[0] === c) {
                                    if ((a = f[1]) === !0 || a === r) return a === !0
                                } else {
                                    f = l[i] = [c], f[1] = e(t, n, u) || r;
                                    if (f[1] === !0) return !0
                                }
                            }
                }
            }

            function vt(e) {
                return e.length > 1 ? function(t, n, r) {
                    var i = e.length;
                    while (i--)
                        if (!e[i](t, n, r)) return !1;
                    return !0
                } : e[0]
            }

            function mt(e, t, n, r, i) {
                var s, o = [],
                    u = 0,
                    a = e.length,
                    f = t != null;
                for (; u < a; u++)
                    if (s = e[u])
                        if (!n || n(s, r, i)) o.push(s), f && t.push(u);
                return o
            }

            function gt(e, t, n, r, i, s) {
                return r && !r[w] && (r = gt(r)), i && !i[w] && (i = gt(i, s)), st(function(s, o, u, a) {
                    var f, l, c, h = [],
                        p = [],
                        d = o.length,
                        v = s || wt(t || "*", u.nodeType ? [u] : u, []),
                        m = e && (s || !t) ? mt(v, h, e, u, a) : v,
                        g = n ? i || (s ? e : d || r) ? [] : o : m;
                    n && n(m, g, u, a);
                    if (r) {
                        f = mt(g, p), r(f, [], u, a), l = f.length;
                        while (l--)
                            if (c = f[l]) g[p[l]] = !(m[p[l]] = c)
                    }
                    if (s) {
                        if (i || e) {
                            if (i) {
                                f = [], l = g.length;
                                while (l--)(c = g[l]) && f.push(m[l] = c);
                                i(null, g = [], f, a)
                            }
                            l = g.length;
                            while (l--)(c = g[l]) && (f = i ? P.call(s, c) : h[l]) > -1 && (s[f] = !(o[f] = c))
                        }
                    } else g = mt(g === o ? g.splice(d, g.length) : g), i ? i(null, o, g, a) : _.apply(o, g)
                })
            }

            function yt(e) {
                var t, n, r, s = e.length,
                    o = i.relative[e[0].type],
                    u = o || i.relative[" "],
                    a = o ? 1 : 0,
                    l = dt(function(e) {
                        return e === t
                    }, u, !0),
                    c = dt(function(e) {
                        return P.call(t, e) > -1
                    }, u, !0),
                    h = [
                        function(e, n, r) {
                            return !o && (r || n !== f) || ((t = n).nodeType ? l(e, n, r) : c(e, n, r))
                        }
                    ];
                for (; a < s; a++)
                    if (n = i.relative[e[a].type]) h = [dt(vt(h), n)];
                    else {
                        n = i.filter[e[a].type].apply(null, e[a].matches);
                        if (n[w]) {
                            r = ++a;
                            for (; r < s; r++)
                                if (i.relative[e[r].type]) break;
                            return gt(a > 1 && vt(h), a > 1 && pt(e.slice(0, a - 1)).replace(R, "$1"), n, a < r && yt(e.slice(a, r)), r < s && yt(e = e.slice(r)), r < s && pt(e))
                        }
                        h.push(n)
                    }
                return vt(h)
            }

            function bt(e, t) {
                var n = 0,
                    s = t.length > 0,
                    o = e.length > 0,
                    u = function(u, a, l, h, p) {
                        var d, v, m, g = [],
                            y = 0,
                            b = "0",
                            w = u && [],
                            E = p != null,
                            S = f,
                            T = u || o && i.find.TAG("*", p && a.parentNode || a),
                            N = x += S == null ? 1 : Math.random() || .1;
                        E && (f = a !== c && a, r = n);
                        for (;
                            (d = T[b]) != null; b++) {
                            if (o && d) {
                                v = 0;
                                while (m = e[v++])
                                    if (m(d, a, l)) {
                                        h.push(d);
                                        break
                                    }
                                E && (x = N, r = ++n)
                            }
                            s && ((d = !m && d) && y--, u && w.push(d))
                        }
                        y += b;
                        if (s && b !== y) {
                            v = 0;
                            while (m = t[v++]) m(w, g, a, l);
                            if (u) {
                                if (y > 0)
                                    while (b--)!w[b] && !g[b] && (g[b] = M.call(h));
                                g = mt(g)
                            }
                            _.apply(h, g), E && !u && g.length > 0 && y + t.length > 1 && ut.uniqueSort(h)
                        }
                        return E && (x = N, f = S), w
                    };
                return s ? st(u) : u
            }

            function wt(e, t, n) {
                var r = 0,
                    i = t.length;
                for (; r < i; r++) ut(e, t[r], n);
                return n
            }

            function Et(e, t, n, r) {
                var s, o, a, f, l, c = ht(e);
                if (!r && c.length === 1) {
                    o = c[0] = c[0].slice(0);
                    if (o.length > 2 && (a = o[0]).type === "ID" && t.nodeType === 9 && !p && i.relative[o[1].type]) {
                        t = i.find.ID(a.matches[0].replace(et, tt), t)[0];
                        if (!t) return n;
                        e = e.slice(o.shift().value.length)
                    }
                    s = V.needsContext.test(e) ? 0 : o.length;
                    while (s--) {
                        a = o[s];
                        if (i.relative[f = a.type]) break;
                        if (l = i.find[f])
                            if (r = l(a.matches[0].replace(et, tt), $.test(o[0].type) && t.parentNode || t)) {
                                o.splice(s, 1), e = r.length && pt(o);
                                if (!e) return _.apply(n, D.call(r, 0)), n;
                                break
                            }
                    }
                }
                return u(e, c)(r, t, p, n, $.test(e)), n
            }

            function St() {}
            var n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, w = "sizzle" + -(new Date),
                E = e.document,
                S = {},
                x = 0,
                T = 0,
                N = it(),
                C = it(),
                k = it(),
                L = typeof t,
                A = 1 << 31,
                O = [],
                M = O.pop,
                _ = O.push,
                D = O.slice,
                P = O.indexOf || function(e) {
                    var t = 0,
                        n = this.length;
                    for (; t < n; t++)
                        if (this[t] === e) return t;
                    return -1
                },
                H = "[\\x20\\t\\r\\n\\f]",
                B = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                j = B.replace("w", "w#"),
                F = "([*^$|!~]?=)",
                I = "\\[" + H + "*(" + B + ")" + H + "*(?:" + F + H + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + j + ")|)|)" + H + "*\\]",
                q = ":(" + B + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + I.replace(3, 8) + ")*)|.*)\\)|)",
                R = new RegExp("^" + H + "+|((?:^|[^\\\\])(?:\\\\.)*)" + H + "+$", "g"),
                U = new RegExp("^" + H + "*," + H + "*"),
                z = new RegExp("^" + H + "*([\\x20\\t\\r\\n\\f>+~])" + H + "*"),
                W = new RegExp(q),
                X = new RegExp("^" + j + "$"),
                V = {
                    ID: new RegExp("^#(" + B + ")"),
                    CLASS: new RegExp("^\\.(" + B + ")"),
                    NAME: new RegExp("^\\[name=['\"]?(" + B + ")['\"]?\\]"),
                    TAG: new RegExp("^(" + B.replace("w", "w*") + ")"),
                    ATTR: new RegExp("^" + I),
                    PSEUDO: new RegExp("^" + q),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + H + "*(even|odd|(([+-]|)(\\d*)n|)" + H + "*(?:([+-]|)" + H + "*(\\d+)|))" + H + "*\\)|)", "i"),
                    needsContext: new RegExp("^" + H + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + H + "*((?:-\\d)?\\d*)" + H + "*\\)|)(?=[^-]|$)", "i")
                },
                $ = /[\x20\t\r\n\f]*[+~]/,
                J = /^[^{]+\{\s*\[native code/,
                K = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                Q = /^(?:input|select|textarea|button)$/i,
                G = /^h\d$/i,
                Y = /'|\\/g,
                Z = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
                et = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
                tt = function(e, t) {
                    var n = "0x" + t - 65536;
                    return n !== n ? t : n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, n & 1023 | 56320)
                };
            try {
                D.call(E.documentElement.childNodes, 0)[0].nodeType
            } catch (nt) {
                D = function(e) {
                    var t, n = [];
                    while (t = this[e++]) n.push(t);
                    return n
                }
            }
            o = ut.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return t ? t.nodeName !== "HTML" : !1
            }, l = ut.setDocument = function(e) {
                var n = e ? e.ownerDocument || e : E;
                if (n === c || n.nodeType !== 9 || !n.documentElement) return c;
                c = n, h = n.documentElement, p = o(n), S.tagNameNoComments = ot(function(e) {
                    return e.appendChild(n.createComment("")), !e.getElementsByTagName("*").length
                }), S.attributes = ot(function(e) {
                    e.innerHTML = "<select></select>";
                    var t = typeof e.lastChild.getAttribute("multiple");
                    return t !== "boolean" && t !== "string"
                }), S.getByClassName = ot(function(e) {
                    return e.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", !e.getElementsByClassName || !e.getElementsByClassName("e").length ? !1 : (e.lastChild.className = "e", e.getElementsByClassName("e").length === 2)
                }), S.getByName = ot(function(e) {
                    e.id = w + 0, e.innerHTML = "<a name='" + w + "'></a><div name='" + w + "'></div>", h.insertBefore(e, h.firstChild);
                    var t = n.getElementsByName && n.getElementsByName(w).length === 2 + n.getElementsByName(w + 0).length;
                    return S.getIdNotName = !n.getElementById(w), h.removeChild(e), t
                }), i.attrHandle = ot(function(e) {
                    return e.innerHTML = "<a href='#'></a>", e.firstChild && typeof e.firstChild.getAttribute !== L && e.firstChild.getAttribute("href") === "#"
                }) ? {} : {
                    href: function(e) {
                        return e.getAttribute("href", 2)
                    },
                    type: function(e) {
                        return e.getAttribute("type")
                    }
                }, S.getIdNotName ? (i.find.ID = function(e, t) {
                    if (typeof t.getElementById !== L && !p) {
                        var n = t.getElementById(e);
                        return n && n.parentNode ? [n] : []
                    }
                }, i.filter.ID = function(e) {
                    var t = e.replace(et, tt);
                    return function(e) {
                        return e.getAttribute("id") === t
                    }
                }) : (i.find.ID = function(e, n) {
                    if (typeof n.getElementById !== L && !p) {
                        var r = n.getElementById(e);
                        return r ? r.id === e || typeof r.getAttributeNode !== L && r.getAttributeNode("id").value === e ? [r] : t : []
                    }
                }, i.filter.ID = function(e) {
                    var t = e.replace(et, tt);
                    return function(e) {
                        var n = typeof e.getAttributeNode !== L && e.getAttributeNode("id");
                        return n && n.value === t
                    }
                }), i.find.TAG = S.tagNameNoComments ? function(e, t) {
                    if (typeof t.getElementsByTagName !== L) return t.getElementsByTagName(e)
                } : function(e, t) {
                    var n, r = [],
                        i = 0,
                        s = t.getElementsByTagName(e);
                    if (e === "*") {
                        while (n = s[i++]) n.nodeType === 1 && r.push(n);
                        return r
                    }
                    return s
                }, i.find.NAME = S.getByName && function(e, t) {
                    if (typeof t.getElementsByName !== L) return t.getElementsByName(name)
                }, i.find.CLASS = S.getByClassName && function(e, t) {
                    if (typeof t.getElementsByClassName !== L && !p) return t.getElementsByClassName(e)
                }, v = [], d = [":focus"];
                if (S.qsa = rt(n.querySelectorAll)) ot(function(e) {
                    e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || d.push("\\[" + H + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), e.querySelectorAll(":checked").length || d.push(":checked")
                }), ot(function(e) {
                    e.innerHTML = "<input type='hidden' i=''/>", e.querySelectorAll("[i^='']").length && d.push("[*^$]=" + H + "*(?:\"\"|'')"), e.querySelectorAll(":enabled").length || d.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), d.push(",.*:")
                });
                return (S.matchesSelector = rt(m = h.matchesSelector || h.mozMatchesSelector || h.webkitMatchesSelector || h.oMatchesSelector || h.msMatchesSelector)) && ot(function(e) {
                    S.disconnectedMatch = m.call(e, "div"), m.call(e, "[s!='']:x"), v.push("!=", q)
                }), d = new RegExp(d.join("|")), v = new RegExp(v.join("|")), g = rt(h.contains) || h.compareDocumentPosition ? function(e, t) {
                    var n = e.nodeType === 9 ? e.documentElement : e,
                        r = t && t.parentNode;
                    return e === r || !!r && r.nodeType === 1 && !!(n.contains ? n.contains(r) : e.compareDocumentPosition && e.compareDocumentPosition(r) & 16)
                } : function(e, t) {
                    if (t)
                        while (t = t.parentNode)
                            if (t === e) return !0;
                    return !1
                }, y = h.compareDocumentPosition ? function(e, t) {
                    var r;
                    if (e === t) return a = !0, 0;
                    if (r = t.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(t)) return r & 1 || e.parentNode && e.parentNode.nodeType === 11 ? e === n || g(E, e) ? -1 : t === n || g(E, t) ? 1 : 0 : r & 4 ? -1 : 1;
                    return e.compareDocumentPosition ? -1 : 1
                } : function(e, t) {
                    var r, i = 0,
                        s = e.parentNode,
                        o = t.parentNode,
                        u = [e],
                        f = [t];
                    if (e === t) return a = !0, 0;
                    if (!s || !o) return e === n ? -1 : t === n ? 1 : s ? -1 : o ? 1 : 0;
                    if (s === o) return at(e, t);
                    r = e;
                    while (r = r.parentNode) u.unshift(r);
                    r = t;
                    while (r = r.parentNode) f.unshift(r);
                    while (u[i] === f[i]) i++;
                    return i ? at(u[i], f[i]) : u[i] === E ? -1 : f[i] === E ? 1 : 0
                }, a = !1, [0, 0].sort(y), S.detectDuplicates = a, c
            }, ut.matches = function(e, t) {
                return ut(e, null, null, t)
            }, ut.matchesSelector = function(e, t) {
                (e.ownerDocument || e) !== c && l(e), t = t.replace(Z, "='$1']");
                if (S.matchesSelector && !p && (!v || !v.test(t)) && !d.test(t)) try {
                    var n = m.call(e, t);
                    if (n || S.disconnectedMatch || e.document && e.document.nodeType !== 11) return n
                } catch (r) {}
                return ut(t, c, null, [e]).length > 0
            }, ut.contains = function(e, t) {
                return (e.ownerDocument || e) !== c && l(e), g(e, t)
            }, ut.attr = function(e, t) {
                var n;
                return (e.ownerDocument || e) !== c && l(e), p || (t = t.toLowerCase()), (n = i.attrHandle[t]) ? n(e) : p || S.attributes ? e.getAttribute(t) : ((n = e.getAttributeNode(t)) || e.getAttribute(t)) && e[t] === !0 ? t : n && n.specified ? n.value : null
            }, ut.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }, ut.uniqueSort = function(e) {
                var t, n = [],
                    r = 1,
                    i = 0;
                a = !S.detectDuplicates, e.sort(y);
                if (a) {
                    for (; t = e[r]; r++) t === e[r - 1] && (i = n.push(r));
                    while (i--) e.splice(n[i], 1)
                }
                return e
            }, s = ut.getText = function(e) {
                var t, n = "",
                    r = 0,
                    i = e.nodeType;
                if (!i)
                    for (; t = e[r]; r++) n += s(t);
                else if (i === 1 || i === 9 || i === 11) {
                    if (typeof e.textContent == "string") return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling) n += s(e)
                } else if (i === 3 || i === 4) return e.nodeValue;
                return n
            }, i = ut.selectors = {
                cacheLength: 50,
                createPseudo: st,
                match: V,
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(et, tt), e[3] = (e[4] || e[5] || "").replace(et, tt), e[2] === "~=" && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), e[1].slice(0, 3) === "nth" ? (e[3] || ut.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * (e[3] === "even" || e[3] === "odd")), e[5] = +(e[7] + e[8] || e[3] === "odd")) : e[3] && ut.error(e[0]), e
                    },
                    PSEUDO: function(e) {
                        var t, n = !e[5] && e[2];
                        return V.CHILD.test(e[0]) ? null : (e[4] ? e[2] = e[4] : n && W.test(n) && (t = ht(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        return e === "*" ? function() {
                            return !0
                        } : (e = e.replace(et, tt).toLowerCase(), function(t) {
                            return t.nodeName && t.nodeName.toLowerCase() === e
                        })
                    },
                    CLASS: function(e) {
                        var t = N[e + " "];
                        return t || (t = new RegExp("(^|" + H + ")" + e + "(" + H + "|$)")) && N(e, function(e) {
                            return t.test(e.className || typeof e.getAttribute !== L && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(e, t, n) {
                        return function(r) {
                            var i = ut.attr(r, e);
                            return i == null ? t === "!=" : t ? (i += "", t === "=" ? i === n : t === "!=" ? i !== n : t === "^=" ? n && i.indexOf(n) === 0 : t === "*=" ? n && i.indexOf(n) > -1 : t === "$=" ? n && i.slice(-n.length) === n : t === "~=" ? (" " + i + " ").indexOf(n) > -1 : t === "|=" ? i === n || i.slice(0, n.length + 1) === n + "-" : !1) : !0
                        }
                    },
                    CHILD: function(e, t, n, r, i) {
                        var s = e.slice(0, 3) !== "nth",
                            o = e.slice(-4) !== "last",
                            u = t === "of-type";
                        return r === 1 && i === 0 ? function(e) {
                            return !!e.parentNode
                        } : function(t, n, a) {
                            var f, l, c, h, p, d, v = s !== o ? "nextSibling" : "previousSibling",
                                m = t.parentNode,
                                g = u && t.nodeName.toLowerCase(),
                                y = !a && !u;
                            if (m) {
                                if (s) {
                                    while (v) {
                                        c = t;
                                        while (c = c[v])
                                            if (u ? c.nodeName.toLowerCase() === g : c.nodeType === 1) return !1;
                                        d = v = e === "only" && !d && "nextSibling"
                                    }
                                    return !0
                                }
                                d = [o ? m.firstChild : m.lastChild];
                                if (o && y) {
                                    l = m[w] || (m[w] = {}), f = l[e] || [], p = f[0] === x && f[1], h = f[0] === x && f[2], c = p && m.childNodes[p];
                                    while (c = ++p && c && c[v] || (h = p = 0) || d.pop())
                                        if (c.nodeType === 1 && ++h && c === t) {
                                            l[e] = [x, p, h];
                                            break
                                        }
                                } else if (y && (f = (t[w] || (t[w] = {}))[e]) && f[0] === x) h = f[1];
                                else
                                    while (c = ++p && c && c[v] || (h = p = 0) || d.pop())
                                        if ((u ? c.nodeName.toLowerCase() === g : c.nodeType === 1) && ++h) {
                                            y && ((c[w] || (c[w] = {}))[e] = [x, h]);
                                            if (c === t) break
                                        } return h -= i, h === r || h % r === 0 && h / r >= 0
                            }
                        }
                    },
                    PSEUDO: function(e, t) {
                        var n, r = i.pseudos[e] || i.setFilters[e.toLowerCase()] || ut.error("unsupported pseudo: " + e);
                        return r[w] ? r(t) : r.length > 1 ? (n = [e, e, "", t], i.setFilters.hasOwnProperty(e.toLowerCase()) ? st(function(e, n) {
                            var i, s = r(e, t),
                                o = s.length;
                            while (o--) i = P.call(e, s[o]), e[i] = !(n[i] = s[o])
                        }) : function(e) {
                            return r(e, 0, n)
                        }) : r
                    }
                },
                pseudos: {
                    not: st(function(e) {
                        var t = [],
                            n = [],
                            r = u(e.replace(R, "$1"));
                        return r[w] ? st(function(e, t, n, i) {
                            var s, o = r(e, null, i, []),
                                u = e.length;
                            while (u--)
                                if (s = o[u]) e[u] = !(t[u] = s)
                        }) : function(e, i, s) {
                            return t[0] = e, r(t, null, s, n), !n.pop()
                        }
                    }),
                    has: st(function(e) {
                        return function(t) {
                            return ut(e, t).length > 0
                        }
                    }),
                    contains: st(function(e) {
                        return function(t) {
                            return (t.textContent || t.innerText || s(t)).indexOf(e) > -1
                        }
                    }),
                    lang: st(function(e) {
                        return X.test(e || "") || ut.error("unsupported lang: " + e), e = e.replace(et, tt).toLowerCase(),
                            function(t) {
                                var n;
                                do
                                    if (n = p ? t.getAttribute("xml:lang") || t.getAttribute("lang") : t.lang) return n = n.toLowerCase(), n === e || n.indexOf(e + "-") === 0;
                                while ((t = t.parentNode) && t.nodeType === 1);
                                return !1
                            }
                    }),
                    target: function(t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id
                    },
                    root: function(e) {
                        return e === h
                    },
                    focus: function(e) {
                        return e === c.activeElement && (!c.hasFocus || c.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: function(e) {
                        return e.disabled === !1
                    },
                    disabled: function(e) {
                        return e.disabled === !0
                    },
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return t === "input" && !!e.checked || t === "option" && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeName > "@" || e.nodeType === 3 || e.nodeType === 4) return !1;
                        return !0
                    },
                    parent: function(e) {
                        return !i.pseudos.empty(e)
                    },
                    header: function(e) {
                        return G.test(e.nodeName)
                    },
                    input: function(e) {
                        return Q.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return t === "input" && e.type === "button" || t === "button"
                    },
                    text: function(e) {
                        var t;
                        return e.nodeName.toLowerCase() === "input" && e.type === "text" && ((t = e.getAttribute("type")) == null || t.toLowerCase() === e.type)
                    },
                    first: ct(function() {
                        return [0]
                    }),
                    last: ct(function(e, t) {
                        return [t - 1]
                    }),
                    eq: ct(function(e, t, n) {
                        return [n < 0 ? n + t : n]
                    }),
                    even: ct(function(e, t) {
                        var n = 0;
                        for (; n < t; n += 2) e.push(n);
                        return e
                    }),
                    odd: ct(function(e, t) {
                        var n = 1;
                        for (; n < t; n += 2) e.push(n);
                        return e
                    }),
                    lt: ct(function(e, t, n) {
                        var r = n < 0 ? n + t : n;
                        for (; --r >= 0;) e.push(r);
                        return e
                    }),
                    gt: ct(function(e, t, n) {
                        var r = n < 0 ? n + t : n;
                        for (; ++r < t;) e.push(r);
                        return e
                    })
                }
            };
            for (n in {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) i.pseudos[n] = ft(n);
            for (n in {
                submit: !0,
                reset: !0
            }) i.pseudos[n] = lt(n);
            u = ut.compile = function(e, t) {
                var n, r = [],
                    i = [],
                    s = k[e + " "];
                if (!s) {
                    t || (t = ht(e)), n = t.length;
                    while (n--) s = yt(t[n]), s[w] ? r.push(s) : i.push(s);
                    s = k(e, bt(i, r))
                }
                return s
            }, i.pseudos.nth = i.pseudos.eq, i.filters = St.prototype = i.pseudos, i.setFilters = new St, l(), ut.attr = b.attr, b.find = ut, b.expr = ut.selectors, b.expr[":"] = b.expr.pseudos, b.unique = ut.uniqueSort, b.text = ut.getText, b.isXMLDoc = ut.isXML, b.contains = ut.contains
        }(e);
    var ot = /Until$/,
        ut = /^(?:parents|prev(?:Until|All))/,
        at = /^.[^:#\[\.,]*$/,
        ft = b.expr.match.needsContext,
        lt = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    b.fn.extend({
        find: function(e) {
            var t, n, r, i = this.length;
            if (typeof e != "string") return r = this, this.pushStack(b(e).filter(function() {
                for (t = 0; t < i; t++)
                    if (b.contains(r[t], this)) return !0
            }));
            n = [];
            for (t = 0; t < i; t++) b.find(e, this[t], n);
            return n = this.pushStack(i > 1 ? b.unique(n) : n), n.selector = (this.selector ? this.selector + " " : "") + e, n
        },
        has: function(e) {
            var t, n = b(e, this),
                r = n.length;
            return this.filter(function() {
                for (t = 0; t < r; t++)
                    if (b.contains(this, n[t])) return !0
            })
        },
        not: function(e) {
            return this.pushStack(ht(this, e, !1))
        },
        filter: function(e) {
            return this.pushStack(ht(this, e, !0))
        },
        is: function(e) {
            return !!e && (typeof e == "string" ? ft.test(e) ? b(e, this.context).index(this[0]) >= 0 : b.filter(e, this).length > 0 : this.filter(e).length > 0)
        },
        closest: function(e, t) {
            var n, r = 0,
                i = this.length,
                s = [],
                o = ft.test(e) || typeof e != "string" ? b(e, t || this.context) : 0;
            for (; r < i; r++) {
                n = this[r];
                while (n && n.ownerDocument && n !== t && n.nodeType !== 11) {
                    if (o ? o.index(n) > -1 : b.find.matchesSelector(n, e)) {
                        s.push(n);
                        break
                    }
                    n = n.parentNode
                }
            }
            return this.pushStack(s.length > 1 ? b.unique(s) : s)
        },
        index: function(e) {
            return e ? typeof e == "string" ? b.inArray(this[0], b(e)) : b.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            var n = typeof e == "string" ? b(e, t) : b.makeArray(e && e.nodeType ? [e] : e),
                r = b.merge(this.get(), n);
            return this.pushStack(b.unique(r))
        },
        addBack: function(e) {
            return this.add(e == null ? this.prevObject : this.prevObject.filter(e))
        }
    }), b.fn.andSelf = b.fn.addBack, b.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && t.nodeType !== 11 ? t : null
        },
        parents: function(e) {
            return b.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return b.dir(e, "parentNode", n)
        },
        next: function(e) {
            return ct(e, "nextSibling")
        },
        prev: function(e) {
            return ct(e, "previousSibling")
        },
        nextAll: function(e) {
            return b.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return b.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return b.dir(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return b.dir(e, "previousSibling", n)
        },
        siblings: function(e) {
            return b.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return b.sibling(e.firstChild)
        },
        contents: function(e) {
            return b.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : b.merge([], e.childNodes)
        }
    }, function(e, t) {
        b.fn[e] = function(n, r) {
            var i = b.map(this, t, n);
            return ot.test(e) || (r = n), r && typeof r == "string" && (i = b.filter(r, i)), i = this.length > 1 && !lt[e] ? b.unique(i) : i, this.length > 1 && ut.test(e) && (i = i.reverse()), this.pushStack(i)
        }
    }), b.extend({
        filter: function(e, t, n) {
            return n && (e = ":not(" + e + ")"), t.length === 1 ? b.find.matchesSelector(t[0], e) ? [t[0]] : [] : b.find.matches(e, t)
        },
        dir: function(e, n, r) {
            var i = [],
                s = e[n];
            while (s && s.nodeType !== 9 && (r === t || s.nodeType !== 1 || !b(s).is(r))) s.nodeType === 1 && i.push(s), s = s[n];
            return i
        },
        sibling: function(e, t) {
            var n = [];
            for (; e; e = e.nextSibling) e.nodeType === 1 && e !== t && n.push(e);
            return n
        }
    });
    var dt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        vt = / jQuery\d+="(?:null|\d+)"/g,
        mt = new RegExp("<(?:" + dt + ")[\\s/>]", "i"),
        gt = /^\s+/,
        yt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        bt = /<([\w:]+)/,
        wt = /<tbody/i,
        Et = /<|&#?\w+;/,
        St = /<(?:script|style|link)/i,
        xt = /^(?:checkbox|radio)$/i,
        Tt = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Nt = /^$|\/(?:java|ecma)script/i,
        Ct = /^true\/(.*)/,
        kt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        Lt = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: b.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        },
        At = pt(s),
        Ot = At.appendChild(s.createElement("div"));
    Lt.optgroup = Lt.option, Lt.tbody = Lt.tfoot = Lt.colgroup = Lt.caption = Lt.thead, Lt.th = Lt.td, b.fn.extend({
        text: function(e) {
            return b.access(this, function(e) {
                return e === t ? b.text(this) : this.empty().append((this[0] && this[0].ownerDocument || s).createTextNode(e))
            }, null, e, arguments.length)
        },
        wrapAll: function(e) {
            if (b.isFunction(e)) return this.each(function(t) {
                b(this).wrapAll(e.call(this, t))
            });
            if (this[0]) {
                var t = b(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                    var e = this;
                    while (e.firstChild && e.firstChild.nodeType === 1) e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        },
        wrapInner: function(e) {
            return b.isFunction(e) ? this.each(function(t) {
                b(this).wrapInner(e.call(this, t))
            }) : this.each(function() {
                var t = b(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = b.isFunction(e);
            return this.each(function(n) {
                b(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                b.nodeName(this, "body") || b(this).replaceWith(this.childNodes)
            }).end()
        },
        append: function() {
            return this.domManip(arguments, !0, function(e) {
                (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) && this.appendChild(e)
            })
        },
        prepend: function() {
            return this.domManip(arguments, !0, function(e) {
                (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) && this.insertBefore(e, this.firstChild)
            })
        },
        before: function() {
            return this.domManip(arguments, !1, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return this.domManip(arguments, !1, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        remove: function(e, t) {
            var n, r = 0;
            for (;
                (n = this[r]) != null; r++)
                if (!e || b.filter(e, [n]).length > 0)!t && n.nodeType === 1 && b.cleanData(jt(n)), n.parentNode && (t && b.contains(n.ownerDocument, n) && Pt(jt(n, "script")), n.parentNode.removeChild(n));
            return this
        },
        empty: function() {
            var e, t = 0;
            for (;
                (e = this[t]) != null; t++) {
                e.nodeType === 1 && b.cleanData(jt(e, !1));
                while (e.firstChild) e.removeChild(e.firstChild);
                e.options && b.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        },
        clone: function(e, t) {
            return e = e == null ? !1 : e, t = t == null ? e : t, this.map(function() {
                return b.clone(this, e, t)
            })
        },
        html: function(e) {
            return b.access(this, function(e) {
                var n = this[0] || {},
                    r = 0,
                    i = this.length;
                if (e === t) return n.nodeType === 1 ? n.innerHTML.replace(vt, "") : t;
                if (typeof e == "string" && !St.test(e) && (b.support.htmlSerialize || !mt.test(e)) && (b.support.leadingWhitespace || !gt.test(e)) && !Lt[(bt.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = e.replace(yt, "<$1></$2>");
                    try {
                        for (; r < i; r++) n = this[r] || {}, n.nodeType === 1 && (b.cleanData(jt(n, !1)), n.innerHTML = e);
                        n = 0
                    } catch (s) {}
                }
                n && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function(e) {
            var t = b.isFunction(e);
            return !t && typeof e != "string" && (e = b(e).not(this).detach()), this.domManip([e], !0, function(e) {
                var t = this.nextSibling,
                    n = this.parentNode;
                n && (b(this).remove(), n.insertBefore(e, t))
            })
        },
        detach: function(e) {
            return this.remove(e, !0)
        },
        domManip: function(e, n, r) {
            e = h.apply([], e);
            var i, s, o, u, a, f, l = 0,
                c = this.length,
                p = this,
                d = c - 1,
                v = e[0],
                m = b.isFunction(v);
            if (m || !(c <= 1 || typeof v != "string" || b.support.checkClone || !Tt.test(v))) return this.each(function(i) {
                var s = p.eq(i);
                m && (e[0] = v.call(this, i, n ? s.html() : t)), s.domManip(e, n, r)
            });
            if (c) {
                f = b.buildFragment(e, this[0].ownerDocument, !1, this), i = f.firstChild, f.childNodes.length === 1 && (f = i);
                if (i) {
                    n = n && b.nodeName(i, "tr"), u = b.map(jt(f, "script"), _t), o = u.length;
                    for (; l < c; l++) s = f, l !== d && (s = b.clone(s, !0, !0), o && b.merge(u, jt(s, "script"))), r.call(n && b.nodeName(this[l], "table") ? Mt(this[l], "tbody") : this[l], s, l);
                    if (o) {
                        a = u[u.length - 1].ownerDocument, b.map(u, Dt);
                        for (l = 0; l < o; l++) s = u[l], Nt.test(s.type || "") && !b._data(s, "globalEval") && b.contains(a, s) && (s.src ? b.ajax({
                            url: s.src,
                            type: "GET",
                            dataType: "script",
                            async: !1,
                            global: !1,
                            "throws": !0
                        }) : b.globalEval((s.text || s.textContent || s.innerHTML || "").replace(kt, "")))
                    }
                    f = i = null
                }
            }
            return this
        }
    }), b.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        b.fn[e] = function(e) {
            var n, r = 0,
                i = [],
                s = b(e),
                o = s.length - 1;
            for (; r <= o; r++) n = r === o ? this : this.clone(!0), b(s[r])[t](n), p.apply(i, n.get());
            return this.pushStack(i)
        }
    }), b.extend({
        clone: function(e, t, n) {
            var r, i, s, o, u, a = b.contains(e.ownerDocument, e);
            b.support.html5Clone || b.isXMLDoc(e) || !mt.test("<" + e.nodeName + ">") ? s = e.cloneNode(!0) : (Ot.innerHTML = e.outerHTML, Ot.removeChild(s = Ot.firstChild));
            if ((!b.support.noCloneEvent || !b.support.noCloneChecked) && (e.nodeType === 1 || e.nodeType === 11) && !b.isXMLDoc(e)) {
                r = jt(s), u = jt(e);
                for (o = 0;
                    (i = u[o]) != null; ++o) r[o] && Bt(i, r[o])
            }
            if (t)
                if (n) {
                    u = u || jt(e), r = r || jt(s);
                    for (o = 0;
                        (i = u[o]) != null; o++) Ht(i, r[o])
                } else Ht(e, s);
            return r = jt(s, "script"), r.length > 0 && Pt(r, !a && jt(e, "script")), r = u = i = null, s
        },
        buildFragment: function(e, t, n, r) {
            var i, s, o, u, a, f, l, c = e.length,
                h = pt(t),
                p = [],
                d = 0;
            for (; d < c; d++) {
                s = e[d];
                if (s || s === 0)
                    if (b.type(s) === "object") b.merge(p, s.nodeType ? [s] : s);
                    else if (!Et.test(s)) p.push(t.createTextNode(s));
                else {
                    u = u || h.appendChild(t.createElement("div")), a = (bt.exec(s) || ["", ""])[1].toLowerCase(), l = Lt[a] || Lt._default, u.innerHTML = l[1] + s.replace(yt, "<$1></$2>") + l[2], i = l[0];
                    while (i--) u = u.lastChild;
                    !b.support.leadingWhitespace && gt.test(s) && p.push(t.createTextNode(gt.exec(s)[0]));
                    if (!b.support.tbody) {
                        s = a === "table" && !wt.test(s) ? u.firstChild : l[1] === "<table>" && !wt.test(s) ? u : 0, i = s && s.childNodes.length;
                        while (i--) b.nodeName(f = s.childNodes[i], "tbody") && !f.childNodes.length && s.removeChild(f)
                    }
                    b.merge(p, u.childNodes), u.textContent = "";
                    while (u.firstChild) u.removeChild(u.firstChild);
                    u = h.lastChild
                }
            }
            u && h.removeChild(u), b.support.appendChecked || b.grep(jt(p, "input"), Ft), d = 0;
            while (s = p[d++]) {
                if (r && b.inArray(s, r) !== -1) continue;
                o = b.contains(s.ownerDocument, s), u = jt(h.appendChild(s), "script"), o && Pt(u);
                if (n) {
                    i = 0;
                    while (s = u[i++]) Nt.test(s.type || "") && n.push(s)
                }
            }
            return u = null, h
        },
        cleanData: function(e, t) {
            var n, r, s, o, u = 0,
                a = b.expando,
                f = b.cache,
                c = b.support.deleteExpando,
                h = b.event.special;
            for (;
                (n = e[u]) != null; u++)
                if (t || b.acceptData(n)) {
                    s = n[a], o = s && f[s];
                    if (o) {
                        if (o.events)
                            for (r in o.events) h[r] ? b.event.remove(n, r) : b.removeEvent(n, r, o.handle);
                        f[s] && (delete f[s], c ? delete n[a] : typeof n.removeAttribute !== i ? n.removeAttribute(a) : n[a] = null, l.push(s))
                    }
                }
        }
    });
    var It, qt, Rt, Ut = /alpha\([^)]*\)/i,
        zt = /opacity\s*=\s*([^)]*)/,
        Wt = /^(top|right|bottom|left)$/,
        Xt = /^(none|table(?!-c[ea]).+)/,
        Vt = /^margin/,
        $t = new RegExp("^(" + w + ")(.*)$", "i"),
        Jt = new RegExp("^(" + w + ")(?!px)[a-z%]+$", "i"),
        Kt = new RegExp("^([+-])=(" + w + ")", "i"),
        Qt = {
            BODY: "block"
        },
        Gt = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Yt = {
            letterSpacing: 0,
            fontWeight: 400
        },
        Zt = ["Top", "Right", "Bottom", "Left"],
        en = ["Webkit", "O", "Moz", "ms"];
    b.fn.extend({
        css: function(e, n) {
            return b.access(this, function(e, n, r) {
                var i, s, o = {},
                    u = 0;
                if (b.isArray(n)) {
                    s = qt(e), i = n.length;
                    for (; u < i; u++) o[n[u]] = b.css(e, n[u], !1, s);
                    return o
                }
                return r !== t ? b.style(e, n, r) : b.css(e, n)
            }, e, n, arguments.length > 1)
        },
        show: function() {
            return rn(this, !0)
        },
        hide: function() {
            return rn(this)
        },
        toggle: function(e) {
            var t = typeof e == "boolean";
            return this.each(function() {
                (t ? e : nn(this)) ? b(this).show(): b(this).hide()
            })
        }
    }), b.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = Rt(e, "opacity");
                        return n === "" ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": b.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, n, r, i) {
            if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) return;
            var s, o, u, a = b.camelCase(n),
                f = e.style;
            n = b.cssProps[a] || (b.cssProps[a] = tn(f, a)), u = b.cssHooks[n] || b.cssHooks[a];
            if (r === t) return u && "get" in u && (s = u.get(e, !1, i)) !== t ? s : f[n];
            o = typeof r, o === "string" && (s = Kt.exec(r)) && (r = (s[1] + 1) * s[2] + parseFloat(b.css(e, n)), o = "number");
            if (r == null || o === "number" && isNaN(r)) return;
            o === "number" && !b.cssNumber[a] && (r += "px"), !b.support.clearCloneStyle && r === "" && n.indexOf("background") === 0 && (f[n] = "inherit");
            if (!u || !("set" in u) || (r = u.set(e, r, i)) !== t) try {
                f[n] = r
            } catch (l) {}
        },
        css: function(e, n, r, i) {
            var s, o, u, a = b.camelCase(n);
            return n = b.cssProps[a] || (b.cssProps[a] = tn(e.style, a)), u = b.cssHooks[n] || b.cssHooks[a], u && "get" in u && (o = u.get(e, !0, r)), o === t && (o = Rt(e, n, i)), o === "normal" && n in Yt && (o = Yt[n]), r === "" || r ? (s = parseFloat(o), r === !0 || b.isNumeric(s) ? s || 0 : o) : o
        },
        swap: function(e, t, n, r) {
            var i, s, o = {};
            for (s in t) o[s] = e.style[s], e.style[s] = t[s];
            i = n.apply(e, r || []);
            for (s in t) e.style[s] = o[s];
            return i
        }
    }), e.getComputedStyle ? (qt = function(t) {
        return e.getComputedStyle(t, null)
    }, Rt = function(e, n, r) {
        var i, s, o, u = r || qt(e),
            a = u ? u.getPropertyValue(n) || u[n] : t,
            f = e.style;
        return u && (a === "" && !b.contains(e.ownerDocument, e) && (a = b.style(e, n)), Jt.test(a) && Vt.test(n) && (i = f.width, s = f.minWidth, o = f.maxWidth, f.minWidth = f.maxWidth = f.width = a, a = u.width, f.width = i, f.minWidth = s, f.maxWidth = o)), a
    }) : s.documentElement.currentStyle && (qt = function(e) {
        return e.currentStyle
    }, Rt = function(e, n, r) {
        var i, s, o, u = r || qt(e),
            a = u ? u[n] : t,
            f = e.style;
        return a == null && f && f[n] && (a = f[n]), Jt.test(a) && !Wt.test(n) && (i = f.left, s = e.runtimeStyle, o = s && s.left, o && (s.left = e.currentStyle.left), f.left = n === "fontSize" ? "1em" : a, a = f.pixelLeft + "px", f.left = i, o && (s.left = o)), a === "" ? "auto" : a
    }), b.each(["height", "width"], function(e, t) {
        b.cssHooks[t] = {
            get: function(e, n, r) {
                if (n) return e.offsetWidth === 0 && Xt.test(b.css(e, "display")) ? b.swap(e, Gt, function() {
                    return un(e, t, r)
                }) : un(e, t, r)
            },
            set: function(e, n, r) {
                var i = r && qt(e);
                return sn(e, n, r ? on(e, t, r, b.support.boxSizing && b.css(e, "boxSizing", !1, i) === "border-box", i) : 0)
            }
        }
    }), b.support.opacity || (b.cssHooks.opacity = {
        get: function(e, t) {
            return zt.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var n = e.style,
                r = e.currentStyle,
                i = b.isNumeric(t) ? "alpha(opacity=" + t * 100 + ")" : "",
                s = r && r.filter || n.filter || "";
            n.zoom = 1;
            if ((t >= 1 || t === "") && b.trim(s.replace(Ut, "")) === "" && n.removeAttribute) {
                n.removeAttribute("filter");
                if (t === "" || r && !r.filter) return
            }
            n.filter = Ut.test(s) ? s.replace(Ut, i) : s + " " + i
        }
    }), b(function() {
        b.support.reliableMarginRight || (b.cssHooks.marginRight = {
            get: function(e, t) {
                if (t) return b.swap(e, {
                    display: "inline-block"
                }, Rt, [e, "marginRight"])
            }
        }), !b.support.pixelPosition && b.fn.position && b.each(["top", "left"], function(e, t) {
            b.cssHooks[t] = {
                get: function(e, n) {
                    if (n) return n = Rt(e, t), Jt.test(n) ? b(e).position()[t] + "px" : n
                }
            }
        })
    }), b.expr && b.expr.filters && (b.expr.filters.hidden = function(e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !b.support.reliableHiddenOffsets && (e.style && e.style.display || b.css(e, "display")) === "none"
    }, b.expr.filters.visible = function(e) {
        return !b.expr.filters.hidden(e)
    }), b.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        b.cssHooks[e + t] = {
            expand: function(n) {
                var r = 0,
                    i = {},
                    s = typeof n == "string" ? n.split(" ") : [n];
                for (; r < 4; r++) i[e + Zt[r] + t] = s[r] || s[r - 2] || s[0];
                return i
            }
        }, Vt.test(e) || (b.cssHooks[e + t].set = sn)
    });
    var ln = /%20/g,
        cn = /\[\]$/,
        hn = /\r?\n/g,
        pn = /^(?:submit|button|image|reset|file)$/i,
        dn = /^(?:input|select|textarea|keygen)/i;
    b.fn.extend({
        serialize: function() {
            return b.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = b.prop(this, "elements");
                return e ? b.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !b(this).is(":disabled") && dn.test(this.nodeName) && !pn.test(e) && (this.checked || !xt.test(e))
            }).map(function(e, t) {
                var n = b(this).val();
                return n == null ? null : b.isArray(n) ? b.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(hn, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(hn, "\r\n")
                }
            }).get()
        }
    }), b.param = function(e, n) {
        var r, i = [],
            s = function(e, t) {
                t = b.isFunction(t) ? t() : t == null ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        n === t && (n = b.ajaxSettings && b.ajaxSettings.traditional);
        if (b.isArray(e) || e.jquery && !b.isPlainObject(e)) b.each(e, function() {
            s(this.name, this.value)
        });
        else
            for (r in e) vn(r, e[r], n, s);
        return i.join("&").replace(ln, "+")
    }, b.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
        b.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), b.fn.hover = function(e, t) {
        return this.mouseenter(e).mouseleave(t || e)
    };
    var mn, gn, yn = b.now(),
        bn = /\?/,
        wn = /#.*$/,
        En = /([?&])_=[^&]*/,
        Sn = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
        xn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Tn = /^(?:GET|HEAD)$/,
        Nn = /^\/\//,
        Cn = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        kn = b.fn.load,
        Ln = {},
        An = {},
        On = "*/".concat("*");
    try {
        gn = o.href
    } catch (Mn) {
        gn = s.createElement("a"), gn.href = "", gn = gn.href
    }
    mn = Cn.exec(gn.toLowerCase()) || [], b.fn.load = function(e, n, r) {
        if (typeof e != "string" && kn) return kn.apply(this, arguments);
        var i, s, o, u = this,
            a = e.indexOf(" ");
        return a >= 0 && (i = e.slice(a, e.length), e = e.slice(0, a)), b.isFunction(n) ? (r = n, n = t) : n && typeof n == "object" && (o = "POST"), u.length > 0 && b.ajax({
            url: e,
            type: o,
            dataType: "html",
            data: n
        }).done(function(e) {
            s = arguments, u.html(i ? b("<div>").append(b.parseHTML(e)).find(i) : e)
        }).complete(r && function(e, t) {
            u.each(r, s || [e.responseText, t, e])
        }), this
    }, b.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        b.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), b.each(["get", "post"], function(e, n) {
        b[n] = function(e, r, i, s) {
            return b.isFunction(r) && (s = s || i, i = r, r = t), b.ajax({
                url: e,
                type: n,
                dataType: s,
                data: r,
                success: i
            })
        }
    }), b.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: gn,
            type: "GET",
            isLocal: xn.test(mn[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": On,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": e.String,
                "text html": !0,
                "text json": b.parseJSON,
                "text xml": b.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? Pn(Pn(e, b.ajaxSettings), t) : Pn(b.ajaxSettings, e)
        },
        ajaxPrefilter: _n(Ln),
        ajaxTransport: _n(An),
        ajax: function(e, n) {
            function N(e, n, r, i) {
                var l, g, y, E, S, T = n;
                if (w === 2) return;
                w = 2, u && clearTimeout(u), f = t, o = i || "", x.readyState = e > 0 ? 4 : 0, r && (E = Hn(c, x, r));
                if (e >= 200 && e < 300 || e === 304) c.ifModified && (S = x.getResponseHeader("Last-Modified"), S && (b.lastModified[s] = S), S = x.getResponseHeader("etag"), S && (b.etag[s] = S)), e === 204 ? (l = !0, T = "nocontent") : e === 304 ? (l = !0, T = "notmodified") : (l = Bn(c, E), T = l.state, g = l.data, y = l.error, l = !y);
                else {
                    y = T;
                    if (e || !T) T = "error", e < 0 && (e = 0)
                }
                x.status = e, x.statusText = (n || T) + "", l ? d.resolveWith(h, [g, T, x]) : d.rejectWith(h, [x, T, y]), x.statusCode(m), m = t, a && p.trigger(l ? "ajaxSuccess" : "ajaxError", [x, c, l ? g : y]), v.fireWith(h, [x, T]), a && (p.trigger("ajaxComplete", [x, c]), --b.active || b.event.trigger("ajaxStop"))
            }
            typeof e == "object" && (n = e, e = t), n = n || {};
            var r, i, s, o, u, a, f, l, c = b.ajaxSetup({}, n),
                h = c.context || c,
                p = c.context && (h.nodeType || h.jquery) ? b(h) : b.event,
                d = b.Deferred(),
                v = b.Callbacks("once memory"),
                m = c.statusCode || {},
                g = {},
                y = {},
                w = 0,
                S = "canceled",
                x = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (w === 2) {
                            if (!l) {
                                l = {};
                                while (t = Sn.exec(o)) l[t[1].toLowerCase()] = t[2]
                            }
                            t = l[e.toLowerCase()]
                        }
                        return t == null ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return w === 2 ? o : null
                    },
                    setRequestHeader: function(e, t) {
                        var n = e.toLowerCase();
                        return w || (e = y[n] = y[n] || e, g[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return w || (c.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (w < 2)
                                for (t in e) m[t] = [m[t], e[t]];
                            else x.always(e[x.status]);
                        return this
                    },
                    abort: function(e) {
                        var t = e || S;
                        return f && f.abort(t), N(0, t), this
                    }
                };
            d.promise(x).complete = v.add, x.success = x.done, x.error = x.fail, c.url = ((e || c.url || gn) + "").replace(wn, "").replace(Nn, mn[1] + "//"), c.type = n.method || n.type || c.method || c.type, c.dataTypes = b.trim(c.dataType || "*").toLowerCase().match(E) || [""], c.crossDomain == null && (r = Cn.exec(c.url.toLowerCase()), c.crossDomain = !(!r || r[1] === mn[1] && r[2] === mn[2] && (r[3] || (r[1] === "http:" ? 80 : 443)) == (mn[3] || (mn[1] === "http:" ? 80 : 443)))), c.data && c.processData && typeof c.data != "string" && (c.data = b.param(c.data, c.traditional)), Dn(Ln, c, n, x);
            if (w === 2) return x;
            a = c.global, a && b.active++ === 0 && b.event.trigger("ajaxStart"), c.type = c.type.toUpperCase(), c.hasContent = !Tn.test(c.type), s = c.url, c.hasContent || (c.data && (s = c.url += (bn.test(s) ? "&" : "?") + c.data, delete c.data), c.cache === !1 && (c.url = En.test(s) ? s.replace(En, "$1_=" + yn++) : s + (bn.test(s) ? "&" : "?") + "_=" + yn++)), c.ifModified && (b.lastModified[s] && x.setRequestHeader("If-Modified-Since", b.lastModified[s]), b.etag[s] && x.setRequestHeader("If-None-Match", b.etag[s])), (c.data && c.hasContent && c.contentType !== !1 || n.contentType) && x.setRequestHeader("Content-Type", c.contentType), x.setRequestHeader("Accept", c.dataTypes[0] && c.accepts[c.dataTypes[0]] ? c.accepts[c.dataTypes[0]] + (c.dataTypes[0] !== "*" ? ", " + On + "; q=0.01" : "") : c.accepts["*"]);
            for (i in c.headers) x.setRequestHeader(i, c.headers[i]);
            if (!c.beforeSend || c.beforeSend.call(h, x, c) !== !1 && w !== 2) {
                S = "abort";
                for (i in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) x[i](c[i]);
                f = Dn(An, c, n, x);
                if (!f) N(-1, "No Transport");
                else {
                    x.readyState = 1, a && p.trigger("ajaxSend", [x, c]), c.async && c.timeout > 0 && (u = setTimeout(function() {
                        x.abort("timeout")
                    }, c.timeout));
                    try {
                        w = 1, f.send(g, N)
                    } catch (T) {
                        if (!(w < 2)) throw T;
                        N(-1, T)
                    }
                }
                return x
            }
            return x.abort()
        },
        getScript: function(e, n) {
            return b.get(e, t, n, "script")
        },
        getJSON: function(e, t, n) {
            return b.get(e, t, n, "json")
        }
    }), b.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(e) {
                return b.globalEval(e), e
            }
        }
    }), b.ajaxPrefilter("script", function(e) {
        e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), b.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var n, r = s.head || b("head")[0] || s.documentElement;
            return {
                send: function(t, i) {
                    n = s.createElement("script"), n.async = !0, e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function(e, t) {
                        if (t || !n.readyState || /loaded|complete/.test(n.readyState)) n.onload = n.onreadystatechange = null, n.parentNode && n.parentNode.removeChild(n), n = null, t || i(200, "success")
                    }, r.insertBefore(n, r.firstChild)
                },
                abort: function() {
                    n && n.onload(t, !0)
                }
            }
        }
    });
    var jn = [],
        Fn = /(=)\?(?=&|$)|\?\?/;
    b.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = jn.pop() || b.expando + "_" + yn++;
            return this[e] = !0, e
        }
    }), b.ajaxPrefilter("json jsonp", function(n, r, i) {
        var s, o, u, a = n.jsonp !== !1 && (Fn.test(n.url) ? "url" : typeof n.data == "string" && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Fn.test(n.data) && "data");
        if (a || n.dataTypes[0] === "jsonp") return s = n.jsonpCallback = b.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, a ? n[a] = n[a].replace(Fn, "$1" + s) : n.jsonp !== !1 && (n.url += (bn.test(n.url) ? "&" : "?") + n.jsonp + "=" + s), n.converters["script json"] = function() {
            return u || b.error(s + " was not called"), u[0]
        }, n.dataTypes[0] = "json", o = e[s], e[s] = function() {
            u = arguments
        }, i.always(function() {
            e[s] = o, n[s] && (n.jsonpCallback = r.jsonpCallback, jn.push(s)), u && b.isFunction(o) && o(u[0]), u = o = t
        }), "script"
    });
    var In, qn, Rn = 0,
        Un = e.ActiveXObject && function() {
            var e;
            for (e in In) In[e](t, !0)
        };
    b.ajaxSettings.xhr = e.ActiveXObject ? function() {
        return !this.isLocal && zn() || Wn()
    } : zn, qn = b.ajaxSettings.xhr(), b.support.cors = !!qn && "withCredentials" in qn, qn = b.support.ajax = !!qn, qn && b.ajaxTransport(function(n) {
        if (!n.crossDomain || b.support.cors) {
            var r;
            return {
                send: function(i, s) {
                    var o, u, a = n.xhr();
                    n.username ? a.open(n.type, n.url, n.async, n.username, n.password) : a.open(n.type, n.url, n.async);
                    if (n.xhrFields)
                        for (u in n.xhrFields) a[u] = n.xhrFields[u];
                    n.mimeType && a.overrideMimeType && a.overrideMimeType(n.mimeType), !n.crossDomain && !i["X-Requested-With"] && (i["X-Requested-With"] = "XMLHttpRequest");
                    try {
                        for (u in i) a.setRequestHeader(u, i[u])
                    } catch (f) {}
                    a.send(n.hasContent && n.data || null), r = function(e, i) {
                        var u, f, l, c;
                        try {
                            if (r && (i || a.readyState === 4)) {
                                r = t, o && (a.onreadystatechange = b.noop, Un && delete In[o]);
                                if (i) a.readyState !== 4 && a.abort();
                                else {
                                    c = {}, u = a.status, f = a.getAllResponseHeaders(), typeof a.responseText == "string" && (c.text = a.responseText);
                                    try {
                                        l = a.statusText
                                    } catch (h) {
                                        l = ""
                                    }!u && n.isLocal && !n.crossDomain ? u = c.text ? 200 : 404 : u === 1223 && (u = 204)
                                }
                            }
                        } catch (p) {
                            i || s(-1, p)
                        }
                        c && s(u, l, c, f)
                    }, n.async ? a.readyState === 4 ? setTimeout(r) : (o = ++Rn, Un && (In || (In = {}, b(e).unload(Un)), In[o] = r), a.onreadystatechange = r) : r()
                },
                abort: function() {
                    r && r(t, !0)
                }
            }
        }
    });
    var Xn, Vn, $n = /^(?:toggle|show|hide)$/,
        Jn = new RegExp("^(?:([+-])=|)(" + w + ")([a-z%]*)$", "i"),
        Kn = /queueHooks$/,
        Qn = [nr],
        Gn = {
            "*": [
                function(e, t) {
                    var n, r, i = this.createTween(e, t),
                        s = Jn.exec(t),
                        o = i.cur(),
                        u = +o || 0,
                        a = 1,
                        f = 20;
                    if (s) {
                        n = +s[2], r = s[3] || (b.cssNumber[e] ? "" : "px");
                        if (r !== "px" && u) {
                            u = b.css(i.elem, e, !0) || n || 1;
                            do a = a || ".5", u /= a, b.style(i.elem, e, u + r); while (a !== (a = i.cur() / o) && a !== 1 && --f)
                        }
                        i.unit = r, i.start = u, i.end = s[1] ? u + (s[1] + 1) * n : n
                    }
                    return i
                }
            ]
        };
    b.Animation = b.extend(er, {
        tweener: function(e, t) {
            b.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
            var n, r = 0,
                i = e.length;
            for (; r < i; r++) n = e[r], Gn[n] = Gn[n] || [], Gn[n].unshift(t)
        },
        prefilter: function(e, t) {
            t ? Qn.unshift(e) : Qn.push(e)
        }
    }), b.Tween = rr, rr.prototype = {
        constructor: rr,
        init: function(e, t, n, r, i, s) {
            this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = s || (b.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = rr.propHooks[this.prop];
            return e && e.get ? e.get(this) : rr.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = rr.propHooks[this.prop];
            return this.options.duration ? this.pos = t = b.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : rr.propHooks._default.set(this), this
        }
    }, rr.prototype.init.prototype = rr.prototype, rr.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return e.elem[e.prop] == null || !!e.elem.style && e.elem.style[e.prop] != null ? (t = b.css(e.elem, e.prop, ""), !t || t === "auto" ? 0 : t) : e.elem[e.prop]
            },
            set: function(e) {
                b.fx.step[e.prop] ? b.fx.step[e.prop](e) : e.elem.style && (e.elem.style[b.cssProps[e.prop]] != null || b.cssHooks[e.prop]) ? b.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    }, rr.propHooks.scrollTop = rr.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, b.each(["toggle", "show", "hide"], function(e, t) {
        var n = b.fn[t];
        b.fn[t] = function(e, r, i) {
            return e == null || typeof e == "boolean" ? n.apply(this, arguments) : this.animate(ir(t, !0), e, r, i)
        }
    }), b.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(nn).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(e, t, n, r) {
            var i = b.isEmptyObject(e),
                s = b.speed(t, n, r),
                o = function() {
                    var t = er(this, b.extend({}, e), s);
                    o.finish = function() {
                        t.stop(!0)
                    }, (i || b._data(this, "finish")) && t.stop(!0)
                };
            return o.finish = o, i || s.queue === !1 ? this.each(o) : this.queue(s.queue, o)
        },
        stop: function(e, n, r) {
            var i = function(e) {
                var t = e.stop;
                delete e.stop, t(r)
            };
            return typeof e != "string" && (r = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                var t = !0,
                    n = e != null && e + "queueHooks",
                    s = b.timers,
                    o = b._data(this);
                if (n) o[n] && o[n].stop && i(o[n]);
                else
                    for (n in o) o[n] && o[n].stop && Kn.test(n) && i(o[n]);
                for (n = s.length; n--;) s[n].elem === this && (e == null || s[n].queue === e) && (s[n].anim.stop(r), t = !1, s.splice(n, 1));
                (t || !r) && b.dequeue(this, e)
            })
        },
        finish: function(e) {
            return e !== !1 && (e = e || "fx"), this.each(function() {
                var t, n = b._data(this),
                    r = n[e + "queue"],
                    i = n[e + "queueHooks"],
                    s = b.timers,
                    o = r ? r.length : 0;
                n.finish = !0, b.queue(this, e, []), i && i.cur && i.cur.finish && i.cur.finish.call(this);
                for (t = s.length; t--;) s[t].elem === this && s[t].queue === e && (s[t].anim.stop(!0), s.splice(t, 1));
                for (t = 0; t < o; t++) r[t] && r[t].finish && r[t].finish.call(this);
                delete n.finish
            })
        }
    }), b.each({
        slideDown: ir("show"),
        slideUp: ir("hide"),
        slideToggle: ir("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        b.fn[e] = function(e, n, r) {
            return this.animate(t, e, n, r)
        }
    }), b.speed = function(e, t, n) {
        var r = e && typeof e == "object" ? b.extend({}, e) : {
            complete: n || !n && t || b.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !b.isFunction(t) && t
        };
        r.duration = b.fx.off ? 0 : typeof r.duration == "number" ? r.duration : r.duration in b.fx.speeds ? b.fx.speeds[r.duration] : b.fx.speeds._default;
        if (r.queue == null || r.queue === !0) r.queue = "fx";
        return r.old = r.complete, r.complete = function() {
            b.isFunction(r.old) && r.old.call(this), r.queue && b.dequeue(this, r.queue)
        }, r
    }, b.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    }, b.timers = [], b.fx = rr.prototype.init, b.fx.tick = function() {
        var e, n = b.timers,
            r = 0;
        Xn = b.now();
        for (; r < n.length; r++) e = n[r], !e() && n[r] === e && n.splice(r--, 1);
        n.length || b.fx.stop(), Xn = t
    }, b.fx.timer = function(e) {
        e() && b.timers.push(e) && b.fx.start()
    }, b.fx.interval = 13, b.fx.start = function() {
        Vn || (Vn = setInterval(b.fx.tick, b.fx.interval))
    }, b.fx.stop = function() {
        clearInterval(Vn), Vn = null
    }, b.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, b.fx.step = {}, b.expr && b.expr.filters && (b.expr.filters.animated = function(e) {
        return b.grep(b.timers, function(t) {
            return e === t.elem
        }).length
    }), b.fn.offset = function(e) {
        if (arguments.length) return e === t ? this : this.each(function(t) {
            b.offset.setOffset(this, e, t)
        });
        var n, r, s = {
                top: 0,
                left: 0
            },
            o = this[0],
            u = o && o.ownerDocument;
        if (!u) return;
        return n = u.documentElement, b.contains(n, o) ? (typeof o.getBoundingClientRect !== i && (s = o.getBoundingClientRect()), r = sr(u), {
            top: s.top + (r.pageYOffset || n.scrollTop) - (n.clientTop || 0),
            left: s.left + (r.pageXOffset || n.scrollLeft) - (n.clientLeft || 0)
        }) : s
    }, b.offset = {
        setOffset: function(e, t, n) {
            var r = b.css(e, "position");
            r === "static" && (e.style.position = "relative");
            var i = b(e),
                s = i.offset(),
                o = b.css(e, "top"),
                u = b.css(e, "left"),
                a = (r === "absolute" || r === "fixed") && b.inArray("auto", [o, u]) > -1,
                f = {},
                l = {},
                c, h;
            a ? (l = i.position(), c = l.top, h = l.left) : (c = parseFloat(o) || 0, h = parseFloat(u) || 0), b.isFunction(t) && (t = t.call(e, n, s)), t.top != null && (f.top = t.top - s.top + c), t.left != null && (f.left = t.left - s.left + h), "using" in t ? t.using.call(e, f) : i.css(f)
        }
    }, b.fn.extend({
        position: function() {
            if (!this[0]) return;
            var e, t, n = {
                    top: 0,
                    left: 0
                },
                r = this[0];
            return b.css(r, "position") === "fixed" ? t = r.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), b.nodeName(e[0], "html") || (n = e.offset()), n.top += b.css(e[0], "borderTopWidth", !0), n.left += b.css(e[0], "borderLeftWidth", !0)), {
                top: t.top - n.top - b.css(r, "marginTop", !0),
                left: t.left - n.left - b.css(r, "marginLeft", !0)
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var e = this.offsetParent || s.documentElement;
                while (e && !b.nodeName(e, "html") && b.css(e, "position") === "static") e = e.offsetParent;
                return e || s.documentElement
            })
        }
    }), b.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, n) {
        var r = /Y/.test(n);
        b.fn[e] = function(i) {
            return b.access(this, function(e, i, s) {
                var o = sr(e);
                if (s === t) return o ? n in o ? o[n] : o.document.documentElement[i] : e[i];
                o ? o.scrollTo(r ? b(o).scrollLeft() : s, r ? s : b(o).scrollTop()) : e[i] = s
            }, e, i, arguments.length, null)
        }
    }), b.each({
        Height: "height",
        Width: "width"
    }, function(e, n) {
        b.each({
            padding: "inner" + e,
            content: n,
            "": "outer" + e
        }, function(r, i) {
            b.fn[i] = function(i, s) {
                var o = arguments.length && (r || typeof i != "boolean"),
                    u = r || (i === !0 || s === !0 ? "margin" : "border");
                return b.access(this, function(n, r, i) {
                    var s;
                    return b.isWindow(n) ? n.document.documentElement["client" + e] : n.nodeType === 9 ? (s = n.documentElement, Math.max(n.body["scroll" + e], s["scroll" + e], n.body["offset" + e], s["offset" + e], s["client" + e])) : i === t ? b.css(n, r, u) : b.style(n, r, i, u)
                }, n, o ? i : t, o, null)
            }
        })
    }), e.jQuery = e.$ = b, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function() {
        return b
    })
})(window),
function(e) {
    e.fn.unveil = function(t, n) {
        function f() {
            var t = u.filter(function() {
                var t = e(this),
                    n = r.scrollTop(),
                    s = n + r.height(),
                    o = t.offset().top,
                    u = o + t.height();
                return u >= n - i && o <= s + i
            });
            a = t.trigger("unveil"), u = u.not(a)
        }
        var r = e(window),
            i = t || 0,
            s = window.devicePixelRatio > 1,
            o = s ? "data-src-retina" : "data-src",
            u = this,
            a;
        return this.one("unveil", function() {
            var e = this.getAttribute(o);
            e = e || this.getAttribute("data-src"), e && (this.setAttribute("src", e), typeof n == "function" && n.call(this))
        }), r.scroll(f), r.resize(f), f(), this
    }
}(window.jQuery || window.Zepto),
function(e, t, n) {
    function i(e) {
        return e
    }

    function s(e) {
        return o(decodeURIComponent(e.replace(r, " ")))
    }

    function o(e) {
        return e.indexOf('"') === 0 && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")), e
    }

    function u(e) {
        return a.json ? JSON.parse(e) : e
    }
    var r = /\+/g,
        a = e.cookie = function(r, o, f) {
            if (o !== n) {
                f = e.extend({}, a.defaults, f), o === null && (f.expires = -1);
                if (typeof f.expires == "number") {
                    var l = f.expires,
                        c = f.expires = new Date;
                    c.setDate(c.getDate() + l)
                }
                return o = a.json ? JSON.stringify(o) : String(o), t.cookie = [encodeURIComponent(r), "=", a.raw ? o : encodeURIComponent(o), f.expires ? "; expires=" + f.expires.toUTCString() : "", f.path ? "; path=" + f.path : "", f.domain ? "; domain=" + f.domain : "", f.secure ? "; secure" : ""].join("")
            }
            var h = a.raw ? i : s,
                p = t.cookie.split("; "),
                d = r ? null : {};
            for (var v = 0, m = p.length; v < m; v++) {
                var g = p[v].split("="),
                    y = h(g.shift()),
                    b = h(g.join("="));
                if (r && r === y) {
                    d = u(b);
                    break
                }
                r || (d[y] = u(b))
            }
            return d
        };
    a.defaults = {}, e.removeCookie = function(t, n) {
        return e.cookie(t) !== null ? (e.cookie(t, null, n), !0) : !1
    }
}(jQuery, document),
function(e) {
    "use strict";

    function t(e) {
        return new RegExp("(^|\\s+)" + e + "(\\s+|$)")
    }

    function s(e, t) {
        var s = n(e, t) ? i : r;
        s(e, t)
    }
    var n, r, i;
    "classList" in document.documentElement ? (n = function(e, t) {
        return e.classList.contains(t)
    }, r = function(e, t) {
        e.classList.add(t)
    }, i = function(e, t) {
        e.classList.remove(t)
    }) : (n = function(e, n) {
        return t(n).test(e.className)
    }, r = function(e, t) {
        n(e, t) || (e.className = e.className + " " + t)
    }, i = function(e, n) {
        e.className = e.className.replace(t(n), " ")
    }), e.classie = {
        hasClass: n,
        addClass: r,
        removeClass: i,
        toggleClass: s,
        has: n,
        add: r,
        remove: i,
        toggle: s
    }
}(window),
function() {
    window.OpenXJS = function() {
        function e(e) {
            this.deliveryUrl = e.deliveryUrl, this.defaultParameters = e.parameters
        }
        return e.prototype.spcScript = "spc.php", e.prototype.displayAds = function(e, t, n) {
            var r = this;
            return this.receiveAdCodes(e, t, function(e) {
                var t, i;
                for (i in e) t = e[i], r._displayAd(i, t);
                return typeof n == "function" ? n() : void 0
            })
        }, e.prototype.receiveAdCodes = function(e, t, n) {
            var r, i, s = this;
            return r = this._openxParameters(e, t), i = this.deliveryUrl + this.spcScript + "?" + this._queryString(r), this._loadScript(i, function() {
                return s._parseResponse(e, n)
            })
        }, e.prototype._parseResponse = function(e, t) {
            var n, r, i;
            n = {};
            if (typeof window.OA_output != "object") {
                window.OA_output = null, typeof t == "function" && t(n);
                return
            }
            for (r in e) {
                i = e[r];
                if (this._emptyResponse(window.OA_output[r])) continue;
                n[r] = window.OA_output[r]
            }
            return window.OA_output = null, typeof t == "function" ? t(n) : void 0
        }, e.prototype._displayAd = function(e, t) {
            var n;
            n = document.getElementById(e);
            if (n === null) return;
            return document.getElementById(e).innerHTML = t
        }, e.prototype._openxParameters = function(e, t) {
            var n, r, i, s, o, u, a;
            i = this._mergeObjects(this.defaultParameters, t), r = "|";
            for (o in e) a = e[o], r += "" + o + "=" + a + "|";
            s = {
                zones: r,
                nz: 1,
                blockcampaign: 1,
                charset: this._documentCharset(),
                cb: this._randomNumber(),
                r: this._randomNumber(),
                loc: this._location(),
                referer: this._referrer()
            };
            for (n in i) u = i[n], s[n] = u;
            return s
        }, e.prototype._loadScript = function(e, t) {
            var n, r, i = this;
            return r = document.createElement("script"), r.async = "async", n = !1, r.onload = r.onreadystatechange = function() {
                if (r.readyState && !/complete|loaded/.test(r.readyState) || n) return;
                return n = !0, r.onload = r.onreadystatechange = null, typeof t == "function" ? t() : void 0
            }, r.src = e, this._appendToHead(r)
        }, e.prototype._randomNumber = function() {
            return Math.floor(Math.random() * 99999999999)
        }, e.prototype._location = function() {
            return window.location
        }, e.prototype._referrer = function() {
            return document.referrer
        }, e.prototype._documentCharset = function() {
            return document.charset ? document.charset : document.characterSet ? document.characterSet : ""
        }, e.prototype._emptyResponse = function(e) {
            return typeof e != "string" || e === "" || e === "<a href='F' target='_blank'><img src='F' border='0' alt=''></a>\n"
        }, e.prototype._queryString = function(e) {
            var t, n, r;
            t = [];
            for (n in e) r = e[n], r != null && t.push("" + n + "=" + encodeURIComponent(r));
            return t.join("&")
        }, e.prototype._appendToHead = function(e) {
            var t;
            return t = document.head || document.getElementsByTagName("head")[0] || document.documentElement, t.insertBefore(e, t.firstChild)
        }, e.prototype._mergeObjects = function(e, t) {
            var n, r;
            r = {};
            for (n in e) r[n] = e[n];
            for (n in t) r[n] = t[n];
            return r
        }, e
    }()
}.call(this), Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
    "use strict";
    if (this === void 0 || this === null) throw new TypeError;
    var t = Object(this),
        n = t.length >>> 0;
    if (n === 0) return -1;
    var r = 0;
    arguments.length > 0 && (r = Number(arguments[1]), r !== r ? r = 0 : r !== 0 && r !== Infinity && r !== -
        Infinity && (r = (r > 0 || -1) * Math.floor(Math.abs(r))));
    if (r >= n) return -1;
    var i = r >= 0 ? r : Math.max(n - Math.abs(r), 0);
    for (; i < n; i++)
        if (i in t && t[i] === e) return i;
    return -1
});
var I18n = I18n || {};
I18n.defaultLocale = "en", I18n.fallbacks = !1, I18n.defaultSeparator = ".", I18n.locale = null, I18n.PLACEHOLDER = /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm, I18n.fallbackRules = {}, I18n.pluralizationRules = {
    en: function(e) {
        return e == 0 ? ["zero", "none", "other"] : e == 1 ? "one" : "other"
    }
}, I18n.getFallbacks = function(e) {
    if (e === I18n.defaultLocale) return [];
    if (!I18n.fallbackRules[e]) {
        var t = [],
            n = e.split("-");
        for (var r = 1; r < n.length; r++) t.push(n.slice(0, r).join("-"));
        t.push(I18n.defaultLocale), I18n.fallbackRules[e] = t
    }
    return I18n.fallbackRules[e]
}, I18n.isValidNode = function(e, t, n) {
    return e[t] !== null && e[t] !== n
}, I18n.lookup = function(e, t) {
    var t = t || {},
        n = e,
        r = this.prepareOptions(I18n.translations),
        i = t.locale || I18n.currentLocale(),
        s = r[i] || {},
        t = this.prepareOptions(t),
        o;
    typeof e == "object" && (e = e.join(this.defaultSeparator)), t.scope && (e = t.scope.toString() + this.defaultSeparator + e), e = e.split(this.defaultSeparator);
    while (s && e.length > 0) o = e.shift(), s = s[o];
    if (!s) {
        if (I18n.fallbacks) {
            var u = this.getFallbacks(i);
            for (var a = 0; a < u.length; u++) {
                s = I18n.lookup(n, this.prepareOptions({
                    locale: u[a]
                }, t));
                if (s) break
            }
        }!s && this.isValidNode(t, "defaultValue") && (s = t.defaultValue)
    }
    return s
}, I18n.prepareOptions = function() {
    var e = {},
        t, n = arguments.length;
    for (var r = 0; r < n; r++) {
        t = arguments[r];
        if (!t) continue;
        for (var i in t) this.isValidNode(e, i) || (e[i] = t[i])
    }
    return e
}, I18n.interpolate = function(e, t) {
    t = this.prepareOptions(t);
    var n = e.match(this.PLACEHOLDER),
        r, i, s;
    if (!n) return e;
    for (var o = 0; r = n[o]; o++) s = r.replace(this.PLACEHOLDER, "$1"), i = t[s], this.isValidNode(t, s) || (i = "[missing " + r + " value]"), regex = new RegExp(r.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}")), e = e.replace(regex, i);
    return e
}, I18n.translate = function(e, t) {
    t = this.prepareOptions(t);
    var n = this.lookup(e, t);
    try {
        return typeof n == "object" ? typeof t.count == "number" ? this.pluralize(t.count, e, t) : n : this.interpolate(n, t)
    } catch (r) {
        return this.missingTranslation(e)
    }
}, I18n.localize = function(e, t) {
    switch (e) {
        case "currency":
            return this.toCurrency(t);
        case "number":
            return e = this.lookup("number.format"), this.toNumber(t, e);
        case "percentage":
            return this.toPercentage(t);
        default:
            return e.match(/^(date|time)/) ? this.toTime(e, t) : t.toString()
    }
}, I18n.parseDate = function(e) {
    var t, n;
    if (typeof e == "object") return e;
    t = e.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?(Z|\+0000)?/);
    if (t) {
        for (var r = 1; r <= 6; r++) t[r] = parseInt(t[r], 10) || 0;
        t[2] -= 1, t[7] ? n = new Date(Date.UTC(t[1], t[2], t[3], t[4], t[5], t[6])) : n = new Date(t[1], t[2], t[3], t[4], t[5], t[6])
    } else typeof e == "number" ? (n = new Date, n.setTime(e)) : e.match(/\d+ \d+:\d+:\d+ [+-]\d+ \d+/) ? (n = new Date, n.setTime(Date.parse(e))) : (n = new Date, n.setTime(Date.parse(e)));
    return n
}, I18n.toTime = function(e, t) {
    var n = this.parseDate(t),
        r = this.lookup(e);
    return n.toString().match(/invalid/i) ? n.toString() : r ? this.strftime(n, r) : n.toString()
}, I18n.strftime = function(e, t) {
    var n = this.lookup("date");
    if (!n) return e.toString();
    n.meridian = n.meridian || ["AM", "PM"];
    var r = e.getDay(),
        i = e.getDate(),
        s = e.getFullYear(),
        o = e.getMonth() + 1,
        u = e.getHours(),
        a = u,
        f = u > 11 ? 1 : 0,
        l = e.getSeconds(),
        c = e.getMinutes(),
        h = e.getTimezoneOffset(),
        p = Math.floor(Math.abs(h / 60)),
        d = Math.abs(h) - p * 60,
        v = (h > 0 ? "-" : "+") + (p.toString().length < 2 ? "0" + p : p) + (d.toString().length < 2 ? "0" + d : d);
    a > 12 ? a -= 12 : a === 0 && (a = 12);
    var m = function(e) {
            var t = "0" + e.toString();
            return t.substr(t.length - 2)
        },
        g = t;
    return g = g.replace("%a", n.abbr_day_names[r]), g = g.replace("%A", n.day_names[r]), g = g.replace("%b", n.abbr_month_names[o]), g = g.replace("%B", n.month_names[o]), g = g.replace("%d", m(i)), g = g.replace("%e", i), g = g.replace("%-d", i), g = g.replace("%H", m(u)), g = g.replace("%-H", u), g = g.replace("%I", m(a)), g = g.replace("%-I", a), g = g.replace("%m", m(o)), g = g.replace("%-m", o), g = g.replace("%M", m(c)), g = g.replace("%-M", c), g = g.replace("%p", n.meridian[f]), g = g.replace("%S", m(l)), g = g.replace("%-S", l), g = g.replace("%w", r), g = g.replace("%y", m(s)), g = g.replace("%-y", m(s).replace(/^0+/, "")), g = g.replace("%Y", s), g = g.replace("%z", v), g
}, I18n.toNumber = function(e, t) {
    t = this.prepareOptions(t, this.lookup("number.format"), {
        precision: 3,
        separator: ".",
        delimiter: ",",
        strip_insignificant_zeros: !1
    });
    var n = e < 0,
        r = Math.abs(e).toFixed(t.precision).toString(),
        i = r.split("."),
        s, o = [],
        u;
    e = i[0], s = i[1];
    while (e.length > 0) o.unshift(e.substr(Math.max(0, e.length - 3), 3)), e = e.substr(0, e.length - 3);
    u = o.join(t.delimiter), t.precision > 0 && (u += t.separator + i[1]), n && (u = "-" + u);
    if (t.strip_insignificant_zeros) {
        var a = {
            separator: new RegExp(t.separator.replace(/\./, "\\.") + "$"),
            zeros: /0+$/
        };
        u = u.replace(a.zeros, "").replace(a.separator, "")
    }
    return u
}, I18n.toCurrency = function(e, t) {
    return t = this.prepareOptions(t, this.lookup("number.currency.format"), this.lookup("number.format"), {
        unit: "$",
        precision: 2,
        format: "%u%n",
        delimiter: ",",
        separator: "."
    }), e = this.toNumber(e, t), e = t.format.replace("%u", t.unit).replace("%n", e), e
}, I18n.toHumanSize = function(e, t) {
    var n = 1024,
        r = e,
        i = 0,
        s, o;
    while (r >= n && i < 4) r /= n, i += 1;
    return i === 0 ? (s = this.t("number.human.storage_units.units.byte", {
        count: r
    }), o = 0) : (s = this.t("number.human.storage_units.units." + [null, "kb", "mb", "gb", "tb"][i]), o = r - Math.floor(r) === 0 ? 0 : 1), t = this.prepareOptions(t, {
        precision: o,
        format: "%n%u",
        delimiter: ""
    }), e = this.toNumber(r, t), e = t.format.replace("%u", s).replace("%n", e), e
}, I18n.toPercentage = function(e, t) {
    return t = this.prepareOptions(t, this.lookup("number.percentage.format"), this.lookup("number.format"), {
        precision: 3,
        separator: ".",
        delimiter: ""
    }), e = this.toNumber(e, t), e + "%"
}, I18n.pluralizer = function(e) {
    return pluralizer = this.pluralizationRules[e], pluralizer !== undefined ? pluralizer : this.pluralizationRules.en
}, I18n.findAndTranslateValidNode = function(e, t) {
    for (i = 0; i < e.length; i++) {
        key = e[i];
        if (this.isValidNode(t, key)) return t[key]
    }
    return null
}, I18n.pluralize = function(e, t, n) {
    var r;
    try {
        r = this.lookup(t, n)
    } catch (i) {}
    if (!r) return this.missingTranslation(t);
    var s;
    return n = this.prepareOptions(n), n.count = e.toString(), pluralizer = this.pluralizer(this.currentLocale()), key = pluralizer(Math.abs(e)), keys = typeof key == "object" && key instanceof Array ? key : [key], s = this.findAndTranslateValidNode(keys, r), s == null && (s = this.missingTranslation(t, keys[0])), this.interpolate(s, n)
}, I18n.missingTranslation = function() {
    var e = '[missing "' + this.currentLocale(),
        t = arguments.length;
    for (var n = 0; n < t; n++) e += "." + arguments[n];
    return e += '" translation]', e
}, I18n.currentLocale = function() {
    return I18n.locale || I18n.defaultLocale
}, I18n.t = I18n.translate, I18n.l = I18n.localize, I18n.p = I18n.pluralize;
var I18n = I18n || {};
I18n.translations = {
        en: {
            invite: {
                close: "Close",
                invite: "Invite",
                message: "Do you know %{project_name}? Join and play with me!",
                title: "Invite your friends!"
            },
            activemodel: {
                attributes: {
                    game_launcher: {
                        external_id: "External id",
                        project: "Game",
                        token: "Token",
                        user: "User id"
                    }
                },
                errors: {
                    models: {
                        game_launcher: {
                            attributes: {
                                external_id: {
                                    blank: "Counld not retreive external user id"
                                },
                                project: {
                                    blank: "Game not found"
                                },
                                token: {
                                    blank: "Failed to generate session token"
                                },
                                user: {
                                    blank: "Could not create user"
                                },
                                user_provider_id: {
                                    blank: "Could not generate user provider id"
                                }
                            }
                        }
                    }
                }
            },
            js: {
                adblocker: {
                    footer: "Please disable your ad-blocker for us, and yourself :).",
                    hello: "Thank you for playing games on our portal.",
                    info: "We noticed you have an ad-blocker enabled, we completely understand that you dislike advertising. Please understand that advertisements are our only source of revenue, we need this to provide you with better and cooler games, for free!"
                },
                advertisement: "Advertisement",
                back_to_game: "Go back to the game",
                best: "best",
                "continue": "Continue",
                exit_game: "Exit Game",
                free: "Free",
                game_description: "Game description",
                game_is_already_rated: "Game is already rated",
                imprint: "Imprint",
                initializing_the_payment: "Initializing the payment",
                "more-games": "More games",
                operamini: {
                    info: "You are using Opera Mini browser at the moment. Opera Mini does not support HTML5 games, but your phone does. Please open this game with one of the browsers below."
                },
                payment_not_open: "Click here to open payment window",
                payment_started: "Payment started",
                play: "Play",
                play_again: "play again",
                play_complete_win: "Play-Complete-Win:",
                play_game_through_widget: "To play this and other games, click below",
                play_more: "play more",
                play_now: "Play now!",
                play_now_clean: "Play now",
                play_to_win: "Play to win:",
                play_widget_games: "To play an awesome game Click below",
                play_win: "Play - Win:",
                points_in: "points in",
                promo_text: "Welcome to the world's largest HTML5 games platform! Whether you want to tease your brain with entertaining puzzle games, try a skill game or if you're after some thrilling action, you will make a find within more than 250 high quality games like Flappy Bird, Monster Hunter or Candy Rain. HTML5 means instant access! No downloads and no installs, no costs. Play and share the games you love across all platforms! Our games are built and tested to be fun no matter if you're playing on your phone, a tablet or on your desktop computer. Join the largest HTML5 gaming platform today!",
                ranking: "ranking",
                recently_played: "Recently played",
                return_to_homepage_to_play_more_free_online_games: "Return to homepage to play more free online games!",
                score: "score",
                share: "Share",
                show_all: "show all",
                show_less: "show less",
                similar_games: "Similar games",
                skip: "Skip",
                sponsored_link: "Sponsored Link:",
                start: "Start",
                terms: "Terms",
                thank_you_for_your_vote: "Thank you for your vote!",
                vote: "Vote"
            }
        },
        de: {
            invite: {
                close: "Close",
                invite: "Invite",
                message: "Do you know %{project_name}? Join and play with me!",
                title: "Invite your friends!"
            },
            activemodel: {
                attributes: {
                    game_launcher: {
                        external_id: "External id",
                        project: "Game",
                        token: "Token",
                        user: "User id"
                    }
                },
                errors: {
                    models: {
                        game_launcher: {
                            attributes: {
                                external_id: {
                                    blank: "Counld not retreive external user id"
                                },
                                project: {
                                    blank: "Game not found"
                                },
                                token: {
                                    blank: "Failed to generate session token"
                                },
                                user: {
                                    blank: "Could not create user"
                                },
                                user_provider_id: {
                                    blank: "Could not generate user provider id"
                                }
                            }
                        }
                    }
                }
            },
            js: {
                adblocker: {
                    footer: null,
                    hello: null,
                    info: null
                },
                advertisement: null,
                back_to_game: "Go back to the game",
                best: null,
                "continue": null,
                exit_game: "Exit Game",
                free: "Frei",
                game_description: "Game description",
                game_is_already_rated: null,
                imprint: "Imprint",
                initializing_the_payment: "Initializing the payment",
                "more-games": null,
                operamini: {
                    info: null
                },
                payment_not_open: "Click here to open payment window",
                payment_started: "Payment started",
                play: "Spielen",
                play_again: null,
                play_complete_win: null,
                play_game_through_widget: null,
                play_more: null,
                play_now: "Jetzt spielen",
                play_now_clean: null,
                play_to_win: null,
                play_widget_games: "Um dieses super Spiel zu starten, klicke bitte unten!",
                play_win: null,
                points_in: null,
                promo_text: "Willkommen auf der weltgrößten HTML5 Spieleplattform! Ganz egal, ob Du Dein Gehirn mit unterhaltsamen Denkspielen trainieren willst, ob Du Dein Glück bei einem Geschicklichkeitsspiel versuchen möchtest oder ob Du packende Action suchst, in 250 tollen Spielen, wie Flappy Bird, Monster Hunter oder Candy Rain wirst Du auf jeden Fall fündig werden. HTML5 bedeutet sofortigen Spielspaß! Keine Downloads, keine Installation, keine Kosten. Spiele und teile die Spiele, die Du liebst auf allen Plattformen. Unsere Spiele wurden speziell dafür entwickelt und getestet, sowohl auf dem Handy, als auch auf Tablets und am Desktop perfekt zu funktionieren und einfach überall Spaß zu machen!",
                ranking: null,
                recently_played: null,
                return_to_homepage_to_play_more_free_online_games: "Return to homepage to play more free online games!",
                score: null,
                share: null,
                show_all: null,
                show_less: null,
                similar_games: null,
                skip: "Skip",
                sponsored_link: null,
                start: "Start",
                terms: "Terms",
                thank_you_for_your_vote: null,
                vote: null
            }
        },
        pl: {
            invite: {
                close: "Close",
                invite: "Invite",
                message: "Do you know %{project_name}? Join and play with me!",
                title: "Invite your friends!"
            },
            activemodel: {
                attributes: {
                    game_launcher: {
                        external_id: "External id",
                        project: "Game",
                        token: "Token",
                        user: "User id"
                    }
                },
                errors: {
                    models: {
                        game_launcher: {
                            attributes: {
                                external_id: {
                                    blank: "Counld not retreive external user id"
                                },
                                project: {
                                    blank: "Game not found"
                                },
                                token: {
                                    blank: "Failed to generate session token"
                                },
                                user: {
                                    blank: "Could not create user"
                                },
                                user_provider_id: {
                                    blank: "Could not generate user provider id"
                                }
                            }
                        }
                    }
                }
            },
            js: {
                adblocker: {
                    footer: null,
                    hello: null,
                    info: null
                },
                advertisement: null,
                back_to_game: "Wróć do gry",
                best: null,
                "continue": null,
                exit_game: "Wyjdź",
                free: null,
                game_description: "Szczegóły",
                game_is_already_rated: null,
                imprint: "Imprint",
                initializing_the_payment: "Initializing the payment",
                "more-games": null,
                operamini: {
                    info: null
                },
                payment_not_open: "Click here to open payment window",
                payment_started: "Payment started",
                play: "Zagraj",
                play_again: null,
                play_complete_win: null,
                play_game_through_widget: null,
                play_more: null,
                play_now: "Zagraj teraz!",
                play_now_clean: null,
                play_to_win: null,
                play_widget_games: "Kliknij ponżej aby zagrać w inne super gry",
                play_win: null,
                points_in: null,
                promo_text: null,
                ranking: null,
                recently_played: null,
                return_to_homepage_to_play_more_free_online_games: "Return to homepage to play more free online games!",
                score: null,
                share: null,
                show_all: null,
                show_less: null,
                similar_games: null,
                skip: "Pomiń",
                sponsored_link: null,
                start: "Start",
                terms: "Terms",
                thank_you_for_your_vote: null,
                vote: null
            }
        },
        it: {
            invite: {
                close: "Close",
                invite: "Invite",
                message: "Do you know %{project_name}? Join and play with me!",
                title: "Invite your friends!"
            },
            activemodel: {
                attributes: {
                    game_launcher: {
                        external_id: "External id",
                        project: "Game",
                        token: "Token",
                        user: "User id"
                    }
                },
                errors: {
                    models: {
                        game_launcher: {
                            attributes: {
                                external_id: {
                                    blank: "Counld not retreive external user id"
                                },
                                project: {
                                    blank: "Game not found"
                                },
                                token: {
                                    blank: "Failed to generate session token"
                                },
                                user: {
                                    blank: "Could not create user"
                                },
                                user_provider_id: {
                                    blank: "Could not generate user provider id"
                                }
                            }
                        }
                    }
                }
            },
            js: {
                adblocker: {
                    footer: null,
                    hello: null,
                    info: null
                },
                advertisement: "Advertisement",
                back_to_game: "Go back to the game",
                best: "best",
                "continue": "Continue",
                exit_game: "Exit Game",
                free: "Free",
                game_description: "Game description",
                game_is_already_rated: "Game is already rated",
                imprint: "Imprint",
                initializing_the_payment: "Initializing the payment",
                "more-games": "More games",
                operamini: {
                    info: "You are using Opera Mini browser at the moment. Opera Mini does not support HTML5 games, but your phone does. Please open this game with one of the browsers below."
                },
                payment_not_open: "Click here to open payment window",
                payment_started: "Payment started",
                play: "GIOCA",
                play_again: "play again",
                play_complete_win: null,
                play_game_through_widget: null,
                play_more: "play more",
                play_now: "Play now!",
                play_now_clean: null,
                play_to_win: null,
                play_widget_games: null,
                play_win: null,
                points_in: "points in",
                promo_text: null,
                ranking: "ranking",
                recently_played: "Recently played",
                return_to_homepage_to_play_more_free_online_games: "Return to homepage to play more free online games!",
                score: "score",
                share: "Share",
                show_all: null,
                show_less: null,
                similar_games: "Similar games",
                skip: "Skip",
                sponsored_link: null,
                start: "Start",
                terms: "Terms",
                thank_you_for_your_vote: "Thank you for your vote!",
                vote: "Vote"
            }
        },
        tr: {
            invite: {
                close: "Close",
                invite: "Invite",
                message: "Do you know %{project_name}? Join and play with me!",
                title: "Invite your friends!"
            },
            activemodel: {
                attributes: {
                    game_launcher: {
                        external_id: "External id",
                        project: "Game",
                        token: "Token",
                        user: "User id"
                    }
                },
                errors: {
                    models: {
                        game_launcher: {
                            attributes: {
                                external_id: {
                                    blank: "Counld not retreive external user id"
                                },
                                project: {
                                    blank: "Game not found"
                                },
                                token: {
                                    blank: "Failed to generate session token"
                                },
                                user: {
                                    blank: "Could not create user"
                                },
                                user_provider_id: {
                                    blank: "Could not generate user provider id"
                                }
                            }
                        }
                    }
                }
            },
            js: {
                adblocker: {
                    footer: null,
                    hello: null,
                    info: null
                },
                advertisement: null,
                back_to_game: "Go back to the game",
                best: null,
                "continue": null,
                exit_game: "Exit Game",
                free: null,
                game_description: "Oyun Açıklaması",
                game_is_already_rated: null,
                imprint: "Imprint",
                initializing_the_payment: "Initializing the payment",
                "more-games": null,
                operamini: {
                    info: null
                },
                payment_not_open: "Click here to open payment window",
                payment_started: "Payment started",
                play: null,
                play_again: null,
                play_complete_win: null,
                play_game_through_widget: null,
                play_more: null,
                play_now: "Play now!",
                play_now_clean: null,
                play_to_win: null,
                play_widget_games: null,
                play_win: null,
                points_in: null,
                promo_text: null,
                ranking: null,
                recently_played: null,
                return_to_homepage_to_play_more_free_online_games: "Return to homepage to play more free online games!",
                score: null,
                share: null,
                show_all: null,
                show_less: null,
                similar_games: null,
                skip: "reklamı geç",
                sponsored_link: null,
                start: "Başla",
                terms: "Terms",
                thank_you_for_your_vote: null,
                vote: null
            }
        },
        pt: {
            invite: {
                close: "Close",
                invite: "Invite",
                message: "Do you know %{project_name}? Join and play with me!",
                title: "Invite your friends!"
            },
            activemodel: {
                attributes: {
                    game_launcher: {
                        external_id: "External id",
                        project: "Game",
                        token: "Token",
                        user: "User id"
                    }
                },
                errors: {
                    models: {
                        game_launcher: {
                            attributes: {
                                external_id: {
                                    blank: "Counld not retreive external user id"
                                },
                                project: {
                                    blank: "Game not found"
                                },
                                token: {
                                    blank: "Failed to generate session token"
                                },
                                user: {
                                    blank: "Could not create user"
                                },
                                user_provider_id: {
                                    blank: "Could not generate user provider id"
                                }
                            }
                        }
                    }
                }
            },
            js: {
                adblocker: {
                    footer: null,
                    hello: null,
                    info: null
                },
                advertisement: "Advertisement",
                back_to_game: "Go back to the game",
                best: "best",
                "continue": "Continue",
                exit_game: "Exit Game",
                free: "Free",
                game_description: "Game description",
                game_is_already_rated: "Game is already rated",
                imprint: "Imprint",
                initializing_the_payment: "Initializing the payment",
                "more-games": "More games",
                operamini: {
                    info: "You are using Opera Mini browser at the moment. Opera Mini does not support HTML5 games, but your phone does. Please open this game with one of the browsers below."
                },
                payment_not_open: "Click here to open payment window",
                payment_started: "Payment started",
                play: "Jogar",
                play_again: "play again",
                play_complete_win: null,
                play_game_through_widget: null,
                play_more: "play more",
                play_now: "Play now!",
                play_now_clean: null,
                play_to_win: null,
                play_widget_games: null,
                play_win: null,
                points_in: "points in",
                promo_text: null,
                ranking: "ranking",
                recently_played: "Recently played",
                return_to_homepage_to_play_more_free_online_games: "Return to homepage to play more free online games!",
                score: "score",
                share: "Share",
                show_all: null,
                show_less: null,
                similar_games: "Similar games",
                skip: "Skip",
                sponsored_link: null,
                start: "Start",
                terms: "Terms",
                thank_you_for_your_vote: "Thank you for your vote!",
                vote: "Vote"
            }
        }
    },
    function() {
        Softgames.prototype._randomId = function() {
            return Math.floor(Math.random() * 1e8)
        }, Softgames.prototype._isiPhone = function() {
            return navigator.userAgent.match(/(iPhone)/g)
        }, Softgames.prototype._isOperamini = function() {
            return navigator.userAgent.indexOf("Opera Mini") > -1
        }, Softgames.prototype._urlWithoutQueryString = function(e) {
            return e.substring(0, e.indexOf("?"))
        }, Softgames.prototype._isMobile = function() {
            var e;
            return e = navigator.userAgent || navigator.vendor || window.opera, /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(e) ? !0 : !1
        }, Softgames.prototype._inIframe = function() {
            try {
                return window.self !== window.top
            } catch (e) {
                return !0
            }
        }
    }.call(this),
    function() {
        window.SoftgamesVoyagerLogger = function() {
            function e() {
                this.enabledDebugLog = this._getUrlParameters().voyager_debug === "1"
            }
            return e.prototype.log = function(e) {
                var t, n, r, i;
                if (!this.enabledDebugLog) return null;
                r = -1, i = arguments.length, t = [], n = "console.log(args)";
                while (++r < i) t.push("args[" + r + "]");
                return n = new Function("args", n.replace(/args/, t.join(","))), n(arguments)
            }, e.prototype.enableDebugLog = function() {
                return this.enabledDebugLog = !0
            }, e.prototype.displayDebubLog = function() {
                return this.enabledDebugLog = !1
            }, e.prototype._getUrlParameters = function() {
                var e = this;
                return this._urlParameters === void 0 && (this._urlParameters = {}, this._location().replace(/[?&]+([^=&]+)=([^&]*)/gi, function(t, n, r) {
                    return e._urlParameters[n] = r
                })), this._urlParameters
            }, e.prototype._getUrlParameter = function(e) {
                var t;
                return t = this._getUrlParameters(), t[e]
            }, e.prototype._location = function() {
                return window.location.href
            }, e
        }()
    }.call(this),
    function() {
        Softgames.prototype.Experiments = ["ADFIRST_TRUE", "ADFIRST_FALSE"], Softgames.prototype.selectedExperiment = 0, Softgames.prototype.selectedExperimentName = function() {
            return this.Experiments[this.selectedExperiment].toUpperCase()
        }, Softgames.prototype.selectExperiment = function() {
            return this.selectedExperiment = Math.floor(Math.random() * this.Experiments.length)
        }
    }.call(this),
    function() {
        Softgames.prototype.bannerIdIngameAdPopup = 296, Softgames.prototype.bannerIdGameDetailsPage = 380, Softgames.prototype.bannerIdMoreGamesPage = 381, Softgames.prototype.bannerIdPrerollAdPopup = 382, Softgames.prototype.bannerIdOnCloseEndLevelAdPopup = 383, Softgames.prototype.adRefreshCount = -1, Softgames.prototype.pageGameDetails = "page_game-details", Softgames.prototype.pageGamePageTop = "page_game-page-top", Softgames.prototype.pageGamePageBottom = "page_game-page-bottom", Softgames.prototype.pageMoreGames = "page_more-games", Softgames.prototype.popupPreroll = "popup_preroll", Softgames.prototype.popupIngame = "popup_ingame", Softgames.prototype.popupIncentivise = "popup_incentivise", Softgames.prototype.conversionTriggered = !1, Softgames.prototype.conversionFlowAdsAmout = "ads-amount", Softgames.prototype.conversionFlowLevel = "level", Softgames.prototype.conversionFlowLevelPlus = "level+", Softgames.prototype.adPopups = [Softgames.prototype.popupPreroll, Softgames.prototype.popupIngame], Softgames.prototype.c3poAdTypeAdsenseContent = "adsense_content", Softgames.prototype.c3poAdTypeAdsenseGames = "adsense_games", Softgames.prototype.c3poAdTypeAdxContent = "adx_content", Softgames.prototype.c3poAdTypeAdxGames = "adx_games", Softgames.prototype.c3poAdTypeDirectVast = "direct_vast", Softgames.prototype.c3poAdTypeDfpBanner = "dfp_banner", Softgames.prototype.c3poAdTypeDfpVideo = "dfp_video", Softgames.prototype.c3poAdTypeLiverail = "liverail", Softgames.prototype.c3poAdTypeSmartclip = "smartclip", Softgames.prototype.oldAdsConfigurations = {}, Softgames.prototype._showAd = function(e, t, n, r) {
            var i, s, o = this;
            return i = function(e) {
                return o.events.fire("unpause-game"), o.events.fire("voyagerAdFinished"), typeof n == "function" ? n(e) : void 0
            }, this.events.fire("pause-game"), this.events.fire("voyagerAdCall"), this.displayBannerLastTime = SG_jQuery.now(), (r || r === void 0) && this.adRefreshCount++, this.displayWrapperAd === !0 ? this._onShowAd(i) : (this._triggerConversion(this.conversionFlowAdsAmout, this.adRefreshCount), this.adsHandler && this.adsHandler.isInitiated() ? this.adsHandler.showAd(e, this._adContentId(t), this._getVoyagerAdConfig(), i) : (s = this._adSettings(e, t, i), this.ad_close_callback = null, this.ad_place = null, this.oldAdsConfigurations[e].type === "openx" ? (this.ad_close_callback = i, this.ad_place = e, this._openxAd(t, s)) : this._c3poAd(s)))
        }, Softgames.prototype._showOpenXC3poAd = function(e) {
            var t, n;
            this.displayBannerLastTime = SG_jQuery.now(), n = this._adSettings(this.ad_place, this.adId, this.ad_close_callback);
            for (t in e) n[t] = e[t];
            return this._c3poAd(n)
        }, Softgames.prototype._adContentId = function(e) {
            return "voyager-ad-content_" + e
        }, Softgames.prototype._shortAgentGameName = function(e, t) {
            return ("" + e + "-" + t).replace("affiliate__", "").substring(0, 40)
        }, Softgames.prototype._getVoyagerAdConfig = function() {
            var e, t;
            return t = {
                partner: this.subplatform,
                game: this.game_slug,
                language: this.locale
            }, e = {
                partner: this.subplatform,
                game: this.game_slug,
                affgame: this._shortAgentGameName(this.subplatform, this.game_slug),
                pg: this._getPgIds(),
                "pg-ids": this._getPgIds(),
                "pg-names": this._getPgNames(),
                lang: this.locale,
                referrer: this._urlWithoutQueryString(document.referrer),
                plan: this.agentPlan,
                affiliate: null
            }, this._getUrlParameters().isWidget && (e["widget-pg"] = this._shortAgentGameName(this.subplatform, this.game_slug), e["pg-widget"] = this._getPgIds()), this.subplatform && this.subplatform.indexOf("affiliate__") > -1 && (e.affiliate = this.subplatform), this.enableAbAdFirstGameDpage === !0 && this.enabledExperimentName === "ADFIRST_TRUE" ? e.adfirst = "true" : this.enableAbAdFirstGameDpage === !0 && this.enabledExperimentName === "ADFIRST_FALSE" && (e.adfirst = "false"), this.gameDetailsPageVersion ? e.adfirst = this._getAdFirstByGDPVersion(this.gameDetailsPageVersion) : e.adfirst = "default", t.customParams = e, t.closeButton = document.getElementById("voyager-close-popup-btn"), t
        }, Softgames.prototype._getAdFirstByGDPVersion = function(e) {
            return e.substr(e.indexOf("_") + 1).toUpperCase()
        }, Softgames.prototype._adSettings = function(e, t, n) {
            var r, i;
            return r = this.oldAdsConfigurations[e].params, typeof this[i = "_adSettings_" + this.oldAdsConfigurations[e]["type"]] == "function" && this[i](r), r.ad_container_id = this._adContentId(t), r.partner = this.subplatform, r.game = this.game_slug, r.language = this.locale, r.ad_type = this.oldAdsConfigurations[e].type, r.skipPlayButton = this.oldAdsConfigurations.skipPlayButton, r.custom_params = {
                partner: this.subplatform,
                game: this.game_slug,
                affgame: this._shortAgentGameName(this.subplatform, this.game_slug),
                pg: this._getPgIds(),
                lang: this.locale,
                plan: this.agentPlan,
                "pg-ids": this._getPgIds(),
                "pg-names": this._getPgNames()
            }, this._getUrlParameters().isWidget && (customParams["widget-pg"] = this._shortAgentGameName(this.subplatform, this.game_slug), customParams["pg-widget"] = this._getPgIds()), this.enableAbAdFirstGameDpage === !0 && this.enabledExperimentName === "ADFIRST_TRUE" ? r.custom_params.adfirst = "true" : this.enableAbAdFirstGameDpage === !0 && this.enabledExperimentName === "ADFIRST_FALSE" && (r.custom_params.adfirst = "false"), this.subplatform && this.subplatform.indexOf("affiliate__") > -1 ? r.custom_params.affiliate = this.subplatform : r.custom_params.affiliate = null, r.custom_params.referrer = this._urlWithoutQueryString(document.referrer), this._isPlaceWithCloseButton(e) && (r.close_button = document.getElementById("voyager-close-popup-btn")), r.close_ad_callback = n, this._isPlaceWithCloseButton(e) && (r.display_close_button = this.adCloseButton), r.refreshcount = this.adRefreshCount, r.conversion = this.adConversionBanner, r
        }, Softgames.prototype._getPgIds = function() {
            return (this.aid + "_" + this.gid).substring(0, 40)
        }, Softgames.prototype._getPgNames = function() {
            return (this.subplatform + "_" + this.game_slug).substring(0, 40)
        }, Softgames.prototype._adSettings_openx = function(e) {
            return e.channel_id = this.ChannelId, e.tv_channel_id = this.ChannelTvId, e
        }, Softgames.prototype._openxAd = function(e, t) {
            var n = this;
            return this._getBanner(function(t, r) {
                return n.adContainer = SG_jQuery("#" + n._adContentId(e)), n.adContainer.append(t)
            }, {
                channel_id: t.channel_id,
                tv_channel_id: t.tv_channel_id,
                refreshcount: t.refreshcount,
                conversion: t.conversion
            })
        }, Softgames.prototype._c3poAd = function(e) {
            return c3po.showAd(e)
        }, Softgames.prototype._isPlaceWithCloseButton = function(e) {
            return this.adPopups.indexOf(e) >= 0
        }, Softgames.prototype._triggerConversion = function(e, t) {
            this._getConversionLogger().debug("Conversion?", {
                flow: e,
                value: t,
                adsConversionFlow: this.adsConversionFlow,
                level: this.adsConversionLevel
            });
            if (this.conversionTriggered === !1) switch (e) {
                case this.conversionFlowAdsAmout:
                    if (this.adsConversionFlow === this.conversionFlowAdsAmout || this.adsConversionFlow === void 0) return this._triggerConversionAdsAmount(t);
                    break;
                case this.conversionFlowLevel:
                    if (this.adsConversionFlow === this.conversionFlowLevel) return this._triggerConversionLevel(t);
                    break;
                case this.conversionFlowLevelPlus:
                    if (this.adsConversionFlow === this.conversionFlowLevelPlus) return this._triggerConversionLevelPlus(t)
            }
        }, Softgames.prototype._triggerConversionAdsAmount = function(e) {
            this.adsConversionPoints === e && (this.adConversionBanner = !0);
            if (this.adConversionBanner) return this._trackConversion()
        }, Softgames.prototype._triggerConversionLevel = function(e) {
            if (e === this.adsConversionLevel) return this._trackConversion()
        }, Softgames.prototype._triggerConversionLevelPlus = function(e) {
            if (e - this.lastUserSessionLevel === this.adsConversionLevel && this.lastUserSessionLevel !== 0) return this._trackConversion()
        }, Softgames.prototype._trackConversion = function() {
            var e, t = this;
            return e = function() {
                var e;
                return t.triggerConversionCustomCallback === !0 ? t._onTriggerConversion() : (e = "http://tracking.softgames.de/aff_l?offer_ref=" + t.game_slug + t.conversionGamePostfix + "&adv_sub=" + t.adsConversionUserState, t._cleanupConverionPointTracker(), t._createConverionPointTracker(e), t.conversionTriggered = !0)
            }, this._getConversionLogger().debug("Game config", {
                gameConfig: this.game_config
            }), this.game_config ? this.conversionPopup.showPopup(e) : e()
        }, Softgames.prototype._getConversionLogger = function() {
            return this.conversionLogger || (this.conversionLogger = new SoftgamesLogger("ConversionLogger")), this.conversionLogger
        }, Softgames.prototype._createConverionPointTracker = function(e) {
            var t;
            return this.logger.log("Conversion tracking"), t = SG_jQuery(document.createElement("iframe")), t.attr("src", e), t.attr("id", "voyager_conversion_point_tracker"), t.attr("width", "1px"), t.attr("height", "1px"), t.attr("scrolling", "no"), t.attr("frameborder", "0"), t.css({
                display: "none"
            }), SG_jQuery("body").append(t)
        }, Softgames.prototype._cleanupConverionPointTracker = function() {
            var e;
            e = SG_jQuery("#voyager_conversion_point_tracker");
            if (e.length) return e.remove()
        }, Softgames.prototype._positionAdOnGameDetailsPage = function() {
            var e;
            return e = parseInt(SG_jQuery(document).height() * 70 / 100) - SG_jQuery("#voyager-page-header").height() - SG_jQuery("#voyager-game-container-1").height() - Math.round(parseFloat(SG_jQuery("#voyager-page-section-1").css("padding-top"))), e > SG_jQuery("#voyager-game-container-2").height() ? this._moveTextAboveAd(e) : this._moveTextBelowAd(e)
        }, Softgames.prototype._moveTextAboveAd = function(e) {
            var t, n;
            SG_jQuery("#voyager-game-container-2").text(SG_jQuery("#voyager-game-container-2").text().replace("...", "")), n = SG_jQuery("#voyager-game-container-3").text().split(" "), t = 0;
            while (e > SG_jQuery("#voyager-game-container-2").height() && n.length > t) n[t] !== " " && n[t].indexOf("...") < 0 && SG_jQuery("#voyager-game-container-2").append(" " + n[t]), t++;
            return n.length > t && SG_jQuery("#voyager-game-container-2").append("..."), SG_jQuery("#voyager-game-container-3").text("..."), SG_jQuery("#voyager-game-container-3").append(n.slice(t).join(" "))
        }, Softgames.prototype._moveTextBelowAd = function(e) {
            var t, n;
            SG_jQuery("#voyager-game-container-2").text(SG_jQuery("#voyager-game-container-2").text().replace("...", "")), n = SG_jQuery("#voyager-game-container-2").text().split(" "), t = n.length - 1;
            while (e < SG_jQuery("#voyager-game-container-2").height() && t >= 0) n[t] !== " " && n[t].indexOf("...") < 0 && SG_jQuery("#voyager-game-container-2").text("" + n.slice(0, t).join(" ") + "..."), t--;
            return SG_jQuery("#voyager-game-container-3").text(SG_jQuery("#voyager-game-container-3").text().replace("...", "")), SG_jQuery("#voyager-game-container-3").text("..." + n.slice(t + 1).join(" ") + " " + SG_jQuery("#voyager-game-container-3").text())
        }
    }.call(this),
    function() {
        window.SoftgamesVoyagerTracker = function() {
            function e(e, t) {
                var n, r, i = this;
                this.externalGACode = e, this.gaAnonymizingIp = t, this.messageQueue = [], this.eventQueue = [], this.ready = !1, this.mainNamespace = "softgames", this.logger = new SoftgamesVoyagerLogger, this.trackers = [this.mainNamespace], this.externalGACode !== undefined && this.externalGACode !== "" && this.trackers.push("external"), window._gaq = window._gaq || [], this._pushGA("_setAccount", "UA-33273423-1", this.mainNamespace), this.externalGACode !== undefined && this.externalGACode !== "" && this._pushGA("_setAccount", this.externalGACode, "external"), this.gaAnonymizingIp === !0 && this._pushGA("_gat._anonymizeIp", "undefined", "_gat"), n = document.createElement("script"), n.type = "text/javascript", n.async = !0, n.onload = function() {
                    return i.ready = !0, i._sendMessageQueue(), i._sendEventQueue()
                }, n.src = ("https:" === document.location.protocol ? "." : ".") + "/dc.js", r = document.getElementsByTagName("script")[0], r.parentNode.insertBefore(n, r)
            }
            return e.prototype.trackPageview = function(e, t, n, r, i, s) {
                return this.data = {
                    action: "_trackPageview",
                    params: e,
                    custom: {
                        subplatform: t,
                        affiliate: n,
                        installation_date: r,
                        "undefined": i,
                        gender: s
                    }
                }, this.ready ? this._postMessage(this.data) : this.messageQueue.push(this.data)
            }, e.prototype.trackEvent = function(e, t, n, r) {
                return this.data = {
                    category: e,
                    action: t,
                    opt_label: n,
                    opt_value: r
                }, this.ready ? this._postEvent(this.data) : this.eventQueue.push(this.data)
            }, e.prototype._postMessage = function(e) {
                var t, n, r, i, s, o;
                try {
                    this.logger.log("Track:", JSON.stringify(e)), t = e.action, o = e.params, n = e.custom, r = 1;
                    for (s in n) window._gaq.push(["_setCustomVar", r, s, n[s], 1]), r++;
                    return o !== undefined && (i = o), this._pushGA(t, i)
                } catch (u) {
                    return this.logger.log(u)
                }
            }, e.prototype._postEvent = function(e) {
                try {
                    return this.logger.log("Track event:", JSON.stringify(e)), window._gaq.push(["_trackEvent", e.category, e.action, e.opt_label])
                } catch (t) {
                    return this.logger.log(t)
                }
            }, e.prototype._sendMessageQueue = function() {
                var e, t, n, r;
                r = this.messageQueue;
                for (t = 0, n = r.length; t < n; t++) e = r[t], this._postMessage(e);
                return this.messageQueue = []
            }, e.prototype._sendEventQueue = function() {
                var e, t, n, r;
                r = this.eventQueue;
                for (t = 0, n = r.length; t < n; t++) e = r[t], this._postEvent(e);
                return this.eventQueue = []
            }, e.prototype._pushGA = function(e, t, n) {
                var r, i;
                if (n !== undefined) return this._pushSimpleGA(e, t, n);
                r = 0, i = [];
                while (r < this.trackers.length) this._pushSimpleGA(e, t, this.trackers[r]), i.push(r++);
                return i
            }, e.prototype._pushSimpleGA = function(e, t, n) {
                var r;
                return r = e, t === "undefined" && n === "_gat" ? window._gaq.push(["" + r]) : (n !== this.mainNamespace && (r = n + "." + e), window._gaq.push([r, t]))
            }, e
        }()
    }.call(this),
    function() {
        Softgames.prototype.eventStartingGame = "starting-game", Softgames.prototype.eventLevelStarted = "level-started", Softgames.prototype.eventLevelFinished = "level-finished", Softgames.prototype.eventLevelUp = "level-up", Softgames.prototype.eventGameOver = "game-over", Softgames.prototype.eventGameCompleted = "game-completed", Softgames.prototype.eventGamePause = "game-pause", Softgames.prototype.eventGameRestart = "game-restart", Softgames.prototype.eventSelectLevel = "select-level", Softgames.prototype.eventGoto = "goto", Softgames.prototype.eventSound = "sound", Softgames.prototype.eventIncentiviseTriggered = "incentivise-triggered", Softgames.prototype._level2number = function(e) {
            var t;
            return t = parseInt(e), t === void 0 ? void 0 : t < 0 ? void 0 : isNaN(t) ? void 0 : t.toString().length !== e.toString().length ? void 0 : t
        }, Softgames.prototype.trigger = function(e, t) {
            var n, r, i, s = this;
            r = null, i = null, n = function() {
                r = "level", i = e.level, e.level !== undefined && e.level > s.lastUserSessionLevel && s._setLastUserSessionLevel(e.level), s.levelUp(e.level), e.level !== undefined && s._triggerConversion("level", e.level), e.level !== undefined && s._triggerConversion("level+", e.level), s._displayAfterFirstLevelAdPopup(function() {
                    return s._enabledEndLevelFlow() ? s._startEndLevelFlow(t) : s.displayBanner(t)
                });
                if (s.gameBubbleConfig.on_level_up) return window.addToHome.show()
            };
            switch (e.type) {
                case this.eventStartingGame:
                    Softgames.prototype.events.fire("scroll-screen");
                    break;
                case this.eventLevelStarted:
                    Softgames.prototype.events && Softgames.prototype.events.fire("levelStarted", {
                        level: e.level
                    });
                    break;
                case this.eventLevelFinished:
                    Softgames.prototype.events && Softgames.prototype.events.fire("levelFinished", {
                        level: e.level,
                        score: e.score
                    });
                    break;
                case this.eventLevelUp:
                    Softgames.prototype.events && Softgames.prototype.events.fire("levelUp", {
                        level: e.level,
                        callback: n
                    }), this.prize_play.isInitiated() || n();
                    break;
                case this.eventGameOver:
                    r = "score", i = e.score, this._displayAfterFirstLevelAdPopup(function() {
                        return s._enabledEndLevelFlow() ? s._startEndLevelFlow(t) : s.displayBanner(t)
                    }), this.gameBubbleConfig.on_game_over && window.addToHome.show();
                    break;
                case this.eventGameCompleted:
                    r = "score", i = e.score;
                    break;
                case this.eventGamePause:
                    r = "state", i = e.state, this.gameBubbleConfig.on_pause_on && e.state === "on" && window.addToHome.show();
                    break;
                case this.eventSelectLevel:
                    r = "level", i = e.level;
                    break;
                case this.eventGoto:
                    r = "view", i = e.view;
                    break;
                case this.eventSound:
                    r = "state", i = e.state;
                    break;
                case this.eventIncentiviseTriggered:
                    this._displayIncentiviseAdPopup(t)
            }
            return this._trackEvent(e.type, r, i)
        }
    }.call(this),
    function() {
        Softgames.prototype.lastUserSessionLevel = void 0, Softgames.prototype.gameLevelCookie = "sg-game-level", Softgames.prototype._setLastUserSessionLevel = function(e) {
            return SG_jQuery.cookie(this.gameLevelCookie, e, {
                expires: 30
            })
        }, Softgames.prototype._loadLastUserSessionLevel = function() {
            try {
                this.lastUserSessionLevel = parseInt(SG_jQuery.cookie(this.gameLevelCookie))
            } catch (e) {
                this.logger.log("Level is not a number: " + e)
            }
            if (this.lastUserSessionLevel === null || isNaN(this.lastUserSessionLevel)) return this.lastUserSessionLevel = 0
        }
    }.call(this),
    function() {
        window.addToHomeConfig = {
            automatic: !1,
            returningVisitor: !1,
            animationIn: "drop",
            animationOut: "fade",
            startDelay: 500,
            lifespan: 5e3,
            bottomOffset: 14,
            expire: 0,
            touchIcon: !1,
            arrow: !0
        }, Softgames.prototype._addToHomeConfig = function() {
            return this._hasAppleIcon() && (window.addToHomeConfig.touchIcon = !0), window.addToHomeConfig.message = "" + this.game_bubble_text, window.addToHome.init()
        }
    }.call(this);
var addToHome = function(e) {
    function w() {
        if (!n) return;
        var a = Date.now(),
            f;
        if (e.addToHomeConfig)
            for (f in e.addToHomeConfig) y[f] = e.addToHomeConfig[f];
        y.autostart || (y.hookOnLoad = !1), r = /ipad/gi.test(t.platform), i = e.devicePixelRatio && e.devicePixelRatio > 1, s = /Safari/i.test(t.appVersion) && !/CriOS/i.test(t.appVersion), o = t.standalone, u = t.appVersion.match(/OS (\d+_\d+)/i), u = u && u[1] ? +u[1].replace("_", ".") : 0, l = +e.localStorage.getItem("addToHome"), h = e.sessionStorage.getItem("addToHomeSession"), p = y.returningVisitor ? l && l + 24192e5 > a : !0, l || (l = a), c = p && l <= a, y.hookOnLoad ? e.addEventListener("load", E, !1) : !y.hookOnLoad && y.autostart && E()
    }

    function E() {
        e.removeEventListener("load", E, !1), p ? y.expire && c && e.localStorage.setItem("addToHome", Date.now() + y.expire * 6e4) : e.localStorage.setItem("addToHome", Date.now());
        if (!v && (!s || !c || h || o || !p)) return;
        var n = "",
            a = t.platform.split(" ")[0],
            f = t.language.replace("-", "_");
        d = document.createElement("div"), d.id = "addToHomeScreen", d.style.cssText += "left:-9999px;-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);position:" + (u < 5 ? "absolute" : "fixed"), y.message in b && (f = y.message, y.message = ""), y.message === "" && (y.message = f in b ? b[f] : b.en_us), y.touchIcon && (n = i ? "http://games.softgames.de/assets/images/touch-icon-iphone-retina.png" : "http://games.softgames.de/assets/images/touch-icon-iphone.png", n ? n = '<span style="background-image:url(' + n + ')" class="addToHomeTouchIcon"></span>' : n = ""), d.className = (u >= 7 ? "addToHomeIOS7 " : "") + (r ? "addToHomeIpad" : "addToHomeIphone") + (n ? " addToHomeWide" : ""), d.innerHTML = n + y.message.replace("%device", a).replace("%icon", u >= 4.2 ? '<span class="addToHomeShare"></span>' : '<span class="addToHomePlus">+</span>') + (y.arrow ? '<span class="addToHomeArrow"' + (u >= 7 && r && n ? ' style="margin-left:-32px"' : "") + "></span>" : "") + (y.closeButton ? '<span class="addToHomeClose">x</span>' : ""), document.body.appendChild(d), y.closeButton && d.addEventListener("click", N, !1), !r && u >= 6 && window.addEventListener("orientationchange", A, !1), setTimeout(S, y.startDelay)
    }

    function S() {
        var t, n = 208;
        if (r) {
            u < 5 ? (f = e.scrollY, a = e.scrollX) : u < 6 ? n = 160 : u >= 7 && (n = 143), d.style.top = f + y.bottomOffset + "px", d.style.left = Math.max(a + n - Math.round(d.offsetWidth / 2), 9) + "px";
            switch (y.animationIn) {
                case "drop":
                    t = "0.6s", d.style.webkitTransform = "translate3d(0," + -(e.scrollY + y.bottomOffset + d.offsetHeight) + "px,0)";
                    break;
                case "bubble":
                    t = "0.6s", d.style.opacity = "0", d.style.webkitTransform = "translate3d(0," + (f + 50) + "px,0)";
                    break;
                default:
                    t = "1s", d.style.opacity = "0"
            }
        } else {
            f = e.innerHeight + e.scrollY, u < 5 ? (a = Math.round((e.innerWidth - d.offsetWidth) / 2) + e.scrollX, d.style.left = a + "px", d.style.top = f - d.offsetHeight - y.bottomOffset + "px") : (d.style.left = "50%", d.style.marginLeft = -Math.round(d.offsetWidth / 2) - (e.orientation % 180 && u >= 6 && u < 7 ? 40 : 0) + "px", d.style.bottom = y.bottomOffset + "px");
            switch (y.animationIn) {
                case "drop":
                    t = "1s", d.style.webkitTransform = "translate3d(0," + -(f + y.bottomOffset) + "px,0)";
                    break;
                case "bubble":
                    t = "0.6s", d.style.webkitTransform = "translate3d(0," + (d.offsetHeight + y.bottomOffset + 50) + "px,0)";
                    break;
                default:
                    t = "1s", d.style.opacity = "0"
            }
        }
        d.offsetHeight, d.style.webkitTransitionDuration = t, d.style.opacity = "1", d.style.webkitTransform = "translate3d(0,0,0)", d.addEventListener("webkitTransitionEnd", C, !1), g = setTimeout(T, y.lifespan)
    }

    function x(e) {
        if (!n || d) return;
        v = e, E()
    }

    function T() {
        clearInterval(m), clearTimeout(g), g = null;
        if (!d) return;
        var t = 0,
            n = 0,
            i = "1",
            s = "0";
        y.closeButton && d.removeEventListener("click", N, !1), !r && u >= 6 && window.removeEventListener("orientationchange", A, !1), u < 5 && (t = r ? e.scrollY - f : e.scrollY + e.innerHeight - f, n = r ? e.scrollX - a : e.scrollX + Math.round((e.innerWidth - d.offsetWidth) / 2) - a), d.style.webkitTransitionProperty = "-webkit-transform,opacity";
        switch (y.animationOut) {
            case "drop":
                r ? (s = "0.4s", i = "0", t += 50) : (s = "0.6s", t += d.offsetHeight + y.bottomOffset + 50);
                break;
            case "bubble":
                r ? (s = "0.8s", t -= d.offsetHeight + y.bottomOffset + 50) : (s = "0.4s", i = "0", t -= 50);
                break;
            default:
                s = "0.8s", i = "0"
        }
        d.addEventListener("webkitTransitionEnd", C, !1), d.style.opacity = i, d.style.webkitTransitionDuration = s, d.style.webkitTransform = "translate3d(" + n + "px," + t + "px,0)"
    }

    function N() {
        e.sessionStorage.setItem("addToHomeSession", "1"), h = !0, T()
    }

    function C() {
        d.removeEventListener("webkitTransitionEnd", C, !1), d.style.webkitTransitionProperty = "-webkit-transform", d.style.webkitTransitionDuration = "0.2s";
        if (!g) {
            d.parentNode.removeChild(d), d = null;
            return
        }
        u < 5 && g && (m = setInterval(k, y.iterations))
    }

    function k() {
        var t = new WebKitCSSMatrix(e.getComputedStyle(d, null).webkitTransform),
            n = r ? e.scrollY - f : e.scrollY + e.innerHeight - f,
            i = r ? e.scrollX - a : e.scrollX + Math.round((e.innerWidth - d.offsetWidth) / 2) - a;
        if (n == t.m42 && i == t.m41) return;
        d.style.webkitTransform = "translate3d(" + i + "px," + n + "px,0)"
    }

    function L() {
        e.localStorage.removeItem("addToHome"), e.sessionStorage.removeItem("addToHomeSession")
    }

    function A() {
        d.style.marginLeft = -Math.round(d.offsetWidth / 2) - (e.orientation % 180 && u >= 6 && u < 7 ? 40 : 0) + "px"
    }
    var t = e.navigator,
        n = "platform" in t && /iphone|ipod|ipad/gi.test(t.platform),
        r, i, s, o, u, a = 0,
        f = 0,
        l = 0,
        c, h, p, d, v, m, g, y = {
            autostart: !0,
            returningVisitor: !1,
            animationIn: "drop",
            animationOut: "fade",
            startDelay: 2e3,
            lifespan: 15e3,
            bottomOffset: 14,
            expire: 0,
            message: "",
            touchIcon: !1,
            arrow: !0,
            hookOnLoad: !0,
            closeButton: !0,
            iterations: 100
        },
        b = {
            ar: '<span dir="rtl">قم بتثبيت هذا التطبيق على <span dir="ltr">%device:</span>انقر<span dir="ltr">%icon</span> ،<strong>ثم اضفه الى الشاشة الرئيسية.</strong></span>',
            ca_es: "Per instal·lar aquesta aplicació al vostre %device premeu %icon i llavors <strong>Afegir a pantalla d'inici</strong>.",
            cs_cz: "Pro instalaci aplikace na Váš %device, stiskněte %icon a v nabídce <strong>Přidat na plochu</strong>.",
            da_dk: "Tilføj denne side til din %device: tryk på %icon og derefter <strong>Føj til hjemmeskærm</strong>.",
            de_de: "Installieren Sie diese App auf Ihrem %device: %icon antippen und dann <strong>Zum Home-Bildschirm</strong>.",
            el_gr: "Εγκαταστήσετε αυτήν την Εφαρμογή στήν συσκευή σας %device: %icon μετά πατάτε <strong>Προσθήκη σε Αφετηρία</strong>.",
            en_us: "Install this web app on your %device: tap %icon and then <strong>Add to Home Screen</strong>.",
            es_es: "Para instalar esta app en su %device, pulse %icon y seleccione <strong>Añadir a pantalla de inicio</strong>.",
            fi_fi: "Asenna tämä web-sovellus laitteeseesi %device: paina %icon ja sen jälkeen valitse <strong>Lisää Koti-valikkoon</strong>.",
            fr_fr: "Ajoutez cette application sur votre %device en cliquant sur %icon, puis <strong>Sur l'écran d'accueil</strong>.",
            he_il: '<span dir="rtl">התקן אפליקציה זו על ה-%device שלך: הקש %icon ואז <strong>הוסף למסך הבית</strong>.</span>',
            hr_hr: "Instaliraj ovu aplikaciju na svoj %device: klikni na %icon i odaberi <strong>Dodaj u početni zaslon</strong>.",
            hu_hu: "Telepítse ezt a web-alkalmazást az Ön %device-jára: nyomjon a %icon-ra majd a <strong>Főképernyőhöz adás</strong> gombra.",
            it_it: "Installa questa applicazione sul tuo %device: premi su %icon e poi <strong>Aggiungi a Home</strong>.",
            ja_jp: "このウェブアプリをあなたの%deviceにインストールするには%iconをタップして<strong>ホーム画面に追加</strong>を選んでください。",
            ko_kr: '%device에 웹앱을 설치하려면 %icon을 터치 후 "홈화면에 추가"를 선택하세요',
            nb_no: "Installer denne appen på din %device: trykk på %icon og deretter <strong>Legg til på Hjem-skjerm</strong>",
            nl_nl: "Installeer deze webapp op uw %device: tik %icon en dan <strong>Voeg toe aan beginscherm</strong>.",
            pl_pl: "Aby zainstalować tę aplikacje na %device: naciśnij %icon a następnie <strong>Dodaj jako ikonę</strong>.",
            pt_br: "Instale este aplicativo em seu %device: aperte %icon e selecione <strong>Adicionar à Tela Inicio</strong>.",
            pt_pt: "Para instalar esta aplicação no seu %device, prima o %icon e depois em <strong>Adicionar ao ecrã principal</strong>.",
            ru_ru: "Установите это веб-приложение на ваш %device: нажмите %icon, затем <strong>Добавить в «Домой»</strong>.",
            sv_se: "Lägg till denna webbapplikation på din %device: tryck på %icon och därefter <strong>Lägg till på hemskärmen</strong>.",
            th_th: "ติดตั้งเว็บแอพฯ นี้บน %device ของคุณ: แตะ %icon และ <strong>เพิ่มที่หน้าจอโฮม</strong>",
            tr_tr: "Bu uygulamayı %device'a eklemek için %icon simgesine sonrasında <strong>Ana Ekrana Ekle</strong> düğmesine basın.",
            uk_ua: "Встановіть цей веб сайт на Ваш %device: натисніть %icon, а потім <strong>На початковий екран</strong>.",
            zh_cn: "您可以将此应用安装到您的 %device 上。请按 %icon 然后选择<strong>添加至主屏幕</strong>。",
            zh_tw: "您可以將此應用程式安裝到您的 %device 上。請按 %icon 然後點選<strong>加入主畫面螢幕</strong>。"
        };
    return w(), {
        show: x,
        close: T,
        reset: L,
        init: w
    }
}(window);
(function() {
    window.VoyagerApi = function() {
        function e(e, t, n) {
            this.api = e, this.game = t, this.user = n
        }
        return e.prototype.getScore = function() {}, e.prototype.sendScore = function(e, t) {}, e.prototype.levelUp = function(e, t) {}, e.prototype.rate = function(e, t) {}, e.prototype._apiRequest = function(e, t, n, r, i) {
            var s;
            return t = this._apiUrl(t, n), console.log("Request page content with voyager:", t), navigator.userAgent.toLowerCase().indexOf("android") >= 0 && e === "GET" && (t += "&android-buster=" + Math.random()), s = this._openXHR(e, t), s.setRequestHeader("Content-Type", "application/json-rpc"), s.setRequestHeader("Softgames-Voyager-Version", "2015-07-07 14:46:13 +0000"), s.onload = function() {
                return typeof i == "function" ? i(JSON.parse(s.responseText)) : void 0
            }, s.onerror = function() {
                return console.log("Request failed.", e, t)
            }, s.send(JSON.stringify(r)), s
        }, e.prototype._apiUrl = function(e, t) {
            return e + "?" + this._queryString(t)
        }, e.prototype._queryString = function(e) {
            var t, n, r;
            t = [];
            for (n in e) r = e[n], r != null && t.push("" + n + "=" + encodeURIComponent(r));
            return t.join("&")
        }, e.prototype._openXHR = function(e, t) {
            var n;
            n = new XMLHttpRequest;
            if (this._isCorsSupported(n)) n.open(e, t, !0);
            else {
                if (typeof XDomainRequest == "undefined") throw n = null, console.log("CORS is not supported by the browser.", e, t), new Error("CORS not supported.");
                n = new XDomainRequest, n.open(e, t)
            }
            return n
        }, e.prototype._isCorsSupported = function(e) {
            return e.withCredentials != null
        }, e
    }()
}).call(this),
    function() {
        var e = {}.hasOwnProperty,
            t = function(t, n) {
                function i() {
                    this.constructor = t
                }
                for (var r in n) e.call(n, r) && (t[r] = n[r]);
                return i.prototype = n.prototype, t.prototype = new i, t.__super__ = n.prototype, t
            };
        window.SoftgamesKirk = function(e) {
            function n() {
                return n.__super__.constructor.apply(this, arguments)
            }
            return t(n, e), n.prototype.getScore = function() {
                return console.log("Get score")
            }, n.prototype.sendScore = function(e, t) {
                return typeof t == "function" ? t() : void 0
            }, n.prototype.getScores = function(e, t) {
                return typeof t == "function" ? t() : void 0
            }, n.prototype.rate = function(e, t) {
                if (e !== undefined) return this._apiRequest("POST", "" + this.api.kirk_host + "rate/" + this.game + "/" + this.user + "/" + e, null, null, t)
            }, n
        }(VoyagerApi)
    }.call(this),
    function() {
        var e = {}.hasOwnProperty,
            t = function(t, n) {
                function i() {
                    this.constructor = t
                }
                for (var r in n) e.call(n, r) && (t[r] = n[r]);
                return i.prototype = n.prototype, t.prototype = new i, t.__super__ = n.prototype, t
            };
        window.SoftgamesMocospace = function(e) {
            function n() {
                return n.__super__.constructor.apply(this, arguments)
            }
            return t(n, e), n
        }(VoyagerApi)
    }.call(this),
    function() {
        var e = {}.hasOwnProperty,
            t = function(t, n) {
                function i() {
                    this.constructor = t
                }
                for (var r in n) e.call(n, r) && (t[r] = n[r]);
                return i.prototype = n.prototype, t.prototype = new i, t.__super__ = n.prototype, t
            };
        window.SoftgamesQeep = function(e) {
            function n() {
                return n.__super__.constructor.apply(this, arguments)
            }
            return t(n, e), n
        }(VoyagerApi)
    }.call(this),
    function() {
        var e = {}.hasOwnProperty,
            t = function(t, n) {
                function i() {
                    this.constructor = t
                }
                for (var r in n) e.call(n, r) && (t[r] = n[r]);
                return i.prototype = n.prototype, t.prototype = new i, t.__super__ = n.prototype, t
            };
        window.SoftgamesSandbox = function(e) {
            function n() {
                return n.__super__.constructor.apply(this, arguments)
            }
            return t(n, e), n.prototype.getScore = function() {
                return console.log("Get score")
            }, n.prototype.sendScore = function(e, t) {
                return console.log("SANDBOX { " + this.game + " } [ " + this.user + " ] Send score: " + e), typeof t == "function" ? t() : void 0
            }, n.prototype.levelUp = function(e, t) {
                return console.log("SANDBOX { " + this.game + " } [ " + this.user + " ] Level: " + e), typeof t == "function" ? t() : void 0
            }, n.prototype.rate = function(e, t) {
                return console.log("SANDBOX { " + this.game + " [ " + this.user + " ] Rate: " + e + " }"), typeof t == "function" ? t() : void 0
            }, n
        }(VoyagerApi)
    }.call(this), window.SG_jQuery = jQuery.noConflict(!0), window.SG_jQuery.ActiveAdBlocker = !0,
    function(e, t) {
        "use strict";
        try {
            if (!t) throw new Error("No window variable defined!");
            var n = function(n) {
                function i(e) {
                    e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                    var n = new RegExp("[\\?&]" + e + "=([^&#]*)"),
                        r = n.exec(t.location.search);
                    return r === null ? !1 : decodeURIComponent(r[1].replace(/\+/g, " "))
                }

                function o(e) {
                    return "[" + n + "] " + e
                }

                function u(t, n) {
                    var r = o(t);
                    e && (n ? e.log(r, n) : e.log(r))
                }

                function a(t, n) {
                    var r = o(t);
                    e && (n ? e.error(r, n) : e.error(r))
                }

                function f(e, t) {
                    var n = e.message,
                        r = {};
                    t && (r.data = t), e.data && (r.errorData = e.data), r.stacktrace = e.stack, a(n, r)
                }
                var r = 4,
                    s = i("logLevel");
                if (s === !1 || isNaN(s) || s < -1 || s > 10) s = r;
                this.error = function(e, t) {
                    s < 4 && (e instanceof Error ? f(e, t) : a(e, t))
                }, this.warn = function(e, t) {
                    s < 3 && u(e, t)
                }, this.notice = function(e, t) {
                    s < 2 && u(e, t)
                }, this.info = function(e, t) {
                    s < 1 && u(e, t)
                }, this.debug = function(e, t) {
                    s < 0 && u(e, t)
                }, this.log = function(e, t, n) {
                    s < e - 1 && u(t, n)
                }
            };
            t.SoftgamesLogger = n
        } catch (r) {
            throw e && e.error("[logger] " + r.message, r.stack), r
        }
    }(console, window),
    function(e, t, n, r) {
        "use strict";

        function u(e, t, n, r) {
            var i = e.getElementsByTagName("script")[0];
            if (e.getElementById(n)) return;
            var s = e.createElement(t);
            s.id = n, t === "script" ? s.src = r : t === "link" && (s.href = r, s.rel = "stylesheet"), i.parentNode.insertBefore(s, i)
        }

        function a() {
            u(r, "script", "bootstrap-js", s)
        }

        function f() {
            u(r, "link", "bootstrap-css", o)
        }

        function l() {
            n.jQuery = e
        }

        function c() {
            e(r).off(".data-api")
        }

        function h() {
            l(), f(), a(), c()
        }
        var i = "bootstrap",
            s = "./4399/bootstrap/3.3.1/js/bootstrap.min.js",
            o = "./4399/bootstrap/3.3.1/css/bootstrap.min.css";
        try {
            if (!t) throw new Error("SoftgamesLogger not defined!");
            if (!e) throw new Error("No SG_jQuery defined!");
            var p = new t(i);
            h(), p.debug("Added bootstrap to page")
        } catch (d) {
            throw console && console.error("[" + i + "] " + d.message, d.stack), d
        }
    }(SG_jQuery, SoftgamesLogger, window, document),
    function(e, t, n) {
        "use strict";
        var r = "events";
        try {
            if (!e) throw new Error("No Softgames variable defined!");
            if (!t) throw new Error("SoftgamesLogger not defined!");
            var i = new t(r),
                s = function() {
                    var e = this,
                        t = {};
                    this.fire = function(e, n) {
                        try {
                            if (!e) throw new Error("No event string given");
                            i.debug("Starts to execute all eventListeners for event " + e);
                            var r = 0;
                            if (t[e])
                                for (var s = 0; s < t[e].length; s++) try {
                                    t[e][s](n)
                                } catch (o) {
                                    o.message = "Failed to execute event listener: " + o.message, i.error(o), r++
                                }
                            r === 0 && i.debug("Executed all eventListeners of event " + e)
                        } catch (o) {
                            o.message = "Failed to execute all event listeners: " + o.message, i.error(o)
                        }
                    }, this.on = function(n, r) {
                        try {
                            if (!n) throw new Error("No event string given");
                            if (!r) throw new Error("No callback given");
                            if ("function" != typeof r) throw new Error("Given callback is no function");
                            t[n] || (t[n] = []), e.remove(n, r), t[n].push(r), i.debug("Added event listener to event " + n, r.name)
                        } catch (s) {
                            s.message = "Failed to add event listener: " + s.message, i.error(s)
                        }
                    }, this.remove = function(e, n) {
                        try {
                            if (!e) throw new Error("No event string given");
                            if (!t[e]) return;
                            var r;
                            while (-1 !== (r = t[e].indexOf(n))) t[e].splice(r, 1)
                        } catch (s) {
                            s.message = "Failed to remove event listener: " + s.message, i.error(s)
                        }
                    }
                };
            e.prototype.events = new s, i.debug("Added events to Softgames-Prototype")
        } catch (o) {
            throw console && console.error("[" + r + "] " + o.message, o.stack), o
        }
    }(Softgames, SoftgamesLogger, SG_jQuery),
    function(e, t, n, r, i) {
        "use strict";

        function p(e) {
            return (u + "-" + e).replace(/\s/g, "")
        }

        function d(e) {
            return "." + u + "." + p(e)
        }

        function v(e) {
            var r = e.getModuleName(),
                i = d(r),
                s = n(i);
            if (s.length > 0) return s;
            var o = p(r),
                f = o + "-" + String(Date.now()),
                l = t.createElement("div");
            return l.id = f, n("body").append(l), s = n("#" + f), s.addClass("modal"), s.addClass("fade"), s.addClass(u), s.addClass(o), s.html('<div class="modal-dialog"><div class="modal-content"><div class="modal-body"><button class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><div class="' + a + '"></div>' + "</div>" + "</div>" + "</div>"), s.find(".close").click(e.close), s.modal({
                backdrop: "static",
                show: !1
            }), s
        }
        var s = r.prototype.events,
            o = "ModalWindow",
            u = "sg-modal-window",
            a = "sg-modal-window-content",
            f = {
                open: "modalWindowOpened",
                close: "modalWindowClosed",
                change: "modalWindowChange"
            };
        try {
            if (!i) throw new Error("SoftgamesLogger not defined!");
            if (!n) throw new Error("No SG_jQuery defined!");
            if (!s) throw new Error("No eventManager defined!");
            var l = function(e, t) {
                    function h(e, t) {
                        try {
                            l = !0, c = e, r = v(n), p(t), d(e), m()
                        } catch (i) {
                            u.error(i)
                        }
                    }

                    function p(e) {
                        r.find("." + a).html(e)
                    }

                    function d() {
                        r.on("shown.bs.modal", function() {
                            r.unbind("shown.bs.modal"), s.fire(f.open, {
                                moduleName: t,
                                name: c
                            })
                        })
                    }

                    function m() {
                        r.modal({
                            backdrop: "static",
                            show: !0
                        })
                    }

                    function g(e) {
                        r.on("hidden.bs.modal", function() {
                            r.unbind("hidden.bs.modal"), s.fire(f.close, {
                                moduleName: t,
                                name: c
                            }), typeof e == "function" && e()
                        })
                    }

                    function y() {
                        r.modal("hide")
                    }
                    this.getModuleName = function() {
                        return t
                    };
                    var n = this,
                        r, u = new i(o + "." + t),
                        l = !1,
                        c = "";
                    this.isOpen = function() {
                        return l
                    }, this.open = function(n, r) {
                        try {
                            this.isOpen() && s.fire(f.change, {
                                moduleName: t,
                                oldName: c,
                                newName: n
                            }), e.closeAll(function() {
                                h(n, r)
                            })
                        } catch (i) {
                            u.error(i)
                        }
                    }, this.close = function(e) {
                        try {
                            u.debug("Close modal window"), l = !1, g(e), y()
                        } catch (t) {
                            u.error(t)
                        }
                    }
                },
                c = function() {
                    function r() {
                        try {
                            var e = [];
                            return Object.keys(n).forEach(function(t) {
                                var r = n[t];
                                r.isOpen() && e.push(r)
                            }), e
                        } catch (r) {
                            t.error(r)
                        }
                    }
                    var e = this,
                        t = new i(o),
                        n = {};
                    this.getModalWindow = function(r) {
                        try {
                            return n[r] || (n[r] = new l(e, r)), n[r]
                        } catch (i) {
                            t.error(i)
                        }
                    }, this.closeAll = function(e) {
                        var t = r(),
                            n = t.length;
                        n === 0 ? e() : t.forEach(function(t) {
                            t.close(function() {
                                n--, n === 0 && e()
                            })
                        })
                    }
                };
            e.softgamesModalWindow = new c
        } catch (h) {
            throw console && console.error("[modalWindow] " + h.message, h.stack), h
        }
    }(window, document, SG_jQuery, Softgames, SoftgamesLogger),
    function(e, t, n, r) {
        "use strict";

        function p(e) {
            v("click", e)
        }

        function d(e, t) {
            v(e, JSON.stringify(t))
        }

        function v(e, t, n) {
            try {
                l.debug("Tracking " + t + " event"), s._trackEvent && s._trackEvent(e, t, n)
            } catch (r) {
                l.error(r)
            }
        }

        function m(e) {
            try {
                s = e, s.eventTracker.init()
            } catch (t) {
                l.error(t)
            }
        }
        var i = e.prototype.events,
            s = null,
            o = "eventTracker",
            u = "track-click-event",
            a = "click-event-name-",
            f = ["modalWindowOpened", "modalWindowClosed", "modalWindowChange", "prizePlayTwitterTweeted", "prizePlayFacebookShared", "prizePlayVoucherShown", "prizePlayTwitterLoaded"];
        try {
            if (!e) throw new Error("No Softgames variable defined!");
            if (!n) throw new Error("SoftgamesLogger not defined!");
            if (!t) throw new Error("No SG_jQuery defined!");
            if (!i) throw new Error("No eventManager defined!");
            var l = new n(o),
                c = function() {
                    var e = this;
                    i.on("softgamesReady", m)
                };
            c.prototype.init = function() {
                try {
                    this.injectUserInteractionEventListeners(), this.injectEventEventListeners()
                } catch (e) {
                    l.error(e)
                }
            }, c.prototype.injectEventEventListeners = function() {
                try {
                    f.forEach(function(e) {
                        i.on(e, function(t) {
                            d(e, t)
                        })
                    })
                } catch (e) {
                    l.error(e)
                }
            }, c.prototype.injectUserInteractionEventListeners = function() {
                t("." + u).click(function(e) {
                    try {
                        var n = t(this).attr("class").split(/\s+/),
                            r = null;
                        t.each(n, function(e, t) {
                            t.substring(0, a.length) === a && (r = t.substring(a.length, t.length))
                        }), r && p(r)
                    } catch (i) {
                        l.error(i)
                    }
                }), l.debug("Added click event listeners")
            }, e.prototype.eventTracker = new c, l.debug("Added eventTracker to Softgames-Prototype")
        } catch (h) {
            throw console && console.error("[" + o + "] " + h.message, h.stack), h
        }
    }(Softgames, SG_jQuery, SoftgamesLogger, window),
    function(e, t, n, r) {
        "use strict";
        var i = e.prototype.events,
            s = "tracker",
            o = {
                softgamesReady: "softgamesReady",
                trackerInitiated: "trackerInitiated"
            };
        try {
            if (!e) throw new Error("No Softgames variable defined!");
            if (!t) throw new Error("SoftgamesLogger not defined!");
            if (!n) throw new Error("No SG_jQuery defined!");
            if (!i) throw new Error("No eventManager defined!");
            var u = new t(s),
                a = function() {
                    function s() {
                        return e
                    }

                    function a() {
                        n.getScript(t).done(function(t, n) {
                            u.debug("SDK loaded"), e = !0, i.fire(o.trackerInitiated), u.debug("initiated")
                        })
                    }

                    function f(t, n) {
                        try {
                            if (!e) throw new Error("Not initiated");
                            r.sgTrackSdk ? r.sgTrackSdk.trackEvent("voyager", t, n) : u.debug("Could not track event " + t, n)
                        } catch (i) {
                            u.debug(i)
                        }
                    }
                    var e = !1,
                        t = "./4399/sg-track-sdk.js";
                    i.on(o.softgamesReady, a), this.postEvent = f
                };
            e.prototype.trackerHandler = new a, u.debug("Added trackerHandler to Softgames-Prototype")
        } catch (f) {
            throw console && console.error("[" + s + "] " + f.message, f.stack), f
        }
    }(Softgames, SoftgamesLogger, SG_jQuery, window),
    function(e, t, n, r, i) {
        "use strict";

        function h() {
            e.prototype.adsHandler = a
        }
        var s = e.prototype.events,
            o = "ads",
            u = {
                adManagerLoaded: "adManagerLoaded",
                voyagerAdCall: "voyagerAdCall"
            },
            a = null;
        try {
            if (!e) throw new Error("No Softgames variable defined!");
            if (!n) throw new Error("SoftgamesLogger not defined!");
            if (!t) throw new Error("No SG_jQuery defined!");
            if (!s) throw new Error("No eventManager defined!");
            var f = new n(o),
                l = function() {
                    function i(i) {
                        n = i, t = n.adsConfigurations, t && r.c3po ? (e = !0, f.debug("initiated with config", t)) : f.debug("Can't initiated due to missing config")
                    }

                    function o(e) {
                        switch (e) {
                            case n.pageGameDetails:
                                return "gameDetails";
                            case n.pageGamePageTop:
                                return "gamePageTop";
                            case n.pageGamePageBottom:
                                return "gamePageBottom";
                            case n.pageMoreGames:
                                return "moreGames";
                            case n.popupPreroll:
                                return "preroll";
                            case n.popupIngame:
                                return "ingame";
                            case n.popupIncentivise:
                                return "incentivise";
                            case "second_preroll":
                                return "second_preroll"
                        }
                    }

                    function a(n, i, s, u) {
                        try {
                            f.debug("Try to show ad for slot " + n);
                            if (!e) throw new Error("Not initiated!");
                            var a = o(n);
                            if (!a) throw new Error("No valid slotname given: [" + n + "]");
                            t.voyager = s, r.c3po.showAd(a, i, t, u), f.debug("Finished process in voyager")
                        } catch (l) {
                            f.error(l), u(l.message)
                        }
                    }

                    function l() {
                        return e
                    }
                    var e = !1,
                        t = null,
                        n = null;
                    s.on(u.adManagerLoaded, i), this.showAd = a, this.isInitiated = l
                };
            a = new l
        } catch (c) {
            throw console && console.error("[" + o + "] " + c.message, c.stack), c
        }
        h(), setInterval(h, 1e3), s.on(u.voyagerAdCall, h), f.debug("Added adsHandler to Softgames-Prototype")
    }(Softgames, SG_jQuery, SoftgamesLogger, window, document),
    function(e, t, n, r, i, s) {
        "use strict";
        var o = e.prototype.events,
            u = e.prototype.eventTracker,
            a = null,
            f = "prizePlay",
            l = "levels",
            c = "ads",
            h = "prize-play-qualification-voucher",
            p = {
                modalWindowClosed: "modalWindowClosed",
                modalWindowOpened: "modalWindowOpened",
                modalWindowChanged: "modalWindowChange",
                tweeted: "prizePlayTwitterTweeted",
                fbShared: "prizePlayFacebookShared",
                voucherShown: "prizePlayVoucherShown",
                twitterLoaded: "prizePlayTwitterLoaded",
                twitterClicked: "prizePlayTwitterClicked",
                softgamesReady: "softgamesReady",
                firstPageLoaded: "firstPageLoaded",
                levelUp: "levelUp",
                adsClosed: "closeAd"
            };
        try {
            if (!e) throw new Error("No Softgames variable defined!");
            if (!n) throw new Error("SoftgamesLogger not defined!");
            if (!r) throw new Error("SoftgamesModalWindow not defined!");
            if (!t) throw new Error("No SG_jQuery defined!");
            if (!o) throw new Error("No eventManager defined!");
            if (!u) throw new Error("No eventTracker defined!");
            var d = new n(f),
                v = function() {
                    function E(e) {
                        try {
                            a = e
                        } catch (t) {
                            d.error(t)
                        }
                    }

                    function S() {
                        var e = "prize-play-tac-btn",
                            n = t("#" + e);
                        if (!n.length) throw new Error('No element with id "' + e + '" found');
                        n.click(function() {
                            A(function(e) {
                                try {
                                    if (e) throw e;
                                    d.debug("Termes and conditions modWid shown")
                                } catch (e) {
                                    d.error(e)
                                }
                            })
                        })
                    }

                    function x() {
                        o.on(p.tweeted, function(e) {
                            m = !0, V(), _(function(e) {
                                try {
                                    if (e) throw e;
                                    d.debug("Finished modWid shown")
                                } catch (e) {
                                    d.error(e)
                                }
                            })
                        }), o.on(p.twitterClicked, function(e) {
                            g = !0
                        })
                    }

                    function T() {
                        o.on(p.fbShared, function(e) {
                            m = !0, _(function(e) {
                                try {
                                    if (e) throw e;
                                    d.debug("Finished modWid shown")
                                } catch (e) {
                                    d.error(e)
                                }
                            })
                        })
                    }

                    function N() {
                        try {
                            S(), x(), T(), u.injectUserInteractionEventListeners(), d.debug("Added all event listeners")
                        } catch (e) {
                            e.message = "connectEventListener: " + e.message, d.error(e)
                        }
                    }

                    function C(e) {
                        if (!e) throw new Error("No data given");
                        if ("object" != typeof e) throw console.log("data init type:", typeof e), new Error("Given data is not an object");
                        if (!e.hasOwnProperty("termsAndConditionsContent")) throw new Error("No termsAndConditionsContent in given data");
                        if (!e.hasOwnProperty("qualifiedContent")) throw new Error("No qualifiedContent in given data");
                        if (!e.hasOwnProperty("targetEventType")) throw new Error("No targetEventType in given data");
                        if (!e.hasOwnProperty("targetEventValue")) throw new Error("No targetEventValue in given data")
                    }

                    function k() {
                        return b || (b = r.getModalWindow(f)), b
                    }

                    function L(r, i) {
                        function a() {
                            try {
                                o.remove(p.modalWindowOpened, a), t(".prize-play-close-mod-win").click(s.close), u.injectUserInteractionEventListeners(), i()
                            } catch (e) {
                                d.error(e)
                            }
                        }
                        var s = k();
                        try {
                            if (!e) throw new Error("Not initiated");
                            o.on(p.modalWindowOpened, a), s.open(r, n[r])
                        } catch (f) {
                            i(f)
                        }
                    }

                    function A(e) {
                        L("termsAndConditionsContent", e)
                    }

                    function O() {
                        var e = t(".twitter-hashtag-button");
                        e.attr("data-url", i.location.protocol + "//" + i.location.host + i.location.pathname), e.attr("data-text", e.attr("data-text") + " code: " + w)
                    }

                    function M(e) {
                        g = !1, y = !1, w = X(), L("qualifiedContent", function(t) {
                            O(), n.hasVoucher && (q(), R()), n.withTwitter && H(), e(t)
                        })
                    }

                    function _(e) {
                        L("finishedContent", function() {
                            t(".prize-play-reload").click(function() {
                                d.debug("Reload page"), i.setTimeout(function() {
                                    i.location.reload()
                                }, 500)
                            }), e()
                        })
                    }

                    function D(e) {
                        L("notFinishedAfterPushContent", function() {
                            O(), n.withTwitter && H(), e()
                        })
                    }

                    function P(e) {
                        L("notFinishedBeforePushContent", function() {
                            O(), n.withTwitter && H(), e()
                        })
                    }

                    function H() {
                        i.twttr ? i.twttr.widgets && i.twttr.widgets.load() : (i.twttr = function(e, t, n) {
                            var r, s, o = e.getElementsByTagName(t)[0];
                            if (e.getElementById(n)) return;
                            return s = e.createElement(t), s.id = n, s.src = "https://platform.twitter.com/widgets.js", o.parentNode.insertBefore(s, o), i.twttr || (r = {
                                _e: [],
                                ready: function(e) {
                                    r._e.push(e)
                                }
                            })
                        }(s, "script", "twitter-wjs"), i.twttr.ready(function(e) {
                            o.fire(p.twitterLoaded), e.events.bind("tweet", function(e) {
                                o.fire(p.tweeted, e)
                            }), e.events.bind("click", function(e) {
                                o.fire(p.twitterClicked, e)
                            })
                        }))
                    }

                    function B() {
                        i.FB.init({
                            appId: n.facebookAppId,
                            xfbml: !0,
                            version: "v2.1"
                        })
                    }

                    function j() {
                        i.FB.ui({
                            method: "share_open_graph",
                            display: "popup",
                            action_type: "og.likes",
                            action_properties: JSON.stringify({
                                object: "http://prize.sg.lan/zombie-apocalypse"
                            })
                        }, function(e) {
                            e && e.post_id ? (d.debug("Facebook share window closed after sharing"), o.fire(p.fbShared)) : d.debug("Facebook share window closed without sharing")
                        })
                    }

                    function F() {
                        t(".pp-fb-share-button").click(function(e) {
                            e.preventDefault(), d.debug(i.location), i.FB.api("me/permissions", function(e) {
                                !e || !e.data || e.data.lengh < 1 || !("publish_actions" in e.data) ? i.FB.login(function(e) {
                                    console.log(e), j()
                                }, {
                                    scope: "publish_actions"
                                }) : (d.debug("Permisions:", e.data), console.log(e.data), j())
                            })
                        })
                    }

                    function I() {
                        if (!i.FB) {
                            if (t(".fb-root").length < 1) {
                                var e = s.createElement("div");
                                e.class = "fb-root", t("body").append(e)
                            }
                            i.fbAsyncInit = function() {
                                    B(), F()
                                },
                                function(e, t, n) {
                                    var r, i = e.getElementsByTagName(t)[0];
                                    if (e.getElementById(n)) return;
                                    r = e.createElement(t), r.id = n, r.src = "//connect.facebook.net/en_US/sdk.js", i.parentNode.insertBefore(r, i)
                                }(s, "script", "facebook-jssdk")
                        } else F()
                    }

                    function q() {
                        i.googletag = {}, i.googletag.cmd = [],
                            function() {
                                var e = s.createElement("script");
                                e.async = !0, e.type = "text/javascript";
                                var t = "https:" === s.location.protocol;
                                e.src = (t ? "https:" : "http:") + "//www.googletagservices.com/tag/js/gpt.js";
                                var n = s.getElementsByTagName("script")[0];
                                n.parentNode.insertBefore(e, n)
                            }()
                    }

                    function R() {
                        i.googletag.cmd.push(function() {
                            i.googletag.defineSlot("/418149392/PricePlay_AdUnit", [300, 250], h).addService(i.googletag.pubads()), i.googletag.pubads().enableSingleRequest(), i.googletag.pubads().addEventListener("slotRenderEnded", function() {
                                o.fire(p.voucherShown), d.debug("Voucher rendered")
                            }), i.googletag.enableServices(), i.googletag.display(h)
                        })
                    }

                    function U(t) {
                        try {
                            d.debug("onLevelUp fired! level: ", t.level);
                            var r = Number(t.level),
                                i = t.callback || function() {};
                            if (!e) throw new Error("Not initiated");
                            if (!m)
                                if (String(n.targetEventType) === l) {
                                    if (isNaN(r)) throw new Error("No or no valid level given");
                                    var s = Number(n.targetEventValue);
                                    r >= s ? z(i) : (d.debug("Level is not high enough: " + r + ">" + s), i())
                                } else d.debug("TargetEvent type is not levels:", n.targetEventType), i();
                            else d.debug("Already took part in prize play"), i()
                        } catch (o) {
                            d.error(o), i()
                        }
                    }

                    function z(e) {
                        function t(r) {
                            m || y || !n.withTwitter && !n.withFacebook ? (o.remove(p.modalWindowClosed, t), r.moduleName === f && (d.debug("Event callback called!"), e())) : g ? (y = !0, D(function() {
                                d.debug("Modal Window close after pushed share without sharing shown")
                            })) : (y = !0, P(function() {
                                d.debug("Modal Window for close before pushed share shown")
                            }))
                        }
                        o.on(p.modalWindowClosed, t), o.on(p.modalWindowChanged, function() {
                            o.remove(p.modalWindowClosed, t), o.on(p.modalWindowOpened, function() {
                                o.on(p.modalWindowClosed, t)
                            })
                        }), M(function(e) {
                            try {
                                if (e) throw e;
                                d.debug("Showed qualification modal window due to level up")
                            } catch (e) {
                                d.error(e)
                            }
                        })
                    }

                    function W(t) {
                        try {
                            d.debug("onAds fired", t);
                            if (!e) throw new Error("Not initiated");
                            m ? d.debug("Already took part in prize play") : n.targetEventType === c ? (v++, v >= Number(n.targetEventValue) && M(function(e) {
                                try {
                                    if (e) throw e;
                                    d.debug("Showed qualification modal window due to ads shown")
                                } catch (e) {
                                    d.error(e)
                                }
                            })) : d.debug("TargetEvent type is not ads:", n.targetEventType)
                        } catch (r) {
                            d.error(r)
                        }
                    }

                    function X() {
                        return Math.floor((1 + Math.random()) * 65536).toString(32).substr(1) + Math.floor((1 + Math.random()) * 65536).toString(32).substr(1)
                    }

                    function V() {
                        try {
                            var e = {
                                    campaignId: n.campaignId,
                                    uniqueId: w,
                                    userId: a.userId,
                                    type: "twitter"
                                },
                                r = {
                                    client: "prize-play",
                                    type: "share",
                                    data: e
                                },
                                i = "http://tracking.softgames.com/api/v1/tracking";
                            d.debug("Try to send tweet tracking information!"), t.ajax({
                                type: "POST",
                                url: i,
                                async: !0,
                                cache: !1,
                                data: JSON.stringify(r),
                                processData: !1,
                                dataType: "json",
                                contentType: "application/json",
                                beforeSend: function(e) {
                                    e.setRequestHeader("Authorization", "Basic " + btoa("sg-tracking:$50ftg4m35$"))
                                },
                                error: function(e, t, n) {
                                    d.error("Failed to send this data for tracking the tweet event due to error: " + n, {
                                        url: i,
                                        data: r,
                                        textStatus: t,
                                        errorThrown: n,
                                        xhr: e
                                    })
                                },
                                success: function(e) {
                                    e.status ? d.info("Successfully sent this data for tracking the tweet event", r) : d.notice("Sent this data for tracking the tweet event and got a invalid response", {
                                        postedData: r,
                                        response: e
                                    })
                                }
                            })
                        } catch (s) {
                            d.error("Failed to send data to track the tweet event due to error: " + s.message, s.stack)
                        }
                    }
                    var e = !1,
                        n = null,
                        v = 0,
                        m = !1,
                        g = !1,
                        y = !1,
                        b = null,
                        w = null;
                    o.on(p.softgamesReady, E), this.init = function(t) {
                        try {
                            t ? (C(t), n = t, o.on(p.firstPageLoaded, N), o.on(p.levelUp, U), o.on(p.adsClosed, W), e = !0, d.debug("Prize play initialized", {
                                data: t
                            })) : d.debug("No prize play")
                        } catch (r) {
                            r.message = "Failed to init: " + r.message, d.error(r, t)
                        }
                    }, this.isInitiated = function() {
                        return e
                    }
                };
            e.prototype.prize_play = new v, d.debug("Added prize_play to Softgames-Prototype")
        } catch (m) {
            throw console && console.error("[" + f + "] " + m.message, m.stack), m
        }
    }(Softgames, SG_jQuery, SoftgamesLogger, softgamesModalWindow, window, document),
    function(e, t, n) {
        "use strict";
        var r = e.prototype.events,
            i = "features",
            s = {
                gameDataLoaded: "gameDataLoaded"
            };
        try {
            if (!e) throw new Error("No Softgames variable defined!");
            if (!t) throw new Error("SoftgamesLogger not defined!");
            if (!n) throw new Error("No SG_jQuery defined!");
            if (!r) throw new Error("No eventManager defined!");
            var o = new t(i),
                u = function() {
                    function i() {
                        return t
                    }

                    function u(r) {
                        n.each(r, function(t, n) {
                            /feature_/.test(t) && n === !0 && (e[t.replace("feature_", "")] = !0)
                        }), t = !0, o.debug("initiated")
                    }

                    function a(t) {
                        if (!i()) throw new Error("Not initiated!");
                        return Object.keys(e).indexOf(t) >= 0 ? e[t] : (o.debug("Undefined " + t + " feature"), !1)
                    }
                    var e = {},
                        t = !1;
                    r.on(s.gameDataLoaded, u), this.isInitiated = i, this.enabled = a
                };
            e.prototype.featuresHandler = new u, o.debug("Added featuresHandler to Softgames-Prototype")
        } catch (a) {
            throw console && console.error("[" + i + "] " + a.message, a.stack), a
        }
    }(Softgames, SoftgamesLogger, SG_jQuery),
    function(e, t, n, r) {
        "use strict";
        var i = e.prototype.events,
            s = "highscores",
            o = {
                softgamesReady: "softgamesReady",
                kirkUserReady: "kirkUserReady",
                modalWindowOpened: "modalWindowOpened",
                modalWindowClosed: "modalWindowClosed",
                gameLevelStarted: "levelStarted",
                gameLevelFinished: "levelFinished",
                finishedLoadingFlow: "finishedLoadingFlow"
            };
        try {
            if (!e) throw new Error("No Softgames variable defined!");
            if (!t) throw new Error("SoftgamesLogger not defined!");
            if (!r) throw new Error("No SG_jQuery defined!");
            if (!n) throw new Error("SoftgamesModalWindow not defined!");
            if (!i) throw new Error("No eventManager defined!");
            var u = new t(s),
                a = function() {
                    function b() {
                        return e
                    }

                    function w(r) {
                        r.featuresHandler.enabled(s) ? (h = n.getModalWindow(s), t = r.highscores.type, p = r.highscores.templates, m = r.highscores.scores, d = r.AVATARS, m === undefined && (m = []), e = !0, u.debug("initiated")) : u.debug("feature not enabled")
                    }

                    function E(e) {
                        return e == a ? 1 : 0
                    }

                    function S() {
                        if (!e) throw new Error("Not initiated")
                    }

                    function x(e) {
                        return r("<div/>").text(e).html()
                    }

                    function T(e) {
                        v = e
                    }

                    function N(e) {
                        var t = d[e];
                        return t === undefined && (t = d.blank), '<img class="img-circle avatar" src="' + t.image_url + '" />'
                    }

                    function C(t) {
                        if (!e) throw new Error("Not initiated");
                        var n = undefined;
                        m[t] !== undefined && (n = m[t]), n == undefined && (n = []);
                        var i = c[t],
                            s = [],
                            o = !1;
                        r.each(n, function(e, t) {
                            if (i > t.score && o === !1) {
                                var n = v.name;
                                n === undefined && (n = "me"), s.push({
                                    user: n,
                                    score: i,
                                    me: !0,
                                    avatar: v.avatar
                                }), o = !0
                            }(t.id !== v.externalId || o === !1) && s.push({
                                user: t.name,
                                score: t.score,
                                me: v.externalId == t.id,
                                avatar: t.avatar
                            })
                        });
                        if (s.length < 10 && o === !1 && i !== undefined && i > 0) {
                            var u = v.name;
                            u === undefined && (u = "me"), s.push({
                                user: u,
                                score: i,
                                me: !0,
                                avatar: v.avatar
                            })
                        }
                        s = s.slice(0, 10);
                        if (s.length > 0) {
                            var a = 1,
                                f = s[0].score;
                            r.each(s, function(e, t) {
                                t.score < f ? (a += 1, f = t.score, t.position = a) : t.position = a
                            })
                        }
                        return s
                    }

                    function k(e) {
                        return isNaN(parseInt(e)) ? !1 : parseInt(e) > 2147483647 ? !1 : parseInt(e).toString() !== e.toString() ? !1 : !0
                    }

                    function L(t, n) {
                        if (!e) throw new Error("Not initiated");
                        r.ajax({
                            method: "GET",
                            url: "http://" + softgames.host + "kirk/games/" + softgames.game_slug + "/highscores/?user_id=" + v.externalId
                        }).done(function(e) {
                            P(e, t), H(e), n(e)
                        })
                    }

                    function A(t) {
                        if (!e) throw new Error("Not initiated");
                        var n = [];
                        r.each(c, function(e, t) {
                            n.push({
                                level: e,
                                score: t
                            })
                        }), SG_jQuery.ajax({
                            method: "POST",
                            url:  "./?game_slug=" + softgames.game_slug + "&k=" + v.authToken,
                            processData: !1,
                            contentType: "application/json",
                            data: JSON.stringify(n)
                        }).done(function() {
                            t()
                        })
                    }

                    function O(e) {
                        var n = C(e);
                        r(".highscore-wrapper").css("width", r("canvas").css("width")), r("#voyager-highscores ul li").remove(), t === a && (r(".level-container").empty().append('<span>Level</span><span class="level">' + e + "</span>").show(), r(".highscore-wrapper ul").css("margin-left", r(".level-container").css("width"))), r.each(n, function(e, t) {
                            t.me && !v.known && (r(".save-highscore-container").addClass("col-md-2 col-sm-2 col-xs-2"), r(".save-highscore-container").show());
                            var n = r('<div class="col-md-12 col-sm-12 col-xs-12 user-score-container paddingless right"></div>');
                            n.append('<div class="col-md-2 col-sm-2 col-xs-2 paddingless left right user-level">' + t.position + "</div>"), n.append('<div class="col-md-2 col-sm-2 col-xs-2 paddingless left right user-avatar">' + N(t.avatar) + "</div>"), n.append('<div class="col-md-7 col-xs-7 col-xs-7 col-md-offset-1 col-sm-offset-1 col-xs-offset-1 paddingless left right user-details"><div class="col-md-12 col-sm-12 col-xs-12 paddingless left right user-name">' + t.user + "</div>" + '<div class="col-md-12 col-sm-12 col-xs-12 paddingless left right user-score">' + t.score + "</div>" + "</div>");
                            var i = r('<li class="paddingless left right"></li>').append(n);
                            r("#voyager-highscores ul").append(i)
                        }), r("#save-highscore-container").unbind("click"), r("#save-highscore-container").on("click", function(e) {
                            return B(), !1
                        })
                    }

                    function M(t) {
                        if (!e) throw new Error("Not initiated");
                        if (!k(t)) {
                            u.debug("Invalid level: " + t);
                            return
                        }
                        var n = t;
                        t === undefined && (n = 0), m[n] === undefined ? L(n, function() {
                            O(n)
                        }) : O(n)
                    }

                    function _(t, n) {
                        if (!e) throw new Error("Not initiated");
                        if (!k(n)) {
                            u.debug("Invalid socre: " + n);
                            return
                        }
                        if (!k(t)) {
                            u.debug("Invalid level: " + t);
                            return
                        }
                        return n > l && (u.debug("New best score: " + n), l = n), c[t] === undefined || c[t] < n ? (c[t] = n, v.known && A(function() {
                            u.debug("Scores have been sent")
                        }), M(t), !0) : !1
                    }

                    function D() {
                        if (!e) throw new Error("Not initiated");
                        return l
                    }

                    function P(e, t) {
                        m = [], r.each(e, function(e, t) {
                            m[e] = [], r.each(t, function(t, n) {
                                n.id != v.externalId && m[e].push(n)
                            })
                        })
                    }

                    function H(e) {
                        r.each(e, function(e, t) {
                            r.each(t, function(t, n) {
                                v.externalId == n.id && (c[e] === undefined || c[e] < n.score) && (c[e] = n.score)
                            })
                        })
                    }

                    function B() {
                        function t() {
                            r(".form-group#name").removeClass("has-error"), r(".form-group#avatar").removeClass("has-error"), r(".form-group#name span#help-block").html(""), r(".form-group#avatar span#help-block").html(""), r("form#user-name #inputName").attr("maxlength", y), i.remove(o.modalWindowOpened, t), r("img.avatar").on("click", function(e) {
                                r("img.avatar").removeClass("selected"), r(this).addClass("selected")
                            }), r("form#user-name").submit(function(e) {
                                r("form#user-name #inputName").val(x(r("form#user-name #inputName").val()));
                                var t = !1;
                                return r("form#user-name #inputName").val().length < g && (r(".form-group#name").addClass("has-error"), r(".form-group#name span#help-block").html("Name is too short (min " + g + " characters)"), t = !0), r("form#user-name #inputName").val().length > y && (r(".form-group#name").addClass("has-error"), r(".form-group#name span#help-block").html("Name is too long (max " + y + " characters)"), t = !0), r("img.avatar.selected").length === 0 && (r(".form-group#avatar").addClass("has-error"), r(".form-group#avatar span#help-block").html("Select your avatar"), t = !0), t ? !1 : (j({
                                    name: r("form#user-name #inputName").val(),
                                    avatar: r("img.avatar.selected").data("avatar-slug")
                                }, function(e) {
                                    A(function() {
                                        u.debug("Scores have been sent")
                                    }), v.avatar = r("img.avatar.selected").data("avatar-slug"), v.name = r("form#user-name #inputName").val(), v.known = !0, r("#save-highscore-container").hide(), r(".sg-modal-window-content").html('<div class="alert alert-success" role="alert">Your name and scores has been saved</div><button id="close-button" class="btn btn-default">Close</button>'), r("li .panel.me button").remove(), r(".sg-modal-window-content #close-button").on("click", function() {
                                        h.close()
                                    })
                                }), !1)
                            })
                        }
                        try {
                            if (!e) throw new Error("Not initiated");
                            i.on(o.modalWindowOpened, t), h.open("Enter your name", p["user-form"])
                        } catch (n) {
                            u.debug(n)
                        }
                    }

                    function j(t, n) {
                        try {
                            if (!e) throw new Error("Not initiated");
                            SG_jQuery.ajax({
                                method: "PUT",
                                url: "./?game_slug=" + softgames.game_slug + "&k=" + v.authToken,
                                data: t
                            }).done(function() {
                                v.name = t.name, v.avatar = t.avatar, v.known = !0, A(function() {
                                    u.debug("Scores have been sent")
                                }), n()
                            })
                        } catch (r) {
                            u.debug(r)
                        }
                    }

                    function F(e) {
                        b() && M(e.level)
                    }

                    function I(e) {
                        b() && _(e.level, e.score)
                    }

                    function q(e) {
                        T(e), R()
                    }

                    function R() {
                        M(E(t))
                    }

                    function U() {
                        i.remove(o.gameLevelStarted, F), i.remove(o.gameLevelFinished, I)
                    }
                    var e = !1,
                        t = null,
                        a = "level-score",
                        f = {
                            "best-level": "Best level",
                            "best-score": "Best score",
                            "level-score": "Score"
                        },
                        l = 0,
                        c = {},
                        h = null,
                        p = null,
                        d = {},
                        v = {
                            name: "me",
                            avatar: ""
                        },
                        m = null,
                        g = 4,
                        y = 16;
                    i.on(o.softgamesReady, w), i.on(o.kirkUserReady, q), i.on(o.gameLevelStarted, F), i.on(o.gameLevelFinished, I), this.updateUser = j, this.isInitiated = b, this.currentBestScore = D, this.display = B, this.switchOff = U
                };
            e.prototype.highscoresHandler = new a, u.debug("Added highscoresHandler to Softgames-Prototype")
        } catch (f) {
            throw console && console.error("[" + s + "] " + f.message, f.stack), f
        }
    }(Softgames, SoftgamesLogger, softgamesModalWindow, SG_jQuery), window.SplitPageAd = function(e, t) {
        "use strict";

        function r(e, t) {
            t ? console.log(e, t) : console.log(e)
        }

        function i(e, n) {
            function s(e) {
                var n = setInterval(function() {
                    t.styleSheets.length > i && (clearInterval(n), e())
                }, 10)
            }
            if (u(e)) {
                r(e + " already exists - loading skipped"), n();
                return
            }
            var i = t.styleSheets.length,
                o = t.createElement("link");
            o.type = "text/css", o.href = e, o.rel = "stylesheet", typeof n == "function" && s(n), t.getElementsByTagName("head")[0].appendChild(o)
        }

        function s(e, n) {
            if (o(e)) {
                r(e + " already exists - loading skipped"), n();
                return
            }
            var i = t.createElement("script");
            i.src = e, i.async = !0, i.type = "text/javascript", typeof n == "function" && (i.onreadystatechange = i.onload = function() {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") i.onreadystatechange = i.onload = null, n()
            }), t.getElementsByTagName("head")[0].appendChild(i)
        }

        function o(e) {
            var n = t.getElementsByTagName("script");
            for (var r = 0; r < n.length; r++)
                if (n[r].src === e) return !0;
            return !1
        }

        function u(e) {
            var n = t.getElementsByTagName("link");
            for (var r = 0; r < n.length; r++)
                if (n[r].href === e) return !0;
            return !1
        }
        var n = "//c3po.softgames.de.s3-website-us-west-2.amazonaws.com/";
        return function(o) {
            this.settings = o, this.showAd = function() {
                r("Try to show ad via split page ima module"), this.cleanUp(), this.adSlot = t.getElementById(this.settings.slotId);
                if (!this.adSlot) {
                    r("Could not get adSlot", this.settings.slotId);
                    return
                }
                this.prepareLooks();
                var e = this,
                    o = 0,
                    u = function() {
                        o++, o == 2 && e.requestAds()
                    },
                    a = "//s0.2mdn.net/instream/html5/ima3.js";
                i(n + "c3po_mod_ima.css", u), s(a, u)
            }, this.getVastUrl = function() {
                var e = this.settings,
                    n = [],
                    i = e.voyager.customParams,
                    s;
                if (i)
                    for (s in i) n.push(s + "=" + i[s]);
                var o = e.vastBaseUrl,
                    u = e.vastUrlQuery;
                u.url = t.location.href, u.correlator = Date.now(), u.cust_params = n.join("&"), e.descriptionUrl ? u.description_url = e.descriptionUrl : u.description_url = "//m.softgames.de/games/adtext/" + e.voyager.game + "/?locale=" + e.voyager.language;
                var a = [],
                    f = "";
                for (s in u) f = s, u[s] && (f += "=" + encodeURIComponent(u[s])), a.push(f);
                var l = o + "?" + a.join("&");
                return r("Created vast url:", l), l
            }, this.prepareLooks = function() {
                r("prepare looks"), t.getElementById("splitPageAdDiv") === null ? (this.adDiv = t.createElement("div"), this.adDiv.id = "splitPageAdDiv", this.adSlot && this.adSlot.appendChild(this.adDiv)) : (this.adDiv = t.getElementById("splitPageAdDiv"), this.adDiv.innerHTML = ""), this.adDiv.setAttribute("type", "video"), this.adSlotBackupStyle = c3po.clone_obj(this.adSlot.style), this.adSlot.style.width = "100%", this.adSlot.style.maxWidth = "530px"
            }, this.cleanUp = function() {
                r("clean up"), this.isVideo = !1, this.adSlot && (this.adSlot.innerHTML = "", this.adSlot.style.width = this.adSlotBackupStyle.width, this.adSlot.style.maxWidth = this.adSlotBackupStyle.maxWidth, this.adsManager && this.adsManager.destroy(), this.adSlot = this.adDiv = this.adsManager = this.adsLoader = this.adDisplayContainer = null), clearInterval(this.intervalReference)
            }, this.detectDimensions = function() {
                var t = {
                        w: 530,
                        h: 300
                    },
                    n = e.getComputedStyle(this.adDiv, null);
                return n ? (t.w = parseInt(n.getPropertyValue("width").slice(0, -2)), t.h = parseInt(n.getPropertyValue("height").slice(0, -2)), r("detected dimensions: " + t.w + " x " + t.h), t) : (r("No style detected for adDiv"), t)
            }, this.setAdSize = function(e, t) {
                r("set ad size to: " + e + " x " + t), this.adDiv.style.height = t + "px"
            }, this.requestAds = function() {
                try {
                    r("Request ads");
                    var e = this.getVastUrl();
                    this.adDisplayContainer = new google.ima.AdDisplayContainer(this.adDiv), this.adDisplayContainer.initialize(), this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);
                    var t = this;
                    this.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function(e) {
                        t.onAdsManagerLoaded(e)
                    }, !1), this.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function(e) {
                        t.onAdError(e)
                    }, !1);
                    var n = new google.ima.AdsRequest;
                    n.adTagUrl = e, this.requestedVastUrl = e;
                    var i = this.detectDimensions();
                    n.linearAdSlotWidth = i.w, n.linearAdSlotHeight = i.h, n.nonLinearAdSlotWidth = i.w, n.nonLinearAdSlotHeight = i.h, n.disableCompanionAds = this.settings.disableCompanionAds, this.adsLoader.requestAds(n)
                } catch (s) {
                    r("adsLoader-Error", s), this.onAdError(s)
                }
            }, this.interupt = function() {
                this.closeAd("interupt", !0)
            }, this.onAdsManagerLoaded = function(e) {
                try {
                    r("Ad Event: adsmanager loaded");
                    var t = new google.ima.AdsRenderingSettings;
                    t.autoAlign = !0, t.useStyledNonLinearAds = !0, this.adsManager = e.getAdsManager(this.adDiv, t);
                    var n = this;
                    this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function(e) {
                        n.onAdError(e)
                    }), this.adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, function(e) {
                        n.onAdClicked(e)
                    });
                    var i = [google.ima.AdEvent.Type.ALL_ADS_COMPLETED, google.ima.AdEvent.Type.AD_METADATA, google.ima.AdEvent.Type.COMPLETE, google.ima.AdEvent.Type.FIRST_QUARTILE, google.ima.AdEvent.Type.LOADED, google.ima.AdEvent.Type.MIDPOINT, google.ima.AdEvent.Type.PAUSED, google.ima.AdEvent.Type.EXPANDED_CHANGED, google.ima.AdEvent.Type.STARTED, google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED, google.ima.AdEvent.Type.THIRD_QUARTILE, google.ima.AdEvent.Type.USER_CLOSE, google.ima.AdEvent.Type.SKIPPED, google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED];
                    for (var s in i) this.adsManager.addEventListener(i[s], function(e) {
                        n.onAdEvent(e)
                    }, !1, this);
                    var o = this.detectDimensions();
                    this.adsManager.init(o.w, o.h, google.ima.ViewMode.NORMAL), this.adsManager.start()
                } catch (u) {
                    this.onAdError(u)
                }
            }, this.onAdClicked = function(e) {
                r("Ad event:", e), this.closeAd("ByUserAdClicked")
            }, this.onAdEvent = function(e) {
                r("Ad event: " + e.type);
                var t = e.getAd();
                switch (e.type) {
                    case google.ima.AdEvent.Type.LOADED:
                        this.isVideo = t.isLinear(), t.isLinear() ? r("Ad is a video") : (r("Ad is NOT a video"), this.setAdSize(t.getWidth(), t.getHeight()));
                        break;
                    case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                        this.closeAd("ByTimeout");
                        break;
                    case google.ima.AdEvent.Type.USER_CLOSE:
                        this.closeAd("ByUser")
                }
            }, this.onAdError = function(e) {
                r("OnAdError executed");
                if (e) {
                    var t = e.message || e.getError().toString();
                    r("OnAdError executed error: " + t)
                }
                this.closeAd("adError")
            }, this.closeAd = function(e, t) {
                r("this: close ad");
                var n = t ? 0 : 500,
                    i = this;
                setTimeout(function() {
                    i.cleanUp()
                }, n), setTimeout(function() {
                    i.sendCloseEvent()
                }, n)
            }, this.sendCloseEvent = function() {
                var e = new CustomEvent("adClosed", {});
                t.dispatchEvent(e)
            }
        }
    }(window, document),
    function(e, t, n, r, i, s) {
        "use strict";
        var o = e.prototype.events,
            u = null,
            a = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            f = 0,
            l = 0,
            c = !0,
            h = "gamePage",
            p = {
                softgamesReady: "softgamesReady",
                finishedLoadingFlow: "finishedLoadingFlow",
                adClosed: "adClosed",
                voyagerAdCall: "voyagerAdCall",
                voyagerAdFinished: "voyagerAdFinished",
                scrollScreen: "scroll-screen"
            },
            d = {
                rightBanner: "voyager-right-ad-banner"
            };
        try {
            if (!e) throw new Error("No Softgames variable defined!");
            if (!n) throw new Error("SoftgamesLogger not defined!");
            if (!t) throw new Error("No SG_jQuery defined!");
            if (!o) throw new Error("No eventManager defined!");
            var v = new n(h),
                m = !1,
                g = null,
                y = function() {
                    function n(e) {
                        try {
                            u = e, r()
                        } catch (t) {
                            v.error(t)
                        }
                    }

                    function r() {
                        try {
                            o.on(p.finishedLoadingFlow, b), v.debug("Added all event listeners")
                        } catch (e) {
                            e.message = "connectEventListener: " + e.message, v.error(e)
                        }
                    }

                    function h() {
                        try {
                            v.debug("Try to pause ad"), m = !0, g.interupt()
                        } catch (e) {
                            v.error(e)
                        }
                    }

                    function y() {
                        m = !1
                    }

                    function b() {
                        if (u.embedGameFN()) switch (u.game_page_type) {
                            case "bridge_page":
                                E();
                                break;
                            case "split_page":
                                L()
                        }
                    }

                    function w() {
                        var e = 0,
                            t = setInterval(function() {
                                e++, !m && e > 2 && (clearInterval(t), k())
                            }, 1e3)
                    }

                    function E() {
                        try {
                            a && C(), u.subplatform === "unknown" && (N(0, 0), S(), x())
                        } catch (e) {
                            v.error(e)
                        }
                    }

                    function S() {
                        var e = setInterval(function() {
                            v.debug("check adslot size: " + t("#voyager-top-ad-banner").children().length);
                            var n = t("#voyager-top-ad-banner.voyager-ad-label").length == 0 ? 4 : 5;
                            t("#voyager-top-ad-banner").children().length >= n && (l = t("#voyager-page-body").offset().top, v.debug("game slot offset: " + l), clearInterval(e))
                        }, 1e3)
                    }

                    function x() {
                        t("#voyager-page-body").css("height", "50vh"), o.on(p.scrollScreen, T), f = t("#voyager-top-ad-banner").offset().top, l = t("#voyager-page-body").offset().top
                    }

                    function T() {
                        var e = c ? l : f;
                        t("#voyager-top-ad-banner").focus(N(e, 500)), v.debug("scrolling to: " + e), c = !c
                    }

                    function N(e, n) {
                        t("#voyager-game-page").animate({
                            scrollTop: e
                        }, n)
                    }

                    function C() {
                        var e = 0;
                        s.getElementById("voyager-game-page").onscroll = function() {
                            var n = t("#voyager-game-page"),
                                r = n.scrollTop();
                            r < e && (v.debug("scrolling top"), n.scrollTop(0, 0)), e = r
                        }
                    }

                    function k() {
                        g || (g = A()), g.showAd()
                    }

                    function L() {
                        try {
                            o.on(p.voyagerAdCall, h), o.on(p.voyagerAdFinished, y), s.addEventListener(p.adClosed, w), k()
                        } catch (e) {
                            v.error(e)
                        }
                    }

                    function A() {
                        var e = {
                            slotId: d.rightBanner,
                            voyager: u._getVoyagerAdConfig(),
                            disableCompanionAds: !0,
                            vastBaseUrl: "//pubads.g.doubleclick.net/gampad/ads",
                            vastUrlQuery: {
                                iu: "/418149392/A_INGAME_POPUP",
                                ciu_szs: "",
                                env: "vp",
                                gdfp_req: 1,
                                output: "xml_vast2",
                                sz: "400x300",
                                unviewed_position_start: 1
                            }
                        };
                        return new i.SplitPageAd(e)
                    }
                    var e = !1;
                    o.on(p.softgamesReady, n)
                };
            e.prototype.gamePageModule = new y, v.debug("Added SoftgamesGamePage to Softgames-Prototype")
        } catch (b) {
            throw console && console.error("[" + h + "] " + b.message, b.stack), b
        }
    }(Softgames, SG_jQuery, SoftgamesLogger, softgamesModalWindow, window, document),
    function(e, t, n, r, i, s) {
        "use strict";
        var o = e.prototype.events,
            u = null,
            a = !1,
            f = 0,
            l = 0,
            c = "",
            h = "",
            p = "firstPage",
            d = {
                softgamesReady: "softgamesReady",
                getNewFirstPage: "getNewFirstPage",
                firstPageLoaded: "firstPageLoaded"
            };
        try {
            if (!e) throw new Error("No Softgames variable defined!");
            if (!n) throw new Error("SoftgamesLogger not defined!");
            if (!t) throw new Error("No SG_jQuery defined!");
            if (!o) throw new Error("No eventManager defined!");
            var v = new n(p),
                m = function() {
                    function e(e) {
                        try {
                            u = e, n()
                        } catch (t) {
                            v.error(t)
                        }
                    }

                    function n() {
                        try {
                            o.on(d.firstPageLoaded, r), o.on(d.getNewFirstPage, w), v.debug("Added all event listeners")
                        } catch (e) {
                            e.message = "connectEventListener: " + e.message, v.error(e)
                        }
                    }

                    function r() {
                        t("#voyager-first-page").addClass("voyager-gray-background");
                        switch (p()) {
                            case "version_a":
                                c = "A", h = "/418149392/A_GAME_DETAIL_2", m();
                                break;
                            case "version_b":
                                c = "B", h = "/418149392/A_GAME_DETAIL_PAGE_3", m();
                                break;
                            case "version_c":
                                c = "C", h = "/418149392/A_GAME_DETAIL_C", t(".voyager-bg-stripes").removeClass("voyager-bg-stripes"), s(), m();
                                break;
                            case "version_d":
                                s();
                                break;
                            case "version_e":
                                c = "E", h = "/418149392/A_GAME_DETAIL_C", t(".voyager-bg-stripes").removeClass("voyager-bg-stripes"), s(), t(".voyager-play-button").hide(), t("#voyager-first-page").on("scroll", y), m()
                        }
                    }

                    function s() {
                        t("#voyager-footer-container-1").attr("id", "voyager-footer-container-1-gray"), t("#voyager-footer-container-2").attr("id", "voyager-footer-container-2-gray")
                    }

                    function p() {
                        var e = u.gameDetailsPageVersion;
                        return e == "version_z" ? e = t(".voyager-first-page-version").attr("id") : e == "version_x" && (a ? e = u.second_details_page : e = u.first_details_page), v.debug("Handling first page version: " + e), e
                    }

                    function m() {
                        var e = Math.random() * 100;
                        u.cpm_star_ad_at_bottom != 0 && e <= u.cpm_star_ad_at_bottom ? (v.debug("Displaying CPMStar ad at the bottom of the page"), g("/418149392/dfp-final-backfill-game-detail", [300, 250], "top-ad"), g(h, [300, 250], "bottom-ad")) : (v.debug("Displaying CPMStar ad at the top of the page"), g(h, [300, 250], "top-ad"), g("/418149392/dfp-final-backfill-game-detail", [300, 250], "bottom-ad"))
                    }

                    function g(e, t, n) {
                        googletag.cmd.push(function() {
                            googletag.defineSlot(e, t, n).addService(googletag.pubads()), googletag.pubads().setTargeting("partner", u.subplatform), googletag.pubads().setTargeting("game", u.game_slug), googletag.pubads().setTargeting("affgame", u._shortAgentGameName(u.subplatform, u.game_slug)), googletag.pubads().setTargeting("lang", u.locale), googletag.pubads().setTargeting("affiliate", null), googletag.pubads().setTargeting("pg-ids", u._getPgIds()), googletag.pubads().setTargeting("pg-names", u._getPgNames()), googletag.pubads().setTargeting("adfirst", c), googletag.pubads().enableSingleRequest(), googletag.enableServices()
                        }), googletag.cmd.push(function() {
                            googletag.display(n)
                        })
                    }

                    function y() {
                        b(t("#voyager-game-image")) && l >= 1 && (v.debug("Top of page is visible!"), f++), b(t("#voyager-footer-container-1-gray")) && (v.debug("Bottom of page is visible!"), l++), f >= 1 && l >= 1 && t(".voyager-play-button").show()
                    }

                    function b(e) {
                        var n = t(e),
                            r = t(i),
                            s = r.scrollTop(),
                            o = s + r.height(),
                            u = n.offset().top,
                            a = u + n.height();
                        return a <= o && u >= s
                    }

                    function w() {
                        E(function() {
                            u.playClickedCounter++, v.debug("Now displaying second details page: ", u.second_details_page), a = !0;
                            var e = t(".voyager-success-btn");
                            e.attr("id", "old-play-button").css("hidden", "hidden"), t("html").append(e), t("body").html(u.first_page_templates[u.second_details_page]);
                            var n = u._randomId();
                            t("#voyager-ad-content").attr("id", "voyager-ad-content_" + n), u._showAd(u.pageGameDetails, n), r();
                            var i = !1;
                            t(".voyager-success-btn").one("click", function(e) {
                                !i && u.second_details_page != "version_b" && (i = !0, t("#old-play-button").click())
                            })
                        })
                    }

                    function E(e) {
                        if (u.displayedBanner || u.showAdPreroll !== "true" || u.skipAds) e();
                        else {
                            u._beforeDisplayPreroll(), t("#voyager-menu-button-container").toggle(), u._trackAction("prerollAdPopup/" + u.adRefreshCount), u._trackEvent("prerollAdPopopShown");
                            var n = u._randomId();
                            u._buildAdPopup(n, function() {
                                SG_jQuery("#voyager-menu-button-container").toggle(), e()
                            }), u.ChannelId = u.afg_cc_id, u.ChannelTvId = u.tv_cc_id, u.bannerId = u.bannerIdPrerollAdPopup, t.ActiveAdBlocker && u.showAdBlockerInfo == "true" ? u._displayAdBlockerInfo(!1, "voyager-ad-popup", function() {
                                u.closeButton.click(), u.displayedBanner = !1, e()
                            }) : u._showAd("second_preroll", n, function(e) {
                                u._trackEvent("prerollAdPopopClosed" + e), u.closeButton.click()
                            })
                        }
                    }
                    o.on(d.softgamesReady, e)
                };
            e.prototype.firstPageModule = new m, v.debug("Added SoftgamesFirstPage to Softgames-Prototype")
        } catch (g) {
            throw console && console.error("[" + p + "] " + g.message, g.stack), g
        }
    }(Softgames, SG_jQuery, SoftgamesLogger, softgamesModalWindow, window, document),
    function(e, t, n, r, i, s) {
        "use strict";
        var o = e.prototype.events,
            u = null,
            a = "conversionPopup",
            f = {
                softgamesReady: "softgamesReady",
                modalWindowClosed: "modalWindowClosed",
                modalWindowOpened: "modalWindowOpened"
            };
        try {
            if (!e) throw new Error("No Softgames variable defined!");
            if (!n) throw new Error("SoftgamesLogger not defined!");
            if (!r) throw new Error("SoftgamesModalWindow not defined!");
            if (!t) throw new Error("No SG_jQuery defined!");
            if (!o) throw new Error("No eventManager defined!");
            var l = new n(a),
                c, h = function() {
                    function e() {
                        return c || (c = r.getModalWindow(a)), c
                    }

                    function n(e) {
                        try {
                            u = e
                        } catch (t) {
                            l.error(t)
                        }
                    }
                    this.showPopup = function(n) {
                        function r() {
                            try {
                                o.remove(f.modalWindowOpened, r), t("#conversion-modal-window .conversion-ok-button").click(a.close)
                            } catch (e) {
                                l.error(e)
                            }
                        }

                        function i() {
                            try {
                                o.remove(f.modalWindowClosed, i)
                            } catch (e) {
                                l.error(e)
                            }
                            try {
                                n(), l.debug("Conversion callback called")
                            } catch (e) {
                                l.error(e)
                            }
                        }
                        l.debug("Show conversion popup ...");
                        try {
                            var s = u.conversionModalWindowContent,
                                a = e();
                            o.on(f.modalWindowOpened, r), o.on(f.modalWindowClosed, i), a.open("conversion", s)
                        } catch (c) {
                            l.error(c), n()
                        }
                    }, o.on(f.softgamesReady, n)
                };
            e.prototype.conversionPopup = new h, l.debug("Added conversionPopup to Softgames-Prototype")
        } catch (p) {
            throw console && console.error("[" + a + "] " + p.message, p.stack), p
        }
    }(Softgames, SG_jQuery, SoftgamesLogger, softgamesModalWindow, window, document),
    function(e, t, n) {
        "use strict";
        var r = e.prototype.events,
            i = "adBlocker",
            s = {
                softgamesReady: "softgamesReady",
                trackerInitiated: "trackerInitiated"
            };
        try {
            if (!e) throw new Error("No Softgames variable defined!");
            if (!t) throw new Error("SoftgamesLogger not defined!");
            if (!n) throw new Error("No SG_jQuery defined!");
            if (!r) throw new Error("No eventManager defined!");
            var o = new t(i),
                u = function() {
                    function f() {
                        return e
                    }

                    function l() {
                        return n.ActiveAdBlocker === !0
                    }

                    function c(e) {
                        if (t === undefined) throw new Error("No tracker defined!");
                        t.postEvent("ad-blocker-detection", {
                            game: i,
                            country: u,
                            partner: a,
                            detected: e
                        }), o.debug("adblocker tracker event sent")
                    }

                    function h(n) {
                        t = n.trackerHandler, i = n.game_slug, a = n.subplatform, u = n.country, e = !0
                    }

                    function p() {}
                    var e = !1,
                        t = undefined,
                        i = undefined,
                        u = undefined,
                        a = undefined;
                    r.on(s.softgamesReady, h), r.on(s.trackerInitiated, p)
                };
            e.prototype.adBlockerHandler = new u, o.debug("Added adBlockerHandler to Softgames-Prototype")
        } catch (a) {
            throw console && console.error("[" + i + "] " + a.message, a.stack), a
        }
    }(Softgames, SoftgamesLogger, SG_jQuery),
    function(e, t, n) {
        "use strict";
        var r = e.prototype.events,
            i = "famobi",
            s = {
                softgamesReady: "softgamesReady",
                famobiLoaded: "famobiLoaded",
                highscoresLoaded: "highscoresLoaded",
                gameLevelFinished: "levelFinished"
            };
        try {
            if (!e) throw new Error("No Softgames variable defined!");
            if (!t) throw new Error("SoftgamesLogger not defined!");
            if (!n) throw new Error("No SG_jQuery defined!");
            if (!r) throw new Error("No eventManager defined!");
            var o = new t(i),
                u = function() {
                    function c() {
                        return t
                    }

                    function h() {
                        return i
                    }

                    function p(e) {
                        u = e, a = u.famobi_game_id, t = !0, d() === !0 && (g(), o.debug("initiated"))
                    }

                    function d() {
                        try {
                            var e = u._getUrlParameters();
                            if (e.fg_domain !== undefined && e.fg_uid !== undefined && e.fg_pid !== undefined || e.kg_domain !== undefined && e.kg_uid !== undefined) return !0
                        } catch (t) {
                            o.debug(t)
                        }
                        return !1
                    }

                    function v() {
                        return window.famobi !== undefined
                    }

                    function m() {
                        f = setInterval(function() {
                            v() === !0 && (clearInterval(f), r.fire(s.famobiLoaded))
                        }, 500)
                    }

                    function g() {
                        window.famobi_gameID = a, window.famobi_gameJS = [], n.getScript(e).done(function(e, t) {
                            o.debug("API loaded"), m()
                        })
                    }

                    function y() {
                        u.highscoresHandler.isInitiated() && u.highscoresHandler.switchOff(), r.on(s.gameLevelFinished, E), i = !0, o.debug("Highscores initiated")
                    }

                    function b() {
                        o.debug("FaMobi API loaded"), l = window.famobi, y()
                    }

                    function w(e, t) {
                        if (h()) try {
                            l.submitHighscore(e, t), o.debug("Score submited - level: " + e + " score: " + t)
                        } catch (n) {
                            o.debug(n)
                        }
                    }

                    function E(e) {
                        c() && w(e.level, e.score)
                    }
                    var e = "http://games.cdn.famobi.com/html5games/gameapi/v1.js?e=",
                        t = !1,
                        i = !1,
                        u = null,
                        a = null,
                        f = null,
                        l = null;
                    r.on(s.softgamesReady, p), r.on(s.famobiLoaded, b), r.on(s.highscoresLoaded, y)
                };
            e.prototype.famobiHandler = new u, o.debug("Added famobiHandler to Softgames-Prototype")
        } catch (a) {
            throw console && console.error("[" + i + "] " + a.message, a.stack), a
        }
    }(Softgames, SoftgamesLogger, SG_jQuery),
    function() {
        window.b || (window.b = {}), window.version_app = "force", I18n.fallbacks = !0, Softgames.prototype.AVATARS = {
            blank: {
                image_url: "//d3tlss08qwqpkt.cloudfront.net/assets/avatars/blank.png"
            },
            alien: {
                image_url: "//d3tlss08qwqpkt.cloudfront.net/assets/avatars/alien.png"
            },
            robot: {
                image_url: "//d3tlss08qwqpkt.cloudfront.net/assets/avatars/robot.png"
            },
            berlin: {
                image_url: "//d3tlss08qwqpkt.cloudfront.net/assets/avatars/berlin.png"
            },
            diver: {
                image_url: "//d3tlss08qwqpkt.cloudfront.net/assets/avatars/diver.png"
            },
            fireman: {
                image_url: "//d3tlss08qwqpkt.cloudfront.net/assets/avatars/fireman.png"
            },
            grimace: {
                image_url: "//d3tlss08qwqpkt.cloudfront.net/assets/avatars/grimace.png"
            },
            miki: {
                image_url: "//d3tlss08qwqpkt.cloudfront.net/assets/avatars/miki.png"
            },
            mom: {
                image_url: "//d3tlss08qwqpkt.cloudfront.net/assets/avatars/mom.png"
            },
            sad: {
                image_url: "//d3tlss08qwqpkt.cloudfront.net/assets/avatars/sad.png"
            },
            soldier: {
                image_url: "//d3tlss08qwqpkt.cloudfront.net/assets/avatars/soldier.png"
            }
        }, SG_jQuery('<link rel="stylesheet" type="text/css" href="./4399/assets/voyager-2b520452a78a849fd3dc6d011f82653d.css" >').appendTo("head"), Softgames.prototype.defaultSubsystem = "m.softgames.de", Softgames.prototype.embedGame = !1, Softgames.prototype.enabledDebugLog = !1, Softgames.prototype.changeScreenSize = null, Softgames.prototype.changeScreenOrientation = null, Softgames.prototype.externalStyles = "", Softgames.prototype.customGameHeader = "", Softgames.prototype.splashScreenLogoLoaded = !1, Softgames.prototype.splashScreenLogoOnload = null, Softgames.prototype.splashScreenReady = !1, Softgames.prototype.skipAds = !1, Softgames.prototype.skipIngameAds = !1, Softgames.prototype.showAdPage = !1, Softgames.prototype.showGameDetailsPageWithoutAd = !1, Softgames.prototype.showAdPreroll = !1, Softgames.prototype.ingame_menu = "", Softgames.prototype.displayedBanner = !1, Softgames.prototype.externalGACode = "", Softgames.prototype.gaAnonymizingIp = !1, Softgames.prototype.hideMoreGamesButton = !1, Softgames.prototype.enableAbAdFirstGameDpage = !1, Softgames.prototype.displayBannerLastTime = 0, Softgames.prototype.displayBannerInterval = 45e3, Softgames.prototype.endLevelEventCounter = 0, Softgames.prototype.endLevelEventCountInterval = 0, Softgames.prototype.enabledEndLevelFlow = !0, Softgames.prototype.displayEndLevelLastTime = 0, Softgames.prototype.displayEndLevelInterval = 45e3, Softgames.prototype.activeEndLevelFlow = !1, Softgames.prototype.activeAfterFirstLevelAdPopup = !1, Softgames.prototype.endLevelCloseButtonTimer = 5e3, Softgames.prototype.displayLoadingPageTime = 1800, Softgames.prototype.adsConversionFlow = void 0, Softgames.prototype.adsConversionPoints = void 0, Softgames.prototype.adsConversionPointsMobile = void 0, Softgames.prototype.adsConversionPointsDesktop = void 0, Softgames.prototype.adsConversionLevel = void 0, Softgames.prototype.conversionGamePostfix = "-cpa", Softgames.prototype.gameInitCallbackToCall = !1, Softgames.prototype.closeAdBannerCallback = !1, Softgames.prototype.userCookieExpressions = 732, Softgames.prototype.isStarted = !1, Softgames.prototype.playClickedCounter = 0, Softgames.prototype.gameBubbleConfig = {
            on_start: !1,
            on_level_up: !1,
            on_game_over: !1,
            on_pause_on: !1
        }, Softgames.prototype.apiAdapter = null, Softgames.prototype.ready = function(e) {
            var t = this;
            return this.host = "m.sgc.io/", this._loadScript("./advertisement.js"), this.isStarted ? null : (this.isStarted = !0, this.selectExperiment(), this.logger = new SoftgamesVoyagerLogger, this._loadLastUserSessionLevel(), window.softgamesDocumentReady ? (this.system_id = this._getSystemId(), this.game_slug = this._getGameSlug(), this._isOperamini() ? this._redirectToOperaminiFallback() : this._init(function(e) {
                var n, r;
                return t._getUrlParameters().voyager_debug === "1" && (t.enabledDebugLog = !0), t._trackEvent("ready", t.locale), t._trackIframe(), t.events.fire("softgamesReady", t), t._isiPhone() && !t._hasAppleMetaTag() && t._addAppleMetaTag(), r = SG_jQuery("head"), t._addExternalStyles(r), t.external_js_filename && t._loadScript(t.external_js_filename, !1), n = "./4399/c3po.js", t.adsConfigurations && (n = "./4399/c3po2.js"), t._loadScript(n + "?_t=" + Math.random(), function() {
                    return t.events.fire("adManagerLoaded", t), t._start(function() {
                        return t._loadingFlowNextStep(function() {
                            return typeof e == "function" && e(), t.system_id === "kirk" && t._createKirkIframe(function(e) {
                                return t._requestUserData(t, e), t._initSystem()
                            }), t.gameInitCallback ? typeof t.gameInitCallback == "function" ? t.gameInitCallback() : void 0 : t.gameInitCallbackToCall = !0
                        })
                    })
                })
            })) : setTimeout(function() {
                return t.ready()
            }, 500))
        }, Softgames.prototype._start = function(e) {
            return e()
        }, Softgames.prototype.gameId = function() {
            return this.gid
        }, Softgames.prototype.isEnabledIncentiviseButton = function() {
            return this.showIncentiviseButtonInGame === !0
        }, Softgames.prototype.displayBanner = function(e) {
            return this._displayIngameAdPopup(e)
        }, Softgames.prototype.setGameInitCallback = function(e) {
            this.gameInitCallback = e;
            if (this.gameInitCallbackToCall) return typeof this.gameInitCallback == "function" ? this.gameInitCallback() : void 0
        }, Softgames.prototype._endLevelFlowNextStep = function(e) {
            return this.nextstep = this.endLevelFlowOrder[this.endLevelFlowStep], this.nextstep !== void 0 ? (this.endLevelFlowStep += 1, this.nextstep(e)) : this._quitEndLevelFlow(e)
        }, Softgames.prototype._startEndLevelFlow = function(e) {
            return this._tooShortEndLevelInterval() === !1 && this.activeEndLevelFlow === !1 ? (this.activeEndLevelFlow = !0, this.endLevelFlowStep = 0, this._endLevelFlowNextStep(e)) : typeof e == "function" ? e() : void 0
        }, Softgames.prototype._quitEndLevelFlow = function(e) {
            return this.endLevelFlowStep = this.endLevelFlowOrder.length + 1, this.activeEndLevelFlow = !1, this.displayEndLevelLastTime = SG_jQuery.now(), SG_jQuery(window).scrollTop(0), this._destroyLoadingPage(), typeof e == "function" ? e() : void 0
        }, Softgames.prototype._loadingFlowNextStep = function(e) {
            return this.nextstep = this.loadingFlowOrder[this.loadingFlowStep], this.nextstep !== void 0 ? (this.loadingFlowStep += 1, this.nextstep(e)) : (this.showMenu && this.ingame_menu !== "" && this._buildMenu(), this.gameBubbleConfig.on_start && window.addToHome.show(!0), typeof e == "function" ? e() : void 0)
        }, Softgames.prototype._redirectToOperaminiFallback = function() {
            var e;
            return e = "//" + this.host + "/" + this._getSystemName() + "/fallbacks/operamini?id=" + this.game_slug, window.location.href = e
        }, Softgames.prototype._trackIframe = function() {
            var e;
            return e = "notInIframe", this._inIframe() && (e = "inIframe"), this._trackEvent(e, "" + this.subplatform + "-" + document.referrer)
        }, Softgames.prototype._displayAdBlockerInfo = function(e, t, n) {
            return this._trackAction("adBlockerInfo/" + this.adRefreshCount), this._buildAdBlockerInfo(e, t, n)
        }, Softgames.prototype._displayGameDetailsPage = function(e) {
            var t, n, r = this;
            if (this.showAdPage !== "true" || this.skipAds === !0 && (this.showGameDetailsPageWithoutAd === undefined || this.showGameDetailsPageWithoutAd === !1)) return this.embedGameFN() ? (this._dumpGameBody(), this._displayGamePage(), n = SG_jQuery("#voyager-page-body"), this._restoreGameBody(function() {
                return r._loadingFlowNextStep(e)
            }, n)) : this._loadingFlowNextStep(e);
            t = this._randomId(), this._trackAction("gameDetailsPage"), this._dumpGameBody(), this._buildGameDetailsPage(t, function() {
                return r.displayBannerLastTime = 0, r._loadingFlowNextStep(e)
            }), this.ChannelId = this.afc_unit_details_page_id, this.bannerId = this.bannerIdGameDetailsPage, this.enableAbAdFirstGameDpage === !0 && (Softgames.prototype.enabledExperimentName = this.selectedExperimentName(), this.enabledExperimentName === "ADFIRST_TRUE" && SG_jQuery(".details-info-part").css("visibility", "hidden")), SG_jQuery.ActiveAdBlocker && this.showAdBlockerInfo === "true" ? this._displayAdBlockerInfo(!0) : this.showGameDetailsPageWithoutAd || this._showAd(Softgames.prototype.pageGameDetails, t);
            if (this.enableAbAdFirstGameDpage === !0 && this.enabledExperimentName === "ADFIRST_TRUE") return setTimeout(function() {
                return SG_jQuery(".details-info-part").css("visibility", "visible").hide().fadeTo(1e3, 1)
            }, 3e3)
        }, Softgames.prototype._displayGamePage = function(e) {
            var t, n;
            return this._trackAction("gamePage"), n = this._randomId(), t = this._randomId(), this._buildGamePage(n, t)
        }, Softgames.prototype._displayLoadingPage = function(e) {
            var t = this;
            return this._buildLoadingPage(), setTimeout(function() {
                return t._endLevelFlowNextStep(e)
            }, this.displayLoadingPageTime)
        }, Softgames.prototype._enabledEndLevelFlow = function() {
            return this.enabledEndLevelFlow === !0 && this.activeAfterFirstLevelAdPopup === !1 && this.skipAds !== !0 && (this.endLevelEventCounter + 1) % this.endLevelEventCountInterval === 0 ? !0 : !1
        }, Softgames.prototype._displayEndLevelPopup = function(e) {
            var t = this;
            return this.endLevelEventCounter = this.endLevelEventCounter + 1, this._trackAction("endLevelPopup"), this._buildEndLevelPopup(function() {
                return t._endLevelFlowNextStep(e)
            }, function() {
                return t._quitEndLevelFlow(function() {
                    return t._displayOnCloseEndLevelAdPopup(e)
                })
            })
        }, Softgames.prototype._displayMoreGamesPage = function(e) {
            var t, n = this;
            return this._trackAction("displayMoreGames-A/" + this.adRefreshCount), t = this._randomId(), this._destroyLoadingPage(), this._dumpGameBody(), this._buildMoreGamesPage(t, function() {
                return n._endLevelFlowNextStep(e)
            }), this.ChannelId = this.afc_unit_more_games_page_id, this.bannerId = this.bannerIdMoreGamesPage, SG_jQuery.ActiveAdBlocker && this.showAdBlockerInfo === "true" ? this._displayAdBlockerInfo(!0) : this._showAd(Softgames.prototype.pageMoreGames, t)
        }, Softgames.prototype._displayOnCloseEndLevelAdPopup = function(e) {
            var t, n = this;
            return this._displayBannerShortInterval() || this.displayedBanner === !0 || this.skipAds === !0 || this._adblockerSkipAds() ? typeof e == "function" ? e() : void 0 : (SG_jQuery("#voyager-menu-button-container").toggle(), this._trackAction("closeEndLevelAdPopup/" + this.adRefreshCount), this._trackEvent("endlevelAdPopopShown"), t = this._randomId(), this._buildAdPopup(t, function() {
                return SG_jQuery("#voyager-menu-button-container").toggle(), typeof e == "function" ? e() : void 0
            }), this.ChannelId = this.afg_cc_id, this.ChannelTvId = this.tv_cc_id, this.bannerId = this.bannerIdOnCloseEndLevelAdPopup, this.displayedBanner = !1, SG_jQuery.ActiveAdBlocker && this.showAdBlockerInfo === "true" ? this._displayAdBlockerInfo(!1, "voyager-ad-popup", function() {
                return n.closeButton.click(), n.displayedBanner = !1, SG_jQuery("#voyager-menu-button-container").toggle(), typeof e == "function" ? e() : void 0
            }) : this._showAd(Softgames.prototype.popupIngame, t, function(e) {
                return e !== void 0 && n._trackEvent("endLevelAdPopopClosed" + e), n.closeButton.click()
            }))
        }, Softgames.prototype._beforeDisplayPreroll = function() {
            return this.logger.log("before display preroll callback"), typeof this.beforeDisplayPrerollCallback == "function" ? this.beforeDisplayPrerollCallback() : void 0
        }, Softgames.prototype._onShowAd = function(e) {
            var t = this;
            return this.logger.log("on show ad callback"), this.onShowAdCallback ? this.onShowAdCallback(function() {
                return typeof e == "function" && e(), t.logger.log("after show ad callback")
            }) : typeof e == "function" ? e() : void 0
        }, Softgames.prototype._onTriggerConversion = function() {
            var e = this;
            if (this.onTriggerConversionCallback) return this.logger.log("before trigger conversion callback"), setTimeout(function() {
                return e.onTriggerConversionCallback(function() {}), e.logger.log("after trigger conversion callback")
            }, 1e3)
        }, Softgames.prototype._onLevelUp = function(e) {
            var t = this;
            if (this.triggerLevelUpCallback && this.onLevelUpCallback) return this.logger.log("before level up callback"), this.onLevelUpCallback(e, function() {
                return t.logger.log("after level up callback")
            })
        }, Softgames.prototype._displayPrerollAdPopup = function(e) {
            var t, n = this;
            return this._displayBannerShortInterval() || this.displayedBanner === !0 || this.showAdPreroll !== "true" || this.skipAds === !0 || this._adblockerSkipAds() ? this._loadingFlowNextStep(e) : (this._beforeDisplayPreroll(), SG_jQuery("#voyager-menu-button-container").toggle(), this._trackAction("prerollAdPopup/" + this.adRefreshCount), this._trackEvent("prerollAdPopopShown"), t = this._randomId(), this._buildAdPopup(t, function() {
                return SG_jQuery("#voyager-menu-button-container").toggle(), n._loadingFlowNextStep(e)
            }), this.ChannelId = this.afg_cc_id, this.ChannelTvId = this.tv_cc_id, this.bannerId = this.bannerIdPrerollAdPopup, SG_jQuery.ActiveAdBlocker && this.showAdBlockerInfo === "true" ? this._displayAdBlockerInfo(!1, "voyager-ad-popup", function() {
                return n.closeButton.click(), n.displayedBanner = !1, n._loadingFlowNextStep(e)
            }) : this._showAd(Softgames.prototype.popupPreroll, t, function(e) {
                return e !== void 0 && n._trackEvent("prerollAdPopopClosed" + e), n.closeButton.click()
            }))
        }, Softgames.prototype._displayAfterFirstLevelAdPopup = function(e) {
            var t, n = this;
            return this.displayedBanner === !0 || this._afterFirstLevelAdDisplayed || this.displayAdAfterFirstLevel !== !0 || this.skipAds === !0 || this._adblockerSkipAds() ? typeof e == "function" ? e() : void 0 : (this.activeAfterFirstLevelAdPopup = !0, SG_jQuery("#voyager-menu-button-container").toggle(), this._trackAction("prerollAdPopup/" + this.adRefreshCount), this._trackEvent("prerollAdPopopShown"), t = this._randomId(), this._afterFirstLevelAdDisplayed = !0, this._buildAdPopup(t, function() {
                return SG_jQuery("#voyager-menu-button-container").toggle(), n.activeAfterFirstLevelAdPopup = !1, n.displayedBanner = !1, typeof e == "function" ? e() : void 0
            }), this.ChannelId = this.afg_cc_id, this.ChannelTvId = this.tv_cc_id, this.bannerId = this.bannerIdPrerollAdPopup, SG_jQuery.ActiveAdBlocker && this.showAdBlockerInfo === "true" ? this._displayAdBlockerInfo(!1, "voyager-ad-popup", function() {
                return n.closeButton.click()
            }) : this._showAd(Softgames.prototype.popupPreroll, t, function(e) {
                return e !== void 0 && n._trackEvent("prerollAdPopopClosed" + e), n.closeButton.click()
            }))
        }, Softgames.prototype._displayIngameAdPopup = function(e) {
            var t, n = this;
            return this._displayBannerShortInterval() || this.displayedBanner === !0 || this.skipAds === !0 || this.skipIngameAds === !0 || this._adblockerSkipAds() ? typeof e == "function" ? e() : void 0 : (this.endLevelEventCounter = this.endLevelEventCounter + 1, SG_jQuery("#voyager-menu-button-container").toggle(), this._trackAction("ingameAdPopup/" + this.adRefreshCount), this._trackEvent("ingameAdPopopShown"), t = this._randomId(), this._buildAdPopup(t, function() {
                return SG_jQuery("#voyager-menu-button-container").toggle(), typeof e == "function" ? e() : void 0
            }), this.ChannelId = this.afg_cc_id, this.ChannelTvId = this.tv_cc_id, this.bannerId = this.bannerIdIngameAdPopup, SG_jQuery.ActiveAdBlocker && this.showAdBlockerInfo === "true" ? this._displayAdBlockerInfo(!1, "voyager-ad-popup", function() {
                return SG_jQuery("#voyager-menu-button-container").toggle(), typeof e == "function" && e(), n.closeButton.click()
            }) : this._showAd(Softgames.prototype.popupIngame, t, function(e) {
                return e !== void 0 && n._trackEvent("ingameAdPopopClosed" + e), n.closeButton.click()
            }))
        }, Softgames.prototype._displayIncentiviseAdPopup = function(e) {
            var t, n = this;
            return SG_jQuery("#voyager-menu-button-container").toggle(), this._trackAction("incentiviseAdPopup"), this._trackEvent("incentiviseAdPopopShown"), t = this._randomId(), this._buildAdPopup(t, function() {
                return SG_jQuery("#voyager-menu-button-container").toggle()
            }), SG_jQuery.ActiveAdBlocker && this.showAdBlockerInfo === "true" ? this._displayAdBlockerInfo(!1, "voyager-ad-popup", function() {
                return SG_jQuery("#voyager-menu-button-container").toggle(), n.closeButton.click()
            }) : this._showAd(Softgames.prototype.popupIncentivise, t, function(t) {
                return t !== void 0 && n._trackEvent("incentiviseAdPopopClosed" + t), typeof e == "function" && e(t === "ByTimeout" || t === "ByUserAdClicked"), n.closeButton.click()
            }, !1)
        }, Softgames.prototype._displayBannerShortInterval = function() {
            return SG_jQuery.now() - this.displayBannerLastTime < this.displayBannerInterval
        }, Softgames.prototype._tooShortEndLevelInterval = function() {
            return SG_jQuery.now() - this.displayEndLevelLastTime < this.displayEndLevelInterval
        }, Softgames.prototype._buildMenu = function() {
            var e, t = this;
            return SG_jQuery("body").append(this.ingame_menu), e = SG_jQuery("#voyager-menu-button"), this._registerClick(e, function(e) {
                var n, r;
                return e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), n = document.getElementById("voyager-menu-container"), classie.toggle(n, "cbp-spmenu-open"), r = SG_jQuery("#voyager-menu-button").css("opacity") === "1" ? "0.5" : "1", SG_jQuery("#voyager-menu-button").css({
                    opacity: r
                }), t._trackMenuClickEvent(), e.cancelBubble = !0, !1
            })
        }, Softgames.prototype._trackMenuClickEvent = function() {
            var e, t;
            return t = document.getElementById("voyager-menu-container"), e = "menuClosed", t && t.classList.contains("cbp-spmenu-open") && (e = "menuOpened"), this._trackEvent(e)
        }, Softgames.prototype._addExternalStyles = function(e) {
            var t;
            if (this.externalStyles === "") return;
            return t = SG_jQuery(document.createElement("style")), t.text(this.externalStyles), e.append(t)
        }, Softgames.prototype._loadScript = function(e, t) {
            var n, r, i = this;
            return r = document.createElement("script"), r.async = "async", n = !1, r.onload = r.onreadystatechange = function() {
                if (r.readyState && !/complete|loaded/.test(r.readyState) || n) return;
                return n = !0, r.onload = r.onreadystatechange = null, typeof t == "function" ? t() : void 0
            }, r.src = e, this._appendToHead(r)
        }, Softgames.prototype._appendToHead = function(e) {
            var t;
            return t = document.head || document.getElementsByTagName("head")[0] || document.documentElement, t.insertBefore(e, t.firstChild)
        }, Softgames.prototype._getBanner = function(e, t) {
            var n = this;
            return this.openx === undefined ? e() : this.openx.receiveAdCodes({
                banner: this.bannerId
            }, t, function(t) {
                if (!t.banner) {
                    typeof e == "function" && e();
                    return
                }
                return e(t.banner)
            })
        }, Softgames.prototype._buildLoadingPage = function(e) {
            return SG_jQuery("body").append(this.loading_page)
        }, Softgames.prototype._destroyLoadingPage = function() {
            var e;
            return e = SG_jQuery(".voyager-popup"), e.remove()
        }, Softgames.prototype._buildAdPopup = function(e, t) {
            var n = this;
            return this.displayedBanner = !0, SG_jQuery("body").append(this.ingame_ad_popup), this._changeAdContainerId(e), this.adOverlayContainer = SG_jQuery("#voyager-ad-popup"), this.closeButton = SG_jQuery("#voyager-close-popup-btn"), this._registerClick(this.closeButton, function(e) {
                return e.preventDefault(), n._closeAdBanner(t)
            })
        }, Softgames.prototype._buildAdBlockerInfo = function(e, t, n) {
            var r = this;
            return SG_jQuery("#voyager-ad-container").html(""), SG_jQuery("#voyager-ad-container").append(this.adblocker_info), e && SG_jQuery("#voyager-close-btn-container").hide(), this.adOverlayContainer = SG_jQuery("#" + t), this.closeButton = SG_jQuery("#voyager-close-adblocker-info-btn"), this._registerClick(this.closeButton, function(e) {
                return e.preventDefault(), r._closeAdBlockerInfo(n)
            })
        }, Softgames.prototype._buildEndLevelPopup = function(e, t) {
            var n, r, i, s = this;
            return SG_jQuery("body").append(this.end_level_popup), this.endLevelCloseButton = SG_jQuery("#voyager-close-button"), this._registerClick(this.endLevelCloseButton, function(e) {
                return e.preventDefault(), clearTimeout(s.closeButtonTimer), SG_jQuery(".voyager-popup").remove(), s._trackEvent("endGameCloseButtonClicked"), typeof t == "function" ? t() : void 0
            }), this.game_rating ? SG_jQuery("#voyager-like-btn-container").hide() : SG_jQuery("#voyager-rating-info-container").hide(), this._isiPhone() && (r = SG_jQuery("#voyager-whatsapp-container").show(), n = encodeURIComponent("Play with me " + this.gameTitle + "!" + document.location.href), i = SG_jQuery(".voyager-whatsapp-btn"), this._registerClick(i, function(e) {
                return e.preventDefault(), s._trackEvent("whatsapp"), setTimeout(function() {
                    return document.location = "whatsapp://send?text=" + n
                }, 500)
            })), this.dislikeButton = SG_jQuery("#voyager-dislike-btn"), this._registerClick(this.dislikeButton, function(e) {
                return e.preventDefault(), s.apiAdapter.rate(1), s.game_rating = 1, s._displayLikeInfo()
            }), this.likeButton = SG_jQuery("#voyager-like-btn"), this._registerClick(this.likeButton, function(e) {
                return e.preventDefault(), s.apiAdapter.rate(5), s.game_rating = 5, s._displayLikeInfo()
            }), this.endLevelCloseButton.hide(), this.closeButtonTimer = setTimeout(function() {
                return s.endLevelCloseButton.show()
            }, this.endLevelCloseButtonTimer), this.playButton = SG_jQuery("#voyager-more-games-btn"), this._registerClick(this.playButton, function(t) {
                return s._trackEvent("endGameMoreGamesButtonClicked"), t.preventDefault(), clearTimeout(s.closeButtonTimer), typeof e == "function" ? e() : void 0
            })
        }, Softgames.prototype._displayLikeInfo = function() {
            return SG_jQuery("#voyager-like-btn-container").hide(), SG_jQuery("#voyager-like-info-container").show()
        }, Softgames.prototype._changeAdContainerId = function(e) {
            return this.adContainerId = this._adContentId(e), this.adId = e, SG_jQuery("#voyager-ad-content").attr("id", this._adContentId(e))
        }, Softgames.prototype._buildMoreGamesPage = function(e, t) {
            var n, r, i, s, o, u, a = this;
            return i = this.more_games_page_a, SG_jQuery("body").append(i), this._changeAdContainerId(e), n = SG_jQuery("#voyager-play-again-btn"), this._registerClick(n, function(e) {
                return e.preventDefault(), a._trackEvent("moreGamesPlayAgainClicked"), a._trackEvent("play-again-A"), a._restoreGameBody(t, SG_jQuery("body"))
            }), u = SG_jQuery("#voyager-score-value"), this.highscoresHandler.isInitiated() && u.html(this.highscoresHandler.currentBestScore()), o = SG_jQuery("#voyager-ranking-value"), s = Math.floor(Math.random() * 10001) + 1, o.html("#" + s), r = SG_jQuery(".voyager-game-info-container"), SG_jQuery.each(r, function(e, t) {
                return a._registerClick(SG_jQuery(r[e]), function(e) {
                    return e.preventDefault(), a._trackEvent("goto-similar-game-A"), setInterval(function() {
                        return document.location = t
                    }, 500)
                })
            })
        }, Softgames.prototype._shouldGamePageBeLoaded = function() {
            return this.playClickedCounter > 0 || this.gameDetailsPageVersion !== "version_x"
        }, Softgames.prototype._buildGameDetailsPage = function(e, t) {
            var n, r = this;
            return SG_jQuery("body").append(this.first_page), SG_jQuery(".voyager-game-description-first-part").lenght && SG_jQuery(".voyager-game-description-second-part").lenght && this._positionAdOnGameDetailsPage(), this._changeAdContainerId(e), n = SG_jQuery(".voyager-success-btn:not(.not-clickable)"), this._registerClick(n, function(e) {
                return e.preventDefault(), r.gameDetailsPageVersion === "version_x" ? r._shouldGamePageBeLoaded() ? r._lunchGamePage(t) : r.events.fire("getNewFirstPage") : r._lunchGamePage(t)
            }), this.events.fire("firstPageLoaded")
        }, Softgames.prototype._lunchGamePage = function(e) {
            var t;
            return t = SG_jQuery("body"), this.embedGameFN() && (this._displayGamePage(), t = SG_jQuery("#voyager-page-body")), this._restoreGameBody(e, t)
        }, Softgames.prototype._buildGamePage = function(e, t) {
            return SG_jQuery("body").html(this.game_page), SG_jQuery("#top-ad-banner").attr("id", this._adContentId(e)), SG_jQuery("#bottom-ad-banner").attr("id", this._adContentId(t))
        }, Softgames.prototype._dumpGameBody = function() {
            return this._cleanupConverionPointTracker(), this.gameBody = SG_jQuery("body").children(), this.gameBodyStyles = SG_jQuery("body").attr("style"), SG_jQuery("body").attr("style", ""), SG_jQuery("body").html("")
        }, Softgames.prototype._restoreGameBody = function(e, t) {
            var n = this;
            return t.text(""), SG_jQuery("body").attr("style", this.gameBodyStyles), this.gameBody.each(function(e, r) {
                try {
                    t.append(r)
                } catch (i) {
                    console.error("Error while restore body child " + e + ":", i)
                }
                return n.gameBody[e].parent = t
            }), this.events.fire("gameBodyRestored"), typeof e == "function" ? e() : void 0
        }, Softgames.prototype._closeAdBlockerInfo = function(e) {
            return this.adOverlayContainer.remove(), typeof e == "function" ? e() : void 0
        }, Softgames.prototype._closeAdBanner = function(e) {
            return this.adOverlayContainer.remove(), this._trackEvent("close-ad"), Softgames.prototype.events && Softgames.prototype.events.fire("closeAd"), this.displayedBanner = !1, typeof this.closeAdBannerCallback == "function" && this.closeAdBannerCallback(), typeof e == "function" ? e() : void 0
        }, Softgames.prototype._trackAction = function(e) {
            if (this.tracker !== undefined) return this.tracker.trackPageview("/" + this.social_network + "/" + this.project + "/" + e, "" + this.subplatform, this.affiliate, this.installationDate, void 0, this.userGender)
        }, Softgames.prototype._trackEvent = function(e, t, n) {
            if (this.tracker !== undefined) return this.tracker.trackEvent("" + this.social_network + "-" + this.project, e, t, n)
        }, Softgames.prototype._apiRequest = function(e, t, n, r, i) {
            var s, o, u = this;
            //return t = this._apiUrl(t, n), 
            return t="./4399.json",
            s = this, navigator.userAgent.toLowerCase().indexOf("android") >= 0 && e === "GET" && (t += "?android-buster=" + Math.random()), o = this._openXHR(e, t), o.setRequestHeader("Content-Type", "application/json-rpc"), o.setRequestHeader("Softgames-Voyager-Version", "2015-07-07 14:46:04 +0000"), o.onload = function() {
                return typeof i == "function" ? i(JSON.parse(o.responseText)) : void 0
            }, o.onerror = function() {
                return s.logger.log("Request failed.", e, t)
            }, o.send(JSON.stringify(r)), o
        }, Softgames.prototype._apiUrl = function(e, t) {
            return t = this._addToken(t), ("https:" === document.location.protocol ? "https://" : "http://") + this.host + e + "?" + this._queryString(t)
        }, Softgames.prototype._addToken = function(e) {
            return e || (e = {}), e.token = this.token, e
        }, Softgames.prototype._openXHR = function(e, t) {
            var n;
            n = new XMLHttpRequest;
            if (this._isCorsSupported(n)) n.open(e, t, !0);
            else {
                if (typeof XDomainRequest == "undefined") throw n = null, this.logger.log("CORS is not supported by the browser.", e, t), new Error("CORS not supported.");
                n = new XDomainRequest, n.open(e, t)
            }
            return n
        }, Softgames.prototype._isCorsSupported = function(e) {
            return e.withCredentials != null
        }, Softgames.prototype._queryString = function(e) {
            var t, n, r;
            e.custom_data != null && (e.custom_data = JSON.stringify(e.custom_data)), t = [];
            for (n in e) r = e[n], r != null && t.push("" + n + "=" + encodeURIComponent(r));
            return t.join("&")
        }, Softgames.prototype._registerClick = function(e, t) {
            return e.on({
                click: function(e) {
                    return t(e)
                }
            }), e.on({
                touchstart: function(e) {
                    return t(e)
                }
            })
        }, Softgames.prototype._getOpenxParams = function(e) {
            var t, n, r, i, s, o;
            t = ["social_network", "subplatform", "affiliate", "project", "os", "osv", "user_id", "gender", "purchasecount", "locale", "lang", "country", "installdays", "last_login", "friendcount", "premium_game", "subscriber"], r = {};
            for (s = 0, o = t.length; s < o; s++) n = t[s], i = e[n], i !== void 0 && (r[n] = i);
            return window.devicePixelRatio !== void 0 && (r.pixelratio = window.devicePixelRatio), r
        }, Softgames.prototype._createKirkIframe = function(e) {
            var t, n;
            return n = this.kirk_default_host, window.addEventListener("message", function(t) {
                t.data.type === "kirkReady" && (window.softgames.user = {
                    externalId: t.data.session_params.user_id,
                    authToken: t.data.session_params.k,
                    name: t.data.session_params.name,
                    known: t.data.session_params.known_user,
                    avatar: t.data.session_params.avatar
                }, SG_jQuery.cookie("ux", t.data.session_params.user_id, {
                    expires: window.softgames.userCookieExpressions,
                    path: "/"
                }), SG_jQuery.cookie("uk", t.data.session_params.k, {
                    expires: window.softgames.userCookieExpressions,
                    path: "/"
                }), window.softgames.country = t.data.session_params.country, window.softgames.returning_user = t.data.session_params.returning_user, window.softgames.premium_game = t.data.session_params.premium_game, window.softgames.externalGACode = t.data.session_params.agent_ga_code, window.softgames.gaAnonymizingIp = t.data.session_params.ga_anonymizing_ip, window.softgames.external_user_id = t.data.session_params.user_id, window.softgames.game_rating = t.data.session_params.rating, t.data.session_params.game_slug !== undefined && (window.softgames.game_slug = t.data.session_params.game_slug), t.data.session_params.ads_conversion_flow !== undefined && (window.softgames.adsConversionFlow = t.data.session_params.ads_conversion_flow), t.data.session_params.ads_conversion_user_state !== undefined && (window.softgames.adsConversionUserState = t.data.session_params.ads_conversion_user_state), t.data.session_params.ads_conversion_points_mobile !== undefined && (window.softgames.adsConversionPointsMobile = t.data.session_params.ads_conversion_points_mobile), t.data.session_params.ads_conversion_points_desktop !== undefined && (window.softgames.adsConversionPointsDesktop = t.data.session_params.ads_conversion_points_desktop), t.data.session_params.ads_conversion_level !== undefined && (window.softgames.adsConversionLevel = t.data.session_params.ads_conversion_level), t.data.session_params.banner_interval_time !== undefined && (window.softgames.displayBannerInterval = t.data.session_params.banner_interval_time), t.data.session_params.enabled_end_level_flow !== undefined && (window.softgames.enabledEndLevelFlow = t.data.session_params.enabled_end_level_flow), t.data.session_params.end_level_interval !== undefined && (window.softgames.endLevelEventCountInterval = t.data.session_params.end_level_interval), t.data.session_params.end_level_close_button_timer !== undefined && (window.softgames.endLevelCloseButtonTimer = t.data.session_params.end_level_close_button_timer * 1e3), window.softgames._invalidSignature(t.data.session_params.sig) && location.reload(!0), window.softgames.userId === undefined && e(t.data.session_params), window.softgames.events.fire("kirkUserReady", window.softgames.user));
                if (t.data.type === "hardRedirect") return n = t.data.hard_redirect_url, window.location = n
            }, !1), n =  + "./session/?game_slug=" + this.game_slug, t = [], window.softgames._getUrlParameter("locale") !== undefined && (t[t.length] = "locale=" + window.softgames._getUrlParameter("locale")), window.softgames._getUrlParameter("p") !== undefined && (t[t.length] = "p=" + window.softgames._getUrlParameter("p")), window.softgames._getUrlParameter("uid") !== undefined && (t[t.length] = "uid=" + window.softgames._getUrlParameter("uid")), window.softgames._getUrlParameter("aff") !== undefined && (t[t.length] = "aff=" + window.softgames._getUrlParameter("aff")), SG_jQuery.cookie("ux") !== null && (t[t.length] = "uid=" + SG_jQuery.cookie("ux")), SG_jQuery.cookie("uk") !== null && (t[t.length] = "k=" + SG_jQuery.cookie("uk")), t.length && (n = n.indexOf("?") === -1 ? n + "?" : n + "&", n += t.join("&")), this._createIframe(n)
        }, Softgames.prototype._invalidSignature = function(e) {
            return e === undefined || e === "" ? !0 : e.indexOf("/") !== -1 ? !0 : !1
        }, Softgames.prototype._isSandboxURL = function() {
            var e;
            return e = this._getUrlParameters(), e.hasOwnProperty("platform") && e.platform === "sandbox" ? !0 : !1
        }, Softgames.prototype._isKirkURL = function() {
            var e;
            return e = this._getUrlParameters(), e.hasOwnProperty("platform") && e.platform === "kirk" ? !0 : !1
        }, Softgames.prototype._getSystemName = function() {
            return this.system_id === "direct" || this.system_id === "kirk" ? "kirk" : this.system_id
        }, Softgames.prototype._getSystemId = function() {
            return this._isSandboxURL() ? "sandbox" : this._isKirkURL() ? "kirk" : "direct"
        }, Softgames.prototype._getBackUrl = function() {
            return this.back_url || this.defaultBackUrl
        }, Softgames.prototype._getGameSlug = function() {
            var e, t, n;
            return this.system_id === "sandbox" ? "sandbox_game" : (e = /^\/(.*)\//, t = this._getUrlParameters(), t.hasOwnProperty("game") ? n = t.game : n = e.exec(window.location.pathname)[1], n)
        }, Softgames.prototype._requestGameData = function(e, t, n, r) {
            return t._apiRequest("GET", "" + t.system_id + "/games/" + t.game_slug + ".json/", n, {}, function(e) {
                return t.events.fire("gameDataLoaded", e), e.country !== undefined && (t.country = e.country), t.gameTitle = e.game_title, t.project = e.project, t.social_network = e.social_network, t.subplatform = e.agent_api, t.affiliate = e.affiliate, t.game_bubble_text = e.game_bubble_text, t.game_bubble_configs = t._convertGameBubblConfig(e.game_bubble_configs), t.showMenu = e.show_ingame_menu, t.showIncentiviseButtonInGame = e.show_incentivise_button_in_game, t.back_url = e.back_url, t.externalStyles = e.external_styles, t.customGameHeader = e.custom_game_header, t.showAdPage = e.show_ad_page, t.adblockerAutoSkipAds = e.adblocker_auto_skip, t.showAdBlockerInfo = e.show_adblocker_info, t.displayWrapperAd = e.display_wrapper_ad, t.triggerConversionCustomCallback = e.conv_track_by_wrapper, t.triggerLevelUpCallback = e.level_up_by_wrapper, t.adCloseButton = e.ad_close_button, t.showGameDetailsPageWithoutAd = e.show_game_details_page_without_ad, t.showAdPreroll = e.show_ad_preroll, t.displayAdAfterFirstLevel = e.display_ad_after_first_level, t.enabledEndLevelFlow = e.enabled_end_level_flow, t.endLevelEventCountInterval = e.end_level_interval, e.end_level_close_button_timer !== void 0 && (t.endLevelCloseButtonTimer = e.end_level_close_button_timer * 1e3), t.external_js_filename = e.external_js_filename, e.old_ads_configuration !== void 0 && (t.oldAdsConfigurations = SG_jQuery.parseJSON(e.old_ads_configuration)), t.oldAdsConfigurations !== void 0 && (t.oldAdsConfigurations.skipPlayButton = e.ads_skip_play_button), e.ads_configurations !== void 0 && (t.adsConfigurations = e.ads_configurations), t.ingame_header = e.ingame_header, t.ingame_footer = e.ingame_footer, t.adblocker_info = e.adblocker_info, t.cpm_star_ad_at_bottom = e.cpm_star_ad_at_bottom, t.first_page = e.first_page, t.first_page_templates = e.first_page_templates, t.first_details_page = e.first_details_page, t.second_details_page = e.second_details_page, t.game_page_type = e.game_page_type, t.game_page = e.game_page, t.ingame_ad_popup = e.ingame_ad_popup, t.ingame_menu = e.ingame_menu, t.splash_screen_page = e.splash_screen, t.loading_page = e.loading_page, t.end_level_popup = e.end_level_popup, t.more_games_page_a = e.more_games_page_a, t.more_games_page_b = e.more_games_page_b, t.enableAbAdFirstGameDpage = e.load_ad_first_game_dpage, t.game_config_all = e.game_config, t.game_config_all !== void 0 && (!t._isMobile() || !(t.game_config = t.game_config_all.mobile)) && (t.game_config = t.game_config_all.common), t.famobi_game_id = e.famobi_game_id, e.hide_more_games_button !== void 0 && (t.hideMoreGamesButton = e.hide_more_games_button), t.externalGACode = e.agent_ga_code, t.gaAnonymizingIp = e.ga_anonymizing_ip, t.skipAds = e.skip_ads, t.skipIngameAds = e.skip_ingame_ads, e.banner_interval_time !== void 0 && (t.displayBannerInterval = e.banner_interval_time * 1e3), t.displayEndLevelInterval = t.displayBannerInterval, e.ads_conversion_flow !== void 0 && (t.adsConversionFlow = e.ads_conversion_flow), e.ads_conversion_user_state !== void 0 && (t.adsConversionUserState = e.ads_conversion_user_state), e.ads_conversion_points_mobile !== void 0 && (t.adsConversionPointsMobile = e.ads_conversion_points_mobile), e.ads_conversion_points_desktop !== void 0 && (t.adsConversionPointsDesktop = e.ads_conversion_points_desktop), e.ads_conversion_level !== void 0 && (t.adsConversionLevel = e.ads_conversion_level), t.adsConversionPoints = t._isMobile() ? t.adsConversionPointsMobile : t.adsConversionPointsDesktop, t.adsConversionPoints === void 0 && (t.adsConversionPoints = t.adsConversionPointsMobile), t.gameDetailsPageVersion = e.game_details_page_version, t.conversionModalWindowContent = e.conversion_modal_window_content, t.gid = e.gid, t.aid = e.aid, t.tv_cc_id = e.tv_cc_id, t.afg_cc_id = e.afg_cc_id, t.afc_unit_details_page_id = e.afc_unit_details_page_id, t.afc_unit_more_games_page_id = e.afc_unit_more_games_page_id, t.highscores = e.highscores, e.premium_game = t.premium_game, e.subplatform = t.subplatform, t.embedGame = e.game_page_type !== void 0, t.locale = e.locale, I18n.locale = e.locale, t.prize_play.init(e.prize_play), t.agentPlan = e.agent_plan, t.tracker = new SoftgamesVoyagerTracker(t.externalGACode, t.gaAnonymizingIp), t.openx = new OpenXJS({
                    deliveryUrl: t.openx_host,
                    parameters: t._getOpenxParams(e)
                }), t.customGameHeader !== "" && t.customGameHeader !== void 0 && SG_jQuery("head").append("" + t.customGameHeader), t.ingame_header !== "" && t.ingame_header !== void 0 && SG_jQuery("body").append(t.ingame_header), t.ingame_footer !== "" && t.ingame_footer !== void 0 && SG_jQuery("body").append(t.ingame_footer), typeof r == "function" ? r() : void 0
            })
        }, Softgames.prototype._requestUserData = function(e, t, n) {
            return e._apiRequest("GET", "" + e.system_id + "/users/" + t.user_id + ".json/", t, {}, function(t) {
                return e.token = t.token, e.userId = t.id, e.userGender = t.gender, e.installationDate = t.installation_date, e.subscriber = t.subscriber, t.premium_game = e.premium_game, e.country !== undefined && (t.country = e.country), t.social_network = e.social_network, t.subplatform = e.subplatform, t.affiliate = e.affiliate, t.project = e.project, e.tracker = new SoftgamesVoyagerTracker(e.externalGACode, e.gaAnonymizingIp), e.openx = new OpenXJS({
                    deliveryUrl: e.openx_host,
                    parameters: e._getOpenxParams(t)
                }), typeof n == "function" && n(), e.events.fire("userDataLoaded", t)
            })
        }, Softgames.prototype._createIframe = function(e) {
            return this.iframe = document.createElement("iframe"), this.iframe.id = "voyager-kirk-iframe", this.iframe.src = e, this.iframe.width = "0", this.iframe.height = "0", this.iframe.frameBorder = "0", document.body.appendChild(this.iframe)
        }, Softgames.prototype._addScreenChangeOrientationListener = function() {
            return window.addEventListener("orientationchange", function() {
                var e;
                return typeof(e = window.softgames).changeScreenSize == "function" ? e.changeScreenSize() : void 0
            }, !1)
        }, Softgames.prototype._initSystem = function() {
            if (this.system_id === "sandbox") this.displayBannerInterval = 1, this.apiAdapter = new SoftgamesSandbox(this, this.project, this.userId);
            else if (this.system_id === "kirk" || this.system_id === "direct") this.apiAdapter = new SoftgamesKirk(this, this.project, this.external_user_id);
            return this._addScreenChangeOrientationListener()
        }, Softgames.prototype._setParamsFromUrl = function() {
            var e, t, n, r;
            t = this._getUrlParameters(), r = [];
            for (e in t) n = t[e], n !== void 0 ? r.push(this[e] = n) : r.push(void 0);
            return r
        }, Softgames.prototype._init = function(e) {
            var t, n, r = this;
            return t = {}, this.openx_host = "http://ads.softgames.de/www/delivery/", this._getUrlParameters().host ? this.kirk_host = "//" + unescape(this._getUrlParameters().host) + "/api/" : (this.kirk_host = "http://m.softgames.de/api/", this.kirk_host = this.kirk_host.replace("http:", "")), this.defaultBackUrl = "http://m.softgames.de/", this.system_id === "sandbox" ? this._requestGameData("sandbox", this, void 0, function() {
                return r._setParamsFromUrl(), r._addToHomeConfig(), typeof e == "function" ? e() : void 0
            }) : this.system_id === "kirk" || this.system_id === "direct" ? (this.system_id = "kirk", this._getUrlParameters().p ? n = this._getUrlParameters().p : this._getUrlParameters().host ? n = this._getUrlParameters().host : this._getUrlParameters().p === void 0 ? (n = null, document.domain !== void 0 && (t.game_host = document.domain)) : n = this.defaultSubsystem, t.subsystem = n, this._getUrlParameters().aff !== void 0 && (t.affiliate = this._getUrlParameters().aff), this._getUrlParameters().cache !== void 0 && (t.cache = this._getUrlParameters().cache), this._getUrlParameters().locale !== void 0 && (t.locale = this._getUrlParameters().locale), this._getUrlParameters().country !== void 0 && (t.country = this._getUrlParameters().country), this._getUrlParameters().mobile_spec !== void 0 && (t.mobile_spec = this._getUrlParameters().mobile_spec), t.is_mobile = this._isMobile(), this._requestGameData(n, window.softgames, t, function() {
                return r._addToHomeConfig(), typeof e == "function" ? e() : void 0
            })) : typeof e == "function" ? e() : void 0
        }, Softgames.prototype.embedGameFN = function() {
            return this.game_page_type !== void 0
        }, Softgames.prototype.createSplashScreen = function() {
            var e, t = this;
            return e = SG_jQuery(this.splash_screen_page), this.splash_screen = SG_jQuery("#voyager-splashscreen-page", e), this.splash_screen.hide(), this.splash_screen_logo = SG_jQuery("#voyager-splashscreen-logo", e), this.splash_screen_logo.complete ? this.loadedSplashScreenLogo() : this.splash_screen_logo.load(function() {
                return t.loadedSplashScreenLogo()
            }), this.splashScreenReady = !0, SG_jQuery("body").append(e), this.splash_screen = SG_jQuery("#voyager-splashscreen-page")
        }, Softgames.prototype.loadedSplashScreenLogo = function() {
            return this.splashScreenLogoLoaded = !0, typeof this.splashScreenLogoOnload == "function" && this.splashScreenLogoOnload(), this.splashScreenLogoOnload = null
        }, Softgames.prototype.showSplashScreen = function(e) {
            var t = this;
            return this.splash_screen.fadeIn(1100, function() {
                return t.splash_screen.delay(3e3).fadeOut(1100, function() {
                    return typeof e == "function" ? e() : void 0
                })
            })
        }, Softgames.prototype._displaySplashScreen = function(e) {
            var t = this;
            return this.splash_screen_page !== "" && this.splash_screen_page !== void 0 || !this._shouldGamePageBeLoaded() ? (this.splashScreenReady || this.createSplashScreen(), this.splashScreenLogoLoaded ? this.showSplashScreen(function() {
                if (t._shouldGamePageBeLoaded()) return t._loadingFlowNextStep(e)
            }) : this.splashScreenLogoOnload = function() {
                return t._displaySplashScreen(e)
            }) : this._loadingFlowNextStep(e)
        }, Softgames.prototype._adblockerSkipAds = function() {
            return SG_jQuery.ActiveAdBlocker && this.adblockerAutoSkipAds === "true"
        }, Softgames.prototype._convertGameBubblConfig = function(e) {
            if (e !== undefined) {
                e.indexOf("On Start") > -1 && (this.gameBubbleConfig.on_start = !0), e.indexOf("On Game Over") > -1 && (this.gameBubbleConfig.on_game_over = !0), e.indexOf("On Level Up") > -1 && (this.gameBubbleConfig.on_level_up = !0);
                if (e.indexOf("On Pause On") > -1) return this.gameBubbleConfig.on_pause_on = !0
            }
        }, Softgames.prototype._hasAppleMetaTag = function() {
            return SG_jQuery("meta[name='apple-mobile-web-app-capable']").attr("content") !== undefined
        }, Softgames.prototype._addAppleMetaTag = function() {
            return SG_jQuery("head").append('<meta name="apple-mobile-web-app-capable" content="yes" />')
        }, Softgames.prototype._hasAppleIcon = function() {
            return SG_jQuery('head link[rel^=apple-touch-icon][sizes="114x114"],head link[rel^=apple-touch-icon][sizes="144x144"],head link[rel^=apple-touch-icon]') !== undefined || SG_jQuery('head link[rel^=apple-touch-icon][sizes="57x57"],head link[rel^=apple-touch-icon]') !== undefined
        }, Softgames.prototype.levelUp = function(e, t) {
            return this._onLevelUp(e), this.apiAdapter ? this.apiAdapter.levelUp(e, t) : typeof t == "function" ? t() : void 0
        }, Softgames.prototype._finishLoadingFlow = function(e) {
            return this.events.fire("finishedLoadingFlow", this), this._loadingFlowNextStep(e)
        }, Softgames.prototype.loadingFlowOrder = [Softgames.prototype._displayGameDetailsPage, Softgames.prototype._displaySplashScreen, Softgames.prototype._displayPrerollAdPopup, Softgames.prototype._finishLoadingFlow], Softgames.prototype.loadingFlowStep = 0, Softgames.prototype.endLevelFlowOrder = [Softgames.prototype._displayEndLevelPopup, Softgames.prototype._displayLoadingPage, Softgames.prototype._displayMoreGamesPage, Softgames.prototype._displayLoadingPage], Softgames.prototype.endLevelFlowStep = 0, Softgames.prototype.registerGameHandler = function(e, t) {
            return this.events.on(e, t)
        }, SG_jQuery(document).ready(function() {
            SG_jQuery("img.lazy").unveil(100)
        })
    }.call(this);