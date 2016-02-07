import ko = require("knockout");
import AppModule = require( "durandal/app" );

import IPageModel = require("core/IPageModel");
import IViewModel = require("core/IViewModel");
import PageModel = require("core/PageModel");
import AppContext = require("core/AppContext");
import IAppContext = require("core/IAppContext");
import DefaultManager = require( "views/components/forms/manager" );
import DefaultManagerEdge = require( "views/components/forms/manager2" );
import DefaultManagerBilling = require( "views/components/forms/manager3" );
import DefaultManagerDependent = require( "views/components/forms/manager4" );
import DefaultViewManager = require( "views/components/details/manager" );
import DefaultPendingManager = require( "views/components/details/pendingManager" );
import UpgradeBrowser = require("sections/shared/upgrade");
import loader = require("views/components/html/loader");
import Env = require( "system/events/EventCommand" );
import EnvDebug = require( "system/events/ClinicalCommands" );
import util = require( "system/utilities/global" );
import Sys = require( "system/utilities/ViewManager" );

declare var screenfull;
class Shell extends PageModel {

    //#region [@ Properties                 @]

    isDebugHR: KnockoutObservable<boolean>;

    app: DurandalAppModule;
    
    menuList: Array<JQuery>;

    loaderManager: IViewModel;

    formManager: DefaultManager;

    formManagerEdge: DefaultManagerEdge;
    billingFormManager: DefaultManagerBilling;
    dependentFormManager: DefaultManagerDependent;

    viewDetailsManager: DefaultViewManager;
    viewPendingManager: DefaultPendingManager;

    viewUpgrade: UpgradeBrowser;

    breadText: KnockoutObservable<string>;

    activeLoader: KnockoutObservable<any>;
    activeScreen: KnockoutObservable<any>;
    activeViewScreen: KnockoutObservable<any>;
    activeViewScreenUpgrade: KnockoutObservable<any>;
    activeBillingFormScreen: KnockoutObservable<any>;
    activeDependentFormScreen: KnockoutObservable<any>;
    activeHealthRecordsFormScreen: KnockoutObservable<any>;


    activePendingViewScreen: KnockoutObservable<any>;

    PersonName: KnockoutObservable<string>;

    isBootComplete: KnockoutObservable<boolean>;
    browser: KnockoutObservable<any>;

    isHideMaterialIcons:boolean;
    //#endregion
   
    //#region [@ Page Methods                @]

    constructor() {
        super();

        var self = this;


        self.isDebugHR = ko.observable(false);

        self.app = AppModule;

        self.appContext = AppContext;

        console.log( self.appContext.browser.Browser.name );

        self.browser = ko.observable( self.appContext.browser.Browser.name + " v:" + self.appContext.browser.Browser.version );

        //FIREFOX V.40
        if (self.appContext.browser.Browser.name === "Firefox" && self.appContext.browser.Browser.version === "40") {
            self.isHideMaterialIcons = true;
        } else {
            self.isHideMaterialIcons = false;
        }

        self.breadText = ko.observable("");
        self.PersonName = ko.observable("");

        self.activeLoader = ko.observable("");
        self.activeScreen = ko.observable("");
        self.activeViewScreen = ko.observable( "" );
        self.activeViewScreenUpgrade = ko.observable( "" );

        self.activeBillingFormScreen = ko.observable( "" );
        self.activeDependentFormScreen = ko.observable( "" );

        self.activePendingViewScreen = ko.observable( "" );

        self.activeHealthRecordsFormScreen = ko.observable("");

       // self.formManager = new DefaultManager();

        self.formManagerEdge = new DefaultManagerEdge();

        self.billingFormManager = new DefaultManagerBilling();

        self.dependentFormManager = new DefaultManagerDependent();

        self.viewDetailsManager = new DefaultViewManager();

        self.viewPendingManager = new DefaultPendingManager();

        self.viewUpgrade = new UpgradeBrowser();

        self.isBootComplete = ko.observable(false);

        //#region[@-    app EventListners    -@]

        self.app.on(
            Env.system.events.GeneralCommands.DATA_LOADED
        ).then(data => {
            self.childControlsCreated();
        });

        //self.app.on(
        //    Env.system.events.GeneralCommands.DATA_LOADED
        //).then( data => {
        //    self.childControlsCreated();
        //});

        self.app.on(
            Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD )
            .then(data => {
            self.reloadHealthRecords();
        });

        self.app.on(
            Env.system.events.GeneralCommands.DATA_HEALTH_LOADED
        ).then(data => {
            self.onHealthRecords();
            });

        ko.postbox.subscribe(
            Env.system.events.GeneralCommands.NAVIGATION_TRIGGERED,
            self.onNavigationTriggerd, this );

        //#endregion

    }
    initFormManger() {
        $( "#modalFrmManager2" ).openModal( {
            dismissible: false
        });
        return true;
    }
    debugQuickADD( data, event ) {
        var self = this;
        self.appContext.router.navigate( "#store" );
        self.breadText( "/ Consult Center" );
        //if (this.initFormManger()) {
        //ko.postbox.publish(
        //    EnvDebug.system.events.Clinical.ADD_INSERT_CONTROL_EDGE,
        //    {
        //        Data: "",
        //        Action: EnvDebug.system.events.Clinical.FORM_MEDICATIONS
        //    });
        //}
    }

