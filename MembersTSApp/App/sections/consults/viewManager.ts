import ko = require( "knockout" );
import IModel = require( "models/icart" );
import AppContext = require( "core/AppContext" );
import IAppContext = require( "core/IAppContext" );
import ITools = require( "system/utilities/ViewManager" );
import lg = require( "models/rxnt" );
import FileUploader2 = require("components/cart/fileattachment2");
export module cart {
    export class ViewManager {

        //#region [@    PROPERTIES          @]

        picker: PharmacyPicker;
        ctxUpload: FileUploader2;

        appContext: IAppContext;
        session: SessionContext;
        
        cart: IModel.models.icart.IStore;

        index: KnockoutObservable<number>;
        activeView: KnockoutObservable<string>;

        isButtonSet0: KnockoutObservable<boolean>;
        isButtonSet1: KnockoutObservable<boolean>;
        isButtonSet2: KnockoutObservable<boolean>;
        isButtonSet3: KnockoutObservable<boolean>;
        isSearchButton: KnockoutObservable<boolean>;
        isButtonSetComplete: KnockoutObservable<boolean>;

        isProcessingOrder: KnockoutObservable<boolean>;

        isValid:KnockoutObservable<boolean>;
        isValidate: KnockoutComputed<string>;

        isTermsAccepted: KnockoutObservable<boolean>;
        isRequestingTerms: KnockoutObservable<boolean>;
        isConditionsAccepted: KnockoutObservable<boolean>;
        isTermsExpanded: KnockoutObservable<boolean>;

        isLoadingSearch: KnockoutObservable<boolean>;
        hasSearchResults: KnockoutObservable<boolean>;
        heightOfSearchResults: KnockoutObservable<string>;
        
        hasPharmacyBeenSelected: KnockoutObservable<boolean>;

        headerTemplate: KnockoutObservable<string> = ko.observable( "template_cart__header" );
        contentTemplate: KnockoutObservable<string> = ko.observable( "template_cart__content" );

        other: KnockoutObservable<any>;

        /// Focus Factory
        isSelectedReason: KnockoutObservable<boolean>;
        selectedInputFactory : KnockoutComputed<any>;
        isSelectedZipCode: KnockoutObservable<boolean>;
        paymentOption:KnockoutObservable<any>;
        isSelectedTelephone: KnockoutObservable<boolean>;
        isPaymentNotSelected: KnockoutObservable<boolean>;
        ConsultationID: KnockoutObservable<string>;

        //#endregion
        

        onTest(data, event) {
            var self = this;
            $("#app_store_content").scrollTop(400);
        }

        onSearchResults() {
            var self = this;
            $( "#view3Results" ).css( "background-color", "#01579b" );
        }

        toggleTerms(data, event, index) {
            var self = this;
            self.isTermsExpanded( !( index === 0 ) );
        }

        toggle(data, event, index) {
            var self = this;
            self.activeView( `template_cart_view__${index}` );
            if (index === 1) {
                self.isButtonSet1(true);
                self.isButtonSet2( false );
                self.isButtonSet3( false );
            } else if (index === 2) {
                self.isButtonSet1(false);
                self.isButtonSet2(true);
                self.isButtonSet3(false);
            } else if (index === 3) {
                self.isButtonSet1(false);
                self.isButtonSet2( false);
                self.isButtonSet3(true);
            }
        }

        

        reset() {
            var self = this;

            self.isButtonSet0   ( true );
            self.isButtonSet1   (false);
            self.isButtonSet2   (false);
            self.isButtonSet3   (false);
            self.isSearchButton( false );
            self.isButtonSetComplete( false );

            self.hasDependents( false );
          
            self.isTermsAccepted         (false);
            self.isRequestingTerms       (false);
            self.isConditionsAccepted    (false);
            self.hasPharmacyBeenSelected ( false );
        }

