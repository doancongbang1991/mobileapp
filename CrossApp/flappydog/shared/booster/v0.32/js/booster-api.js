var requirejs, require, define;
(function (global) {
    function isFunction(e) {
        return ostring.call(e) === "[object Function]"
    }

    function isArray(e) {
        return ostring.call(e) === "[object Array]"
    }

    function each(e, t) {
        if (e)
        {
            var n;
            for (n = 0; n < e.length; n += 1)if (e[n] && t(e[n], n, e))break
        }
    }

    function eachReverse(e, t) {
        if (e)
        {
            var n;
            for (n = e.length - 1; n > -1; n -= 1)if (e[n] && t(e[n], n, e))break
        }
    }

    function hasProp(e, t) {
        return hasOwn.call(e, t)
    }

    function getOwn(e, t) {
        return hasProp(e, t) && e[t]
    }

    function eachProp(e, t) {
        var n;
        for (n in e)if (hasProp(e, n) && t(e[n], n))break
    }

    function mixin(e, t, n, r) {
        return t && eachProp(t, function (t, i) {
            if (n || !hasProp(e, i))r && typeof t != "string" ? (e[i] || (e[i] = {}), mixin(e[i], t, n, r)) : e[i] = t
        }), e
    }

    function bind(e, t) {
        return function () {
            return t.apply(e, arguments)
        }
    }

    function scripts() {
        return document.getElementsByTagName("script")
    }

    function defaultOnError(e) {
        throw e
    }

    function getGlobal(e) {
        if (!e)return e;
        var t = global;
        return each(e.split("."), function (e) {
            t = t[e]
        }), t
    }

    function makeError(e, t, n, r) {
        var i = new Error(t + "\nhttp://requirejs.org/docs/errors.html#" + e);
        return i.requireType = e, i.requireModules = r, n && (i.originalError = n), i
    }

    function newContext(e) {
        function v(e) {
            var t, n;
            for (t = 0; e[t]; t += 1)
            {
                n = e[t];
                if (n === ".")e.splice(t, 1), t -= 1;
                else if (n === "..")
                {
                    if (t === 1 && (e[2] === ".." || e[0] === ".."))break;
                    t > 0 && (e.splice(t - 1, 2), t -= 2)
                }
            }
        }

        function m(e, t, n) {
            var r, i, s, u, a, f, l, c, h, p, d, m = t && t.split("/"), g = m, y = o.map, b = y && y["*"];
            e && e.charAt(0) === "." && (t ? (getOwn(o.pkgs, t) ? g = m = [t] : g = m.slice(0, m.length - 1), e = g.concat(e.split("/")), v(e), i = getOwn(o.pkgs, r = e[0]), e = e.join("/"), i && e === r + "/" + i.main && (e = r)) : e.indexOf("./") === 0 && (e = e.substring(2)));
            if (n && y && (m || b))
            {
                u = e.split("/");
                for (a = u.length; a > 0; a -= 1)
                {
                    l = u.slice(0, a).join("/");
                    if (m)for (f = m.length; f > 0; f -= 1)
                    {
                        s = getOwn(y, m.slice(0, f).join("/"));
                        if (s)
                        {
                            s = getOwn(s, l);
                            if (s)
                            {
                                c = s, h = a;
                                break
                            }
                        }
                    }
                    if (c)break;
                    !p && b && getOwn(b, l) && (p = getOwn(b, l), d = a)
                }
                !c && p && (c = p, h = d), c && (u.splice(0, h, c), e = u.join("/"))
            }
            return e
        }

        function g(e) {
            isBrowser && each(scripts(), function (t) {
                if (t.getAttribute("data-requiremodule") === e && t.getAttribute("data-requirecontext") === r.contextName)return t.parentNode.removeChild(t), !0
            })
        }

        function y(e) {
            var t = getOwn(o.paths, e);
            if (t && isArray(t) && t.length > 1)return t.shift(), r.require.undef(e), r.require([e]), !0
        }

        function b(e) {
            var t, n = e ? e.indexOf("!") : -1;
            return n > -1 && (t = e.substring(0, n), e = e.substring(n + 1, e.length)), [t, e]
        }

        function w(e, t, n, i) {
            var s, o, u, a, f = null, l = t ? t.name : null, h = e, v = !0, g = "";
            return e || (v = !1, e = "_@r" + (p += 1)), a = b(e), f = a[0], e = a[1], f && (f = m(f, l, i), o = getOwn(c, f)), e && (f ? o && o.normalize ? g = o.normalize(e, function (e) {
                return m(e, l, i)
            }) : g = m(e, l, i) : (g = m(e, l, i), a = b(g), f = a[0], g = a[1], n = !0, s = r.nameToUrl(g))), u = f && !o && !n ? "_unnormalized" + (d += 1) : "", {prefix: f, name: g, parentMap: t, unnormalized: !!u, url: s, originalName: h, isDefine: v, id: (f ? f + "!" + g : g) + u}
        }

        function E(e) {
            var t = e.id, n = getOwn(u, t);
            return n || (n = u[t] = new r.Module(e)), n
        }

        function S(e, t, n) {
            var r = e.id, i = getOwn(u, r);
            hasProp(c, r) && (!i || i.defineEmitComplete) ? t === "defined" && n(c[r]) : (i = E(e), i.error && t === "error" ? n(i.error) : i.on(t, n))
        }

        function x(e, t) {
            var n = e.requireModules, r = !1;
            t ? t(e) : (each(n, function (t) {
                var n = getOwn(u, t);
                n && (n.error = e, n.events.error && (r = !0, n.emit("error", e)))
            }), r || req.onError(e))
        }

        function T() {
            globalDefQueue.length && (apsp.apply(l, [l.length - 1, 0].concat(globalDefQueue)), globalDefQueue = [])
        }

        function N(e) {
            delete u[e], delete a[e]
        }

        function C(e, t, n) {
            var r = e.map.id;
            e.error ? e.emit("error", e.error) : (t[r] = !0, each(e.depMaps, function (r, i) {
                var s = r.id, o = getOwn(u, s);
                o && !e.depMatched[i] && !n[s] && (getOwn(t, s) ? (e.defineDep(i, c[s]), e.check()) : C(o, t, n))
            }), n[r] = !0)
        }

        function k() {
            var e, n, i, u, f = o.waitSeconds * 1e3, l = f && r.startTime + f < (new Date).getTime(), c = [], h = [], p = !1, d = !0;
            if (t)return;
            t = !0, eachProp(a, function (t) {
                e = t.map, n = e.id;
                if (!t.enabled)return;
                e.isDefine || h.push(t);
                if (!t.error)if (!t.inited && l)y(n) ? (u = !0, p = !0) : (c.push(n), g(n));
                else if (!t.inited && t.fetched && e.isDefine)
                {
                    p = !0;
                    if (!e.prefix)return d = !1
                }
            });
            if (l && c.length)return i = makeError("timeout", "Load timeout for modules: " + c, null, c), i.contextName = r.contextName, x(i);
            d && each(h, function (e) {
                C(e, {}, {})
            }), (!l || u) && p && (isBrowser || isWebWorker) && !s && (s = setTimeout(function () {
                s = 0, k()
            }, 50)), t = !1
        }

        function L(e) {
            hasProp(c, e[0]) || E(w(e[0], null, !0)).init(e[1], e[2])
        }

        function A(e, t, n, r) {
            e.detachEvent && !isOpera ? r && e.detachEvent(r, t) : e.removeEventListener(n, t, !1)
        }

        function O(e) {
            var t = e.currentTarget || e.srcElement;
            return A(t, r.onScriptLoad, "load", "onreadystatechange"), A(t, r.onScriptError, "error"), {node: t, id: t && t.getAttribute("data-requiremodule")}
        }

        function M() {
            var e;
            T();
            while (l.length)
            {
                e = l.shift();
                if (e[0] === null)return x(makeError("mismatch", "Mismatched anonymous define() module: " + e[e.length - 1]));
                L(e)
            }
        }

        var t, n, r, i, s, o = {waitSeconds: 7, baseUrl: "./", paths: {}, pkgs: {}, shim: {}, config: {}}, u = {}, a = {}, f = {}, l = [], c = {}, h = {}, p = 1, d = 1;
        return i = {require: function (e) {
            return e.require ? e.require : e.require = r.makeRequire(e.map)
        }, exports: function (e) {
            e.usingExports = !0;
            if (e.map.isDefine)return e.exports ? e.exports : e.exports = c[e.map.id] = {}
        }, module: function (e) {
            return e.module ? e.module : e.module = {id: e.map.id, uri: e.map.url, config: function () {
                var t, n = getOwn(o.pkgs, e.map.id);
                return t = n ? getOwn(o.config, e.map.id + "/" + n.main) : getOwn(o.config, e.map.id), t || {}
            }, exports: c[e.map.id]}
        }}, n = function (e) {
            this.events = getOwn(f, e.id) || {}, this.map = e, this.shim = getOwn(o.shim, e.id), this.depExports = [], this.depMaps = [], this.depMatched = [], this.pluginMaps = {}, this.depCount = 0
        }, n.prototype = {init: function (e, t, n, r) {
            r = r || {};
            if (this.inited)return;
            this.factory = t, n ? this.on("error", n) : this.events.error && (n = bind(this, function (e) {
                this.emit("error", e)
            })), this.depMaps = e && e.slice(0), this.errback = n, this.inited = !0, this.ignore = r.ignore, r.enabled || this.enabled ? this.enable() : this.check()
        }, defineDep: function (e, t) {
            this.depMatched[e] || (this.depMatched[e] = !0, this.depCount -= 1, this.depExports[e] = t)
        }, fetch: function () {
            if (this.fetched)return;
            this.fetched = !0, r.startTime = (new Date).getTime();
            var e = this.map;
            if (!this.shim)return e.prefix ? this.callPlugin() : this.load();
            r.makeRequire(this.map, {enableBuildCallback: !0})(this.shim.deps || [], bind(this, function () {
                return e.prefix ? this.callPlugin() : this.load()
            }))
        }, load: function () {
            var e = this.map.url;
            h[e] || (h[e] = !0, r.load(this.map.id, e))
        }, check: function () {
            if (!this.enabled || this.enabling)return;
            var e, t, n = this.map.id, i = this.depExports, s = this.exports, o = this.factory;
            if (!this.inited)this.fetch();
            else if (this.error)this.emit("error", this.error);
            else if (!this.defining)
            {
                this.defining = !0;
                if (this.depCount < 1 && !this.defined)
                {
                    if (isFunction(o))
                    {
                        if (this.events.error && this.map.isDefine || req.onError !== defaultOnError)try
                        {
                            s = r.execCb(n, o, i, s)
                        } catch (u)
                        {
                            e = u
                        }
                        else s = r.execCb(n, o, i, s);
                        this.map.isDefine && (t = this.module, t && t.exports !== undefined && t.exports !== this.exports ? s = t.exports : s === undefined && this.usingExports && (s = this.exports));
                        if (e)return e.requireMap = this.map, e.requireModules = this.map.isDefine ? [this.map.id] : null, e.requireType = this.map.isDefine ? "define" : "require", x(this.error = e)
                    }
                    else s = o;
                    this.exports = s, this.map.isDefine && !this.ignore && (c[n] = s, req.onResourceLoad && req.onResourceLoad(r, this.map, this.depMaps)), N(n), this.defined = !0
                }
                this.defining = !1, this.defined && !this.defineEmitted && (this.defineEmitted = !0, this.emit("defined", this.exports), this.defineEmitComplete = !0)
            }
        }, callPlugin: function () {
            var e = this.map, t = e.id, n = w(e.prefix);
            this.depMaps.push(n), S(n, "defined", bind(this, function (n) {
                var i, s, a, f = this.map.name, l = this.map.parentMap ? this.map.parentMap.name : null, c = r.makeRequire(e.parentMap, {enableBuildCallback: !0});
                if (this.map.unnormalized)
                {
                    n.normalize && (f = n.normalize(f, function (e) {
                        return m(e, l, !0)
                    }) || ""), s = w(e.prefix + "!" + f, this.map.parentMap), S(s, "defined", bind(this, function (e) {
                        this.init([], function () {
                            return e
                        }, null, {enabled: !0, ignore: !0})
                    })), a = getOwn(u, s.id), a && (this.depMaps.push(s), this.events.error && a.on("error", bind(this, function (e) {
                        this.emit("error", e)
                    })), a.enable());
                    return
                }
                i = bind(this, function (e) {
                    this.init([], function () {
                        return e
                    }, null, {enabled: !0})
                }), i.error = bind(this, function (e) {
                    this.inited = !0, this.error = e, e.requireModules = [t], eachProp(u, function (e) {
                        e.map.id.indexOf(t + "_unnormalized") === 0 && N(e.map.id)
                    }), x(e)
                }), i.fromText = bind(this, function (n, s) {
                    var u = e.name, a = w(u), f = useInteractive;
                    s && (n = s), f && (useInteractive = !1), E(a), hasProp(o.config, t) && (o.config[u] = o.config[t]);
                    try
                    {
                        req.exec(n)
                    } catch (l)
                    {
                        return x(makeError("fromtexteval", "fromText eval for " + t + " failed: " + l, l, [t]))
                    }
                    f && (useInteractive = !0), this.depMaps.push(a), r.completeLoad(u), c([u], i)
                }), n.load(e.name, c, i, o)
            })), r.enable(n, this), this.pluginMaps[n.id] = n
        }, enable: function () {
            a[this.map.id] = this, this.enabled = !0, this.enabling = !0, each(this.depMaps, bind(this, function (e, t) {
                var n, s, o;
                if (typeof e == "string")
                {
                    e = w(e, this.map.isDefine ? this.map : this.map.parentMap, !1, !this.skipMap), this.depMaps[t] = e, o = getOwn(i, e.id);
                    if (o)
                    {
                        this.depExports[t] = o(this);
                        return
                    }
                    this.depCount += 1, S(e, "defined", bind(this, function (e) {
                        this.defineDep(t, e), this.check()
                    })), this.errback && S(e, "error", bind(this, this.errback))
                }
                n = e.id, s = u[n], !hasProp(i, n) && s && !s.enabled && r.enable(e, this)
            })), eachProp(this.pluginMaps, bind(this, function (e) {
                var t = getOwn(u, e.id);
                t && !t.enabled && r.enable(e, this)
            })), this.enabling = !1, this.check()
        }, on: function (e, t) {
            var n = this.events[e];
            n || (n = this.events[e] = []), n.push(t)
        }, emit: function (e, t) {
            each(this.events[e], function (e) {
                e(t)
            }), e === "error" && delete this.events[e]
        }}, r = {config: o, contextName: e, registry: u, defined: c, urlFetched: h, defQueue: l, Module: n, makeModuleMap: w, nextTick: req.nextTick, onError: x, configure: function (e) {
            e.baseUrl && e.baseUrl.charAt(e.baseUrl.length - 1) !== "/" && (e.baseUrl += "/");
            var t = o.pkgs, n = o.shim, i = {paths: !0, config: !0, map: !0};
            eachProp(e, function (e, t) {
                i[t] ? t === "map" ? (o.map || (o.map = {}), mixin(o[t], e, !0, !0)) : mixin(o[t], e, !0) : o[t] = e
            }), e.shim && (eachProp(e.shim, function (e, t) {
                isArray(e) && (e = {deps: e}), (e.exports || e.init) && !e.exportsFn && (e.exportsFn = r.makeShimExports(e)), n[t] = e
            }), o.shim = n), e.packages && (each(e.packages, function (e) {
                var n;
                e = typeof e == "string" ? {name: e} : e, n = e.location, t[e.name] = {name: e.name, location: n || e.name, main: (e.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "")}
            }), o.pkgs = t), eachProp(u, function (e, t) {
                !e.inited && !e.map.unnormalized && (e.map = w(t))
            }), (e.deps || e.callback) && r.require(e.deps || [], e.callback)
        }, makeShimExports: function (e) {
            function t() {
                var t;
                return e.init && (t = e.init.apply(global, arguments)), t || e.exports && getGlobal(e.exports)
            }

            return t
        }, makeRequire: function (t, n) {
            function s(o, a, f) {
                var l, h, p;
                return n.enableBuildCallback && a && isFunction(a) && (a.__requireJsBuild = !0), typeof o == "string" ? isFunction(a) ? x(makeError("requireargs", "Invalid require call"), f) : t && hasProp(i, o) ? i[o](u[t.id]) : req.get ? req.get(r, o, t, s) : (h = w(o, t, !1, !0), l = h.id, hasProp(c, l) ? c[l] : x(makeError("notloaded", 'Module name "' + l + '" has not been loaded yet for context: ' + e + (t ? "" : ". Use require([])")))) : (M(), r.nextTick(function () {
                    M(), p = E(w(null, t)), p.skipMap = n.skipMap, p.init(o, a, f, {enabled: !0}), k()
                }), s)
            }

            return n = n || {}, mixin(s, {isBrowser: isBrowser, toUrl: function (e) {
                var n, i = e.lastIndexOf("."), s = e.split("/")[0], o = s === "." || s === "..";
                return i !== -1 && (!o || i > 1) && (n = e.substring(i, e.length), e = e.substring(0, i)), r.nameToUrl(m(e, t && t.id, !0), n, !0)
            }, defined: function (e) {
                return hasProp(c, w(e, t, !1, !0).id)
            }, specified: function (e) {
                return e = w(e, t, !1, !0).id, hasProp(c, e) || hasProp(u, e)
            }}), t || (s.undef = function (e) {
                T();
                var n = w(e, t, !0), r = getOwn(u, e);
                g(e), delete c[e], delete h[n.url], delete f[e], r && (r.events.defined && (f[e] = r.events), N(e))
            }), s
        }, enable: function (e) {
            var t = getOwn(u, e.id);
            t && E(e).enable()
        }, completeLoad: function (e) {
            var t, n, r, i = getOwn(o.shim, e) || {}, s = i.exports;
            T();
            while (l.length)
            {
                n = l.shift();
                if (n[0] === null)
                {
                    n[0] = e;
                    if (t)break;
                    t = !0
                }
                else n[0] === e && (t = !0);
                L(n)
            }
            r = getOwn(u, e);
            if (!t && !hasProp(c, e) && r && !r.inited)
            {
                if (o.enforceDefine && (!s || !getGlobal(s)))
                {
                    if (y(e))return;
                    return x(makeError("nodefine", "No define call for " + e, null, [e]))
                }
                L([e, i.deps || [], i.exportsFn])
            }
            k()
        }, nameToUrl: function (e, t, n) {
            var r, i, s, u, a, f, l, c, h;
            if (req.jsExtRegExp.test(e))c = e + (t || "");
            else
            {
                r = o.paths, i = o.pkgs, a = e.split("/");
                for (f = a.length; f > 0; f -= 1)
                {
                    l = a.slice(0, f).join("/"), s = getOwn(i, l), h = getOwn(r, l);
                    if (h)
                    {
                        isArray(h) && (h = h[0]), a.splice(0, f, h);
                        break
                    }
                    if (s)
                    {
                        e === s.name ? u = s.location + "/" + s.main : u = s.location, a.splice(0, f, u);
                        break
                    }
                }
                c = a.join("/"), c += t || (/^data\:|\?/.test(c) || n ? "" : ".js"), c = (c.charAt(0) === "/" || c.match(/^[\w\+\.\-]+:/) ? "" : o.baseUrl) + c
            }
            return o.urlArgs ? c + ((c.indexOf("?") === -1 ? "?" : "&") + o.urlArgs) : c
        }, load: function (e, t) {
            req.load(r, e, t)
        }, execCb: function (e, t, n, r) {
            return t.apply(r, n)
        }, onScriptLoad: function (e) {
            if (e.type === "load" || readyRegExp.test((e.currentTarget || e.srcElement).readyState))
            {
                interactiveScript = null;
                var t = O(e);
                r.completeLoad(t.id)
            }
        }, onScriptError: function (e) {
            var t = O(e);
            if (!y(t.id))return x(makeError("scripterror", "Script error for: " + t.id, e, [t.id]))
        }}, r.require = r.makeRequire(), r
    }

    function getInteractiveScript() {
        return interactiveScript && interactiveScript.readyState === "interactive" ? interactiveScript : (eachReverse(scripts(), function (e) {
            if (e.readyState === "interactive")return interactiveScript = e
        }), interactiveScript)
    }

    var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = "2.1.9", commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, ap = Array.prototype, apsp = ap.splice, isBrowser = typeof window != "undefined" && typeof navigator != "undefined" && !!window.document, isWebWorker = !isBrowser && typeof importScripts != "undefined", readyRegExp = isBrowser && navigator.platform === "PLAYSTATION 3" ? /^complete$/ : /^(complete|loaded)$/, defContextName = "_", isOpera = typeof opera != "undefined" && opera.toString() === "[object Opera]", contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = !1;
    if (typeof define != "undefined")return;
    if (typeof requirejs != "undefined")
    {
        if (isFunction(requirejs))return;
        cfg = requirejs, requirejs = undefined
    }
    typeof require != "undefined" && !isFunction(require) && (cfg = require, require = undefined), req = requirejs = function (e, t, n, r) {
        var i, s, o = defContextName;
        return!isArray(e) && typeof e != "string" && (s = e, isArray(t) ? (e = t, t = n, n = r) : e = []), s && s.context && (o = s.context), i = getOwn(contexts, o), i || (i = contexts[o] = req.s.newContext(o)), s && i.configure(s), i.require(e, t, n)
    }, req.config = function (e) {
        return req(e)
    }, req.nextTick = typeof setTimeout != "undefined" ? function (e) {
        setTimeout(e, 4)
    } : function (e) {
        e()
    }, require || (require = req), req.version = version, req.jsExtRegExp = /^\/|:|\?|\.js$/, req.isBrowser = isBrowser, s = req.s = {contexts: contexts, newContext: newContext}, req({}), each(["toUrl", "undef", "defined", "specified"], function (e) {
        req[e] = function () {
            var t = contexts[defContextName];
            return t.require[e].apply(t, arguments)
        }
    }), isBrowser && (head = s.head = document.getElementsByTagName("head")[0], baseElement = document.getElementsByTagName("base")[0], baseElement && (head = s.head = baseElement.parentNode)), req.onError = defaultOnError, req.createNode = function (e, t, n) {
        var r = e.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script");
        return r.type = e.scriptType || "text/javascript", r.charset = "utf-8", r.async = !0, r
    }, req.load = function (e, t, n) {
        var r = e && e.config || {}, i;
        if (isBrowser)return i = req.createNode(r, t, n), i.setAttribute("data-requirecontext", e.contextName), i.setAttribute("data-requiremodule", t), i.attachEvent && !(i.attachEvent.toString && i.attachEvent.toString().indexOf("[native code") < 0) && !isOpera ? (useInteractive = !0, i.attachEvent("onreadystatechange", e.onScriptLoad)) : (i.addEventListener("load", e.onScriptLoad, !1), i.addEventListener("error", e.onScriptError, !1)), i.src = n, currentlyAddingScript = i, baseElement ? head.insertBefore(i, baseElement) : head.appendChild(i), currentlyAddingScript = null, i;
        if (isWebWorker)try
        {
            importScripts(n), e.completeLoad(t)
        } catch (s)
        {
            e.onError(makeError("importscripts", "importScripts failed for " + t + " at " + n, s, [t]))
        }
    }, isBrowser && !cfg.skipDataMain && eachReverse(scripts(), function (e) {
        head || (head = e.parentNode), dataMain = e.getAttribute("data-main");
        if (dataMain)return mainScript = dataMain, cfg.baseUrl || (src = mainScript.split("/"), mainScript = src.pop(), subPath = src.length ? src.join("/") + "/" : "./", cfg.baseUrl = subPath), mainScript = mainScript.replace(jsSuffixRegExp, ""), req.jsExtRegExp.test(mainScript) && (mainScript = dataMain), cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript], !0
    }), define = function (e, t, n) {
        var r, i;
        typeof e != "string" && (n = t, t = e, e = null), isArray(t) || (n = t, t = null), !t && isFunction(n) && (t = [], n.length && (n.toString().replace(commentRegExp, "").replace(cjsRequireRegExp, function (e, n) {
            t.push(n)
        }), t = (n.length === 1 ? ["require"] : ["require", "exports", "module"]).concat(t))), useInteractive && (r = currentlyAddingScript || getInteractiveScript(), r && (e || (e = r.getAttribute("data-requiremodule")), i = contexts[r.getAttribute("data-requirecontext")])), (i ? i.defQueue : globalDefQueue).push([e, t, n])
    }, define.amd = {jQuery: !0}, req.exec = function (text) {
        return eval(text)
    }, req(cfg)
})(this), define("../lib/require.js", function () {
});
var Zepto = function () {
    function _(e) {
        return e == null ? String(e) : N[C.call(e)] || "object"
    }

    function D(e) {
        return _(e) == "function"
    }

    function P(e) {
        return e != null && e == e.window
    }

    function H(e) {
        return e != null && e.nodeType == e.DOCUMENT_NODE
    }

    function B(e) {
        return _(e) == "object"
    }

    function j(e) {
        return B(e) && !P(e) && Object.getPrototypeOf(e) == Object.prototype
    }

    function F(e) {
        return e instanceof Array
    }

    function I(e) {
        return typeof e.length == "number"
    }

    function q(e) {
        return o.call(e, function (e) {
            return e != null
        })
    }

    function R(e) {
        return e.length > 0 ? n.fn.concat.apply([], e) : e
    }

    function U(e) {
        return e.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
    }

    function z(e) {
        return e in f ? f[e] : f[e] = new RegExp("(^|\\s)" + e + "(\\s|$)")
    }

    function W(e, t) {
        return typeof t == "number" && !l[U(e)] ? t + "px" : t
    }

    function X(e) {
        var t, n;
        return a[e] || (t = u.createElement(e), u.body.appendChild(t), n = getComputedStyle(t, "").getPropertyValue("display"), t.parentNode.removeChild(t), n == "none" && (n = "block"), a[e] = n), a[e]
    }

    function V(e) {
        return"children"in e ? s.call(e.children) : n.map(e.childNodes, function (e) {
            if (e.nodeType == 1)return e
        })
    }

    function $(n, r, i) {
        for (t in r)i && (j(r[t]) || F(r[t])) ? (j(r[t]) && !j(n[t]) && (n[t] = {}), F(r[t]) && !F(n[t]) && (n[t] = []), $(n[t], r[t], i)) : r[t] !== e && (n[t] = r[t])
    }

    function J(e, t) {
        return t == null ? n(e) : n(e).filter(t)
    }

    function K(e, t, n, r) {
        return D(t) ? t.call(e, n, r) : t
    }

    function Q(e, t, n) {
        n == null ? e.removeAttribute(t) : e.setAttribute(t, n)
    }

    function G(t, n) {
        var r = t.className, i = r && r.baseVal !== e;
        if (n === e)return i ? r.baseVal : r;
        i ? r.baseVal = n : t.className = n
    }

    function Y(e) {
        var t;
        try
        {
            return e ? e == "true" || (e == "false" ? !1 : e == "null" ? null : !/^0/.test(e) && !isNaN(t = Number(e)) ? t : /^[\[\{]/.test(e) ? n.parseJSON(e) : e) : e
        } catch (r)
        {
            return e
        }
    }

    function Z(e, t) {
        t(e);
        for (var n in e.childNodes)Z(e.childNodes[n], t)
    }

    var e, t, n, r, i = [], s = i.slice, o = i.filter, u = window.document, a = {}, f = {}, l = {"column-count": 1, columns: 1, "font-weight": 1, "line-height": 1, opacity: 1, "z-index": 1, zoom: 1}, c = /^\s*<(\w+|!)[^>]*>/, h = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, p = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, d = /^(?:body|html)$/i, v = /([A-Z])/g, m = ["val", "css", "html", "text", "data", "width", "height", "offset"], g = ["after", "prepend", "before", "append"], y = u.createElement("table"), b = u.createElement("tr"), w = {tr: u.createElement("tbody"), tbody: y, thead: y, tfoot: y, td: b, th: b, "*": u.createElement("div")}, E = /complete|loaded|interactive/, S = /^\.([\w-]+)$/, x = /^#([\w-]*)$/, T = /^[\w-]*$/, N = {}, C = N.toString, k = {}, L, A, O = u.createElement("div"), M = {tabindex: "tabIndex", readonly: "readOnly", "for": "htmlFor", "class": "className", maxlength: "maxLength", cellspacing: "cellSpacing", cellpadding: "cellPadding", rowspan: "rowSpan", colspan: "colSpan", usemap: "useMap", frameborder: "frameBorder", contenteditable: "contentEditable"};
    return k.matches = function (e, t) {
        if (!t || !e || e.nodeType !== 1)return!1;
        var n = e.webkitMatchesSelector || e.mozMatchesSelector || e.oMatchesSelector || e.matchesSelector;
        if (n)return n.call(e, t);
        var r, i = e.parentNode, s = !i;
        return s && (i = O).appendChild(e), r = ~k.qsa(i, t).indexOf(e), s && O.removeChild(e), r
    }, L = function (e) {
        return e.replace(/-+(.)?/g, function (e, t) {
            return t ? t.toUpperCase() : ""
        })
    }, A = function (e) {
        return o.call(e, function (t, n) {
            return e.indexOf(t) == n
        })
    }, k.fragment = function (t, r, i) {
        var o, a, f;
        return h.test(t) && (o = n(u.createElement(RegExp.$1))), o || (t.replace && (t = t.replace(p, "<$1></$2>")), r === e && (r = c.test(t) && RegExp.$1), r in w || (r = "*"), f = w[r], f.innerHTML = "" + t, o = n.each(s.call(f.childNodes), function () {
            f.removeChild(this)
        })), j(i) && (a = n(o), n.each(i, function (e, t) {
            m.indexOf(e) > -1 ? a[e](t) : a.attr(e, t)
        })), o
    }, k.Z = function (e, t) {
        return e = e || [], e.__proto__ = n.fn, e.selector = t || "", e
    }, k.isZ = function (e) {
        return e instanceof k.Z
    }, k.init = function (t, r) {
        var i;
        if (!t)return k.Z();
        if (typeof t == "string")
        {
            t = t.trim();
            if (t[0] == "<" && c.test(t))i = k.fragment(t, RegExp.$1, r), t = null;
            else
            {
                if (r !== e)return n(r).find(t);
                i = k.qsa(u, t)
            }
        }
        else
        {
            if (D(t))return n(u).ready(t);
            if (k.isZ(t))return t;
            if (F(t))i = q(t);
            else if (B(t))i = [t], t = null;
            else if (c.test(t))i = k.fragment(t.trim(), RegExp.$1, r), t = null;
            else
            {
                if (r !== e)return n(r).find(t);
                i = k.qsa(u, t)
            }
        }
        return k.Z(i, t)
    }, n = function (e, t) {
        return k.init(e, t)
    }, n.extend = function (e) {
        var t, n = s.call(arguments, 1);
        return typeof e == "boolean" && (t = e, e = n.shift()), n.forEach(function (n) {
            $(e, n, t)
        }), e
    }, k.qsa = function (e, t) {
        var n, r = t[0] == "#", i = !r && t[0] == ".", o = r || i ? t.slice(1) : t, u = T.test(o);
        return H(e) && u && r ? (n = e.getElementById(o)) ? [n] : [] : e.nodeType !== 1 && e.nodeType !== 9 ? [] : s.call(u && !r ? i ? e.getElementsByClassName(o) : e.getElementsByTagName(t) : e.querySelectorAll(t))
    }, n.contains = function (e, t) {
        return e !== t && e.contains(t)
    }, n.type = _, n.isFunction = D, n.isWindow = P, n.isArray = F, n.isPlainObject = j, n.isEmptyObject = function (e) {
        var t;
        for (t in e)return!1;
        return!0
    }, n.inArray = function (e, t, n) {
        return i.indexOf.call(t, e, n)
    }, n.camelCase = L, n.trim = function (e) {
        return e == null ? "" : String.prototype.trim.call(e)
    }, n.uuid = 0, n.support = {}, n.expr = {}, n.map = function (e, t) {
        var n, r = [], i, s;
        if (I(e))for (i = 0; i < e.length; i++)n = t(e[i], i), n != null && r.push(n);
        else for (s in e)n = t(e[s], s), n != null && r.push(n);
        return R(r)
    }, n.each = function (e, t) {
        var n, r;
        if (I(e))
        {
            for (n = 0; n < e.length; n++)if (t.call(e[n], n, e[n]) === !1)return e
        }
        else for (r in e)if (t.call(e[r], r, e[r]) === !1)return e;
        return e
    }, n.grep = function (e, t) {
        return o.call(e, t)
    }, window.JSON && (n.parseJSON = JSON.parse), n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (e, t) {
        N["[object " + t + "]"] = t.toLowerCase()
    }), n.fn = {forEach: i.forEach, reduce: i.reduce, push: i.push, sort: i.sort, indexOf: i.indexOf, concat: i.concat, map: function (e) {
        return n(n.map(this, function (t, n) {
            return e.call(t, n, t)
        }))
    }, slice: function () {
        return n(s.apply(this, arguments))
    }, ready: function (e) {
        return E.test(u.readyState) && u.body ? e(n) : u.addEventListener("DOMContentLoaded", function () {
            e(n)
        }, !1), this
    }, get: function (t) {
        return t === e ? s.call(this) : this[t >= 0 ? t : t + this.length]
    }, toArray: function () {
        return this.get()
    }, size: function () {
        return this.length
    }, remove: function () {
        return this.each(function () {
            this.parentNode != null && this.parentNode.removeChild(this)
        })
    }, each: function (e) {
        return this.forEach(function (t, n) {
            return e.call(t, n, t) !== !1
        }), this
    }, filter: function (e) {
        return D(e) ? this.not(this.not(e)) : n(o.call(this, function (t) {
            return k.matches(t, e)
        }))
    }, add: function (e, t) {
        return n(A(this.concat(n(e, t))))
    }, is: function (e) {
        return this.length > 0 && k.matches(this[0], e)
    }, not: function (t) {
        var r = [];
        if (D(t) && t.call !== e)this.each(function (e) {
            t.call(this, e) || r.push(this)
        });
        else
        {
            var i = typeof t == "string" ? this.filter(t) : I(t) && D(t.item) ? s.call(t) : n(t);
            this.forEach(function (e) {
                i.indexOf(e) < 0 && r.push(e)
            })
        }
        return n(r)
    }, has: function (e) {
        return this.filter(function () {
            return B(e) ? n.contains(this, e) : n(this).find(e).size()
        })
    }, eq: function (e) {
        return e === -1 ? this.slice(e) : this.slice(e, +e + 1)
    }, first: function () {
        var e = this[0];
        return e && !B(e) ? e : n(e)
    }, last: function () {
        var e = this[this.length - 1];
        return e && !B(e) ? e : n(e)
    }, find: function (e) {
        var t, r = this;
        return typeof e == "object" ? t = n(e).filter(function () {
            var e = this;
            return i.some.call(r, function (t) {
                return n.contains(t, e)
            })
        }) : this.length == 1 ? t = n(k.qsa(this[0], e)) : t = this.map(function () {
            return k.qsa(this, e)
        }), t
    }, closest: function (e, t) {
        var r = this[0], i = !1;
        typeof e == "object" && (i = n(e));
        while (r && !(i ? i.indexOf(r) >= 0 : k.matches(r, e)))r = r !== t && !H(r) && r.parentNode;
        return n(r)
    }, parents: function (e) {
        var t = [], r = this;
        while (r.length > 0)r = n.map(r, function (e) {
            if ((e = e.parentNode) && !H(e) && t.indexOf(e) < 0)return t.push(e), e
        });
        return J(t, e)
    }, parent: function (e) {
        return J(A(this.pluck("parentNode")), e)
    }, children: function (e) {
        return J(this.map(function () {
            return V(this)
        }), e)
    }, contents: function () {
        return this.map(function () {
            return s.call(this.childNodes)
        })
    }, siblings: function (e) {
        return J(this.map(function (e, t) {
            return o.call(V(t.parentNode), function (e) {
                return e !== t
            })
        }), e)
    }, empty: function () {
        return this.each(function () {
            this.innerHTML = ""
        })
    }, pluck: function (e) {
        return n.map(this, function (t) {
            return t[e]
        })
    }, show: function () {
        return this.each(function () {
            this.style.display == "none" && (this.style.display = ""), getComputedStyle(this, "").getPropertyValue("display") == "none" && (this.style.display = X(this.nodeName))
        })
    }, replaceWith: function (e) {
        return this.before(e).remove()
    }, wrap: function (e) {
        var t = D(e);
        if (this[0] && !t)var r = n(e).get(0), i = r.parentNode || this.length > 1;
        return this.each(function (s) {
            n(this).wrapAll(t ? e.call(this, s) : i ? r.cloneNode(!0) : r)
        })
    }, wrapAll: function (e) {
        if (this[0])
        {
            n(this[0]).before(e = n(e));
            var t;
            while ((t = e.children()).length)e = t.first();
            n(e).append(this)
        }
        return this
    }, wrapInner: function (e) {
        var t = D(e);
        return this.each(function (r) {
            var i = n(this), s = i.contents(), o = t ? e.call(this, r) : e;
            s.length ? s.wrapAll(o) : i.append(o)
        })
    }, unwrap: function () {
        return this.parent().each(function () {
            n(this).replaceWith(n(this).children())
        }), this
    }, clone: function () {
        return this.map(function () {
            return this.cloneNode(!0)
        })
    }, hide: function () {
        return this.css("display", "none")
    }, toggle: function (t) {
        return this.each(function () {
            var r = n(this);
            (t === e ? r.css("display") == "none" : t) ? r.show() : r.hide()
        })
    }, prev: function (e) {
        return n(this.pluck("previousElementSibling")).filter(e || "*")
    }, next: function (e) {
        return n(this.pluck("nextElementSibling")).filter(e || "*")
    }, html: function (e) {
        return arguments.length === 0 ? this.length > 0 ? this[0].innerHTML : null : this.each(function (t) {
            var r = this.innerHTML;
            n(this).empty().append(K(this, e, t, r))
        })
    }, text: function (t) {
        return arguments.length === 0 ? this.length > 0 ? this[0].textContent : null : this.each(function () {
            this.textContent = t === e ? "" : "" + t
        })
    }, attr: function (n, r) {
        var i;
        return typeof n == "string" && r === e ? this.length == 0 || this[0].nodeType !== 1 ? e : n == "value" && this[0].nodeName == "INPUT" ? this.val() : !(i = this[0].getAttribute(n)) && n in this[0] ? this[0][n] : i : this.each(function (e) {
            if (this.nodeType !== 1)return;
            if (B(n))for (t in n)Q(this, t, n[t]);
            else Q(this, n, K(this, r, e, this.getAttribute(n)))
        })
    }, removeAttr: function (e) {
        return this.each(function () {
            this.nodeType === 1 && Q(this, e)
        })
    }, prop: function (t, n) {
        return t = M[t] || t, n === e ? this[0] && this[0][t] : this.each(function (e) {
            this[t] = K(this, n, e, this[t])
        })
    }, data: function (t, n) {
        var r = this.attr("data-" + t.replace(v, "-$1").toLowerCase(), n);
        return r !== null ? Y(r) : e
    }, val: function (e) {
        return arguments.length === 0 ? this[0] && (this[0].multiple ? n(this[0]).find("option").filter(function () {
            return this.selected
        }).pluck("value") : this[0].value) : this.each(function (t) {
            this.value = K(this, e, t, this.value)
        })
    }, offset: function (e) {
        if (e)return this.each(function (t) {
            var r = n(this), i = K(this, e, t, r.offset()), s = r.offsetParent().offset(), o = {top: i.top - s.top, left: i.left - s.left};
            r.css("position") == "static" && (o.position = "relative"), r.css(o)
        });
        if (this.length == 0)return null;
        var t = this[0].getBoundingClientRect();
        return{left: t.left + window.pageXOffset, top: t.top + window.pageYOffset, width: Math.round(t.width), height: Math.round(t.height)}
    }, css: function (e, r) {
        if (arguments.length < 2)
        {
            var i = this[0], s = getComputedStyle(i, "");
            if (!i)return;
            if (typeof e == "string")return i.style[L(e)] || s.getPropertyValue(e);
            if (F(e))
            {
                var o = {};
                return n.each(F(e) ? e : [e], function (e, t) {
                    o[t] = i.style[L(t)] || s.getPropertyValue(t)
                }), o
            }
        }
        var u = "";
        if (_(e) == "string")!r && r !== 0 ? this.each(function () {
            this.style.removeProperty(U(e))
        }) : u = U(e) + ":" + W(e, r);
        else for (t in e)!e[t] && e[t] !== 0 ? this.each(function () {
            this.style.removeProperty(U(t))
        }) : u += U(t) + ":" + W(t, e[t]) + ";";
        return this.each(function () {
            this.style.cssText += ";" + u
        })
    }, index: function (e) {
        return e ? this.indexOf(n(e)[0]) : this.parent().children().indexOf(this[0])
    }, hasClass: function (e) {
        return e ? i.some.call(this, function (e) {
            return this.test(G(e))
        }, z(e)) : !1
    }, addClass: function (e) {
        return e ? this.each(function (t) {
            r = [];
            var i = G(this), s = K(this, e, t, i);
            s.split(/\s+/g).forEach(function (e) {
                n(this).hasClass(e) || r.push(e)
            }, this), r.length && G(this, i + (i ? " " : "") + r.join(" "))
        }) : this
    }, removeClass: function (t) {
        return this.each(function (n) {
            if (t === e)return G(this, "");
            r = G(this), K(this, t, n, r).split(/\s+/g).forEach(function (e) {
                r = r.replace(z(e), " ")
            }), G(this, r.trim())
        })
    }, toggleClass: function (t, r) {
        return t ? this.each(function (i) {
            var s = n(this), o = K(this, t, i, G(this));
            o.split(/\s+/g).forEach(function (t) {
                (r === e ? !s.hasClass(t) : r) ? s.addClass(t) : s.removeClass(t)
            })
        }) : this
    }, scrollTop: function (t) {
        if (!this.length)return;
        var n = "scrollTop"in this[0];
        return t === e ? n ? this[0].scrollTop : this[0].pageYOffset : this.each(n ? function () {
            this.scrollTop = t
        } : function () {
            this.scrollTo(this.scrollX, t)
        })
    }, scrollLeft: function (t) {
        if (!this.length)return;
        var n = "scrollLeft"in this[0];
        return t === e ? n ? this[0].scrollLeft : this[0].pageXOffset : this.each(n ? function () {
            this.scrollLeft = t
        } : function () {
            this.scrollTo(t, this.scrollY)
        })
    }, position: function () {
        if (!this.length)return;
        var e = this[0], t = this.offsetParent(), r = this.offset(), i = d.test(t[0].nodeName) ? {top: 0, left: 0} : t.offset();
        return r.top -= parseFloat(n(e).css("margin-top")) || 0, r.left -= parseFloat(n(e).css("margin-left")) || 0, i.top += parseFloat(n(t[0]).css("border-top-width")) || 0, i.left += parseFloat(n(t[0]).css("border-left-width")) || 0, {top: r.top - i.top, left: r.left - i.left}
    }, offsetParent: function () {
        return this.map(function () {
            var e = this.offsetParent || u.body;
            while (e && !d.test(e.nodeName) && n(e).css("position") == "static")e = e.offsetParent;
            return e
        })
    }}, n.fn.detach = n.fn.remove, ["width", "height"].forEach(function (t) {
        var r = t.replace(/./, function (e) {
            return e[0].toUpperCase()
        });
        n.fn[t] = function (i) {
            var s, o = this[0];
            return i === e ? P(o) ? o["inner" + r] : H(o) ? o.documentElement["scroll" + r] : (s = this.offset()) && s[t] : this.each(function (e) {
                o = n(this), o.css(t, K(this, i, e, o[t]()))
            })
        }
    }), g.forEach(function (e, t) {
        var r = t % 2;
        n.fn[e] = function () {
            var e, i = n.map(arguments, function (t) {
                return e = _(t), e == "object" || e == "array" || t == null ? t : k.fragment(t)
            }), s, o = this.length > 1;
            return i.length < 1 ? this : this.each(function (e, u) {
                s = r ? u : u.parentNode, u = t == 0 ? u.nextSibling : t == 1 ? u.firstChild : t == 2 ? u : null, i.forEach(function (e) {
                    if (o)e = e.cloneNode(!0);
                    else if (!s)return n(e).remove();
                    Z(s.insertBefore(e, u), function (e) {
                        e.nodeName != null && e.nodeName.toUpperCase() === "SCRIPT" && (!e.type || e.type === "text/javascript") && !e.src && window.eval.call(window, e.innerHTML)
                    })
                })
            })
        }, n.fn[r ? e + "To" : "insert" + (t ? "Before" : "After")] = function (t) {
            return n(t)[e](this), this
        }
    }), k.Z.prototype = n.fn, k.uniq = A, k.deserializeValue = Y, n.zepto = k, n
}();
window.Zepto = Zepto, window.$ === undefined && (window.$ = Zepto), function (e) {
    function h(e) {
        return e._zid || (e._zid = n++)
    }

    function p(e, t, n, r) {
        t = d(t);
        if (t.ns)var i = v(t.ns);
        return(u[h(e)] || []).filter(function (e) {
            return e && (!t.e || e.e == t.e) && (!t.ns || i.test(e.ns)) && (!n || h(e.fn) === h(n)) && (!r || e.sel == r)
        })
    }

    function d(e) {
        var t = ("" + e).split(".");
        return{e: t[0], ns: t.slice(1).sort().join(" ")}
    }

    function v(e) {
        return new RegExp("(?:^| )" + e.replace(" ", " .* ?") + "(?: |$)")
    }

    function m(e, t) {
        return e.del && !f && e.e in l || !!t
    }

    function g(e) {
        return c[e] || f && l[e] || e
    }

    function y(t, n, i, s, o, a, f) {
        var l = h(t), p = u[l] || (u[l] = []);
        n.split(/\s/).forEach(function (n) {
            if (n == "ready")return e(document).ready(i);
            var u = d(n);
            u.fn = i, u.sel = o, u.e in c && (i = function (t) {
                var n = t.relatedTarget;
                if (!n || n !== this && !e.contains(this, n))return u.fn.apply(this, arguments)
            }), u.del = a;
            var l = a || i;
            u.proxy = function (e) {
                e = T(e);
                if (e.isImmediatePropagationStopped())return;
                e.data = s;
                var n = l.apply(t, e._args == r ? [e] : [e].concat(e._args));
                return n === !1 && (e.preventDefault(), e.stopPropagation()), n
            }, u.i = p.length, p.push(u), "addEventListener"in t && t.addEventListener(g(u.e), u.proxy, m(u, f))
        })
    }

    function b(e, t, n, r, i) {
        var s = h(e);
        (t || "").split(/\s/).forEach(function (t) {
            p(e, t, n, r).forEach(function (t) {
                delete u[s][t.i], "removeEventListener"in e && e.removeEventListener(g(t.e), t.proxy, m(t, i))
            })
        })
    }

    function T(t, n) {
        if (n || !t.isDefaultPrevented)
        {
            n || (n = t), e.each(x, function (e, r) {
                var i = n[e];
                t[e] = function () {
                    return this[r] = w, i && i.apply(n, arguments)
                }, t[r] = E
            });
            if (n.defaultPrevented !== r ? n.defaultPrevented : "returnValue"in n ? n.returnValue === !1 : n.getPreventDefault && n.getPreventDefault())t.isDefaultPrevented = w
        }
        return t
    }

    function N(e) {
        var t, n = {originalEvent: e};
        for (t in e)!S.test(t) && e[t] !== r && (n[t] = e[t]);
        return T(n, e)
    }

    var t = e.zepto.qsa, n = 1, r, i = Array.prototype.slice, s = e.isFunction, o = function (e) {
        return typeof e == "string"
    }, u = {}, a = {}, f = "onfocusin"in window, l = {focus: "focusin", blur: "focusout"}, c = {mouseenter: "mouseover", mouseleave: "mouseout"};
    a.click = a.mousedown = a.mouseup = a.mousemove = "MouseEvents", e.event = {add: y, remove: b}, e.proxy = function (t, n) {
        if (s(t))
        {
            var r = function () {
                return t.apply(n, arguments)
            };
            return r._zid = h(t), r
        }
        if (o(n))return e.proxy(t[n], t);
        throw new TypeError("expected function")
    }, e.fn.bind = function (e, t, n) {
        return this.on(e, t, n)
    }, e.fn.unbind = function (e, t) {
        return this.off(e, t)
    }, e.fn.one = function (e, t, n, r) {
        return this.on(e, t, n, r, 1)
    };
    var w = function () {
        return!0
    }, E = function () {
        return!1
    }, S = /^([A-Z]|returnValue$|layer[XY]$)/, x = {preventDefault: "isDefaultPrevented", stopImmediatePropagation: "isImmediatePropagationStopped", stopPropagation: "isPropagationStopped"};
    e.fn.delegate = function (e, t, n) {
        return this.on(t, e, n)
    }, e.fn.undelegate = function (e, t, n) {
        return this.off(t, e, n)
    }, e.fn.live = function (t, n) {
        return e(document.body).delegate(this.selector, t, n), this
    }, e.fn.die = function (t, n) {
        return e(document.body).undelegate(this.selector, t, n), this
    }, e.fn.on = function (t, n, u, a, f) {
        var l, c, h = this;
        if (t && !o(t))return e.each(t, function (e, t) {
            h.on(e, n, u, t, f)
        }), h;
        !o(n) && !s(a) && a !== !1 && (a = u, u = n, n = r);
        if (s(u) || u === !1)a = u, u = r;
        return a === !1 && (a = E), h.each(function (r, s) {
            f && (l = function (e) {
                return b(s, e.type, a), a.apply(this, arguments)
            }), n && (c = function (t) {
                var r, o = e(t.target).closest(n, s).get(0);
                if (o && o !== s)return r = e.extend(N(t), {currentTarget: o, liveFired: s}), (l || a).apply(o, [r].concat(i.call(arguments, 1)))
            }), y(s, t, a, u, n, c || l)
        })
    }, e.fn.off = function (t, n, i) {
        var u = this;
        return t && !o(t) ? (e.each(t, function (e, t) {
            u.off(e, n, t)
        }), u) : (!o(n) && !s(i) && i !== !1 && (i = n, n = r), i === !1 && (i = E), u.each(function () {
            b(this, t, i, n)
        }))
    }, e.fn.trigger = function (t, n) {
        return t = o(t) || e.isPlainObject(t) ? e.Event(t) : T(t), t._args = n, this.each(function () {
            "dispatchEvent"in this ? this.dispatchEvent(t) : e(this).triggerHandler(t, n)
        })
    }, e.fn.triggerHandler = function (t, n) {
        var r, i;
        return this.each(function (s, u) {
            r = N(o(t) ? e.Event(t) : t), r._args = n, r.target = u, e.each(p(u, t.type || t), function (e, t) {
                i = t.proxy(r);
                if (r.isImmediatePropagationStopped())return!1
            })
        }), i
    }, "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function (t) {
        e.fn[t] = function (e) {
            return e ? this.bind(t, e) : this.trigger(t)
        }
    }), ["focus", "blur"].forEach(function (t) {
        e.fn[t] = function (e) {
            return e ? this.bind(t, e) : this.each(function () {
                try
                {
                    this[t]()
                } catch (e)
                {
                }
            }), this
        }
    }), e.Event = function (e, t) {
        o(e) || (t = e, e = t.type);
        var n = document.createEvent(a[e] || "Events"), r = !0;
        if (t)for (var i in t)i == "bubbles" ? r = !!t[i] : n[i] = t[i];
        return n.initEvent(e, r, !0), T(n)
    }
}(Zepto), function ($) {
    function triggerAndReturn(e, t, n) {
        var r = $.Event(t);
        return $(e).trigger(r, n), !r.isDefaultPrevented()
    }

    function triggerGlobal(e, t, n, r) {
        if (e.global)return triggerAndReturn(t || document, n, r)
    }

    function ajaxStart(e) {
        e.global && $.active++ === 0 && triggerGlobal(e, null, "ajaxStart")
    }

    function ajaxStop(e) {
        e.global && !--$.active && triggerGlobal(e, null, "ajaxStop")
    }

    function ajaxBeforeSend(e, t) {
        var n = t.context;
        if (t.beforeSend.call(n, e, t) === !1 || triggerGlobal(t, n, "ajaxBeforeSend", [e, t]) === !1)return!1;
        triggerGlobal(t, n, "ajaxSend", [e, t])
    }

    function ajaxSuccess(e, t, n, r) {
        var i = n.context, s = "success";
        n.success.call(i, e, s, t), r && r.resolveWith(i, [e, s, t]), triggerGlobal(n, i, "ajaxSuccess", [t, n, e]), ajaxComplete(s, t, n)
    }

    function ajaxError(e, t, n, r, i) {
        var s = r.context;
        r.error.call(s, n, t, e), i && i.rejectWith(s, [n, t, e]), triggerGlobal(r, s, "ajaxError", [n, r, e || t]), ajaxComplete(t, n, r)
    }

    function ajaxComplete(e, t, n) {
        var r = n.context;
        n.complete.call(r, t, e), triggerGlobal(n, r, "ajaxComplete", [t, n]), ajaxStop(n)
    }

    function empty() {
    }

    function mimeToDataType(e) {
        return e && (e = e.split(";", 2)[0]), e && (e == htmlType ? "html" : e == jsonType ? "json" : scriptTypeRE.test(e) ? "script" : xmlTypeRE.test(e) && "xml") || "text"
    }

    function appendQuery(e, t) {
        return t == "" ? e : (e + "&" + t).replace(/[&?]{1,2}/, "?")
    }

    function serializeData(e) {
        e.processData && e.data && $.type(e.data) != "string" && (e.data = $.param(e.data, e.traditional)), e.data && (!e.type || e.type.toUpperCase() == "GET") && (e.url = appendQuery(e.url, e.data), e.data = undefined)
    }

    function parseArguments(e, t, n, r) {
        var i = !$.isFunction(t);
        return{url: e, data: i ? t : undefined, success: i ? $.isFunction(n) ? n : undefined : t, dataType: i ? r || n : n}
    }

    function serialize(e, t, n, r) {
        var i, s = $.isArray(t), o = $.isPlainObject(t);
        $.each(t, function (t, u) {
            i = $.type(u), r && (t = n ? r : r + "[" + (o || i == "object" || i == "array" ? t : "") + "]"), !r && s ? e.add(u.name, u.value) : i == "array" || !n && i == "object" ? serialize(e, u, n, t) : e.add(t, u)
        })
    }

    var jsonpID = 0, document = window.document, key, name, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, scriptTypeRE = /^(?:text|application)\/javascript/i, xmlTypeRE = /^(?:text|application)\/xml/i, jsonType = "application/json", htmlType = "text/html", blankRE = /^\s*$/;
    $.active = 0, $.ajaxJSONP = function (e, t) {
        if ("type"in e)
        {
            var n = e.jsonpCallback, r = ($.isFunction(n) ? n() : n) || "jsonp" + ++jsonpID, i = document.createElement("script"), s = window[r], o, u = function (e) {
                $(i).triggerHandler("error", e || "abort")
            }, a = {abort: u}, f;
            return t && t.promise(a), $(i).on("load error", function (n, u) {
                clearTimeout(f), $(i).off().remove(), n.type == "error" || !o ? ajaxError(null, u || "error", a, e, t) : ajaxSuccess(o[0], a, e, t), window[r] = s, o && $.isFunction(s) && s(o[0]), s = o = undefined
            }), ajaxBeforeSend(a, e) === !1 ? (u("abort"), a) : (window[r] = function () {
                o = arguments
            }, i.src = e.url.replace(/=\?/, "=" + r), document.head.appendChild(i), e.timeout > 0 && (f = setTimeout(function () {
                u("timeout")
            }, e.timeout)), a)
        }
        return $.ajax(e)
    }, $.ajaxSettings = {type: "GET", beforeSend: empty, success: empty, error: empty, complete: empty, context: null, global: !0, xhr: function () {
        return new window.XMLHttpRequest
    }, accepts: {script: "text/javascript, application/javascript, application/x-javascript", json: jsonType, xml: "application/xml, text/xml", html: htmlType, text: "text/plain"}, crossDomain: !1, timeout: 0, processData: !0, cache: !0}, $.ajax = function (options) {
        var settings = $.extend({}, options || {}), deferred = $.Deferred && $.Deferred();
        for (key in $.ajaxSettings)settings[key] === undefined && (settings[key] = $.ajaxSettings[key]);
        ajaxStart(settings), settings.crossDomain || (settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host), settings.url || (settings.url = window.location.toString()), serializeData(settings), settings.cache === !1 && (settings.url = appendQuery(settings.url, "_=" + Date.now()));
        var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url);
        if (dataType == "jsonp" || hasPlaceholder)return hasPlaceholder || (settings.url = appendQuery(settings.url, settings.jsonp ? settings.jsonp + "=?" : settings.jsonp === !1 ? "" : "callback=?")), $.ajaxJSONP(settings, deferred);
        var mime = settings.accepts[dataType], headers = {}, setHeader = function (e, t) {
            headers[e.toLowerCase()] = [e, t]
        }, protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol, xhr = settings.xhr(), nativeSetHeader = xhr.setRequestHeader, abortTimeout;
        deferred && deferred.promise(xhr), settings.crossDomain || setHeader("X-Requested-With", "XMLHttpRequest"), setHeader("Accept", mime || "*/*");
        if (mime = settings.mimeType || mime)mime.indexOf(",") > -1 && (mime = mime.split(",", 2)[0]), xhr.overrideMimeType && xhr.overrideMimeType(mime);
        (settings.contentType || settings.contentType !== !1 && settings.data && settings.type.toUpperCase() != "GET") && setHeader("Content-Type", settings.contentType || "application/x-www-form-urlencoded");
        if (settings.headers)for (name in settings.headers)setHeader(name, settings.headers[name]);
        xhr.setRequestHeader = setHeader, xhr.onreadystatechange = function () {
            if (xhr.readyState == 4)
            {
                xhr.onreadystatechange = empty, clearTimeout(abortTimeout);
                var result, error = !1;
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == "file:")
                {
                    dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader("content-type")), result = xhr.responseText;
                    try
                    {
                        dataType == "script" ? (1, eval)(result) : dataType == "xml" ? result = xhr.responseXML : dataType == "json" && (result = blankRE.test(result) ? null : $.parseJSON(result))
                    } catch (e)
                    {
                        error = e
                    }
                    error ? ajaxError(error, "parsererror", xhr, settings, deferred) : ajaxSuccess(result, xhr, settings, deferred)
                }
                else ajaxError(xhr.statusText || null, xhr.status ? "error" : "abort", xhr, settings, deferred)
            }
        };
        if (ajaxBeforeSend(xhr, settings) === !1)return xhr.abort(), ajaxError(null, "abort", xhr, settings, deferred), xhr;
        if (settings.xhrFields)for (name in settings.xhrFields)xhr[name] = settings.xhrFields[name];
        var async = "async"in settings ? settings.async : !0;
        xhr.open(settings.type, settings.url, async, settings.username, settings.password);
        for (name in headers)nativeSetHeader.apply(xhr, headers[name]);
        return settings.timeout > 0 && (abortTimeout = setTimeout(function () {
            xhr.onreadystatechange = empty, xhr.abort(), ajaxError(null, "timeout", xhr, settings, deferred)
        }, settings.timeout)), xhr.send(settings.data ? settings.data : null), xhr
    }, $.get = function (e, t, n, r) {
        return $.ajax(parseArguments.apply(null, arguments))
    }, $.post = function (e, t, n, r) {
        var i = parseArguments.apply(null, arguments);
        return i.type = "POST", $.ajax(i)
    }, $.getJSON = function (e, t, n) {
        var r = parseArguments.apply(null, arguments);
        return r.dataType = "json", $.ajax(r)
    }, $.fn.load = function (e, t, n) {
        if (!this.length)return this;
        var r = this, i = e.split(/\s/), s, o = parseArguments(e, t, n), u = o.success;
        return i.length > 1 && (o.url = i[0], s = i[1]), o.success = function (e) {
            r.html(s ? $("<div>").html(e.replace(rscript, "")).find(s) : e), u && u.apply(r, arguments)
        }, $.ajax(o), this
    };
    var escape = encodeURIComponent;
    $.param = function (e, t) {
        var n = [];
        return n.add = function (e, t) {
            this.push(escape(e) + "=" + escape(t))
        }, serialize(n, e, t), n.join("&").replace(/%20/g, "+")
    }
}(Zepto), function (e) {
    e.fn.serializeArray = function () {
        var t = [], n;
        return e([].slice.call(this.get(0).elements)).each(function () {
            n = e(this);
            var r = n.attr("type");
            this.nodeName.toLowerCase() != "fieldset" && !this.disabled && r != "submit" && r != "reset" && r != "button" && (r != "radio" && r != "checkbox" || this.checked) && t.push({name: n.attr("name"), value: n.val()})
        }), t
    }, e.fn.serialize = function () {
        var e = [];
        return this.serializeArray().forEach(function (t) {
            e.push(encodeURIComponent(t.name) + "=" + encodeURIComponent(t.value))
        }), e.join("&")
    }, e.fn.submit = function (t) {
        if (t)this.bind("submit", t);
        else if (this.length)
        {
            var n = e.Event("submit");
            this.eq(0).trigger(n), n.isDefaultPrevented() || this.get(0).submit()
        }
        return this
    }
}(Zepto), function (e) {
    "__proto__"in{} || e.extend(e.zepto, {Z: function (t, n) {
        return t = t || [], e.extend(t, e.fn), t.selector = n || "", t.__Z = !0, t
    }, isZ: function (t) {
        return e.type(t) === "array" && "__Z"in t
    }});
    try
    {
        getComputedStyle(undefined)
    } catch (t)
    {
        var n = getComputedStyle;
        window.getComputedStyle = function (e) {
            try
            {
                return n(e)
            } catch (t)
            {
                return null
            }
        }
    }
}(Zepto), window.Zepto = Zepto, "$"in window || (window.$ = Zepto), typeof define == "function" && define.amd && define("zepto", [], function () {
    return Zepto
}), function () {
    var e = this, t = e._, n = {}, r = Array.prototype, i = Object.prototype, s = Function.prototype, o = r.push, u = r.slice, a = r.concat, f = i.toString, l = i.hasOwnProperty, c = r.forEach, h = r.map, p = r.reduce, d = r.reduceRight, v = r.filter, m = r.every, g = r.some, y = r.indexOf, b = r.lastIndexOf, w = Array.isArray, E = Object.keys, S = s.bind, x = function (e) {
        if (e instanceof x)return e;
        if (!(this instanceof x))return new x(e);
        this._wrapped = e
    };
    typeof exports != "undefined" ? (typeof module != "undefined" && module.exports && (exports = module.exports = x), exports._ = x) : e._ = x, x.VERSION = "1.5.2";
    var T = x.each = x.forEach = function (e, t, r) {
        if (e == null)return;
        if (c && e.forEach === c)e.forEach(t, r);
        else if (e.length === +e.length)
        {
            for (var i = 0, s = e.length; i < s; i++)if (t.call(r, e[i], i, e) === n)return
        }
        else
        {
            var o = x.keys(e);
            for (var i = 0, s = o.length; i < s; i++)if (t.call(r, e[o[i]], o[i], e) === n)return
        }
    };
    x.map = x.collect = function (e, t, n) {
        var r = [];
        return e == null ? r : h && e.map === h ? e.map(t, n) : (T(e, function (e, i, s) {
            r.push(t.call(n, e, i, s))
        }), r)
    };
    var N = "Reduce of empty array with no initial value";
    x.reduce = x.foldl = x.inject = function (e, t, n, r) {
        var i = arguments.length > 2;
        e == null && (e = []);
        if (p && e.reduce === p)return r && (t = x.bind(t, r)), i ? e.reduce(t, n) : e.reduce(t);
        T(e, function (e, s, o) {
            i ? n = t.call(r, n, e, s, o) : (n = e, i = !0)
        });
        if (!i)throw new TypeError(N);
        return n
    }, x.reduceRight = x.foldr = function (e, t, n, r) {
        var i = arguments.length > 2;
        e == null && (e = []);
        if (d && e.reduceRight === d)return r && (t = x.bind(t, r)), i ? e.reduceRight(t, n) : e.reduceRight(t);
        var s = e.length;
        if (s !== +s)
        {
            var o = x.keys(e);
            s = o.length
        }
        T(e, function (u, a, f) {
            a = o ? o[--s] : --s, i ? n = t.call(r, n, e[a], a, f) : (n = e[a], i = !0)
        });
        if (!i)throw new TypeError(N);
        return n
    }, x.find = x.detect = function (e, t, n) {
        var r;
        return C(e, function (e, i, s) {
            if (t.call(n, e, i, s))return r = e, !0
        }), r
    }, x.filter = x.select = function (e, t, n) {
        var r = [];
        return e == null ? r : v && e.filter === v ? e.filter(t, n) : (T(e, function (e, i, s) {
            t.call(n, e, i, s) && r.push(e)
        }), r)
    }, x.reject = function (e, t, n) {
        return x.filter(e, function (e, r, i) {
            return!t.call(n, e, r, i)
        }, n)
    }, x.every = x.all = function (e, t, r) {
        t || (t = x.identity);
        var i = !0;
        return e == null ? i : m && e.every === m ? e.every(t, r) : (T(e, function (e, s, o) {
            if (!(i = i && t.call(r, e, s, o)))return n
        }), !!i)
    };
    var C = x.some = x.any = function (e, t, r) {
        t || (t = x.identity);
        var i = !1;
        return e == null ? i : g && e.some === g ? e.some(t, r) : (T(e, function (e, s, o) {
            if (i || (i = t.call(r, e, s, o)))return n
        }), !!i)
    };
    x.contains = x.include = function (e, t) {
        return e == null ? !1 : y && e.indexOf === y ? e.indexOf(t) != -1 : C(e, function (e) {
            return e === t
        })
    }, x.invoke = function (e, t) {
        var n = u.call(arguments, 2), r = x.isFunction(t);
        return x.map(e, function (e) {
            return(r ? t : e[t]).apply(e, n)
        })
    }, x.pluck = function (e, t) {
        return x.map(e, function (e) {
            return e[t]
        })
    }, x.where = function (e, t, n) {
        return x.isEmpty(t) ? n ? void 0 : [] : x[n ? "find" : "filter"](e, function (e) {
            for (var n in t)if (t[n] !== e[n])return!1;
            return!0
        })
    }, x.findWhere = function (e, t) {
        return x.where(e, t, !0)
    }, x.max = function (e, t, n) {
        if (!t && x.isArray(e) && e[0] === +e[0] && e.length < 65535)return Math.max.apply(Math, e);
        if (!t && x.isEmpty(e))return-Infinity;
        var r = {computed: -Infinity, value: -Infinity};
        return T(e, function (e, i, s) {
            var o = t ? t.call(n, e, i, s) : e;
            o > r.computed && (r = {value: e, computed: o})
        }), r.value
    }, x.min = function (e, t, n) {
        if (!t && x.isArray(e) && e[0] === +e[0] && e.length < 65535)return Math.min.apply(Math, e);
        if (!t && x.isEmpty(e))return Infinity;
        var r = {computed: Infinity, value: Infinity};
        return T(e, function (e, i, s) {
            var o = t ? t.call(n, e, i, s) : e;
            o < r.computed && (r = {value: e, computed: o})
        }), r.value
    }, x.shuffle = function (e) {
        var t, n = 0, r = [];
        return T(e, function (e) {
            t = x.random(n++), r[n - 1] = r[t], r[t] = e
        }), r
    }, x.sample = function (e, t, n) {
        return arguments.length < 2 || n ? e[x.random(e.length - 1)] : x.shuffle(e).slice(0, Math.max(0, t))
    };
    var k = function (e) {
        return x.isFunction(e) ? e : function (t) {
            return t[e]
        }
    };
    x.sortBy = function (e, t, n) {
        var r = k(t);
        return x.pluck(x.map(e, function (e, t, i) {
            return{value: e, index: t, criteria: r.call(n, e, t, i)}
        }).sort(function (e, t) {
            var n = e.criteria, r = t.criteria;
            if (n !== r)
            {
                if (n > r || n === void 0)return 1;
                if (n < r || r === void 0)return-1
            }
            return e.index - t.index
        }), "value")
    };
    var L = function (e) {
        return function (t, n, r) {
            var i = {}, s = n == null ? x.identity : k(n);
            return T(t, function (n, o) {
                var u = s.call(r, n, o, t);
                e(i, u, n)
            }), i
        }
    };
    x.groupBy = L(function (e, t, n) {
        (x.has(e, t) ? e[t] : e[t] = []).push(n)
    }), x.indexBy = L(function (e, t, n) {
        e[t] = n
    }), x.countBy = L(function (e, t) {
        x.has(e, t) ? e[t]++ : e[t] = 1
    }), x.sortedIndex = function (e, t, n, r) {
        n = n == null ? x.identity : k(n);
        var i = n.call(r, t), s = 0, o = e.length;
        while (s < o)
        {
            var u = s + o >>> 1;
            n.call(r, e[u]) < i ? s = u + 1 : o = u
        }
        return s
    }, x.toArray = function (e) {
        return e ? x.isArray(e) ? u.call(e) : e.length === +e.length ? x.map(e, x.identity) : x.values(e) : []
    }, x.size = function (e) {
        return e == null ? 0 : e.length === +e.length ? e.length : x.keys(e).length
    }, x.first = x.head = x.take = function (e, t, n) {
        return e == null ? void 0 : t == null || n ? e[0] : u.call(e, 0, t)
    }, x.initial = function (e, t, n) {
        return u.call(e, 0, e.length - (t == null || n ? 1 : t))
    }, x.last = function (e, t, n) {
        return e == null ? void 0 : t == null || n ? e[e.length - 1] : u.call(e, Math.max(e.length - t, 0))
    }, x.rest = x.tail = x.drop = function (e, t, n) {
        return u.call(e, t == null || n ? 1 : t)
    }, x.compact = function (e) {
        return x.filter(e, x.identity)
    };
    var A = function (e, t, n) {
        return t && x.every(e, x.isArray) ? a.apply(n, e) : (T(e, function (e) {
            x.isArray(e) || x.isArguments(e) ? t ? o.apply(n, e) : A(e, t, n) : n.push(e)
        }), n)
    };
    x.flatten = function (e, t) {
        return A(e, t, [])
    }, x.without = function (e) {
        return x.difference(e, u.call(arguments, 1))
    }, x.uniq = x.unique = function (e, t, n, r) {
        x.isFunction(t) && (r = n, n = t, t = !1);
        var i = n ? x.map(e, n, r) : e, s = [], o = [];
        return T(i, function (n, r) {
            if (t ? !r || o[o.length - 1] !== n : !x.contains(o, n))o.push(n), s.push(e[r])
        }), s
    }, x.union = function () {
        return x.uniq(x.flatten(arguments, !0))
    }, x.intersection = function (e) {
        var t = u.call(arguments, 1);
        return x.filter(x.uniq(e), function (e) {
            return x.every(t, function (t) {
                return x.indexOf(t, e) >= 0
            })
        })
    }, x.difference = function (e) {
        var t = a.apply(r, u.call(arguments, 1));
        return x.filter(e, function (e) {
            return!x.contains(t, e)
        })
    }, x.zip = function () {
        var e = x.max(x.pluck(arguments, "length").concat(0)), t = new Array(e);
        for (var n = 0; n < e; n++)t[n] = x.pluck(arguments, "" + n);
        return t
    }, x.object = function (e, t) {
        if (e == null)return{};
        var n = {};
        for (var r = 0, i = e.length; r < i; r++)t ? n[e[r]] = t[r] : n[e[r][0]] = e[r][1];
        return n
    }, x.indexOf = function (e, t, n) {
        if (e == null)return-1;
        var r = 0, i = e.length;
        if (n)
        {
            if (typeof n != "number")return r = x.sortedIndex(e, t), e[r] === t ? r : -1;
            r = n < 0 ? Math.max(0, i + n) : n
        }
        if (y && e.indexOf === y)return e.indexOf(t, n);
        for (; r < i; r++)if (e[r] === t)return r;
        return-1
    }, x.lastIndexOf = function (e, t, n) {
        if (e == null)return-1;
        var r = n != null;
        if (b && e.lastIndexOf === b)return r ? e.lastIndexOf(t, n) : e.lastIndexOf(t);
        var i = r ? n : e.length;
        while (i--)if (e[i] === t)return i;
        return-1
    }, x.range = function (e, t, n) {
        arguments.length <= 1 && (t = e || 0, e = 0), n = arguments[2] || 1;
        var r = Math.max(Math.ceil((t - e) / n), 0), i = 0, s = new Array(r);
        while (i < r)s[i++] = e, e += n;
        return s
    };
    var O = function () {
    };
    x.bind = function (e, t) {
        var n, r;
        if (S && e.bind === S)return S.apply(e, u.call(arguments, 1));
        if (!x.isFunction(e))throw new TypeError;
        return n = u.call(arguments, 2), r = function () {
            if (this instanceof r)
            {
                O.prototype = e.prototype;
                var i = new O;
                O.prototype = null;
                var s = e.apply(i, n.concat(u.call(arguments)));
                return Object(s) === s ? s : i
            }
            return e.apply(t, n.concat(u.call(arguments)))
        }
    }, x.partial = function (e) {
        var t = u.call(arguments, 1);
        return function () {
            return e.apply(this, t.concat(u.call(arguments)))
        }
    }, x.bindAll = function (e) {
        var t = u.call(arguments, 1);
        if (t.length === 0)throw new Error("bindAll must be passed function names");
        return T(t, function (t) {
            e[t] = x.bind(e[t], e)
        }), e
    }, x.memoize = function (e, t) {
        var n = {};
        return t || (t = x.identity), function () {
            var r = t.apply(this, arguments);
            return x.has(n, r) ? n[r] : n[r] = e.apply(this, arguments)
        }
    }, x.delay = function (e, t) {
        var n = u.call(arguments, 2);
        return setTimeout(function () {
            return e.apply(null, n)
        }, t)
    }, x.defer = function (e) {
        return x.delay.apply(x, [e, 1].concat(u.call(arguments, 1)))
    }, x.throttle = function (e, t, n) {
        var r, i, s, o = null, u = 0;
        n || (n = {});
        var a = function () {
            u = n.leading === !1 ? 0 : new Date, o = null, s = e.apply(r, i)
        };
        return function () {
            var f = new Date;
            !u && n.leading === !1 && (u = f);
            var l = t - (f - u);
            return r = this, i = arguments, l <= 0 ? (clearTimeout(o), o = null, u = f, s = e.apply(r, i)) : !o && n.trailing !== !1 && (o = setTimeout(a, l)), s
        }
    }, x.debounce = function (e, t, n) {
        var r, i, s, o, u;
        return function () {
            s = this, i = arguments, o = new Date;
            var a = function () {
                var f = new Date - o;
                f < t ? r = setTimeout(a, t - f) : (r = null, n || (u = e.apply(s, i)))
            }, f = n && !r;
            return r || (r = setTimeout(a, t)), f && (u = e.apply(s, i)), u
        }
    }, x.once = function (e) {
        var t = !1, n;
        return function () {
            return t ? n : (t = !0, n = e.apply(this, arguments), e = null, n)
        }
    }, x.wrap = function (e, t) {
        return function () {
            var n = [e];
            return o.apply(n, arguments), t.apply(this, n)
        }
    }, x.compose = function () {
        var e = arguments;
        return function () {
            var t = arguments;
            for (var n = e.length - 1; n >= 0; n--)t = [e[n].apply(this, t)];
            return t[0]
        }
    }, x.after = function (e, t) {
        return function () {
            if (--e < 1)return t.apply(this, arguments)
        }
    }, x.keys = E || function (e) {
        if (e !== Object(e))throw new TypeError("Invalid object");
        var t = [];
        for (var n in e)x.has(e, n) && t.push(n);
        return t
    }, x.values = function (e) {
        var t = x.keys(e), n = t.length, r = new Array(n);
        for (var i = 0; i < n; i++)r[i] = e[t[i]];
        return r
    }, x.pairs = function (e) {
        var t = x.keys(e), n = t.length, r = new Array(n);
        for (var i = 0; i < n; i++)r[i] = [t[i], e[t[i]]];
        return r
    }, x.invert = function (e) {
        var t = {}, n = x.keys(e);
        for (var r = 0, i = n.length; r < i; r++)t[e[n[r]]] = n[r];
        return t
    }, x.functions = x.methods = function (e) {
        var t = [];
        for (var n in e)x.isFunction(e[n]) && t.push(n);
        return t.sort()
    }, x.extend = function (e) {
        return T(u.call(arguments, 1), function (t) {
            if (t)for (var n in t)e[n] = t[n]
        }), e
    }, x.pick = function (e) {
        var t = {}, n = a.apply(r, u.call(arguments, 1));
        return T(n, function (n) {
            n in e && (t[n] = e[n])
        }), t
    }, x.omit = function (e) {
        var t = {}, n = a.apply(r, u.call(arguments, 1));
        for (var i in e)x.contains(n, i) || (t[i] = e[i]);
        return t
    }, x.defaults = function (e) {
        return T(u.call(arguments, 1), function (t) {
            if (t)for (var n in t)e[n] === void 0 && (e[n] = t[n])
        }), e
    }, x.clone = function (e) {
        return x.isObject(e) ? x.isArray(e) ? e.slice() : x.extend({}, e) : e
    }, x.tap = function (e, t) {
        return t(e), e
    };
    var M = function (e, t, n, r) {
        if (e === t)return e !== 0 || 1 / e == 1 / t;
        if (e == null || t == null)return e === t;
        e instanceof x && (e = e._wrapped), t instanceof x && (t = t._wrapped);
        var i = f.call(e);
        if (i != f.call(t))return!1;
        switch (i)
        {
            case"[object String]":
                return e == String(t);
            case"[object Number]":
                return e != +e ? t != +t : e == 0 ? 1 / e == 1 / t : e == +t;
            case"[object Date]":
            case"[object Boolean]":
                return+e == +t;
            case"[object RegExp]":
                return e.source == t.source && e.global == t.global && e.multiline == t.multiline && e.ignoreCase == t.ignoreCase
        }
        if (typeof e != "object" || typeof t != "object")return!1;
        var s = n.length;
        while (s--)if (n[s] == e)return r[s] == t;
        var o = e.constructor, u = t.constructor;
        if (o !== u && !(x.isFunction(o) && o instanceof o && x.isFunction(u) && u instanceof u))return!1;
        n.push(e), r.push(t);
        var a = 0, l = !0;
        if (i == "[object Array]")
        {
            a = e.length, l = a == t.length;
            if (l)while (a--)if (!(l = M(e[a], t[a], n, r)))break
        }
        else
        {
            for (var c in e)if (x.has(e, c))
            {
                a++;
                if (!(l = x.has(t, c) && M(e[c], t[c], n, r)))break
            }
            if (l)
            {
                for (c in t)if (x.has(t, c) && !(a--))break;
                l = !a
            }
        }
        return n.pop(), r.pop(), l
    };
    x.isEqual = function (e, t) {
        return M(e, t, [], [])
    }, x.isEmpty = function (e) {
        if (e == null)return!0;
        if (x.isArray(e) || x.isString(e))return e.length === 0;
        for (var t in e)if (x.has(e, t))return!1;
        return!0
    }, x.isElement = function (e) {
        return!!e && e.nodeType === 1
    }, x.isArray = w || function (e) {
        return f.call(e) == "[object Array]"
    }, x.isObject = function (e) {
        return e === Object(e)
    }, T(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (e) {
        x["is" + e] = function (t) {
            return f.call(t) == "[object " + e + "]"
        }
    }), x.isArguments(arguments) || (x.isArguments = function (e) {
        return!!e && !!x.has(e, "callee")
    }), typeof /./ != "function" && (x.isFunction = function (e) {
        return typeof e == "function"
    }), x.isFinite = function (e) {
        return isFinite(e) && !isNaN(parseFloat(e))
    }, x.isNaN = function (e) {
        return x.isNumber(e) && e != +e
    }, x.isBoolean = function (e) {
        return e === !0 || e === !1 || f.call(e) == "[object Boolean]"
    }, x.isNull = function (e) {
        return e === null
    }, x.isUndefined = function (e) {
        return e === void 0
    }, x.has = function (e, t) {
        return l.call(e, t)
    }, x.noConflict = function () {
        return e._ = t, this
    }, x.identity = function (e) {
        return e
    }, x.times = function (e, t, n) {
        var r = Array(Math.max(0, e));
        for (var i = 0; i < e; i++)r[i] = t.call(n, i);
        return r
    }, x.random = function (e, t) {
        return t == null && (t = e, e = 0), e + Math.floor(Math.random() * (t - e + 1))
    };
    var _ = {escape: {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;"}};
    _.unescape = x.invert(_.escape);
    var D = {escape: new RegExp("[" + x.keys(_.escape).join("") + "]", "g"), unescape: new RegExp("(" + x.keys(_.unescape).join("|") + ")", "g")};
    x.each(["escape", "unescape"], function (e) {
        x[e] = function (t) {
            return t == null ? "" : ("" + t).replace(D[e], function (t) {
                return _[e][t]
            })
        }
    }), x.result = function (e, t) {
        if (e == null)return void 0;
        var n = e[t];
        return x.isFunction(n) ? n.call(e) : n
    }, x.mixin = function (e) {
        T(x.functions(e), function (t) {
            var n = x[t] = e[t];
            x.prototype[t] = function () {
                var e = [this._wrapped];
                return o.apply(e, arguments), F.call(this, n.apply(x, e))
            }
        })
    };
    var P = 0;
    x.uniqueId = function (e) {
        var t = ++P + "";
        return e ? e + t : t
    }, x.templateSettings = {evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g};
    var H = /(.)^/, B = {"'": "'", "\\": "\\", "\r": "r", "\n": "n", "	": "t", "\u2028": "u2028", "\u2029": "u2029"}, j = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    x.template = function (e, t, n) {
        var r;
        n = x.defaults({}, n, x.templateSettings);
        var i = new RegExp([(n.escape || H).source, (n.interpolate || H).source, (n.evaluate || H).source].join("|") + "|$", "g"), s = 0, o = "__p+='";
        e.replace(i, function (t, n, r, i, u) {
            return o += e.slice(s, u).replace(j, function (e) {
                return"\\" + B[e]
            }), n && (o += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'"), r && (o += "'+\n((__t=(" + r + "))==null?'':__t)+\n'"), i && (o += "';\n" + i + "\n__p+='"), s = u + t.length, t
        }), o += "';\n", n.variable || (o = "with(obj||{}){\n" + o + "}\n"), o = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + o + "return __p;\n";
        try
        {
            r = new Function(n.variable || "obj", "_", o)
        } catch (u)
        {
            throw u.source = o, u
        }
        if (t)return r(t, x);
        var a = function (e) {
            return r.call(this, e, x)
        };
        return a.source = "function(" + (n.variable || "obj") + "){\n" + o + "}", a
    }, x.chain = function (e) {
        return x(e).chain()
    };
    var F = function (e) {
        return this._chain ? x(e).chain() : e
    };
    x.mixin(x), T(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (e) {
        var t = r[e];
        x.prototype[e] = function () {
            var n = this._wrapped;
            return t.apply(n, arguments), (e == "shift" || e == "splice") && n.length === 0 && delete n[0], F.call(this, n)
        }
    }), T(["concat", "join", "slice"], function (e) {
        var t = r[e];
        x.prototype[e] = function () {
            return F.call(this, t.apply(this._wrapped, arguments))
        }
    }), x.extend(x.prototype, {chain: function () {
        return this._chain = !0, this
    }, value: function () {
        return this._wrapped
    }}), typeof define == "function" && define.amd && define("underscore", [], function () {
        return x
    })
}.call(this), function (e, t) {
    typeof exports != "undefined" ? t(e, exports, require("underscore")) : typeof define == "function" && define.amd ? define("backbone", ["underscore", "zepto", "exports"], function (n, r, i) {
        e.Backbone = t(e, i, n, r)
    }) : e.Backbone = t(e, {}, e._, e.jQuery || e.Zepto || e.ender || e.$)
}(this, function (e, t, n, r) {
    var i = e.Backbone, s = [], o = s.push, u = s.slice, a = s.splice;
    t.VERSION = "1.1.0", t.$ = r, t.noConflict = function () {
        return e.Backbone = i, this
    }, t.emulateHTTP = !1, t.emulateJSON = !1;
    var f = t.Events = {on: function (e, t, n) {
        if (!c(this, "on", e, [t, n]) || !t)return this;
        this._events || (this._events = {});
        var r = this._events[e] || (this._events[e] = []);
        return r.push({callback: t, context: n, ctx: n || this}), this
    }, once: function (e, t, r) {
        if (!c(this, "once", e, [t, r]) || !t)return this;
        var i = this, s = n.once(function () {
            i.off(e, s), t.apply(this, arguments)
        });
        return s._callback = t, this.on(e, s, r)
    }, off: function (e, t, r) {
        var i, s, o, u, a, f, l, h;
        if (!this._events || !c(this, "off", e, [t, r]))return this;
        if (!e && !t && !r)return this._events = {}, this;
        u = e ? [e] : n.keys(this._events);
        for (a = 0, f = u.length; a < f; a++)
        {
            e = u[a];
            if (o = this._events[e])
            {
                this._events[e] = i = [];
                if (t || r)for (l = 0, h = o.length; l < h; l++)s = o[l], (t && t !== s.callback && t !== s.callback._callback || r && r !== s.context) && i.push(s);
                i.length || delete this._events[e]
            }
        }
        return this
    }, trigger: function (e) {
        if (!this._events)return this;
        var t = u.call(arguments, 1);
        if (!c(this, "trigger", e, t))return this;
        var n = this._events[e], r = this._events.all;
        return n && h(n, t), r && h(r, arguments), this
    }, stopListening: function (e, t, r) {
        var i = this._listeningTo;
        if (!i)return this;
        var s = !t && !r;
        !r && typeof t == "object" && (r = this), e && ((i = {})[e._listenId] = e);
        for (var o in i)e = i[o], e.off(t, r, this), (s || n.isEmpty(e._events)) && delete this._listeningTo[o];
        return this
    }}, l = /\s+/, c = function (e, t, n, r) {
        if (!n)return!0;
        if (typeof n == "object")
        {
            for (var i in n)e[t].apply(e, [i, n[i]].concat(r));
            return!1
        }
        if (l.test(n))
        {
            var s = n.split(l);
            for (var o = 0, u = s.length; o < u; o++)e[t].apply(e, [s[o]].concat(r));
            return!1
        }
        return!0
    }, h = function (e, t) {
        var n, r = -1, i = e.length, s = t[0], o = t[1], u = t[2];
        switch (t.length)
        {
            case 0:
                while (++r < i)(n = e[r]).callback.call(n.ctx);
                return;
            case 1:
                while (++r < i)(n = e[r]).callback.call(n.ctx, s);
                return;
            case 2:
                while (++r < i)(n = e[r]).callback.call(n.ctx, s, o);
                return;
            case 3:
                while (++r < i)(n = e[r]).callback.call(n.ctx, s, o, u);
                return;
            default:
                while (++r < i)(n = e[r]).callback.apply(n.ctx, t)
        }
    }, p = {listenTo: "on", listenToOnce: "once"};
    n.each(p, function (e, t) {
        f[t] = function (t, r, i) {
            var s = this._listeningTo || (this._listeningTo = {}), o = t._listenId || (t._listenId = n.uniqueId("l"));
            return s[o] = t, !i && typeof r == "object" && (i = this), t[e](r, i, this), this
        }
    }), f.bind = f.on, f.unbind = f.off, n.extend(t, f);
    var d = t.Model = function (e, t) {
        var r = e || {};
        t || (t = {}), this.cid = n.uniqueId("c"), this.attributes = {}, t.collection && (this.collection = t.collection), t.parse && (r = this.parse(r, t) || {}), r = n.defaults({}, r, n.result(this, "defaults")), this.set(r, t), this.changed = {}, this.initialize.apply(this, arguments)
    };
    n.extend(d.prototype, f, {changed: null, validationError: null, idAttribute: "id", initialize: function () {
    }, toJSON: function (e) {
        return n.clone(this.attributes)
    }, sync: function () {
        return t.sync.apply(this, arguments)
    }, get: function (e) {
        return this.attributes[e]
    }, escape: function (e) {
        return n.escape(this.get(e))
    }, has: function (e) {
        return this.get(e) != null
    }, set: function (e, t, r) {
        var i, s, o, u, a, f, l, c;
        if (e == null)return this;
        typeof e == "object" ? (s = e, r = t) : (s = {})[e] = t, r || (r = {});
        if (!this._validate(s, r))return!1;
        o = r.unset, a = r.silent, u = [], f = this._changing, this._changing = !0, f || (this._previousAttributes = n.clone(this.attributes), this.changed = {}), c = this.attributes, l = this._previousAttributes, this.idAttribute in s && (this.id = s[this.idAttribute]);
        for (i in s)t = s[i], n.isEqual(c[i], t) || u.push(i), n.isEqual(l[i], t) ? delete this.changed[i] : this.changed[i] = t, o ? delete c[i] : c[i] = t;
        if (!a)
        {
            u.length && (this._pending = !0);
            for (var h = 0, p = u.length; h < p; h++)this.trigger("change:" + u[h], this, c[u[h]], r)
        }
        if (f)return this;
        if (!a)while (this._pending)this._pending = !1, this.trigger("change", this, r);
        return this._pending = !1, this._changing = !1, this
    }, unset: function (e, t) {
        return this.set(e, void 0, n.extend({}, t, {unset: !0}))
    }, clear: function (e) {
        var t = {};
        for (var r in this.attributes)t[r] = void 0;
        return this.set(t, n.extend({}, e, {unset: !0}))
    }, hasChanged: function (e) {
        return e == null ? !n.isEmpty(this.changed) : n.has(this.changed, e)
    }, changedAttributes: function (e) {
        if (!e)return this.hasChanged() ? n.clone(this.changed) : !1;
        var t, r = !1, i = this._changing ? this._previousAttributes : this.attributes;
        for (var s in e)
        {
            if (n.isEqual(i[s], t = e[s]))continue;
            (r || (r = {}))[s] = t
        }
        return r
    }, previous: function (e) {
        return e == null || !this._previousAttributes ? null : this._previousAttributes[e]
    }, previousAttributes: function () {
        return n.clone(this._previousAttributes)
    }, fetch: function (e) {
        e = e ? n.clone(e) : {}, e.parse === void 0 && (e.parse = !0);
        var t = this, r = e.success;
        return e.success = function (n) {
            if (!t.set(t.parse(n, e), e))return!1;
            r && r(t, n, e), t.trigger("sync", t, n, e)
        }, I(this, e), this.sync("read", this, e)
    }, save: function (e, t, r) {
        var i, s, o, u = this.attributes;
        e == null || typeof e == "object" ? (i = e, r = t) : (i = {})[e] = t, r = n.extend({validate: !0}, r);
        if (i && !r.wait)
        {
            if (!this.set(i, r))return!1
        }
        else if (!this._validate(i, r))return!1;
        i && r.wait && (this.attributes = n.extend({}, u, i)), r.parse === void 0 && (r.parse = !0);
        var a = this, f = r.success;
        return r.success = function (e) {
            a.attributes = u;
            var t = a.parse(e, r);
            r.wait && (t = n.extend(i || {}, t));
            if (n.isObject(t) && !a.set(t, r))return!1;
            f && f(a, e, r), a.trigger("sync", a, e, r)
        }, I(this, r), s = this.isNew() ? "create" : r.patch ? "patch" : "update", s === "patch" && (r.attrs = i), o = this.sync(s, this, r), i && r.wait && (this.attributes = u), o
    }, destroy: function (e) {
        e = e ? n.clone(e) : {};
        var t = this, r = e.success, i = function () {
            t.trigger("destroy", t, t.collection, e)
        };
        e.success = function (n) {
            (e.wait || t.isNew()) && i(), r && r(t, n, e), t.isNew() || t.trigger("sync", t, n, e)
        };
        if (this.isNew())return e.success(), !1;
        I(this, e);
        var s = this.sync("delete", this, e);
        return e.wait || i(), s
    }, url: function () {
        var e = n.result(this, "urlRoot") || n.result(this.collection, "url") || F();
        return this.isNew() ? e : e + (e.charAt(e.length - 1) === "/" ? "" : "/") + encodeURIComponent(this.id)
    }, parse: function (e, t) {
        return e
    }, clone: function () {
        return new this.constructor(this.attributes)
    }, isNew: function () {
        return this.id == null
    }, isValid: function (e) {
        return this._validate({}, n.extend(e || {}, {validate: !0}))
    }, _validate: function (e, t) {
        if (!t.validate || !this.validate)return!0;
        e = n.extend({}, this.attributes, e);
        var r = this.validationError = this.validate(e, t) || null;
        return r ? (this.trigger("invalid", this, r, n.extend(t, {validationError: r})), !1) : !0
    }});
    var v = ["keys", "values", "pairs", "invert", "pick", "omit"];
    n.each(v, function (e) {
        d.prototype[e] = function () {
            var t = u.call(arguments);
            return t.unshift(this.attributes), n[e].apply(n, t)
        }
    });
    var m = t.Collection = function (e, t) {
        t || (t = {}), t.model && (this.model = t.model), t.comparator !== void 0 && (this.comparator = t.comparator), this._reset(), this.initialize.apply(this, arguments), e && this.reset(e, n.extend({silent: !0}, t))
    }, g = {add: !0, remove: !0, merge: !0}, y = {add: !0, remove: !1};
    n.extend(m.prototype, f, {model: d, initialize: function () {
    }, toJSON: function (e) {
        return this.map(function (t) {
            return t.toJSON(e)
        })
    }, sync: function () {
        return t.sync.apply(this, arguments)
    }, add: function (e, t) {
        return this.set(e, n.extend({merge: !1}, t, y))
    }, remove: function (e, t) {
        var r = !n.isArray(e);
        e = r ? [e] : n.clone(e), t || (t = {});
        var i, s, o, u;
        for (i = 0, s = e.length; i < s; i++)
        {
            u = e[i] = this.get(e[i]);
            if (!u)continue;
            delete this._byId[u.id], delete this._byId[u.cid], o = this.indexOf(u), this.models.splice(o, 1), this.length--, t.silent || (t.index = o, u.trigger("remove", u, this, t)), this._removeReference(u)
        }
        return r ? e[0] : e
    }, set: function (e, t) {
        t = n.defaults({}, t, g), t.parse && (e = this.parse(e, t));
        var r = !n.isArray(e);
        e = r ? e ? [e] : [] : n.clone(e);
        var i, s, o, u, a, f, l, c = t.at, h = this.model, p = this.comparator && c == null && t.sort !== !1, v = n.isString(this.comparator) ? this.comparator : null, m = [], y = [], b = {}, w = t.add, E = t.merge, S = t.remove, x = !p && w && S ? [] : !1;
        for (i = 0, s = e.length; i < s; i++)
        {
            a = e[i], a instanceof d ? o = u = a : o = a[h.prototype.idAttribute];
            if (f = this.get(o))S && (b[f.cid] = !0), E && (a = a === u ? u.attributes : a, t.parse && (a = f.parse(a, t)), f.set(a, t), p && !l && f.hasChanged(v) && (l = !0)), e[i] = f;
            else if (w)
            {
                u = e[i] = this._prepareModel(a, t);
                if (!u)continue;
                m.push(u), u.on("all", this._onModelEvent, this), this._byId[u.cid] = u, u.id != null && (this._byId[u.id] = u)
            }
            x && x.push(f || u)
        }
        if (S)
        {
            for (i = 0, s = this.length; i < s; ++i)b[(u = this.models[i]).cid] || y.push(u);
            y.length && this.remove(y, t)
        }
        if (m.length || x && x.length)
        {
            p && (l = !0), this.length += m.length;
            if (c != null)for (i = 0, s = m.length; i < s; i++)this.models.splice(c + i, 0, m[i]);
            else
            {
                x && (this.models.length = 0);
                var T = x || m;
                for (i = 0, s = T.length; i < s; i++)this.models.push(T[i])
            }
        }
        l && this.sort({silent: !0});
        if (!t.silent)
        {
            for (i = 0, s = m.length; i < s; i++)(u = m[i]).trigger("add", u, this, t);
            (l || x && x.length) && this.trigger("sort", this, t)
        }
        return r ? e[0] : e
    }, reset: function (e, t) {
        t || (t = {});
        for (var r = 0, i = this.models.length; r < i; r++)this._removeReference(this.models[r]);
        return t.previousModels = this.models, this._reset(), e = this.add(e, n.extend({silent: !0}, t)), t.silent || this.trigger("reset", this, t), e
    }, push: function (e, t) {
        return this.add(e, n.extend({at: this.length}, t))
    }, pop: function (e) {
        var t = this.at(this.length - 1);
        return this.remove(t, e), t
    }, unshift: function (e, t) {
        return this.add(e, n.extend({at: 0}, t))
    }, shift: function (e) {
        var t = this.at(0);
        return this.remove(t, e), t
    }, slice: function () {
        return u.apply(this.models, arguments)
    }, get: function (e) {
        return e == null ? void 0 : this._byId[e.id] || this._byId[e.cid] || this._byId[e]
    }, at: function (e) {
        return this.models[e]
    }, where: function (e, t) {
        return n.isEmpty(e) ? t ? void 0 : [] : this[t ? "find" : "filter"](function (t) {
            for (var n in e)if (e[n] !== t.get(n))return!1;
            return!0
        })
    }, findWhere: function (e) {
        return this.where(e, !0)
    }, sort: function (e) {
        if (!this.comparator)throw new Error("Cannot sort a set without a comparator");
        return e || (e = {}), n.isString(this.comparator) || this.comparator.length === 1 ? this.models = this.sortBy(this.comparator, this) : this.models.sort(n.bind(this.comparator, this)), e.silent || this.trigger("sort", this, e), this
    }, pluck: function (e) {
        return n.invoke(this.models, "get", e)
    }, fetch: function (e) {
        e = e ? n.clone(e) : {}, e.parse === void 0 && (e.parse = !0);
        var t = e.success, r = this;
        return e.success = function (n) {
            var i = e.reset ? "reset" : "set";
            r[i](n, e), t && t(r, n, e), r.trigger("sync", r, n, e)
        }, I(this, e), this.sync("read", this, e)
    }, create: function (e, t) {
        t = t ? n.clone(t) : {};
        if (!(e = this._prepareModel(e, t)))return!1;
        t.wait || this.add(e, t);
        var r = this, i = t.success;
        return t.success = function (e, t, n) {
            n.wait && r.add(e, n), i && i(e, t, n)
        }, e.save(null, t), e
    }, parse: function (e, t) {
        return e
    }, clone: function () {
        return new this.constructor(this.models)
    }, _reset: function () {
        this.length = 0, this.models = [], this._byId = {}
    }, _prepareModel: function (e, t) {
        if (e instanceof d)return e.collection || (e.collection = this), e;
        t = t ? n.clone(t) : {}, t.collection = this;
        var r = new this.model(e, t);
        return r.validationError ? (this.trigger("invalid", this, r.validationError, t), !1) : r
    }, _removeReference: function (e) {
        this === e.collection && delete e.collection, e.off("all", this._onModelEvent, this)
    }, _onModelEvent: function (e, t, n, r) {
        if ((e === "add" || e === "remove") && n !== this)return;
        e === "destroy" && this.remove(t, r), t && e === "change:" + t.idAttribute && (delete this._byId[t.previous(t.idAttribute)], t.id != null && (this._byId[t.id] = t)), this.trigger.apply(this, arguments)
    }});
    var b = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "difference", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain"];
    n.each(b, function (e) {
        m.prototype[e] = function () {
            var t = u.call(arguments);
            return t.unshift(this.models), n[e].apply(n, t)
        }
    });
    var w = ["groupBy", "countBy", "sortBy"];
    n.each(w, function (e) {
        m.prototype[e] = function (t, r) {
            var i = n.isFunction(t) ? t : function (e) {
                return e.get(t)
            };
            return n[e](this.models, i, r)
        }
    });
    var E = t.View = function (e) {
        this.cid = n.uniqueId("view"), e || (e = {}), n.extend(this, n.pick(e, x)), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents()
    }, S = /^(\S+)\s*(.*)$/, x = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
    n.extend(E.prototype, f, {tagName: "div", $: function (e) {
        return this.$el.find(e)
    }, initialize: function () {
    }, render: function () {
        return this
    }, remove: function () {
        return this.$el.remove(), this.stopListening(), this
    }, setElement: function (e, n) {
        return this.$el && this.undelegateEvents(), this.$el = e instanceof t.$ ? e : t.$(e), this.el = this.$el[0], n !== !1 && this.delegateEvents(), this
    }, delegateEvents: function (e) {
        if (!e && !(e = n.result(this, "events")))return this;
        this.undelegateEvents();
        for (var t in e)
        {
            var r = e[t];
            n.isFunction(r) || (r = this[e[t]]);
            if (!r)continue;
            var i = t.match(S), s = i[1], o = i[2];
            r = n.bind(r, this), s += ".delegateEvents" + this.cid, o === "" ? this.$el.on(s, r) : this.$el.on(s, o, r)
        }
        return this
    }, undelegateEvents: function () {
        return this.$el.off(".delegateEvents" + this.cid), this
    }, _ensureElement: function () {
        if (!this.el)
        {
            var e = n.extend({}, n.result(this, "attributes"));
            this.id && (e.id = n.result(this, "id")), this.className && (e["class"] = n.result(this, "className"));
            var r = t.$("<" + n.result(this, "tagName") + ">").attr(e);
            this.setElement(r, !1)
        }
        else this.setElement(n.result(this, "el"), !1)
    }}), t.sync = function (e, r, i) {
        var s = N[e];
        n.defaults(i || (i = {}), {emulateHTTP: t.emulateHTTP, emulateJSON: t.emulateJSON});
        var o = {type: s, dataType: "json"};
        i.url || (o.url = n.result(r, "url") || F()), i.data == null && r && (e === "create" || e === "update" || e === "patch") && (o.contentType = "application/json", o.data = JSON.stringify(i.attrs || r.toJSON(i))), i.emulateJSON && (o.contentType = "application/x-www-form-urlencoded", o.data = o.data ? {model: o.data} : {});
        if (i.emulateHTTP && (s === "PUT" || s === "DELETE" || s === "PATCH"))
        {
            o.type = "POST", i.emulateJSON && (o.data._method = s);
            var u = i.beforeSend;
            i.beforeSend = function (e) {
                e.setRequestHeader("X-HTTP-Method-Override", s);
                if (u)return u.apply(this, arguments)
            }
        }
        o.type !== "GET" && !i.emulateJSON && (o.processData = !1), o.type === "PATCH" && T && (o.xhr = function () {
            return new ActiveXObject("Microsoft.XMLHTTP")
        });
        var a = i.xhr = t.ajax(n.extend(o, i));
        return r.trigger("request", r, a, i), a
    };
    var T = typeof window != "undefined" && !!window.ActiveXObject && (!window.XMLHttpRequest || !(new XMLHttpRequest).dispatchEvent), N = {create: "POST", update: "PUT", patch: "PATCH", "delete": "DELETE", read: "GET"};
    t.ajax = function () {
        return t.$.ajax.apply(t.$, arguments)
    };
    var C = t.Router = function (e) {
        e || (e = {}), e.routes && (this.routes = e.routes), this._bindRoutes(), this.initialize.apply(this, arguments)
    }, k = /\((.*?)\)/g, L = /(\(\?)?:\w+/g, A = /\*\w+/g, O = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    n.extend(C.prototype, f, {initialize: function () {
    }, route: function (e, r, i) {
        n.isRegExp(e) || (e = this._routeToRegExp(e)), n.isFunction(r) && (i = r, r = ""), i || (i = this[r]);
        var s = this;
        return t.history.route(e, function (n) {
            var o = s._extractParameters(e, n);
            i && i.apply(s, o), s.trigger.apply(s, ["route:" + r].concat(o)), s.trigger("route", r, o), t.history.trigger("route", s, r, o)
        }), this
    }, navigate: function (e, n) {
        return t.history.navigate(e, n), this
    }, _bindRoutes: function () {
        if (!this.routes)return;
        this.routes = n.result(this, "routes");
        var e, t = n.keys(this.routes);
        while ((e = t.pop()) != null)this.route(e, this.routes[e])
    }, _routeToRegExp: function (e) {
        return e = e.replace(O, "\\$&").replace(k, "(?:$1)?").replace(L, function (e, t) {
            return t ? e : "([^/]+)"
        }).replace(A, "(.*?)"), new RegExp("^" + e + "$")
    }, _extractParameters: function (e, t) {
        var r = e.exec(t).slice(1);
        return n.map(r, function (e) {
            return e ? decodeURIComponent(e) : null
        })
    }});
    var M = t.History = function () {
        this.handlers = [], n.bindAll(this, "checkUrl"), typeof window != "undefined" && (this.location = window.location, this.history = window.history)
    }, _ = /^[#\/]|\s+$/g, D = /^\/+|\/+$/g, P = /msie [\w.]+/, H = /\/$/, B = /[?#].*$/;
    M.started = !1, n.extend(M.prototype, f, {interval: 50, getHash: function (e) {
        var t = (e || this).location.href.match(/#(.*)$/);
        return t ? t[1] : ""
    }, getFragment: function (e, t) {
        if (e == null)if (this._hasPushState || !this._wantsHashChange || t)
        {
            e = this.location.pathname;
            var n = this.root.replace(H, "");
            e.indexOf(n) || (e = e.slice(n.length))
        }
        else e = this.getHash();
        return e.replace(_, "")
    }, start: function (e) {
        if (M.started)throw new Error("Backbone.history has already been started");
        M.started = !0, this.options = n.extend({root: "/"}, this.options, e), this.root = this.options.root, this._wantsHashChange = this.options.hashChange !== !1, this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
        var r = this.getFragment(), i = document.documentMode, s = P.exec(navigator.userAgent.toLowerCase()) && (!i || i <= 7);
        this.root = ("/" + this.root + "/").replace(D, "/"), s && this._wantsHashChange && (this.iframe = t.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(r)), this._hasPushState ? t.$(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange"in window && !s ? t.$(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = r;
        var o = this.location, u = o.pathname.replace(/[^\/]$/, "$&/") === this.root;
        if (this._wantsHashChange && this._wantsPushState)
        {
            if (!this._hasPushState && !u)return this.fragment = this.getFragment(null, !0), this.location.replace(this.root + this.location.search + "#" + this.fragment), !0;
            this._hasPushState && u && o.hash && (this.fragment = this.getHash().replace(_, ""), this.history.replaceState({}, document.title, this.root + this.fragment + o.search))
        }
        if (!this.options.silent)return this.loadUrl()
    }, stop: function () {
        t.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl), clearInterval(this._checkUrlInterval), M.started = !1
    }, route: function (e, t) {
        this.handlers.unshift({route: e, callback: t})
    }, checkUrl: function (e) {
        var t = this.getFragment();
        t === this.fragment && this.iframe && (t = this.getFragment(this.getHash(this.iframe)));
        if (t === this.fragment)return!1;
        this.iframe && this.navigate(t), this.loadUrl()
    }, loadUrl: function (e) {
        return e = this.fragment = this.getFragment(e), n.any(this.handlers, function (t) {
            if (t.route.test(e))return t.callback(e), !0
        })
    }, navigate: function (e, t) {
        if (!M.started)return!1;
        if (!t || t === !0)t = {trigger: !!t};
        var n = this.root + (e = this.getFragment(e || ""));
        e = e.replace(B, "");
        if (this.fragment === e)return;
        this.fragment = e, e === "" && n !== "/" && (n = n.slice(0, -1));
        if (this._hasPushState)this.history[t.replace ? "replaceState" : "pushState"]({}, document.title, n);
        else
        {
            if (!this._wantsHashChange)return this.location.assign(n);
            this._updateHash(this.location, e, t.replace), this.iframe && e !== this.getFragment(this.getHash(this.iframe)) && (t.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, e, t.replace))
        }
        if (t.trigger)return this.loadUrl(e)
    }, _updateHash: function (e, t, n) {
        if (n)
        {
            var r = e.href.replace(/(javascript:|#).*$/, "");
            e.replace(r + "#" + t)
        }
        else e.hash = "#" + t
    }}), t.history = new M;
    var j = function (e, t) {
        var r = this, i;
        e && n.has(e, "constructor") ? i = e.constructor : i = function () {
            return r.apply(this, arguments)
        }, n.extend(i, r, t);
        var s = function () {
            this.constructor = i
        };
        return s.prototype = r.prototype, i.prototype = new s, e && n.extend(i.prototype, e), i.__super__ = r.prototype, i
    };
    d.extend = m.extend = C.extend = E.extend = M.extend = j;
    var F = function () {
        throw new Error('A "url" property or function must be specified')
    }, I = function (e, t) {
        var n = t.error;
        t.error = function (r) {
            n && n(e, r, t), e.trigger("error", e, r, t)
        }
    };
    return t
}), define("utils/class", ["backbone", "underscore"], function (e, t) {
    var n = function () {
        this.initialize.apply(this, arguments)
    };
    return t.extend(n.prototype, e.Events, {initialize: function () {
    }}), n.extend = e.Model.extend, n
}), define("utils/user.agent", ["utils/class"], function (e) {
    var t = e.extend({initialize: function () {
    }, isMobile: function () {
        var e = !1;
        return function (t) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4)))e = !0
        }(navigator.userAgent || navigator.vendor || window.opera), e
    }, isIPad: function () {
        return navigator.userAgent.match(/iPad/i)
    }});
    return t
}), define("utils/image.changer", ["utils/class"], function (e) {
    var t = e.extend({initialize: function () {
    }, changeRotationImage: function (e, t) {
        var n = Zepto("#booster-orientation-screen-" + t).css("background-image"), r = n.split("url("), i = r[1].split("images"), s = i[0] + "images/" + e;
        Zepto("#booster-orientation-screen-" + t).css("background-image", "url('" + s + "')")
    }, changeSplashImage: function (e) {
        var t = Zepto("#splash-logo").css("background-image"), n = t.split("url("), r = n[1].split("images"), i = r[0] + "images/" + e;
        Zepto("#splash-logo").css("background-image", "url('" + i + "')")
    }});
    return t
}), function () {
    var e = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"], t = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, n = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im, r = typeof location != "undefined" && location.href, i = r && location.protocol && location.protocol.replace(/\:/, ""), s = r && location.hostname, o = r && (location.port || void 0), u = [];
    define("text", [], function () {
        var a, f, l;
        return typeof window != "undefined" && window.navigator && window.document ? f = function (e, t) {
            var n = a.createXhr();
            n.open("GET", e, !0), n.onreadystatechange = function () {
                n.readyState === 4 && t(n.responseText)
            }, n.send(null)
        } : typeof process != "undefined" && process.versions && process.versions.node ? (l = require.nodeRequire("fs"), f = function (e, t) {
            t(l.readFileSync(e, "utf8"))
        }) : typeof Packages != "undefined" && (f = function (e, t) {
            var n = new java.io.File(e), r = java.lang.System.getProperty("line.separator"), n = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(n), "utf-8")), i, s, o = "";
            try
            {
                i = new java.lang.StringBuffer, (s = n.readLine()) && s.length() && s.charAt(0) === 65279 && (s = s.substring(1));
                for (i.append(s); (s = n.readLine()) !== null;)i.append(r), i.append(s);
                o = String(i.toString())
            } finally
            {
                n.close()
            }
            t(o)
        }), a = {version: "0.27.0", strip: function (e) {
            if (e)
            {
                var e = e.replace(t, ""), r = e.match(n);
                r && (e = r[1])
            }
            else e = "";
            return e
        }, jsEscape: function (e) {
            return e.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r")
        }, createXhr: function () {
            var t, n, r;
            if (typeof XMLHttpRequest != "undefined")return new XMLHttpRequest;
            for (n = 0; n < 3; n++)
            {
                r = e[n];
                try
                {
                    t = new ActiveXObject(r)
                } catch (i)
                {
                }
                if (t)
                {
                    e = [r];
                    break
                }
            }
            if (!t)throw Error("createXhr(): XMLHttpRequest not available");
            return t
        }, get: f, parseName: function (e) {
            var t = !1, n = e.indexOf("."), r = e.substring(0, n), e = e.substring(n + 1, e.length), n = e.indexOf("!");
            return n !== -1 && (t = e.substring(n + 1, e.length), t = t === "strip", e = e.substring(0, n)), {moduleName: r, ext: e, strip: t}
        }, xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/, useXhr: function (e, t, n, r) {
            var i = a.xdRegExp.exec(e), s;
            return i ? (e = i[2], i = i[3], i = i.split(":"), s = i[1], i = i[0], (!e || e === t) && (!i || i === n) && (!s && !i || s === r)) : !0
        }, finishLoad: function (e, t, n, r, i) {
            n = t ? a.strip(n) : n, i.isBuild && i.inlineText && (u[e] = n), r(n)
        }, load: function (e, t, n, u) {
            var f = a.parseName(e), l = f.moduleName + "." + f.ext, c = t.toUrl(l), h = u && u.text && u.text.useXhr || a.useXhr;
            !r || h(c, i, s, o) ? a.get(c, function (t) {
                a.finishLoad(e, f.strip, t, n, u)
            }) : t([l], function (e) {
                a.finishLoad(f.moduleName + "." + f.ext, f.strip, e, n, u)
            })
        }, write: function (e, t, n) {
            if (t in u)
            {
                var r = a.jsEscape(u[t]);
                n.asModule(e + "!" + t, "define(function () { return '" + r + "';});\n")
            }
        }, writeFile: function (e, t, n, r, i) {
            var t = a.parseName(t), s = t.moduleName + "." + t.ext, o = n.toUrl(t.moduleName + "." + t.ext) + ".js";
            a.load(s, n, function () {
                var t = function (e) {
                    return r(o, e)
                };
                t.asModule = function (e, t) {
                    return r.asModule(e, o, t)
                }, a.write(e, s, t, i)
            }, i)
        }}
    })
}(), define("text!templates/rotation.html", [], function () {
    return'<div id="booster-orientation-screen-<%= orientation %>">\n  <div id="logo"></div>\n  <p id="rotation-text">Please rotate your device.</p><!-- TODO: make text external -->\n</div>'
}), define("views/rotation.screen", ["zepto", "underscore", "backbone", "utils/image.changer", "text!templates/rotation.html"], function (e, t, n, r, i) {
    var s = new r, o = n.View.extend({orientation: "portrait", minimalUI: !1, rotationImage: "rotate.png", initialize: function (e) {
        e.orientation != undefined && (this.orientation = e.orientation), e.minimalUI != undefined && (this.minimalUI = e.minimalUI), e.rotationImage != undefined && (this.rotationImage = e.rotationImage), this.minimalUI && (window.onresize = function () {
            window.scrollTo(0, 1)
        }), this.render(this.orientation, this.rotationImage)
    }, render: function (n, r) {
        var o = t.template(i, {orientation: n});
        e("body").append(o), r != "rotate.png" && (s.changeRotationImage(r, n), e("#rotation-text").remove())
    }});
    return o
}), define("text!templates/splash.html", [], function () {
    return'<div id="booster-splash">\n  <div id="splash-logo" class="content"></div>\n</div>'
}), define("views/splash.screen", ["zepto", "underscore", "backbone", "utils/image.changer", "text!templates/splash.html"], function (e, t, n, r, i) {
    var s = new r, o = n.View.extend({splashImage: "BoosterMedia320x115.png", el: "body", events: {"oanimationend #booster-splash": "splashFinshed", "animationend #booster-splash": "splashFinshed", "webkitAnimationEnd #booster-splash": "splashFinshed"}, initialize: function (e) {
        e.splashImage != undefined && (this.splashImage = e.splashImage), this.render(this.splashImage)
    }, splashFinshed: function () {
        e("#booster-splash").remove();
        try
        {
            window.Booster.onSplashFinishedEvent.call()
        } catch (t)
        {
            console.log(t)
        }
    }, render: function (n) {
        var r = t.template(i, {});
        e("body").append(r), n != "BoosterMedia320x115.png" && s.changeSplashImage(n)
    }});
    return o
}), define("utils/extend.zepto", ["utils/class"], function (e) {
    var t = e.extend({initialize: function () {
    }, attachScript: function (e, t, n) {
        var r = document.createElement("script");
        r.type = "text/javascript", r.onload = t, r.onerror = n, r.src = e, $("head").append(r)
    }, attachDirectScript: function (e) {
        var t = document.createElement("script");
        t.type = "text/javascript", t.text = e, $("head").append(t)
    }, attachCSS: function (e, t, n) {
        var r = document.createElement("link");
        r.rel = "stylesheet", r.type = "text/css", r.onload = t, r.onerror = n, r.href = e, $("head").append(r)
    }, attachMetaTag: function (e, t) {
        var n = document.createElement("meta");
        n.name = e, n.content = t, $("head").prepend(n)
    }});
    return t
}), define("views/meta.tags", ["zepto", "underscore", "backbone", "utils/extend.zepto"], function (e, t, n, r) {
    var i = n.View.extend({el: "body", extendZepto: null, initialize: function () {
        this.extendZepto = new r, this.checkAndAddTag("viewport", "user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0, minimal-ui"), this.checkAndAddTag("mobile-web-app-capable", "yes"), this.checkAndAddTag("apple-mobile-web-app-capable", "yes"), this.checkAndAddTag("apple-mobile-web-app-status-bar-style", "yes")
    }, checkAndAddTag: function (t, n) {
        e('[name="' + t + '"]').length == 0 && this.extendZepto.attachMetaTag(t, n)
    }});
    return i
}), define("booster", ["underscore", "backbone", "utils/class", "utils/user.agent", "views/rotation.screen", "views/splash.screen", "views/meta.tags"], function (e, t, n, r, i, s, o) {
    var u = n.extend({orientation: "both", splash: !0, minimalUI: !1, rotationImage: "rotate.png", splashImage: "BoosterMedia320x115.png", initialize: function (e) {
        e == undefined && (e = {}), e.orientation != undefined && (this.orientation = e.orientation), e.splash != undefined && (this.splash = Boolean(e.splash)), e.minimalUI != undefined && (this.minimalUI = Boolean(e.minimalUI)), e.rotationImage != undefined && (this.rotationImage = e.rotationImage), e.splashImage != undefined && (this.splashImage = e.splashImage), this.splash && new s({splashImage: this.splashImage});
        var t = new r;
        this.orientation != "both" && (t.isMobile() || t.isIPad()) && new i({orientation: this.orientation, minimalUI: this.minimalUI, rotationImage: this.rotationImage})
    }});
    return u
}), define("utils/url", ["utils/class"], function (e) {
    var t = e.extend({initialize: function () {
    }, getURLParameter: function (e) {
        return decodeURI((RegExp(e + "=" + "(.+?)(&|$)").exec(location.search) || [, null])[1])
    }, addHTTP: function (e) {
        return e.substr(0, 7) !== "http://" ? "http://" + e : e
    }});
    return t
}), define("models/analytics", ["zepto", "underscore", "backbone", "utils/url"], function (e, t, n, r) {
    var i = n.Model.extend({ANALYTICS_ACCOUNT_ID: "UA-34318136-1", HONEY_TRACKS_API_ID: "cf7ef2ac9fbe4a82b2f2fbcb3232ec36a4893f94", firstMenuLoad: !0, gameId: 0, name: "", developer: "", category: "", sessionId: "unkown", initialize: function (t) {
        this.gameId = t.gameId, this.name = t.gameName, this.developer = t.developer, this.category = t.gameCategory;
        var n = document.createElement("script");
        n.type = "text/javascript", n.async = !0, n.src = ("https:" === document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
        var r = e("script").get(0);
        r.parentNode.insertBefore(n, r);
        var i = document.createElement("script");
        i.type = "text/javascript", i.async = !0, i.src = (document.location.protocol == "https:" ? "" : "") + "js/HoneyTracks_Tracker_Library.js";
        var r = e("script").get(0);
        r.parentNode.insertBefore(i, r), this._setVariables()
    }, gamePlay: function () {
        this._trackPageGoogle("gameplay"), window._HoneyTracksTracking.push(function () {
            HoneyTracks_Tracker_Library.TrackLogin()
        })
    }, menu: function () {
        this.firstMenuLoad && (this.firstMenuLoad = !1, this.gamePlay()), this._trackEventGoogle("menu")
    }, level: function (e) {
        this._trackEventGoogle("level", parseInt(e)), window._HoneyTracksTracking.push(function () {
            HoneyTracks_Tracker_Library.TrackLevelup(parseInt(e))
        })
    }, score: function (e) {
        this._trackEventGoogle("score", parseInt(e)), window._HoneyTracksTracking.push(function () {
            HoneyTracks_Tracker_Library.TrackFeatureUsage("score", null, null, {score: e}, 1)
        })
    }, _setVariables: function (e, t, n) {
        var i = new r, s = String(i.getURLParameter("bm.source"));
        window._gaq = window._gaq || [], window._gaq.push(["b._setAccount", this.ANALYTICS_ACCOUNT_ID]), window._gaq.push(["b._setCustomVar", 1, "GameName", '"' + String(this.name) + '"', 3]), window._gaq.push(["b._setCustomVar", 2, "GameID", '"' + String(this.gameId) + '"', 3]), window._gaq.push(["b._setCustomVar", 3, "Category", '"' + String(this.category) + '"', 3]), window._gaq.push(["b._setCustomVar", 4, "Developer", '"' + String(this.developer) + '"', 3]), window._gaq.push(["b._setCustomVar", 5, "Source", '"' + s + '"', 3]), window._HoneyTracksSDKConfig = window._HoneyTracksSDKConfig || {_ApiKey: this.HONEY_TRACKS_API_ID, Language: "en_US", Space: s + "::" + this.category + "::" + this.developer + "::" + this.name, UniqueCustomerIdentifier: this.sessionId}, window._HoneyTracksTracking = []
    }, _trackEventGoogle: function (e, t) {
        window._gaq.push(["b._trackEvent", this.gameId, e, null, t])
    }, _trackPageGoogle: function (e) {
        window._gaq.push(["b._trackPageview", "/ingame/" + this.category + "/" + this.developer + "/" + this.gameId + "/" + this.name + "/" + e])
    }});
    return i
});
var NO_JQUERY = {};
(function (e, t, n) {
    if (!("console"in e))
    {
        var r = e.console = {};
        r.log = r.warn = r.error = r.debug = function () {
        }
    }
    t === NO_JQUERY && (t = {fn: {}, extend: function () {
        var e = arguments[0];
        for (var t = 1, n = arguments.length; t < n; t++)
        {
            var r = arguments[t];
            for (var i in r)e[i] = r[i]
        }
        return e
    }}), t.fn.pm = function () {
        return console.log("usage: \nto send:    $.pm(options)\nto receive: $.pm.bind(type, fn, [origin])"), this
    }, t.pm = e.pm = function (e) {
        i.send(e)
    }, t.pm.bind = e.pm.bind = function (e, t, n, r, s) {
        i.bind(e, t, n, r, s === !0)
    }, t.pm.unbind = e.pm.unbind = function (e, t) {
        i.unbind(e, t)
    }, t.pm.origin = e.pm.origin = null, t.pm.poll = e.pm.poll = 200;
    var i = {send: function (e) {
        var n = t.extend({}, i.defaults, e), r = n.target;
        if (!n.target)
        {
            console.warn("postmessage target window required");
            return
        }
        if (!n.type)
        {
            console.warn("postmessage type required");
            return
        }
        var s = {data: n.data, type: n.type};
        n.success && (s.callback = i._callback(n.success)), n.error && (s.errback = i._callback(n.error)), "postMessage"in r && !n.hash ? (i._bind(), r.postMessage(JSON.stringify(s), n.origin || "*")) : (i.hash._bind(), i.hash.send(n, s))
    }, bind: function (e, t, n, r, s) {
        i._replyBind(e, t, n, r, s)
    }, _replyBind: function (n, r, s, o, u) {
        "postMessage"in e && !o ? i._bind() : i.hash._bind();
        var a = i.data("listeners.postmessage");
        a || (a = {}, i.data("listeners.postmessage", a));
        var f = a[n];
        f || (f = [], a[n] = f), f.push({fn: r, callback: u, origin: s || t.pm.origin})
    }, unbind: function (e, t) {
        var n = i.data("listeners.postmessage");
        if (n)if (e)if (t)
        {
            var r = n[e];
            if (r)
            {
                var s = [];
                for (var o = 0, u = r.length; o < u; o++)
                {
                    var a = r[o];
                    a.fn !== t && s.push(a)
                }
                n[e] = s
            }
        }
        else delete n[e];
        else for (var o in n)delete n[o]
    }, data: function (e, t) {
        return t === n ? i._data[e] : (i._data[e] = t, t)
    }, _data: {}, _CHARS: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), _random: function () {
        var e = [];
        for (var t = 0; t < 32; t++)e[t] = i._CHARS[0 | Math.random() * 32];
        return e.join("")
    }, _callback: function (e) {
        var t = i.data("callbacks.postmessage");
        t || (t = {}, i.data("callbacks.postmessage", t));
        var n = i._random();
        return t[n] = e, n
    }, _bind: function () {
        i.data("listening.postmessage") || (e.addEventListener ? e.addEventListener("message", i._dispatch, !1) : e.attachEvent && e.attachEvent("onmessage", i._dispatch), i.data("listening.postmessage", 1))
    }, _dispatch: function (e) {
        try
        {
            var t = JSON.parse(e.data)
        } catch (n)
        {
            console.warn("postmessage data invalid json: ", n);
            return
        }
        if (!t.type)
        {
            console.warn("postmessage message type required");
            return
        }
        var r = i.data("callbacks.postmessage") || {}, s = r[t.type];
        if (s)s(t.data);
        else
        {
            var o = i.data("listeners.postmessage") || {}, u = o[t.type] || [];
            for (var a = 0, f = u.length; a < f; a++)
            {
                var l = u[a];
                if (l.origin && l.origin !== "*" && e.origin !== l.origin)
                {
                    console.warn("postmessage message origin mismatch", e.origin, l.origin);
                    if (t.errback)
                    {
                        var c = {message: "postmessage origin mismatch", origin: [e.origin, l.origin]};
                        i.send({target: e.source, data: c, type: t.errback})
                    }
                    continue
                }
                function h(n) {
                    t.callback && i.send({target: e.source, data: n, type: t.callback})
                }

                try
                {
                    l.callback ? l.fn(t.data, h, e) : h(l.fn(t.data, e))
                } catch (n)
                {
                    if (!t.errback)throw n;
                    i.send({target: e.source, data: n, type: t.errback})
                }
            }
        }
    }};
    i.hash = {send: function (t, n) {
        var r = t.target, s = t.url;
        if (!s)
        {
            console.warn("postmessage target window url is required");
            return
        }
        s = i.hash._url(s);
        var o, u = i.hash._url(e.location.href);
        if (e == r.parent)o = "parent";
        else try
        {
            for (var a = 0, f = parent.frames.length; a < f; a++)
            {
                var l = parent.frames[a];
                if (l == e)
                {
                    o = a;
                    break
                }
            }
        } catch (c)
        {
            o = e.name
        }
        if (o == null)
        {
            console.warn("postmessage windows must be direct parent/child windows and the child must be available through the parent window.frames list");
            return
        }
        var h = {"x-requested-with": "postmessage", source: {name: o, url: u}, postmessage: n}, p = "#x-postmessage-id=" + i._random();
        r.location = s + p + encodeURIComponent(JSON.stringify(h))
    }, _regex: /^\#x\-postmessage\-id\=(\w{32})/, _regex_len: "#x-postmessage-id=".length + 32, _bind: function () {
        i.data("polling.postmessage") || (setInterval(function () {
            var t = "" + e.location.hash, n = i.hash._regex.exec(t);
            if (n)
            {
                var r = n[1];
                i.hash._last !== r && (i.hash._last = r, i.hash._dispatch(t.substring(i.hash._regex_len)))
            }
        }, t.pm.poll || 200), i.data("polling.postmessage", 1))
    }, _dispatch: function (t) {
        if (!t)return;
        try
        {
            t = JSON.parse(decodeURIComponent(t));
            if (!(t["x-requested-with"] === "postmessage" && t.source && t.source.name != null && t.source.url && t.postmessage))return
        } catch (n)
        {
            return
        }
        var r = t.postmessage, s = i.data("callbacks.postmessage") || {}, o = s[r.type];
        if (o)o(r.data);
        else
        {
            var u;
            t.source.name === "parent" ? u = e.parent : u = e.frames[t.source.name];
            var a = i.data("listeners.postmessage") || {}, f = a[r.type] || [];
            for (var l = 0, c = f.length; l < c; l++)
            {
                var h = f[l];
                if (h.origin)
                {
                    var p = /https?\:\/\/[^\/]*/.exec(t.source.url)[0];
                    if (h.origin !== "*" && p !== h.origin)
                    {
                        console.warn("postmessage message origin mismatch", p, h.origin);
                        if (r.errback)
                        {
                            var d = {message: "postmessage origin mismatch", origin: [p, h.origin]};
                            i.send({target: u, data: d, type: r.errback, hash: !0, url: t.source.url})
                        }
                        continue
                    }
                }
                function v(e) {
                    r.callback && i.send({target: u, data: e, type: r.callback, hash: !0, url: t.source.url})
                }

                try
                {
                    h.callback ? h.fn(r.data, v) : v(h.fn(r.data))
                } catch (n)
                {
                    if (!r.errback)throw n;
                    i.send({target: u, data: n, type: r.errback, hash: !0, url: t.source.url})
                }
            }
        }
    }, _url: function (e) {
        return("" + e).replace(/#.*$/, "")
    }}, t.extend(i, {defaults: {target: null, url: null, type: null, data: null, success: null, error: null, origin: "*", hash: !1}})
})(this, typeof jQuery == "undefined" ? NO_JQUERY : jQuery), "JSON"in window && window.JSON || (JSON = {}), function () {
    function f(e) {
        return e < 10 ? "0" + e : e
    }

    function quote(e) {
        return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function (e) {
            var t = meta[e];
            return typeof t == "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + e + '"'
    }

    function str(e, t) {
        var n, r, i, s, o = gap, u, a = t[e];
        a && typeof a == "object" && typeof a.toJSON == "function" && (a = a.toJSON(e)), typeof rep == "function" && (a = rep.call(t, e, a));
        switch (typeof a)
        {
            case"string":
                return quote(a);
            case"number":
                return isFinite(a) ? String(a) : "null";
            case"boolean":
            case"null":
                return String(a);
            case"object":
                if (!a)return"null";
                gap += indent, u = [];
                if (Object.prototype.toString.apply(a) === "[object Array]")
                {
                    s = a.length;
                    for (n = 0; n < s; n += 1)u[n] = str(n, a) || "null";
                    return i = u.length === 0 ? "[]" : gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + o + "]" : "[" + u.join(",") + "]", gap = o, i
                }
                if (rep && typeof rep == "object")
                {
                    s = rep.length;
                    for (n = 0; n < s; n += 1)r = rep[n], typeof r == "string" && (i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i))
                }
                else for (r in a)Object.hasOwnProperty.call(a, r) && (i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i));
                return i = u.length === 0 ? "{}" : gap ? "{\n" + gap + u.join(",\n" + gap) + "\n" + o + "}" : "{" + u.join(",") + "}", gap = o, i
        }
    }

    typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function (e) {
        return this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z"
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (e) {
        return this.valueOf()
    });
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {"\b": "\\b", "	": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"}, rep;
    typeof JSON.stringify != "function" && (JSON.stringify = function (e, t, n) {
        var r;
        gap = "", indent = "";
        if (typeof n == "number")for (r = 0; r < n; r += 1)indent += " ";
        else typeof n == "string" && (indent = n);
        rep = t;
        if (!t || typeof t == "function" || typeof t == "object" && typeof t.length == "number")return str("", {"": e});
        throw new Error("JSON.stringify")
    }), typeof JSON.parse != "function" && (JSON.parse = function (text, reviver) {
        function walk(e, t) {
            var n, r, i = e[t];
            if (i && typeof i == "object")for (n in i)Object.hasOwnProperty.call(i, n) && (r = walk(i, n), r !== undefined ? i[n] = r : delete i[n]);
            return reviver.call(e, t, i)
        }

        var j;
        cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (e) {
            return"\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({"": j}, "") : j;
        throw new SyntaxError("JSON.parse")
    })
}(), define("postmessage", function () {
}), define("text!templates/community.html", [], function () {
    return'<iframe id="booster-community-tab" name="booster-community-tab" class="hide" src="<%= source %>/boosterbar.bbmenu/bbmenu?bm.gameid=<%= bmGameId %>" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>'
}), define("views/community.frame", ["zepto", "underscore", "backbone", "postmessage", "text!templates/community.html", "utils/url"], function (e, t, n, r, i, s) {
    var o = n.View.extend({el: "body", initialize: function (e) {
        this.render(e.bmGameId)
    }, close: function () {
        e("iframe#booster-community-tab").addClass("hide")
    }, open: function () {
        e("iframe#booster-community-tab").removeClass();
        var t = new s;
        pm({target: window.frames["booster-community-tab"], url: t.addHTTP(t.getURLParameter("bm.source")), type: "open-menu"})
    }, render: function (n) {
        var r = new s, o = t.template(i, {bmGameId: n, source: r.addHTTP(r.getURLParameter("bm.source"))});
        e("body").append(o)
    }});
    return o
}), define("models/highscore", ["backbone"], function (e) {
    var t = e.Model.extend({defaults: {score: 0}, initialize: function () {
    }, submit: function (e) {
        return this.get("score") < e ? (this.set("score", e), !0) : !1
    }}, {singleton: null, getInstance: function () {
        return t.singleton = t.singleton || new t, t.singleton
    }});
    return t
}), define("text!templates/highscore.html", [], function () {
    return'<iframe id="booster-highscore-popup" name="booster-highscore-popup" class="hide" src="<%= source %>/boosterbar.bbhighscore/bbhighscore?bm.gameid=<%= bmGameId %>" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>'
}), define("views/highscore.frame", ["zepto", "underscore", "backbone", "postmessage", "models/highscore", "text!templates/highscore.html", "utils/url"], function (e, t, n, r, i, s, o) {
    var u = n.View.extend({callback: new Function, initialize: function (e) {
        this._render(e.bmGameId);
        var t = this;
        pm.bind("bbhighscore", function (e) {
            t._close()
        })
    }, _close: function () {
        this.callback != undefined && this.callback.call(), e("iframe#booster-highscore-popup").addClass("hide")
    }, submit: function (e) {
        var t = i.getInstance(), n = new o, r = Math.round(e.score);
        n.getURLParameter("submitallscores") == "true" || t.submit(r) ? this.scoreSubmit(e, r) : (this.callback = e.callback, this.callback.call())
    }, scoreSubmit: function (t, n) {
        var r = new o;
        this.callback = t.callback, e("iframe#booster-highscore-popup").removeClass("hide"), pm({target: window.frames["booster-highscore-popup"], url: r.addHTTP(r.getURLParameter("bm.source")), type: "open-highscore", data: {highscore: n, bmGameId: t.bmGameId}, success: function (e) {
            console.log(e)
        }, error: function (e) {
            console.log(e)
        }})
    }, _render: function (n) {
        var r = new o, i = t.template(s, {bmGameId: n, source: r.addHTTP(r.getURLParameter("bm.source"))});
        e("body").append(i)
    }});
    return u
}), define("text!templates/tab.html", [], function () {
    return'<div id="booster-tab" class="icon-menu <%= side %>"></div>'
}), define("text!templates/logo-tab.html", [], function () {
    return'<div id="booster-tab-logo" class="<%= side %>" style="background-image: url(<%= baseURL %>/images/<%= icon %>)"></div>'
}), define("views/booster.tab", ["zepto", "underscore", "backbone", "postmessage", "views/community.frame", "views/highscore.frame", "text!templates/tab.html", "text!templates/logo-tab.html", "utils/url"], function (e, t, n, r, i, s, o, u, a) {
    var f = n.View.extend({TOTAL_NR_OF_POSITIONS: 18, el: "body", events: {"touchend #booster-tab": "_click", "touchend #booster-tab-logo": "_click"}, community: {}, highscore: {}, isOpen: !1, position: 0, bmGameId: 0, side: "left", menuIcon: undefined, clicked: !1, hasId: !1, initialize: function (t) {
        t.position != undefined && (this.position = t.position, this.side = this.position <= this.TOTAL_NR_OF_POSITIONS / 2 ? "left" : "right", t.tabIcon && (t.tabIcon.indexOf(".png") != -1 ? this.menuIcon = t.tabIcon : console.log("File for the menu icon isn't a .png extension")));
        var n = new a;
        try
        {
            var r = n.getURLParameter("bm.gameid");
            this.bmGameId = r
        } catch (i)
        {
            console.log(i)
        }
        n.getURLParameter("bm.source") != "null" && n.getURLParameter("bm.gameid") != "null" && (this.hasId = !0, this._render());
        var s = this;
        e("#booster-tab").click(function (e) {
            s._click(e)
        }), e("#booster-tab-logo").click(function (e) {
            s._click(e)
        }), pm.bind("bbmenu", function (e) {
            s._close()
        }), pm.bind("content-loaded", function (e) {
            s._initCommunity()
        }), pm.bind("bblogin", function (e) {
            s.goToLogin()
        }), pm.bind("backtoPortal", function () {
            s.goBackToPortal()
        }), pm.bind("refreshPage", function (e) {
            s._refresh()
        })
    }, _click: function (e) {
        e.preventDefault();
        if (!this.clicked)
        {
            this.clicked = !0;
            var t = this;
            setTimeout(function () {
                t._open()
            }, 400);
            var t = this;
            setTimeout(function () {
                t.clicked = !1
            }, 1e3)
        }
    }, _close: function () {
        e("#booster-tab").removeClass("hide"), e("#booster-tab-logo").removeClass("hide"), this.isOpen = !1, this.community.close();
        try
        {
            window.Booster.onCloseTab.call()
        } catch (t)
        {
            console.log("onCloseTab not implemented")
        }
    }, getPosition: function () {
        return this.position <= this.TOTAL_NR_OF_POSITIONS / 2 ? this.position + "0" : this.position - this.TOTAL_NR_OF_POSITIONS / 2 + "0"
    }, goBackToPortal: function () {
        var e = new a;
        window.top.location = e.addHTTP(e.getURLParameter("bm.source"))
    }, goToLogin: function () {
        var e = window.top.location.href, t = new a;
        window.top.location = t.addHTTP(t.getURLParameter("bm.source") + "/community.login/login?source=boosterBar&ret=" + encodeURIComponent(e))
    }, _initCommunity: function () {
        var e = this.getPosition();
        pm({target: window.frames["booster-community-tab"], type: "content-pos", data: {position: "content-" + this.side, top: e}, error: function (e) {
            console.log(e)
        }})
    }, _open: function () {
        e("#booster-tab").addClass("hide"), e("#booster-tab-logo").addClass("hide"), this.isOpen = !0, this.community.open();
        try
        {
            window.Booster.onOpenTab.call()
        } catch (t)
        {
            console.log("onOpenTab not implemented")
        }
    }, _refresh: function () {
        this._close(), pm({target: window.frames["booster-community-tab"], type: "refreshPage"})
    }, _render: function () {
        if (this.menuIcon != undefined)var n = t.template(u, {side: this.side, baseURL: window.bb_base_path, icon: this.menuIcon});
        else var n = t.template(o, {side: this.side});
        e("body").append(n), 0, e("#booster-tab-logo").css("top", this.getPosition() + "%"), e("#booster-tab").css("top", this.getPosition() + "%"), this.community = new i({bmGameId: this.bmGameId}), this.highscore = new s({bmGameId: this.bmGameId})
    }, submitScore: function (e) {
        this.hasId ? this.highscore.submit({score: e.score, bmGameId: this.bmGameId, callback: e.callback}) : e.callback != undefined && e.callback.call()
    }});
    return f
}), function (e) {
    var t = "Close", n = "BeforeClose", r = "AfterClose", i = "BeforeAppend", s = "MarkupParse", o = "Open", u = "Change", a = "mfp", f = "." + a, l = "mfp-ready", c = "mfp-removing", h = "mfp-prevent-close", p, d = function () {
    }, v = !!window.jQuery, m, g = e(window), y, b, w, E, S, x = function (e, t) {
        p.ev.on(a + e + f, t)
    }, T = function (t, n, r, i) {
        var s = document.createElement("div");
        return s.className = "mfp-" + t, r && (s.innerHTML = r), i ? n && n.appendChild(s) : (s = e(s), n && s.appendTo(n)), s
    }, N = function (t, n) {
        p.ev.triggerHandler(a + t, n), p.st.callbacks && (t = t.charAt(0).toLowerCase() + t.slice(1), p.st.callbacks[t] && p.st.callbacks[t].apply(p, e.isArray(n) ? n : [n]))
    }, C = function (t) {
        if (t !== S || !p.currTemplate.closeBtn)p.currTemplate.closeBtn = e(p.st.closeMarkup.replace("%title%", p.st.tClose)), S = t;
        return p.currTemplate.closeBtn
    }, k = function () {
        e.magnificPopup.instance || (p = new d, p.init(), e.magnificPopup.instance = p)
    }, L = function () {
        var e = document.createElement("p").style, t = ["ms", "O", "Moz", "Webkit"];
        if (e.transition !== undefined)return!0;
        while (t.length)if (t.pop() + "Transition"in e)return!0;
        return!1
    };
    d.prototype = {constructor: d, init: function () {
        var t = navigator.appVersion;
        p.isIE7 = t.indexOf("MSIE 7.") !== -1, p.isIE8 = t.indexOf("MSIE 8.") !== -1, p.isLowIE = p.isIE7 || p.isIE8, p.isAndroid = /android/gi.test(t), p.isIOS = /iphone|ipad|ipod/gi.test(t), p.supportsTransition = L(), p.probablyMobile = p.isAndroid || p.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), b = e(document), p.popupsCache = {}
    }, open: function (t) {
        y || (y = e(document.body));
        var n;
        if (t.isObj === !1)
        {
            p.items = t.items.toArray(), p.index = 0;
            var r = t.items, i;
            for (n = 0; n < r.length; n++)
            {
                i = r[n], i.parsed && (i = i.el[0]);
                if (i === t.el[0])
                {
                    p.index = n;
                    break
                }
            }
        }
        else p.items = e.isArray(t.items) ? t.items : [t.items], p.index = t.index || 0;
        if (p.isOpen)
        {
            p.updateItemHTML();
            return
        }
        p.types = [], E = "", t.mainEl && t.mainEl.length ? p.ev = t.mainEl.eq(0) : p.ev = b, t.key ? (p.popupsCache[t.key] || (p.popupsCache[t.key] = {}), p.currTemplate = p.popupsCache[t.key]) : p.currTemplate = {}, p.st = e.extend(!0, {}, e.magnificPopup.defaults, t), p.fixedContentPos = p.st.fixedContentPos === "auto" ? !p.probablyMobile : p.st.fixedContentPos, p.st.modal && (p.st.closeOnContentClick = !1, p.st.closeOnBgClick = !1, p.st.showCloseBtn = !1, p.st.enableEscapeKey = !1), p.bgOverlay || (p.bgOverlay = T("bg").on("click" + f, function () {
            p.close()
        }), p.wrap = T("wrap").attr("tabindex", -1).on("click" + f, function (e) {
            p._checkIfClose(e.target) && p.close()
        }), p.container = T("container", p.wrap)), p.contentContainer = T("content"), p.st.preloader && (p.preloader = T("preloader", p.container, p.st.tLoading));
        var u = e.magnificPopup.modules;
        for (n = 0; n < u.length; n++)
        {
            var a = u[n];
            a = a.charAt(0).toUpperCase() + a.slice(1), p["init" + a].call(p)
        }
        N("BeforeOpen"), p.st.showCloseBtn && (p.st.closeBtnInside ? (x(s, function (e, t, n, r) {
            n.close_replaceWith = C(r.type)
        }), E += " mfp-close-btn-in") : p.wrap.append(C())), p.st.alignTop && (E += " mfp-align-top"), p.fixedContentPos ? p.wrap.css({overflow: p.st.overflowY, overflowX: "hidden", overflowY: p.st.overflowY}) : p.wrap.css({top: g.scrollTop(), position: "absolute"}), (p.st.fixedBgPos === !1 || p.st.fixedBgPos === "auto" && !p.fixedContentPos) && p.bgOverlay.css({height: b.height(), position: "absolute"}), p.st.enableEscapeKey && b.on("keyup" + f, function (e) {
            e.keyCode === 27 && p.close()
        }), g.on("resize" + f, function () {
            p.updateSize()
        }), p.st.closeOnContentClick || (E += " mfp-auto-cursor"), E && p.wrap.addClass(E);
        var c = p.wH = g.height(), h = {};
        if (p.fixedContentPos && p._hasScrollBar(c))
        {
            var d = p._getScrollbarSize();
            d && (h.marginRight = d)
        }
        p.fixedContentPos && (p.isIE7 ? e("body, html").css("overflow", "hidden") : h.overflow = "hidden");
        var v = p.st.mainClass;
        return p.isIE7 && (v += " mfp-ie7"), v && p._addClassToMFP(v), p.updateItemHTML(), N("BuildControls"), e("html").css(h), p.bgOverlay.add(p.wrap).prependTo(p.st.prependTo || y), p._lastFocusedEl = document.activeElement, setTimeout(function () {
            p.content ? (p._addClassToMFP(l), p._setFocus()) : p.bgOverlay.addClass(l), b.on("focusin" + f, p._onFocusIn)
        }, 16), p.isOpen = !0, p.updateSize(c), N(o), t
    }, close: function () {
        if (!p.isOpen)return;
        N(n), p.isOpen = !1, p.st.removalDelay && !p.isLowIE && p.supportsTransition ? (p._addClassToMFP(c), setTimeout(function () {
            p._close()
        }, p.st.removalDelay)) : p._close()
    }, _close: function () {
        N(t);
        var n = c + " " + l + " ";
        p.bgOverlay.detach(), p.wrap.detach(), p.container.empty(), p.st.mainClass && (n += p.st.mainClass + " "), p._removeClassFromMFP(n);
        if (p.fixedContentPos)
        {
            var i = {marginRight: ""};
            p.isIE7 ? e("body, html").css("overflow", "") : i.overflow = "", e("html").css(i)
        }
        b.off("keyup" + f + " focusin" + f), p.ev.off(f), p.wrap.attr("class", "mfp-wrap").removeAttr("style"), p.bgOverlay.attr("class", "mfp-bg"), p.container.attr("class", "mfp-container"), p.st.showCloseBtn && (!p.st.closeBtnInside || p.currTemplate[p.currItem.type] === !0) && p.currTemplate.closeBtn && p.currTemplate.closeBtn.detach(), p._lastFocusedEl && e(p._lastFocusedEl).focus(), p.currItem = null, p.content = null, p.currTemplate = null, p.prevHeight = 0, N(r)
    }, updateSize: function (e) {
        if (p.isIOS)
        {
            var t = document.documentElement.clientWidth / window.innerWidth, n = window.innerHeight * t;
            p.wrap.css("height", n), p.wH = n
        }
        else p.wH = e || g.height();
        p.fixedContentPos || p.wrap.css("height", p.wH), N("Resize")
    }, updateItemHTML: function () {
        var t = p.items[p.index];
        p.contentContainer.detach(), p.content && p.content.detach(), t.parsed || (t = p.parseEl(p.index));
        var n = t.type;
        N("BeforeChange", [p.currItem ? p.currItem.type : "", n]), p.currItem = t;
        if (!p.currTemplate[n])
        {
            var r = p.st[n] ? p.st[n].markup : !1;
            N("FirstMarkupParse", r), r ? p.currTemplate[n] = e(r) : p.currTemplate[n] = !0
        }
        w && w !== t.type && p.container.removeClass("mfp-" + w + "-holder");
        var i = p["get" + n.charAt(0).toUpperCase() + n.slice(1)](t, p.currTemplate[n]);
        p.appendContent(i, n), t.preloaded = !0, N(u, t), w = t.type, p.container.prepend(p.contentContainer), N("AfterChange")
    }, appendContent: function (e, t) {
        p.content = e, e ? p.st.showCloseBtn && p.st.closeBtnInside && p.currTemplate[t] === !0 ? p.content.find(".mfp-close").length || p.content.append(C()) : p.content = e : p.content = "", N(i), p.container.addClass("mfp-" + t + "-holder"), p.contentContainer.append(p.content)
    }, parseEl: function (t) {
        var n = p.items[t], r;
        n.tagName ? n = {el: e(n)} : (r = n.type, n = {data: n, src: n.src});
        if (n.el)
        {
            var i = p.types;
            for (var s = 0; s < i.length; s++)if (n.el.hasClass("mfp-" + i[s]))
            {
                r = i[s];
                break
            }
            n.src = n.el.attr("data-mfp-src"), n.src || (n.src = n.el.attr("href"))
        }
        return n.type = r || p.st.type || "inline", n.index = t, n.parsed = !0, p.items[t] = n, N("ElementParse", n), p.items[t]
    }, addGroup: function (e, t) {
        var n = function (n) {
            n.mfpEl = this, p._openClick(n, e, t)
        };
        t || (t = {});
        var r = "click.magnificPopup";
        t.mainEl = e, t.items ? (t.isObj = !0, e.off(r).on(r, n)) : (t.isObj = !1, t.delegate ? e.off(r).on(r, t.delegate, n) : (t.items = e, e.off(r).on(r, n)))
    }, _openClick: function (t, n, r) {
        var i = r.midClick !== undefined ? r.midClick : e.magnificPopup.defaults.midClick;
        if (!i && (t.which === 2 || t.ctrlKey || t.metaKey))return;
        var s = r.disableOn !== undefined ? r.disableOn : e.magnificPopup.defaults.disableOn;
        if (s)if (e.isFunction(s))
        {
            if (!s.call(p))return!0
        }
        else if (g.width() < s)return!0;
        t.type && (t.preventDefault(), p.isOpen && t.stopPropagation()), r.el = e(t.mfpEl), r.delegate && (r.items = n.find(r.delegate)), p.open(r)
    }, updateStatus: function (e, t) {
        if (p.preloader)
        {
            m !== e && p.container.removeClass("mfp-s-" + m), !t && e === "loading" && (t = p.st.tLoading);
            var n = {status: e, text: t};
            N("UpdateStatus", n), e = n.status, t = n.text, p.preloader.html(t), p.preloader.find("a").on("click", function (e) {
                e.stopImmediatePropagation()
            }), p.container.addClass("mfp-s-" + e), m = e
        }
    }, _checkIfClose: function (t) {
        if (e(t).hasClass(h))return;
        var n = p.st.closeOnContentClick, r = p.st.closeOnBgClick;
        if (n && r)return!0;
        if (!p.content || e(t).hasClass("mfp-close") || p.preloader && t === p.preloader[0])return!0;
        if (t !== p.content[0] && !e.contains(p.content[0], t))
        {
            if (r && e.contains(document, t))return!0
        }
        else if (n)return!0;
        return!1
    }, _addClassToMFP: function (e) {
        p.bgOverlay.addClass(e), p.wrap.addClass(e)
    }, _removeClassFromMFP: function (e) {
        this.bgOverlay.removeClass(e), p.wrap.removeClass(e)
    }, _hasScrollBar: function (e) {
        return(p.isIE7 ? b.height() : document.body.scrollHeight) > (e || g.height())
    }, _setFocus: function () {
        (p.st.focus ? p.content.find(p.st.focus).eq(0) : p.wrap).focus()
    }, _onFocusIn: function (t) {
        if (t.target !== p.wrap[0] && !e.contains(p.wrap[0], t.target))return p._setFocus(), !1
    }, _parseMarkup: function (t, n, r) {
        var i;
        r.data && (n = e.extend(r.data, n)), N(s, [t, n, r]), e.each(n, function (e, n) {
            if (n === undefined || n === !1)return!0;
            i = e.split("_");
            if (i.length > 1)
            {
                var r = t.find(f + "-" + i[0]);
                if (r.length > 0)
                {
                    var s = i[1];
                    s === "replaceWith" ? r[0] !== n[0] && r.replaceWith(n) : s === "img" ? r.is("img") ? r.attr("src", n) : r.replaceWith('<img src="' + n + '" class="' + r.attr("class") + '" />') : r.attr(i[1], n)
                }
            }
            else t.find(f + "-" + e).html(n)
        })
    }, _getScrollbarSize: function () {
        if (p.scrollbarSize === undefined)
        {
            var e = document.createElement("div");
            e.id = "mfp-sbm", e.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(e), p.scrollbarSize = e.offsetWidth - e.clientWidth, document.body.removeChild(e)
        }
        return p.scrollbarSize
    }}, e.magnificPopup = {instance: null, proto: d.prototype, modules: [], open: function (t, n) {
        return k(), t ? t = e.extend(!0, {}, t) : t = {}, t.isObj = !0, t.index = n || 0, this.instance.open(t)
    }, close: function () {
        return e.magnificPopup.instance && e.magnificPopup.instance.close()
    }, registerModule: function (t, n) {
        n.options && (e.magnificPopup.defaults[t] = n.options), e.extend(this.proto, n.proto), this.modules.push(t)
    }, defaults: {disableOn: 0, key: null, midClick: !1, mainClass: "", preloader: !0, focus: "", closeOnContentClick: !1, closeOnBgClick: !0, closeBtnInside: !0, showCloseBtn: !0, enableEscapeKey: !0, modal: !1, alignTop: !1, removalDelay: 0, prependTo: null, fixedContentPos: "auto", fixedBgPos: "auto", overflowY: "auto", closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>', tClose: "Close (Esc)", tLoading: "Loading..."}}, e.fn.magnificPopup = function (t) {
        k();
        var n = e(this);
        if (typeof t == "string")if (t === "open")
        {
            var r, i = v ? n.data("magnificPopup") : n[0].magnificPopup, s = parseInt(arguments[1], 10) || 0;
            i.items ? r = i.items[s] : (r = n, i.delegate && (r = r.find(i.delegate)), r = r.eq(s)), p._openClick({mfpEl: r}, n, i)
        }
        else p.isOpen && p[t].apply(p, Array.prototype.slice.call(arguments, 1));
        else t = e.extend(!0, {}, t), v ? n.data("magnificPopup", t) : n[0].magnificPopup = t, p.addGroup(n, t);
        return n
    };
    var A = "inline", O, M, _, D = function () {
        _ && (M.after(_.addClass(O)).detach(), _ = null)
    };
    e.magnificPopup.registerModule(A, {options: {hiddenClass: "hide", markup: "", tNotFound: "Content not found"}, proto: {initInline: function () {
        p.types.push(A), x(t + "." + A, function () {
            D()
        })
    }, getInline: function (t, n) {
        D();
        if (t.src)
        {
            var r = p.st.inline, i = e(t.src);
            if (i.length)
            {
                var s = i[0].parentNode;
                s && s.tagName && (M || (O = r.hiddenClass, M = T(O), O = "mfp-" + O), _ = i.after(M).detach().removeClass(O)), p.updateStatus("ready")
            }
            else p.updateStatus("error", r.tNotFound), i = e("<div>");
            return t.inlineElement = i, i
        }
        return p.updateStatus("ready"), p._parseMarkup(n, {}, t), n
    }}});
    var P = "ajax", H, B = function () {
        H && y.removeClass(H)
    }, j = function () {
        B(), p.req && p.req.abort()
    };
    e.magnificPopup.registerModule(P, {options: {settings: null, cursor: "mfp-ajax-cur", tError: '<a href="%url%">The content</a> could not be loaded.'}, proto: {initAjax: function () {
        p.types.push(P), H = p.st.ajax.cursor, x(t + "." + P, j), x("BeforeChange." + P, j)
    }, getAjax: function (t) {
        H && y.addClass(H), p.updateStatus("loading");
        var n = e.extend({url: t.src, success: function (n, r, i) {
            var s = {data: n, xhr: i};
            N("ParseAjax", s), p.appendContent(e(s.data), P), t.finished = !0, B(), p._setFocus(), setTimeout(function () {
                p.wrap.addClass(l)
            }, 16), p.updateStatus("ready"), N("AjaxContentAdded")
        }, error: function () {
            B(), t.finished = t.loadError = !0, p.updateStatus("error", p.st.ajax.tError.replace("%url%", t.src))
        }}, p.st.ajax.settings);
        return p.req = e.ajax(n), ""
    }}});
    var F, I = function (t) {
        if (t.data && t.data.title !== undefined)return t.data.title;
        var n = p.st.image.titleSrc;
        if (n)
        {
            if (e.isFunction(n))return n.call(p, t);
            if (t.el)return t.el.attr(n) || ""
        }
        return""
    };
    e.magnificPopup.registerModule("image", {options: {markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>', cursor: "mfp-zoom-out-cur", titleSrc: "title", verticalFit: !0, tError: '<a href="%url%">The image</a> could not be loaded.'}, proto: {initImage: function () {
        var e = p.st.image, n = ".image";
        p.types.push("image"), x(o + n, function () {
            p.currItem.type === "image" && e.cursor && y.addClass(e.cursor)
        }), x(t + n, function () {
            e.cursor && y.removeClass(e.cursor), g.off("resize" + f)
        }), x("Resize" + n, p.resizeImage), p.isLowIE && x("AfterChange", p.resizeImage)
    }, resizeImage: function () {
        var e = p.currItem;
        if (!e || !e.img)return;
        if (p.st.image.verticalFit)
        {
            var t = 0;
            p.isLowIE && (t = parseInt(e.img.css("padding-top"), 10) + parseInt(e.img.css("padding-bottom"), 10)), e.img.css("max-height", p.wH - t)
        }
    }, _onImageHasSize: function (e) {
        e.img && (e.hasSize = !0, F && clearInterval(F), e.isCheckingImgSize = !1, N("ImageHasSize", e), e.imgHidden && (p.content && p.content.removeClass("mfp-loading"), e.imgHidden = !1))
    }, findImageSize: function (e) {
        var t = 0, n = e.img[0], r = function (i) {
            F && clearInterval(F), F = setInterval(function () {
                if (n.naturalWidth > 0)
                {
                    p._onImageHasSize(e);
                    return
                }
                t > 200 && clearInterval(F), t++, t === 3 ? r(10) : t === 40 ? r(50) : t === 100 && r(500)
            }, i)
        };
        r(1)
    }, getImage: function (t, n) {
        var r = 0, i = function () {
            t && (t.img[0].complete ? (t.img.off(".mfploader"), t === p.currItem && (p._onImageHasSize(t), p.updateStatus("ready")), t.hasSize = !0, t.loaded = !0, N("ImageLoadComplete")) : (r++, r < 200 ? setTimeout(i, 100) : s()))
        }, s = function () {
            t && (t.img.off(".mfploader"), t === p.currItem && (p._onImageHasSize(t), p.updateStatus("error", o.tError.replace("%url%", t.src))), t.hasSize = !0, t.loaded = !0, t.loadError = !0)
        }, o = p.st.image, u = n.find(".mfp-img");
        if (u.length)
        {
            var a = document.createElement("img");
            a.className = "mfp-img", t.img = e(a).on("load.mfploader", i).on("error.mfploader", s), a.src = t.src, u.is("img") && (t.img = t.img.clone()), a = t.img[0], a.naturalWidth > 0 ? t.hasSize = !0 : a.width || (t.hasSize = !1)
        }
        return p._parseMarkup(n, {title: I(t), img_replaceWith: t.img}, t), p.resizeImage(), t.hasSize ? (F && clearInterval(F), t.loadError ? (n.addClass("mfp-loading"), p.updateStatus("error", o.tError.replace("%url%", t.src))) : (n.removeClass("mfp-loading"), p.updateStatus("ready")), n) : (p.updateStatus("loading"), t.loading = !0, t.hasSize || (t.imgHidden = !0, n.addClass("mfp-loading"), p.findImageSize(t)), n)
    }}});
    var q, R = function () {
        return q === undefined && (q = document.createElement("p").style.MozTransform !== undefined), q
    };
    e.magnificPopup.registerModule("zoom", {options: {enabled: !1, easing: "ease-in-out", duration: 300, opener: function (e) {
        return e.is("img") ? e : e.find("img")
    }}, proto: {initZoom: function () {
        var e = p.st.zoom, r = ".zoom", i;
        if (!e.enabled || !p.supportsTransition)return;
        var s = e.duration, o = function (t) {
            var n = t.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"), r = "all " + e.duration / 1e3 + "s " + e.easing, i = {position: "fixed", zIndex: 9999, left: 0, top: 0, "-webkit-backface-visibility": "hidden"}, s = "transition";
            return i["-webkit-" + s] = i["-moz-" + s] = i["-o-" + s] = i[s] = r, n.css(i), n
        }, u = function () {
            p.content.css("visibility", "visible")
        }, a, f;
        x("BuildControls" + r, function () {
            if (p._allowZoom())
            {
                clearTimeout(a), p.content.css("visibility", "hidden"), i = p._getItemToZoom();
                if (!i)
                {
                    u();
                    return
                }
                f = o(i), f.css(p._getOffset()), p.wrap.append(f), a = setTimeout(function () {
                    f.css(p._getOffset(!0)), a = setTimeout(function () {
                        u(), setTimeout(function () {
                            f.remove(), i = f = null, N("ZoomAnimationEnded")
                        }, 16)
                    }, s)
                }, 16)
            }
        }), x(n + r, function () {
            if (p._allowZoom())
            {
                clearTimeout(a), p.st.removalDelay = s;
                if (!i)
                {
                    i = p._getItemToZoom();
                    if (!i)return;
                    f = o(i)
                }
                f.css(p._getOffset(!0)), p.wrap.append(f), p.content.css("visibility", "hidden"), setTimeout(function () {
                    f.css(p._getOffset())
                }, 16)
            }
        }), x(t + r, function () {
            p._allowZoom() && (u(), f && f.remove(), i = null)
        })
    }, _allowZoom: function () {
        return p.currItem.type === "image"
    }, _getItemToZoom: function () {
        return p.currItem.hasSize ? p.currItem.img : !1
    }, _getOffset: function (t) {
        var n;
        t ? n = p.currItem.img : n = p.st.zoom.opener(p.currItem.el || p.currItem);
        var r = n.offset(), i = parseInt(n.css("padding-top"), 10), s = parseInt(n.css("padding-bottom"), 10);
        r.top -= e(window).scrollTop() - i;
        var o = {width: n.width(), height: (v ? n.innerHeight() : n[0].offsetHeight) - s - i};
        return R() ? o["-moz-transform"] = o.transform = "translate(" + r.left + "px," + r.top + "px)" : (o.left = r.left, o.top = r.top), o
    }}});
    var U = "iframe", z = "//about:blank", W = function (e) {
        if (p.currTemplate[U])
        {
            var t = p.currTemplate[U].find("iframe");
            t.length && (e || (t[0].src = z), p.isIE8 && t.css("display", e ? "block" : "none"))
        }
    };
    e.magnificPopup.registerModule(U, {options: {markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>', srcAction: "iframe_src", patterns: {youtube: {index: "youtube.com", id: "v=", src: "//www.youtube.com/embed/%id%?autoplay=1"}, vimeo: {index: "vimeo.com/", id: "/", src: "//player.vimeo.com/video/%id%?autoplay=1"}, gmaps: {index: "//maps.google.", src: "%id%&output=embed"}}}, proto: {initIframe: function () {
        p.types.push(U), x("BeforeChange", function (e, t, n) {
            t !== n && (t === U ? W() : n === U && W(!0))
        }), x(t + "." + U, function () {
            W()
        })
    }, getIframe: function (t, n) {
        var r = t.src, i = p.st.iframe;
        e.each(i.patterns, function () {
            if (r.indexOf(this.index) > -1)return this.id && (typeof this.id == "string" ? r = r.substr(r.lastIndexOf(this.id) + this.id.length, r.length) : r = this.id.call(this, r)), r = this.src.replace("%id%", r), !1
        });
        var s = {};
        return i.srcAction && (s[i.srcAction] = r), p._parseMarkup(n, s, t), p.updateStatus("ready"), n
    }}});
    var X = function (e) {
        var t = p.items.length;
        return e > t - 1 ? e - t : e < 0 ? t + e : e
    }, V = function (e, t, n) {
        return e.replace(/%curr%/gi, t + 1).replace(/%total%/gi, n)
    };
    e.magnificPopup.registerModule("gallery", {options: {enabled: !1, arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', preload: [0, 2], navigateByImgClick: !0, arrows: !0, tPrev: "Previous (Left arrow key)", tNext: "Next (Right arrow key)", tCounter: "%curr% of %total%"}, proto: {initGallery: function () {
        var n = p.st.gallery, r = ".mfp-gallery", i = Boolean(e.fn.mfpFastClick);
        p.direction = !0;
        if (!n || !n.enabled)return!1;
        E += " mfp-gallery", x(o + r, function () {
            n.navigateByImgClick && p.wrap.on("click" + r, ".mfp-img", function () {
                if (p.items.length > 1)return p.next(), !1
            }), b.on("keydown" + r, function (e) {
                e.keyCode === 37 ? p.prev() : e.keyCode === 39 && p.next()
            })
        }), x("UpdateStatus" + r, function (e, t) {
            t.text && (t.text = V(t.text, p.currItem.index, p.items.length))
        }), x(s + r, function (e, t, r, i) {
            var s = p.items.length;
            r.counter = s > 1 ? V(n.tCounter, i.index, s) : ""
        }), x("BuildControls" + r, function () {
            if (p.items.length > 1 && n.arrows && !p.arrowLeft)
            {
                var t = n.arrowMarkup, r = p.arrowLeft = e(t.replace(/%title%/gi, n.tPrev).replace(/%dir%/gi, "left")).addClass(h), s = p.arrowRight = e(t.replace(/%title%/gi, n.tNext).replace(/%dir%/gi, "right")).addClass(h), o = i ? "mfpFastClick" : "click";
                r[o](function () {
                    p.prev()
                }), s[o](function () {
                    p.next()
                }), p.isIE7 && (T("b", r[0], !1, !0), T("a", r[0], !1, !0), T("b", s[0], !1, !0), T("a", s[0], !1, !0)), p.container.append(r.add(s))
            }
        }), x(u + r, function () {
            p._preloadTimeout && clearTimeout(p._preloadTimeout), p._preloadTimeout = setTimeout(function () {
                p.preloadNearbyImages(), p._preloadTimeout = null
            }, 16)
        }), x(t + r, function () {
            b.off(r), p.wrap.off("click" + r), p.arrowLeft && i && p.arrowLeft.add(p.arrowRight).destroyMfpFastClick(), p.arrowRight = p.arrowLeft = null
        })
    }, next: function () {
        p.direction = !0, p.index = X(p.index + 1), p.updateItemHTML()
    }, prev: function () {
        p.direction = !1, p.index = X(p.index - 1), p.updateItemHTML()
    }, goTo: function (e) {
        p.direction = e >= p.index, p.index = e, p.updateItemHTML()
    }, preloadNearbyImages: function () {
        var e = p.st.gallery.preload, t = Math.min(e[0], p.items.length), n = Math.min(e[1], p.items.length), r;
        for (r = 1; r <= (p.direction ? n : t); r++)p._preloadItem(p.index + r);
        for (r = 1; r <= (p.direction ? t : n); r++)p._preloadItem(p.index - r)
    }, _preloadItem: function (t) {
        t = X(t);
        if (p.items[t].preloaded)return;
        var n = p.items[t];
        n.parsed || (n = p.parseEl(t)), N("LazyLoad", n), n.type === "image" && (n.img = e('<img class="mfp-img" />').on("load.mfploader", function () {
            n.hasSize = !0
        }).on("error.mfploader", function () {
            n.hasSize = !0, n.loadError = !0, N("LazyLoadError", n)
        }).attr("src", n.src)), n.preloaded = !0
    }}});
    var $ = "retina";
    e.magnificPopup.registerModule($, {options: {replaceSrc: function (e) {
        return e.src.replace(/\.\w+$/, function (e) {
            return"@2x" + e
        })
    }, ratio: 1}, proto: {initRetina: function () {
        if (window.devicePixelRatio > 1)
        {
            var e = p.st.retina, t = e.ratio;
            t = isNaN(t) ? t() : t, t > 1 && (x("ImageHasSize." + $, function (e, n) {
                n.img.css({"max-width": n.img[0].naturalWidth / t, width: "100%"})
            }), x("ElementParse." + $, function (n, r) {
                r.src = e.replaceSrc(r, t)
            }))
        }
    }}}), function () {
        var t = 1e3, n = "ontouchstart"in window, r = function () {
            g.off("touchmove" + s + " touchend" + s)
        }, i = "mfpFastClick", s = "." + i;
        e.fn.mfpFastClick = function (i) {
            return e(this).each(function () {
                var o = e(this), u;
                if (n)
                {
                    var a, f, l, c, h, p;
                    o.on("touchstart" + s, function (e) {
                        c = !1, p = 1, h = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0], f = h.clientX, l = h.clientY, g.on("touchmove" + s, function (e) {
                            h = e.originalEvent ? e.originalEvent.touches : e.touches, p = h.length, h = h[0];
                            if (Math.abs(h.clientX - f) > 10 || Math.abs(h.clientY - l) > 10)c = !0, r()
                        }).on("touchend" + s, function (e) {
                            r();
                            if (c || p > 1)return;
                            u = !0, e.preventDefault(), clearTimeout(a), a = setTimeout(function () {
                                u = !1
                            }, t), i()
                        })
                    })
                }
                o.on("click" + s, function () {
                    u || i()
                })
            })
        }, e.fn.destroyMfpFastClick = function () {
            e(this).off("touchstart" + s + " click" + s), n && g.off("touchmove" + s + " touchend" + s)
        }
    }(), k()
}(window.Zepto), define("magnificpopup", function () {
}), define("models/ad.model", ["backbone"], function (e) {
    var t = 0, n = e.Model.extend({defaults: {interval: 0, startDate: 0}, initialize: function () {
    }, showAdvertising: function (e) {
        var t = Date.now();
        return this.get("startDate") < t ? (this.set("interval", e), this.dateOld = t + this.get("interval"), this.set("startDate", this.dateOld), !0) : !1
    }}, {singleton: null, getInstance: function () {
        return n.singleton = n.singleton || new n, n.singleton
    }});
    return n
}), define("models/adsense.model", ["backbone", "zepto"], function (e, t) {
    var n, r, i, s, o, u, a, f = e.Model.extend({defaults: {ad_client: "ca-games-pub-7203084817284772"}, initialize: function () {
    }, createAdDisplayContainer: function (e) {
        i = new google.ima.AdDisplayContainer(document.getElementById("adContainer")), this.requestAds(e)
    }, requestAds: function (e) {
        i.initialize();
        var t = this;
        r = new google.ima.AdsLoader(i), r.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function (e) {
            t.onAdsManagerLoaded(e)
        }, !1), r.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (e) {
            t.onAdError(e)
        }, !1);
        var n = new google.ima.AdsRequest;
        n.adTagUrl = "http://googleads.g.doubleclick.net/pagead/ads?ad_type=image&client=" + this.get("ad_client") + "&channel=" + e, console.log(n.adTagUrl), n.linearAdSlotWidth = 300, n.linearAdSlotHeight = 250, n.nonLinearAdSlotWidth = 300, n.nonLinearAdSlotHeight = 250, r.requestAds(n)
    }, onAdsManagerLoaded: function (e) {
        u = t("#contentElement"), n = e.getAdsManager(u);
        var r = this;
        n.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError), n.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.onContentPauseRequested), n.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, this.onContentResumeRequested), n.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, this.onAdEvent), n.addEventListener(google.ima.AdEvent.Type.LOADED, this.onAdEvent), n.addEventListener(google.ima.AdEvent.Type.STARTED, this.onAdEvent), n.addEventListener(google.ima.AdEvent.Type.COMPLETE, this.onAdEvent), n.addEventListener(google.ima.AdEvent.Type.USER_CLOSE, this.onAdEvent), n.addEventListener(google.ima.AdEvent.Type.CLICK, this.onAdEvent);
        try
        {
            n.init(300, 250, google.ima.ViewMode.NORMAL), n.start()
        } catch (i)
        {
            console.log(i)
        }
    }, onAdEvent: function (e) {
        var n = e.getAd();
        switch (e.type)
        {
            case google.ima.AdEvent.Type.LOADED:
                n.isLinear() || (n.adSlotWidth = "300px", n.adSlotHeight = "250px");
                break;
            case google.ima.AdEvent.Type.STARTED:
                n.isLinear();
                try
                {
                    var r, i = 15;
                    s = setInterval(function () {
                        r = i--, t("#timerText").html("Advertisement will close automatically in: " + r), r === 0 && (clearInterval(s), t.magnificPopup.close())
                    }, 1e3)
                } catch (o)
                {
                    console.log(o)
                }
                break;
            case google.ima.AdEvent.Type.COMPLETE:
                n.isLinear();
                break;
            case google.ima.AdEvent.Type.USER_CLOSE:
                try
                {
                    clearInterval(s), t.magnificPopup.close()
                } catch (o)
                {
                    console.log("These functions don't exist", o)
                }
                break;
            case google.ima.AdEvent.Type.CLICK:
                clearInterval(s);

                if( typeof(kik) !== "undefined" && kik.browser )
                {
                    kik.open(n.getClickThroughUrl(), "_top");
                }

                 t.magnificPopup.close();


                /*t(".mfp-content").css("position", "absolute");

                t(".mfp-content").css("top", "0px");
                t(".mfp-content").css("left", "0px");

                t(".mfp-content").css("height", "100%");
                t(".mfp-content").css("width", "100%");

                t("#adContainer").css("width", "100%");
                t("#adContainer").css("height", "100%");  */


                break;

        }
    }, onAdError: function (e) {
        t.magnificPopup.close();
        try
        {
            n.destroy()
        } catch (r)
        {
            console.log(r)
        }
    }, onContentPauseRequested: function () {
        u.pause()
    }, onContentResumeRequested: function () {
        u.play()
    }}, {singleton: null, getInstance: function () {
        return f.singleton = f.singleton || new f, f.singleton
    }});
    return f
}), define("text!templates/advertisement/interstitial.html", [], function () {
    return'<div id="adHolder" class="mfp-hide">\n	<div id="interstitial" style="width:<%= width %>px; height:<%= height %>px;">\n		<iframe id="adContainer" src="http://ads.mocean.mobi/ad?site=<%= site %>&zone=<%= zone %>" width="100%" height="100%" scrolling="no" frameborder="0"></iframe>\n	</div>\n</div>\n\n<!-- http://games.bmmob.com/postproduction/test/eriks/games/ad-test/ -->\n<!-- http://ads.mocean.mobi/ad?site=<%= site %>&zone=<%= zone %> -->'
}), define("text!templates/advertisement/banner.html", [], function () {
    return'<div id="banner" style="width:<%= width %>px; height:<%= height %>px;">\n	<iframe id="adContainer" src="http://ads.mocean.mobi/ad?site=<%= site %>&zone=<%= zone %>" width="100%" height="100%" scrolling="no" frameborder="0"></iframe>\n</div>'
}), define("text!templates/advertisement/teaser.html", [], function () {
    return'<div id="teaser" style="width:<%= width %>px; height:<%= height %>px;">\n	<iframe id="adContainer" src="http://ads.mocean.mobi/ad?site=<%= site %>&zone=<%= zone %>" width="100%" height="100%" scrolling="no" frameborder="0"></iframe>\n</div>'
}), define("text!templates/advertisement/adsense.html", [], function () {
    return'<a id=\'advertisementLink\' class=\'interstitial-popup\' href=\'#adHolder\'>advertisement</a>\n<div id="adHolder" class="mfp-hide">\n	<div id="adsense">\n	  <div id="mainContainer">\n        <div id="content">\n        	<video id="contentElement"></video>\n        	<div id="adContainer"></div>\n          <div id="timerText" class="mfp-bottom-bar"></div>\n        </div>\n    </div>\n  </div>\n</div>'
}), define("text!templates/advertisement/portaladvertisement.html", [], function () {
    return'<iframe id="booster-advertisement-popup" name="booster-advertisement-popup" class="hide" src="'+location.href+'ad.html" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>'
}), define("views/advertisement", ["zepto", "underscore", "backbone", "models/ad.model", "models/adsense.model", "text!templates/advertisement/interstitial.html", "text!templates/advertisement/banner.html", "text!templates/advertisement/teaser.html", "text!templates/advertisement/adsense.html", "text!templates/advertisement/portaladvertisement.html", "utils/url"], function (e, t, n, r, i, s, o, u, a, f, l) {
    var c, h, p = new l, d = n.View.extend({type: "interstitial", size: "100x100", site: 0, zone: 0, interval: 6e4, channelID: 0, overlay: !0, initialize: function (e) {
        e == undefined && (e = {}), e.type != undefined && (this.type = e.type), e.size != undefined && (this.size = e.size), e.site != undefined && (this.site = e.site), e.zone != undefined && (this.zone = e.zone), e.interval != undefined && (this.interval = e.interval), e.channelID != undefined && (this.channelID = e.channelID), e.overlay != undefined && (this.overlay = Boolean(e.overlay));
        var t = this;
        pm.bind("iframeClose", function (e) {
            t._close()
        })
    }, getAdSize: function (e) {
        var t = e.split("x");
        c = t[0], h = t[1]
    }, appendAdvertisement: function () {
        if (p.getURLParameter("bm.source") != "null" && p.getURLParameter("bm.gameid") != "null" )e("iframe#booster-advertisement-popup").removeClass("hide");
        else
        {
            var t = this;
            e(".interstitial-popup").magnificPopup({type: "inline", mainClass: "mfp-fade", closeBtnInside: !1, closeOnBgClick: !1, removalDelay: 160, preloader: !1, verticalFit: !1, fixedContentPos: !1, showCloseBtn: !1, callbacks: {afterClose: function () {
                e("#adHolder").remove(), e("#advertisementLink").remove()
            }, open: function () {
                e("#adContainer").css("width", "305px"), e("#adContainer").css("height", "250px");
                var n = i.getInstance();
                n.createAdDisplayContainer(t.channelID)
            }}}), e("#advertisementLink").click()
        }
    }, _close: function () {
        e("iframe#booster-advertisement-popup").remove()
    }, render: function (n, r, i, o, u) {
        var l, c = p.addHTTP(p.getURLParameter("bm.source")), h = p.getURLParameter("bm.gameid"), d = t.template(s, {width: r, height: i, site: o, zone: u});
        p.getURLParameter("bm.source") != "null" && p.getURLParameter("bm.gameid") != "null" ? l = t.template(f, {source: c, bmGameId: h, bmChannelId: this.channelID}) : l = t.template(a, {width: r, height: i});
        switch (n)
        {
            case"interstitial":
                e("body").append(d);
                break;
            case"banner":
                e("body").append(bannerTemplate);
                break;
            case"teaser":
                e("body").append(teaserTemplate);
                break;
            case"adsense":
                e("body").append(l);
                break;
            default:
                console.log("Didn't match any type")
        }
    }, showAdvertising: function () {
        //this.appendAdvertisement();
        window.open(location.href+'ad.html', "_top");
        //return;
        var e = r.getInstance();
        e.showAdvertising(this.interval) && (this.getAdSize(this.size), this.render(this.type, c, h, this.site, this.zone), this.appendAdvertisement())
    }});
    return d
}), define("models/moregames.model", ["backbone", "utils/url"], function (e, t) {
    var n = e.Model.extend({initialize: function () {
    }, redirect: function () {
        var e = new t, n = e.getURLParameter("bm.source");
        n === "null" ? (n = "www.gamesplaza.com", window.top.location = e.addHTTP(n)) : window.top.location = e.addHTTP(n)
    }});
    return n
}), require.config({paths: {zepto: "../lib/zepto", underscore: "../lib/underscore", backbone: "../lib/backbone", postmessage: "../lib/postmessage", magnificpopup: "../lib/magnificpopup", templates: "../templates"}, shim: {magnificpopup: ["zepto"]}}), require(["zepto", "booster", "models/analytics", "views/booster.tab", "views/highscore.frame", "magnificpopup", "views/advertisement", "models/moregames.model"], function (e, t, n, r, i, s, o, u) {
    e(function (e) {
        window.Booster = window.Booster || {}, window.Booster.Init = t, window.Booster.Community = r, window.Booster.Score = i, window.Booster.Analytics = n, window.Booster.Moregames = u;
        try
        {
            var s = document.createElement("script");
            s.type = "text/javascript", s.onload = function () {
                window.Booster.Ad = o, window.Booster.ready.call()
            }, s.src = "https://s0.2mdn.net/instream/html5/ima3.js", e("head").append(s)
        } catch (a)
        {
            console.log(a)
        }
    })
}), define("all", function () {
});