    reloadHealthRecords() {
        var self = this;
        self.appContext.add();
        $("#page-container").css(
            "overflow-y", "hidden!important" );
        self.appContext.bootHealthRecords();
    }

    isShadowOn: boolean;

    databindScrollListener( viewSpyed ) {
        var self = this, scroller = $( "#" + viewSpyed );
        self.isShadowOn = false;
        scroller.scroll(() => {
            console.log( "scrolling",
                scroller.scrollTop() );
            if ( scroller.scrollTop() <= 5 ) {
                if ( self.isShadowOn ) {
                    if ( $( "#subNav" ).hasClass( "scrolled" ) ) {
                        $( "#subNav" ).attr( "style", '-webkit-box-shadow: 4px 4px 3px 1px rgba(0, 0, 0, 0.0);box-shadow: 4px 4px 3px 1px rgba(0, 0, 0, .0);' );
                        $( "#subNav" ).removeClass( "scrolled" );
                        self.isShadowOn = false;
                    }
                }
            }
            if ( scroller.scrollTop() >= 6 ) {
                if ( !self.isShadowOn ) {
                    self.isShadowOn = true;
                    $( "#subNav" ).attr( "style", '-webkit-box-shadow: 4px 4px 3px 1px rgba(0, 0, 0, .12);box-shadow: 4px 4px 3px 1px rgba(0, 0, 0, .12);' );
                    $( "#subNav" ).addClass( "scrolled" );
                }
            }
        });
    }
    activate() {
        return this.databind();
    }
    databind() {
        var self = this;
        self.appContext.authenticate();
        self.databindScrollListener( "pageContainer" );
        return Q.resolve( true );
    }
    canActivate() {
        return Q.resolve(true);
    }
    canDeActivate() {
        return Q.resolve(true);
    }
    compositionComplete() {
        var self = this;
        $( ".button-collapse" ).sideNav( { menuWidth: 300});
        self.bindMenu();
        self.appContext.bindTrans();

        //if(self.appContext.browser.isIE)

        if ( screenfull.enabled ) {
            document.addEventListener( screenfull.raw.fullscreenchange, function () {
               // linkExitFullScreen
                if ( screenfull.isFullscreen ) {
                    $( "#linkFullScreen" ).addClass( "m-hide" );
                    $("#linkExitFullScreen").removeClass("m-hide");
                } else {
                    $( "#linkFullScreen" ).removeClass( "m-hide" );
                    $( "#linkExitFullScreen" ).addClass( "m-hide" );
                }
                console.log( 'Am I fullscreen? ' + ( screenfull.isFullscreen ? 'Yes' : 'No' ) );
            });
        }

        if ( self.appContext.browser.isMSIE ) {
            $( "#modalFrmManager5" ).removeClass( "m-hide" );
            $( "#modalFrmManager5" ).openModal( {
                dismissible: false
            });
        }
      
    }
   
     //#endregion
    
    //#region [@ Initialization Methods     @]

    initializeLoaders() {
        var self = this;
        self.loaderManager = loader;
        self.activeLoader(
            self.loaderManager );

        util.system.utilities.global.removeSuperLoader();
        self.cleanUpInitialStates();
    }
    cleanUpInitialStates() {
        $("#nav").removeClass("m-hide");
        $("#subNav").removeClass("m-hide");
        $("#page").removeClass("m-hide");
    }
    childControlsCreated() {
        var self = this;

        if ( self.appContext.boot() ) {

            self.PersonName(
                self.appContext.identityUser.instance.PersonInfo.FName
                + " " + self.appContext.identityUser.instance.PersonInfo.LName);

            self.initializeLoaders();

            self.activeViewScreen(
                self.viewDetailsManager );

            self.activeBillingFormScreen(
                self.billingFormManager );

            self.activePendingViewScreen(
                self.viewPendingManager );

            self.activeHealthRecordsFormScreen(
                self.formManagerEdge );

            self.activeDependentFormScreen(
                self.dependentFormManager );

            if ( self.appContext.browser.isMSIE ) {
              
            }
           // activeViewScreenUpgrade
           

        }
    }
    cancelUpgrade( data, event ) {
        var self = this;
        $( ".modal-content" ).addClass( "m-hide" );
        $( "#modalFrmManager5" ).closeModal();
        $( "#modalFrmManager5" ).css( "display", "none" );
    }
    //#endregion
    
    //#region [@ Menu Methods       @]

