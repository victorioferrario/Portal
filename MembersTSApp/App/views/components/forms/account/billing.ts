import ko = require( "knockout" );
import AppModule = require( "durandal/app" );
import IViewModel = require( "core/IViewModel" );
import ViewModel = require( "core/ViewModel" );
import LG = require( "models/clinical/HealthRecords" );
import HelperClinical = require( "components/clinical/IHealthRecords" );
import Env = require( "system/events/EventCommand" );
import Env2 = require( "system/events/ClinicalCommands" );
import sys = require( "system/utilities/ViewManager" );
import ITools = require( "sections/account/Options" );
import util = require( "components/cart/tools" );
declare var Materialize;
class BillingForm extends ViewModel {
    isLoading: KnockoutObservable<boolean>;
    IsError:KnockoutObservable<boolean>;
    isValidateCreditCard: KnockoutObservable<boolean>;
    hasValidateCreditCard:KnockoutComputed<string>;
    ctxCreditCard: ITools.utils.forms.ICreditCardInfoInputObservable;
    constructor() {
        super();
        var self = this;
        self.IsError = ko.observable( false );
        self.isLoading = ko.observable(false);
        self.isValidateCreditCard = ko.observable( false );
        self.hasValidateCreditCard = ko.computed(() => (self.isValidateCreditCard() ? "isValidate" : ""));
        self.ctxCreditCard = new ITools.utils.forms.CreditCardInfoInput();
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
        $( "#modal_credit_card__input" ).mask(
            "9999-9999-9999-9999?9" );
        $( "#modal_credit_card__input" ).validateCreditCard( result => {
            $( ".log" ).html(( result.card_type == null ?
                "-" : util.components.cart.tools.ccIconWhite( result.card_type.name ) ) );
        });
        $( "#modal_credit_card_ccv__input" ).mask(
            "999?9" );
        $( "#modal_credit_card_billing_zipcode__input" ).mask(
            "99999" );
    }
    databind() {
        var self = this;
        return Q.resolve( true );
    }
  
    getInputIDForIsActive( item ) {
        var result = "";
        switch ( typeof item.NameOnCard ) {
            case "string":
                result = "inputIsActive_" + item.Last4;

                break;
            case "function":
                result = "input_IsActive";
                break;
        }
        return result;
    }
    validateCreditCardInfo() {
        var self = this;
        self.isValidateCreditCard( true );
        var input: ITools.utils.forms.ICreditCardInfoInput
            = ko.mapping.toJS( self.ctxCreditCard );
        if ( input.NameOnCard !== null
            && input.CCNumber !== ""
            && input.CCNumber !== null
            && input.ExpMonth !== ""
            && input.ExpYear !== ""
            && input.CVVCode !== null ) {
            if ( self.validateAddress( input ) ) {
                input.IsActive = true;
                input.IsDefault = true;
                input.BAddress.AddressUsages = [
                    {
                        IsPrimary: false,
                        AddressUsageEnum: 4,
                        AddressUsageEnumValue: 4
                    }
                ];
                input.BAddress.CountryCode = "US";
                input.AccountID = self.appContext.identityUser.instance.AccountInfo.Account.AccountID;
                input.CCNumber = input.CCNumber.replace( "-", "" ).replace( "-", "" ).replace( "-", "" );
                self.isLoading(true);
                self.IsError( false );
                self.appContext.service.routes.members.saveCreditCard( input )
                    .fail(() => {
                        Materialize.toast( "Error occurred on saving.", 4000 );
                        this.isLoading( false );
                    }).done( result => {
                        Materialize.toast( "Save Success.", 4000 );
                        console.log( result );
                    }).then(() => {
                        this.isLoading( false );

                        self.appContext.authenticate();
                        self.closeModal();
                    });

            } else {
                self.IsError(true);
            }
        } else {
            self.IsError( true );
        }

        console.log(input);
    }

    validateAddress(input: any) {
        if (input.BAddress.AddressLine1 !== "" && input.BAddress.AddressLine1 !== null &&
            input.BAddress.City !== "" && input.BAddress.City !== null &&
            input.BAddress.State !== "" && input.BAddress.State !== null &&
            input.BAddress.ZipCode !== "" && input.BAddress.ZipCode !== null) {
            return true;
        } else {
            return false;
        }
    }
    closeModal() {
        var self = this;
        $( ".modal-content" ).addClass( "m-hide" );
        $( "#modalFrmManager3" ).closeModal();
        $( "#modalFrmManager3" ).css( "display", "none" );
    }
}
export = BillingForm;