"use strict";
function _typeof(e) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(e) {
      return typeof e;
    };
  } else {
    _typeof = function _typeof(e) {
      return e &&
        typeof Symbol === "function" &&
        e.constructor === Symbol &&
        e !== Symbol.prototype
        ? "symbol"
        : typeof e;
    };
  }
  return _typeof(e);
}
function ownKeys(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    n.push.apply(n, Object.getOwnPropertySymbols(t));
  }
  if (e)
    n = n.filter(function(e) {
      return Object.getOwnPropertyDescriptor(t, e).enumerable;
    });
  return n;
}
function _objectSpread(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    if (e % 2) {
      ownKeys(n, true).forEach(function(e) {
        _defineProperty(t, e, n[e]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(t, Object.getOwnPropertyDescriptors(n));
    } else {
      ownKeys(n).forEach(function(e) {
        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e));
      });
    }
  }
  return t;
}
function _defineProperty(e, t, n) {
  if (t in e) {
    Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    e[t] = n;
  }
  return e;
}
function _classCallCheck(e, t) {
  if (!(e instanceof t)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(e, t) {
  for (var n = 0; n < t.length; n++) {
    var i = t[n];
    i.enumerable = i.enumerable || false;
    i.configurable = true;
    if ("value" in i) i.writable = true;
    Object.defineProperty(e, i.key, i);
  }
}
function _createClass(e, t, n) {
  if (t) _defineProperties(e.prototype, t);
  if (n) _defineProperties(e, n);
  return e;
}
if (typeof Object.assign != "function") {
  Object.defineProperty(Object, "assign", {
    value: function assign(e, t) {
      if (e == null) {
        throw new TypeError("Cannot convert undefined or null to object");
      }
      var n = Object(e);
      for (var i = 1; i < arguments.length; i++) {
        var r = arguments[i];
        if (r != null) {
          for (var a in r) {
            if (Object.prototype.hasOwnProperty.call(r, a)) {
              n[a] = r[a];
            }
          }
        }
      }
      return n;
    },
    writable: true,
    configurable: true
  });
}
var Itemize = (function() {
  function Itemize(e) {
    _classCallCheck(this, Itemize);
    this.containers = [];
    this.items = [];
    this.globalOptions = this.mergeOptions(e);
    this.notificationNbs = {};
    this.modalDisappearTimeout = null;
    this.elPos = {};
    this.flipPlayId = "";
    this.elemToRemove = [];
    this.lastTargetedContainers = null;
    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
  }
  _createClass(Itemize, [
    {
      key: "apply",
      value: function apply(e, t) {
        var a = this;
        var o = _objectSpread({}, this.globalOptions);
        if (_typeof(e) === "object") {
          o = this.mergeOptions(e);
          e = [null];
        } else {
          e = [e];
        }
        if (t) {
          o = this.mergeOptions(t);
        }
        var s = 0;
        for (var n = 0; n < e.length; n++) {
          this.lastTargetedContainers = this.getTargetElements(e[n]);
          if (
            this.lastTargetedContainers &&
            this.lastTargetedContainers.length > 0
          ) {
            (function() {
              s += a.applyItemize(a.lastTargetedContainers, o);
              var r = function r(e, t) {
                var n = 1;
                if (e.length > 0 && n < t) {
                  for (var i = 0; i < e.length; i++) {
                    s += a.applyItemize(e[i].children, o);
                    n++;
                    if (e.length > 0 && n < t) {
                      r(e[i].children, t);
                    }
                  }
                }
              };
              r(a.lastTargetedContainers, o.nestingLevel);
            })();
          } else {
            console.error(" - Itemize error - \n no valid target found.\n");
          }
        }
        console.log(
          "%c" + s + " element(s) itemized",
          "background: #060606; color:#1FEA00;padding:10px"
        );
        return s + " element(s) itemized";
      }
    },
    {
      key: "cancel",
      value: function cancel(e) {
        var t = 0;
        if (e) {
          if (!Array.isArray(e)) {
            e = [e];
          }
          for (var n = 0; n < e.length; n++) {
            this.lastTargetedContainers = this.getTargetElements(e[n]);
            if (
              this.lastTargetedContainers &&
              this.lastTargetedContainers.length > 0
            ) {
              t += this.cancelItemize(this.lastTargetedContainers);
            } else {
              console.error(" - Itemize error - \n " + e[n] + " not found.\n");
            }
          }
        } else {
          this.clearObservers();
          t = this.cancelItemize("all");
        }
        return t + " element(s) unitemized";
      }
    },
    {
      key: "getTargetElements",
      value: function getTargetElements(e) {
        try {
          if (!e) {
            return document.querySelectorAll("[itemize]");
          } else {
            return document.querySelectorAll(e);
          }
        } catch (t) {
          console.error(t);
          return null;
        }
      }
    },
    {
      key: "clearObservers",
      value: function clearObservers(e) {
        if (window.itemizeObservers) {
          for (var t = window.itemizeObservers.length - 1; t >= 0; t--) {
            var n = false;
            if (e) {
              if (window.itemizeObservers[t].itemizeContainerId === e) {
                n = true;
              }
            } else {
              n = true;
            }
            if (n) {
              window.itemizeObservers[t].disconnect();
              window.itemizeObservers.splice(t, 1);
            }
          }
        }
      }
    },
    {
      key: "applyItemize",
      value: function applyItemize(d, f) {
        var p = this;
        var v = 0;
        var e = "";
        try {
          var t = function t(e) {
            var l = d[e];
            if (
              !l.classList.contains("itemize_remove_btn") &&
              l.type !== "text/css" &&
              l.tagName !== "BR" &&
              l.tagName !== "SCRIPT" &&
              l.tagName !== "STYLE"
            ) {
              var t = false;
              for (var n = 0; n < p.containers.length; n++) {
                if (
                  l.itemizeContainerId &&
                  l.itemizeContainerId === p.containers[n].itemizeContainerId
                ) {
                  t = true;
                  break;
                }
              }
              if (!t) {
                p.containers.push(l);
              }
              if (l.itemizeContainerId) {
                p.clearObservers(l.itemizeContainerId);
              }
              var i = p.makeId(8);
              l.itemizeContainerId = i;
              for (var r = l.classList.length - 1; r >= 0; r--) {
                if (l.classList[r].indexOf("itemize_parent") !== -1) {
                  l.classList.remove(l.classList[r]);
                  break;
                }
              }
              l.classList.add("itmz_parent");
              l.classList.add("itemize_parent_".concat(i));
              var a = _objectSpread({}, p.globalOptions);
              if (f) {
                a = p.mergeOptions(f);
              }
              a = p.getOptionsFromAttributes(l, a);
              l.itemizeOptions = a;
              if (l.itemizeOptions.itemizeAddedElement) {
                var o = { childList: true };
                var c = p;
                var s = function s(e, t) {
                  for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    if (i.type === "childList" && i.addedNodes.length > 0) {
                      for (var r = 0; r < i.addedNodes.length; r++) {
                        var a = i.addedNodes[r];
                        var o = true;
                        if (a.classList) {
                          for (var s = 0; s < a.classList.length; s++) {
                            if (a.classList[s].indexOf("itemize_") !== -1) {
                              o = false;
                            }
                          }
                          if (o) {
                            if (
                              !a.getAttribute("notitemize") &&
                              a.parentElement &&
                              a.type !== "text/css" &&
                              a.tagName !== "BR" &&
                              a.tagName !== "SCRIPT" &&
                              a.parentElement.itemizeContainerId &&
                              a.tagName !== "STYLE"
                            ) {
                              if (
                                a.parentElement.itemizeOptions &&
                                a.parentElement.itemizeOptions.anim
                              ) {
                                a.classList.add("itemize_hide");
                                c.itemizeChild(a, a.parentElement, true);
                                c.flipRead(c.items);
                                c.flipAdd(a);
                                c.flipPlay(
                                  c.items,
                                  a.parentElement.itemizeOptions.animDuration
                                );
                              } else {
                                c.itemizeChild(a, a.parentElement, true);
                              }
                            }
                            if (l.itemizeOptions.onAddItem) {
                              l.itemizeOptions.onAddItem(a);
                            }
                          }
                        }
                      }
                    }
                  }
                };
                if (window.itemizeObservers) {
                  window.itemizeObservers.push(new MutationObserver(s));
                } else {
                  window.itemizeObservers = [new MutationObserver(s)];
                }
                window.itemizeObservers[
                  window.itemizeObservers.length - 1
                ].observe(l, o);
                window.itemizeObservers[
                  window.itemizeObservers.length - 1
                ].itemizeContainerId = l.itemizeContainerId;
              }
              p.applyCss(l);
              for (var u = 0; u < l.children.length; u++) {
                var m = l.children[u];
                if (p.itemizeChild(m, l)) {
                  v++;
                }
              }
            }
          };
          for (var n = 0; n < d.length; n++) {
            t(n);
          }
          return v;
        } catch (i) {
          console.error(" - Itemize error - \n" + e);
          console.error(i);
        }
      }
    },
    {
      key: "childIsItemizable",
      value: function childIsItemizable(e, t) {
        return (
          e.type !== "text/css" &&
          typeof e.getAttribute("notitemize") !== "string" &&
          e.tagName !== "BR" &&
          e.tagName !== "SCRIPT" &&
          !e.itemizeItemId &&
          !e.itemizeBtn &&
          !e.classList.contains("itemize_remove_btn") &&
          !(
            t.parentNode.itemizeOptions &&
            e.classList.contains(t.parentNode.itemizeOptions.removeBtnClass)
          )
        );
      }
    },
    {
      key: "itemizeChild",
      value: function itemizeChild(t, n, e) {
        var i = this;
        if (this.childIsItemizable(t, n)) {
          t.itemizeItemId = this.makeId(8);
          this.items.push(t);
          if (n.itemizeItems) {
            n.itemizeItems.push(t);
          } else {
            n.itemizeItems = [t];
          }
          t.classList.add("itemize_item_" + t.itemizeItemId);
          t.classList.add("itmz_item");
          if (!n.itemizeOptions.removeBtn) {
            t.onclick = function(e) {
              e.stopPropagation();
              if (n.itemizeOptions.modalConfirm) {
                i.modalConfirm(t);
              } else {
                i.remove(t.itemizeItemId);
              }
            };
            if (n.itemizeOptions.outlineItemOnHover) {
              this.shadowOnHover(t, false);
            }
          } else {
            if (!n.itemizeOptions.removeBtnClass) {
              var r = getComputedStyle(t);
              if (
                t.style.position !== "absolute" &&
                t.style.position !== "fixed" &&
                r.position !== "absolute" &&
                r.position !== "fixed"
              ) {
                t.style.position = "relative";
              }
              var a = document.createElement("div");
              a.classList.add("itemize_btn_" + t.itemizeItemId);
              a.classList.add("itemize_remove_btn");
              a.itemizeBtn = true;
              a.onclick = function(e) {
                e.stopPropagation();
                if (n.itemizeOptions.modalConfirm) {
                  i.modalConfirm(t);
                } else {
                  i.remove(t.itemizeItemId);
                }
              };
              t.appendChild(a);
              if (n.itemizeOptions.outlineItemOnHover) {
                this.shadowOnHover(a, true);
              }
            } else {
              var o = document.querySelector(
                ".itemize_item_" +
                  t.itemizeItemId +
                  " ." +
                  n.itemizeOptions.removeBtnClass
              );
              if (!o) {
                console.error(
                  " - Itemize error - \n Cannot find specified button's class: " +
                    n.itemizeOptions.removeBtnClass +
                    "\n"
                );
              } else {
                o.onclick = function(e) {
                  e.stopPropagation();
                  if (n.itemizeOptions.modalConfirm) {
                    i.modalConfirm(t);
                  } else {
                    i.remove(t.itemizeItemId);
                  }
                };
                if (n.itemizeOptions.outlineItemOnHover) {
                  this.shadowOnHover(o, true);
                }
              }
            }
          }
          if (e) {
            this.showNotification("added", t);
          }
          return true;
        } else {
          return false;
        }
      }
    },
    {
      key: "shadowOnHover",
      value: function shadowOnHover(t, e) {
        var n = null;
        if (e) {
          n = t.parentElement;
        } else {
          n = t;
        }
        if (n) {
          t.parentShadowStyle = n.style.boxShadow;
        }
        t.onmouseenter = function(e) {
          if (n) {
            n.style.boxShadow = "inset 0px 0px 0px 3px rgba(15,179,0,1)";
          }
        };
        t.onmouseleave = function(e) {
          if (n) {
            n.style.boxShadow = t.parentShadowStyle;
          }
        };
      }
    },
    {
      key: "applyCss",
      value: function applyCss(e) {
        var t = e.itemizeOptions;
        var n = e.querySelector(".itemize_style");
        if (n) {
          n.parentNode.removeChild(n);
        }
        var i = document.createElement("style");
        i.classList.add("itemize_style");
        i.type = "text/css";
        var r = "";
        r += ".itemize_parent_".concat(
          e.itemizeContainerId,
          " .itemize_hide{display:none}"
        );
        if (t.removeBtn && !t.removeBtnClass) {
          var a = t.removeBtnMargin + "px";
          var o = {
            top: 0,
            right: 0,
            bottom: "auto",
            left: "auto",
            marginTop: a,
            marginRight: a,
            marginBottom: "0px",
            marginLeft: "0px",
            transform: "none"
          };
          switch (t.removeBtnPosition) {
            case "center-right":
              o.top = "50%";
              o.marginTop = "0px";
              o.transform = "translateY(-50%)";
              break;
            case "bottom-right":
              o.top = "auto";
              o.bottom = 0;
              o.marginTop = "0px";
              o.marginBottom = a;
              break;
            case "bottom-center":
              o.top = "auto";
              o.right = "auto";
              o.bottom = 0;
              o.left = "50%";
              o.marginTop = "0px";
              o.marginRight = "0px";
              o.marginBottom = a;
              o.transform = "translateX(-50%)";
              break;
            case "bottom-left":
              o.top = "auto";
              o.right = "auto";
              o.bottom = 0;
              o.left = 0;
              o.marginTop = "0px";
              o.marginRight = "0px";
              o.marginBottom = a;
              o.marginLeft = a;
              break;
            case "center-left":
              o.top = "50%";
              o.right = "auto";
              o.left = 0;
              o.marginTop = "0px";
              o.marginRight = "0px";
              o.marginLeft = a;
              o.transform = "translateY(-50%)";
              break;
            case "top-left":
              o.right = "auto";
              o.left = 0;
              o.marginRight = "0px";
              o.marginLeft = a;
              break;
            case "top-center":
              o.right = "auto";
              o.left = "50%";
              o.marginRight = "0px";
              o.marginTop = a;
              o.transform = "translateX(-50%)";
              break;
            default:
              break;
          }
          r += ".itemize_parent_"
            .concat(
              e.itemizeContainerId,
              " .itemize_remove_btn{position:absolute;top:"
            )
            .concat(o.top, "!important;right:")
            .concat(o.right, "!important;bottom:")
            .concat(o.bottom, "!important;left:")
            .concat(o.left, "!important;width:")
            .concat(t.removeBtnWidth, "px!important;height:")
            .concat(
              t.removeBtnWidth,
              "px!important;overflow:hidden;cursor:pointer;margin:"
            )
            .concat(o.marginTop, " ")
            .concat(o.marginRight, " ")
            .concat(o.marginBottom, " ")
            .concat(o.marginLeft, ";transform:")
            .concat(o.transform, ";border-radius:")
            .concat(t.removeBtnCircle ? "50%" : "0%", ";background-color:")
            .concat(
              t.removeBtnBgColor,
              "}.itemize_remove_btn:hover{background-color:"
            )
            .concat(t.removeBtnBgHoverColor, "}.itemize_parent_")
            .concat(
              e.itemizeContainerId,
              " .itemize_remove_btn:hover::after,.itemize_parent_"
            )
            .concat(
              e.itemizeContainerId,
              " .itemize_remove_btn:hover::before{transition:background 150ms ease-in-out;background:"
            )
            .concat(t.removeBtnHoverColor, "}.itemize_parent_")
            .concat(
              e.itemizeContainerId,
              " .itemize_remove_btn::after,.itemize_parent_"
            )
            .concat(
              e.itemizeContainerId,
              " .itemize_remove_btn::before{content:'';position:absolute;height:"
            )
            .concat(
              t.removeBtnThickness,
              "px;transition:background 150ms ease-in-out;width:"
            )
            .concat(t.removeBtnWidth / 2, "px;top:50%;left:25%;margin-top:")
            .concat(
              t.removeBtnThickness * 0.5 < 1 ? -1 : -t.removeBtnThickness * 0.5,
              "px;background:"
            )
            .concat(t.removeBtnColor, ";border-radius:")
            .concat(t.removeBtnSharpness, "}.itemize_parent_")
            .concat(
              e.itemizeContainerId,
              " .itemize_remove_btn::before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.itemize_parent_"
            )
            .concat(
              e.itemizeContainerId,
              " .itemize_remove_btn::after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}"
            );
        }
        if (i.styleSheet) {
          i.styleSheet.cssText = r;
        } else {
          i.appendChild(document.createTextNode(r));
        }
        e.appendChild(i);
      }
    },
    {
      key: "cancelItemize",
      value: function cancelItemize(e) {
        var t = 0;
        try {
          var n = [];
          if (e === "all") {
            n = this.containers.splice(0);
          } else {
            n = e;
          }
          for (var i = 0; i < n.length; i++) {
            var r = n[i];
            var a = r.querySelectorAll(".itmz_item");
            for (var o = 0; o < a.length; o++) {
              if (a[o].itemizeContainerId) {
                this.clearObservers(a[o].itemizeContainerId);
              }
              if (a[o].itemizeItemId) {
                this.cancelItemizeChild(a[o], a[o].parentNode);
                t++;
              }
            }
            if (r.itemizeContainerId) {
              this.clearObservers(r.itemizeContainerId);
              for (var s = r.classList.length - 1; s >= 0; s--) {
                if (r.classList[s].indexOf("itemize_parent") !== -1) {
                  r.classList.remove(r.classList[s]);
                  r.classList.remove("itmz_parent");
                  break;
                }
              }
              var l = r.querySelectorAll(".itmz_parent");
              for (var c = 0; c < l.length; c++) {
                this.cancelItemize(l[c]);
              }
              r.itemizeContainerId = null;
              r.itemizeOptions = null;
              for (var u = 0; u < this.containers.length; u++) {
                if (this.containers[u] === r) {
                  this.containers.splice(u, 1);
                  break;
                }
              }
            }
          }
          return t;
        } catch (m) {
          console.error(m);
        }
      }
    },
    {
      key: "cancelItemizeChild",
      value: function cancelItemizeChild(e, t) {
        for (var n = this.items.length - 1; n >= 0; n--) {
          if (this.items[n] === e) {
            this.cleanItem(this.items[n]);
            this.items.splice(n, 1);
            break;
          }
        }
        if (!t.itemizeOptions.removeBtn) {
          e.onclick = null;
        } else {
          if (!t.itemizeOptions.removeBtnClass) {
            var i = e.querySelector(".itemize_remove_btn");
            if (i) {
              i.parentNode.removeChild(i);
            }
          } else {
            var r = e.querySelector("." + t.itemizeOptions.removeBtnClass);
            if (r) {
              r.onclick = null;
            }
          }
        }
        var a = t.querySelector(".itemize_style");
        if (a) {
          a.parentNode.removeChild(a);
        }
        for (var o = e.classList.length - 1; o >= 0; o--) {
          if (e.classList[o].indexOf("itemize_item_") !== -1) {
            e.classList.remove(e.classList[o]);
            break;
          }
        }
        e.itemizeItemId = null;
      }
    },
    {
      key: "modalConfirm",
      value: function modalConfirm(e) {
        var i = this;
        try {
          var r = 150;
          var t = document.createElement("div");
          var n = document.createElement("div");
          var a = document.createElement("div");
          var o = document.createElement("div");
          var s = document.createElement("button");
          var l = document.createElement("button");
          var c = document.createElement("div");
          var u = document.querySelector("body");
          t.classList.add("itemize_modal_backdrop");
          n.classList.add("itemize_modal");
          a.classList.add("itemize_modal_text");
          s.classList.add("itemize_modal_btnConfirm");
          l.classList.add("itemize_modal_btnCancel");
          c.classList.add("itemize_modal_cross");
          a.textContent = e.parentElement.itemizeOptions.modalText;
          s.innerHTML = "Yes";
          l.innerHTML = "Cancel";
          o.appendChild(l);
          o.appendChild(s);
          n.appendChild(a);
          n.appendChild(o);
          n.appendChild(c);
          var m = function m(e, t, n) {
            t.onclick = null;
            n.onclick = null;
            if (t.animate) {
              t.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: r,
                easing: "ease-in-out",
                fill: "both"
              });
            } else {
              i.animateRAF(t, [{ opacity: 1 }], [{ opacity: 0 }], r);
            }
            if (n.animate) {
              n.animate(
                [
                  {
                    opacity: 1,
                    transform: "translateY(-50%) translateX(-50%)"
                  },
                  { opacity: 0, transform: "translateY(0%) translateX(-50%)" }
                ],
                { duration: r, easing: "ease-in-out", fill: "both" }
              );
            } else {
              i.animateRAF(
                n,
                [
                  {
                    opacity: 1,
                    transform: { translateX: -50, translateY: -50, unit: "%" }
                  }
                ],
                [
                  {
                    opacity: 0,
                    transform: { translateX: -50, translateY: 0, unit: "%" }
                  }
                ],
                r
              );
            }
            clearTimeout(i.modalDisappearTimeout);
            i.modalDisappearTimeout = setTimeout(function() {
              e.removeChild(t);
              e.removeChild(n);
            }, r);
          };
          t.onclick = function() {
            if (!t.hiding) {
              m(u, t, n);
            }
            t.hiding = true;
          };
          l.onclick = function() {
            if (!l.clicked) {
              m(u, t, n);
            }
            l.clicked = true;
          };
          s.onclick = function() {
            if (!s.clicked) {
              m(u, t, n);
              i.remove(e);
            }
            s.clicked = true;
          };
          c.onclick = function() {
            if (!c.clicked) {
              m(u, t, n);
            }
            c.clicked = true;
          };
          Object.assign(n.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "25px",
            background: "#FFFFFF",
            width: "90vw",
            maxWidth: "500px",
            borderRadius: "4px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            fontFamily: "helvetica",
            zIndex: 1e8
          });
          var d =
            ".itemize_modal_btnConfirm:hover{ background-color: #c83e34 !important; transition: background-color 0.3s ease-in-out }.itemize_modal_btnCancel:hover{ background-color: #4a5055 !important; transition: background-color 0.3s ease-in-out }.itemize_modal_cross {cursor:pointer;position: absolute;right: 5px;top: 5px;width: 18px;height:18px;opacity:0.3;}.itemize_modal_cross:hover{opacity:1;}.itemize_modal_cross:before,.itemize_modal_cross:after{position:absolute;left:9px;content:' ';height: 19px;width:2px;background-color:#333;}.itemize_modal_cross:before{transform:rotate(45deg);}.itemize_modal_cross:after{transform:rotate(-45deg);}";
          var f = document.createElement("style");
          if (f.styleSheet) {
            f.styleSheet.cssText = d;
          } else {
            f.appendChild(document.createTextNode(d));
          }
          n.appendChild(f);
          Object.assign(a.style, { marginBottom: "25px" });
          Object.assign(o.style, { width: "100%", display: "flex" });
          Object.assign(l.style, {
            background: "#6C757D",
            border: "none",
            padding: "10px 0 10px 0",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
            flex: "1 0 auto",
            cursor: "pointer",
            color: "#FFFFFF",
            transition: "background-color 0.3s ease-in-out"
          });
          Object.assign(s.style, {
            background: "#F94336",
            border: "none",
            padding: "10px 0 10px 0",
            borderTopRightRadius: "4px",
            borderBottomRightRadius: "4px",
            flex: "1 0 auto",
            cursor: "pointer",
            color: "#FFFFFF",
            transition: "background-color 0.3s ease-in-out"
          });
          Object.assign(t.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0,0.7)",
            zIndex: 1e7
          });
          u.insertBefore(n, u.childNodes[0]);
          u.insertBefore(t, u.childNodes[0]);
          if (t.animate) {
            t.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: 300,
              easing: "ease-out",
              fill: "both"
            });
          } else {
            this.animateRAF(t, [{ opacity: 0 }], [{ opacity: 1 }], r);
          }
          if (n.animate) {
            n.animate(
              [
                { opacity: 0, transform: "translateY(-100%) translateX(-50%)" },
                { opacity: 1, transform: "translateY(-50%) translateX(-50%)" }
              ],
              { duration: r, easing: "ease-in", fill: "both" }
            );
          } else {
            this.animateRAF(
              n,
              [
                {
                  opacity: 0,
                  transform: { translateX: -50, translateY: -100, unit: "%" }
                }
              ],
              [
                {
                  opacity: 1,
                  transform: { translateX: -50, translateY: -50, unit: "%" }
                }
              ],
              r
            );
          }
        } catch (p) {
          console.error(" - Itemize error - \n" + p);
        }
      }
    },
    {
      key: "showNotification",
      value: function showNotification(e, t) {
        var r = this;
        if (
          (t.parentElement.itemizeOptions.showAddNotifications &&
            e === "added") ||
          (t.parentElement.itemizeOptions.showRemoveNotifications &&
            e === "removed")
        ) {
          var n = "";
          var i = "";
          var a = "";
          var o = "";
          var s = "";
          var l = "";
          var c = "";
          var u = "";
          var m = "-";
          var d = false;
          var f = t.parentElement.itemizeOptions.notificationTimer;
          var p = t.parentElement.itemizeOptions.notificationPosition;
          if (p === "bottom-center") {
            l = "50%";
            c = "100%";
            u = "-50%";
          } else if (p === "bottom-right") {
            l = "100%";
            c = "100%";
            u = "-100%";
          } else if (p === "bottom-left") {
            l = "0%";
            c = "100%";
            u = "0%";
          } else if (p === "top-center") {
            l = "50%";
            c = "0%";
            u = "-50%";
            m = "";
            d = true;
          } else if (p === "top-right") {
            l = "100%";
            c = "0%";
            u = "-100%";
            m = "";
            d = true;
          } else if (p === "top-left") {
            l = "0%";
            c = "0%";
            u = "0%";
            m = "";
            d = true;
          }
          if (e === "removed") {
            n = "itemize_remove_notification";
            i = "itemize_remove_notification_text";
            a = "#BD5B5B";
            o = "#DEADAD";
            s = t.parentElement.itemizeOptions.removeNotificationText;
          } else if (e === "added") {
            n = "itemize_add_notification";
            i = "itemize_add_notification_text";
            a = "#00AF66";
            o = "#80D7B3";
            s = t.parentElement.itemizeOptions.addNotificationText;
          }
          if (this.notificationNbs[p]) {
            this.notificationNbs[p]++;
          } else {
            this.notificationNbs[p] = 1;
          }
          var v = document.createElement("div");
          v.notificationId = this.notificationNbs[p];
          var g = document.createElement("div");
          var h = document.createElement("div");
          v.classList.add(n);
          v.classList.add("itemize_notification_" + p);
          h.classList.add(i);
          h.textContent = s;
          Object.assign(h.style, {
            boxSizing: "border-box",
            width: "100%",
            height: "100%",
            textAlign: "center",
            whiteSpace: "nowrap",
            padding: "10px 15px 10px 15px"
          });
          Object.assign(g.style, {
            background: o,
            width: "100%",
            height: "5px"
          });
          Object.assign(v.style, {
            boxSizing: "border-box",
            position: "fixed",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            top: c,
            left: l,
            border: "solid 1px " + o,
            borderRadius: "4px",
            transform: "translate("
              .concat(u, ", ")
              .concat(m)
              .concat(this.notificationNbs[p] * 100 - (d ? 100 : 0), "%)"),
            fontFamily: "helvetica",
            background: a,
            color: "#FFFFFF",
            zIndex: 1e8
          });
          document.querySelector("body").appendChild(v);
          v.appendChild(g);
          v.appendChild(h);
          if (v.animate) {
            v.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: 300,
              easing: "linear",
              fill: "both"
            });
          } else {
            this.animateRAF(v, [{ opacity: 0 }], [{ opacity: 1 }], 300);
          }
          if (g.animate) {
            g.animate([{ width: "100%" }, { width: "0%" }], {
              duration: f,
              easing: "linear",
              fill: "both"
            });
          } else {
            this.animateRAF(
              g,
              [{ width: { value: 100, unit: "%" } }],
              [{ width: { value: 0, unit: "%" } }],
              f
            );
          }
          setTimeout(function() {
            var e = document.querySelectorAll(".itemize_notification_" + p);
            for (var t = 0; t < e.length; t++) {
              if (e[t].notificationId > 0) {
                var n = parseInt(
                  "".concat(m).concat(e[t].notificationId * 100 - (d ? 100 : 0))
                );
                var i = parseInt(
                  ""
                    .concat(m)
                    .concat(e[t].notificationId * 100 - (d ? 100 : 0) - 100)
                );
                if (e[t].animate) {
                  e[t].animate(
                    [
                      {
                        transform: "translate(".concat(u, ", ").concat(n, "%)")
                      },
                      {
                        transform: "translate(".concat(u, ", ").concat(i, "%)")
                      }
                    ],
                    { duration: 150, easing: "ease-in-out", fill: "both" }
                  );
                } else {
                  r.animateRAF(
                    e[t],
                    [
                      {
                        transform: {
                          translateX: parseInt(u),
                          translateY: n,
                          unit: "%"
                        }
                      }
                    ],
                    [
                      {
                        transform: {
                          translateX: parseInt(u),
                          translateY: i,
                          unit: "%"
                        }
                      }
                    ],
                    150
                  );
                }
                e[t].notificationId--;
              }
            }
            r.notificationNbs[p]--;
            setTimeout(function() {
              document.querySelector("body").removeChild(v);
            }, 300);
          }, f);
        }
      }
    },
    {
      key: "remove",
      value: function remove(e) {
        var n = this;
        try {
          var i = null;
          if (typeof e === "string") {
            for (var t = 0; t < this.items.length; t++) {
              if (this.items[t].itemizeItemId === e) {
                i = this.items[t];
                i.arrayPosition = t;
              }
            }
            if (!i) {
              i = document.querySelector(e);
              if (!i || !i.itemizeItemId) {
                throw new Error(
                  " - Itemize error - \nNot a valid Itemize element"
                );
              }
              for (var r = 0; r < this.items.length; r++) {
                if (this.items[r].itemizeItemId === i.itemizeItemId) {
                  i.arrayPosition = r;
                }
              }
            }
            if (!i) {
              throw new Error(" - Itemize error - \nNo item found to remove");
            }
          } else {
            i = e;
            if (!i) {
              throw new Error(" - Itemize error - \nNo item found to remove");
            }
            if (!i.itemizeItemId) {
              throw new Error(
                " - Itemize error - \nNot a valid Itemize element"
              );
            }
            for (var a = 0; a < this.items.length; a++) {
              if (i.itemizeItemId === this.items[a].itemizeItemId) {
                i.arrayPosition = a;
              }
            }
          }
          if (
            (i.arrayPosition || i.arrayPosition === 0) &&
            i.parentElement &&
            i.parentElement.itemizeOptions
          ) {
            if (
              (!i.removeStatus || i.removeStatus !== "pending") &&
              !i.inFlipAnim
            ) {
              if (i.parentElement.itemizeOptions.beforeRemove) {
                i.removeStatus = "pending";
                var o = i.parentElement.itemizeOptions.beforeRemove(i);
                if (o === undefined) {
                  throw new Error(
                    ' - Itemize error - \n The function "beforeErase" must return a Boolean or a Promise'
                  );
                }
                if (typeof o.then === "function") {
                  var s = i.parentElement.itemizeOptions.animDuration;
                  var l = i.onclick;
                  i.onclick = null;
                  o.then(function(e) {
                    if (i.parentElement.itemizeOptions.anim) {
                      var t = i.querySelector(".itemize_remove_btn");
                      if (t) {
                        t.onclick = null;
                      } else {
                        t = i.querySelector(
                          "." + n.globalOptions.removeBtnClass
                        );
                        if (t) {
                          t.onclick = null;
                        }
                      }
                      n.showNotification("removed", i);
                      n.flipRemove(i);
                      n.items.splice(i.arrayPosition, 1);
                    } else {
                      n.showNotification("removed", i);
                      i.removeStatus = null;
                      i.parentNode.removeChild(i);
                      n.cleanItem(i);
                      n.items.splice(i.arrayPosition, 1);
                    }
                  })["catch"](function(e) {
                    console.log(e);
                    i.onclick = l;
                    i.removeStatus = null;
                  });
                } else if (o) {
                  if (i.parentElement.itemizeOptions.anim) {
                    var c = i.parentElement.itemizeOptions.animDuration;
                    var u = i.querySelector(".itemize_remove_btn");
                    i.onclick = null;
                    if (u) {
                      u.onclick = null;
                    } else {
                      u = i.querySelector(
                        "." + this.globalOptions.removeBtnClass
                      );
                      if (u) {
                        u.onclick = null;
                      }
                    }
                    this.showNotification("removed", i);
                    this.flipRemove(i);
                    this.items.splice(i.arrayPosition, 1);
                  } else {
                    this.showNotification("removed", i);
                    i.removeStatus = null;
                    i.parentNode.removeChild(i);
                    this.items.splice(i.arrayPosition, 1);
                    this.cleanItem(i);
                  }
                }
              } else {
                if (i.parentElement.itemizeOptions.anim) {
                  var m = i.parentElement.itemizeOptions.animDuration;
                  var d = i.querySelector(".itemize_remove_btn");
                  if (d) {
                    d.onclick = null;
                  } else {
                    d = i.querySelector(
                      "." + this.globalOptions.removeBtnClass
                    );
                    if (d) {
                      d.onclick = null;
                    }
                  }
                  this.showNotification("removed", i);
                  this.flipRemove(i);
                  this.items.splice(i.arrayPosition, 1);
                } else {
                  this.showNotification("removed", i);
                  i.removeStatus = null;
                  i.parentNode.removeChild(i);
                  this.cleanItem(i);
                  this.items.splice(i.arrayPosition, 1);
                }
              }
            }
          } else {
            throw new Error(
              " - Itemize error - \n this element has an invalid itemizeItemId"
            );
          }
        } catch (f) {
          console.error(" - Itemize error - \n" + f);
        }
      }
    },
    {
      key: "cleanItem",
      value: function cleanItem(e) {
        for (var t = 0; t < e.classList.length; t++) {
          e.classList.remove("itmz_item");
          if (e.classList[t].indexOf("itemize_item_") !== -1) {
            e.classList.remove(e.classList[t]);
            break;
          }
        }
        if (e.parentNode && e.parentNode.itemizeItems) {
          for (var n = 0; n < e.parentNode.itemizeItems.length; n++) {
            if (
              e.parentNode.itemizeItems[n].itemizeItemId === e.itemizeItemId
            ) {
              e.parentNode.itemizeItems.splice(n, 1);
              break;
            }
          }
        }
        if (
          e.parentNode &&
          e.parentNode.itemizeOptions &&
          e.parentNode.itemizeOptions.removeBtnClass
        ) {
          var i = e.querySelector(
            "." + e.parentNode.itemizeOptions.removeBtnClass
          );
          if (i) {
            i.parentNode.removeChild(i);
          }
        } else {
          var r = e.querySelector(".itemize_remove_btn");
          if (r) {
            r.parentNode.removeChild(r);
          }
        }
        if (e.itemizeContainerId) {
          this.clearObservers(e.itemizeContainerId);
          var a = e.querySelectorAll(".itmz_parent");
          this.cancelItemize(a);
          for (var o = 0; o < a.length; o++) {
            if (a[o].itemizeContainerId) {
              this.clearObservers(a[o].itemizeContainerId);
            }
          }
          if (e.classList.contains("itmz_parent")) {
            this.cancelItemize([e]);
          }
        }
        e.itemizeItemId = null;
      }
    },
    {
      key: "animateRAF",
      value: function animateRAF(r, a, o, s) {
        for (var e = 0; e < a.length; e++) {
          for (var t in a[e]) {
            if (a[e].hasOwnProperty(t)) {
              if (t === "transform") {
                r.style.transform = "translateX("
                  .concat(a[e][t].translateX)
                  .concat(a[e][t].unit, ") translateY(")
                  .concat(a[e][t].translateY)
                  .concat(a[e][t].unit, ")");
              } else if (t === "opacity") {
                r.style.opacity = a[e][t];
              } else {
                r.style[t] = "".concat(a[e][t].value).concat(a[e][t].unit);
              }
            }
          }
        }
        function anim(e) {
          var t;
          if (!r.startAnimTime) {
            r.startAnimTime = e;
          }
          t = e - r.startAnimTime;
          for (var n = 0; n < o.length; n++) {
            for (var i in o[n]) {
              if (o[n].hasOwnProperty(i)) {
                if (i === "transform") {
                  r.style.transform = "translateX("
                    .concat(
                      a[n][i].translateX -
                        ((a[n][i].translateX - o[n][i].translateX) *
                          parseInt(100 / (s / t))) /
                          100
                    )
                    .concat(o[n][i].unit, ") translateY(")
                    .concat(
                      a[n][i].translateY -
                        ((a[n][i].translateY - o[n][i].translateY) *
                          parseInt(100 / (s / t))) /
                          100
                    )
                    .concat(o[n][i].unit, ")");
                } else if (i === "opacity") {
                  r.style.opacity =
                    a[n][i] -
                    ((a[n][i] - o[n][i]) * parseInt(100 / (s / t))) / 100;
                } else {
                  r.style[i] = ""
                    .concat(
                      a[n][i].value -
                        ((a[n][i].value - o[n][i].value) *
                          parseInt(100 / (s / t))) /
                          100
                    )
                    .concat(o[n][i].unit);
                }
              }
            }
          }
          if (t < s - 1) {
            requestAnimationFrame(anim);
          } else {
            r.startAnimTime = null;
            if (r.inFlipAnim) {
              r.inFlipAnim = false;
              r.style.transform = "none";
            }
          }
        }
        requestAnimationFrame(anim);
      }
    },
    {
      key: "flipRemove",
      value: function flipRemove(t) {
        var n = this;
        t.onclick = null;
        var i = t.parentElement.itemizeOptions;
        if (t.animate) {
          t.animate(
            [
              { transform: "translate(0px, 0px)", opacity: 1 },
              {
                transform: "translate("
                  .concat(i.animRemoveTranslateX, "px, ")
                  .concat(i.animRemoveTranslateY, "px)"),
                opacity: 0
              }
            ],
            {
              duration: i.animDuration * 0.5,
              easing: i.animEasing,
              fill: "both"
            }
          );
        } else {
          this.animateRAF(
            t,
            [
              { opacity: 1 },
              { transform: { translateX: 0, translateY: 0, unit: "px" } }
            ],
            [
              { opacity: 0 },
              {
                transform: {
                  translateX: i.animRemoveTranslateX,
                  translateY: i.animRemoveTranslateY,
                  unit: "px"
                }
              }
            ],
            i.animDuration * 0.5
          );
        }
        var r = this.makeId(6);
        this.flipPlayId = r;
        setTimeout(function() {
          n.elemToRemove.push(t);
          if (n.flipPlayId === r) {
            n.flipRead(n.items);
            for (var e = 0; e < n.elemToRemove.length; e++) {
              n.cleanItem(n.elemToRemove[e]);
              n.elemToRemove[e].removeStatus = null;
              n.elemToRemove[e].parentNode.removeChild(n.elemToRemove[e]);
            }
            n.elemToRemove = [];
            n.flipPlay(n.items, i.animDuration * 0.5);
          }
        }, i.animDuration * 0.5);
      }
    },
    {
      key: "flipAdd",
      value: function flipAdd(e) {
        e.classList.remove("itemize_hide");
        e.inAddAnim = true;
        var t = e.parentElement.itemizeOptions;
        var n = t.animAddTranslateX;
        var i = t.animAddTranslateY;
        if (e.animate) {
          e.animate(
            [
              {
                transform: "translate(".concat(n, "px, ").concat(i, "px)"),
                opacity: 0
              },
              { transform: "none", opacity: 1 }
            ],
            { duration: t.animDuration, easing: t.animEasing }
          );
        } else {
          this.animateRAF(
            e,
            [
              { opacity: 0 },
              { transform: { translateX: n, translateY: i, unit: "px" } }
            ],
            [
              { opacity: 1 },
              { transform: { translateX: 0, translateY: 0, unit: "px" } }
            ],
            t.animDuration
          );
        }
        setTimeout(function() {
          e.inAddAnim = false;
          e.newAddPos = null;
          e.oldPos = null;
          e.style.transform = "none";
          e.style.opacity = 1;
        }, t.animDuration);
      }
    },
    {
      key: "flipRead",
      value: function flipRead(e) {
        for (var t = e.length - 1; t >= 0; t--) {
          if (e[t].parentNode) {
            this.elPos[e[t].itemizeItemId] = e[t].getBoundingClientRect();
          } else {
            e.splice(t, 1);
          }
        }
      }
    },
    {
      key: "flipPlay",
      value: function flipPlay(l, c) {
        var u = this;
        var e = function e(t) {
          var e = l[t];
          if (!e.inAddAnim && e.parentNode && e.parentNode.itemizeOptions) {
            var n = e.getBoundingClientRect();
            var i = u.elPos[e.itemizeItemId];
            var r = i.left - n.left;
            var a = i.top - n.top;
            var o = i.width / n.width;
            var s = i.height / n.height;
            if (isNaN(o) || o === Infinity) {
              o = 1;
            }
            if (isNaN(s) || s === Infinity) {
              s = 1;
            }
            if (r !== 0 || a !== 0 || o !== 1 || s !== 1) {
              e.inFlipAnim = true;
              if (e.animate) {
                e.animate(
                  [
                    {
                      transform: "translate(".concat(r, "px, ").concat(a, "px)")
                    },
                    { transform: "none" }
                  ],
                  {
                    duration: c,
                    easing: e.parentNode.itemizeOptions.animEasing
                  }
                );
              } else {
                u.animateRAF(
                  e,
                  [{ transform: { translateX: r, translateY: a, unit: "px" } }],
                  [{ transform: { translateX: 0, translateY: 0, unit: "px" } }],
                  c
                );
              }
              if (document.querySelector("body").animate) {
                setTimeout(function() {
                  if (e) {
                    e.style.transform = "none";
                    e.inFlipAnim = false;
                  }
                }, c);
              }
            }
          }
        };
        for (var t = 0; t < l.length; t++) {
          e(t);
        }
      }
    },
    {
      key: "mergeOptions",
      value: function mergeOptions(e) {
        try {
          var t = {
            removeBtn: true,
            removeBtnWidth: 20,
            removeBtnThickness: 2,
            removeBtnColor: "#565C67",
            removeBtnHoverColor: "#ffffff",
            removeBtnSharpness: "0%",
            removeBtnPosition: "top-right",
            removeBtnMargin: 2,
            removeBtnCircle: true,
            removeBtnBgColor: "rgba(200, 200, 200, 0.5)",
            removeBtnBgHoverColor: "#959595",
            removeBtnClass: null,
            modalConfirm: false,
            modalText: "Are you sure to remove this item?",
            removeNotificationText: "Item removed",
            addNotificationText: "Item added",
            showRemoveNotifications: false,
            showAddNotifications: false,
            notificationPosition: "bottom-right",
            notificationTimer: 4e3,
            anim: true,
            animEasing: "ease-in-out",
            animDuration: 500,
            animRemoveTranslateX: 0,
            animRemoveTranslateY: -100,
            animAddTranslateX: 0,
            animAddTranslateY: -100,
            beforeRemove: null,
            outlineItemOnHover: false,
            nestingLevel: 1,
            itemizeAddedElement: true,
            onAddItem: null
          };
          if (this.globalOptions) {
            t = _objectSpread({}, this.globalOptions);
          }
          var n = _objectSpread({}, t, {}, e);
          return n;
        } catch (i) {
          console.error(i);
        }
      }
    },
    {
      key: "getOptionsFromAttributes",
      value: function getOptionsFromAttributes(e, t) {
        var n = [
          "removeBtnWidth",
          "removeBtnThickness",
          "removeBtnMargin",
          "nestingLevel",
          "animDuration",
          "animRemoveTranslateX",
          "animRemoveTranslateY",
          "animAddTranslateX",
          "animAddTranslateY",
          "removeBtnThickness",
          "notificationTimer"
        ];
        for (var i in t) {
          if (t.hasOwnProperty(i)) {
            if (e.getAttribute(i)) {
              if (e.getAttribute(i) === "false") {
                t[i] = false;
              } else if (e.getAttribute(i) === "true") {
                t[i] = true;
              } else if (n.indexOf(i) !== -1) {
                if (!isNaN(parseInt(e.getAttribute(i)))) {
                  t[i] = parseInt(e.getAttribute(i));
                }
              } else {
                t[i] = e.getAttribute(i);
              }
            }
          }
        }
        return t;
      }
    },
    {
      key: "makeId",
      value: function makeId(e) {
        var t = "";
        var n =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var i = n.length;
        for (var r = 0; r < e; r++) {
          t += n.charAt(Math.floor(Math.random() * i));
        }
        return t;
      }
    }
  ]);
  return Itemize;
})();
try {
  module.exports = Itemize;
} catch (_unused) {}
("use strict");
var homePage = true;
var itemManager = new Itemize();
window.addEventListener("load", function() {
  itemManager.apply({ showAddNotifications: true });
  var e = document.querySelector(".refresh_1");
  var t = document.querySelector(".example1_container");
  e.addEventListener("click", function() {
    t.innerHTML =
      '<div class="item">ITEM 1</div> <div class="item">ITEM 2</div><div class="item">ITEM 3</div><div class="item">ITEM 4</div>';
    itemManager.apply(".example1_container");
  });
  var n = document.querySelector(".refresh_2");
  var i = document.querySelector(".example2_container");
  n.addEventListener("click", function() {
    i.innerHTML =
      '<div class="cat"><img src="img/cat1.jpeg" alt=""></div><div class="cat"><img src="img/cat2.jpeg" alt=""></div><div class="cat"><img src="img/cat3.jpeg" alt=""></div><div class="cat"><img src="img/cat4.jpeg" alt=""></div>';
    r();
  });
  var r = function r() {
    itemManager.apply(".example2_container", {
      modalConfirm: true,
      modalText: "Remove this image?",
      showRemoveNotifications: true,
      removeNotificationText: "Cat image removed",
      notificationPosition: "bottom-center",
      removeBtnPosition: "top-left",
      removeBtnBgColor: "#ffffff"
    });
  };
  r();
  var a = document.querySelector(".refresh_3");
  var o = document.querySelector(".example3_container");
  var s = function s() {
    document.querySelector(".add_btn").addEventListener("click", function() {
      var e = document.createElement("div");
      e.classList.add("item");
      e.textContent = "ITEM";
      document.querySelector(".example3_container").appendChild(e);
    });
  };
  s();
  a.addEventListener("click", function() {
    o.innerHTML =
      '<button notItemize class="add_btn">Add a DOM element</button><div class="item">ITEM</div><div class="item">ITEM</div>';
    s();
    itemManager.apply(".example3_container", { showAddNotifications: true });
  });
  var l = document.querySelector(".refresh_4");
  var c = document.querySelector(".example4_container");
  itemManager.apply(".example4_container", {
    removeBtnClass: "rm_btn",
    animDuration: 1e3,
    animRemoveTranslateX: 200,
    animRemoveTranslateY: 100
  });
  l.addEventListener("click", function() {
    c.innerHTML =
      '<div>ITEM 1<br><button class="rm_btn">Remove me</button></div><div>ITEM 2<br><button class="rm_btn">Remove me</button></div><div>ITEM 3<br><button class="rm_btn">Remove me</button></div>';
    itemManager.apply(".example4_container", {
      removeBtnClass: "rm_btn",
      animDuration: 1e3,
      animRemoveTranslateX: 200,
      animRemoveTranslateY: 100
    });
  });
  var u = document.querySelector(".example_btn");
  u.addEventListener("click", function() {
    window.scroll({
      top: document.querySelector(".second_section").offsetTop,
      left: 0,
      behavior: "smooth"
    });
  });
  if (window.location.href.indexOf("example") !== -1) {
    window.scroll({
      top: document.querySelector(".second_section").offsetTop,
      left: 0,
      behavior: "smooth"
    });
  }
  if (homePage) {
    var m = document.querySelector(".get_start_nav");
    var d = document.querySelector(".dl_nav");
    var f = document.querySelector(".doc_nav");
    if (window.pageYOffset < 300) {
      m.classList.add("off");
      d.classList.add("off");
      f.classList.add("off");
    } else {
      m.classList.remove("off");
      d.classList.remove("off");
      f.classList.remove("off");
    }
  }
  var p = document.querySelectorAll(".reveal");
  p = Array.prototype.slice.call(p);
  for (var v = 0; v < p.length; v++) {
    if (isInViewport(p[v], 0.3)) {
      p[v].classList.add("apply");
    }
  }
  window.addEventListener("scroll", function(e) {
    for (var t = p.length - 1; t >= 0; t--) {
      if (isInViewport(p[t], 0.1)) {
        p[t].classList.add("apply");
        p.splice(t, 1);
      }
    }
  });
});
function isInViewport(e, t) {
  if (e) {
    var n = e.getBoundingClientRect();
    return n.top + n.height * t <= window.innerHeight && n.bottom >= 0;
  }
}
!(function(e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : (e.anime = t());
})(this, function() {
  "use strict";
  var _ = {
      update: null,
      begin: null,
      loopBegin: null,
      changeBegin: null,
      change: null,
      changeComplete: null,
      loopComplete: null,
      complete: null,
      loop: 1,
      direction: "normal",
      autoplay: !0,
      timelineOffset: 0
    },
    H = {
      duration: 1e3,
      delay: 0,
      endDelay: 0,
      easing: "easeOutElastic(1, .5)",
      round: 0
    },
    u = [
      "translateX",
      "translateY",
      "translateZ",
      "rotate",
      "rotateX",
      "rotateY",
      "rotateZ",
      "scale",
      "scaleX",
      "scaleY",
      "scaleZ",
      "skew",
      "skewX",
      "skewY",
      "perspective"
    ],
    p = { CSS: {}, springs: {} };
  function a(e, t, n) {
    return Math.min(Math.max(e, t), n);
  }
  function o(e, t) {
    return e.indexOf(t) > -1;
  }
  function i(e, t) {
    return e.apply(null, t);
  }
  var U = {
    arr: function(e) {
      return Array.isArray(e);
    },
    obj: function(e) {
      return o(Object.prototype.toString.call(e), "Object");
    },
    pth: function(e) {
      return U.obj(e) && e.hasOwnProperty("totalLength");
    },
    svg: function(e) {
      return e instanceof SVGElement;
    },
    inp: function(e) {
      return e instanceof HTMLInputElement;
    },
    dom: function(e) {
      return e.nodeType || U.svg(e);
    },
    str: function(e) {
      return "string" == typeof e;
    },
    fnc: function(e) {
      return "function" == typeof e;
    },
    und: function(e) {
      return void 0 === e;
    },
    hex: function(e) {
      return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(e);
    },
    rgb: function(e) {
      return /^rgb/.test(e);
    },
    hsl: function(e) {
      return /^hsl/.test(e);
    },
    col: function(e) {
      return U.hex(e) || U.rgb(e) || U.hsl(e);
    },
    key: function(e) {
      return (
        !_.hasOwnProperty(e) &&
        !H.hasOwnProperty(e) &&
        "targets" !== e &&
        "keyframes" !== e
      );
    }
  };
  function s(e) {
    var t = /\(([^)]+)\)/.exec(e);
    return t
      ? t[1].split(",").map(function(e) {
          return parseFloat(e);
        })
      : [];
  }
  function c(r, n) {
    var e = s(r),
      t = a(U.und(e[0]) ? 1 : e[0], 0.1, 100),
      i = a(U.und(e[1]) ? 100 : e[1], 0.1, 100),
      o = a(U.und(e[2]) ? 10 : e[2], 0.1, 100),
      l = a(U.und(e[3]) ? 0 : e[3], 0.1, 100),
      c = Math.sqrt(i / t),
      u = o / (2 * Math.sqrt(i * t)),
      m = u < 1 ? c * Math.sqrt(1 - u * u) : 0,
      d = 1,
      f = u < 1 ? (u * c - l) / m : -l + c;
    function g(e) {
      var t = n ? (n * e) / 1e3 : e;
      return (
        (t =
          u < 1
            ? Math.exp(-t * u * c) * (d * Math.cos(m * t) + f * Math.sin(m * t))
            : (d + f * t) * Math.exp(-t * c)),
        0 === e || 1 === e ? e : 1 - t
      );
    }
    return n
      ? g
      : function() {
          var e = p.springs[r];
          if (e) return e;
          for (var t = 0, n = 0; ; )
            if (1 === g((t += 1 / 6))) {
              if (++n >= 16) break;
            } else n = 0;
          var i = t * (1 / 6) * 1e3;
          return (p.springs[r] = i), i;
        };
  }
  function f(e, t) {
    void 0 === e && (e = 1), void 0 === t && (t = 0.5);
    var n = a(e, 1, 10),
      i = a(t, 0.1, 2);
    return function(e) {
      return 0 === e || 1 === e
        ? e
        : -n *
            Math.pow(2, 10 * (e - 1)) *
            Math.sin(
              ((e - 1 - (i / (2 * Math.PI)) * Math.asin(1 / n)) *
                (2 * Math.PI)) /
                i
            );
    };
  }
  function l(t) {
    return (
      void 0 === t && (t = 10),
      function(e) {
        return Math.round(e * t) * (1 / t);
      }
    );
  }
  var d = (function() {
      var m = 11,
        d = 1 / (m - 1);
      function r(e, t) {
        return 1 - 3 * t + 3 * e;
      }
      function t(e, t) {
        return 3 * t - 6 * e;
      }
      function a(e) {
        return 3 * e;
      }
      function o(e, n, i) {
        return ((r(n, i) * e + t(n, i)) * e + a(n)) * e;
      }
      function i(e, n, i) {
        return 3 * r(n, i) * e * e + 2 * t(n, i) * e + a(n);
      }
      return function(l, t, c, n) {
        if (0 <= l && l <= 1 && 0 <= c && c <= 1) {
          var u = new Float32Array(m);
          if (l !== t || c !== n)
            for (var e = 0; e < m; ++e) u[e] = o(e * d, l, c);
          return function(e) {
            return l === t && c === n
              ? e
              : 0 === e || 1 === e
              ? e
              : o(f(e), t, n);
          };
        }
        function f(e) {
          for (var t = 0, n = 1, r = m - 1; n !== r && u[n] <= e; ++n) t += d;
          var a = t + ((e - u[--n]) / (u[n + 1] - u[n])) * d,
            s = i(a, l, c);
          return s >= 0.001
            ? (function(e, t, n, r) {
                for (var a = 0; a < 4; ++a) {
                  var s = i(t, n, r);
                  if (0 === s) return t;
                  t -= (o(t, n, r) - e) / s;
                }
                return t;
              })(e, a, l, c)
            : 0 === s
            ? a
            : (function(e, t, n, i, r) {
                for (
                  var a, s, l = 0;
                  (a = o((s = t + (n - t) / 2), i, r) - e) > 0
                    ? (n = s)
                    : (t = s),
                    Math.abs(a) > 1e-7 && ++l < 10;

                );
                return s;
              })(e, t, t + d, l, c);
        }
      };
    })(),
    K = (function() {
      var i = [
          "Quad",
          "Cubic",
          "Quart",
          "Quint",
          "Sine",
          "Expo",
          "Circ",
          "Back",
          "Elastic"
        ],
        e = {
          In: [
            [0.55, 0.085, 0.68, 0.53],
            [0.55, 0.055, 0.675, 0.19],
            [0.895, 0.03, 0.685, 0.22],
            [0.755, 0.05, 0.855, 0.06],
            [0.47, 0, 0.745, 0.715],
            [0.95, 0.05, 0.795, 0.035],
            [0.6, 0.04, 0.98, 0.335],
            [0.6, -0.28, 0.735, 0.045],
            f
          ],
          Out: [
            [0.25, 0.46, 0.45, 0.94],
            [0.215, 0.61, 0.355, 1],
            [0.165, 0.84, 0.44, 1],
            [0.23, 1, 0.32, 1],
            [0.39, 0.575, 0.565, 1],
            [0.19, 1, 0.22, 1],
            [0.075, 0.82, 0.165, 1],
            [0.175, 0.885, 0.32, 1.275],
            function(t, n) {
              return function(e) {
                return 1 - f(t, n)(1 - e);
              };
            }
          ],
          InOut: [
            [0.455, 0.03, 0.515, 0.955],
            [0.645, 0.045, 0.355, 1],
            [0.77, 0, 0.175, 1],
            [0.86, 0, 0.07, 1],
            [0.445, 0.05, 0.55, 0.95],
            [1, 0, 0, 1],
            [0.785, 0.135, 0.15, 0.86],
            [0.68, -0.55, 0.265, 1.55],
            function(t, n) {
              return function(e) {
                return e < 0.5
                  ? f(t, n)(2 * e) / 2
                  : 1 - f(t, n)(-2 * e + 2) / 2;
              };
            }
          ]
        },
        r = { linear: [0.25, 0.25, 0.75, 0.75] },
        t = function(n) {
          e[n].forEach(function(e, t) {
            r["ease" + n + i[t]] = e;
          });
        };
      for (var n in e) t(n);
      return r;
    })();
  function v(e, t) {
    if (U.fnc(e)) return e;
    var n = e.split("(")[0],
      r = K[n],
      a = s(e);
    switch (n) {
      case "spring":
        return c(e, t);
      case "cubicBezier":
        return i(d, a);
      case "steps":
        return i(l, a);
      default:
        return U.fnc(r) ? i(r, a) : i(d, r);
    }
  }
  function h(e) {
    try {
      return document.querySelectorAll(e);
    } catch (e) {
      return;
    }
  }
  function g(e, t) {
    for (
      var n = e.length,
        i = arguments.length >= 2 ? arguments[1] : void 0,
        r = [],
        a = 0;
      a < n;
      a++
    )
      if (a in e) {
        var o = e[a];
        t.call(i, o, a, e) && r.push(o);
      }
    return r;
  }
  function m(e) {
    return e.reduce(function(e, t) {
      return e.concat(U.arr(t) ? m(t) : t);
    }, []);
  }
  function y(e) {
    return U.arr(e)
      ? e
      : (U.str(e) && (e = h(e) || e),
        e instanceof NodeList || e instanceof HTMLCollection
          ? [].slice.call(e)
          : [e]);
  }
  function b(e, t) {
    return e.some(function(e) {
      return e === t;
    });
  }
  function x(e) {
    var t = {};
    for (var n in e) t[n] = e[n];
    return t;
  }
  function M(e, t) {
    var n = x(e);
    for (var i in e) n[i] = t.hasOwnProperty(i) ? t[i] : e[i];
    return n;
  }
  function w(e, t) {
    var n = x(e);
    for (var i in t) n[i] = U.und(e[i]) ? t[i] : e[i];
    return n;
  }
  function k(e) {
    return U.rgb(e)
      ? (n = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec((t = e)))
        ? "rgba(" + n[1] + ",1)"
        : t
      : U.hex(e)
      ? ((i = e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(
          e,
          t,
          n,
          i
        ) {
          return t + t + n + n + i + i;
        })),
        (r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(i)),
        "rgba(" +
          parseInt(r[1], 16) +
          "," +
          parseInt(r[2], 16) +
          "," +
          parseInt(r[3], 16) +
          ",1)")
      : U.hsl(e)
      ? (function(e) {
          var t,
            n,
            i,
            r =
              /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(e) ||
              /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(e),
            a = parseInt(r[1], 10) / 360,
            o = parseInt(r[2], 10) / 100,
            s = parseInt(r[3], 10) / 100,
            l = r[4] || 1;
          function c(e, t, n) {
            return (
              n < 0 && (n += 1),
              n > 1 && (n -= 1),
              n < 1 / 6
                ? e + 6 * (t - e) * n
                : n < 0.5
                ? t
                : n < 2 / 3
                ? e + (t - e) * (2 / 3 - n) * 6
                : e
            );
          }
          if (0 == o) t = n = i = s;
          else {
            var u = s < 0.5 ? s * (1 + o) : s + o - s * o,
              m = 2 * s - u;
            (t = c(m, u, a + 1 / 3)),
              (n = c(m, u, a)),
              (i = c(m, u, a - 1 / 3));
          }
          return (
            "rgba(" + 255 * t + "," + 255 * n + "," + 255 * i + "," + l + ")"
          );
        })(e)
      : void 0;
    var t, n, i, r;
  }
  function C(e) {
    var t = /([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(
      e
    );
    if (t) return t[2];
  }
  function O(e, t) {
    return U.fnc(e) ? e(t.target, t.id, t.total) : e;
  }
  function P(e, t) {
    return e.getAttribute(t);
  }
  function I(e, t, n) {
    if (b([n, "deg", "rad", "turn"], C(t))) return t;
    var i = p.CSS[t + n];
    if (!U.und(i)) return i;
    var r = document.createElement(e.tagName),
      a =
        e.parentNode && e.parentNode !== document
          ? e.parentNode
          : document.body;
    a.appendChild(r),
      (r.style.position = "absolute"),
      (r.style.width = 100 + n);
    var o = 100 / r.offsetWidth;
    a.removeChild(r);
    var s = o * parseFloat(t);
    return (p.CSS[t + n] = s), s;
  }
  function B(e, t, n) {
    if (t in e.style) {
      var i = t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        r = e.style[t] || getComputedStyle(e).getPropertyValue(i) || "0";
      return n ? I(e, r, n) : r;
    }
  }
  function D(e, t) {
    return U.dom(e) && !U.inp(e) && (P(e, t) || (U.svg(e) && e[t]))
      ? "attribute"
      : U.dom(e) && b(u, t)
      ? "transform"
      : U.dom(e) && "transform" !== t && B(e, t)
      ? "css"
      : null != e[t]
      ? "object"
      : void 0;
  }
  function T(e) {
    if (U.dom(e)) {
      for (
        var t,
          n = e.style.transform || "",
          i = /(\w+)\(([^)]*)\)/g,
          r = new Map();
        (t = i.exec(n));

      )
        r.set(t[1], t[2]);
      return r;
    }
  }
  function F(e, t, n, i) {
    var r,
      a = o(t, "scale")
        ? 1
        : 0 +
          (o((r = t), "translate") || "perspective" === r
            ? "px"
            : o(r, "rotate") || o(r, "skew")
            ? "deg"
            : void 0),
      s = T(e).get(t) || a;
    return (
      n && (n.transforms.list.set(t, s), (n.transforms.last = t)),
      i ? I(e, s, i) : s
    );
  }
  function N(e, t, n, i) {
    switch (D(e, t)) {
      case "transform":
        return F(e, t, i, n);
      case "css":
        return B(e, t, n);
      case "attribute":
        return P(e, t);
      default:
        return e[t] || 0;
    }
  }
  function A(e, t) {
    var n = /^(\*=|\+=|-=)/.exec(e);
    if (!n) return e;
    var i = C(e) || 0,
      r = parseFloat(t),
      a = parseFloat(e.replace(n[0], ""));
    switch (n[0][0]) {
      case "+":
        return r + a + i;
      case "-":
        return r - a + i;
      case "*":
        return r * a + i;
    }
  }
  function E(e, t) {
    if (U.col(e)) return k(e);
    var n = C(e),
      i = n ? e.substr(0, e.length - n.length) : e;
    return t && !/\s/g.test(e) ? i + t : i;
  }
  function L(e, t) {
    return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
  }
  function S(e) {
    for (var t, n = e.points, i = 0, r = 0; r < n.numberOfItems; r++) {
      var a = n.getItem(r);
      r > 0 && (i += L(t, a)), (t = a);
    }
    return i;
  }
  function j(e) {
    if (e.getTotalLength) return e.getTotalLength();
    switch (e.tagName.toLowerCase()) {
      case "circle":
        return (a = e), 2 * Math.PI * P(a, "r");
      case "rect":
        return 2 * P((r = e), "width") + 2 * P(r, "height");
      case "line":
        return L(
          { x: P((i = e), "x1"), y: P(i, "y1") },
          { x: P(i, "x2"), y: P(i, "y2") }
        );
      case "polyline":
        return S(e);
      case "polygon":
        return (
          (n = (t = e).points),
          S(t) + L(n.getItem(n.numberOfItems - 1), n.getItem(0))
        );
    }
    var t, n, i, r, a;
  }
  function q(e, t) {
    var n = t || {},
      i =
        n.el ||
        (function(e) {
          for (
            var t = e.parentNode;
            U.svg(t) && ((t = t.parentNode), U.svg(t.parentNode));

          );
          return t;
        })(e),
      r = i.getBoundingClientRect(),
      a = P(i, "viewBox"),
      o = r.width,
      s = r.height,
      l = n.viewBox || (a ? a.split(" ") : [0, 0, o, s]);
    return {
      el: i,
      viewBox: l,
      x: l[0] / 1,
      y: l[1] / 1,
      w: o / l[2],
      h: s / l[3]
    };
  }
  function $(n, i) {
    function r(e) {
      void 0 === e && (e = 0);
      var t = i + e >= 1 ? i + e : 0;
      return n.el.getPointAtLength(t);
    }
    var e = q(n.el, n.svg),
      t = r(),
      a = r(-1),
      o = r(1);
    switch (n.property) {
      case "x":
        return (t.x - e.x) * e.w;
      case "y":
        return (t.y - e.y) * e.h;
      case "angle":
        return (180 * Math.atan2(o.y - a.y, o.x - a.x)) / Math.PI;
    }
  }
  function X(e, t) {
    var n = /-?\d*\.?\d+/g,
      i = E(U.pth(e) ? e.totalLength : e, t) + "";
    return {
      original: i,
      numbers: i.match(n) ? i.match(n).map(Number) : [0],
      strings: U.str(e) || t ? i.split(n) : []
    };
  }
  function Y(e) {
    return g(e ? m(U.arr(e) ? e.map(y) : y(e)) : [], function(e, t, n) {
      return n.indexOf(e) === t;
    });
  }
  function Z(e) {
    var n = Y(e);
    return n.map(function(e, t) {
      return { target: e, id: t, total: n.length, transforms: { list: T(e) } };
    });
  }
  function Q(e, i) {
    var t = x(i);
    if ((/^spring/.test(t.easing) && (t.duration = c(t.easing)), U.arr(e))) {
      var n = e.length;
      2 === n && !U.obj(e[0])
        ? (e = { value: e })
        : U.fnc(i.duration) || (t.duration = i.duration / n);
    }
    var r = U.arr(e) ? e : [e];
    return r
      .map(function(e, t) {
        var n = U.obj(e) && !U.pth(e) ? e : { value: e };
        return (
          U.und(n.delay) && (n.delay = t ? 0 : i.delay),
          U.und(n.endDelay) &&
            (n.endDelay = t === r.length - 1 ? i.endDelay : 0),
          n
        );
      })
      .map(function(e) {
        return w(e, t);
      });
  }
  function V(e, t) {
    var n = [],
      i = t.keyframes;
    for (var r in (i &&
      (t = w(
        (function(t) {
          for (
            var n = g(
                m(
                  t.map(function(e) {
                    return Object.keys(e);
                  })
                ),
                function(e) {
                  return U.key(e);
                }
              ).reduce(function(e, t) {
                return e.indexOf(t) < 0 && e.push(t), e;
              }, []),
              r = {},
              e = function(e) {
                var i = n[e];
                r[i] = t.map(function(e) {
                  var t = {};
                  for (var n in e)
                    U.key(n) ? n == i && (t.value = e[n]) : (t[n] = e[n]);
                  return t;
                });
              },
              i = 0;
            i < n.length;
            i++
          )
            e(i);
          return r;
        })(i),
        t
      )),
    t))
      U.key(r) && n.push({ name: r, tweens: Q(t[r], e) });
    return n;
  }
  function z(u, m) {
    var d;
    return u.tweens.map(function(e) {
      var t = (function(e, t) {
          var n = {};
          for (var i in e) {
            var r = O(e[i], t);
            U.arr(r) &&
              1 ===
                (r = r.map(function(e) {
                  return O(e, t);
                })).length &&
              (r = r[0]),
              (n[i] = r);
          }
          return (
            (n.duration = parseFloat(n.duration)),
            (n.delay = parseFloat(n.delay)),
            n
          );
        })(e, m),
        n = t.value,
        i = U.arr(n) ? n[1] : n,
        r = C(i),
        a = N(m.target, u.name, r, m),
        o = d ? d.to.original : a,
        s = U.arr(n) ? n[0] : o,
        l = C(s) || C(a),
        c = r || l;
      return (
        U.und(i) && (i = o),
        (t.from = X(s, c)),
        (t.to = X(A(i, s), c)),
        (t.start = d ? d.end : 0),
        (t.end = t.start + t.delay + t.duration + t.endDelay),
        (t.easing = v(t.easing, t.duration)),
        (t.isPath = U.pth(n)),
        (t.isColor = U.col(t.from.original)),
        t.isColor && (t.round = 1),
        (d = t),
        t
      );
    });
  }
  var J = {
    css: function(e, t, n) {
      return (e.style[t] = n);
    },
    attribute: function(e, t, n) {
      return e.setAttribute(t, n);
    },
    object: function(e, t, n) {
      return (e[t] = n);
    },
    transform: function(e, t, n, i, r) {
      if ((i.list.set(t, n), t === i.last || r)) {
        var a = "";
        i.list.forEach(function(e, t) {
          a += t + "(" + e + ") ";
        }),
          (e.style.transform = a);
      }
    }
  };
  function G(e, l) {
    Z(e).forEach(function(e) {
      for (var t in l) {
        var n = O(l[t], e),
          i = e.target,
          r = C(n),
          a = N(i, t, r, e),
          o = A(E(n, r || C(a)), a),
          s = D(i, t);
        J[s](i, t, o, e.transforms, !0);
      }
    });
  }
  function R(e, n) {
    return g(
      m(
        e.map(function(t) {
          return n.map(function(e) {
            return (function(e, t) {
              var n = D(e.target, t.name);
              if (n) {
                var i = z(t, e),
                  r = i[i.length - 1];
                return {
                  type: n,
                  property: t.name,
                  animatable: e,
                  tweens: i,
                  duration: r.end,
                  delay: i[0].delay,
                  endDelay: r.endDelay
                };
              }
            })(t, e);
          });
        })
      ),
      function(e) {
        return !U.und(e);
      }
    );
  }
  function W(e, t) {
    var n = e.length,
      i = function(e) {
        return e.timelineOffset ? e.timelineOffset : 0;
      },
      r = {};
    return (
      (r.duration = n
        ? Math.max.apply(
            Math,
            e.map(function(e) {
              return i(e) + e.duration;
            })
          )
        : t.duration),
      (r.delay = n
        ? Math.min.apply(
            Math,
            e.map(function(e) {
              return i(e) + e.delay;
            })
          )
        : t.delay),
      (r.endDelay = n
        ? r.duration -
          Math.max.apply(
            Math,
            e.map(function(e) {
              return i(e) + e.duration - e.endDelay;
            })
          )
        : t.endDelay),
      r
    );
  }
  var ee = 0;
  var te,
    ne = [],
    t = [],
    ie = (function() {
      function n() {
        te = requestAnimationFrame(e);
      }
      function e(e) {
        var t = ne.length;
        if (t) {
          for (var i = 0; i < t; ) {
            var r = ne[i];
            if (r.paused) {
              var a = ne.indexOf(r);
              a > -1 && (ne.splice(a, 1), (t = ne.length));
            } else r.tick(e);
            i++;
          }
          n();
        } else te = cancelAnimationFrame(te);
      }
      return n;
    })();
  function en(e) {
    void 0 === e && (e = {});
    var o,
      s = 0,
      l = 0,
      c = 0,
      u = 0,
      m = null;
    function f(e) {
      var t =
        window.Promise &&
        new Promise(function(e) {
          return (m = e);
        });
      return (e.finished = t), t;
    }
    var t,
      n,
      i,
      r,
      d,
      p,
      v,
      h,
      S = ((n = M(_, (t = e))),
      (i = M(H, t)),
      (r = V(i, t)),
      (d = Z(t.targets)),
      (p = R(d, r)),
      (v = W(p, i)),
      (h = ee),
      ee++,
      w(n, {
        id: h,
        children: [],
        animatables: d,
        animations: p,
        duration: v.duration,
        delay: v.delay,
        endDelay: v.endDelay
      }));
    f(S);
    function k() {
      var e = S.direction;
      "alternate" !== e &&
        (S.direction = "normal" !== e ? "normal" : "reverse"),
        (S.reversed = !S.reversed),
        o.forEach(function(e) {
          return (e.reversed = S.reversed);
        });
    }
    function C(e) {
      return S.reversed ? S.duration - e : e;
    }
    function O() {
      (s = 0), (l = C(S.currentTime) * (1 / en.speed));
    }
    function P(e, t) {
      t && t.seek(e - t.timelineOffset);
    }
    function I(t) {
      for (var e = 0, n = S.animations, i = n.length; e < i; ) {
        var r = n[e],
          o = r.animatable,
          s = r.tweens,
          l = s.length - 1,
          c = s[l];
        l &&
          (c =
            g(s, function(e) {
              return t < e.end;
            })[0] || c);
        for (
          var u = a(t - c.start - c.delay, 0, c.duration) / c.duration,
            m = isNaN(u) ? 1 : c.easing(u),
            d = c.to.strings,
            f = c.round,
            p = [],
            v = c.to.numbers.length,
            h = void 0,
            y = 0;
          y < v;
          y++
        ) {
          var b = void 0,
            w = c.to.numbers[y],
            z = c.from.numbers[y] || 0;
          (b = c.isPath ? $(c.value, m * w) : z + m * (w - z)),
            f && ((c.isColor && y > 2) || (b = Math.round(b * f) / f)),
            p.push(b);
        }
        var x = d.length;
        if (x) {
          h = d[0];
          for (var I = 0; I < x; I++) {
            d[I];
            var _ = d[I + 1],
              O = p[I];
            isNaN(O) || (h += _ ? O + _ : O + " ");
          }
        } else h = p[0];
        J[r.type](o.target, r.property, h, o.transforms),
          (r.currentValue = h),
          e++;
      }
    }
    function B(e) {
      S[e] && !S.passThrough && S[e](S);
    }
    function D(e) {
      var t = S.duration,
        n = S.delay,
        i = t - S.endDelay,
        r = C(e);
      (S.progress = a((r / t) * 100, 0, 100)),
        (S.reversePlayback = r < S.currentTime),
        o &&
          (function(e) {
            if (S.reversePlayback) for (var t = u; t--; ) P(e, o[t]);
            else for (var n = 0; n < u; n++) P(e, o[n]);
          })(r),
        !S.began &&
          S.currentTime > 0 &&
          ((S.began = !0), B("begin"), B("loopBegin")),
        r <= n && 0 !== S.currentTime && I(0),
        ((r >= i && S.currentTime !== t) || !t) && I(t),
        r > n && r < i
          ? (S.changeBegan ||
              ((S.changeBegan = !0),
              (S.changeCompleted = !1),
              B("changeBegin")),
            B("change"),
            I(r))
          : S.changeBegan &&
            ((S.changeCompleted = !0),
            (S.changeBegan = !1),
            B("changeComplete")),
        (S.currentTime = a(r, 0, t)),
        S.began && B("update"),
        e >= t &&
          ((l = 0),
          S.remaining && !0 !== S.remaining && S.remaining--,
          S.remaining
            ? ((s = c),
              B("loopComplete"),
              B("loopBegin"),
              "alternate" === S.direction && k())
            : ((S.paused = !0),
              S.completed ||
                ((S.completed = !0),
                B("loopComplete"),
                B("complete"),
                !S.passThrough && "Promise" in window && (m(), f(S)))));
    }
    return (
      (S.reset = function() {
        var e = S.direction;
        (S.passThrough = !1),
          (S.currentTime = 0),
          (S.progress = 0),
          (S.paused = !0),
          (S.began = !1),
          (S.changeBegan = !1),
          (S.completed = !1),
          (S.changeCompleted = !1),
          (S.reversePlayback = !1),
          (S.reversed = "reverse" === e),
          (S.remaining = S.loop),
          (o = S.children);
        for (var t = (u = o.length); t--; ) S.children[t].reset();
        ((S.reversed && !0 !== S.loop) ||
          ("alternate" === e && 1 === S.loop)) &&
          S.remaining++,
          I(0);
      }),
      (S.set = function(e, t) {
        return G(e, t), S;
      }),
      (S.tick = function(e) {
        (c = e), s || (s = c), D((c + (l - s)) * en.speed);
      }),
      (S.seek = function(e) {
        D(C(e));
      }),
      (S.pause = function() {
        (S.paused = !0), O();
      }),
      (S.play = function() {
        S.paused &&
          (S.completed && S.reset(),
          (S.paused = !1),
          ne.push(S),
          O(),
          te || ie());
      }),
      (S.reverse = function() {
        k(), O();
      }),
      (S.restart = function() {
        S.reset(), S.play();
      }),
      S.reset(),
      S.autoplay && S.play(),
      S
    );
  }
  function rn(e, t) {
    for (var n = t.length; n--; )
      b(e, t[n].animatable.target) && t.splice(n, 1);
  }
  return (
    "undefined" != typeof document &&
      document.addEventListener("visibilitychange", function() {
        document.hidden
          ? (ne.forEach(function(e) {
              return e.pause();
            }),
            (t = ne.slice(0)),
            (ne = []))
          : t.forEach(function(e) {
              return e.play();
            });
      }),
    (en.version = "3.0.1"),
    (en.speed = 1),
    (en.running = ne),
    (en.remove = function(e) {
      for (var t = Y(e), n = ne.length; n--; ) {
        var i = ne[n],
          r = i.animations,
          a = i.children;
        rn(t, r);
        for (var o = a.length; o--; ) {
          var s = a[o],
            l = s.animations;
          rn(t, l), l.length || s.children.length || a.splice(o, 1);
        }
        r.length || a.length || i.pause();
      }
    }),
    (en.get = N),
    (en.set = G),
    (en.convertPx = I),
    (en.path = function(e, t) {
      var n = U.str(e) ? h(e)[0] : e,
        i = t || 100;
      return function(e) {
        return { property: e, el: n, svg: q(n), totalLength: j(n) * (i / 100) };
      };
    }),
    (en.setDashoffset = function(e) {
      var t = j(e);
      return e.setAttribute("stroke-dasharray", t), t;
    }),
    (en.stagger = function(e, t) {
      void 0 === t && (t = {});
      var c = t.direction || "normal",
        u = t.easing ? v(t.easing) : null,
        m = t.grid,
        d = t.axis,
        f = t.from || 0,
        p = "first" === f,
        g = "center" === f,
        h = "last" === f,
        y = U.arr(e),
        b = y ? parseFloat(e[0]) : parseFloat(e),
        w = y ? parseFloat(e[1]) : 0,
        z = C(y ? e[1] : e) || 0,
        x = t.start || 0 + (y ? b : 0),
        I = [],
        _ = 0;
      return function(e, t, n) {
        if (
          (p && (f = 0), g && (f = (n - 1) / 2), h && (f = n - 1), !I.length)
        ) {
          for (var i = 0; i < n; i++) {
            if (m) {
              var r = g ? (m[0] - 1) / 2 : f % m[0],
                a = g ? (m[1] - 1) / 2 : Math.floor(f / m[0]),
                o = r - (i % m[0]),
                s = a - Math.floor(i / m[0]),
                l = Math.sqrt(o * o + s * s);
              "x" === d && (l = -o), "y" === d && (l = -s), I.push(l);
            } else I.push(Math.abs(f - i));
            _ = Math.max.apply(Math, I);
          }
          u &&
            (I = I.map(function(e) {
              return u(e / _) * _;
            })),
            "reverse" === c &&
              (I = I.map(function(e) {
                return d ? (e < 0 ? -1 * e : -e) : Math.abs(_ - e);
              }));
        }
        return x + (y ? (w - b) / _ : b) * (Math.round(100 * I[t]) / 100) + z;
      };
    }),
    (en.timeline = function(u) {
      void 0 === u && (u = {});
      var m = en(u);
      return (
        (m.duration = 0),
        (m.add = function(e, t) {
          var n = ne.indexOf(m),
            i = m.children;
          function s(e) {
            e.passThrough = !0;
          }
          n > -1 && ne.splice(n, 1);
          for (var r = 0; r < i.length; r++) s(i[r]);
          var a = w(e, M(H, u));
          a.targets = a.targets || u.targets;
          var o = m.duration;
          (a.autoplay = !1),
            (a.direction = m.direction),
            (a.timelineOffset = U.und(t) ? o : A(t, o)),
            s(m),
            m.seek(a.timelineOffset);
          var l = en(a);
          s(l), i.push(l);
          var c = W(i, u);
          return (
            (m.delay = c.delay),
            (m.endDelay = c.endDelay),
            (m.duration = c.duration),
            m.seek(0),
            m.reset(),
            m.autoplay && m.play(),
            m
          );
        }),
        m
      );
    }),
    (en.easing = v),
    (en.penner = K),
    (en.random = function(e, t) {
      return Math.floor(Math.random() * (t - e + 1)) + e;
    }),
    en
  );
});
window.addEventListener("load", function() {
  var e = anime.timeline({ easing: "easeOutExpo", loop: true });
  e.add({
    targets: [".js_j", ".js_s"],
    borderColor: "#597180",
    duration: 1500,
    delay: 1e3
  });
  e.add({ targets: ".close", opacity: 0.5, duration: 1e3 }, "-=600");
  e.add(
    {
      targets: ".mouse",
      easing: "easeInOutSine",
      opacity: 1,
      translateX: -95,
      duration: 1500
    },
    "-=1000"
  );
  e.add(
    {
      targets: ".js_s .close",
      easing: "easeInOutSine",
      opacity: 1,
      duration: 100
    },
    "-=200"
  );
  e.add({
    targets: ".js_s",
    easing: "easeInOutSine",
    translateY: -100,
    opacity: 0,
    duration: 1e3
  });
  e.add(
    {
      targets: ".mouse",
      easing: "easeInOutSine",
      translateX: -136,
      duration: 500
    },
    "-=300"
  );
  e.add(
    {
      targets: ".js_j .close",
      easing: "easeInOutSine",
      opacity: 1,
      duration: 100
    },
    "-=200"
  );
  e.add({
    targets: ".js_j",
    easing: "easeInOutSine",
    translateY: -100,
    opacity: 0,
    duration: 1e3
  });
  e.add({
    targets: ".mouse",
    easing: "easeInOutSine",
    translateX: 0,
    duration: 1e3,
    opacity: 0
  });
  e.add({ targets: ".close", opacity: 0, duration: 200 }, "-=200");
  e.add({
    targets: ".js_j",
    easing: "easeInOutSine",
    duration: 500,
    translateY: 0,
    opacity: 1
  });
  e.add({
    targets: ".js_s",
    easing: "easeInOutSine",
    duration: 500,
    translateY: 0,
    opacity: 1
  });
  e.add({
    targets: [".js_j", ".js_s"],
    borderColor: "#ffffff",
    duration: 1500
  });
});
var _self =
    "undefined" != typeof window
      ? window
      : "undefined" != typeof WorkerGlobalScope &&
        self instanceof WorkerGlobalScope
      ? self
      : {},
  Prism = (function(c) {
    var u = /\blang(?:uage)?-([\w-]+)\b/i,
      t = 0,
      F = {
        manual: c.Prism && c.Prism.manual,
        disableWorkerMessageHandler:
          c.Prism && c.Prism.disableWorkerMessageHandler,
        util: {
          encode: function(e) {
            return e instanceof M
              ? new M(e.type, F.util.encode(e.content), e.alias)
              : Array.isArray(e)
              ? e.map(F.util.encode)
              : e
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/\u00a0/g, " ");
          },
          type: function(e) {
            return Object.prototype.toString.call(e).slice(8, -1);
          },
          objId: function(e) {
            return (
              e.__id || Object.defineProperty(e, "__id", { value: ++t }), e.__id
            );
          },
          clone: function n(e, i) {
            var r,
              t,
              a = F.util.type(e);
            switch (((i = i || {}), a)) {
              case "Object":
                if (((t = F.util.objId(e)), i[t])) return i[t];
                for (var o in ((r = {}), (i[t] = r), e))
                  e.hasOwnProperty(o) && (r[o] = n(e[o], i));
                return r;
              case "Array":
                return (
                  (t = F.util.objId(e)),
                  i[t]
                    ? i[t]
                    : ((r = []),
                      (i[t] = r),
                      e.forEach(function(e, t) {
                        r[t] = n(e, i);
                      }),
                      r)
                );
              default:
                return e;
            }
          }
        },
        languages: {
          extend: function(e, t) {
            var n = F.util.clone(F.languages[e]);
            for (var i in t) n[i] = t[i];
            return n;
          },
          insertBefore: function(n, e, t, i) {
            var r = (i = i || F.languages)[n],
              a = {};
            for (var o in r)
              if (r.hasOwnProperty(o)) {
                if (o == e)
                  for (var s in t) t.hasOwnProperty(s) && (a[s] = t[s]);
                t.hasOwnProperty(o) || (a[o] = r[o]);
              }
            var l = i[n];
            return (
              (i[n] = a),
              F.languages.DFS(F.languages, function(e, t) {
                t === l && e != n && (this[e] = a);
              }),
              a
            );
          },
          DFS: function e(t, n, i, r) {
            r = r || {};
            var a = F.util.objId;
            for (var o in t)
              if (t.hasOwnProperty(o)) {
                n.call(t, o, t[o], i || o);
                var s = t[o],
                  l = F.util.type(s);
                "Object" !== l || r[a(s)]
                  ? "Array" !== l || r[a(s)] || ((r[a(s)] = !0), e(s, n, o, r))
                  : ((r[a(s)] = !0), e(s, n, null, r));
              }
          }
        },
        plugins: {},
        highlightAll: function(e, t) {
          F.highlightAllUnder(document, e, t);
        },
        highlightAllUnder: function(e, t, n) {
          var i = {
            callback: n,
            selector:
              'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
          };
          F.hooks.run("before-highlightall", i);
          for (
            var r, a = i.elements || e.querySelectorAll(i.selector), o = 0;
            (r = a[o++]);

          )
            F.highlightElement(r, !0 === t, i.callback);
        },
        highlightElement: function(e, t, n) {
          for (var i, r = "none", a = e; a && !u.test(a.className); )
            a = a.parentNode;
          a &&
            ((r = (a.className.match(u) || [, "none"])[1].toLowerCase()),
            (i = F.languages[r])),
            (e.className =
              e.className.replace(u, "").replace(/\s+/g, " ") +
              " language-" +
              r),
            e.parentNode &&
              ((a = e.parentNode),
              /pre/i.test(a.nodeName) &&
                (a.className =
                  a.className.replace(u, "").replace(/\s+/g, " ") +
                  " language-" +
                  r));
          var o = { element: e, language: r, grammar: i, code: e.textContent },
            s = function(e) {
              (o.highlightedCode = e),
                F.hooks.run("before-insert", o),
                (o.element.innerHTML = o.highlightedCode),
                F.hooks.run("after-highlight", o),
                F.hooks.run("complete", o),
                n && n.call(o.element);
            };
          if ((F.hooks.run("before-sanity-check", o), o.code))
            if ((F.hooks.run("before-highlight", o), o.grammar))
              if (t && c.Worker) {
                var l = new Worker(F.filename);
                (l.onmessage = function(e) {
                  s(e.data);
                }),
                  l.postMessage(
                    JSON.stringify({
                      language: o.language,
                      code: o.code,
                      immediateClose: !0
                    })
                  );
              } else s(F.highlight(o.code, o.grammar, o.language));
            else s(F.util.encode(o.code));
          else F.hooks.run("complete", o);
        },
        highlight: function(e, t, n) {
          var i = { code: e, grammar: t, language: n };
          return (
            F.hooks.run("before-tokenize", i),
            (i.tokens = F.tokenize(i.code, i.grammar)),
            F.hooks.run("after-tokenize", i),
            M.stringify(F.util.encode(i.tokens), i.language)
          );
        },
        matchGrammar: function(e, t, n, i, r, a, o) {
          for (var s in n)
            if (n.hasOwnProperty(s) && n[s]) {
              if (s == o) return;
              var l = n[s];
              l = "Array" === F.util.type(l) ? l : [l];
              for (var c = 0; c < l.length; ++c) {
                var u = l[c],
                  m = u.inside,
                  d = !!u.lookbehind,
                  f = !!u.greedy,
                  p = 0,
                  v = u.alias;
                if (f && !u.pattern.global) {
                  var g = u.pattern.toString().match(/[imuy]*$/)[0];
                  u.pattern = RegExp(u.pattern.source, g + "g");
                }
                u = u.pattern || u;
                for (var h = i, y = r; h < t.length; y += t[h].length, ++h) {
                  var b = t[h];
                  if (t.length > e.length) return;
                  if (!(b instanceof M)) {
                    if (f && h != t.length - 1) {
                      if (((u.lastIndex = y), !(O = u.exec(e)))) break;
                      for (
                        var w = O.index + (d ? O[1].length : 0),
                          z = O.index + O[0].length,
                          x = h,
                          I = y,
                          _ = t.length;
                        x < _ && (I < z || (!t[x].type && !t[x - 1].greedy));
                        ++x
                      )
                        (I += t[x].length) <= w && (++h, (y = I));
                      if (t[h] instanceof M) continue;
                      (k = x - h), (b = e.slice(y, I)), (O.index -= y);
                    } else {
                      u.lastIndex = 0;
                      var O = u.exec(b),
                        k = 1;
                    }
                    if (O) {
                      d && (p = O[1] ? O[1].length : 0);
                      z = (w = O.index + p) + (O = O[0].slice(p)).length;
                      var C = b.slice(0, w),
                        S = b.slice(z),
                        A = [h, k];
                      C && (++h, (y += C.length), A.push(C));
                      var T = new M(s, m ? F.tokenize(O, m) : O, v, O, f);
                      if (
                        (A.push(T),
                        S && A.push(S),
                        Array.prototype.splice.apply(t, A),
                        1 != k && F.matchGrammar(e, t, n, h, y, !0, s),
                        a)
                      )
                        break;
                    } else if (a) break;
                  }
                }
              }
            }
        },
        tokenize: function(e, t) {
          var n = [e],
            i = t.rest;
          if (i) {
            for (var r in i) t[r] = i[r];
            delete t.rest;
          }
          return F.matchGrammar(e, n, t, 0, 0, !1), n;
        },
        hooks: {
          all: {},
          add: function(e, t) {
            var n = F.hooks.all;
            (n[e] = n[e] || []), n[e].push(t);
          },
          run: function(e, t) {
            var n = F.hooks.all[e];
            if (n && n.length) for (var i, r = 0; (i = n[r++]); ) i(t);
          }
        },
        Token: M
      };
    function M(e, t, n, i, r) {
      (this.type = e),
        (this.content = t),
        (this.alias = n),
        (this.length = 0 | (i || "").length),
        (this.greedy = !!r);
    }
    if (
      ((c.Prism = F),
      (M.stringify = function(e, t) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e))
          return e
            .map(function(e) {
              return M.stringify(e, t);
            })
            .join("");
        var n = {
          type: e.type,
          content: M.stringify(e.content, t),
          tag: "span",
          classes: ["token", e.type],
          attributes: {},
          language: t
        };
        if (e.alias) {
          var i = Array.isArray(e.alias) ? e.alias : [e.alias];
          Array.prototype.push.apply(n.classes, i);
        }
        F.hooks.run("wrap", n);
        var r = Object.keys(n.attributes)
          .map(function(e) {
            return (
              e + '="' + (n.attributes[e] || "").replace(/"/g, "&quot;") + '"'
            );
          })
          .join(" ");
        return (
          "<" +
          n.tag +
          ' class="' +
          n.classes.join(" ") +
          '"' +
          (r ? " " + r : "") +
          ">" +
          n.content +
          "</" +
          n.tag +
          ">"
        );
      }),
      !c.document)
    )
      return (
        c.addEventListener &&
          (F.disableWorkerMessageHandler ||
            c.addEventListener(
              "message",
              function(e) {
                var t = JSON.parse(e.data),
                  n = t.language,
                  i = t.code,
                  r = t.immediateClose;
                c.postMessage(F.highlight(i, F.languages[n], n)),
                  r && c.close();
              },
              !1
            )),
        F
      );
    var e =
      document.currentScript ||
      [].slice.call(document.getElementsByTagName("script")).pop();
    return (
      e &&
        ((F.filename = e.src),
        F.manual ||
          e.hasAttribute("data-manual") ||
          ("loading" !== document.readyState
            ? window.requestAnimationFrame
              ? window.requestAnimationFrame(F.highlightAll)
              : window.setTimeout(F.highlightAll, 16)
            : document.addEventListener("DOMContentLoaded", F.highlightAll))),
      F
    );
  })(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism),
  "undefined" != typeof global && (global.Prism = Prism);
