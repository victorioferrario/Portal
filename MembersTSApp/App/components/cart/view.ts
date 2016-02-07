/// <reference path="../../../scripts/typings/tinymce/tinymce.d.ts" />
import ordering = require( "components/cart/store" );
import html = require( "components/cart/layout" );
import lg = require( "models/rxnt" );
import util = require( "components/cart/tools" );
import processing = require( "models/icart" );
import IAppContext = require( "core/IAppContext" );
import AppContext = require( "core/AppContext" );
import FileAttachments = require( "components/cart/fileattachment" );
export module components.cart {
    export class PharmacyPicker {
        parent: StoreViewManager;
        title: KnockoutObservable<string>;
        list: KnockoutObservableArray<any>;
        appContext: IAppContext;
        constructor( ctx ) {
            var self = this;
            self.parent = ctx;
            self.appContext = AppContext;
            self.title = ko.observable( "Search" );
            self.list = ko.observableArray( [] );
        }
        onSelectPharmacy( arg, data, event ) {
            var self = this;
            self.parent.store.cart.instance.selectedPharmacy( arg );
            self.parent.layout.hasPharmacyBeenSelected( true );
            self.parent.onNext( data, event );
        }
        search( value: string ) {
            var self = this;
            self.list.removeAll();
            self.appContext.service.routes.members.searchPharmacies( value ).fail( function () { }).done( function ( data ) {
                data.forEach(( item: lg.models.rxnt.IPharmacy ) => {
                    self.list.push( item );
                });
                self.parent.onSearchResults();
            });
        }
        onSearch( data, event ) {
            console.log( "hello" );
            var self = this,
                zipCode = self.parent.store.cart.instance.selectedZipCode();
            if ( zipCode === "" ) {
                self.error();
            } else {
                self.parent.layout.initSearchScreen();
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
    export class Util {
        static initForm( parent ) {
            var itemCallBack = parent;
            $( "#inputZipCode" ).keydown( event => {
                var charCode = ( event.which ) ? event.which : event.keyCode;
                if ( event.keyCode === 10 || event.keyCode === 13 ) {
                    itemCallBack.onSearch();
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
    }
    export class StoreViewManager {

        index: KnockoutObservable<number>;
        appContext: IAppContext;
        picker: PharmacyPicker;
        store: ordering.components.cart.Store;
        layout: html.components.cart.ui.StoreLayoutManager;

        isNextButton: KnockoutObservable<boolean>;
        isSearchButton: KnockoutObservable<boolean>;

        ctxUpload: FileAttachments;

        isConsentChecked: KnockoutComputed<string>;
        isNextConsentButton: KnockoutObservable<boolean>;
        isDependentError: KnockoutObservable<boolean>;
        isOrderProcess: KnockoutObservable<boolean>;
        isProcessingOrder: KnockoutComputed<string>;

        isDebug: boolean;
        isTermsAccepted: KnockoutObservable<boolean>;
        isTermsChecked: KnockoutComputed<string>;
        isCheckoutSteps: KnockoutObservable<boolean>;
        isCheckoutFinalSteps: KnockoutObservable<boolean>;
        isProcessingPayment: KnockoutObservable<boolean>;
        TermsText: KnockoutObservable<string>;

        isConsultationEConsult: KnockoutComputed<boolean>;

        isEConsult: KnockoutObservable<boolean>;

        orderCompleteMessage: KnockoutObservable<string>;

        constructor( store: ordering.components.cart.Store ) {
            var self = this;
            self.appContext = AppContext;
            /*  ===========================================
            *   [DEGUGGING]================================
            *   =========================================== */
            self.isDebug = false;
            /*  ===========================================
           *   [DEGUGGING]================================
           *   =========================================== */
            self.store = store;
            self.index = ko.observable( 0 );
            self.picker = new PharmacyPicker( this );
            self.layout = new html.components.cart.ui.StoreLayoutManager( store );

            self.isNextButton = ko.observable( true );
            self.isSearchButton = ko.observable( false );
            self.isNextConsentButton = ko.observable( false );

            self.TermsText = ko.observable( "" );

            self.isDependentError = ko.observable( false );

            self.isOrderProcess = ko.observable( false );
            self.isCheckoutSteps = ko.observable( true );
            self.isTermsAccepted = ko.observable( false );

            self.isProcessingPayment = ko.observable( false );
            self.isCheckoutFinalSteps = ko.observable( false );

            self.isTermsChecked = ko.computed(() => (
                self.isTermsAccepted() ? "waves-effect waves-light btn green white-text" : "btn disabled" ) );

            self.isConsentChecked = ko.computed(() => (
                self.isNextConsentButton() ? "waves-effect waves-light btn green white-text" : "btn disabled" ) );

            self.isProcessingOrder = ko.computed(() => (
                !self.isOrderProcess() ? "waves-effect waves-light btn red darken-2 white-text cart_item__remove" : "btn disabled cart_item__remove" ) );

            self.isEConsult = ko.observable( false );

            self.isConsultationEConsult = ko.computed(
                () => this.isEConsult() );

            self.ConsultationID = ko.observable( "" );
            self.ctxUpload = new FileAttachments( self );
            self.orderCompleteMessage = ko.observable( "" );



        }

        ConsultationID: KnockoutObservable<string>;

        onSearchResults() {
            var self = this;
            self.isSearchButton( false );
            self.layout.isLoadingSearch( false );
            self.layout.hasPharmaciesSearchResults( true );
            $( "#view3Results" ).css( "background-color", "#01579b" );
        }

        onNext( data, event ) {
            var self = this;
            self.index( self.index() + 1 );
            switch ( self.index() ) {
                case 1:
                    var hasErrorFlag = false;
                    if ( self.store.cart.instance.recipient() === "OTHER" ) {
                        if ( self.store.other() !== undefined ) {
                            self.store.accounts().forEach( item => {
                                if ( item.AccountID === self.store.other() ) {
                                    self.store.session.SelectedRID( item.RID );
                                    self.store.session.SelectedName( item.FName + " " + item.LName );
                                }
                            });
                            hasErrorFlag = false;
                            self.isDependentError( false );
                            self.store.isOverrideInPlace( true );
                        } else {
                            self.index( self.index() - 1 );
                            self.isDependentError(true);
                            hasErrorFlag = true;
                        }
                    } else {
                        self.store.session.SelectedRID( self.store.session.RID() );
                        self.store.session.SelectedName( self.store.session.Name() );
                    }
                    if ( !hasErrorFlag ) {
                        if ( self.store.cart.Selected.ProductID() === "SV2" ) {

                            self.index( 3 );

                            self.isEConsult( true );

                            self.layout.heightOfView3( "0" );

                            self.layout.heightOfView3Results( "0" );

                            $( "#view2Row" ).removeClass( "z-depth-2" );

                            $( "#viewConsentForm" ).removeClass( "m-hide" );

                            $( ".cart_step__4__view1" ).removeClass( "m-hide" );

                            // Toggle Consent Check box
                            $( html.components.cart.ui.StoreSettings.viewsStepperBar
                            ).addClass( html.components.cart.ui.StoreSettings.hideClass );

                            $( html.components.cart.ui.StoreSettings.viewsConsentCheckBox
                            ).removeClass( html.components.cart.ui.StoreSettings.hideClass );

                            self.layout.isSelectingPerson( false );

                        } else {
                            self.isEConsult( false );
                            self.layout.display( 1 );
                        }
                    }

                    break;
                case 2:
                    self.isNextButton( false );
                    self.isSearchButton( true );

                    self.layout.display( 2 );

                    Util.initForm( self.picker );

                    break;
                case 3:

                    self.layout.heightOfView3( "100px" );

                    self.layout.heightOfView3Results( "0" );

                    $( "#view2Row" ).removeClass( "z-depth-2" );

                    $( "#viewConsentForm" ).removeClass( "m-hide" );

                    $( ".cart_step__4__view1" ).removeClass( "m-hide" );

                    // Toggle Consent Check box
                    $( html.components.cart.ui.StoreSettings.viewsStepperBar
                    ).addClass( html.components.cart.ui.StoreSettings.hideClass );

                    $( html.components.cart.ui.StoreSettings.viewsConsentCheckBox
                    ).removeClass( html.components.cart.ui.StoreSettings.hideClass );

                    break;

                case 4:

                    if ( self.isNextConsentButton() ) {

                        $( html.components.cart.ui.StoreSettings.cssView4 ).addClass( "m-hide" );
                        $( html.components.cart.ui.StoreSettings.cssView5 ).removeClass( "m-hide" );

                        ko.bindingHandlers['wysiwyg']["defaults"] = {
                            "plugins": ["link"],
                            "toolbar": "undo redo | bold italic | bullist numlist | link",
                            "menubar": false,
                            "statusbar": false,
                            "setup"(editor) {
                                console.log( editor );
                                editor.on( "init", e => {
                                    console.log( e );
                                    console.log( "wysiwyg initialised" );
                                });
                            }
                        };
                        //  $( "#editor" ).trumbowyg();
                        tinymce.on( "AddEditor", o => {
                            console.log( "AddEditor", o );
                            $( "#inputReasonForConsult_ifr" ).attr( "style", "height:200px!important;" );
                        });
                        tinymce.init( {
                            selector: "#inputReasonForConsult"
                        });
                        tinymce.init( { selector: "#inputReasonForConsult" });

                        $( "#inputPhoneNumber" ).mask( "(999) 999-9999" );

                        // Toggle Consent Checkbox
                        if ( self.isDebug ) {
                            self.store.cart.instance.data.phone( "3057767366" );
                            self.store.cart.instance.data.reason( "I have a soar throat." );
                            self.store.cart.instance.data.alternative( 1 );
                        }

                        $( "#backButtonInstance" ).removeClass( "m-hide" );

                        $( html.components.cart.ui.StoreSettings.viewsConsentCheckBox
                        ).addClass( html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.viewsStepperBar
                        ).removeClass( html.components.cart.ui.StoreSettings.hideClass );

                        self.isNextButton( true );
                        //self.isNextButton(true);

                    } else {
                        self.index( self.index() - 1 );
                    }
                    break;
                case 5:

                   // alert( $( "#inner-editor" ).html() );

                    self.store.cart.instance.data.reason(
                        tinymce.activeEditor.getContent() );

                    if ( self.isEConsult() ) {

                        tinymce.activeEditor.remove();

                        self.store.cart.instance.data.phone( "econsul@1800md.com" );

                        self.store.cart.instance.data.alternative( 1 );

                    }

                   // console.log( tinymce.activeEditor.getContent() );

                   

                    if ( self.store.cart.instance.data.phone() !== ""
                        && self.store.cart.instance.data.reason() !== ""
                        && self.store.cart.instance.data.alternative() !== "" ) {

                        $( html.components.cart.ui.StoreSettings.cssView1 ).addClass(
                            html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.cssView2 ).addClass(
                            html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.cssView3 ).addClass(
                            html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.cssView4 ).addClass(
                            html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.cssView5 ).addClass(
                            html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.viewsStepperBar
                        ).addClass( html.components.cart.ui.StoreSettings.hideClass );

                        // Show
                        $( html.components.cart.ui.StoreSettings.cssStep6View1 ).removeClass(
                            html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.cssStep6View2 ).removeClass(
                            html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.cssStep6View3 ).removeClass(
                            html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.viewsTermsCheckbox
                        ).removeClass( html.components.cart.ui.StoreSettings.hideClass );

                        self.TermsText( `I agree to pay 1800MD in the amount of $${self.store.cart.Selected.MemberPrice() }, for a ${self.store.cart.Selected.ProductLabel() }` );

                        self.isCheckoutSteps( false );

                        self.isCheckoutFinalSteps( true );

                        self.setupCreditCardValidation();

                        var cleanPhone = self.store.cart.instance.data.phone().replace( "(", "" ).replace( ")", "" ).replace( " ", "" ).replace( "-", "" );

                        if ( self.isDebug ) {
                            self.populateCreditCardScreen();
                        }

                        console.log( self.store.cart.instance.selectedPharmacy() );

                    } else {
                        self.index( self.index() - 1 );
                    }
                    break;
            }
        }
        setupCreditCardValidation() {
            $( "#inputCreditCard" ).mask(
                "9999-9999-9999-9999" );
            $( "#inputCreditCard" ).validateCreditCard( result => {
                $( ".log" ).html(( result.card_type == null ?
                    "-" : util.components.cart.tools.ccIcon( result.card_type.name ) ) );
            });
        }
        onDone() {
            var self = this;
            console.log( "done" );
            self.ctxUpload.listDisplay.removeAll();
        }
        onPaymentNext( data, event ) {
            var self = this;
            if (
                self.store.cart.instance.payment.CreditCard.NameOnCard() !== "" &&
                self.store.cart.instance.payment.CreditCard.CardNumber() !== "" &&
                self.store.cart.instance.payment.CreditCard.CardExpirationMonth() !== "" &&
                self.store.cart.instance.payment.CreditCard.CardExpirationYear() !== "" &&
                self.store.cart.instance.payment.CreditCard.CardCCV() !== "" &&
                self.store.cart.instance.payment.BillingAddress.Address1() !== "" &&
                self.store.cart.instance.payment.BillingAddress.City() !== "" &&
                self.store.cart.instance.payment.BillingAddress.State() !== "" &&
                self.store.cart.instance.payment.BillingAddress.ZipCode() !== "" ) {

                self.isOrderProcess( true );

                $( "#viewsTermsAndConditionsCheckout" ).addClass( "m-hide" );

                var item = new processing.models.icart.OrderInput();

                item.MSPRID = 100;

                item.PreferredPharmacyRID
                = self.store.cart.instance.selectedPharmacy().pharmacyIdField;

                item.ChiefComplaint
                = self.store.cart.instance.data.reason();

                item.StateCodeRecipientLocatedDuringConsultation = self.store.cart.instance.selectedState();

                item.ConsultationMemberAdjustedPrice = 0;
                item.ConsultationClientAdjustedPrice = 0;

                var cleanPhone = self.store.cart.instance.data.phone()
                    .replace( "(", "" )
                    .replace( ")", "" )
                    .replace( " ", "" )
                    .replace( "-", "" );

                item.ContactInfoOfRecipientDuringConsultation = cleanPhone;

                item.AlternativeMedicalCareType
                = self.store.cart.instance.data.alternative();

                item.GuarantorAccountID
                = self.store.session.AccountID();

                item.ConsultationRecipientAccountID
                = self.store.session.SelectedAccountID();

                item.PlacedByRID
                = self.store.session.RID();
                item.ProductID
                = self.store.cart.Selected.ProductID();

                item.IsTesting = true;

                if ( self.store.cart.instance.selectedPharmacy()
                    != null && self.store.cart.instance.selectedPharmacy != undefined ) {
                    item.RxNTPharmacyID = self.store.cart.instance.selectedPharmacy().pharmacyIdField;
                    //}
                    item.IsReRouting = false;
                    var order = {
                        OrderInput: item,
                        OrderInputResponse: null,
                        OrderAction: 0,
                        OrderResult: 0
                    }
                    self.isProcessingPayment( true );

                    self.appContext.service.routes.members.saveOrder( order ).fail( function () {

                    }).done( function ( data ) {
                        self.onOrdered( data );
                    });
                    
                    ///self.onOrdered(null);
                    //alert("Good to go!");
                }
            }
        }

        onBack( data, event ) {
            var self = this;

            if ( self.isEConsult() ) {
                document.location.href = "index2.html";
                return false;
            }

            if ( self.index() === 2 ) {
                if ( self.layout.hasPharmaciesSearchResults() ) {
                    self.isSearchButton( true );
                    self.layout.heightOfView3( "100px" );
                    self.layout.heightOfView3Results( "0" );
                    self.layout.hasPharmacyBeenSelected( false );
                    self.layout.hasPharmaciesSearchResults( false );
                    self.store.cart.instance.selectedZipCode( "" );
                    self.layout.display( 2 );
                    Util.initForm( self.picker );
                }
            } else {
                self.index( self.index() - 1 );
                console.log( 'inedx', self.index() );

                switch ( self.index() ) {
                    case 0:
                        self.isNextButton( true );
                        self.isSearchButton( false );
                        self.layout.display( 0 );
                        break;
                    case 1:
                        self.isNextButton( true );
                        self.isSearchButton( false );
                        self.layout.backDisplay( 1 );
                        break;
                    case 2:  
                        //self.layout.display(2);
                        //if (!$(html.components.cart.ui.StoreSettings.viewConsentForm
                        //    ).hasClass(html.components.cart.ui.StoreSettings.hideClass)) {
                        //        $(html.components.cart.ui.StoreSettings.viewConsentForm
                        //        ).addClass(html.components.cart.ui.StoreSettings.hideClass);
                        //};
                        $( ".cart_step__4__view1" ).addClass( "m-hide" );

                        self.isNextButton( false );

                        self.isSearchButton( true );

                        self.layout.display( 2 );

                        Util.initForm( self.picker );

                        // Toggle Consent Checkbox
                        $( html.components.cart.ui.StoreSettings.viewsConsentCheckBox
                        ).addClass( html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.viewsStepperBar
                        ).removeClass( html.components.cart.ui.StoreSettings.hideClass );

                        self.index( 2 );

                        if ( self.layout.hasPharmaciesSearchResults() ) {
                            self.isSearchButton( true );
                            self.layout.heightOfView3( "100px" );
                            self.layout.heightOfView3Results( "0" );
                            self.layout.hasPharmacyBeenSelected( false );
                            self.layout.hasPharmaciesSearchResults( false );
                            self.store.cart.instance.selectedZipCode( "" );
                            self.layout.display( 2 );
                            Util.initForm( self.picker );
                        }
                        break;
                    case 3:

                        $( ".cart_step__5__view1" ).addClass( "m-hide" );
                        $( ".cart_step__4__view1" ).removeClass( "m-hide" );
                   
                        // Toggle Consent Checkbox
                        $( html.components.cart.ui.StoreSettings.viewsStepperBar
                        ).addClass( html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.viewsConsentCheckBox
                        ).removeClass( html.components.cart.ui.StoreSettings.hideClass );


                        break;
                    case 4:
                        $( ".cart_step__5__view1" ).removeClass( "m-hide" );

                        $( html.components.cart.ui.StoreSettings.viewsStepperBar
                        ).removeClass( html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.cssView5
                        ).removeClass( html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.cssStep6View1
                        ).addClass( html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.cssStep6View2
                        ).addClass( html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.cssStep6View3
                        ).addClass( html.components.cart.ui.StoreSettings.hideClass );

                        $( html.components.cart.ui.StoreSettings.viewsTermsCheckbox
                        ).addClass( html.components.cart.ui.StoreSettings.hideClass );

                        break;
                }
            }
        }


        onOrdered( data: any ) {

            var self = this;

            $( ".cart_checkout__steps" ).addClass( "m-hide" );
            $( ".cart_orderComplete" ).removeClass( "m-hide" );

            self.ctxUpload.databind();

            self.isProcessingPayment( false );
            self.ConsultationID( data.OrderInputResponse.StartOrderProcessStatusDetails.ConsultationStatusDetails.ConsultationID );
            console.log( data );
            self.orderCompleteMessage( `  Your order ID is :${data.OrderInputResponse.StartOrderProcessStatusDetails.ConsultationStatusDetails.ConsultationID}` );


        }


        populateCreditCardScreen() {
            var self = this;
            self.store.cart.instance.payment.CreditCard.NameOnCard( "Manny Ferrario" );
            self.store.cart.instance.payment.CreditCard.CardNumber( "4342454536364545" );
            self.store.cart.instance.payment.CreditCard.CardExpirationMonth( "10" );
            self.store.cart.instance.payment.CreditCard.CardExpirationYear( "2017" );
            self.store.cart.instance.payment.CreditCard.CardCCV( "331" );
            self.store.cart.instance.payment.BillingAddress.Address1( "1500 Bay Rd" );
            self.store.cart.instance.payment.BillingAddress.City( "Miami Beach" );
            self.store.cart.instance.payment.BillingAddress.State( "FL" );
            self.store.cart.instance.payment.BillingAddress.ZipCode( "33139" );
        }



    }
}