    bindMenu() {

        var self = this;
        self.menuList = [
            $("#linkHome"),
            $("#linkConsultCenter"),
            $("#linkHealthRecords"),
            $("#linkFamilyMembers"),
            $("#linkMyAccount"),
            $("#linkConsultHistory"),
            $( "#linkLogout" ),
            $( "#linkMyProfile" )];
        return true;
    }
    resetMenu() {
        var self = this;
        self.menuList.forEach((item: JQuery) => {
            if (item.hasClass("active")) {
                console.log(item);
                item.removeClass("active");
            }
        });
        return true;
    }

    onNavigationTriggerd( data ) {
        $( "#breadCrumbText" ).css( "opacity", 0 );
        $( "#breadCrumbText" ).css( "left", 200 );
        var self = this;
        if (self.resetMenu()) {
            self.breadText( "" );
            switch (data) {
                case "CONSULT_CENTER":
                    self.menuList[1].addClass( "active" );
                    //  self.appContext.router.navigate( "#consults" );
                    console.warn(self.appContext.selectedOrderType());
                    self.breadText( "/ Consult Center / " );
                    break;
                case "FAMILY_MEMBERS":
                    self.menuList[3].addClass( "active" );
                    self.appContext.router.navigate( "#familymembers" );
                    self.breadText( "/ Family Members" );
                    break;
                case "CONSULT_HISTORY":
                    self.menuList[5].addClass( "active" );
                    self.appContext.router.navigate( "#consulthistory" );
                    self.breadText( "/ Consult History" );
                    break;
            }
            var me = setInterval(() => {
                $( "#breadCrumbText" ).transition( { opacity: 1, x: 0 });
                clearInterval( me );
            }, 300 );
        }
    }
    onGetProfile( data, event ) {
        var self = this;
        if (self.resetMenu()) {
            self.menuList[7].addClass("active");
            self.appContext.router.navigate("#profile");
            self.breadText("/ My Profile");
            var me = setInterval(() => {
                $("#breadCrumbText").transition({ opacity: 1, x: 0 });
                clearInterval(me);
            }, 300);
        }
    }
    onclick(data, event, id) {
        $("#breadCrumbText").css("opacity", 0);
        $("#breadCrumbText").css("left", 200);
        var self = this;
        if (self.resetMenu()) {
            self.breadText("");
            switch (id) {
                case 1:
                    self.menuList[0].addClass("active");
                    self.appContext.router.navigate("#dashboard");
                    self.breadText("/ Dashboard");
                    break;
                case 2:
                    self.menuList[1].addClass("active");
                    self.appContext.router.navigate("#consults");
                    self.breadText("/ Consult Center");
                    break;
                case 3:
                    self.appContext.add();
                    $("#page-container").css("overflow-y", "hidden!important");
                    self.appContext.bootHealthRecords();
                    break;
                case 4:
                    self.menuList[3].addClass("active");
                    self.appContext.router.navigate("#familymembers");
                    self.breadText("/ Family Members");
                    break;
                case 5:
                    self.menuList[4].addClass("active");
                    self.appContext.router.navigate("#accountsettings");
                    self.breadText("/ Account Settings");
                    break;
                case 6:
                    self.menuList[5].addClass("active");
                    self.appContext.router.navigate("#consulthistory");
                    self.breadText("/ Consult History");
                    break;
                case 7:
                    document.location.href = "Logout.aspx";
                    break;
                case 8:
                    self.menuList[7].addClass( "active" );
                    self.appContext.router.navigate( "#profile" );
                    self.breadText( "/ My Profile" );
                    break;
            }
            var me = setInterval(() => {
                $("#breadCrumbText").transition({ opacity: 1, x: 0 });
                clearInterval(me);
            }, 300);
        }
        $(".button-collapse").sideNav("hide");
    }

     //#endregion

    //#region [@ Misc   Methods             @]

    onHealthRecords() {

        var self = this;

        if ( self.resetMenu() ) {

            self.menuList[2].addClass( "active" );
            self.breadText( "/ Health Records" );
            self.appContext.router.navigate( "#healthrecords" );

        }
    }
    
    onGetDependents() {
        alert("SOMEONE_CALLED");
        var self = this;
        self.appContext.service.routes.members.loadDependents(
            self.appContext.bootHealthRecords() ).fail( function () {
            }).done( result => {
                console.log( result );
        });
        return true;
    }

    onCancelLogout(data, event) {
        $("#dialogConfirmLogout").addClass("m-hide");
    }
    onConfirmLogout(data, event) {
        $("#logoutButton").addClass("disabled");
        window.document.location.href = "Logout.aspx";
    }
    onStartLogout(data, event) {
        $("#dialogConfirmLogout").removeClass("m-hide");
    }

    onclickFullScreen( data, event, state ) {
        if (state) {
            if (screenfull.enabled) {
                screenfull.request();
            } else {
                // Ignore or do something else
            }
        } else {
            screenfull.exit();
        }
    }

    closePendingModal(data, event) {
        console.log("mmmmmmmmmmeee")
    }

    //#endregion
}
var vm: IPageModel = new Shell(); export = vm;  