        constructor() {

            var self = this;
           
            self.appContext = AppContext;
            self.session = new SessionContext();
            self.picker = new PharmacyPicker( self );
            self.ctxUpload = new FileUploader2(self);

            self.index = ko.observable( 0 );
            self.other = ko.observable();
            self.paymentOption = ko.observable();
            self.hasDependents = ko.observable( false );
            self.isProcessingOrder = ko.observable( false );

            self.ConsultationID = ko.observable("");

            self.isButtonSet0 = ko.observable( true );
            self.isButtonSet1 = ko.observable( false );
            self.isButtonSet2 = ko.observable( false );
            self.isButtonSet3 = ko.observable( false );

            self.isSearchButton = ko.observable( false );
            self.isButtonSetComplete = ko.observable(false);

            self.isTermsAccepted = ko.observable( false );
            self.isTermsExpanded = ko.observable( false );

            self.isRequestingTerms = ko.observable( false );
            self.isConditionsAccepted = ko.observable( false );
            self.hasPharmacyBeenSelected = ko.observable( false );
            
            self.activeView = ko.observable( ViewReference.View__00 );

            self.isValid = ko.observable( false );

            self.isValidate = ko.computed(
                () => ( self.isValid() ? "isValidate" : "" ) );

            self.cart = {
                Selected: null,
                hasData:ko.observable(false),
                instance: {
                    other: ko.observable( "" ),
                    recipient: ko.observable( "SELF" ),
                    selectedState: ko.observable(self.session.SelectedAccountCurrentState() ),
                    selectedZipCode: ko.observable( "" ),
                    selectedPharmacy: ko.observable( "" ),
                    data: new IModel.models.icart.Reason(),
                    payment: new IModel.models.icart.Payment()
                },
                Products:
                    self.appContext.identityUser.instance.Products,
            };

            self.isLoadingSearch = ko.observable( false );
            self.hasSearchResults = ko.observable( false );
            self.heightOfSearchResults = ko.observable( "0!important;" );

            self.cartView1 = new View_1();
            self.cartView2 = new View_2();

            /// Focus factory
            self.isSelectedReason = ko.observable( false );
            self.isSelectedZipCode   = ko.observable( false );
            self.isSelectedTelephone = ko.observable( false );
            self.selectedInputFactory = ko.computed(function() {
                if (self.isSelectedTelephone()) {
                   if (self.index() === 2) {
                      // self.callFocusMethod();
                       $( "#app_store_content" ).scrollTop( 400 );
                   }
                }
                if ( self.isSelectedZipCode() ) {
                    if ( self.index() === 3 ) {
                      //  self.callFocusMethod();
                        $( "#app_store_content" ).scrollTop( 400 );
                    }
                }
                if ( self.isSelectedReason() ) {
                    if ( self.index() === 4 ) {
                        $( "#app_store_content" ).scrollTop( 400 );
                      //  self.callFocusMethod();
                    }
                }
            });

            self.hasDependents = ko.observable(false);
            self.accounts = ko.observableArray( [] );
            
           // self.getDependents();

            //$(isButtonSet3
        }

        checkoutHandler( data, event ) {
            var self = this;
            //
            if ( self.paymentOption() === null || self.paymentOption() === undefined ) {
                $( "#liErrorItem_PaymentRequired" ).removeClass( "m-hide" );
            } else {
                $( "#liErrorItem_PaymentRequired" ).addClass( "m-hide" );
                self.processOrder();

            }
        }
        onuploadSuccess() {
            var self = this;
            var server = document.location.host.indexOf("localhost") !== -1 ? "index2.html#consulthistory" : "default.aspx#consulthistory";
            document.location.href = server;
            console.log("upload");
        }
        processOrder() {
            var self = this;
            $( "#app_store_content" ).scrollTop( 0 );
            self.isProcessingOrder( true );

            var item = new IModel.models.icart.OrderInput();

            item.MSPRID = 100;

            item.PreferredPharmacyRID
                = self.cart.instance.selectedPharmacy().pharmacyIdField;

            item.ChiefComplaint
                = self.cart.instance.data.reason();

            item.StateCodeRecipientLocatedDuringConsultation
                = self.cart.instance.selectedState();

            item.ConsultationMemberAdjustedPrice = 0;
            item.ConsultationClientAdjustedPrice = 0;

            var cleanPhone = self.cart.instance.data.phone()
                .replace( "(", "" )
                .replace( ")", "" )
                .replace( " ", "" )
                .replace( "-", "" );

            item.ContactInfoOfRecipientDuringConsultation
                = cleanPhone;

            item.AlternativeMedicalCareType
                = self.cart.instance.data.alternative();

            item.GuarantorAccountID
                = self.session.AccountID();

            if (self.other() !== null && self.other() !== undefined) {
                item.ConsultationRecipientAccountID = self.other();
            } else {
                item.ConsultationRecipientAccountID
                    = self.session.SelectedAccountID();
            }

            item.PlacedByRID
                = self.session.RID();

            item.ProductID
                = self.cart.Selected.ProductID();

            item.IsTesting = true;

            //#endregion

            if ( self.cart.instance.selectedPharmacy()
                != null && self.cart.instance.selectedPharmacy != undefined ) {
                item.RxNTPharmacyID = self.cart.instance.selectedPharmacy().pharmacyIdField;
                item.IsReRouting = false;
                var order = {
                    OrderInput: item,
                    OrderInputResponse: null,
                    OrderAction: 0,
                    OrderResult: 0
                }
                self.appContext.service.routes.members.saveOrder( order ).fail( () => {

                }).done( data => {
                    this.processOrderHandler( data );
                });
            }
           
        }
        processOrderHandler(data) {
            var self = this;
            self.ConsultationID(
                data.OrderInputResponse.StartOrderProcessStatusDetails.ConsultationStatusDetails.ConsultationID );
            self.isProcessingOrder( false );
            self.isButtonSet3( false );
            self.isButtonSetComplete( true );
            self.activeView("template_cart_view__4");
        }

