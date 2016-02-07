
import ko = require( "knockout" );
import IPageModel = require( "core/IPageModel" );
import PageModel = require( "core/PageModel" );
import IModel = require( "models/identity/IPayload" );
import ITools = require( "sections/account/Options" )

class Viewer extends PageModel {
        index: KnockoutObservable<number>;
        checkedValue: KnockoutObservable<number>;
        isDataLoaded: KnockoutObservable<boolean>;
        EntityInfo: KnockoutObservable<IModel.models.Identity.IPayload.IEntity | any>;
        GroupInfo: KnockoutObservable<IModel.models.Identity.IPayload.GroupInfo | any>;
        AccountInfo: KnockoutObservable<IModel.models.Identity.IPayload.IAccountInfo | any>;
        ClientInfo: KnockoutObservable<IModel.models.Identity.IPayload.IServiceResponse | any>;
        PersonInfo: KnockoutObservable<IModel.models.Identity.IPayload.IPersonInfo | any>;
        Membership: KnockoutObservable<IModel.models.Identity.IPayload.IMembershipPlan | any>;
        ctxContact: ITools.utils.forms.ContactList;
        optionList: ITools.utils.forms.OptionsGender;

    constructor() {
        super();

        var self = this;

        self.index = ko.observable(1);

        self.EntityInfo = ko.observable();

        self.GroupInfo = ko.observable();

        self.AccountInfo = ko.observable();

        self.ClientInfo = ko.observable();

        self.Membership = ko.observable();

        self.PersonInfo = ko.observable();

        self.checkedValue = ko.observable(0);

        self.optionList = new ITools.utils.forms.OptionsGender();

        self.ctxContact = new ITools.utils.forms.ContactList();

        self.isDataLoaded = ko.observable(false);

        self.databind();
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
                        $( "#viewAccountInfo" ).removeClass( "m-hide" );
                    }
                });
            $( ".app_content" ).css( "overflow", "hidden!important" );
            $( "#page" ).css( "background-color", "#0c2238" );
            $( "#page" ).css( "overflow-y", "hidden!important" );
            $( "select" ).material_select();
            $( "#inputMobile" ).mask( "(999) 999-9999" );
            $( "#inputHome" ).mask( "(999) 999-9999" );
            $( "#inputWork" ).mask( "(999) 999-9999? x99999" );

            self.updateContainer();
            $( window ).resize( function () {
                console.log("YTSADFFFFFFFFFFFFFFFFDDDDDDDDDDDDDDDDDDDDDDD")
                self.updateContainer();
            });

        }
        updateContainer() {

            var offSet = $( "#wrapperItem" ).offset(),
                docHeight = $( document ).height(),
                newHeight = docHeight - offSet.top,
                docWidth = $( document ).width();

            $( ".app_content" ).css( "overflow-y", "hidden!important" );
            $( "#pageContainer" ).css( "overflow-y", "hidden!important" );
            $( "#pageContainer" ).addClass( "no-scroll" );
            $( "#wrapperItem" ).height( newHeight + "px" );
            $( "#viewAccountInfo" ).height(( newHeight - 55 ) + "px" );

            if ( docWidth > 600 ) {
                $( ".app_content" ).css( "overflow-y", "hidden!important" );
                $( "#pageContainer" ).css( "overflow-y", "hidden!important" );
                $( "#pageContainer" ).addClass( "no-scroll" );
                $( "#viewAccountInfo" )
            } else {
                $( "#pageContainer" ).css( "overflow-y", "auto" );
                $( "#pageContainer" ).removeClass( "no-scroll" );
            }
            // overflow - y: auto!important
        }
        databind() {

            var self = this;
            var temp = self.appContext.identityUser.instance;

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

            console.warn(
                self.appContext.identityUser.instance );

            self.Membership
            = ko.mapping.fromJS( self.appContext.identityUser.instance.MembershipPlan );

          self.bindContactInfo();
            self.isDataLoaded( true );
        
            //  console.log(ko.toJSON(self.appContext.identityUser.instance));
            return Q.resolve( true );

        }

        bindContactInfo() {
            var self = this;
            self.appContext.identityUser.instance.Entity.EmailAddresses.forEach( item => {
                self.ctxContact.Email = new ITools.utils.forms.EmailAddressObservable( item );
            });
            self.appContext.identityUser.instance.Entity.Phones.forEach( item => {

                item.PhoneUsages.forEach( a => {
                    console.log( a );
                    if ( a.PhoneUsageEnum === IModel.models.Identity.IPayload.PhoneUsageEnum.Mobile ) {
                        self.ctxContact.Mobile = new ITools.utils.forms.PhoneObservable( item );
                    }
                    if ( a.PhoneUsageEnum === IModel.models.Identity.IPayload.PhoneUsageEnum.Work ) {
                        self.ctxContact.Work = new ITools.utils.forms.PhoneObservable( item );
                    }
                    if ( a.PhoneUsageEnum === IModel.models.Identity.IPayload.PhoneUsageEnum.Home ) {
                        self.ctxContact.Home = new ITools.utils.forms.PhoneObservable( item );
                    }
                });
            });
        }
        checkMemberNumber( data: any ) {
            console.warn( data );
            return data() === null ? "NA" : data;
        }
        qonClickUpdate( data, event ) {
            var self = this;


            switch ( self.index() ) {
                case 1:

                    break;
                case 2:
                    var data = ko.mapping.toJS( self.EntityInfo );
                    data.Phones.forEach(( item: IModel.models.Identity.IPayload.IPhone ) => {
                        item.PhoneUsages.forEach(( usage: IModel.models.Identity.IPayload.IPhoneUsage ) => {
                            if ( usage.PhoneUsageEnum === IModel.models.Identity.IPayload.PhoneUsageEnum.Mobile ) {
                                console.log( "Mobile", item.PhoneNumber );
                            }
                            if ( usage.PhoneUsageEnum === IModel.models.Identity.IPayload.PhoneUsageEnum.Home ) {
                                console.log( "Home", item.PhoneNumber );
                            }
                            if ( usage.PhoneUsageEnum === IModel.models.Identity.IPayload.PhoneUsageEnum.Work ) {
                                console.log( "Work", item.PhoneNumber );
                            }
                        });
                        console.log( item );
                    });
                    break;
                case 3:

                    break;
                case 4:

                    break;


            }

            console.log( "hello", self.index() );
        }
}
var vm: IPageModel = new Viewer(); export = vm;  