/// <reference path="../../../../scripts/typings/knockout.postbox/knockout-postbox.d.ts" />
import ko = require( "knockout" );
import AppModule = require( "durandal/app" );
import activator = require( "durandal/activator" );
import IViewModel = require( "core/IViewModel" );
import ViewModel = require( "core/ViewModel" );
import BlankForm = require( "views/components/forms/clinical2x/blank" );
import BilingForm = require( "views/components/forms/account/billing" );
import Env = require( "system/events/ClinicalCommands" );
import Events = require( "system/events/EventCommand" );
import Sys = require( "system/utilities/ViewManager" );
import Data = require( "../../../models/consults/data" );
import util = require( "components/cart/tools" );

class DefaultManager3 extends ViewModel {
   // viewManager: Sys.utilities.Components.Views.IManager;
    // forms    
    blankForm: BlankForm;
    billingForm: BilingForm;
    // observables      
    app: DurandalAppModule;
    title: KnockoutObservable<string>;
    action: KnockoutObservable<any>;
    pageControl: KnockoutObservable<any>;
    buttonLabel: KnockoutObservable<string>;
    currentInstance: KnockoutObservable<any>;
    //frmControl: KnockoutObservable<any>;
    constructor() {
        super();
        var self = this;
        self.app = AppModule;
        self.currentInstance = ko.observable();
        self.buttonLabel = ko.observable("Update");
        // Init Forms
        self.blankForm = new BlankForm();
        self.pageControl = ko.observable();

        ko.postbox.subscribe( Env.system.events.Clinical.ADD_CONTROL_BLANK_EDGE, data => {
            self.AddBlankControl();
        }, self );

        ko.postbox.subscribe( Events.system.events.FormCommands.BillingForm, data => {
            self.AddBillingControl();
        }, self );
    }

    activate() {
        return this.databind();
    }
    canActivate() {
        return Q.resolve( true );
    }
    canDeActivate() {
        console.log( "CAN DEACTIVEATE" );
        return Q.resolve( true );
    }
    deactivate( parms?: any ) {
        return Q.resolve( true );
    }
    compositionComplete() {
        var self = this;
        self.appContext.resetViewPort();
    }
    databind() {
        var self = this;
        self.title = ko.observable( "Form Manager" );
        return Q.resolve( true );
    }
    onUpdateClick( data, event ) {
        var self = this;
        var isNew = self.buttonLabel() === "Save";
    }

    AddBlankControl() {
        var self = this;
        self.pageControl( self.blankForm );
    }
    AddBillingControl() {
        var self = this;
        self.billingForm = new BilingForm();
        self.pageControl( self.billingForm );
    }

    formButton_cancel_ModalWindow( data, event ) {
        $(".modal-content").addClass("m-hide");
        $( "#modalFrmManager3" ).closeModal();
        $( "#modalFrmManager3" ).css( "display", "none" );
    }

    formButton_next__CommandButton( data, event ) {
        var self = this;
        self.billingForm.validateCreditCardInfo();
    }
    formButton_update__CommandButton( data, event ) {
        var self = this;
    }
    formButton_cancel_DetailCommand(data,event) {
        var self = this;
    }
    formButton_insert__DeaitlCommandButton( data, event ) {
        var self = this;
        
    }
    myPostProcessingLogic( element, index, data ) {
        console.log( element, index, data );
        switch ( typeof data.NameOnCard ) {
            case "string":
                $( "#input_" + data.Last4 ).mask( "9999-9999-9999-9999" );
                $( "#input_" + data.Last4 ).validateCreditCard( result => {
                    $( ".log" ).html(( result.card_type == null ?
                        "" : util.components.cart.tools.ccIcon( result.card_type.name ) ) );
                });
                // result = "input_" + item.Last4;
                break;
            case "function":
                $( "#input_" + "1234" ).mask( "9999-9999-9999-9999" );
                $( "#input_" + "1234" ).validateCreditCard( result => {
                    $( ".log" ).html(( result.card_type == null ?
                        "" : util.components.cart.tools.ccIcon( result.card_type.name ) ) );
                });
                break;
        }
    }
}

export = DefaultManager3;  