import ko = require("knockout");
import IPageModel = require("core/IPageModel");
import PageModel = require("core/PageModel");
import IAppContext = require("core/IAppContext");
import AppContext = require("core/AppContext");
//import LG = require("models/identity/IPayload");
import Env = require( "system/events/EventCommand" );
declare var Materialize;
class Dashboard extends PageModel {

    appContext: IAppContext;
    title: KnockoutObservable<string>;

    constructor() {
        super();
        this.appContext = AppContext;}

    activate() {
        $("#page").css("background-color", "#ffffff");$("#modalFrmManager").closeModal();
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
        self.appContext.resetViewPort();
        $( "#page" ).css( "background-color", "#ffffff" );
        $( "#page" ).css( "overflow-y", "hidden!important" );
        $( "#page" ).addClass("no-scroll")
        $( "#pageContainer" ).css( "overflow-y", "hidden!important" );
        $("#pageContainer").addClass("no-scroll");
        var options = [
            { selector: '.card', offset: 300, callback: 'globalFunction()' },
        ];
        $( ".slider" ).slider();
        Materialize.scrollFire( options );
    }
  
    phonePrice      : KnockoutObservable<string>;
    videoPrice      : KnockoutObservable<string>;
    eConsultPrice: KnockoutObservable<string>;

    databind() {
        var self = this;
        self.title = ko.observable( "Welcome" );
        self.phonePrice = ko.observable("");
        self.videoPrice   =ko.observable("");
        self.eConsultPrice = ko.observable( "" );

        self.appContext.identityUser.instance.Products.forEach(( item: any ) => {
            if (item.ProductID === "SV2") {
                this.eConsultPrice(`$${item.MemberPrice.toFixed()}`);
            }
            if (item.ProductID === "SV1") {
                this.phonePrice(`$${item.MemberPrice.toFixed()}`);
            }
            if (item.ProductID === "SV3") {
                this.videoPrice(`$${item.MemberPrice.toFixed()}`);
            }
        });

        //self.appContext.identityUser.dataContext.loadDependents(
        //    self.appContext.identityUser.instance.RolodexItemID );

        return Q.resolve(true);
    }

    onclickHealthRecords() {
        var self = this;
        self.appContext.add();
        $( "#page-container" ).css( "overflow-y", "hidden!important" );

        self.appContext.bootHealthRecords();

        ko.postbox.publish( Env.system.events.GeneralCommands.NAVIGATION_TRIGGERED,
            "HEALTH_RECORDS" );
    }

    onclick(data, evet, id) {
        var self = this;
        self.appContext.selectedOrderType(id);
        self.appContext.identityUser.dataContext.data.isPreConsultFlag(true);
        self.appContext.router.navigate( `consults/id:${id}` );
        ko.postbox.publish( Env.system.events.GeneralCommands.NAVIGATION_TRIGGERED,
            "CONSULT_CENTER" );
    }

    navigateClick( data, evet, id ) {
        var self = this;
        if (id === 1) {
            ko.postbox.publish( Env.system.events.GeneralCommands.NAVIGATION_TRIGGERED,
                "FAMILY_MEMBERS" );
            self.appContext.router.navigate("#accountsettings");
        } else if ( id === 2 ) {
            ko.postbox.publish( Env.system.events.GeneralCommands.NAVIGATION_TRIGGERED,
                "CONSULT_HISTORY" );
            self.appContext.router.navigate( "#consulthistory" );
        }

    }
}
var vm: IPageModel = new Dashboard(); export = vm;  