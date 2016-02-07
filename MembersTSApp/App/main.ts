declare var define;
declare var require;
declare var scrollReveal;
require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        "text": "../Scripts/require/text",
        "transitions": "../Scripts/durandal/transitions",
        "durandal": "../Scripts/durandal",
        "plugins": "../Scripts/durandal/plugins",
        "jquery": "../Scripts/jquery/jquery-2.1.4",
        "velocity": "../Scripts/jquery/velocity",
        "velocity-ui": "../Scripts/jquery/velocity.ui",
        "knockout": "../Scripts/knockout-3.4",
        "knockout.postbox": "../Scripts/knockout/knockout-postbox",
        "knockout.mapping": "../Scripts/knockout/knockout.mapping-latest.debug",
        "knockout.validation": "../Scripts/knockout/knockout.validation",
        "knockout.transitions": "../Scripts/knockout/knockout.transitions",
        "toastr": "../Scripts/vendors/toastr",
        "Q": "../Scripts/vendors/q"
    },
    shim: {
        "toastr": "toastr",
        "knockout": "ko",
        "knockout.validation": "validation",
        "knockout.mapping": {
            deps: ["knockout"],
            exports: "koExports"
        },
        "knockout.postbox": {
            deps: ["knockout"],
            exports: "koExports"
        },
        "knockout.transitions": "transitions"
    }
});
define("jquery", () => jQuery);
define("knockout", () => ko);
define("knockout.mapping", () => ko.mapping);
define("knockout.validation", () => validation);
define([
    "durandal/system",
    "durandal/app",
    "durandal/viewLocator",
    "../Scripts/knockout-3.4.0",
    "../Scripts/knockout/knockout.validation",
    "../Scripts/knockout/knockout.mapping-latest.debug",
    "../Scripts/vendors/toastr"], (
        system, app, viewLocator, ko, validation, mapping, toastr) => {
        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");
        app.title = "Member Dashboard";
        var temp = ko.observable("test");
        var entity = {
            test: "test1",
            test2: "test2"
        };
        var tempModel = mapping.fromJS( entity );
      //  window["sr"] = new scrollReveal();
        app.configurePlugins({
            router: true,
            dialog: true,
            observable: true,
            serializer: true,
            //history: true,
            widget: {
                kinds: ["tabs"]
            }
        });
        toastr.options = {
            "closeButton": false,
            "debug": true,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-full-width",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        app.start().then(() => {
            viewLocator.useConvention();
            app.setRoot("shell");
        });
});