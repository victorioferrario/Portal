import ordering = require("components/cart/store")
export namespace components.cart.ui {
    export class StoreSettings {
        static stateForm = "#stateForm";
        static stateLabel = "#stateLabel";
        static stateInstructions1 = "#stateInstructions1";
        static stateInstructions2 = "#stateInstructions2";

        static zipCodeRow = "#view3Row";

        static view3ResultsRow = "#view3Results";
        static viewConsentForm = "#viewConsentForm";

        static hideClass = "m-hide";

        static openHeight = "75px";
        static closeHeight = "0";

        static backButtton = "#backButtonInstance";

        static viewsStepperBar = "#viewsStepperBar";
        static viewsConsentCheckBox = "#viewsConsentCheckBox";

        static viewsTermsCheckbox = "#viewsTermsAndConditionsCheckout";
        
           static cssView1 = ".cart_step__1__view1";
           static cssView2 = ".cart_step__2__view1";
           static cssView3 = ".cart_step__3__view1";
           static cssView4 = ".cart_step__4__view1";
           static cssView5 = ".cart_step__5__view1";

           static cssStep6View1 = ".cart_step__6__view1";
           static cssStep6View2 = ".cart_step__6__view2";
           static cssStep6View3 = ".cart_step__6__view3";
          
        //| stateInstructions1 | stateInstructions2
    }
    export class StoreLayoutManager {
        store:ordering.components.cart.Store;
        isCheckOut: KnockoutComputed<boolean>;
        backButton: KnockoutObservable<string>;
        heightOfView2: KnockoutObservable<string>;
        heightOfView3: KnockoutObservable<string>;
        heightOfView3Results: KnockoutObservable<string>;

        isPricingTable: KnockoutObservable<boolean>;
        isSelectingPerson: KnockoutObservable<boolean>;
        isOtherButtonDisabled: KnockoutComputed<string>;

        isLoadingSearch: KnockoutObservable<boolean>;
        hasPharmacyBeenSelected: KnockoutObservable<boolean>;
        hasPharmaciesSearchResults: KnockoutObservable<boolean>;
        

        constructor(store: ordering.components.cart.Store) {

            var self = this;

            self.store = store;

            self.backButton =
                ko.observable("waves-effect waves-light btn blue darken-2 white-text fadeUpIn animated-500-delay m-hide");

            self.heightOfView2 = ko.observable(
                StoreSettings.closeHeight);

            self.heightOfView3 = ko.observable(
                StoreSettings.closeHeight);

            self.heightOfView3Results = ko.observable(
                StoreSettings.closeHeight);


            self.isPricingTable = ko.observable(true);
            self.isLoadingSearch = ko.observable(false);
            self.isSelectingPerson = ko.observable(true);

            self.isCheckOut = ko.pureComputed(() =>
                !self.isPricingTable(), self);

            self.isOtherButtonDisabled = ko.computed(() => {
                if (store.cart.instance.recipient() !== "SELF") {
                    //$("#panelOtherRecipients").removeClass("m-hide");
                    return store.other() === "" || store.other() === undefined ? "btn grey darken-2 white-text" : "waves-effect waves-light btn blue darken-2 white-text";
                } else {
                   // $("#panelOtherRecipients").addClass("m-hide");
                    return "waves-effect waves-light btn blue darken-2 white-text";
                }
            });

            self.hasPharmacyBeenSelected = ko.observable(false);

            self.hasPharmaciesSearchResults = ko.observable(false);

        }
        display(index) {
            var self = this;
            switch (index) {
                case 0:

                    self.heightOfView2(
                        StoreSettings.closeHeight);

                    self.heightOfView3(
                        StoreSettings.closeHeight);

                    self.heightOfView3Results(
                        StoreSettings.closeHeight);

                    self.isSelectingPerson(true);

                    self.hasPharmacyBeenSelected(false);

                    self.hasPharmaciesSearchResults(false);

                    $(StoreSettings.backButtton).addClass(
                        StoreSettings.hideClass);

                    if (!$(StoreSettings.stateLabel).hasClass(StoreSettings.hideClass)) {
                        $(StoreSettings.stateLabel).addClass(
                            StoreSettings.hideClass);
                    }
                    if (!$(StoreSettings.stateInstructions2).hasClass(StoreSettings.hideClass)) {
                        $(StoreSettings.stateInstructions2).addClass(
                            StoreSettings.hideClass);
                    }
                    if (!$(StoreSettings.viewConsentForm).hasClass(StoreSettings.hideClass)) {
                        $(StoreSettings.viewConsentForm).addClass(
                            StoreSettings.hideClass);
                    }
                    $(StoreSettings.stateForm).removeClass
                        (StoreSettings.hideClass);

                    $(StoreSettings.stateInstructions1).removeClass(
                        StoreSettings.hideClass);

                    self.store.cart.instance.selectedZipCode("");

                    break;
                case 1:

                    self.heightOfView2(
                        StoreSettings.openHeight);

                    self.heightOfView3(
                        StoreSettings.closeHeight);

                    self.isSelectingPerson(false);

                    $(StoreSettings.backButtton).removeClass(
                        StoreSettings.hideClass);

                    break;
                case 2:
                    $("#view3Row").removeClass("m-hide");
                    // Switch Form
                    $(StoreSettings.stateForm).addClass(
                        StoreSettings.hideClass);

                    $(StoreSettings.stateInstructions1).addClass(
                        StoreSettings.hideClass);

                    // Show Display
                    $(StoreSettings.stateInstructions2).removeClass(
                        StoreSettings.hideClass);

                    $(StoreSettings.stateLabel).removeClass(
                        StoreSettings.hideClass);

                    $(StoreSettings.zipCodeRow).removeClass(
                        StoreSettings.hideClass);

                    self.heightOfView3(
                        StoreSettings.openHeight);


                    console.log("HELLLLO", "m-hide");
                    break;


            }
        }
        
        initSearchScreen() {

            var self = this;

            self.heightOfView3("365px");

            self.heightOfView3Results("290px");

            self.isLoadingSearch(true);
            $(StoreSettings.view3ResultsRow).css(
                "background-color", "#1976D2");
      
        }


        backDisplay(index) {
            var self = this;
            switch (index) {
                case 1:
                    self.heightOfView2(
                        StoreSettings.openHeight);

                    self.heightOfView3
                        (StoreSettings.closeHeight);
                    
                    $(StoreSettings.stateForm).removeClass(
                        StoreSettings.hideClass);

                    $(StoreSettings.stateInstructions1).removeClass(
                        StoreSettings.hideClass);

                    // Hide Display

                    $(StoreSettings.zipCodeRow).addClass(
                        StoreSettings.hideClass);

                    $(StoreSettings.stateLabel).addClass(
                        StoreSettings.hideClass);

                    $(StoreSettings.stateInstructions2).addClass(
                        StoreSettings.hideClass);
                    break;
            }
        }
    }
}