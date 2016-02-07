import IModel = require("models/icart");
import tools = require("components/cart/logic");
import IAppContext = require("core/IAppContext");
import AppContext = require("core/AppContext");
export module components.cart {
    export class SessionContext {
        appContext: IAppContext;
        RID: KnockoutObservable<number>;
        AccountID: KnockoutObservable<number>;
        Name: KnockoutObservable<string>;
        SelectedRID: KnockoutObservable<number>;
        SelectedName: KnockoutObservable<string>;
        SelectedAccountID: KnockoutObservable<number>;
        SelectedAccountCurrentState: KnockoutObservable<string>;
        Entity: any;
        constructor() {

            var self = this;

            self.appContext = AppContext;

            self.appContext.identityUser.instance.AccountInfo.Account
            = self.appContext.identityUser.instance.AccountInfo.AccountInfo;

            self.RID = ko.observable(
                self.appContext.identityUser.instance.RolodexItemID);

            self.Name = ko.observable(
                self.appContext.identityUser.instance.PersonInfo.FName
                + " "
                + self.appContext.identityUser.instance.PersonInfo.LName);

            self.AccountID = ko.observable(
                self.appContext.identityUser.instance.AccountInfo.Account.AccountID);

            self.SelectedAccountID = ko.observable(
                self.appContext.identityUser.instance.AccountInfo.Account.AccountID);


            self.SelectedAccountCurrentState = ko.observable(self.appContext.identityUser.instance.Entity.Addresses[0].State);

            self.SelectedRID = ko.observable(null);

            self.SelectedName = ko.observable("");


        }
    }
    export class Store {

        appContext: IAppContext;
        openHeight: KnockoutObservable<string>;

        tracker: tools.components.cart.logic.ActivityTracker;
        selectedItem: IModel.models.icart.IProductObservable;

        other: KnockoutObservable<any>;

        hasDependents: KnockoutObservable<boolean>;
        hasCartItem: KnockoutComputed<boolean>;
        isSelected: KnockoutObservable<boolean>;
        otherRecipientChecked: KnockoutComputed<string>;

        cart: IModel.models.icart.IStore;

        accounts: KnockoutObservableArray<any>;
        isOverrideInPlace: KnockoutObservable<boolean>;
        constructor() {
            var self = this;
            self.appContext = AppContext;
            self.openHeight = ko.observable("190px");
            self.isOverrideInPlace = ko.observable(false);
            self.session = new SessionContext();
            self.other = ko.observable();
            self.accounts = ko.observableArray([]);
            self.cart = {
                hasData: ko.observable(false),
                Selected: null,
                Products: ko.mapping.fromJS(
                    self.payload() ),
                instance: {
                    other: ko.observable(""),
                    recipient: ko.observable("SELF"),
                    selectedState: ko.observable(self.session.SelectedAccountCurrentState()),
                    selectedZipCode: ko.observable(""),
                    selectedPharmacy: ko.observable(""),
                    data: new IModel.models.icart.Reason(),
                    payment: new IModel.models.icart.Payment()
                }
            };
            self.isSelected = ko.observable(false);
            self.hasDependents = ko.observable(false);
            self.hasCartItem = ko.pureComputed(() =>
                self.isSelected());

            self.tracker = new tools.components.cart.logic.ActivityTracker(
                self.trackerGetHandler,
                self.trackerSetHandler,
                self.trackerRemoveHandler);

            self.otherRecipientChecked = ko.computed(
                () => {
                    if (!self.isOverrideInPlace()) {
                        if (self.cart.instance.recipient() !== "SELF") {
                            $("#panelOtherRecipients").removeClass("m-hide");
                            $("#panelOtherRecipients").removeClass("fadeOutDown animated-500-delay");
                            $("#panelOtherRecipients").addClass("fadeInUp animated-500-delay");
                        } else {
                            $("#panelOtherRecipients").removeClass("fadeInUp animated-500-delay");
                            $("#panelOtherRecipients").addClass("fadeOutDown animated-500-delay");
                        }
                        return self.cart.instance.recipient() === "SELF" ? "0" : "150px!important";
                    } else {
                        if (self.cart.instance.recipient() !== "SELF") {
                            self.openHeight("0");
                            $("#panelOtherRecipients").removeClass("fadeInUp animated-500-delay");
                            $("#panelOtherRecipients").addClass("fadeOutDown animated-500-delay");
                        }
                        return "0";
                    }
                }, self);
            self.getDependents();

        }

        select(item: IModel.models.icart.IProductObservable) {
            var self = this, browser = self.appContext.get_browser_info();
            console.warn(browser);
            if (item != null) {
                self.cart.Selected = item;
                if (browser.name !== "IE") {
                    self.tracker.setItem( "SelectedItem", item.ProductID() ); 
                }
                self.isSelected( true );
            } else {
                self.isSelected(false);
                self.cart.Selected = null;
                if ( browser.name !== "IE" ) {
                    self.tracker.setItem( "SelectedItem", null );
                }
            }
        }

   

        trackerGetHandler(data, err) {
            console.log("trackerGet", data, err);
        }
        trackerSetHandler(data, err) {
            console.log("trackerSet", data, err);
        }
        trackerRemoveHandler() {
            console.log("trackerRemove");
        }

        // contact_phone
        // speaker_notes
        // voice_chat

        payload() {
            var self = this;
            //ToDo:Change refernce to use IdentityUser.
            return [{
                Icon: "contact_phone",
                BusinessLevel: 1,
                MemberPrice: self.appContext.identityUser.instance.Products[0].MemberPrice,
                ClientPrice: 0,
                ProductID: "SV1",
                ProductLabel: "Phone Consult",
                ProductName: "Phone Consult"
            },
                {
                    Icon: "speaker_notes",
                    BusinessLevel: 1,
                    MemberPrice: self.appContext.identityUser.instance.Products[1].MemberPrice,
                    ClientPrice: 0,
                    ProductID: "SV2",
                    ProductLabel: "Email Consult",
                    ProductName: "Email Consult"
                },
                {
                    Icon: "voice_chat",
                    BusinessLevel: 1,
                    MemberPrice: self.appContext.identityUser.instance.Products[2].MemberPrice,
                    ClientPrice: 0,
                    ProductID: "SV3",
                    ProductLabel: "Video Consult",
                    ProductName: "Video Consult"
                }];
        }

        getDependents() {
            var self = this;
            self.accounts.removeAll();
            self.hasDependents( false );

            self.appContext.service.routes.members.loadDependents(
                self.appContext.identityUser.instance.RolodexItemID).fail(() => {
                    self.getDependents();
                }).done(data => {
                    if (data.length !== 1) {
                        self.hasDependents(true);
                        data.forEach(item => {
                            if (item.RID !== self.appContext.identityUser.instance.RolodexItemID) {
                                self.accounts.push(item);
                            }
                        });
                    } else {
                        self.hasDependents(false);
                    }}).then(() => {console.log("done");});
        }
        getIcon(arg) {
            return IModel.models.icart.RxIcon.getIcon(arg);
        }
        session: SessionContext;
    }
}