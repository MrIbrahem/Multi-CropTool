! function(t, e) {
    "object" == typeof exports ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.Spinner = e()
}(this, function() {
    "use strict";
    var F, r = ["webkit", "Moz", "ms", "O"],
        m = {};

    function g(t, e) {
        var i, n = document.createElement(t || "div");
        for (i in e) n[i] = e[i];
        return n
    }

    function v(t) {
        for (var e = 1, i = arguments.length; e < i; e++) t.appendChild(arguments[e]);
        return t
    }
    var t, y = (t = g("style", {
        type: "text/css"
    }), v(document.getElementsByTagName("head")[0], t), t.sheet || t.styleSheet);

    function n(t, e) {
        var i, n, a = t.style;
        for (e = e.charAt(0).toUpperCase() + e.slice(1), n = 0; n < r.length; n++)
            if (void 0 !== a[i = r[n] + e]) return i;
        if (void 0 !== a[e]) return e
    }

    function b(t, e) {
        for (var i in e) t.style[n(t, i) || i] = e[i];
        return t
    }

    function e(t) {
        for (var e = 1; e < arguments.length; e++) {
            var i = arguments[e];
            for (var n in i) void 0 === t[n] && (t[n] = i[n])
        }
        return t
    }

    function w(t, e) {
        return "string" == typeof t ? t : t[e % t.length]
    }
    var i = {
        lines: 12,
        length: 7,
        width: 5,
        radius: 10,
        rotate: 0,
        corners: 1,
        color: "#000",
        direction: 1,
        speed: 1,
        trail: 100,
        opacity: .25,
        fps: 20,
        zIndex: 2e9,
        className: "spinner",
        top: "50%",
        left: "50%",
        position: "absolute"
    };

    function a(t) {
        this.opts = e(t || {}, a.defaults, i)
    }
    a.defaults = {}, e(a.prototype, {
        spin: function(t) {
            this.stop();
            var i = this,
                n = i.opts,
                a = i.el = b(g(0, {
                    className: n.className
                }), {
                    position: n.position,
                    width: 0,
                    zIndex: n.zIndex
                });
            if (n.radius, n.length, n.width, b(a, {
                    left: n.left,
                    top: n.top
                }), t && t.insertBefore(a, t.firstChild || null), a.setAttribute("role", "progressbar"), i.lines(a, i.opts), !F) {
                var r, o = 0,
                    s = (n.lines - 1) * (1 - n.direction) / 2,
                    d = n.fps,
                    u = d / n.speed,
                    l = (1 - n.opacity) / (u * n.trail / 100),
                    c = u / n.lines;
                ! function t() {
                    o++;
                    for (var e = 0; e < n.lines; e++) r = Math.max(1 - (o + (n.lines - e) * c) % u * l, n.opacity), i.opacity(a, e * n.direction + s, r, n);
                    i.timeout = i.el && setTimeout(t, ~~(1e3 / d))
                }()
            }
            return i
        },
        stop: function() {
            var t = this.el;
            return t && (clearTimeout(this.timeout), t.parentNode && t.parentNode.removeChild(t), this.el = void 0), this
        },
        lines: function(t, i) {
            var e, n, a, r, o, s, d, u, l, c, f = 0,
                p = (i.lines - 1) * (1 - i.direction) / 2;

            function h(t, e) {
                return b(g(), {
                    position: "absolute",
                    width: i.length + i.width + "px",
                    height: i.width + "px",
                    background: t,
                    boxShadow: e,
                    transformOrigin: "left",
                    transform: "rotate(" + ~~(360 / i.lines * f + i.rotate) + "deg) translate(" + i.radius + "px,0)",
                    borderRadius: (i.corners * i.width >> 1) + "px"
                })
            }
            for (; f < i.lines; f++) e = b(g(), {
                position: "absolute",
                top: 1 + ~(i.width / 2) + "px",
                transform: i.hwaccel ? "translate3d(0,0,0)" : "",
                opacity: i.opacity,
                animation: F && (n = i.opacity, s = ["opacity", a = i.trail, ~~(100 * n), r = p + f * i.direction, o = i.lines].join("-"), d = .01 + r / o * 100, u = Math.max(1 - (1 - n) / a * (100 - d), n), c = (l = F.substring(0, F.indexOf("Animation")).toLowerCase()) && "-" + l + "-" || "", m[s] || (y.insertRule("@" + c + "keyframes " + s + "{0%{opacity:" + u + "}" + d + "%{opacity:" + n + "}" + (.01 + d) + "%{opacity:1}" + (d + a) % 100 + "%{opacity:" + n + "}100%{opacity:" + u + "}}", y.cssRules.length), m[s] = 1), s + " " + 1 / i.speed + "s linear infinite")
            }), i.shadow && v(e, b(h("#000", "0 0 4px #000"), {
                top: "2px"
            })), v(t, v(e, h(w(i.color, f), "0 0 1px rgba(0,0,0,.1)")));
            return t
        },
        opacity: function(t, e, i) {
            e < t.childNodes.length && (t.childNodes[e].style.opacity = i)
        }
    });
    var o = b(g("group"), {
        behavior: "url(#default#VML)"
    });
    return !n(o, "transform") && o.adj ? (y.addRule(".spin-vml", "behavior:url(#default#VML)"), a.prototype.lines = function(t, n) {
        var a = n.length + n.width,
            e = 2 * a;

        function r() {
            return b(u("group", {
                coordsize: e + " " + e,
                coordorigin: -a + " " + -a
            }), {
                width: e,
                height: e
            })
        }
        var i, o = 2 * -(n.width + n.length) + "px",
            s = b(r(), {
                position: "absolute",
                top: o,
                left: o
            });

        function d(t, e, i) {
            v(s, v(b(r(), {
                rotation: 360 / n.lines * t + "deg",
                left: ~~e
            }), v(b(u("roundrect", {
                arcsize: n.corners
            }), {
                width: a,
                height: n.width,
                left: n.radius,
                top: -n.width >> 1,
                filter: i
            }), u("fill", {
                color: w(n.color, t),
                opacity: n.opacity
            }), u("stroke", {
                opacity: 0
            }))))
        }
        if (n.shadow)
            for (i = 1; i <= n.lines; i++) d(i, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
        for (i = 1; i <= n.lines; i++) d(i);
        return v(t, s)
    }, a.prototype.opacity = function(t, e, i, n) {
        var a = t.firstChild;
        n = n.shadow && n.lines || 0, a && e + n < a.childNodes.length && (a = (a = (a = a.childNodes[e + n]) && a.firstChild) && a.firstChild) && (a.opacity = i)
    }) : F = n(o, "animation"), a;

    function u(t, e) {
        return g("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', e)
    }
}),
function(t, e) {
    "use strict";
    "object" == typeof exports ? module.exports = e(require("spin.js")) : "function" == typeof define && define.amd ? define(["spin"], e) : t.Ladda = e(t.Spinner)
}(this, function(u) {
    "use strict";
    var l = [];

    function t(i) {
        if (void 0 !== i) {
            if (/ladda-button/i.test(i.className) || (i.className += " ladda-button"), i.hasAttribute("data-style") || i.setAttribute("data-style", "expand-right"), !i.querySelector(".ladda-label")) {
                var t = document.createElement("span");
                t.className = "ladda-label", e = i, n = t, (a = document.createRange()).selectNodeContents(e), a.surroundContents(n), e.appendChild(n)
            }
            var e, n, a, r, o, s = i.querySelector(".ladda-spinner");
            s || ((s = document.createElement("span")).className = "ladda-spinner"), i.appendChild(s);
            var d = {
                start: function() {
                    return r = r || function(t) {
                        var e, i, n = t.offsetHeight;
                        0 === n && (n = parseFloat(window.getComputedStyle(t).height)), 32 < n && (n *= .8), t.hasAttribute("data-spinner-size") && (n = parseInt(t.getAttribute("data-spinner-size"), 10)), t.hasAttribute("data-spinner-color") && (e = t.getAttribute("data-spinner-color")), t.hasAttribute("data-spinner-lines") && (i = parseInt(t.getAttribute("data-spinner-lines"), 10));
                        var a = .2 * n;
                        return new u({
                            color: e || "#fff",
                            lines: i || 12,
                            radius: a,
                            length: .6 * a,
                            width: a < 7 ? 2 : 3,
                            zIndex: "auto",
                            top: "auto",
                            left: "auto",
                            className: ""
                        })
                    }(i), i.disabled = !0, i.setAttribute("data-loading", ""), clearTimeout(o), r.spin(s), this.setProgress(0), this
                },
                startAfter: function(t) {
                    return clearTimeout(o), o = setTimeout(function() {
                        d.start()
                    }, t), this
                },
                stop: function() {
                    return d.isLoading() && (i.disabled = !1, i.removeAttribute("data-loading")), clearTimeout(o), r && (o = setTimeout(function() {
                        r.stop()
                    }, 1e3)), this
                },
                toggle: function() {
                    return this.isLoading() ? this.stop() : this.start()
                },
                setProgress: function(t) {
                    t = Math.max(Math.min(t, 1), 0);
                    var e = i.querySelector(".ladda-progress");
                    0 === t && e && e.parentNode ? e.parentNode.removeChild(e) : (e || ((e = document.createElement("div")).className = "ladda-progress", i.appendChild(e)), e.style.width = (t || 0) * i.offsetWidth + "px")
                },
                enable: function() {
                    return this.stop()
                },
                disable: function() {
                    return this.stop(), i.disabled = !0, this
                },
                isLoading: function() {
                    return i.hasAttribute("data-loading")
                },
                remove: function() {
                    clearTimeout(o), i.disabled = !1, i.removeAttribute("data-loading"), r && (r.stop(), r = null), l.splice(l.indexOf(d), 1)
                }
            };
            return l.push(d), d
        }
        console.warn("Ladda button target must be defined.")
    }

    function a(d, u) {
        if ("function" == typeof d.addEventListener) {
            var l = t(d),
                c = -1;
            d.addEventListener("click", function() {
                var n, a, t = !0,
                    e = function(t) {
                        for (; t.parentNode && "FORM" !== t.tagName;) t = t.parentNode;
                        return "FORM" === t.tagName ? t : void 0
                    }(d);
                if (void 0 !== e && !e.hasAttribute("novalidate"))
                    if ("function" == typeof e.checkValidity) t = e.checkValidity();
                    else
                        for (var i = (n = e, a = [], ["input", "textarea", "select"].forEach(function(t) {
                                for (var e = n.getElementsByTagName(t), i = 0; i < e.length; i++) e[i].hasAttribute("required") && a.push(e[i])
                            }), a), r = 0; r < i.length; r++) {
                            var o = i[r],
                                s = o.getAttribute("type");
                            if ("" === o.value.replace(/^\s+|\s+$/g, "") && (t = !1), "checkbox" !== s && "radio" !== s || o.checked || (t = !1), "email" === s && (t = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i.test(o.value)), "url" === s && (t = /^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(o.value)), !t) break
                        }
                t && (l.startAfter(1), "number" == typeof u.timeout && (clearTimeout(c), c = setTimeout(l.stop, u.timeout)), "function" == typeof u.callback && u.callback.apply(null, [l]))
            }, !1)
        }
    }
    return {
        bind: function(t, e) {
            var i;
            if ("string" == typeof t) i = document.querySelectorAll(t);
            else {
                if ("object" != typeof t) throw new Error("target must be string or object");
                i = [t]
            }
            e = e || {};
            for (var n = 0; n < i.length; n++) a(i[n], e)
        },
        create: t,
        stopAll: function() {
            for (var t = 0, e = l.length; t < e; t++) l[t].stop()
        }
    }
}),
function(t, e) {
    "use strict";
    if ("function" == typeof define && define.amd) define(["angular", "ladda"], e);
    else {
        if ("undefined" == typeof module || "object" != typeof module.exports) return e(t.angular, t.Ladda);
        module.exports = e(window.angular || require("angular"), require("ladda"))
    }
}(this, function(o, s) {
    "use strict";
    var t = "angular-ladda";
    return o.module(t, []).provider("ladda", function() {
        var e = {
            style: "zoom-in"
        };
        return {
            setOption: function(t) {
                o.extend(e, t)
            },
            $get: function() {
                return e
            }
        }
    }).directive("ladda", ["ladda", "$timeout", function(r, t) {
        return {
            restrict: "A",
            priority: -1,
            link: function(i, n, a) {
                t(function() {
                    if (n.addClass("ladda-button"), o.isUndefined(n.attr("data-style")) && n.attr("data-style", r.style || "zoom-in"), o.isUndefined(n.attr("data-spinner-size")) && r.spinnerSize && n.attr("data-spinner-size", r.spinnerSize), o.isUndefined(n.attr("data-spinner-color")) && r.spinnerColor && n.attr("data-spinner-color", r.spinnerColor), !n[0].querySelector(".ladda-label")) {
                        var t = document.createElement("span");
                        t.className = "ladda-label", o.element(t).append(n.contents()), n.append(t)
                    }
                    var e = s.create(n[0]);
                    i.$watch(a.ladda, function(t) {
                        return t || o.isNumber(t) ? (e.isLoading() || e.start(), void(o.isNumber(t) && e.setProgress(t))) : (e.stop(), void(a.ngDisabled && n.attr("disabled", i.$eval(a.ngDisabled))))
                    }), i.$on("$destroy", function() {
                        e && e.remove()
                    })
                })
            }
        }
    }]), t
});