(Prism.languages.markup = {
  comment: /<!--[\s\S]*?-->/,
  prolog: /<\?[\s\S]+?\?>/,
  doctype: /<!DOCTYPE[\s\S]+?>/i,
  cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/i,
        inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ }
      },
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
        inside: {
          punctuation: [/^=/, { pattern: /^(\s*)["']|["']$/, lookbehind: !0 }]
        }
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: { namespace: /^[^\s>\/:]+:/ }
      }
    }
  },
  entity: /&#?[\da-z]{1,8};/i
}),
  (Prism.languages.markup.tag.inside["attr-value"].inside.entity =
    Prism.languages.markup.entity),
  Prism.hooks.add("wrap", function(e) {
    "entity" === e.type &&
      (e.attributes.title = e.content.replace(/&amp;/, "&"));
  }),
  Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function(e, t) {
      var n = {};
      (n["language-" + t] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: Prism.languages[t]
      }),
        (n.cdata = /^<!\[CDATA\[|\]\]>$/i);
      var i = {
        "included-cdata": { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: n }
      };
      i["language-" + t] = { pattern: /[\s\S]+/, inside: Prism.languages[t] };
      var r = {};
      (r[e] = {
        pattern: RegExp(
          "(<__[\\s\\S]*?>)(?:<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\s*|[\\s\\S])*?(?=<\\/__>)".replace(
            /__/g,
            e
          ),
          "i"
        ),
        lookbehind: !0,
        greedy: !0,
        inside: i
      }),
        Prism.languages.insertBefore("markup", "cdata", r);
    }
  }),
  (Prism.languages.xml = Prism.languages.extend("markup", {})),
  (Prism.languages.html = Prism.languages.markup),
  (Prism.languages.mathml = Prism.languages.markup),
  (Prism.languages.svg = Prism.languages.markup);
