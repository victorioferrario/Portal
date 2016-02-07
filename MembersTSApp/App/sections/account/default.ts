import ko = require( "knockout" );
import IPageModel = require( "core/IPageModel" );
import PageModel = require( "core/PageModel" );
import IModel = require( "models/identity/IPayload" );
import ITools = require( "sections/account/Options" );
import IData = require( "models/account/IMemberInstance" );
import util = require( "components/cart/tools" );
declare var Materialize;
import FamilyMembers = require("sections/account/familymembers");
class DefaultAccount extends PageModel {
    famControl: IPageModel;
    title: KnockoutObservable<string>;
    checkedValue: KnockoutObservable<number>;
    isDataLoaded: KnockoutObservable<boolean>;
    isDataLoading: KnockoutObservable<boolean>;
    EntityInfo: KnockoutObservable<IModel.models.Identity.IPayload.IEntity | any>;
    GroupInfo: KnockoutObservable<IModel.models.Identity.IPayload.GroupInfo | any>;
    AccountInfo: KnockoutObservable<IModel.models.Identity.IPayload.IAccountInfo | any>;
    ClientInfo: KnockoutObservable<IModel.models.Identity.IPayload.IServiceResponse | any>;
    PersonInfo: KnockoutObservable<IModel.models.Identity.IPayload.IPersonInfo | any>;
    Membership: KnockoutObservable<IModel.models.Identity.IPayload.IMembershipPlan | any>;
    ctxContact: ITools.utils.forms.ContactList;
    ctxAddress: ITools.utils.forms.Address;

    ctxCreditCard: ITools.utils.forms.ICreditCardInfoInputObservable;

    ctxCreditCardList: KnockoutObservableArray<IModel.models.Identity.IPayload.ICreditCartListItem>;

    ctxAddressList: KnockoutObservableArray<ITools.utils.forms.Address>;

    optionList: ITools.utils.forms.OptionsGender;
    index: KnockoutObservable<number>;



    isLoadingContactInfo: KnockoutObservable<boolean>;
    isLoadingGeneralInfo: KnockoutObservable<boolean>;

    hasData: KnockoutObservable<boolean>;
    hasCreditCards: KnockoutObservable<boolean>;
    isValidateCreditCard: KnockoutObservable<boolean>;
    hasValidateCreditCard: KnockoutComputed<string>;