        debugUpload() {
            var self = this;
            self.isButtonSet3( false );
            self.isButtonSetComplete( true );
            self.activeView( "template_cart_view__4" );
        }
        setClickHandler() {
            var self = this;
            $( "#checkOutButtonMaterial" ).on( "click", self.checkoutHandler);
        }
        populate() {

            var self = this;

            self.reset();

            self.index( 0 );

            self.isButtonSet0(true);
            self.isButtonSetComplete( false );

            $(  InputReference.ZipCode ).mask(
                RegXSettings.CCV );

            $( InputReference.PhoneNumber ).mask(
                RegXSettings.PHONE_US );
            
            InputReference.initForm(
                $( InputReference.PhoneNumber ), self );

            InputReference.initFormSearch(
                $( InputReference.ZipCode ), self );

            self.cartView1.databind();

            if ( self.appContext.identityUser.dataContext.data.hasDependents() ) {
                self.accounts.removeAll();
                ko.utils.arrayForEach( self.appContext.identityUser.dataContext.data.dependents(), function ( item ) {
                    self.hasDependents( true );
                    if ( item.RID !== self.appContext.identityUser.instance.RolodexItemID ) {
                        self.accounts.push( item );
                    }
                });
            }

        
        }
        
        debug() {
            var self = this;
            // DEBUG
            self.isButtonSet0( false );
            self.isButtonSet1( false );
            self.isButtonSet2( false );
            self.isButtonSet3( true );

            self.isRequestingTerms( true );

            self.activeView( ViewReference.View__03 );
        }

        onNext( data, event ) {
            var self = this;
            if ( self.onValidate() ) {
                self.index( self.index() + 1 );
                if (self.index() < 3) {
                    DOM.add( self.cartView1.elements()[self.index()] );
                }
            }
        }  

        onBack(data, event) {
            var self = this;
            switch(self.index()) {
                
            }
        }


        showNoteRow() {
            $("#cart_item__upload___notes").removeClass("m-hide");
            //   
        }
        onSearch( data, event ) {

            var self = this;
            if (self.cart.instance.selectedZipCode() === "") {
                DOM.add($(Settings.cart_item__zipcode___required));
                return false;
            } else {
                DOM.hide( $( Settings.cart_item__zipcode___required ) );

                self.picker.onSearch(
                    data, event );

                self.isLoadingSearch( true );

                //ToDo: Verify if needed.
                self.heightOfSearchResults( "400px" );
                DOM.add( $( Settings.cart_item__pharmacy___results ) );

            }

        }

        onIAgreeContinue( data, even ) {
            var self = this;

            self.activeView( ViewReference.View__01 );

            self.cartView1.databind();
            self.isButtonSet1( true );
            self.isButtonSet0( false );

        }

        hasFocusPhone( data, event ) {
          ///  alert("gello")
        }
       
