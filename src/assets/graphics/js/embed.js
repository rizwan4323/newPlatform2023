var unlayer = function(e) {
    var t = {};
    function n(s) {
        if (t[s])
            return t[s].exports;
        var a = t[s] = {
            i: s,
            l: !1,
            exports: {}
        };
        return e[s].call(a.exports, a, a.exports, n),
        a.l = !0,
        a.exports
    }
    return n.m = e,
    n.c = t,
    n.d = function(e, t, s) {
        n.o(e, t) || Object.defineProperty(e, t, {
            configurable: !1,
            enumerable: !0,
            get: s
        })
    }
    ,
    n.r = function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return n.d(t, "a", t),
        t
    }
    ,
    n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    n.p = "/",
    n(n.s = 1143)
}({
    1143: function(e, t, n) {
        e.exports = n(1144)
    },
    1144: function(e, t, n) {
        "use strict";
        n.r(t),
        n.d(t, "init", function() {
            return o
        }),
        n.d(t, "registerCallback", function() {
            return r
        }),
        n.d(t, "unregisterCallback", function() {
            return i
        }),
        n.d(t, "addEventListener", function() {
            return c
        }),
        n.d(t, "removeEventListener", function() {
            return u
        }),
        n.d(t, "setDesignMode", function() {
            return l
        }),
        n.d(t, "setDisplayMode", function() {
            return d
        }),
        n.d(t, "loadProject", function() {
            return f
        }),
        n.d(t, "loadUser", function() {
            return p
        }),
        n.d(t, "loadTemplate", function() {
            return g
        }),
        n.d(t, "setMergeTags", function() {
            return h
        }),
        n.d(t, "setLocale", function() {
            return m
        }),
        n.d(t, "setTranslations", function() {
            return M
        }),
        n.d(t, "loadBlank", function() {
            return y
        }),
        n.d(t, "loadDesign", function() {
            return b
        }),
        n.d(t, "saveDesign", function() {
            return v
        }),
        n.d(t, "exportHtml", function() {
            return k
        }),
        n.d(t, "exportLiveHtml", function() {
            return w
        }),
        n.d(t, "setAppearance", function() {
            return T
        });
        var s, a = n(1145), o = function(e) {
            var t;
            if (e.id ? t = document.getElementById(e.id) : e.className && (t = document.getElementsByClassName(e.className)[0]),
            !t)
                throw new Error("id or className must be provided.");
            var n = e.insecure ? window.location.origin : window.location.origin
              , o = "".concat(n, "/editor");
            (s = new a.default(o)).appendTo(t);
            var r = {};
            e.designMode && (r.designMode = e.designMode),
            e.displayMode && (r.displayMode = e.displayMode),
            e.projectId && (r.projectId = e.projectId),
            e.user && (r.user = e.user),
            e.templateId && (r.templateId = e.templateId),
            e.loadTimeout && (r.loadTimeout = e.loadTimeout),
            e.options && (r.options = e.options),
            e.tools && (r.tools = e.tools),
            e.excludeTools && (r.excludeTools = e.excludeTools),
            e.blocks && (r.blocks = e.blocks),
            e.editor && (r.editor = e.editor),
            e.fonts && (r.fonts = e.fonts),
            e.mergeTags && (r.mergeTags = e.mergeTags),
            e.designTags && (r.designTags = e.designTags),
            e.customCSS && (r.customCSS = e.customCSS),
            e.customJS && (r.customJS = e.customJS),
            e.locale && (r.locale = e.locale),
            e.translations && (r.translations = e.translations),
            e.appearance && (r.appearance = e.appearance),
            s.postMessage("config", r)
        }, r = function(e, t) {
            s.withMessage("registerCallback", {
                type: e
            }, t)
        }, i = function(e) {
            s.withMessage("unregisterCallback", {
                type: e
            })
        }, c = function(e, t) {
            s.withMessage("registerCallback", {
                type: e
            }, t)
        }, u = function(e) {
            s.withMessage("unregisterCallback", {
                type: e
            })
        }, l = function(e) {
            s.withMessage("setDesignMode", {
                designMode: e
            })
        }, d = function(e) {
            s.withMessage("setDisplayMode", {
                displayMode: e
            })
        }, f = function(e) {
            s.postMessage("loadProject", {
                projectId: e
            })
        }, p = function(e) {
            s.postMessage("loadUser", {
                user: e
            })
        }, g = function(e) {
            s.postMessage("loadTemplate", {
                templateId: e
            })
        }, h = function(e) {
            s.postMessage("setMergeTags", {
                mergeTags: e
            })
        }, m = function(e) {
            s.postMessage("setLocale", {
                locale: e
            })
        }, M = function(e) {
            s.postMessage("setTranslations", {
                translations: e
            })
        }, y = function() {
            s.postMessage("loadBlank", {})
        }, b = function(e) {
            s.postMessage("loadDesign", {
                design: e
            })
        }, v = function(e) {
            s.withMessage("saveDesign", {}, e)
        }, k = function(e) {
            s.withMessage("exportHtml", {}, e)
        }, w = function(e) {
            s.withMessage("exportLiveHtml", {}, e)
        }, T = function(e) {
            s.postMessage("setAppearance", {
                appearance: e
            })
        };
        window.addEventListener("message", function(e) {
            s && s.receiveMessage(e)
        }, !1)
    },
    1145: function(e, t, n) {
        "use strict";
        function s(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = null != arguments[t] ? arguments[t] : {}
                  , s = Object.keys(n);
                "function" == typeof Object.getOwnPropertySymbols && (s = s.concat(Object.getOwnPropertySymbols(n).filter(function(e) {
                    return Object.getOwnPropertyDescriptor(n, e).enumerable
                }))),
                s.forEach(function(t) {
                    a(e, t, n[t])
                })
            }
            return e
        }
        function a(e, t, n) {
            return t in e ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = n,
            e
        }
        function o(e, t) {
            for (var n = 0; n < t.length; n++) {
                var s = t[n];
                s.enumerable = s.enumerable || !1,
                s.configurable = !0,
                "value"in s && (s.writable = !0),
                Object.defineProperty(e, s.key, s)
            }
        }
        n.r(t),
        n.d(t, "default", function() {
            return i
        });
        var r = function(e) {
            var t = document.createElement("iframe");
            return t.src = e,
            t.frameBorder = 0,
            t.width = "100%",
            t.height = "100%",
            t.style.minWidth = "1024px",
            t.style.minHeight = "100%",
            t.style.height = "100%",
            t.style.width = "100%",
            t.style.border = "0px",
            t
        }
          , i = function() {
            function e(t) {
                var n = this;
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.ready = !1,
                this.iframe = r(t),
                this.messages = [],
                this.iframe.onload = function() {
                    n.ready = !0,
                    n.flushMessages()
                }
                ,
                this.callbackId = 0,
                this.callbacks = {}
            }
            var t, n, a;
            return t = e,
            (n = [{
                key: "appendTo",
                value: function(e) {
                    e.appendChild(this.iframe)
                }
            }, {
                key: "postMessage",
                value: function(e, t) {
                    this.scheduleMessage(s({
                        action: e
                    }, t)),
                    this.flushMessages()
                }
            }, {
                key: "withMessage",
                value: function(e, t, n) {
                    var a = this.callbackId++;
                    this.callbacks[a] = n,
                    this.postMessage(e, s({
                        callbackId: a
                    }, t))
                }
            }, {
                key: "scheduleMessage",
                value: function(e) {
                    this.messages.push(e)
                }
            }, {
                key: "flushMessages",
                value: function() {
                    var e = this;
                    this.ready && (this.messages.forEach(function(t) {
                        e.iframe.contentWindow.postMessage(t, "*")
                    }),
                    this.messages = [])
                }
            }, {
                key: "handleMessage",
                value: function(e) {
                    var t = this
                      , n = e.action
                      , s = e.callbackId
                      , a = e.doneId
                      , o = e.result;
                    switch (n) {
                    case "response":
                        this.callbacks[s](o),
                        delete this.callbacks[s];
                        break;
                    case "callback":
                        o.attachments && (o.attachments = o.attachments.map(function(e) {
                            return new File([e.content],e.name,{
                                type: e.type
                            })
                        })),
                        this.callbacks[s](o, function(e) {
                            t.postMessage("done", {
                                doneId: a,
                                result: e
                            })
                        })
                    }
                }
            }, {
                key: "receiveMessage",
                value: function(e) {
                    e.data && this.handleMessage(e.data)
                }
            }]) && o(t.prototype, n),
            a && o(t, a),
            e
        }()
    }
});
