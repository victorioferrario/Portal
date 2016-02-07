import ko = require( "knockout" );
import IPageModel = require( "core/IPageModel" );
import PageModel = require( "core/PageModel" );
import IModel = require( "models/identity/IPayload" );
import ITools = require( "sections/account/Options" );
import IData = require( "models/account/IMemberInstance" );
import util = require( "components/cart/tools" );
import sysTools = require( "system/utilities/Forms" );
declare var Materialize;
import Events = require( "system/events/EventCommand" );
class Profile extends PageModel {

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

    hasCreditCards: KnockoutObservable<boolean>;
    isValidateCreditCard: KnockoutObservable<boolean>;
    hasValidateCreditCard: KnockoutComputed<string>;

    constructor() {

        super();

        var self = this;

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
        if ( self.index() === 3 || self.index() === 5 || self.index() === 1 ) {
            $( "#button2" ).hide();
        } else {
            $( "#button2" ).show();
        }
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
        $( "#button2" ).hide();
        $( "#spinnerTemplateID" ).velocity(
            "fadeOut", {
                delay: 1,
                duration: 800,
                begin( elements ) { },
                complete( elements ) {
                    $( "#spinnerTemplateID" ).addClass( "m-hide" );
                    $( "#viewAccountInfo" ).removeClass( "m-hide" );
                }
            });
        $( ".app_content" ).css( "overflow", "hidden!important" );
        $( "#page" ).css( "background-color", "#0c2238" );
        $( "#page" ).css( "overflow-y", "hidden!important" );
        $( "#inputMobile" ).mask( "(999) 999-9999" );
        $( "#inputHome" ).mask( "(999) 999-9999" );
        $( "#inputWork" ).mask( "(999) 999-9999? x99999" );

        $( "#input_1234" ).mask( "9999-9999-9999-9999" );
        //$( "#input_1234" ).validateCreditCard( result => {
        //    $( ".log" ).html(( result.card_type == null ?
        //        "" : util.components.cart.tools.ccIcon( result.card_type.name ) ) );
        //});

        self.updateContainer();
        $( window ).resize(() => {
            self.updateContainer();
        });
        $( '.collapsible' ).collapsible( {
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
        sysTools.utilities.Forms.InputMasks.maskDate(
            $( "#inputDOB" ) );
    }
    updateContainer() {
        var self = this;
        try {
            var offSet = $("#wrapperItem").offset(),
                docHeight = $(document).height(),
                newHeight = docHeight - offSet.top;
            $( "#wrapperItem" ).height( newHeight + "px" );
            $( "#viewAccountInfo" ).height(( newHeight - 48 ) + "px" );
        }catch(error) {
            
        }
        $( ".app_content" ).css( "overflow-y", "hidden!important" );
        $( "#pageContainer" ).css( "overflow-y", "hidden!important" );
        $( "#pageContainer" ).addClass( "no-scroll" );
        var docWidth = $( document ).width();
        if ( docWidth > 600 ) {
            $( ".app_content" ).css( "overflow-y", "hidden!important" );
            $( "#pageContainer" ).css( "overflow-y", "hidden!important" );
            $( "#pageContainer" ).addClass( "no-scroll" );
            //$( "#viewAccountInfo" );
        } else {
            $( "#pageContainer" ).css( "overflow-y", "auto" );
            $( "#pageContainer" ).removeClass( "no-scroll" );
        }
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

        self.bindContactInfo();

        self.isDataLoaded( true );

        self.ctxCreditCardList = ko.observableArray( [] );

        self.bindCreditCards();
        

        ko.postbox.subscribe(Events.system.events.GeneralCommands.UI_RELOAD__CREDIT_CARDS, function() {
            self.appContext.router.navigate("#reload");
        });

        return Q.resolve( true );
    }

    bindCreditCards() {
        var self = this;
        self.ctxCreditCardList.removeAll();
        self.appContext.identityUser.instance.CreditCartList.forEach(
            ( item: IModel.models.Identity.IPayload.ICreditCartListItem ) => {
                self.hasCreditCards( true );
                item.ButtonLabel = "Update";
                self.ctxCreditCardList.push( item );
            });
    }

    bindContactInfo() {
        var self = this;
        self.appContext.identityUser.instance.Entity.EmailAddresses.forEach( item => {
            self.ctxContact.Email = new ITools.utils.forms.EmailAddressObservable( item );
        });
        self.appContext.identityUser.instance.Entity.Phones.forEach( item => {
            item.PhoneUsages.forEach( a => {
                if ( a.PhoneUsageEnum === IModel.models.Identity.IPayload.PhoneUsageEnum.Mobile ) {
                    self.ctxContact.Mobile = new ITools.utils.forms.PhoneObservable( item );
                }
                if ( a.PhoneUsageEnum === IModel.models.Identity.IPayload.PhoneUsageEnum.Work ) {
                    self.ctxContact.Work = new ITools.utils.forms.PhoneObservable( item );
                    self.ctxContact.Work.PhoneNumber( self.ctxContact.Work.PhoneNumber() + self.ctxContact.Work.PhoneExtension() );
                }
                if ( a.PhoneUsageEnum === IModel.models.Identity.IPayload.PhoneUsageEnum.Home ) {
                    self.ctxContact.Home = new ITools.utils.forms.PhoneObservable( item );
                }
            });
        });

        self.appContext.identityUser.instance.Entity.Addresses.forEach( item => {
            if ( item.AddressUsages.forEach( usage => {
                if ( usage.AddressUsageEnum === IModel.models.Identity.IPayload.AddressUsageEnum.Residential ) {
                    self.ctxAddressList()[0] = new ITools.utils.forms.Address( item );
                }
                if ( usage.AddressUsageEnum === IModel.models.Identity.IPayload.AddressUsageEnum.Billing ) {
                    self.ctxAddressList()[1] = new ITools.utils.forms.Address( item );
                }
                if ( usage.AddressUsageEnum === IModel.models.Identity.IPayload.AddressUsageEnum.Business ) {
                    self.ctxAddressList()[2] = new ITools.utils.forms.Address( item );
                }
            }) );
        });
    }

    onAddressUpdate( data, event, item ) {
        var self = this;
        var clean = ko.mapping.toJS( item );
        if ( clean.AddressLine1 === "" ||
            clean.City === "" || clean.State === "" || clean.ZipCode === "" ) {
            item.isError( true );
        } else {
            item.isError( false );
            item.isLoading( true );
            var entity: IData.models.account.IMemberInstance = {
                UserRID: self.appContext.identityUser.instance.RolodexItemID,
                GroupRID: self.appContext.identityUser.instance.AccountInfo.GroupRID,
                ClientRID: self.appContext.identityUser.instance.AccountInfo.ClientRID
            }
            entity.EventAction = clean.ID !== 0 ? IData.models.account.Action.Update : IData.models.account.Action.Add;
            var address = clean;
            address.AddressUsage.AddressUsageEnumValue = address.AddressUsage.AddressUsageEnum;
            address.AddressUsageEnumValue = address.AddressUsage.AddressUsageEnum;
            address.AddressUsages = [address.AddressUsage];
            entity.Addresses = [address];
            self.appContext.service.routes.members.saveAddress( entity )
                .fail(() => {
                    Materialize.toast( "An error occurred, please try again.", 4000 );
                }).done( data => {
                    Materialize.toast( "Update Success!", 4000 );
                }).then(() => {
                    item.isLoading( false );
                });
        }
    }



    checkMemberNumber( data: any ) {
        return data() === null ? "NA" : data;
    }

    formatDate( data ) {
        var d = new Date( data() );
        return d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
    }


    intrtelSavePhone( data: IData.models.account.IPhone ) {
        var self = this;

        var entity: IData.models.account.IMemberInstance = {
            UserRID: self.appContext.identityUser.instance.RolodexItemID,
            GroupRID: self.appContext.identityUser.instance.AccountInfo.GroupRID,
            ClientRID: self.appContext.identityUser.instance.AccountInfo.ClientRID
        }
        entity.EventAction = data.PhoneId !== 0 ? IData.models.account.Action.Update : IData.models.account.Action.Add;
        entity.Phone = data;
        entity.Phones = [data];
        self.appContext.service.routes.members.savePhone( entity )
            .fail(() => {
                Materialize.toast( "An error occurred, please try again.", 4000 );
            }).done( data => {
                Materialize.toast( "Update Success!", 4000 );
            }).then(() => {
                if ( data.PhoneUsageEnum === IData.models.account.PhoneUsageEnum.Work ) {
                    self.isDataLoading( false );
                    self.appContext.authenticate();
                }
            });
    }


    onUpdateContact( data, event, item ) {
        console.log( item );
        var self = this;
        self.isDataLoading( true );
        // if (!== 0) {

        var cleanM = ko.mapping.toJS( self.ctxContact.Mobile );
        cleanM.PhoneId = self.ctxContact.Mobile.ID() !== 0 ? cleanM.ID : 0;
        cleanM.PhoneUsageEnum = IData.models.account.PhoneUsageEnum.Mobile;
        cleanM.PhoneUsageEnumToUpdate = IData.models.account.PhoneUsageEnum.Mobile;

        if ( cleanM.PhoneNumber.length > 0 ) {

            var newcleanM = cleanM.PhoneNumber.replace( / /g, "" );

            newcleanM = newcleanM.replace( "(", "" );
            newcleanM = newcleanM.replace( ")", "" );
            newcleanM = newcleanM.replace( "-", "" );
            cleanM.PhoneNumber = newcleanM;
        }


        self.intrtelSavePhone( cleanM );

        var cleanH = ko.mapping.toJS( self.ctxContact.Home );
        cleanH.PhoneId = self.ctxContact.Home.ID() !== 0 ? cleanH.ID : 0;
        cleanH.PhoneUsageEnum = IData.models.account.PhoneUsageEnum.Home;
        cleanH.PhoneUsageEnumToUpdate = IData.models.account.PhoneUsageEnum.Home;

        if ( cleanH.PhoneNumber.length > 0 ) {
            var newcleanH = cleanH.PhoneNumber.replace( / /g, "" );
            newcleanH = newcleanH.replace( "(", "" );
            newcleanH = newcleanH.replace( ")", "" );
            newcleanH = newcleanH.replace( "-", "" );
            cleanH.PhoneNumber = newcleanH;
        }
        self.intrtelSavePhone( cleanH );

        var cleanW = ko.mapping.toJS( self.ctxContact.Work );
        if ( cleanW.PhoneNumber.length > 0 ) {

            var newclean = cleanW.PhoneNumber.replace( / /g, "" );

            newclean = newclean.replace( "(", "" );
            newclean = newclean.replace( ")", "" );
            newclean = newclean.replace( "-", "" );

            var temp = newclean;
            console.log( temp );
            cleanW.PhoneNumber = temp.substr( 0, temp.indexOf( "x" ) );
            cleanW.PhoneExtension = newclean.substr( newclean.indexOf( "x" ) + 1, newclean.length );

        }

        cleanW.PhoneUsageEnum = IData.models.account.PhoneUsageEnum.Work;
        cleanW.PhoneUsageEnumToUpdate = IData.models.account.PhoneUsageEnum.Work;
        cleanW.PhoneId = self.ctxContact.Work.ID() !== 0 ? cleanW.ID : 0;
        console.log( cleanW )
        self.intrtelSavePhone( cleanW );
    }


    onClickUpdate( d, event ) {
        var self = this,
            data = ko.mapping.toJS( self.PersonInfo ),
            data2 = ko.mapping.toJS( self.AccountInfo ),
            data3 = ko.mapping.toJS( self.EntityInfo );

        // var date = new Date( data.Dob.getYear(), data.Dob.getMonth(), data.Dob.getDay() );
        switch ( self.index() ) {
            case 1:
                var dFO = new Date( data.Dob ),
                temp = dFO.getUTCFullYear()
                    + "-" + sysTools.utilities.Forms.InputValues.doubleDigitsMonth( dFO.getMonth().toString() )
                + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dFO.getDate().toString() )
                + "T12:00:00";
              
                var entity: IData.models.account.IMemberInstance = {
                    UserRID: self.appContext.identityUser.instance.RolodexItemID,
                    GroupRID: self.appContext.identityUser.instance.AccountInfo.GroupRID,
                    ClientRID: self.appContext.identityUser.instance.AccountInfo.ClientRID,
                    GeneralInfo: {
                        FName: data.FName,
                        MName: data.MName,
                        LName: data.LName,
                        Dob: temp,
                        DateOfBirthString: temp,
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
    
    addNewCardCommand( data, event ) {
        var self = this;
        if ( self.initFormManger3() ) {
            ko.postbox.publish(
                Events.system.events.FormCommands.BillingForm );
        }
    }

    refreshList(data, event) {
        var self = this;
        self.appContext.identityUser.dataContext.loadCreditCards();
    }

    initFormManger3() {
        $( ".modal-content" ).removeClass( "m-hide" );
        $( "#modalFrmManager3" ).removeClass( "m-hide" );
        $( "#modalFrmManager3" ).openModal( {
            dismissible: false
        });
        return true;
    }
}
var vm: IPageModel = new Profile(); export = vm;  