        onValidate() {
            var self = this;
            console.log( self.index() );
           // self.debugUpload();
           // return;
            switch ( self.index() ) {
                case 0:
                    if (self.cart.Selected.ProductID() === "SV2") {
                        self.index(2);self.onValidate();
                    } else {
                        DOM.add(self.cartView1.elements()[0]);
                        if (self.cart.instance.selectedState() === "") {
                            return false;
                        }
                    }
                    break;
                case 1:
                     
                        if (self.cart.instance.selectedState() === "") {
                            return false;
                        } else {
                            self.isButtonSet1( false );
                            self.isSearchButton( true );
                            InputReference.initFormSearch($(InputReference.ZipCode), this);
                        }
                    break;
                case 2:
                    self.activeView(ViewReference.View__02 );
                    self.cartView2.databind();
                    DOM.add( self.cartView1.elements()[0] );
                    $("#app_store_content").scrollTop(0);
                    break;
                case 3:
                    if ( self.cart.instance.data.reason() === "" ) {
                        DOM.add( self.cartView2.elementsRequired()[0] );
                        return false;
                    } else {
                        if ( self.cart.Selected.ProductID() === "SV2" ) {

                            console.warn(self.other())

                            DOM.hide(self.cartView2.elementsRequired()[2]);

                            self.isButtonSet0(false);
                            self.isButtonSet1(false);
                            self.isButtonSet2(false);
                            self.isButtonSet3(true);

                            self.isRequestingTerms(true);

                            self.activeView(ViewReference.View__03);

                            $("#app_store_content").scrollTop(0);
                        } else {
                            DOM.add( self.cartView2.elements()[1] );
                            DOM.hide( self.cartView2.elementsRequired()[0] );
                            InputReference.mask(
                                $( InputReference.PhoneNumber ),
                                RegXSettings.PHONE_US );
                            }

                    }
                    break;
                case 4:
                    if ( self.cart.instance.data.phone() === "" ) {
                        self.isSelectedTelephone( true );
                        DOM.add( self.cartView2.elementsRequired()[1]  );
                        return false;
                    } else {
                        DOM.add( self.cartView2.elements()[2] );
                        DOM.hide( self.cartView2.elementsRequired()[1] );
                    }
                    break;
                case 5:
                    if ( self.cart.instance.data.alternative() === "" ) {
                        DOM.add( self.cartView2.elementsRequired()[2] );
                        DOM.add($("#errorSelectPayment"));
                        return false;
                    } else {

                        DOM.hide( self.cartView2.elementsRequired()[2] );

                        self.isButtonSet0( false );
                        self.isButtonSet1( false );
                        self.isButtonSet2( false );
                        self.isButtonSet3( true );

                        self.isRequestingTerms( true );

                        self.activeView( ViewReference.View__03 );

                        $( "#app_store_content" ).scrollTop( 0 );
                      //  self.setClickHandler();

                    }
                    break;
                case 6:
                    
                    return false;
                  break;
            }

          
            return true;
        }
        
        cartView1: View_1;
        cartView2: View_2;
        

        accounts: KnockoutObservableArray<any>;
        hasDependents: KnockoutObservable<boolean>;

        /// ToDo: Remove
        /// obsolete
        getDependents() {
            var self = this;
            self.accounts.removeAll();
            if (self.appContext.identityUser.dataContext.data.hasDependents()) {
                ko.utils.arrayForEach(self.appContext.identityUser.dependentLists(), item => {
                    self.hasDependents(true);
                    if ( item.RID !== self.appContext.identityUser.instance.RolodexItemID) {
                        self.accounts.push(item);
                    }
                });
            } else {
                self.hasDependents( false );
            }
        }
        getIcon( arg ) {
            return IModel.models.icart.RxIcon.getIcon( arg );
        }
    }
    export class View_1 {
        elements: KnockoutObservableArray<JQuery>;
        elementsRequired: KnockoutObservableArray<JQuery>;
        constructor() {
            var self = this;
        }
        databind() {
            var self = this;
            self.elements = ko.observableArray( [
                $( Settings.cart_item__recipient ),
                $( Settings.cart_item__state ),
                $( Settings.cart_item__pharmacy )
            ] );
            self.elementsRequired = ko.observableArray( [
                $( Settings.cart_item__reason___required ),
                $( Settings.cart_item__phone___required ),
                $( Settings.cart_item__where___required )
            ] );

        }
        reset() {
            var self = this;
            ko.utils.arrayForEach(self.elements(),(item: JQuery) => {
                DOM.hide(item);
            });
        }
    }
    //$( Settings.cart_item__consent
    export class View_2 {
        elements: KnockoutObservableArray<JQuery>;
        elementsRequired: KnockoutObservableArray<JQuery>;
        constructor() {}
        databind() {
            var self = this;
            self.elements = ko.observableArray( [
                $( Settings.cart_item__reason ),
                $(Settings.cart_item__phone),
                $(Settings.cart_item__where)
            ] );
            self.elementsRequired = ko.observableArray( [
                $( Settings.cart_item__reason___required ),
                $( Settings.cart_item__phone___required ),
                $( Settings.cart_item__where___required )
            ] );
        }
        reset() {
            var self = this;
            ko.utils.arrayForEach( self.elements(), ( item: JQuery ) => {
                DOM.hide( item );
            });
        }
    }
    export class DOM {
        static css( prop: string,
            value: string,
            dom: JQuery ) {
            dom.css( prop, value );
        }
        static add( dom: JQuery ) {
            dom.removeClass(
                ITools.utilities.Components.Views.Settings.CSS_HIDE );
        }
        static hide( dom: JQuery ) {
            if (! dom.hasClass(ITools.utilities.Components.Views.Settings.CSS_HIDE)) {
                dom.addClass(ITools.utilities.Components.Views.Settings.CSS_HIDE);
            }
        }
        static remove( dom: JQuery, classoveride?: string ) {
            if ( !dom.hasClass( classoveride !== null && classoveride !== undefined ? classoveride : ITools.utilities.Components.Views.Settings.CSS_HIDE ) ) {
                dom.addClass( classoveride !== null && classoveride !== undefined
                    ? classoveride : ITools.utilities.Components.Views.Settings.CSS_HIDE );
            }
        }
    }
    export class Settings {

