import ko = require( "knockout" );
import AppModule = require( "durandal/app" );
import IViewModel = require( "core/IViewModel" );
import ViewModel = require( "core/ViewModel" );
import HelperClinical = require( "components/clinical/IHealthRecords" );
import Env = require( "system/events/EventCommand" );
import Env2 = require( "system/events/ClinicalCommands" );
import sys = require( "system/utilities/ViewManager" );
import ITools = require( "sections/account/Options" );
import util = require( "components/cart/tools" );
declare var Materialize;
import IModel = require( "models/identity/IPayload" );
import LG = require( "models/account/IDependent" );
import sysTools = require( "system/utilities/Forms" );
class DependentForm extends ViewModel {

    IsError: KnockoutObservable<boolean>;
    IsEmailError: KnockoutObservable<boolean>;

    isLoading: KnockoutObservable<boolean>;

    optionList: ITools.utils.forms.OptionsGender;

    isValidateInfo: KnockoutObservable<boolean>;
    hasValidateInfo: KnockoutComputed<string>;

    isSelfManaged: KnockoutComputedFunctions<boolean>;
    isSelfManagedDependent: KnockoutObservable<boolean>;

    calCulateAge: KnockoutComputedFunctions<number>;
    PersonInfo: IModel.models.Identity.IPayload.PersonInfo;

    Email: KnockoutObservable<string>;
    PhoneNumber: KnockoutObservable<string>;

    constructor() {
        super();
        var self = this;

        self.IsError = ko.observable( false );
        self.IsEmailError = ko.observable( false );

        self.isLoading = ko.observable( false );

        self.optionList = new ITools.utils.forms.OptionsGender();

        self.isValidateInfo = ko.observable( false );

        self.hasValidateInfo = ko.computed(() => ( self.isValidateInfo() ? "isValidate" : "" ) );


        self.Email = ko.observable( "" );
        self.PhoneNumber = ko.observable( "" );

        self.PersonInfo = new IModel.models.Identity.IPayload.PersonInfo();

        self.isSelfManagedDependent = ko.observable( false );

        self.isSelfManagedDependent = ko.observable( false );

        self.calCulateAge = ko.pureComputed(() => {
            var pattern = "YYYY-MM-DD";
            var age = moment( self.PersonInfo.Dob() ).format( pattern );
            console.log( moment().diff( moment( age ), 'years' ) );
            if ( moment().diff( moment( age ), 'years' ) > 17 ) {
                self.isSelfManagedDependent( true );
            } else {
                self.isSelfManagedDependent( false );
            }
            return moment().diff( moment( age ), 'years' );
        });
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
        sysTools.utilities.Forms.InputMasks.maskPhone(
            $( "#inputPhoneNumber" ) );
        sysTools.utilities.Forms.InputMasks.maskDate(
            $( "#inputDOB" ) );
        var inputRef = "#inputDOB";
        $( inputRef ).focusout(() => {
            console.log( "hell0" );
            var pattern = 'MM-DD-YYYY',
                age = moment( self.PersonInfo.Dob(), pattern ),
                result = moment().diff( moment( age ), 'years' );
            if ( self.PersonInfo.Dob() !== undefined && self.PersonInfo.Dob() !== "" ) {
                console.log( result );
                //if ( result >= 18 ) {
                //    self.isSelfManagedDependent( true );
                //} else {
                //    self.isSelfManagedDependent( false );
                //}

            }
        });
        $( inputRef ).keypress( event => {
            if ( event.which === 13 ) {
                event.preventDefault();
                var pattern = 'MM-DD-YYYY',
                    age = moment( self.PersonInfo.Dob(), pattern ),
                    result = moment().diff( moment( age ), 'years' );
                console.log( result );
                //if ( result >= 18 ) {
                //    self.isSelfManagedDependent( true );
                //} else {
                //    self.isSelfManagedDependent( false );
                //}
            }
        });
    }

    databind() {
        var self = this;
        return Q.resolve( true );
    }

