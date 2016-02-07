import ko = require( "knockout" );
import IPageModel = require( "core/IPageModel" );
import PageModel = require( "core/PageModel" );
import AppStore = require( "sections/consults/viewManager" );
import IModel = require( "models/identity/IPayload" );
import Events = require( "system/events/EventCommand" );
import util = require( "components/cart/tools" );
import Sys = require( "system/utilities/ViewManager" );
class Store extends PageModel {
   
    isCheckOut: KnockoutObservable<boolean>;
    hasCreditCards: KnockoutObservable<boolean>;
    ctxCreditCardList: KnockoutObservableArray<IModel.models.Identity.IPayload.ICreditCartListItem>;
    views: AppStore.cart.ViewManager;
    recipientName: KnockoutObservable<string>;
    recipientHasChildren: KnockoutObservable<boolean>;

    constructor() {
        super();
        var self = this;
        self.recipientName = ko.observable( "" );
        self.isCheckOut = ko.observable( false );
        self.views = new AppStore.cart.ViewManager();
        self.recipientHasChildren = ko.observable( false );
        self.isFlaggedforDependent = ko.observable(false);
    }
    activate() {
        $( "#page" ).css( "background-color", "#ffffff" );
        return this.databind();
    }
    canActivate() {
        return Q.resolve( true );
    }
    canDeActivate() {
        return Q.resolve( true );
    }
    isFlaggedforDependent:KnockoutObservable<boolean>;

    open() {
        var self = this;
        $( "#expandMore" ).addClass( "m-hide" );
        $( "#expandLess" ).removeClass( "m-hide" );
        $( "#cart_item__recipientOther" ).removeClass( "m-hide" );
        var count = self.appContext.identityUser.dependentLists().length;
        $( "#cart_item__recipientOther" ).css( "height", ( count *66 ) +"px" );
        self.isFlaggedforDependent(true);
    }
    close() {
        var self = this;
        $( "#expandLess" ).addClass( "m-hide" );
        $( "#expandMore" ).removeClass( "m-hide" );
        $( "#cart_item__recipientOther" ).addClass( "m-hide" );
        self.views.other(null);
        self.isFlaggedforDependent( false );
    }
    click( id, action, data, event ) {
        var self = this;
        if ( action === "REMOVE" ) {
            self.redirect(); 
        }
    }

    complete(data, event) {
        var self = this;
        self.redirect();
    }

    redirect() {
        if ( document.location.host.indexOf( "localhost" ) !== -1 ) {
            document.location.href = "index2.html?refresh=" + new Date().getMilliseconds();
        } else {
            document.location.href = "Default.aspx?refresh=" + new Date().getMilliseconds();
        }
    }

    compositionComplete() {
        var self = this;
        self.appContext.resetViewPort();
        self.domPage.css( "background-color", "#0c2238" );
        self.views.populate();
        self.recipientName(
            self.appContext.identityUser.instance.PersonInfo.FName
            + " " + self.appContext.identityUser.instance.PersonInfo.LName );

        $( ".slider" ).slider();
        $(".app_content").removeClass("no-scroll");

    }
    callBaseMethod() {
        $( "#app_store_content" ).scrollTop(
            $( "#app_store_content" )[0].scrollHeight - $( "#app_store_content" )[0].clientHeight );
    }
    databind() {
        var self = this;
        self.isCheckOut = ko.observable( false );
        self.hasCreditCards = ko.observable( false );
        self.ctxCreditCardList = ko.observableArray( [] );
        self.appContext.identityUser.instance.CreditCartList.forEach(
            ( item: IModel.models.Identity.IPayload.ICreditCartListItem ) => {
                self.hasCreditCards( true );
                item.ButtonLabel = "Update";
                self.ctxCreditCardList.push( item );
            });
        return Q.resolve( true );
    }
    getCreditCartType( item ) {
        return util.components.cart.tools.ccIconByEnum( item.CCType );
    }
    getCreditCartText( item ) {
        return util.components.cart.tools.ccTextByEnum( item.CCType );
    }
    showNewCardForm( data, event ) {
        var self = this;
        if ( self.initFormManger3() ) {
            ko.postbox.publish(
                Events.system.events.FormCommands.BillingForm );
        }
    }
    initFormManger3() {
        $( ".modal-content" ).removeClass( "m-hide" );
        $( "#modalFrmManager3" ).removeClass( "m-hide" );
        $( "#modalFrmManager3" ).openModal( {
            dismissible: false
        });
        return true;
    }
    onclick( data, event, index ) {
        var self = this,
            ar = ko.mapping.toJS(
                self.views.cart.Products ),
            temp = ar[index - 1];
        $("#app_store_content").addClass("no-scroll");
        console.warn(temp);
        temp.Icon = self.getProductIcon( temp.ProductID ) ;
        self.views.cart.Selected = ko.mapping.fromJS( temp );
        self.views.cart.hasData(true);
        self.isCheckOut( true );
        self.views.activeView( "template_cart_view__0" );
        self.views.cartView1.databind();
        setTimeout(function() {
            $("#app_store_content").removeClass("no-scroll");
        }, 2000);
    }
    selectProduct(data, event, id) {
        //alert(id);
        var self = this;
        switch ( id ) {
            case "SV1":
                self.onclick( data, event, 1 ); break;
            case "SV2":
                self.onclick( data, event, 2 ); break;
            case "SV3":
                self.onclick( data, event, 3 ); break;
            default:
                break;
        }
    }
    onCheckPayment( data, event ) {
        var self = this;
        $( "#errorSelectPayment" ).removeClass( "m-hide" );
    }

    getProductIcon(productID) {
        switch (productID) {
        case "SV1":
            return "contact_phone";
            break;
        case "SV2":
                return "speaker_notes"; break;
        case "SV3":
                return "voice_chat"; break;
        default:
                return "";
        }
    }
    getProductColor( productID ) {
        switch ( productID ) {
            case "SV1":
                return "medium material-icons circle green darken-2";
            case "SV2":
                return "medium material-icons circle yellow darken-2";
            case "SV3":
                return "medium material-icons circle purple darken-3";
            default:
                return "";
        }
    }

    getProductDescription(productID) {
        switch ( productID ) {
            case "SV1":
                return "For an in-depth, comprehensive consultation<br/> with a physician within guaranteed within 2 hour.";
            case "SV2":
                return "You can send a secure e-mail to our doctors <br/>and receive a response within as little as 2-4 hours but always guaranteed within 24 hours.";
            case "SV3":
                return "Talk with a doctor via on-line video <br/>conference usually within 1 hour,<br/> guaranteed within 3 hours.";
            default:
                return "";
        }
    }

    showNotes() {
        var self = this;
        ///  alert("hallo");
        Sys.utilities.Components.Views.DOM.add(
            $( "#divNote" ) );
        Sys.utilities.Components.Views.DOM.remove(
            $( "#divAddNote" ) );
    }
    hideNotes() {
        Sys.utilities.Components.Views.DOM.add(
            $( "#divAddNote" ) );
        Sys.utilities.Components.Views.DOM.remove(
            $( "#divNote" ) );
    }
    activateNotes(data, event) {
        var self = this;
        $("#cart_item__upload___notes").removeClass("m-hide");
        return true;
    }
    

    

// 
    


}
var vm: IPageModel = new Store(); export = vm;  