        static cart_item__state = "#cart_item__state";
        static cart_item__state___required = "#require_item__reason";

        static cart_item__zipcode = "#cart_item__zipcode";
        static cart_item__zipcode___required = "#require_item__zipcode";

        static cart_item__reason = "#cart_item__Reason";
        static cart_item__reason___required = "#require_item__reason";
  
        static cart_item__phone = "#cart_item__Phone";
        static cart_item__phone___required = "#require_item__phone";

        static cart_item__where = "#cart_item__Where";
        static cart_item__where___required = "#require_item__where";

        static cart_item__consent = "#cart_item__Consent";

        static cart_item__pharmacy = "#cart_item__Pharmacy";
        static cart_item__pharmacy___results = "#cart_item__Pharmacy___results";

        static cart_item__recipient = "#cart_item__recipient";
        static cart_item__recipientOther = "#cart_item__recipientOther";
    }
    export class InputReference {
        static ZipCode = "#inputZipCode";
        static PhoneNumber = "#inputTelephone";
        static initForm( input, parent ) {
            var itemCallBack = parent;
            input.keydown( event => {
                var charCode = ( event.which ) ? event.which : event.keyCode;
                if ( event.keyCode === 10 || event.keyCode === 13 ) {
                    itemCallBack.onNext( input, event );
                    event.preventDefault();
                }
                if ( $.inArray( charCode, [46, 8, 9, 27, 13, 110, 190] ) !== -1 ||
                    ( charCode === 65 && event.ctrlKey === true ) ||
                    charCode >= 35 && charCode <= 40 ) {
                    // let it happen, don't do anything
                    return;
                }
                // Allow: home, end, left, right, down, up
                return ( ( charCode >= 35 && charCode <= 40 ) // arrow keys/home/end
                    || ( charCode >= 48 && charCode <= 57 ) // numbers on keyboard
                    || ( charCode >= 96 && charCode <= 105 ) );
            });
        }
        static initFormSearch( input, parent ) {
            var itemCallBack = parent;
            input.keydown( event => {
                var charCode = ( event.which ) ? event.which : event.keyCode;
                if ( event.keyCode === 10 || event.keyCode === 13 ) {
                    itemCallBack.onSearch( input, event );
                    event.preventDefault();
                }
                if ( $.inArray( charCode, [46, 8, 9, 27, 13, 110, 190] ) !== -1 ||
                    ( charCode === 65 && event.ctrlKey === true ) ||
                    charCode >= 35 && charCode <= 40 ) {
                    // let it happen, don't do anything
                    return;
                }
                // Allow: home, end, left, right, down, up
                return ( ( charCode >= 35 && charCode <= 40 ) // arrow keys/home/end
                    || ( charCode >= 48 && charCode <= 57 ) // numbers on keyboard
                    || ( charCode >= 96 && charCode <= 105 ) );
            });
        }

