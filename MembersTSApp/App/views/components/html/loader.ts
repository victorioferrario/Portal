import ko = require("knockout");
import IViewModel = require("core/IViewModel");
import ViewModel = require("core/ViewModel");
import Config = require("views/components/html/loaderViewModel");
import AppModule = require("durandal/app");
import Env = require("system/events/EventCommand");
class LoaderView extends ViewModel {
    app: DurandalAppModule;
    inprogress:boolean;
    hideClass = "m-hide";
    appLoader: JQuery;
    animationText: JQuery;
    animationIcon: JQuery;
    constructor() {
        super();
        var self = this;
        self.app = AppModule;
        self.app.on(Env.system.events.GeneralCommands.LOADER_ADD).then(data => {
            self.add();
        });
        self.app.on(Env.system.events.GeneralCommands.LOADER_REMOVE).then(data => {
            self.remove();
        });
    }
    activate() {
        return this.databind();
    }
    canActivate() {
        return Q.resolve(true);
    }
    canDeActivate() {
        return Q.resolve(true);
    }
    compositionComplete() {
        var self = this;
        self.appLoader = $(
            Config.views.components.html.LoaderViewModel.id);
        self.animationIcon = $(
            Config.views.components.html.LoaderViewModel.icon);
        self.animationText = $(
            Config.views.components.html.LoaderViewModel.text);
    }
    add() {
        var self = this;
        $("#page-container").css("overflow-y", "hidden!important");
        self.addAnimateLoader();
    }
    remove() {
        var self = this;
        self.removeAnimateLoader();
    }
    addAnimateLoader() {
        var self = this;
        self.appLoader.velocity(
            "fadeIn", {
                delay: 1,
                duration: 300,
                begin(elements) {
                    self.toggleMain(true);
                    self.appLoader.removeClass("m-hide");
                    setTimeout(() => {
                        self.toggle(true);
                    }, 400);
                },
                complete(elements) {
                    self.inprogress = false;
                }
            });
    }
    removeAnimateLoader() {
        var self = this;
        self.appLoader.velocity(
            "fadeOut", {
                delay: 1,
                duration: 800,
                begin(elements) {
                    self.toggleMain(false);
                    self.toggle(false);
                },
                complete(elements) {
                    $("body").removeClass("no-scroll");
                    $("#page-container").css("overflow-y", "auto!important");
                    self.appLoader.addClass(self.hideClass);
                    self.inprogress = false;
                }
            });
    }
    hasClass(item: JQuery, css: string) {
        if (item.hasClass(css)) {
            item.removeClass(css);
        }
    }
    toggleMain(value: boolean) {
        var self = this;
        self.hasClass(self.appLoader,
            !value ?
                Config.views.components.html.LoaderViewModel.idClassIn :
                Config.views.components.html.LoaderViewModel.idClassOut);
        self.appLoader.addClass(
            !value ?
                Config.views.components.html.LoaderViewModel.idClassOut :
                Config.views.components.html.LoaderViewModel.idClassIn);
    }
    toggle(value: boolean) {
        var self = this;
        // Clean up all css class names.
        self.hasClass(self.animationIcon,
            !value ?
                Config.views.components.html.LoaderViewModel.iconClassIn :
                Config.views.components.html.LoaderViewModel.iconClassOut);

        self.hasClass(self.animationText,
            !value ?
                Config.views.components.html.LoaderViewModel.textClassIn:
                Config.views.components.html.LoaderViewModel.textClassOut);
        
        self.animationIcon.addClass(!value ?
            Config.views.components.html.LoaderViewModel.iconClassOut
            : Config.views.components.html.LoaderViewModel.iconClassIn);

        self.animationText.addClass(!value ?
            Config.views.components.html.LoaderViewModel.textClassOut
            : Config.views.components.html.LoaderViewModel.textClassIn);

        // Turn on animation if they have one.
       
            self.animationIcon.removeClass(self.hideClass);
            self.animationText.removeClass(self.hideClass);
   
    }

    databind() {
        var self = this;
        return Q.resolve(true);
    }
}
var loader: IViewModel = new LoaderView();
export = loader;  