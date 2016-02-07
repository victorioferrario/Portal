import ko = require("knockout");
import AppModule = require("durandal/app");
import activator = require("durandal/activator");
import IViewModel = require("core/IViewModel");
import ViewModel = require("core/ViewModel");
import Env = require("system/events/ClinicalCommands");
import Env2 = require("system/events/EventCommand");
import IModels = require("models/consults/history");
import PlanOfCare = require("views/components/details/planofCare");
import IData = require("models/consults/messaging/messaging");
class DefaultManager extends ViewModel {
    title: KnockoutObservable<string>;
    currentInstance: KnockoutObservable<any>;
    pageControl: KnockoutObservable<any>;
    frmControl: KnockoutObservable<any>;
    isLoadingDetails: KnockoutObservable<boolean>;
    hasData: KnockoutObservable<boolean>;
    hasFiles: KnockoutObservable<boolean>;
    planofCare:PlanOfCare;
    placeHolderPlanOfCare:KnockoutObservable<any>;
    dataModel: KnockoutObservable<any | IModels.models.consults.history.RootObject>;
    dataFiles: KnockoutObservableArray<any | IModels.models.consults.history.controls.AttachmentItem>;

    
    isEConsultation: KnockoutObservable<boolean>;

    messages: KnockoutObservableArray<any | IData.models.consults.messaging.IMessageExchange>;
    hasMessages: KnockoutObservable<boolean>;
    isLoadingMessages: KnockoutObservable<boolean>;
    constructor() {
        super();
        var self = this;

        self.hasData = ko.observable(false);
        self.hasFiles = ko.observable(false);
        self.hasMessages = ko.observable(false);

        self.isEConsultation = ko.observable(false);

        self.dataModel = ko.observable();
        self.placeHolderPlanOfCare = ko.observable();
        self.dataFiles = ko.observableArray();
        self.pageControl = ko.observable();
        self.currentInstance = ko.observable();

        self.isLoadingDetails = ko.observable(false);
        self.isLoadingMessages = ko.observable(false);

        self.selectedInstance = ko.observable();


        ko.postbox.subscribe(Env.system.events.Clinical.VIEW_DETAIL_CONTROL, data => {
            self.addFormControl(data);
        }, this);

        ko.postbox.subscribe(Env2.system.events.GeneralCommands.DATA_CONSULT_DETAIL_LOADED, data => {
            self.onDataLoaded(data);
        }, this);
        ko.postbox.subscribe(
            Env2.system.events.GeneralCommands.DATA_CONSULT_COMPLETED_MESSAGES_LOADED, data => {
                self.onMessagesLoaded();
            }, this);
    }
    activate() {
        return this.databind();
    }
    canActivate() {
        return Q.resolve(true);
    }
    canDeActivate() {
        console.log("CAN DEACTIVEATE");
        return Q.resolve(true);
    }
    compositionComplete() {
        var self = this;
        self.modalContent = $("#modalCompletedContent");
        self.modalManager = $("#modalDetailsManager");
    }
    databind() {
        var self = this;
        self.title = ko.observable("Form Manager");
        return Q.resolve(true);
    }
    selectedInstance:KnockoutObservable<any>;
    addFormControl(data) {
        console.log("command", this, data);
        var self = this;
        self.selectedInstance(data);
        self.hasData(false);
        self.isLoadingDetails(true);
        self.appContext.identityUser.dataContext.loadConsultDetail(data.ConsultationID());
    }
    onDataLoaded(data) {
        var self = this;
        console.warn(data);
        self.hasFiles(false);
        self.dataFiles.removeAll();
       
        if (self.selectedInstance().ProductID() !== "SV2") {
            self.hasMessages(false);
            self.isEConsultation(false); 
        } else {
            self.hasMessages(true);
            self.isLoadingMessages(true);
            self.isEConsultation(true); 
            self.appContext.identityUser.dataContext.loadCompletedConsultMessages(
                self.selectedInstance().ConsultationID());
        }
        self.dataModel(self.appContext.identityUser.dataContext.data.detail());
        if (self.dataModel().EncounterData.Files.length > 0) {
            self.hasFiles(true);
            self.dataModel().EncounterData.Files.forEach(item => {
                self.dataFiles.push(new IModels.models.consults.history.controls.AttachmentItem(item));
                console.log(item);
            });
        }
        self.planofCare = new PlanOfCare(
            self.dataModel().PlanOfCare);

        self.placeHolderPlanOfCare(self.planofCare);

        setTimeout(function () {
            self.hasData(true);
            self.isLoadingDetails(false);
        }, 500);
    }