        static mask(input: JQuery, expression: string) {
            input.mask(expression);
        }

    }
    export class ViewReference {

        static View__00 = "template_cart_view__0";
        static View__01 = "template_cart_view__1";
        static View__02 = "template_cart_view__2";
        static View__03 = "template_cart_view__3";
        static View__04 = "template_cart_view__4";

        static View__Prefix = "template_cart_view__";
    }
    export class RegXSettings {
        static CCV = "99999";
        static PHONE_US = "(999) 999-9999";
    }
    export class SessionContext {

        appContext: IAppContext;

        RID: KnockoutObservable<number>;
        Name: KnockoutObservable<string>;
        AccountID: KnockoutObservable<number>;

        SelectedRID: KnockoutObservable<number>;
        SelectedName: KnockoutObservable<string>;
        SelectedAccountID: KnockoutObservable<number>;
        SelectedAccountZipCode: KnockoutObservable<string>;
        SelectedAccountCurrentState: KnockoutObservable<string>;

        Entity: any;

        constructor() {

            var self = this;
            self.appContext = AppContext;

            self.appContext.identityUser.instance.AccountInfo.Account
             = self.appContext.identityUser.instance.AccountInfo.AccountInfo;

            self.RID = ko.observable(
                self.appContext.identityUser.instance.RolodexItemID );

            self.Name = ko.observable(
                self.appContext.identityUser.instance.PersonInfo.FName
                + " "
                + self.appContext.identityUser.instance.PersonInfo.LName );

            self.AccountID = ko.observable(
                self.appContext.identityUser.instance.AccountInfo.Account.AccountID );

            self.SelectedAccountID = ko.observable(
                self.appContext.identityUser.instance.AccountInfo.Account.AccountID );

            if (self.appContext.identityUser.instance.Entity.Addresses.length > 0) {

            self.SelectedAccountCurrentState = ko.observable(
                self.appContext.identityUser.instance.Entity.Addresses[0].State );

            self.SelectedAccountZipCode = ko.observable(
                self.appContext.identityUser.instance.Entity.Addresses[0].ZipCode );
            }

            self.SelectedRID
                = ko.observable( self.appContext.identityUser.instance.AccountInfo.Account.RID );

            self.SelectedName
            = ko.observable( self.Name() );

           

        }
        
    }
    export class PharmacyPicker {
        parent: ViewManager;


        title: KnockoutObservable<string>;
        list: KnockoutObservableArray<any>;
        isLoadingSearch: KnockoutObservable<boolean>;
        hasPharmaciesSearchResults: KnockoutObservable<boolean>;

        appContext: IAppContext;
        constructor( ctx ) {
            var self = this;
            self.parent = ctx;
            self.appContext = AppContext;
            self.isLoadingSearch = ko.observable( false ); 
            self.hasPharmaciesSearchResults = ko.observable( false ); 
            self.title = ko.observable( "Search" );
            self.list = ko.observableArray( [] );
        }
        onSelectPharmacy( arg, data, event ) {
            var self = this;
            self.parent.cart.instance.selectedPharmacy( arg );
            $("#cart_item__Pharmacy").addClass("m-hide");
            self.parent.isSearchButton( false );
            self.parent.isButtonSet1( true );
            self.parent.hasPharmacyBeenSelected(true);
        }
        search( value: string ) {
            var self = this;
            self.list.removeAll();
            self.appContext.service.routes.members.searchPharmacies( value ).fail( function () { }).done( function ( data ) {
             //   console.log(data)
                data.forEach(( item: lg.models.rxnt.IPharmacy ) => {
                    self.list.push( item );
                });
                console.log(self.list());
               self.onSearchResults();
            });
        }
        onSearchResults() {
            var self = this;
            self.parent.hasSearchResults( true );
            self.parent.isLoadingSearch(false);
        }
        onSearch( data, event ) {
            console.log( "hello" );
            var self = this,
                zipCode = self.parent.cart.instance.selectedZipCode();
            if ( zipCode === "" ) {
                self.error();
            } else {
            //    self.parent.initSearchScreen();
                self.resetError();
                self.search( zipCode );
            }
        }
        error() {
            $( "#errorIconZipCode" ).removeClass( "m-hide" );
        }
        resetError() {
            if ( !$( "#errorIconZipCode" ).hasClass( "m-hide" ) ) { $( "#errorIconZipCode" ).addClass( "m-hide" ); }
        }
    }
}