!(function(e) {
  var t = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
  (e.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
      inside: { rule: /@[\w-]+/ }
    },
    url: {
      pattern: RegExp("url\\((?:" + t.source + "|[^\n\r()]*)\\)", "i"),
      inside: { function: /^url/i, punctuation: /^\(|\)$/ }
    },
    selector: RegExp("[^{}\\s](?:[^{};\"']|" + t.source + ")*?(?=\\s*\\{)"),
    string: { pattern: t, greedy: !0 },
    property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
    important: /!important\b/i,
    function: /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:,]/
  }),
    (e.languages.css.atrule.inside.rest = e.languages.css);
  var n = e.languages.markup;
  n &&
    (n.tag.addInlined("style", "css"),
    e.languages.insertBefore(
      "inside",
      "attr-value",
      {
        "style-attr": {
          pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
          inside: {
            "attr-name": { pattern: /^\s*style/i, inside: n.tag.inside },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            "attr-value": { pattern: /.+/i, inside: e.languages.css }
          },
          alias: "language-css"
        }
      },
      n.tag
    ));
})(Prism);
Prism.languages.clike = {
  comment: [
    { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0 },
    { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 }
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0
  },
  "class-name": {
    pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
    lookbehind: !0,
    inside: { punctuation: /[.\\]/ }
  },
  keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  boolean: /\b(?:true|false)\b/,
  function: /\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
  punctuation: /[{}[\];(),.:]/
};
(Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [
    Prism.languages.clike["class-name"],
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
      lookbehind: !0
    }
  ],
  keyword: [
    { pattern: /((?:^|})\s*)(?:catch|finally)\b/, lookbehind: !0 },
    {
      pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: !0
    }
  ],
  number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
  function: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
})),
  (Prism.languages.javascript[
    "class-name"
  ][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/),
  Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
      pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,
      lookbehind: !0,
      greedy: !0
    },
    "function-variable": {
      pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
      alias: "function"
    },
    parameter: [
      {
        pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript
      },
      {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
        inside: Prism.languages.javascript
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
      },
      {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
      }
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  }),
  Prism.languages.insertBefore("javascript", "string", {
    "template-string": {
      pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|[^\\`])*`/,
      greedy: !0,
      inside: {
        interpolation: {
          pattern: /\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\${|}$/,
              alias: "punctuation"
            },
            rest: Prism.languages.javascript
          }
        },
        string: /[\s\S]+/
      }
    }
  }),
  Prism.languages.markup &&
    Prism.languages.markup.tag.addInlined("script", "javascript"),
  (Prism.languages.js = Prism.languages.javascript);
