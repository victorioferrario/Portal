

import StateTracker = require("core/DialogState");
import AppModule = require( "durandal/app" );
import RootRouter = require( "plugins/router" );
import IAppContext = require( "core/IAppContext" );
import AppTrans = require( "core/AppViewTransitions" );
import global = require( "system/session/IdentityUser" );
import lg = require( "system/session/HealthRecords" );
import health = require( "system/session/ClinicalData" );
import Service = require( "services/HttpService" );
import Env = require( "system/events/EventCommand" );
import Sys = require( "system/utilities/ViewManager" );
import SysTools = require( "system/utilities/BrowserManager" );
declare var ga;
class AppContext {
    DEBUGGING: boolean = true;
    app: DurandalAppModule;
    router: DurandalRootRouter;
    service: Service;
    isTransBinded: boolean;
    appTransitions: AppTrans;
    dialogTracker:StateTracker.core.DialogStateTracker;
    appViewHealthRecords: Sys.utilities.Components.Views.IManager;
    appHealthHelper: health.system.session.clinical.ClinicalData;
    identityUser: global.sys.session.IdentityUser;
    identityHealthRecords: lg.sys.session.HealthRecords;
    browser: SysTools.utilities.platform.BrowserManager;
    constructor() {
        var self = this;
        self.app = AppModule;
        self.isTransBinded = false;
        self.currentRoute = "";
        self.service = new Service();
        self.appHealthHelper = new health.system.session.clinical.ClinicalData();
        self.selectedOrderType = ko.observable();
        self.dialogTracker = new StateTracker.core.DialogStateTracker();
        self.browser = new SysTools.utilities.platform.BrowserManager();
    }
    databind() {
         var self = this; return Q.resolve( true );
    }
    boot() {
        var self = this;
        if ( self.setupLogic() && self.setupRouter() ) {
            return Q.resolve( true );
        } else {
            return Q.resolve( false );
        }
    }
    authenticate() {
        var self = this;
        console.log("AppContext:line:48", "authenticate");
        self.identityUser = new global.sys.session.IdentityUser();
        self.service.routes.members.isAuthenticated()
            .fail(() => { })
            .done( result => {
                if ( result ) {
                    self.service.routes.members.getMember()
                        .fail(() => {
                            console.log( "error" );
                        })
                        .done( data => {
                            self.identityUser.instance = data;
                        })
                        .then(() => {
                            console.warn("===================================================", "CALLING DEPENDENTS");
                            self.identityUser.dataContext.loadDependents(self.identityUser.instance.RolodexItemID );
                            self.app.trigger(
                                Env.system.events.GeneralCommands.DATA_LOADED, "SUCCESS" );
                        });
                } else {
                       //ToDO: REMOVE WHEN PUBLISH
                    //console.log(result);
                    if (document.location.host.indexOf("localhost") === -1) {
                        document.location.href = "Logout.aspx";
                    }
                }
            });
    }
    loadHandler() {

    }
    bootHealthRecords() {
        var self = this;
        self.identityHealthRecords = new lg.sys.session.HealthRecords();
        self.service.routes.members.loadHealthRecords()
            .fail(() => {

            })
            .done( result => {
                self.identityHealthRecords.onServerHandler( result );
                self.onBootHealtRecordsHandler();
            });
        return Q.resolve( true );
    }
    get_browser_info() {
        var ua = navigator.userAgent, tem, M = ua.match( /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i ) || [];
        if ( /trident/i.test( M[1] ) ) {
            tem = /\brv[ :]+(\d+)/g.exec( ua ) || [];
            return { name: 'IE', version: ( tem[1] || '' ) };
        }
        if ( M[1] === 'Chrome' ) {
            tem = ua.match( /\bOPR\/(\d+)/ )
            if ( tem != null ) { return { name: 'Opera', version: tem[1] }; }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ( ( tem = ua.match( /version\/(\d+)/i ) ) != null ) { M.splice( 1, 1, tem[1] ); }
        return {
            name: M[0],
            version: M[1]
        };
    }
    onBootHealtRecordsHandler() {
        var self = this;
        self.app.trigger(
            Env.system.events.GeneralCommands.DATA_HEALTH_LOADED,
            "success" );
    }
    setupLogic() {
        var self = this;
        self.app = AppModule;
        self.router = RootRouter;
        ko.postbox.subscribe(
            Env.system.events.GeneralCommands.DATA_LOADED__DETAIL, function ( data ) { self.setupProfile(data);
            });
        return Q.resolve( true );
    }
    setupProfile(data) {
        console.log("same profile stuff", data);
    }
    selectedOrderType: KnockoutObservable<any>;
    currentRoute: string;
    setupRouter() {
        var self = this;
        self.router.map(
            [
                { route: ["", "dashboard"], moduleId: "sections/dashboard", title: "Dashboard", nav: true, hash: "#dashboard" },
                { route: "consults", moduleId: "sections/consults/store", title: "Consult Center", nav: true, hash: "#consults" },
                { route: "store", moduleId: "sections/consults/store", title: "Consult Center", nav: true, hash: "#store" },
                { route: "consults/:id*details", moduleId: "sections/consults/store", title: "Consult Wizard", nav: false, hash: "#consults/:id" },
                { route: "consulthistory", moduleId: "sections/consults/history", title: "Consult History", nav: true, hash: "#consulthistory" },
                { route: "healthrecords", moduleId: "sections/clinical/default", title: "My Health Records", nav: true, hash: "#healthrecords" },
                { route: "familymembers", moduleId: "sections/account/familymembers", title: "My Family Members", nav: true, hash: "#familymembers" },
                { route: "accountsettings", moduleId: "sections/account/default", title: "Account Settings", nav: true, hash: "#accountsettings" },
                { route: "profile", moduleId: "sections/account/profile", title: "My Profile", nav: true, hash: "#profile" },
                { route: "templatePage", moduleId: "sections/template/default", title: "Template", nav: true, hash: "#templatePage" },
                { route: "reload", moduleId: "sections/shared/reload", title: "reload", nav: true, hash: "#reload" }
            ] )
            .buildNavigationModel()
            .mapUnknownRoutes( "sections/shared/notfound404", "not-found" ).activate();
        self.router.on( "router:route:activating", ( instance, instruction ) => {
            $( "#page-container" ).scrollTop( 0 );
            $( "#page-container" ).css( "overflow-y", "hidden" );
            console.log( document.URL );
            var e = document.URL.split( "#" );
            var r = "";
            if ( e[1] !== "undefined" && e[1] !== null ) {
                r = e[1];
            } else {
                r = e[0];
            }
            ga( "set", "page", r );
            ga( "send", "pageview" );
        });
        self.router.on( "router:navigation:complete", ( instance, instruction ) => {
            self.currentRoute = instance.__moduleId__;
        });
        return Q.resolve( true );
    }
    bindTrans() {
        var self = this;
        self.appTransitions = new AppTrans("app_loaderPlaceHolder", "ctxLoader" );
        self.isTransBinded = true;
        return Q.resolve( true );;
    }
    resetViewPort() {
        setTimeout(() => {
            $( "#page-container" ).css( "overflow-y", "auto" );
        }, 1000 );
        return Q.resolve( true );
    }
    add() {
        var self = this;
        self.app.trigger(
            Env.system.events.GeneralCommands.LOADER_ADD, "success" );
    }
    remove() {
        var self = this;
        self.app.trigger(
            Env.system.events.GeneralCommands.LOADER_REMOVE, "success" );
    }

}

var vm: IAppContext = new AppContext();
export = vm;