    validateDependentInfo() {
        var self = this;
        self.isValidateInfo( true );
        console.log( self.appContext.identityUser.instance );
        if ( self.PersonInfo.FName() !== "" && self.PersonInfo.FName() !== null &&
            self.PersonInfo.LName() !== "" && self.PersonInfo.LName() !== null &&
            self.PersonInfo.Dob() !== "" && self.PersonInfo.Dob() !== null ) {
            var label = self.optionList.selectedValue().label;
            self.PersonInfo.Gender( label() === "Male" ? 1 : 0 );
            if ( self.isSelfManagedDependent() ) {
                if ( self.Email() !== "" && self.PhoneNumber() !== "" ) {
                    self.validateEmail();
                } else {
                    self.IsError( true );
                }
            } else {
                self.isLoading( true );
                self.saveDependent();
            }
        }
    }
    validateEmail() {
        var self = this;
        self.isLoading( true );
        var email = { Email: self.Email() };
        self.appContext.service.routes.members.validateEmail( email )
            .fail(() => {
                self.isLoading( false );
            })
            .done(( data: IModel.models.Identity.IPayload.IEmailValidation ) => {
                console.log( data );
                if ( !data.Valid ) {
                    self.isLoading( false );
                    self.IsEmailError( true );
                } else {
                    self.saveDependent();
                    // self.isLoading(false);
                }
            });
    }
    saveDependent() {
        var self = this;

        var entity: LG.models.Account.Dependents.IDependent = {
            CorporationRID: 10,
            GroupRID: self.appContext.identityUser.instance.GroupInfo.GroupRID,
            ClientRID: self.appContext.identityUser.instance.GroupInfo.ClientRID,
            MembershipPlanID: self.appContext.identityUser.instance.AccountInfo.AccountInfo.MembershipPlanID,
            EntityType: LG.models.Account.Dependents.EntityType.Member,
            Events: {
                EventAction: LG.models.Account.Dependents.Action.Add,
                EventActionResult: LG.models.Account.Dependents.ActionResult.None,
                AccountAction: LG.models.Account.Dependents.AccountAction.AccountInfo,
                AccountActionResult: LG.models.Account.Dependents.ActionResult.None
            },
            AccountInfo: {
                IsActive: true,
                IsTesting: false,
                IsAutorenewal: true,
                IsSelfManaged: self.isSelfManagedDependent(),
                MembershipPlanID: self.appContext.identityUser.instance.AccountInfo.AccountInfo.MembershipPlanID,
                PrimaryAccountID: self.appContext.identityUser.instance.AccountInfo.AccountInfo.AccountID
            },
            PersonInfo: ko.mapping.toJS( self.PersonInfo )
        }

        var dFO = new Date( self.PersonInfo.Dob() ),
            temp = dFO.getUTCFullYear()
                + "-" + sysTools.utilities.Forms.InputValues.doubleDigitsMonth( dFO.getMonth().toString() )
                + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dFO.getDate().toString() )
                + "T12:00:00";
        entity.PersonInfo.Dob = temp;
        if ( self.isSelfManagedDependent() ) {
            entity.EmailAddresses = [
                new LG.models.Account.Dependents.EmailAddress( self.Email() )
            ];
            entity.Phones = [
                new LG.models.Account.Dependents.Phone( self.PhoneNumber() )
            ];
        } else {
            entity.Phones = [
                new LG.models.Account.Dependents.Phone( self.appContext.identityUser.instance.Entity.Phones[0].PhoneNumber )
            ];
        }
        self.appContext.service.routes.members.saveDependent( entity ).fail(() => {
            self.isLoading( false );
            // self.appContext.logger.error( "Saving Failed" );
        })
            .done( data => {
                console.log( data );
                self.isLoading( false );
                self.appContext.identityUser.dataContext.loadDependents(
                    self.appContext.identityUser.instance.RolodexItemID );
            })
            .then(() => {
                $( ".modal-content" ).addClass( "m-hide" );
                $( "#modalFrmManager4" ).closeModal();
                $( "#modalFrmManager4" ).css( "display", "none" );
                self.appContext.router.navigate( "#dashboard" );
            });
    }

}
export = DependentForm;