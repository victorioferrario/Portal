import ko = require("knockout");
import AppModule = require("durandal/app");
import activator = require("durandal/activator");
import IViewModel = require("core/IViewModel");
import ViewModel = require("core/ViewModel");
import Env = require("system/events/ClinicalCommands");
import Env2 = require("system/events/EventCommand");
import IModels = require("models/consults/history");
import IData = require("models/consults/messaging/messaging");
import PlanOfCare = require("views/components/details/planofCare");
declare var screenfull;
class PendingManager extends ViewModel {

    //#region   [   PROPERTIES               ]

    planofCare: PlanOfCare;
    selectedInstance: KnockoutObservable<any>;

    title: KnockoutObservable<string>;
    frmControl: KnockoutObservable<any>;
    pageControl: KnockoutObservable<any>;
    replyMessage: KnockoutObservable<string>;
    currentInstance: KnockoutObservable<any>;
    isReplyActive: KnockoutObservable<boolean>;

    isValidate: KnockoutObservable<boolean>;
    isLoadingDetails: KnockoutObservable<boolean>;
    isLoadingMessages: KnockoutObservable<boolean>;

    hasData: KnockoutObservable<boolean>;
    hasFiles: KnockoutObservable<boolean>;
    hasMessages: KnockoutObservable<boolean>;

    placeHolderPlanOfCare: KnockoutObservable<any>;
    modalContent: JQuery;
    modalManager: JQuery ;

    dataModel: KnockoutObservable<any | IModels.models.consults.history.RootObject>;
    messages: KnockoutObservableArray<any | IData.models.consults.messaging.IMessageExchange>;
    dataFiles: KnockoutObservableArray<any | IModels.models.consults.history.controls.AttachmentItem>;
    
    //#endregion

    //#region   [   PAGE METHODS             ]

    constructor() {
        super();

        var self = this;


        self.isValidate = ko.observable(false);

        self.hasData = ko.observable(false);
        self.hasFiles = ko.observable(false);
        self.hasMessages = ko.observable(false);

        self.isReplyActive = ko.observable(false);

        self.dataModel = ko.observable();
        self.dataFiles = ko.observableArray();

        self.pageControl = ko.observable();
        self.replyMessage = ko.observable("");
        self.currentInstance = ko.observable();
        self.selectedInstance = ko.observable();
        self.placeHolderPlanOfCare = ko.observable();

        self.isLoadingDetails = ko.observable(false);
        self.isLoadingMessages = ko.observable(true);

        ko.postbox.subscribe(
            Env.system.events.Clinical.VIEW_PENDING_DETAIL_CONTROL, data => {
                self.addFormControl(data);
            }, this);

        ko.postbox.subscribe(
            Env2.system.events.GeneralCommands.DATA_CONSULT_PENDING_DETAIL_LOADED, data => {
            self.onDataLoaded(data);
            }, this);



        ko.postbox.subscribe(
            Env2.system.events.GeneralCommands.DATA_CONSULT_PENDING_MESSAGES_LOADED, data => {
            self.onMessagesLoaded();
        }, this);

    }

    activate() {
        return this.databind();
    }
    databind() {
        var self = this;
        self.title = ko.observable("Form Manager");
        return Q.resolve(true);
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
       self.modalContent = $("#modalPendingContent");
       self.modalManager = $("#modalPendingDetailsManager");
        //self.appContext.resetViewPort();
    }
    
    addFormControl(data) {
        var self = this;
        self.selectedInstance(data);
        self.hasData(false);
        self.isLoadingDetails(true);
        console.log("Me");
        self.appContext.identityUser.dataContext.loadPendingConsultDetail(
            data.ConsultationID());
    }

    onDataLoaded(data) {
        var self = this;
        self.hasFiles(false);
        self.dataFiles.removeAll();
        // Check for E-Consult;
        if (self.selectedInstance().ProductID() !== "SV2") {
            self.hasMessages(false);
        } else {
            self.hasMessages(true);
            self.isLoadingMessages(true);
            self.appContext.identityUser.dataContext.loadPendingConsultMessages(
                self.selectedInstance().ConsultationID());
        }
        console.log("Me");
        // Bind Clinical Data
        self.dataModel(self.appContext.identityUser.dataContext.data.detail());
        if (self.dataModel().EncounterData.Files.length > 0) {
            self.hasFiles(true);
            self.dataModel().EncounterData.Files.forEach(item => {
                self.dataFiles.push(
                    new IModels.models.consults.history.controls.AttachmentItem(item));
            });
        }
        // Display Control
        setTimeout(() => {
            this.hasData(true);
            this.isLoadingDetails(false);
        }, 500);

    }
    onMessagesLoaded() {
        var self = this;
        if (self.appContext.identityUser.dataContext.data.messages().length > 0) {
            self.messages = self.appContext.identityUser.dataContext.data.messages;
        } else {
            self.hasMessages(false);
            self.messages = null;
        }
        self.isLoadingMessages(false);
    }
   
