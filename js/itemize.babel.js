"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
 -- itemize.js v1.0.8 --
 -- (c) 2019 Kosmoon --
 -- Released under the MIT license --
 */
if (typeof Object.assign != "function") {
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) {
      if (target == null) {
        throw new TypeError("Cannot convert undefined or null to object");
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }

      return to;
    },
    writable: true,
    configurable: true
  });
}

var Itemize =
/*#__PURE__*/
function () {
  function Itemize(options) {
    _classCallCheck(this, Itemize);

    this.containers = [];
    this.items = [];
    this.globalOptions = this.mergeOptions(options);
    this.notificationNbs = {};
    this.modalDisappearTimeout = null;
    this.elPos = {};
    this.flipPlayId = "";
    this.elemToRemove = [];
    this.draggedEl = null;
    this.lastTargetedContainers = null;
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; // let optionCheckResult = this.optionsTypeCheck(this.globalOptions);
    // if (optionCheckResult !== "valid") {
    //   console.error("- Itemize - TYPE error:\n" + optionCheckResult);
    // }
  }

  _createClass(Itemize, [{
    key: "apply",
    value: function apply(target, options) {
      var _this2 = this;

      var opts = _objectSpread({}, this.globalOptions);

      if (_typeof(target) === "object") {
        opts = this.mergeOptions(target);
        target = [null];
      } else {
        target = [target];
      }

      if (options) {
        opts = this.mergeOptions(options);
      }

      var childItemizedNb = 0;

      for (var i = 0; i < target.length; i++) {
        this.lastTargetedContainers = this.getTargetElements(target[i]);

        if (this.lastTargetedContainers && this.lastTargetedContainers.length > 0) {
          (function () {
            childItemizedNb += _this2.applyItemize(_this2.lastTargetedContainers, opts);

            var nestingApply = function nestingApply(containers, nestingLevel) {
              var nestingNb = 1;

              if (containers.length > 0 && nestingNb < nestingLevel) {
                for (var _i = 0; _i < containers.length; _i++) {
                  childItemizedNb += _this2.applyItemize(containers[_i].children, opts);
                  nestingNb++;

                  if (containers.length > 0 && nestingNb < nestingLevel) {
                    nestingApply(containers[_i].children, nestingLevel);
                  }
                }
              }
            };

            nestingApply(_this2.lastTargetedContainers, opts.nestingLevel);
          })();
        } else {
          console.error(" - Itemize error - \n no valid target found.\n");
        }
      } // console.log(
      //   "%c" + childItemizedNb + " element(s) itemized",
      //   "background: #060606; color:#1FEA00;padding:10px"
      // );


      return childItemizedNb + " element(s) itemized";
    }
  }, {
    key: "cancel",
    value: function cancel(target) {
      var unItemizedNb = 0;

      if (target) {
        if (!Array.isArray(target)) {
          target = [target];
        }

        for (var i = 0; i < target.length; i++) {
          this.lastTargetedContainers = this.getTargetElements(target[i]);

          if (this.lastTargetedContainers && this.lastTargetedContainers.length > 0) {
            unItemizedNb += this.cancelItemize(this.lastTargetedContainers);
          } else {
            console.error(" - Itemize error - \n " + target[i] + " not found.\n");
          }
        }
      } else {
        this.clearObservers();
        unItemizedNb = this.cancelItemize("all");
      }

      return unItemizedNb + " element(s) unitemized";
    }
  }, {
    key: "getTargetElements",
    value: function getTargetElements(target) {
      try {
        if (!target) {
          return document.querySelectorAll("[itemize]");
        } else {
          return document.querySelectorAll(target);
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  }, {
    key: "clearObservers",
    value: function clearObservers(parentId) {
      if (window.itemizeObservers) {
        for (var i = window.itemizeObservers.length - 1; i >= 0; i--) {
          var disconnect = false;

          if (parentId) {
            if (window.itemizeObservers[i].itemizeContainerId === parentId) {
              disconnect = true;
            }
          } else {
            disconnect = true;
          }

          if (disconnect) {
            window.itemizeObservers[i].disconnect();
            window.itemizeObservers.splice(i, 1);
          }
        }
      }
    }
  }, {
    key: "applyItemize",
    value: function applyItemize(parents, applyOptions) {
      var _this3 = this;

      var childItemizedNb = 0;
      var knownErrors = "";

      try {
        var _loop = function _loop(i) {
          var parent = parents[i];

          if (!parent.classList.contains("itemize_remove_btn") && parent.type !== "text/css" && parent.tagName !== "BR" && parent.tagName !== "SCRIPT" && parent.tagName !== "STYLE") {
            var parentInList = false;

            for (var p = 0; p < _this3.containers.length; p++) {
              if (parent.itemizeContainerId && parent.itemizeContainerId === _this3.containers[p].itemizeContainerId) {
                parentInList = true;
                break;
              }
            }

            if (!parentInList) {
              _this3.containers.push(parent);
            }

            if (parent.itemizeContainerId) {
              _this3.clearObservers(parent.itemizeContainerId);
            }

            var parentItemizeId = _this3.makeId(8);

            parent.itemizeContainerId = parentItemizeId;

            for (var _i2 = parent.classList.length - 1; _i2 >= 0; _i2--) {
              // cleaning parent of itemize_parent_xxxx classes
              if (parent.classList[_i2].indexOf("itemize_parent") !== -1) {
                parent.classList.remove(parent.classList[_i2]);
                break;
              }
            }

            parent.classList.add("itmz_parent");
            parent.classList.add("itemize_parent_".concat(parentItemizeId));

            var options = _objectSpread({}, _this3.globalOptions); // cloning options


            if (applyOptions) {
              options = _this3.mergeOptions(applyOptions);
            }

            options = _this3.getOptionsFromAttributes(parent, options);
            parent.itemizeOptions = options; // node added OBSERVER

            if (parent.itemizeOptions.itemizeAddedElement) {
              var config = {
                childList: true
              };
              var scope = _this3;

              var callback = function callback(mutationsList, observer) {
                for (var z = 0; z < mutationsList.length; z++) {
                  var mutation = mutationsList[z];

                  if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    for (var x = 0; x < mutation.addedNodes.length; x++) {
                      var node = mutation.addedNodes[x];
                      var newNode = true;

                      if (node.classList) {
                        for (var y = 0; y < node.classList.length; y++) {
                          if (node.classList[y].indexOf("itemize_") !== -1) {
                            // check si le child n'est pas un element deja added qui passe par un flipAnim
                            newNode = false;
                          }
                        }

                        if (newNode) {
                          if (!node.getAttribute("notitemize") && node.parentElement && node.type !== "text/css" && node.tagName !== "BR" && node.tagName !== "SCRIPT" && node.parentElement.itemizeContainerId && node.tagName !== "STYLE") {
                            if (node.parentElement.itemizeOptions && node.parentElement.itemizeOptions.anim) {
                              node.classList.add("itemize_hide");
                              scope.itemizeChild(node, node.parentElement, true);
                              scope.flipRead(scope.items);
                              scope.flipAdd(node);
                              scope.flipPlay(scope.items, node.parentElement.itemizeOptions.animDuration);
                            } else {
                              scope.itemizeChild(node, node.parentElement, true);
                            }
                          }

                          if (parent.itemizeOptions.onAddItem) {
                            parent.itemizeOptions.onAddItem(node);
                          }
                        }
                      }
                    }
                  }
                }
              };

              if (window.itemizeObservers) {
                // ajout des observer de facon global et suppression/deconnection quand parent n'est plus present
                window.itemizeObservers.push(new MutationObserver(callback));
              } else {
                window.itemizeObservers = [new MutationObserver(callback)];
              }

              window.itemizeObservers[window.itemizeObservers.length - 1].observe(parent, config);
              window.itemizeObservers[window.itemizeObservers.length - 1].itemizeContainerId = parent.itemizeContainerId;
            }

            _this3.applyCss(parent);

            for (var z = 0; z < parent.children.length; z++) {
              var child = parent.children[z];

              if (_this3.itemizeChild(child, parent)) {
                childItemizedNb++;
              }
            }
          }
        };

        for (var i = 0; i < parents.length; i++) {
          _loop(i);
        }

        return childItemizedNb;
      } catch (error) {
        console.error(" - Itemize error - \n" + knownErrors);
        console.error(error);
      }
    }
  }, {
    key: "childIsItemizable",
    value: function childIsItemizable(child, parent) {
      return child.type !== "text/css" && typeof child.getAttribute("notitemize") !== "string" && child.tagName !== "BR" && child.tagName !== "SCRIPT" && !child.itemizeItemId && !child.itemizeBtn && !child.classList.contains("itemize_remove_btn") && !(parent.parentNode.itemizeOptions && child.classList.contains(parent.parentNode.itemizeOptions.removeBtnClass));
    }
  }, {
    key: "itemizeChild",
    value: function itemizeChild(child, parent, fromObserver) {
      var _this4 = this;

      if (this.childIsItemizable(child, parent)) {
        child.itemizeItemId = this.makeId(8);
        this.items.push(child);

        if (parent.itemizeItems) {
          parent.itemizeItems.push(child);
        } else {
          parent.itemizeItems = [child];
        }

        child.classList.add("itemize_item_" + child.itemizeItemId);
        child.classList.add("itmz_item");

        if (!parent.itemizeOptions.removeBtn) {
          child.onclick = function (e) {
            e.stopPropagation();

            if (parent.itemizeOptions.modalConfirm) {
              _this4.modalConfirm(child);
            } else {
              _this4.remove(child.itemizeItemId);
            }
          };

          if (parent.itemizeOptions.outlineItemOnHover) {
            this.shadowOnHover(child, false);
          }
        } else {
          if (!parent.itemizeOptions.removeBtnClass) {
            var computedStyle = getComputedStyle(child);

            if (child.style.position !== "absolute" && child.style.position !== "fixed" && computedStyle.position !== "absolute" && computedStyle.position !== "fixed") {
              child.style.position = "relative";
            }

            var button = document.createElement("div");
            button.classList.add("itemize_btn_" + child.itemizeItemId);
            button.classList.add("itemize_remove_btn");
            button.itemizeBtn = true;

            button.onclick = function (e) {
              e.stopPropagation();

              if (parent.itemizeOptions.modalConfirm) {
                _this4.modalConfirm(child);
              } else {
                _this4.remove(child.itemizeItemId);
              }
            };

            child.appendChild(button);

            if (parent.itemizeOptions.outlineItemOnHover) {
              this.shadowOnHover(button, true);
            }
          } else {
            var _button = document.querySelector(".itemize_item_" + child.itemizeItemId + " ." + parent.itemizeOptions.removeBtnClass);

            if (!_button) {
              console.error(" - Itemize error - \n Cannot find specified button's class: " + parent.itemizeOptions.removeBtnClass + "\n");
            } else {
              _button.onclick = function (e) {
                e.stopPropagation();

                if (parent.itemizeOptions.modalConfirm) {
                  _this4.modalConfirm(child);
                } else {
                  _this4.remove(child.itemizeItemId);
                }
              };

              if (parent.itemizeOptions.outlineItemOnHover) {
                this.shadowOnHover(_button, true);
              }
            }
          }
        }

        if (parent.itemizeOptions.dragAndDrop) {
          child.setAttribute("draggable", "true");
          child.style.cursor = "move";
          child.addEventListener("dragstart", function (event) {
            event.stopPropagation();
            _this4.draggedEl = child;

            if (!child.opacityBeforeDrag) {
              child.opacityBeforeDrag = getComputedStyle(child).opacity;
            }

            if (!child.inFlipAnim) {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("Text", "");
            }

            return true;
          });
          child.addEventListener("dragend", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (_this4.draggedEl) {
              if (_this4.draggedEl.opacityBeforeDrag) {
                _this4.draggedEl.style.opacity = _this4.draggedEl.opacityBeforeDrag;
              }

              _this4.draggedEl = null;
            }

            return true;
          });
          child.addEventListener("drag", function (event) {
            return true;
          });
          child.addEventListener("dragover", function (event) {
            event.preventDefault();

            if (_this4.draggedEl && !child.inFlipAnim) {
              if (_this4.draggedEl.parentNode === child.parentNode && !_this4.draggedEl.inFlipAnim && _this4.draggedEl.parentNode.itemizeItems) {
                _this4.draggedEl.style.opacity = "0.6";

                _this4.flipRead(_this4.draggedEl.parentNode.itemizeItems);

                var draggedElNodeIndex = Array.prototype.indexOf.call(_this4.draggedEl.parentNode.children, _this4.draggedEl);
                var draggedOnNodeIndex = Array.prototype.indexOf.call(_this4.draggedEl.parentNode.children, child);

                if (draggedElNodeIndex < draggedOnNodeIndex) {
                  if (child.nextElementSibling && child.nextElementSibling.itemizeItemId) {
                    _this4.draggedEl.parentNode.insertBefore(_this4.draggedEl, child.nextElementSibling);
                  } else if (!child.nextElementSibling || !child.nextElementSibling.itemizeItemId) {
                    var temp = document.createElement("div");
                    temp.setAttribute("notitemize", "");

                    _this4.draggedEl.parentNode.insertBefore(temp, child);

                    _this4.draggedEl.parentNode.insertBefore(child, temp);

                    _this4.draggedEl.parentNode.insertBefore(_this4.draggedEl, temp);

                    _this4.draggedEl.parentNode.removeChild(temp);
                  }
                } else if (draggedElNodeIndex > draggedOnNodeIndex) {
                  _this4.draggedEl.parentNode.insertBefore(_this4.draggedEl, child);
                }

                _this4.flipPlay(_this4.draggedEl.parentNode.itemizeItems, 250, true);
              }
            }

            return false;
          });
          child.addEventListener("dragenter", function (event) {
            event.preventDefault();
            return false;
          });
          child.addEventListener("dragleave", function (event) {
            event.preventDefault();
            return false;
          });
          child.addEventListener("drop", function (event) {
            event.preventDefault();

            if (_this4.draggedEl && _this4.draggedEl.opacityBeforeDrag) {
              _this4.draggedEl.style.opacity = _this4.draggedEl.opacityBeforeDrag;
            }

            return false;
          });
        }

        if (fromObserver) {
          this.showNotification("added", child);
        }

        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "shadowOnHover",
    value: function shadowOnHover(elem, isRemoveBtn) {
      var parent = null;

      if (isRemoveBtn) {
        parent = elem.parentElement;
      } else {
        parent = elem;
      }

      if (parent) {
        elem.parentShadowStyle = parent.style.boxShadow;
      }

      elem.onmouseenter = function (e) {
        if (parent) {
          parent.style.boxShadow = "inset 0px 0px 0px 3px rgba(15,179,0,1)";
        }
      };

      elem.onmouseleave = function (e) {
        if (parent) {
          parent.style.boxShadow = elem.parentShadowStyle;
        }
      };
    }
  }, {
    key: "applyCss",
    value: function applyCss(parent) {
      var options = parent.itemizeOptions;
      var oldStyle = parent.querySelector(".itemize_style");

      if (oldStyle) {
        oldStyle.parentNode.removeChild(oldStyle);
      }

      var css = document.createElement("style");
      css.classList.add("itemize_style");
      css.type = "text/css";
      var styles = ""; // parent global styles

      styles += ".itemize_parent_".concat(parent.itemizeContainerId, " .itemize_hide{display:none}"); // remove btn styles

      if (options.removeBtn && !options.removeBtnClass) {
        var btnMargin = options.removeBtnMargin + "px";
        var btnPos = {
          top: 0,
          right: 0,
          bottom: "auto",
          left: "auto",
          marginTop: btnMargin,
          marginRight: btnMargin,
          marginBottom: "0px",
          marginLeft: "0px",
          transform: "none"
        };

        switch (options.removeBtnPosition) {
          case "center-right":
            btnPos.top = "50%";
            btnPos.marginTop = "0px";
            btnPos.transform = "translateY(-50%)";
            break;

          case "bottom-right":
            btnPos.top = "auto";
            btnPos.bottom = 0;
            btnPos.marginTop = "0px";
            btnPos.marginBottom = btnMargin;
            break;

          case "bottom-center":
            btnPos.top = "auto";
            btnPos.right = "auto";
            btnPos.bottom = 0;
            btnPos.left = "50%";
            btnPos.marginTop = "0px";
            btnPos.marginRight = "0px";
            btnPos.marginBottom = btnMargin;
            btnPos.transform = "translateX(-50%)";
            break;

          case "bottom-left":
            btnPos.top = "auto";
            btnPos.right = "auto";
            btnPos.bottom = 0;
            btnPos.left = 0;
            btnPos.marginTop = "0px";
            btnPos.marginRight = "0px";
            btnPos.marginBottom = btnMargin;
            btnPos.marginLeft = btnMargin;
            break;

          case "center-left":
            btnPos.top = "50%";
            btnPos.right = "auto";
            btnPos.left = 0;
            btnPos.marginTop = "0px";
            btnPos.marginRight = "0px";
            btnPos.marginLeft = btnMargin;
            btnPos.transform = "translateY(-50%)";
            break;

          case "top-left":
            btnPos.right = "auto";
            btnPos.left = 0;
            btnPos.marginRight = "0px";
            btnPos.marginLeft = btnMargin;
            break;

          case "top-center":
            btnPos.right = "auto";
            btnPos.left = "50%";
            btnPos.marginRight = "0px";
            btnPos.marginTop = btnMargin;
            btnPos.transform = "translateX(-50%)";
            break;

          default:
            break;
        }

        styles += ".itemize_parent_".concat(parent.itemizeContainerId, " .itemize_remove_btn{position:absolute;top:").concat(btnPos.top, "!important;right:").concat(btnPos.right, "!important;bottom:").concat(btnPos.bottom, "!important;left:").concat(btnPos.left, "!important;width:").concat(options.removeBtnWidth, "px!important;height:").concat(options.removeBtnWidth, "px!important;overflow:hidden;cursor:pointer;margin:").concat(btnPos.marginTop, " ").concat(btnPos.marginRight, " ").concat(btnPos.marginBottom, " ").concat(btnPos.marginLeft, ";transform:").concat(btnPos.transform, ";border-radius:").concat(options.removeBtnCircle ? "50%" : "0%", ";background-color:").concat(options.removeBtnBgColor, "}.itemize_remove_btn:hover{background-color:").concat(options.removeBtnBgHoverColor, "}.itemize_parent_").concat(parent.itemizeContainerId, " .itemize_remove_btn:hover::after,.itemize_parent_").concat(parent.itemizeContainerId, " .itemize_remove_btn:hover::before{transition:background 150ms ease-in-out;background:").concat(options.removeBtnHoverColor, "}.itemize_parent_").concat(parent.itemizeContainerId, " .itemize_remove_btn::after,.itemize_parent_").concat(parent.itemizeContainerId, " .itemize_remove_btn::before{content:'';position:absolute;height:").concat(options.removeBtnThickness, "px;transition:background 150ms ease-in-out;width:").concat(options.removeBtnWidth / 2, "px;top:50%;left:25%;margin-top:").concat(options.removeBtnThickness * 0.5 < 1 ? -1 : -options.removeBtnThickness * 0.5, "px;background:").concat(options.removeBtnColor, ";border-radius:").concat(options.removeBtnSharpness, "}.itemize_parent_").concat(parent.itemizeContainerId, " .itemize_remove_btn::before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.itemize_parent_").concat(parent.itemizeContainerId, " .itemize_remove_btn::after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}");
      }

      if (css.styleSheet) {
        css.styleSheet.cssText = styles;
      } else {
        css.appendChild(document.createTextNode(styles));
      }

      parent.appendChild(css);
    }
  }, {
    key: "cancelItemize",
    value: function cancelItemize(targets) {
      var unItemizedNb = 0;

      try {
        var parentTargets = [];

        if (targets === "all") {
          parentTargets = this.containers.splice(0); // cloning
        } else {
          parentTargets = targets;
        }

        for (var z = 0; z < parentTargets.length; z++) {
          var parent = parentTargets[z];
          var targetItems = parent.querySelectorAll(".itmz_item");

          for (var j = 0; j < targetItems.length; j++) {
            if (targetItems[j].itemizeContainerId) {
              this.clearObservers(targetItems[j].itemizeContainerId);
            }

            if (targetItems[j].itemizeItemId) {
              this.cancelItemizeChild(targetItems[j], targetItems[j].parentNode);
              unItemizedNb++;
            }
          }

          if (parent.itemizeContainerId) {
            this.clearObservers(parent.itemizeContainerId);

            for (var k = parent.classList.length - 1; k >= 0; k--) {
              if (parent.classList[k].indexOf("itemize_parent") !== -1) {
                parent.classList.remove(parent.classList[k]);
                parent.classList.remove("itmz_parent");
                break;
              }
            }

            var parentsInParent = parent.querySelectorAll(".itmz_parent");

            for (var v = 0; v < parentsInParent.length; v++) {
              this.cancelItemize(parentsInParent[v]);
            }

            parent.itemizeContainerId = null;
            parent.itemizeOptions = null;

            for (var i = 0; i < this.containers.length; i++) {
              if (this.containers[i] === parent) {
                this.containers.splice(i, 1);
                break;
              }
            }
          }
        }

        return unItemizedNb;
      } catch (err) {
        console.error(err);
      }
    }
  }, {
    key: "cancelItemizeChild",
    value: function cancelItemizeChild(child, parent) {
      for (var r = this.items.length - 1; r >= 0; r--) {
        if (this.items[r] === child) {
          this.cleanItem(this.items[r]);
          this.items.splice(r, 1);
          break;
        }
      }

      if (!parent.itemizeOptions.removeBtn) {
        child.onclick = null;
      } else {
        if (!parent.itemizeOptions.removeBtnClass) {
          var btn = child.querySelector(".itemize_remove_btn");

          if (btn) {
            btn.parentNode.removeChild(btn);
          }
        } else {
          var button = child.querySelector("." + parent.itemizeOptions.removeBtnClass);

          if (button) {
            button.onclick = null;
          }
        }
      }

      var oldStyle = parent.querySelector(".itemize_style");

      if (oldStyle) {
        oldStyle.parentNode.removeChild(oldStyle);
      }

      for (var s = child.classList.length - 1; s >= 0; s--) {
        if (child.classList[s].indexOf("itemize_item_") !== -1) {
          child.classList.remove(child.classList[s]);
          break;
        }
      }

      child.itemizeItemId = null;
    }
  }, {
    key: "modalConfirm",
    value: function modalConfirm(el) {
      var _this5 = this;

      try {
        var modalAnimDuration = 150;
        var backDrop = document.createElement("div");
        var modal = document.createElement("div");
        var notificationText = document.createElement("div");
        var btnContainer = document.createElement("div");
        var btnConfirm = document.createElement("button");
        var btnCancel = document.createElement("button");
        var crossClose = document.createElement("div");
        var body = document.querySelector("body"); // const bodyInitialOverflow = body.style.overflow;
        // body.style.overflow = "hidden";

        backDrop.classList.add("itemize_modal_backdrop");
        modal.classList.add("itemize_modal");
        notificationText.classList.add("itemize_modal_text");
        btnConfirm.classList.add("itemize_modal_btnConfirm");
        btnCancel.classList.add("itemize_modal_btnCancel");
        crossClose.classList.add("itemize_modal_cross");
        notificationText.textContent = el.parentElement.itemizeOptions.modalText;
        btnConfirm.innerHTML = "Yes";
        btnCancel.innerHTML = "Cancel";
        btnContainer.appendChild(btnCancel);
        btnContainer.appendChild(btnConfirm);
        modal.appendChild(notificationText);
        modal.appendChild(btnContainer);
        modal.appendChild(crossClose);

        var hideModal = function hideModal(bdy, bckdrop, mdal) {
          bckdrop.onclick = null;
          mdal.onclick = null;

          if (bckdrop.animate) {
            bckdrop.animate([{
              opacity: 1
            }, {
              opacity: 0
            }], {
              duration: modalAnimDuration,
              easing: "ease-in-out",
              fill: "both"
            });
          } else {
            _this5.animateRAF(bckdrop, [{
              opacity: 1
            }], [{
              opacity: 0
            }], modalAnimDuration);
          }

          if (mdal.animate) {
            mdal.animate([{
              opacity: 1,
              transform: "translateY(-50%) translateX(-50%)"
            }, {
              opacity: 0,
              transform: "translateY(0%) translateX(-50%)"
            }], {
              duration: modalAnimDuration,
              easing: "ease-in-out",
              fill: "both"
            });
          } else {
            _this5.animateRAF(mdal, [{
              opacity: 1,
              transform: {
                translateX: -50,
                translateY: -50,
                unit: "%"
              }
            }], [{
              opacity: 0,
              transform: {
                translateX: -50,
                translateY: 0,
                unit: "%"
              }
            }], modalAnimDuration);
          }

          clearTimeout(_this5.modalDisappearTimeout);
          _this5.modalDisappearTimeout = setTimeout(function () {
            bdy.removeChild(bckdrop);
            bdy.removeChild(mdal); // bdy.style.overflow = bodyInitialOverflow;
          }, modalAnimDuration);
        };

        backDrop.onclick = function () {
          if (!backDrop.hiding) {
            hideModal(body, backDrop, modal);
          }

          backDrop.hiding = true;
        };

        btnCancel.onclick = function () {
          if (!btnCancel.clicked) {
            hideModal(body, backDrop, modal);
          }

          btnCancel.clicked = true;
        };

        btnConfirm.onclick = function () {
          if (!btnConfirm.clicked) {
            hideModal(body, backDrop, modal);

            _this5.remove(el);
          }

          btnConfirm.clicked = true;
        };

        crossClose.onclick = function () {
          if (!crossClose.clicked) {
            hideModal(body, backDrop, modal);
          }

          crossClose.clicked = true;
        };

        Object.assign(modal.style, {
          all: "none",
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
          zIndex: 100000000
        });
        var modalCss = ".itemize_modal_btnConfirm:hover{ background-color: #c83e34 !important; transition: background-color 0.3s ease-in-out }.itemize_modal_btnCancel:hover{ background-color: #4a5055 !important; transition: background-color 0.3s ease-in-out }.itemize_modal_cross {cursor:pointer;position: absolute;right: 5px;top: 5px;width: 18px;height:18px;opacity:0.3;}.itemize_modal_cross:hover{opacity:1;}.itemize_modal_cross:before,.itemize_modal_cross:after{position:absolute;left:9px;content:' ';height: 19px;width:2px;background-color:#333;}.itemize_modal_cross:before{transform:rotate(45deg);}.itemize_modal_cross:after{transform:rotate(-45deg);}";
        var styleEl = document.createElement("style");

        if (styleEl.styleSheet) {
          styleEl.styleSheet.cssText = modalCss;
        } else {
          styleEl.appendChild(document.createTextNode(modalCss));
        }

        modal.appendChild(styleEl);
        Object.assign(notificationText.style, {
          all: "none",
          marginBottom: "25px",
          fontSize: "16px"
        });
        Object.assign(btnContainer.style, {
          width: "100%",
          display: "flex"
        });
        Object.assign(btnCancel.style, {
          all: "none",
          fontSize: "14px",
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
        Object.assign(btnConfirm.style, {
          all: "none",
          fontSize: "14px",
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
        Object.assign(backDrop.style, {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0,0.7)",
          zIndex: 10000000
        });
        body.insertBefore(modal, body.childNodes[0]);
        body.insertBefore(backDrop, body.childNodes[0]);

        if (backDrop.animate) {
          backDrop.animate([{
            opacity: 0
          }, {
            opacity: 1
          }], {
            duration: 300,
            easing: "ease-out",
            fill: "both"
          });
        } else {
          this.animateRAF(backDrop, [{
            opacity: 0
          }], [{
            opacity: 1
          }], modalAnimDuration);
        }

        if (modal.animate) {
          modal.animate([{
            opacity: 0,
            transform: "translateY(-100%) translateX(-50%)"
          }, {
            opacity: 1,
            transform: "translateY(-50%) translateX(-50%)"
          }], {
            duration: modalAnimDuration,
            easing: "ease-in",
            fill: "both"
          });
        } else {
          this.animateRAF(modal, [{
            opacity: 0,
            transform: {
              translateX: -50,
              translateY: -100,
              unit: "%"
            }
          }], [{
            opacity: 1,
            transform: {
              translateX: -50,
              translateY: -50,
              unit: "%"
            }
          }], modalAnimDuration);
        }
      } catch (error) {
        console.error(" - Itemize error - \n" + error);
      }
    }
  }, {
    key: "showNotification",
    value: function showNotification(action, element) {
      var _this6 = this;

      if (element.parentElement.itemizeOptions.showAddNotifications && action === "added" || element.parentElement.itemizeOptions.showRemoveNotifications && action === "removed") {
        var notificationClassName = "";
        var notificationTextClassName = "";
        var notificationBackground = "";
        var notificationTimerColor = "";
        var notificationTextContent = "";
        var notificationLeftPos = "";
        var notificationTopPos = "";
        var notificationTranslateX = "";
        var minusOrNothing = "-";
        var notificationIsTop = false;
        var notificationTimerDuration = element.parentElement.itemizeOptions.notificationTimer;
        var notifPos = element.parentElement.itemizeOptions.notificationPosition;

        if (notifPos === "bottom-center") {
          notificationLeftPos = "50%";
          notificationTopPos = "100%";
          notificationTranslateX = "-50%";
        } else if (notifPos === "bottom-right") {
          notificationLeftPos = "100%";
          notificationTopPos = "100%";
          notificationTranslateX = "-100%";
        } else if (notifPos === "bottom-left") {
          notificationLeftPos = "0%";
          notificationTopPos = "100%";
          notificationTranslateX = "0%";
        } else if (notifPos === "top-center") {
          notificationLeftPos = "50%";
          notificationTopPos = "0%";
          notificationTranslateX = "-50%";
          minusOrNothing = "";
          notificationIsTop = true;
        } else if (notifPos === "top-right") {
          notificationLeftPos = "100%";
          notificationTopPos = "0%";
          notificationTranslateX = "-100%";
          minusOrNothing = "";
          notificationIsTop = true;
        } else if (notifPos === "top-left") {
          notificationLeftPos = "0%";
          notificationTopPos = "0%";
          notificationTranslateX = "0%";
          minusOrNothing = "";
          notificationIsTop = true;
        }

        if (action === "removed") {
          notificationClassName = "itemize_remove_notification";
          notificationTextClassName = "itemize_remove_notification_text";
          notificationBackground = "#BD5B5B";
          notificationTimerColor = "#DEADAD";
          notificationTextContent = element.parentElement.itemizeOptions.removeNotificationText;
        } else if (action === "added") {
          notificationClassName = "itemize_add_notification";
          notificationTextClassName = "itemize_add_notification_text";
          notificationBackground = "#00AF66";
          notificationTimerColor = "#80D7B3";
          notificationTextContent = element.parentElement.itemizeOptions.addNotificationText;
        }

        if (this.notificationNbs[notifPos]) {
          this.notificationNbs[notifPos]++;
        } else {
          this.notificationNbs[notifPos] = 1;
        }

        var popNotification = document.createElement("div");
        popNotification.notificationId = this.notificationNbs[notifPos];
        var notificationTimer = document.createElement("div");
        var notificationText = document.createElement("div");
        popNotification.classList.add(notificationClassName);
        popNotification.classList.add("itemize_notification_" + notifPos);
        notificationText.classList.add(notificationTextClassName);
        notificationText.textContent = notificationTextContent;
        Object.assign(notificationText.style, {
          all: "none",
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          textAlign: "center",
          whiteSpace: "nowrap",
          padding: "10px 15px 10px 15px",
          fontSize: "16px",
          fontWeight: "normal"
        });
        Object.assign(notificationTimer.style, {
          background: notificationTimerColor,
          width: "100%",
          height: "5px"
        });
        Object.assign(popNotification.style, {
          boxSizing: "border-box",
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          top: notificationTopPos,
          left: notificationLeftPos,
          border: "solid 1px " + notificationTimerColor,
          borderRadius: "4px",
          transform: "translate(".concat(notificationTranslateX, ", ").concat(minusOrNothing).concat(this.notificationNbs[notifPos] * 100 - (notificationIsTop ? 100 : 0), "%)"),
          fontFamily: "helvetica",
          background: notificationBackground,
          color: "#FFFFFF",
          zIndex: 100000000
        });
        document.querySelector("body").appendChild(popNotification);
        popNotification.appendChild(notificationTimer);
        popNotification.appendChild(notificationText);

        if (popNotification.animate) {
          popNotification.animate([{
            opacity: 0
          }, {
            opacity: 1
          }], {
            duration: 300,
            easing: "linear",
            fill: "both"
          });
        } else {
          this.animateRAF(popNotification, [{
            opacity: 0
          }], [{
            opacity: 1
          }], 300);
        }

        if (notificationTimer.animate) {
          notificationTimer.animate([{
            width: "100%"
          }, {
            width: "0%"
          }], {
            duration: notificationTimerDuration,
            easing: "linear",
            fill: "both"
          });
        } else {
          this.animateRAF(notificationTimer, [{
            width: {
              value: 100,
              unit: "%"
            }
          }], [{
            width: {
              value: 0,
              unit: "%"
            }
          }], notificationTimerDuration);
        }

        setTimeout(function () {
          var notificationList = document.querySelectorAll(".itemize_notification_" + notifPos);

          for (var i = 0; i < notificationList.length; i++) {
            if (notificationList[i].notificationId > 0) {
              var translateYStart = parseInt("".concat(minusOrNothing).concat(notificationList[i].notificationId * 100 - (notificationIsTop ? 100 : 0)));
              var translateYEnd = parseInt("".concat(minusOrNothing).concat(notificationList[i].notificationId * 100 - (notificationIsTop ? 100 : 0) - 100));

              if (notificationList[i].animate) {
                notificationList[i].animate([{
                  transform: "translate(".concat(notificationTranslateX, ", ").concat(translateYStart, "%)")
                }, {
                  transform: "translate(".concat(notificationTranslateX, ", ").concat(translateYEnd, "%)")
                }], {
                  duration: 150,
                  easing: "ease-in-out",
                  fill: "both"
                });
              } else {
                _this6.animateRAF(notificationList[i], [{
                  transform: {
                    translateX: parseInt(notificationTranslateX),
                    translateY: translateYStart,
                    unit: "%"
                  }
                }], [{
                  transform: {
                    translateX: parseInt(notificationTranslateX),
                    translateY: translateYEnd,
                    unit: "%"
                  }
                }], 150);
              }

              notificationList[i].notificationId--;
            }
          }

          _this6.notificationNbs[notifPos]--;
          setTimeout(function () {
            document.querySelector("body").removeChild(popNotification);
          }, 300);
        }, notificationTimerDuration);
      }
    }
  }, {
    key: "remove",
    value: function remove(el) {
      var _this7 = this;

      try {
        var item = null;

        if (typeof el === "string") {
          for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].itemizeItemId === el) {
              item = this.items[i];
              item.arrayPosition = i;
            }
          }

          if (!item) {
            item = document.querySelector(el);

            if (!item || !item.itemizeItemId) {
              throw new Error(" - Itemize error - \nNot a valid Itemize element");
            }

            for (var _i3 = 0; _i3 < this.items.length; _i3++) {
              if (this.items[_i3].itemizeItemId === item.itemizeItemId) {
                item.arrayPosition = _i3;
              }
            }
          }

          if (!item) {
            throw new Error(" - Itemize error - \nNo item found to remove");
          }
        } else {
          item = el;

          if (!item) {
            throw new Error(" - Itemize error - \nNo item found to remove");
          }

          if (!item.itemizeItemId) {
            throw new Error(" - Itemize error - \nNot a valid Itemize element");
          }

          for (var _i4 = 0; _i4 < this.items.length; _i4++) {
            if (item.itemizeItemId === this.items[_i4].itemizeItemId) {
              item.arrayPosition = _i4;
            }
          }
        }

        if ((item.arrayPosition || item.arrayPosition === 0) && item.parentElement && item.parentElement.itemizeOptions) {
          if ((!item.removeStatus || item.removeStatus !== "pending") && !item.inFlipAnim) {
            if (item.parentElement.itemizeOptions.beforeRemove) {
              item.removeStatus = "pending";
              var confirmRemove = item.parentElement.itemizeOptions.beforeRemove(item);

              if (confirmRemove === undefined) {
                item.removeStatus = null;
                throw new Error(' - Itemize error - \n The function "beforeRemove" must return a Boolean or a Promise');
              }

              if (typeof confirmRemove.then === "function") {
                var animDuration = item.parentElement.itemizeOptions.animDuration;
                var onClickFn = item.onclick;
                item.onclick = null;
                confirmRemove.then(function (response) {
                  if (item.parentElement.itemizeOptions.anim) {
                    var closeBtn = item.querySelector(".itemize_remove_btn");

                    if (closeBtn) {
                      closeBtn.onclick = null;
                    } else {
                      closeBtn = item.querySelector("." + _this7.globalOptions.removeBtnClass);

                      if (closeBtn) {
                        closeBtn.onclick = null;
                      }
                    }

                    _this7.showNotification("removed", item);

                    _this7.flipRemove(item);

                    _this7.items.splice(item.arrayPosition, 1);
                  } else {
                    _this7.showNotification("removed", item);

                    item.parentNode.removeChild(item);

                    _this7.cleanItem(item);

                    _this7.items.splice(item.arrayPosition, 1);
                  }

                  item.removeStatus = null;
                })["catch"](function (err) {
                  item.onclick = onClickFn;
                  item.removeStatus = null;
                });
              } else if (confirmRemove) {
                if (item.parentElement.itemizeOptions.anim) {
                  var _animDuration = item.parentElement.itemizeOptions.animDuration;
                  var closeBtn = item.querySelector(".itemize_remove_btn");
                  item.onclick = null;

                  if (closeBtn) {
                    closeBtn.onclick = null;
                  } else {
                    closeBtn = item.querySelector("." + this.globalOptions.removeBtnClass);

                    if (closeBtn) {
                      closeBtn.onclick = null;
                    }
                  }

                  this.showNotification("removed", item);
                  this.flipRemove(item);
                  this.items.splice(item.arrayPosition, 1);
                } else {
                  this.showNotification("removed", item);
                  item.removeStatus = null;
                  item.parentNode.removeChild(item);
                  this.items.splice(item.arrayPosition, 1);
                  this.cleanItem(item);
                }

                item.removeStatus = null;
              } else {
                item.removeStatus = null;
              }
            } else {
              if (item.parentElement.itemizeOptions.anim) {
                var _animDuration2 = item.parentElement.itemizeOptions.animDuration;

                var _closeBtn = item.querySelector(".itemize_remove_btn");

                if (_closeBtn) {
                  _closeBtn.onclick = null;
                } else {
                  _closeBtn = item.querySelector("." + this.globalOptions.removeBtnClass);

                  if (_closeBtn) {
                    _closeBtn.onclick = null;
                  }
                }

                this.showNotification("removed", item);
                this.flipRemove(item);
                this.items.splice(item.arrayPosition, 1);
              } else {
                this.showNotification("removed", item);
                item.parentNode.removeChild(item);
                this.cleanItem(item);
                this.items.splice(item.arrayPosition, 1);
              }

              item.removeStatus = null;
            }
          }
        } else {
          throw new Error(" - Itemize error - \n this element has an invalid itemizeItemId");
        }
      } catch (error) {
        console.error(" - Itemize error - \n" + error);
      }
    }
  }, {
    key: "cleanItem",
    value: function cleanItem(item) {
      for (var u = 0; u < item.classList.length; u++) {
        item.classList.remove("itmz_item");

        if (item.classList[u].indexOf("itemize_item_") !== -1) {
          item.classList.remove(item.classList[u]);
          break;
        }
      }

      if (item.parentNode && item.parentNode.itemizeItems) {
        for (var i = 0; i < item.parentNode.itemizeItems.length; i++) {
          if (item.parentNode.itemizeItems[i].itemizeItemId === item.itemizeItemId) {
            item.parentNode.itemizeItems.splice(i, 1);
            break;
          }
        }
      }

      if (item.parentNode && item.parentNode.itemizeOptions && item.parentNode.itemizeOptions.removeBtnClass) {
        var btn = item.querySelector("." + item.parentNode.itemizeOptions.removeBtnClass);

        if (btn) {
          btn.parentNode.removeChild(btn);
        }
      } else {
        var _btn = item.querySelector(".itemize_remove_btn");

        if (_btn) {
          _btn.parentNode.removeChild(_btn);
        }
      }

      if (item.itemizeContainerId) {
        this.clearObservers(item.itemizeContainerId);
        var parentsInItem = item.querySelectorAll(".itmz_parent");
        this.cancelItemize(parentsInItem);

        for (var _i5 = 0; _i5 < parentsInItem.length; _i5++) {
          if (parentsInItem[_i5].itemizeContainerId) {
            this.clearObservers(parentsInItem[_i5].itemizeContainerId);
          }
        }

        if (item.classList.contains("itmz_parent")) {
          this.cancelItemize([item]);
        }
      }

      item.itemizeItemId = null;
    }
  }, {
    key: "animateRAF",
    value: function animateRAF(elem, from, to, duration) {
      for (var i = 0; i < from.length; i++) {
        for (var key in from[i]) {
          if (from[i].hasOwnProperty(key)) {
            if (key === "transform") {
              elem.style.transform = "translateX(".concat(from[i][key].translateX).concat(from[i][key].unit, ") translateY(").concat(from[i][key].translateY).concat(from[i][key].unit, ")");
            } else if (key === "opacity") {
              elem.style.opacity = from[i][key];
            } else {
              elem.style[key] = "".concat(from[i][key].value).concat(from[i][key].unit);
            }
          }
        }
      }

      function anim(timestamp) {
        var progress;

        if (!elem.startAnimTime) {
          elem.startAnimTime = timestamp;
        }

        progress = timestamp - elem.startAnimTime;

        for (var _i6 = 0; _i6 < to.length; _i6++) {
          for (var _key in to[_i6]) {
            if (to[_i6].hasOwnProperty(_key)) {
              if (_key === "transform") {
                elem.style.transform = "translateX(".concat(from[_i6][_key].translateX - (from[_i6][_key].translateX - to[_i6][_key].translateX) * parseInt(100 / (duration / progress)) / 100).concat(to[_i6][_key].unit, ") translateY(").concat(from[_i6][_key].translateY - (from[_i6][_key].translateY - to[_i6][_key].translateY) * parseInt(100 / (duration / progress)) / 100).concat(to[_i6][_key].unit, ")");
              } else if (_key === "opacity") {
                elem.style.opacity = from[_i6][_key] - (from[_i6][_key] - to[_i6][_key]) * parseInt(100 / (duration / progress)) / 100;
              } else {
                elem.style[_key] = "".concat(from[_i6][_key].value - (from[_i6][_key].value - to[_i6][_key].value) * parseInt(100 / (duration / progress)) / 100).concat(to[_i6][_key].unit);
              }
            }
          }
        }

        if (progress < duration - 1) {
          requestAnimationFrame(anim);
        } else {
          elem.startAnimTime = null;

          if (elem.inFlipAnim) {
            elem.inFlipAnim = false;
            elem.style.transform = "none";
          }
        }
      }

      requestAnimationFrame(anim);
    }
  }, {
    key: "flipRemove",
    value: function flipRemove(elem) {
      var _this8 = this;

      elem.onclick = null;
      var options = elem.parentElement.itemizeOptions;

      if (elem.animate) {
        elem.animate([{
          transform: "translate(0px, 0px)",
          opacity: 1
        }, {
          transform: "translate(".concat(options.animRemoveTranslateX, "px, ").concat(options.animRemoveTranslateY, "px)"),
          opacity: 0
        }], {
          duration: options.animDuration * 0.5,
          easing: options.animEasing,
          fill: "both"
        });
      } else {
        this.animateRAF(elem, [{
          opacity: 1
        }, {
          transform: {
            translateX: 0,
            translateY: 0,
            unit: "px"
          }
        }], [{
          opacity: 0
        }, {
          transform: {
            translateX: options.animRemoveTranslateX,
            translateY: options.animRemoveTranslateY,
            unit: "px"
          }
        }], options.animDuration * 0.5);
      }

      var flipPlayId = this.makeId(6);
      this.flipPlayId = flipPlayId;
      setTimeout(function () {
        _this8.elemToRemove.push(elem);

        if (_this8.flipPlayId === flipPlayId) {
          _this8.flipRead(_this8.items);

          for (var i = 0; i < _this8.elemToRemove.length; i++) {
            _this8.cleanItem(_this8.elemToRemove[i]);

            _this8.elemToRemove[i].removeStatus = null;

            _this8.elemToRemove[i].parentNode.removeChild(_this8.elemToRemove[i]);
          }

          _this8.elemToRemove = [];

          _this8.flipPlay(_this8.items, options.animDuration * 0.5);
        }
      }, options.animDuration * 0.5);
    }
  }, {
    key: "flipAdd",
    value: function flipAdd(elem) {
      elem.classList.remove("itemize_hide");
      elem.inAddAnim = true;
      var options = elem.parentElement.itemizeOptions;
      var translateXStart = options.animAddTranslateX;
      var translateYStart = options.animAddTranslateY;

      if (elem.animate) {
        elem.animate([{
          transform: "translate(".concat(translateXStart, "px, ").concat(translateYStart, "px)"),
          opacity: 0
        }, {
          transform: "none",
          opacity: 1
        }], {
          duration: options.animDuration,
          easing: options.animEasing
        });
      } else {
        this.animateRAF(elem, [{
          opacity: 0
        }, {
          transform: {
            translateX: translateXStart,
            translateY: translateYStart,
            unit: "px"
          }
        }], [{
          opacity: 1
        }, {
          transform: {
            translateX: 0,
            translateY: 0,
            unit: "px"
          }
        }], options.animDuration);
      }

      setTimeout(function () {
        elem.inAddAnim = false;
        elem.newAddPos = null;
        elem.oldPos = null;
        elem.style.transform = "none";
        elem.style.opacity = 1;
      }, options.animDuration);
    }
  }, {
    key: "flipRead",
    value: function flipRead(elems) {
      for (var i = elems.length - 1; i >= 0; i--) {
        if (elems[i].parentNode) {
          this.elPos[elems[i].itemizeItemId] = elems[i].getBoundingClientRect();
        } else {
          elems.splice(i, 1);
        }
      }
    }
  }, {
    key: "flipPlay",
    value: function flipPlay(elems, duration, dragAnim) {
      var _this9 = this;

      var _loop2 = function _loop2(i) {
        var el = elems[i];

        if (!el.inAddAnim && el.parentNode && el.parentNode.itemizeOptions) {
          var newPos = el.getBoundingClientRect();
          var oldPos = _this9.elPos[el.itemizeItemId];
          var deltaX = oldPos.left - newPos.left;
          var deltaY = oldPos.top - newPos.top;
          var deltaW = oldPos.width / newPos.width;
          var deltaH = oldPos.height / newPos.height;

          if (isNaN(deltaW) || deltaW === Infinity) {
            deltaW = 1;
          }

          if (isNaN(deltaH) || deltaH === Infinity) {
            deltaH = 1;
          }

          if (deltaX !== 0 || deltaY !== 0 || deltaW !== 1 || deltaH !== 1) {
            el.inFlipAnim = true;

            if (el.animate) {
              el.animate([{
                transform: "translate(".concat(deltaX, "px, ").concat(deltaY, "px)")
              }, {
                transform: "none"
              }], {
                duration: duration,
                easing: dragAnim ? "ease-in-out" : el.parentNode.itemizeOptions.animEasing
              });
            } else {
              _this9.animateRAF(el, [{
                transform: {
                  translateX: deltaX,
                  translateY: deltaY,
                  unit: "px"
                }
              }], [{
                transform: {
                  translateX: 0,
                  translateY: 0,
                  unit: "px"
                }
              }], duration);
            }

            if (document.querySelector("body").animate) {
              setTimeout(function () {
                if (el) {
                  el.style.transform = "none";
                  el.inFlipAnim = false;
                }
              }, duration);
            }
          }
        }
      };

      for (var i = 0; i < elems.length; i++) {
        _loop2(i);
      }
    }
  }, {
    key: "mergeOptions",
    value: function mergeOptions(newOptions) {
      try {
        var defaultOptions = {
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
          notificationTimer: 4000,
          anim: true,
          animEasing: "ease-in-out",
          animDuration: 500,
          animRemoveTranslateX: 0,
          animRemoveTranslateY: -100,
          animAddTranslateX: 0,
          animAddTranslateY: -100,
          dragAndDrop: false,
          beforeRemove: null,
          outlineItemOnHover: false,
          nestingLevel: 1,
          itemizeAddedElement: true,
          onAddItem: null
        };

        if (this.globalOptions) {
          defaultOptions = _objectSpread({}, this.globalOptions);
        }

        var mergedOptions = _objectSpread({}, defaultOptions, {}, newOptions);

        return mergedOptions;
      } catch (error) {
        console.error(error);
      }
    }
  }, {
    key: "getOptionsFromAttributes",
    value: function getOptionsFromAttributes(parent, options) {
      var intAttributes = ["removeBtnWidth", "removeBtnThickness", "removeBtnMargin", "nestingLevel", "animDuration", "animRemoveTranslateX", "animRemoveTranslateY", "animAddTranslateX", "animAddTranslateY", "removeBtnThickness", "notificationTimer"];

      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          if (parent.getAttribute(key)) {
            if (parent.getAttribute(key) === "false") {
              options[key] = false;
            } else if (parent.getAttribute(key) === "true") {
              options[key] = true;
            } else if (intAttributes.indexOf(key) !== -1) {
              if (!isNaN(parseInt(parent.getAttribute(key)))) {
                options[key] = parseInt(parent.getAttribute(key));
              }
            } else {
              options[key] = parent.getAttribute(key);
            }
          }
        }
      }

      return options;
    }
  }, {
    key: "makeId",
    value: function makeId(length) {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;

      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      return result;
    }
  }]);

  return Itemize;
}();

var DragDropTouch;

(function (DragDropTouch_1) {
  "use strict";

  var DataTransfer = function () {
    function DataTransfer() {
      this._dropEffect = "move";
      this._effectAllowed = "all";
      this._data = {};
    }

    Object.defineProperty(DataTransfer.prototype, "dropEffect", {
      get: function get() {
        return this._dropEffect;
      },
      set: function set(value) {
        this._dropEffect = value;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(DataTransfer.prototype, "effectAllowed", {
      get: function get() {
        return this._effectAllowed;
      },
      set: function set(value) {
        this._effectAllowed = value;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(DataTransfer.prototype, "types", {
      get: function get() {
        return Object.keys(this._data);
      },
      enumerable: true,
      configurable: true
    });

    DataTransfer.prototype.clearData = function (type) {
      if (type != null) {
        delete this._data[type];
      } else {
        this._data = null;
      }
    };

    DataTransfer.prototype.getData = function (type) {
      return this._data[type] || "";
    };

    DataTransfer.prototype.setData = function (type, value) {
      this._data[type] = value;
    };

    DataTransfer.prototype.setDragImage = function (img, offsetX, offsetY) {
      var ddt = DragDropTouch._instance;
      ddt._imgCustom = img;
      ddt._imgOffset = {
        x: offsetX,
        y: offsetY
      };
    };

    return DataTransfer;
  }();

  DragDropTouch_1.DataTransfer = DataTransfer;

  var DragDropTouch = function () {
    function DragDropTouch() {
      this._lastClick = 0;

      if (DragDropTouch._instance) {
        throw "DragDropTouch instance already created.";
      }

      var supportsPassive = false;
      document.addEventListener("test", function () {}, {
        get passive() {
          supportsPassive = true;
          return true;
        }

      });

      if ("ontouchstart" in document) {
        var d = document,
            ts = this._touchstart.bind(this),
            tm = this._touchmove.bind(this),
            te = this._touchend.bind(this),
            opt = supportsPassive ? {
          passive: false,
          capture: false
        } : false;

        d.addEventListener("touchstart", ts, opt);
        d.addEventListener("touchmove", tm, opt);
        d.addEventListener("touchend", te);
        d.addEventListener("touchcancel", te);
      }
    }

    DragDropTouch.getInstance = function () {
      return DragDropTouch._instance;
    };

    DragDropTouch.prototype._touchstart = function (e) {
      var _this = this;

      if (this._shouldHandle(e)) {
        if (Date.now() - this._lastClick < DragDropTouch._DBLCLICK) {
          if (this._dispatchEvent(e, "dblclick", e.target)) {
            e.preventDefault();

            this._reset();

            return;
          }
        }

        this._reset();

        var src = this._closestDraggable(e.target);

        if (src) {
          if (!this._dispatchEvent(e, "mousemove", e.target) && !this._dispatchEvent(e, "mousedown", e.target)) {
            this._dragSource = src;
            this._ptDown = this._getPoint(e);
            this._lastTouch = e;
            e.preventDefault();
            setTimeout(function () {
              if (_this._dragSource == src && _this._img == null) {
                if (_this._dispatchEvent(e, "contextmenu", src)) {
                  _this._reset();
                }
              }
            }, DragDropTouch._CTXMENU);

            if (DragDropTouch._ISPRESSHOLDMODE) {
              this._pressHoldInterval = setTimeout(function () {
                _this._isDragEnabled = true;

                _this._touchmove(e);
              }, DragDropTouch._PRESSHOLDAWAIT);
            }
          }
        }
      }
    };

    DragDropTouch.prototype._touchmove = function (e) {
      if (this._shouldCancelPressHoldMove(e)) {
        this._reset();

        return;
      }

      if (this._shouldHandleMove(e) || this._shouldHandlePressHoldMove(e)) {
        var target = this._getTarget(e);

        if (this._dispatchEvent(e, "mousemove", target)) {
          this._lastTouch = e;
          e.preventDefault();
          return;
        }

        if (this._dragSource && !this._img && this._shouldStartDragging(e)) {
          this._dispatchEvent(e, "dragstart", this._dragSource);

          this._createImage(e);

          this._dispatchEvent(e, "dragenter", target);
        }

        if (this._img) {
          this._lastTouch = e;
          e.preventDefault();

          if (target != this._lastTarget) {
            this._dispatchEvent(this._lastTouch, "dragleave", this._lastTarget);

            this._dispatchEvent(e, "dragenter", target);

            this._lastTarget = target;
          }

          this._moveImage(e);

          this._isDropZone = this._dispatchEvent(e, "dragover", target);
        }
      }
    };

    DragDropTouch.prototype._touchend = function (e) {
      if (this._shouldHandle(e)) {
        if (this._dispatchEvent(this._lastTouch, "mouseup", e.target)) {
          e.preventDefault();
          return;
        }

        if (!this._img) {
          this._dragSource = null;

          this._dispatchEvent(this._lastTouch, "click", e.target);

          this._lastClick = Date.now();
        }

        this._destroyImage();

        if (this._dragSource) {
          if (e.type.indexOf("cancel") < 0 && this._isDropZone) {
            this._dispatchEvent(this._lastTouch, "drop", this._lastTarget);
          }

          this._dispatchEvent(this._lastTouch, "dragend", this._dragSource);

          this._reset();
        }
      }
    };

    DragDropTouch.prototype._shouldHandle = function (e) {
      return e && !e.defaultPrevented && e.touches && e.touches.length < 2;
    };

    DragDropTouch.prototype._shouldHandleMove = function (e) {
      return !DragDropTouch._ISPRESSHOLDMODE && this._shouldHandle(e);
    };

    DragDropTouch.prototype._shouldHandlePressHoldMove = function (e) {
      return DragDropTouch._ISPRESSHOLDMODE && this._isDragEnabled && e && e.touches && e.touches.length;
    };

    DragDropTouch.prototype._shouldCancelPressHoldMove = function (e) {
      return DragDropTouch._ISPRESSHOLDMODE && !this._isDragEnabled && this._getDelta(e) > DragDropTouch._PRESSHOLDMARGIN;
    };

    DragDropTouch.prototype._shouldStartDragging = function (e) {
      var delta = this._getDelta(e);

      return delta > DragDropTouch._THRESHOLD || DragDropTouch._ISPRESSHOLDMODE && delta >= DragDropTouch._PRESSHOLDTHRESHOLD;
    };

    DragDropTouch.prototype._reset = function () {
      this._destroyImage();

      this._dragSource = null;
      this._lastTouch = null;
      this._lastTarget = null;
      this._ptDown = null;
      this._isDragEnabled = false;
      this._isDropZone = false;
      this._dataTransfer = new DataTransfer();
      clearInterval(this._pressHoldInterval);
    };

    DragDropTouch.prototype._getPoint = function (e, page) {
      if (e && e.touches) {
        e = e.touches[0];
      }

      return {
        x: page ? e.pageX : e.clientX,
        y: page ? e.pageY : e.clientY
      };
    };

    DragDropTouch.prototype._getDelta = function (e) {
      if (DragDropTouch._ISPRESSHOLDMODE && !this._ptDown) {
        return 0;
      }

      var p = this._getPoint(e);

      return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
    };

    DragDropTouch.prototype._getTarget = function (e) {
      var pt = this._getPoint(e),
          el = document.elementFromPoint(pt.x, pt.y);

      while (el && getComputedStyle(el).pointerEvents == "none") {
        el = el.parentElement;
      }

      return el;
    };

    DragDropTouch.prototype._createImage = function (e) {
      if (this._img) {
        this._destroyImage();
      }

      var src = this._imgCustom || this._dragSource;
      this._img = src.cloneNode(true);

      this._copyStyle(src, this._img);

      this._img.style.top = this._img.style.left = "-9999px";

      if (!this._imgCustom) {
        var rc = src.getBoundingClientRect(),
            pt = this._getPoint(e);

        this._imgOffset = {
          x: pt.x - rc.left,
          y: pt.y - rc.top
        };
        this._img.style.opacity = DragDropTouch._OPACITY.toString();
      }

      this._moveImage(e);

      document.body.appendChild(this._img);
    };

    DragDropTouch.prototype._destroyImage = function () {
      if (this._img && this._img.parentElement) {
        this._img.parentElement.removeChild(this._img);
      }

      this._img = null;
      this._imgCustom = null;
    };

    DragDropTouch.prototype._moveImage = function (e) {
      var _this = this;

      requestAnimationFrame(function () {
        if (_this._img) {
          var pt = _this._getPoint(e, true),
              s = _this._img.style;

          s.position = "absolute";
          s.pointerEvents = "none";
          s.zIndex = "999999";
          s.left = Math.round(pt.x - _this._imgOffset.x) + "px";
          s.top = Math.round(pt.y - _this._imgOffset.y) + "px";
        }
      });
    };

    DragDropTouch.prototype._copyProps = function (dst, src, props) {
      for (var i = 0; i < props.length; i++) {
        var p = props[i];
        dst[p] = src[p];
      }
    };

    DragDropTouch.prototype._copyStyle = function (src, dst) {
      DragDropTouch._rmvAtts.forEach(function (att) {
        dst.removeAttribute(att);
      });

      if (src instanceof HTMLCanvasElement) {
        var cSrc = src,
            cDst = dst;
        cDst.width = cSrc.width;
        cDst.height = cSrc.height;
        cDst.getContext("2d").drawImage(cSrc, 0, 0);
      }

      var cs = getComputedStyle(src);

      for (var i = 0; i < cs.length; i++) {
        var key = cs[i];

        if (key.indexOf("transition") < 0) {
          dst.style[key] = cs[key];
        }
      }

      dst.style.pointerEvents = "none";

      for (var i = 0; i < src.children.length; i++) {
        this._copyStyle(src.children[i], dst.children[i]);
      }
    };

    DragDropTouch.prototype._dispatchEvent = function (e, type, target) {
      if (e && target) {
        var evt = document.createEvent("Event"),
            t = e.touches ? e.touches[0] : e;
        evt.initEvent(type, true, true);
        evt.button = 0;
        evt.which = evt.buttons = 1;

        this._copyProps(evt, e, DragDropTouch._kbdProps);

        this._copyProps(evt, t, DragDropTouch._ptProps);

        evt.dataTransfer = this._dataTransfer;
        target.dispatchEvent(evt);
        return evt.defaultPrevented;
      }

      return false;
    };

    DragDropTouch.prototype._closestDraggable = function (e) {
      for (; e; e = e.parentElement) {
        if (e.hasAttribute("draggable") && e.draggable) {
          return e;
        }
      }

      return null;
    };

    return DragDropTouch;
  }();

  DragDropTouch._instance = new DragDropTouch();
  DragDropTouch._THRESHOLD = 5; // pixels to move before drag starts

  DragDropTouch._OPACITY = 0.5; // drag image opacity

  DragDropTouch._DBLCLICK = 500; // max ms between clicks in a double click

  DragDropTouch._CTXMENU = 900; // ms to hold before raising 'contextmenu' event

  DragDropTouch._ISPRESSHOLDMODE = false; // decides of press & hold mode presence

  DragDropTouch._PRESSHOLDAWAIT = 400; // ms to wait before press & hold is detected

  DragDropTouch._PRESSHOLDMARGIN = 25; // pixels that finger might shiver while pressing

  DragDropTouch._PRESSHOLDTHRESHOLD = 0; // pixels to move before drag starts

  DragDropTouch._rmvAtts = "id,class,style,draggable".split(",");
  DragDropTouch._kbdProps = "altKey,ctrlKey,metaKey,shiftKey".split(",");
  DragDropTouch._ptProps = "pageX,pageY,clientX,clientY,screenX,screenY".split(",");
  DragDropTouch_1.DragDropTouch = DragDropTouch;
})(DragDropTouch || (DragDropTouch = {}));

try {
  module.exports = Itemize;
} catch (_unused) {}