("use strict");
function polyfill() {
  var l = window;
  var c = document;
  if (
    "scrollBehavior" in c.documentElement.style &&
    l.__forceSmoothScrollPolyfill__ !== true
  ) {
    return;
  }
  var e = l.HTMLElement || l.Element;
  var o = 468;
  var u = {
    scroll: l.scroll || l.scrollTo,
    scrollBy: l.scrollBy,
    elementScroll: e.prototype.scroll || scrollElement,
    scrollIntoView: e.prototype.scrollIntoView
  };
  var m =
    l.performance && l.performance.now
      ? l.performance.now.bind(l.performance)
      : Date.now;
  function isMicrosoftBrowser(e) {
    var t = ["MSIE ", "Trident/", "Edge/"];
    return new RegExp(t.join("|")).test(e);
  }
  var n = isMicrosoftBrowser(l.navigator.userAgent) ? 1 : 0;
  function scrollElement(e, t) {
    this.scrollLeft = e;
    this.scrollTop = t;
  }
  function ease(e) {
    return 0.5 * (1 - Math.cos(Math.PI * e));
  }
  function shouldBailOut(e) {
    if (
      e === null ||
      typeof e !== "object" ||
      e.behavior === undefined ||
      e.behavior === "auto" ||
      e.behavior === "instant"
    ) {
      return true;
    }
    if (typeof e === "object" && e.behavior === "smooth") {
      return false;
    }
    throw new TypeError(
      "behavior member of ScrollOptions " +
        e.behavior +
        " is not a valid value for enumeration ScrollBehavior."
    );
  }
  function hasScrollableSpace(e, t) {
    if (t === "Y") {
      return e.clientHeight + n < e.scrollHeight;
    }
    if (t === "X") {
      return e.clientWidth + n < e.scrollWidth;
    }
  }
  function canOverflow(e, t) {
    var n = l.getComputedStyle(e, null)["overflow" + t];
    return n === "auto" || n === "scroll";
  }
  function isScrollable(e) {
    var t = hasScrollableSpace(e, "Y") && canOverflow(e, "Y");
    var n = hasScrollableSpace(e, "X") && canOverflow(e, "X");
    return t || n;
  }
  function findScrollableParent(e) {
    while (e !== c.body && isScrollable(e) === false) {
      e = e.parentNode || e.host;
    }
    return e;
  }
  function step(e) {
    var t = m();
    var n;
    var i;
    var r;
    var a = (t - e.startTime) / o;
    a = a > 1 ? 1 : a;
    n = ease(a);
    i = e.startX + (e.x - e.startX) * n;
    r = e.startY + (e.y - e.startY) * n;
    e.method.call(e.scrollable, i, r);
    if (i !== e.x || r !== e.y) {
      l.requestAnimationFrame(step.bind(l, e));
    }
  }
  function smoothScroll(e, t, n) {
    var i;
    var r;
    var a;
    var o;
    var s = m();
    if (e === c.body) {
      i = l;
      r = l.scrollX || l.pageXOffset;
      a = l.scrollY || l.pageYOffset;
      o = u.scroll;
    } else {
      i = e;
      r = e.scrollLeft;
      a = e.scrollTop;
      o = scrollElement;
    }
    step({
      scrollable: i,
      method: o,
      startTime: s,
      startX: r,
      startY: a,
      x: t,
      y: n
    });
  }
  l.scroll = l.scrollTo = function() {
    if (arguments[0] === undefined) {
      return;
    }
    if (shouldBailOut(arguments[0]) === true) {
      u.scroll.call(
        l,
        arguments[0].left !== undefined
          ? arguments[0].left
          : typeof arguments[0] !== "object"
          ? arguments[0]
          : l.scrollX || l.pageXOffset,
        arguments[0].top !== undefined
          ? arguments[0].top
          : arguments[1] !== undefined
          ? arguments[1]
          : l.scrollY || l.pageYOffset
      );
      return;
    }
    smoothScroll.call(
      l,
      c.body,
      arguments[0].left !== undefined
        ? ~~arguments[0].left
        : l.scrollX || l.pageXOffset,
      arguments[0].top !== undefined
        ? ~~arguments[0].top
        : l.scrollY || l.pageYOffset
    );
  };
  l.scrollBy = function() {
    if (arguments[0] === undefined) {
      return;
    }
    if (shouldBailOut(arguments[0])) {
      u.scrollBy.call(
        l,
        arguments[0].left !== undefined
          ? arguments[0].left
          : typeof arguments[0] !== "object"
          ? arguments[0]
          : 0,
        arguments[0].top !== undefined
          ? arguments[0].top
          : arguments[1] !== undefined
          ? arguments[1]
          : 0
      );
      return;
    }
    smoothScroll.call(
      l,
      c.body,
      ~~arguments[0].left + (l.scrollX || l.pageXOffset),
      ~~arguments[0].top + (l.scrollY || l.pageYOffset)
    );
  };
  e.prototype.scroll = e.prototype.scrollTo = function() {
    if (arguments[0] === undefined) {
      return;
    }
    if (shouldBailOut(arguments[0]) === true) {
      if (typeof arguments[0] === "number" && arguments[1] === undefined) {
        throw new SyntaxError("Value could not be converted");
      }
      u.elementScroll.call(
        this,
        arguments[0].left !== undefined
          ? ~~arguments[0].left
          : typeof arguments[0] !== "object"
          ? ~~arguments[0]
          : this.scrollLeft,
        arguments[0].top !== undefined
          ? ~~arguments[0].top
          : arguments[1] !== undefined
          ? ~~arguments[1]
          : this.scrollTop
      );
      return;
    }
    var e = arguments[0].left;
    var t = arguments[0].top;
    smoothScroll.call(
      this,
      this,
      typeof e === "undefined" ? this.scrollLeft : ~~e,
      typeof t === "undefined" ? this.scrollTop : ~~t
    );
  };
  e.prototype.scrollBy = function() {
    if (arguments[0] === undefined) {
      return;
    }
    if (shouldBailOut(arguments[0]) === true) {
      u.elementScroll.call(
        this,
        arguments[0].left !== undefined
          ? ~~arguments[0].left + this.scrollLeft
          : ~~arguments[0] + this.scrollLeft,
        arguments[0].top !== undefined
          ? ~~arguments[0].top + this.scrollTop
          : ~~arguments[1] + this.scrollTop
      );
      return;
    }
    this.scroll({
      left: ~~arguments[0].left + this.scrollLeft,
      top: ~~arguments[0].top + this.scrollTop,
      behavior: arguments[0].behavior
    });
  };
  e.prototype.scrollIntoView = function() {
    if (shouldBailOut(arguments[0]) === true) {
      u.scrollIntoView.call(
        this,
        arguments[0] === undefined ? true : arguments[0]
      );
      return;
    }
    var e = findScrollableParent(this);
    var t = e.getBoundingClientRect();
    var n = this.getBoundingClientRect();
    if (e !== c.body) {
      smoothScroll.call(
        this,
        e,
        e.scrollLeft + n.left - t.left,
        e.scrollTop + n.top - t.top
      );
      if (l.getComputedStyle(e).position !== "fixed") {
        l.scrollBy({ left: t.left, top: t.top, behavior: "smooth" });
      }
    } else {
      l.scrollBy({ left: n.left, top: n.top, behavior: "smooth" });
    }
  };
}
if (typeof exports === "object" && typeof module !== "undefined") {
  module.exports = { polyfill: polyfill };
} else {
  polyfill();
}
var lastTopPos = window.pageYOffset;
var currentTopPos = window.pageYOffset;
var firstScrollHappened = false;
var scrolledDown = false;
var scrolledUp = false;
window.addEventListener("scroll", function(e) {
  if (firstScrollHappened) {
    var t = document.querySelector("#navbar");
    currentTopPos = window.pageYOffset;
    if (currentTopPos < lastTopPos) {
      scrolledDown = false;
      scrolledUp = true;
    } else if (currentTopPos > lastTopPos) {
      scrolledDown = true;
      scrolledUp = false;
    }
    if (!document.querySelector(".nav_items").classList.contains("hamb_on")) {
      if (currentTopPos <= 100) {
        t.classList.remove("off");
      } else {
        if (scrolledUp) {
          t.classList.remove("off");
        } else if (scrolledDown) {
          t.classList.add("off");
        }
      }
    }
  } else {
    firstScrollHappened = true;
  }
  if (homePage) {
    var m = document.querySelector(".get_start_nav");
    var d = document.querySelector(".dl_nav");
    var f = document.querySelector(".doc_nav");
    if (window.pageYOffset < 300) {
      m.classList.add("off");
      d.classList.add("off");
      f.classList.add("off");
    } else {
      m.classList.remove("off");
      d.classList.remove("off");
      f.classList.remove("off");
    }
  }
  lastTopPos = window.pageYOffset;
});
window.addEventListener("resize", function(e) {
  if (window.innerWidth > 900) {
    var t = document.querySelector(".nav_items");
    var n = document.querySelector(".hamburger");
    t.classList.remove("hamb_on");
    n.classList.remove("is-active");
  }
});
("use strict");
window.addEventListener("load", function() {
  var r = document.querySelectorAll(".tab");
  var e = function e(i) {
    r[i].addEventListener("click", function() {
      var e = r[i].parentNode.querySelectorAll(".tab");
      for (var t = 0; t < e.length; t++) {
        e[t].classList.remove("selected");
      }
      r[i].classList.add("selected");
      var n = r[i].parentNode.parentNode;
      if (r[i].textContent.trim().toLowerCase() === "html") {
        n.querySelector(".js_content").classList.add("hide");
        n.querySelector(".html_content").classList.remove("hide");
      } else {
        n.querySelector(".js_content").classList.remove("hide");
        n.querySelector(".html_content").classList.add("hide");
      }
    });
  };
  for (var t = 0; t < r.length; t++) {
    e(t);
  }
});
("use strict");
window.addEventListener("load", function() {
  var t = document.querySelector(".hamburger");
  t.addEventListener("click", function() {
    var e = document.querySelector(".nav_items");
    e.classList.toggle("hamb_on");
    t.classList.toggle("is-active");
  });
  var e = document.querySelectorAll(".nav_item");
  for (var n = 0; n < e.length; n++) {
    e[n].addEventListener("click", function() {
      var e = document.querySelector(".nav_items");
      e.classList.remove("hamb_on");
      e.classList.add("hamb_off");
      t.classList.toggle("is-active");
    });
  }
});