    constructor() {

        super();

        var self = this;
        self.hasData = ko.observable(false);
        self.famControl = FamilyMembers;
        self.pageControl = ko.observable(self.famControl);

        self.index = ko.observable( 1 );

        self.EntityInfo = ko.observable();

        self.GroupInfo = ko.observable();

        self.AccountInfo = ko.observable();

        self.ClientInfo = ko.observable();

        self.Membership = ko.observable();

        self.PersonInfo = ko.observable();

        self.checkedValue = ko.observable( 0 );

        self.optionList = new ITools.utils.forms.OptionsGender();

        self.ctxContact = new ITools.utils.forms.ContactList();

        self.ctxAddress = new ITools.utils.forms.Address();

        self.ctxAddressList = ko.observableArray( [
            new ITools.utils.forms.Address( 1 ),
            new ITools.utils.forms.Address( 4 ),
            new ITools.utils.forms.Address( 5 )
        ] );

        self.ctxCreditCard = new ITools.utils.forms.CreditCardInfoInput();
        //  self.ctxCreditCard

        self.isDataLoaded = ko.observable( false );
        self.isDataLoading = ko.observable( false );

        self.isLoadingContactInfo = ko.observable( false );
        self.isLoadingGeneralInfo = ko.observable( false );

        self.IsError = ko.observable( false );

        self.hasCreditCards = ko.observable( false );
        self.isValidateCreditCard = ko.observable( false );

        self.hasValidateCreditCard = ko.computed(
            () => ( self.isValidateCreditCard() ? "isValidate" : "" ) );
    }
    activate() {
        var self = this;
        self.domPage.css( "background-color", "#0d47a1" );
        return this.databind();
    }
    canActivate() {
        return Q.resolve( true );
    }
    canDeActivate() {
        return Q.resolve( true );
    }
    resetView( data, event, index ) {
        var self = this;
        self.index( index );
        if ( self.index() === 3 || self.index() === 5 || self.index() === 2 ) {
            $( "#button" ).hide();
        } else {
            $( "#button" ).show();
        }
        console.log( index )
        $( "#viewport4" ).removeClass( "m-hide" );
        if ( self.index() === 2 ) {
            var content = $( "#divContactInfoWrapper" );
            console.log( content.height() );
            console.log( content.outerHeight() );
        }

        return true;
    }
    compositionComplete() {
        var self = this;
        self.appContext.resetViewPort();
        $( "ul.tabs" ).tabs();
        $( "#spinnerTemplateID" ).velocity(
            "fadeOut", {
                delay: 1,
                duration: 800,
                begin( elements ) { },
                complete( elements ) {
                    $( "#spinnerTemplateID" ).addClass( "m-hide" );
                    $( "#accountInfo" ).removeClass( "m-hide" );
                    setTimeout( function () {
                       
                        self.hasData(true);
                    }, 1000 );
                    //self.famControl.h
                }
            });
        $( ".app_content" ).css( "overflow", "hidden!important" );
        $( "#page" ).css( "background-color", "#0c2238" );
        $( "#page" ).css( "overflow-y", "hidden!important" );
        self.updateContainer();
        $( window ).resize(() => {
            self.updateContainer();
        });
        $( '.collapsible' ).collapsible( {
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    }
    updateContainer() {
       
        $( ".app_content" ).css( "overflow-y", "hidden!important" );
        $( "#pageContainer" ).css( "overflow-y", "hidden!important" );
        $( "#pageContainer" ).addClass( "no-scroll" );
     
        // overflow - y: auto!important

    }

    databind() {

        var self = this;

        self.title = ko.observable( "My Account" );

        self.GroupInfo = ko.mapping.fromJS(
            self.appContext.identityUser.instance.GroupInfo );

        self.appContext.identityUser.instance.AccountInfo.Account
        = self.appContext.identityUser.instance.AccountInfo.AccountInfo;

        self.AccountInfo = ko.mapping.fromJS(
            self.appContext.identityUser.instance.AccountInfo );

        self.ClientInfo = ko.mapping.fromJS(
            self.appContext.identityUser.instance.ClientInfo.ServiceResponse );

        self.PersonInfo =
        ko.mapping.fromJS( self.appContext.identityUser.instance.PersonInfo );

        self.optionList.selectedValue(
            self.optionList.items()[
            self.appContext.identityUser.instance.PersonInfo.Gender !== undefined ?
                self.appContext.identityUser.instance.PersonInfo.Gender : ""] );

        self.EntityInfo
        = ko.mapping.fromJS( self.appContext.identityUser.instance.Entity );
        

        self.Membership
        = ko.mapping.fromJS( self.appContext.identityUser.instance.MembershipPlan );
        self.isDataLoaded( true );
        return Q.resolve( true );
    }

   


    checkMemberNumber( data: any ) {
        return data() === null ? "NA" : data;
    }

    formatDate( data ) {
        console.log( "ffffff", data() );
        var d = new Date( data() );
        console.log( d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear() );
        return d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear(); //, d.getMonth(), d.getDate());
    }

    pageControl:KnockoutObservable<any>;
    


    onClickUpdate( d, event ) {
        var self = this,
            data = ko.mapping.toJS( self.PersonInfo ),
            data2 = ko.mapping.toJS( self.AccountInfo ),
            data3 = ko.mapping.toJS( self.EntityInfo );

        // var date = new Date( data.Dob.getYear(), data.Dob.getMonth(), data.Dob.getDay() );
        switch ( self.index() ) {
            case 1:
                var entity: IData.models.account.IMemberInstance = {
                    UserRID: self.appContext.identityUser.instance.RolodexItemID,
                    GroupRID: self.appContext.identityUser.instance.AccountInfo.GroupRID,
                    ClientRID: self.appContext.identityUser.instance.AccountInfo.ClientRID,
                    GeneralInfo: {
                        FName: data.FName,
                        MName: data.MName,
                        LName: data.LName,
                        Dob: data.Dob,
                        DateOfBirthString: data.Dob,
                        Gender: self.optionList.selectedValue().value
                    },
                    EventAction: IData.models.account.Action.Update
                };
                self.isLoadingGeneralInfo( true );
                self.appContext.service.routes.members.saveGeneralInfo( entity )
                    .fail(() => {
                        Materialize.toast( "An error occurred, please try again.", 4000 );
                    }).done( data => {
                        Materialize.toast( "Update Success!", 4000 );
                    }).then(() => {
                        self.isLoadingGeneralInfo( false );
                    });
                self.appContext.authenticate();
                break;
            case 2:
                data3.Phones.forEach(( item: IModel.models.Identity.IPayload.IPhone ) => {
                    item.PhoneUsages.forEach(( usage: IModel.models.Identity.IPayload.IPhoneUsage ) => {
                        if ( usage.PhoneUsageEnum === IModel.models.Identity.IPayload.PhoneUsageEnum.Mobile ) {
                            console.log( "Mobile",
                                item.PhoneNumber );
                        }
                        if ( usage.PhoneUsageEnum === IModel.models.Identity.IPayload.PhoneUsageEnum.Home ) {
                            console.log( "Home",
                                item.PhoneNumber );
                        }
                        if ( usage.PhoneUsageEnum === IModel.models.Identity.IPayload.PhoneUsageEnum.Work ) {
                            console.log( "Work",
                                item.PhoneNumber );
                        }
                    });
                });
                var entity2: IData.models.account.IMemberInstance = {}
                break;
            case 3:
                console.warn( data3 );
                break;
            case 5:


                self.isValidateCreditCard( true );

                var input: ITools.utils.forms.ICreditCardInfoInput
                    = ko.mapping.toJS( self.ctxCreditCard );

                if ( input.NameOnCard !== null
                    && input.CCNumber !== ""
                    && input.CCNumber !== null
                    && input.CCType !== null
                    && input.ExpMonth !== ""
                    && input.ExpYear !== ""
                    && input.CVVCode !== null ) {

                    self.isDataLoading( true );
                    var address = ko.mapping.toJS( self.ctxAddressList()[0] );
                    address.AddressUsages = [address.AddressUsage];
                    input.BAddress = address;

                    input.IsActive = true;
                    input.IsDefault = true;

                    input.AccountID = self.appContext.identityUser.instance.AccountInfo.Account.AccountID;
                    input.CCNumber = input.CCNumber.replace( "-", "" ).replace( "-", "" ).replace( "-", "" );

                    self.appContext.service.routes.members.saveCreditCard( input )
                        .fail(() => {
                            Materialize.toast( "Error occurred on saving.", 4000 );
                        }).done( result => {
                            Materialize.toast( "Save Success.", 4000 );
                            console.log( result );
                        }).then(() => {
                            this.isDataLoading( false );
                        });
                    console.log( input );
                } else {
                    self.isDataLoading( false );
                }
                break;
        }

        console.log( "hello", self.index() );
    }
    IsError: KnockoutObservable<boolean>;

    onCreditCardUpdate( data, event, item ) {
        var self = this;
        self.isValidateCreditCard( true );

        var input: ITools.utils.forms.ICreditCardInfoInput
            = item !== null ? ko.mapping.toJS( item ) : ko.mapping.toJS( self.ctxCreditCard );

        if ( input.NameOnCard !== null
            && input.CCNumber !== ""
            && input.CCNumber !== null
            && input.CCType !== null
            && input.ExpMonth !== ""
            && input.ExpYear !== ""
            && input.CVVCode !== null ) {

            self.isDataLoading( true );

            var address = ko.mapping.toJS( self.ctxAddressList()[0] );
            address.AddressUsages = [address.AddressUsage];
            input.BAddress = address;

            input.IsActive = true;
            input.IsDefault = true;

            input.AccountID = self.appContext.identityUser.instance.AccountInfo.Account.AccountID;
            input.CCNumber = input.CCNumber.replace( "-", "" ).replace( "-", "" ).replace( "-", "" );
            console.log( item );

        } else {

            self.IsError( true );

        }
    }

    doReset( data, event ) {
        var self = this;
        self.isValidateCreditCard( false );
        //$( "#CardNumber" ).mask( "9999-9999-9999-9999" );
        //$( "#CardNumber" ).validateCreditCard( result => {
        //    $( ".log" ).html(( result.card_type == null ?
        //        "" : util.components.cart.tools.ccIcon( result.card_type.name ) ) );
        //});
    }
    // 
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
    getInputID( item ) {
        var result = "inputCreditCard";
        console.log( item );
        console.log( typeof item.NameOnCard );
        switch ( typeof item.NameOnCard ) {
            case "string":
                result = "input_" + item.Last4;

                break;
            case "function":
                result = "input_" + "1234";
                break;
        }
        return result;
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
    getInputIDForIsDefault( item ) {
        var result = "";
        console.log( item );
        console.log( typeof item.NameOnCard );
        switch ( typeof item.NameOnCard ) {
            case "string":
                result = "inputIsDefault_" + item.Last4;
                break;
            case "function":
                result = "input_IsDefault";
                break;
        }
        return result;
    }

    getCreditCartType( item ) {
        return util.components.cart.tools.ccIconByEnum( item.CCType );
    }

}
var vm: IPageModel = new DefaultAccount(); export = vm;  