export module Sys.UI.Core {
    export interface IEventDispatcher {
        _prefix;
        listeners: any;
        register(evt_name, bind, callback);
        emit(evt_name, params);
    }
    export class EventDispatcher implements IEventDispatcher {
        _prefix = "on_";
        listeners: any;
        constructor() {
            this.listeners = {};
        }
        register(evt_name, bind, callback) {
            var self = this, isEvent = false;
            var _evt_name = this._prefix + evt_name;
            if (!this.listeners[_evt_name]) {
                this.listeners[_evt_name] = [];
            }
            this.listeners[_evt_name].push([bind === null ? this : bind, callback]);
        }
        emit(evt_name, params) {
            var _evt_name = this._prefix + evt_name;

            if (typeof this.listeners[_evt_name] !== undefined) {
                for (var i = 0, l = this.listeners[_evt_name].length; i < l; i++) {
                    this.listeners[_evt_name][i][1].call(this.listeners[_evt_name][i][0], evt_name, params);
                }
            }
        }
    }
}
export module Sys.UI.Controls {
    export interface IDom extends Sys.UI.Core.IEventDispatcher {
        inprogress: boolean;
        elementId: string;
        context: HTMLElement;
        contextLoader: HTMLElement;
        addLoader();
        removeLoader();
    }
    export class Dom extends Sys.UI.Core.EventDispatcher implements IDom {
        inprogress: boolean;
        elementId: string;
        context: HTMLElement;
        contextLoader: HTMLElement;
        constructor() {
            super();
            var self = this;
        }
        addLoader() {
            var self = this;
            self.contextLoader = Loaders.createArticle(
                self.elementId);
            self.context.appendChild(self.contextLoader); return true;
        }
        removeLoader() {
            var self = this;
            self.context.removeChild(self.contextLoader);
        }
    }

    export class Loaders {
        static loaderMessage = "<div class=\"loader-message\"><i class=\"animate-spin fa fa-rocket m-hide\" id=\"animiationIcon\"></i><span class=\"start-text loading-text m-hide\" id=\"animationText\">Initializing Data</span></div>";
        static createArticle(id) {
            var result = document.createElement("article");
            result.className = "new-loader fadeIn animated-200 m-hide";
            result.id = id;
            result.style.zIndex = "997!important";
            result.style.top = "0!important";
            result.innerHTML = Loaders.loaderMessage;
            return result;
        }
    }
    export class ElementExtensions {
        //#region class names

        static icon = "#animiationIcon";

        static iconClassIn = "fadeInDown animated-zoom";
        static iconClassOut = "fadeOutUp animated-500-delay";

        static text = "#animationText";

        static textClassIn = "fadeInUp animated-zoom";
        static textClassOut = "zoomOut animated-zoom";

        //#endregion 
        static toggle(value: boolean) {
            // Clean up all css class names.
            if (!value) {
                if ($(ElementExtensions.icon).hasClass(
                    ElementExtensions.iconClassIn)) {
                    $(ElementExtensions.icon).removeClass(
                        ElementExtensions.iconClassIn);
                }
                if ($(ElementExtensions.text).hasClass(
                    ElementExtensions.textClassIn)) {
                    $(ElementExtensions.text).removeClass(
                        ElementExtensions.textClassIn);
                }
            } 
            // Add new ones
            $(ElementExtensions.icon).addClass(
                !value ? ElementExtensions.iconClassOut : ElementExtensions.iconClassIn);
            $(ElementExtensions.text).addClass(
                !value ? ElementExtensions.textClassOut : ElementExtensions.textClassIn);
            // Turn on animation if they have one.
            if (value) {
                $(ElementExtensions.icon).removeClass("m-hide");
                $(ElementExtensions.text).removeClass("m-hide");
            }
        }
    }
}
export module Sys.UI {
    export interface ITransitionManager extends Sys.UI.Controls.IDom {
        addAnimateLoader();
        removeAnimateLoader();
    }
    export class TransitionManager extends Sys.UI.Controls.Dom implements ITransitionManager {
        constructor(container: string, id?: string) {
            super();
            var self = this;
            self.inprogress = false;
            self.context = document.getElementById(container);
            self.elementId = id !== null && id !== "undefined" ? id : "#ctlloader";
        }
        addAnimateLoader() {
            var self = this;
            $(`#${self.elementId}`).velocity(
                "fadeIn", {
                    delay: 1,
                    duration: 300,
                    begin(elements) {
                        $(`#${self.elementId}`).removeClass("m-hide");
                        setTimeout(() => {
                            Sys.UI.Controls.ElementExtensions.toggle(true);
                        }, 400);
                    },
                    complete(elements) {
                        self.inprogress = false;
                    }
                });
        }
        removeAnimateLoader() {
            var self = this;
            $("#" + self.elementId).velocity(
                "fadeOut", {
                    delay: 1,
                    duration: 800,
                    begin(elements) {
                        $(`#${self.elementId}`).removeClass(
                            "slideInUp animated-200");
                        $(`#${self.elementId}`).addClass(
                            "slideOutDown animated");
                        // setTimeout(() => {
                        Sys.UI.Controls.ElementExtensions.toggle(false);
                        //  },800);
                    },
                    complete(elements) {
                        $("body").removeClass("no-scroll");
                        self.removeLoader();
                        self.inprogress = false;
                    }
                });
        }

    }
}