    onMessagesLoaded() {
        var self = this;
        console.log("hello");
        if (self.appContext.identityUser.dataContext.data.messages().length > 0) {
            self.messages = self.appContext.identityUser.dataContext.data.messages;
        } else {
            self.hasMessages(false);
            self.messages = null;
        }
        self.isLoadingMessages(false);
    }


    getProductIcon(productID) {
        var result = "";
        console.log(productID, "yoooo");
        switch (productID()) {
            case "SV1":
                result = "<i class=\"material-icons cart-icon blue-text\">contact_phone</i>";
                break;
            case "SV2":
                result = "<i class=\"material-icons cart-icon blue-text\">speaker_notes</i>";
                break;
            case "SV3":
                result = "<i class=\"material-icons cart-icon blue-text\">voice_chat</i>";
                break;
        }
        console.log(result);
        return result;
    }
    selectImage( context, data, event ) {
        console.log( context, data, event );
        var guid = ko.mapping.toJS( context.FileGUID ),
            target = $( "#large__" + guid );
        target.removeClass( "m-hide" );
        target.velocity(
            "fadeIn", {
                delay: 0,
                duration: 400,
                begin( elements ) {
                    target.removeClass( "slideOutDown animated" );
                },
                complete( elements ) {
                    //   $( "#modalPendingDetailsManager" ).addClass( "m-hide" );
                }
            });
        target.on( "click", function () {
            target.velocity(
                "fadeOut", {
                    delay: 0,
                    duration: 400,
                    begin( elements ) {
                        target.addClass( "slideOutDown animated" );
                    },
                    complete( elements ) {
                        target.addClass( "m-hide" );
                        //   $( "#modalPendingDetailsManager" ).addClass( "m-hide" );
                    }
                });
        });
        //  screenfull.request( target[0] );

    }
    modalContent: JQuery;
    modalManager: JQuery;
    
    clickExit(data, event) {

        $( ".modal-content" ).addClass( "m-hide" );
        $( "#modalDetailsManager" ).closeModal();
        $( "#modalDetailsManager" ).velocity(
            "fadeOut", {
                delay: 1,
                duration: 400,
                begin( elements ) {
                },
                complete( elements ) {
                    $( "#modalDetailsManager" ).addClass( "m-hide" );
                }
            });
    }
    getConsultType() {
        var self = this;
        return self.selectedInstance().ProductID;
    }
    getDateFormat(a): string {
        if (a !== null && a !== undefined) {
            var date = new Date(a);
            return date.toLocaleDateString();
        } else {
            return "";
        }
    }
    getTimeFormat(a): string {
        console.log(a);
        if (a !== null && a !== undefined) {
            var date = new Date(a);
            return date.toLocaleTimeString();
        } else {
            return "";
        }
    }
    getSenderName(rid): string {
        var self = this;
        if (self.appContext.identityUser.instance.RolodexItemID !== rid) {
            return self.selectedInstance().DrName();
        } else {
            return self.appContext.identityUser.instance.PersonInfo.FName
                + " " + self.appContext.identityUser.instance.PersonInfo.LName;
        }
    }
    getDynamicId() {
        var self = this;
        console.log("here");
        self.dynamicIndex++;
        return "attachment_" + self.selectedInstance().ConsultationID + "__" + self.dynamicIndex;
    }
    dynamicIndex: number = 1;
    getConsultationServicingProcessState() {
        var self = this, result = "", arg = ko.unwrap(self.selectedInstance());
        console.warn(arg);
        switch (arg.ConsultationServicingProcessState()) {
            case IModels.models.consults.history.ProcessStateEnum.Canceled:
                result = "Canceled";
                break;
            case IModels.models.consults.history.ProcessStateEnum.Initialized:
                result = "Initialized";
                break;
            case IModels.models.consults.history.ProcessStateEnum.Initializing:
                result = "Initializing";
                break;
            case IModels.models.consults.history.ProcessStateEnum.Undefined:
                result = "Undefined";
                break;
            case IModels.models.consults.history.ProcessStateEnum.Running:
                result = "Running";
                break;
        }
        return result;
    }
    getConsultationProcessingProcessState() {
        var self = this, result = "", arg = ko.unwrap(self.selectedInstance());
        switch (arg.ConsultationProcessingProcessState()) {
            case IModels.models.consults.history.ProcessStateEnum.Canceled:
                result = "Canceled";
                break;
            case IModels.models.consults.history.ProcessStateEnum.Initialized:
                result = "Initialized";
                break;
            case IModels.models.consults.history.ProcessStateEnum.Initializing:
                result = "Initializing";
                break;
            case IModels.models.consults.history.ProcessStateEnum.Undefined:
                result = "Undefined";
                break;
            case IModels.models.consults.history.ProcessStateEnum.Running:
                result = "Running";
                break;
        }
        return result;
    }
    
}

export = DefaultManager;  