     //#endregion

    //#region   [   PROPERTY GETTERS         ]
    
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
    getProductIcon(productId) {
        var result = "";
        switch (productId()) {
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
        return result;
    }
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
    
    //#endregion

    //#region   [   FILE ATTACHMENTS         ]

    getDynamicId() {
        var self = this;
        console.log("here");
        self.dynamicIndex++;
        return "attachment_" + self.selectedInstance().ConsultationID + "__" + self.dynamicIndex;
    }
    dynamicIndex: number = 1;
    selectImage(context, data, event) {
        console.log(context, data, event);
        var guid = ko.mapping.toJS(context.FileGUID),
            target = $("#large__" + guid);
        target.removeClass("m-hide");
        target.velocity(
            "fadeIn", {
                delay: 0,
                duration: 400,
                begin(elements) {
                    target.removeClass("slideOutDown animated");
                },
                complete(elements) {
                    //   $( "#modalPendingDetailsManager" ).addClass( "m-hide" );
                }
            });
        target.on("click", function () {
            target.velocity(
                "fadeOut", {
                    delay: 0,
                    duration: 400,
                    begin(elements) {
                        target.addClass("slideOutDown animated");
                    },
                    complete(elements) {
                        target.addClass("m-hide");
                        //   $( "#modalPendingDetailsManager" ).addClass( "m-hide" );
                    }
                });
        });
        //  screenfull.request( target[0] );

    }
    
    //#endregion

    //#region   [   CLICK HANDLERS           ]

    clickExit(data, event) {
        var self = this;
        self.modalContent.addClass("m-hide");
        self.modalManager.closeModal();
        self.modalManager.velocity(
            "fadeOut", {
                delay: 1,
                duration: 400,
                begin(elements) { },
                complete(elements) {
                    self.modalManager.addClass("m-hide");
                }
            });
    }
    clickToReply(data, event) {
        var self = this;
        self.isReplyActive(true);
        self.modalContent.scrollTop(300);
    }
    clickToCancelReply(data, event) {
        var self = this;
        self.replyMessage("");
        self.isReplyActive(false);
    }
    clickToSendMessage(data, event) {
        var self = this;
        self.isValidate(true);
        if (self.replyMessage() !== "") {

            var entity: IData.models.consults.messaging.IMessageEntity
                = new IData.models.consults.messaging.MessageEntity(self.replyMessage());

            self.hasData(false);
            self.isReplyActive(false);
            self.isLoadingDetails(true);

            self.appContext.service.routes.members.sendMessage(entity).fail(() => {
                console.log("error");

            }).done((result:IData.models.consults.messaging.IPayload) => {
                self.appContext.identityUser.dataContext.data.messages.removeAll();
                if (result.MessageExchange.length > 0) {
                    var i = 0;
                    result.MessageExchange.forEach((item: IData.models.consults.messaging.IMessageExchange) => {
                        item.index = i++;
                        self.appContext.identityUser.dataContext.data.messages.push(item);
                    });
                    self.appContext.identityUser.dataContext.data.messageLastIndex(i);
                }
                }).then(() => {
                self.hasData(true);
                self.replyMessage("");
                self.onMessagesLoaded();
                self.isLoadingDetails(false);
            });
            
        }
    }


    verifyIfHasReplyButton(data) {
        var self = this;
        console.log(data);
        console.log(self.appContext.identityUser.dataContext.data.messageLastIndex());
     
        return data.index  === self.appContext.identityUser.dataContext.data.messageLastIndex()-1;
    }
    
   //#endregion

    getDataTrace(data) {
        console.info("GETDATATRACE", data);
    }
}

export = PendingManager;  

//$(".modal-content").addClass("m-hide");
//$("#modalPendingDetailsManager").closeModal();
//$("#modalPendingDetailsManager").velocity(
//    "fadeOut", {
//        delay: 1,
//        duration: 400,
//        begin(elements) {
//        },
//        complete(elements) {
//            $("#modalPendingDetailsManager").addClass("m-hide");
//        }
//    });