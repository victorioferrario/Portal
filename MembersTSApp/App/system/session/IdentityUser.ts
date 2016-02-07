import LG = require("models/identity/IPayload");
import Http = require("services/HttpService");
import ILG = require("models/consults/data");
import Env = require("system/events/EventCommand");
import AppModule = require("durandal/app");
import IModels = require("models/consults/history");
import IData = require("models/consults/messaging/messaging");
export module sys.session {
    export class IdentityUser {
        service: Http;
        app: DurandalAppModule;
        dataContext: DataManager;
        instance: LG.models.Identity.IPayload.IInstance;
        instanceRID: LG.models.Identity.IPayload.IJsonPage;
        RID: number;
        hasDependents: KnockoutObservable<boolean>;
        dependentLists: KnockoutObservableArray<LG.models.Account.IDependent>;

        constructor() {
            var self = this;
            self.app = AppModule;
            self.service = new Http();
            self.dataContext = new DataManager();
            self.hasDependents = ko.observable(false);
            self.dependentLists = ko.observableArray([]);
            ko.postbox.subscribe(
                Env.system.events.GeneralCommands.DATA_LOADED__DEPENDENTS,
                data => {
                    this.populateDependents();
                });
            ko.postbox.subscribe(
                Env.system.events.GeneralCommands.DATA_LOADED__CREDIT_CARDS,
                data => {
                    this.populateCreditCards(data);
                });
        }

        populate() {
            var self = this, payload = document.getElementById("jsonPayload").textContent;
            if (document.getElementById("jsonPayload").textContent.length > 0) {
                if (payload !== "" && payload !== undefined && payload !== null) {
                    var result = JSON.parse(payload);
                    self.instanceRID = result.Identity.RID;
                    self.RID = result.Identity.RID;
                } else {
                    self.service.routes.members.isAuthenticated()
                        .fail(() => {
                        }).done(data => {
                            console.log(data);
                        });
                }
            } else {

            }
            return true;
        }

        populateDependents() {
            var self = this;
            console.warn("POPULATING DEPENDENTS");
            if (self.dataContext.data.dependents() !== null && self.dataContext.data.dependents() !== undefined) {
                self.hasDependents(true);
                self.dependentLists.removeAll();
                ko.utils.arrayForEach(self.dataContext.data.dependents(),
                    dependent => {
                        self.dependentLists.push(dependent);
                    });
            } else {
                self.hasDependents(false);
            }
            self.app.trigger(Env.system.events.GeneralCommands.DATA_LOADED, "SUCCESS");
        }

        populateCreditCards(result) {
            var self = this;
            self.instance.CreditCartList = [];
            result.Data.forEach(item => {
                this.instance.CreditCartList.push(item);
            });
            ko.postbox.publish(Env.system.events.GeneralCommands.UI_RELOAD__CREDIT_CARDS);

        }
    }

