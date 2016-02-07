import ko = require("knockout");
import IPageModel = require("core/IPageModel");
import PageModel = require("core/PageModel");
import OrderCenter = require("components/cart/store");
import OrderCenterUX = require("components/cart/view");
import Layout = require("components/cart/layout");
class Default extends PageModel {
    pageList: IPageModel;
    pageControl:KnockoutObservable<any>;
    store: OrderCenter.components.cart.Store;
    views: OrderCenterUX.components.cart.StoreViewManager;
    constructor() {
        super();
    }
    activate() {
        $("#page").css("background-color", "#ffffff"); return this.databind();
    }
    canActivate() {
        return Q.resolve(true);
    }
    canDeActivate() {
        return Q.resolve(true);
    }
    compositionComplete() {
        var self = this;
        //$(".app_content").css("overflow-y", "auto!important");
        self.appContext.resetViewPort();
        $("#item1").removeClass("m-hide");
        $("#item2").removeClass("m-hide");
        $("#item3").removeClass("m-hide");
       // $( "#editor" ).trumbowyg();
        $( '.parallax' ).parallax();
        if (self.appContext.identityUser.dataContext.data.isPreConsultFlag()) {
            self.appContext.identityUser.dataContext.data.isPreConsultFlag(false);
            self.load();
        }
        self.appContext.resetViewPort();
        $( "#page-container" ).css( "overflow-y", "auto!important" );
        $( "#page" ).css( "overflow-y", "auto!important" );

        $("#pageContainer").removeClass("no-scroll");

    }
    isPricingTable: KnockoutObservable<boolean>;
    phonePrice: KnockoutObservable<string>;
    videoPrice: KnockoutObservable<string>;
    eConsultPrice: KnockoutObservable<string>;
    databind() {
        var self = this;
        //$(".app_content").css("overflow-y", "hidden");
        self.store = new OrderCenter.components.cart.Store();
        self.views = new OrderCenterUX.components.cart.StoreViewManager(self.store);
        self.isPricingTable = ko.observable( true );
        $( "#page-container" ).css( "overflow-y", "auto!important" );
        return Q.resolve(true);
    }
    click(item: any, command: string, data: any, event: any) {
        var self = this;
        switch (command) {
            case "ADD":
                self.store.select(item);
                self.views.layout.isPricingTable(false);
                break;
            case "REMOVE":
                console.log(self.appContext.get_browser_info());
                var browser = self.appContext.get_browser_info();
                if (browser.name === "IE") {
                    if ( document.location.host === "localhost" ) {
                        document.location.assign("http://localhost/members/app/index2.html");
                    } else {
                        document.location.assign( "default.aspx#consults" );
                    }
                }
                if ( !self.views.isOrderProcess() ) {
                    self.store.other("");
                    self.store.cart.instance.recipient("SELF");
                    self.store.select(null);
                    self.views.layout.display(0);
                    self.views.layout.isPricingTable(true);
                    if (!$(Layout.components.cart.ui.StoreSettings.zipCodeRow).hasClass("m-hide")) {
                        $(Layout.components.cart.ui.StoreSettings.zipCodeRow).addClass("m-hide");
                    }
                    self.views.layout.heightOfView2("0");
                    self.views.layout.heightOfView3("0");
                    self.views.index(0);
                    self.views.isNextButton(true);
                    self.views.isSearchButton( false );
                    //alert("me")
                    $( ".cart_step__4__view1" ).addClass( "m-hide" );

                    $( Layout.components.cart.ui.StoreSettings.viewsStepperBar
                    ).removeClass( Layout.components.cart.ui.StoreSettings.hideClass );

                    $( Layout.components.cart.ui.StoreSettings.viewsConsentCheckBox
                    ).addClass( Layout.components.cart.ui.StoreSettings.hideClass );

                    if (!$(".cart_step__5__view1").hasClass("m-hide")) {
                        $(".cart_step__5__view1").addClass("m-hide");
                    }
                }
                $( "#page-container" ).css( "overflow-y", "auto" );
                $( "#page-container" ).css( "overflow-y", "auto!important" );

                break;
        }
    }
    load() {
        var self = this;
        var ar = ko.unwrap(self.store.cart.Products);
        self.store.select(
            ar[self.appContext.selectedOrderType() - 1] );
        self.appContext.selectedOrderType( null );
        self.isPricingTable(false);
        self.views.layout.isPricingTable(false);
    }
    click2(item: any, command: string, data: any, event: any) {
        var self = this;
        console.warn(item);
        switch (command) {
            case "ADD":
                var ar = ko.unwrap(self.store.cart.Products);
                self.store.select(ar[item - 1]);
                self.views.layout.isPricingTable(false);
                break;
            case "REMOVE":
                self.store.other("");
                self.store.cart.instance.recipient("SELF");
                self.store.select(null);
                self.views.layout.isPricingTable( true );
                $( "#page-container" ).css( "overflow-y", "auto!important" );
                break;
        }
    }
    onclick(data, evet, id) {
        var self = this;
        self.appContext.selectedOrderType(id);
        self.appContext.router.navigate("consults/id:" + id);
    }
}
var vm: IPageModel = new Default(); export = vm;  