    export class DataHanger {
        hasDependents:KnockoutObservable<boolean>;
        dependents: KnockoutObservableArray<LG.models.Account.IDependent>;
        detail: KnockoutObservable<any | IModels.models.consults.history.RootObject>;
        messages: KnockoutObservableArray<any | IData.models.consults.messaging.IMessageExchange>;
        messageLastIndex:KnockoutObservable<number>;
        history: ILG.models.consults.data.IObject;
        orders: ILG.models.consults.data.IObject;
        isPreConsultFlag: KnockoutObservable<boolean>;
        preConsoleFlagIndex: KnockoutObservable<number>;
        constructor() {
            var self = this;
            self.history = { CorporationRID: 10 };
            self.orders = { CorporationRID: 10 };
            self.detail = ko.observable();
            self.messages = ko.observableArray();
            self.hasDependents = ko.observable(false);
            self.dependents = ko.observableArray( [] );
            self.isPreConsultFlag = ko.observable(false);
            self.preConsoleFlagIndex = ko.observable(0);
            self.messageLastIndex = ko.observable(0);
        }
    }
    export class DataManager {
        app:DurandalAppModule;
        service: Http;
        data: DataHanger;
        constructor() {
            var self = this;
            self.app = AppModule;
            self.service = new Http();
            self.data = new DataHanger();
          //  self.loadMemberDetail();
        }
        loadHistory() {
            var self = this;
            self.service.routes.members.loadConsultHistory()
            .fail(() => {})
            .done(data => {
                self.data.history = ko.mapping.fromJS(data);
                ko.postbox.publish(Env.system.events.GeneralCommands.DATA_LOADED,
                    {
                        Data: ""
                    });
                });
        }
        loadConsultActivity() {
            var self = this;
            self.service.routes.members.loadOrderHistory()
                .fail(() => { })
                .done( data => {
                    self.data.history = ko.mapping.fromJS( data );
                    ko.postbox.publish(
                        Env.system.events.GeneralCommands.DATA_LOADED_ORDERS_LIST,
                        {
                            Data: ""
                        });
                });
        }
        loadOrderActivity() {
            var self = this;
            self.service.routes.members.loadOrderHistory()
                .fail(() => { })
                .done( data => {
                    self.data.orders = ko.mapping.fromJS( data[1] );
                    self.data.history = ko.mapping.fromJS( data[0] );
                    ko.postbox.publish(
                        Env.system.events.GeneralCommands.DATA_LOADED_ORDERS_LIST,
                        {
                            Data: ""
                        });
                });
        }
        loadConsultDetail( id: number ) {
            var self = this;
            self.service.routes.members.loadConsultByID(id)
                .fail(() => {})
                .done(data => {
                    self.data.detail(data);
                    ko.postbox.publish(Env.system.events.GeneralCommands.DATA_CONSULT_DETAIL_LOADED, {Data: ""});
                });
        }
        loadPendingConsultDetail( id: number ) {
            var self = this;
            self.service.routes.members.loadConsultByID( id )
                .fail(() => { })
                .done( data => {
                    self.data.detail( data );
                    ko.postbox.publish(
                        Env.system.events.GeneralCommands.DATA_CONSULT_PENDING_DETAIL_LOADED, { Data: "" });
                });
        }
        loadPendingConsultMessages(id: number) {
            var self = this;
            self.data.messages.removeAll();
            self.service.routes.members.loadMessagesByID(id)
                .fail(() => { })
                .done((result:IData.models.consults.messaging.IPayload) => {
                    if (result.MessageExchange.length > 0) {
                        var i = 0;
                        result.MessageExchange.forEach((item: IData.models.consults.messaging.IMessageExchange) => {
                            item.index = i++;
                            self.data.messages.push(item);
                        });
                        self.data.messageLastIndex(i);
                    }
                    ko.postbox.publish(
                        Env.system.events.GeneralCommands.DATA_CONSULT_PENDING_MESSAGES_LOADED, { Data: "" });
                });
        }
        loadCompletedConsultMessages(id: number) {
            var self = this;
            self.data.messages.removeAll();
            self.service.routes.members.loadMessagesByID(id)
                .fail(() => { })
                .done((result: IData.models.consults.messaging.IPayload) => {
                    if (result.MessageExchange.length > 0) {
                        var i = 0;
                        result.MessageExchange.forEach((item: IData.models.consults.messaging.IMessageExchange) => {
                            item.index = i++;
                            self.data.messages.push(item);
                        });
                        self.data.messageLastIndex(i);
                    }
                    ko.postbox.publish(
                        Env.system.events.GeneralCommands.DATA_CONSULT_COMPLETED_MESSAGES_LOADED, { Data: "" });
                });
        }
        loadMemberDetail() {
            var self = this;
            self.service.routes.members.getMember()
                .fail(() => { })
                .done( data => {
                    console.log("loadMemberDetail",data );
                    if (data === null) {} else {
                        ko.postbox.publish( Env.system.events.GeneralCommands.DATA_LOADED__DETAIL,
                          {
                              Data: data
                         });
                    }
               });
        }
        loadDependents(id:number) {
            var self = this;
            self.data.dependents.removeAll();
            self.service.routes.members.loadDependents( id )
                .fail(() => {
                    self.loadDependents(id);
                }).done( data => {
                    if ( data.length !== 1 ) {
                        self.data.hasDependents( true );
                        data.forEach( item => {
                            if ( item.RID !== id ) {
                                self.data.dependents.push(item);
                            }
                        });
                    } else {
                        self.data.hasDependents(false);
                    }
                }).then(() => {
                    ko.postbox.publish(
                        Env.system.events.GeneralCommands.DATA_LOADED__DEPENDENTS, { Data: "good" });
                  
          });
        }
        loadCreditCards(  ) {
            var self = this;
            self.data.dependents.removeAll();
            self.service.routes.members.loadCreditCards() 
                .fail(() => {
                    
                }).done( data => {
                    ko.postbox.publish(
                        Env.system.events.GeneralCommands.DATA_LOADED__CREDIT_CARDS, { Data: data });
                });
        }
    }
}