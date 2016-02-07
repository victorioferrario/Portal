export interface IMemberApi {
    defaultOptions: {};
    antiForgeryToken: string;
    getMember: () => JQueryXHR;
    loadMember: (id) => JQueryXHR;
    loadDependents: (id) => JQueryXHR;
    isAuthenticated: () => JQueryXHR;
    loadHealthRecords: () => JQueryXHR;

    saveOrder: ( entity ) => JQueryXHR;
    searchPharmacies: ( value ) => JQueryXHR;

    loadOrderHistory: () => JQueryXHR;
    loadConsultHistory: () => JQueryXHR;
    loadConsultByID: (id) => JQueryXHR;
    loadConsultHistoryByID: ( id ) => JQueryXHR;
    loadMessagesByID: ( id ) => JQueryXHR;
    sendMessage: ( entity ) => JQueryXHR;
    
    savePhone: ( entity ) => JQueryXHR;
    saveAddress: ( entity ) => JQueryXHR;
    saveGeneralInfo: ( entity ) => JQueryXHR;
    saveCreditCard: ( entity ) => JQueryXHR;
    saveDependent: ( entity ) => JQueryXHR;

    validateEmail: ( value ) => JQueryXHR;

    loadCreditCards: () => JQueryXHR;
    
    //validate/ Email / { value }
}
export class MemberApi {
    ref: MemberApi;
    instance: IMemberApi;
    defaultOptions: {};
    antiForgeryToken: string;
    static route = "api/DataService/";
    constructor(self: any) {
        this.instance = {
            defaultOptions: {},
            antiForgeryToken: "",
            isAuthenticated: () => self.invoke.call(
                self, MemberApi.route + "get/IsAuthenticated",
                "get", {}),
            getMember: () => self.invoke.call(
                self, MemberApi.route + "get/Member",
                "get", {}),
            loadMember: id => self.invoke.call(
                self, MemberApi.route + "load/Member/" + id,
                "get", {}),
            loadHealthRecords: () => self.invoke.call(
                self, MemberApi.route + "get/HealthRecords",
                "get", {}),
            loadDependents: id => self.invoke.call(
                self, MemberApi.route + "load/Dependents/" + id,
                "get", {}),
            saveOrder: entity => self.invoke.call(
                self, MemberApi.route + "save/StartOrder",
                "post", {}, entity),
            searchPharmacies: value => self.invoke.call(
                self, MemberApi.route + "search/Pharmacies/" + value,
                "get", {}),
            loadConsultHistory: () => self.invoke.call(
                self, MemberApi.route + "load/ConsultsHistory",
                "get", {}),
            loadOrderHistory: () => self.invoke.call(
                self, MemberApi.route + "load/OrderList",
                "get", {}),
            loadConsultHistoryByID: id => self.invoke.call(
                self, MemberApi.route + "find/Consults/ByAccountID/" + id,
                "get", {}),
            loadConsultByID: id => self.invoke.call(
                self, MemberApi.route + "load/Consult/" + id,
                "get", {}),
            loadMessagesByID: id => self.invoke.call(
                self, MemberApi.route + "load/Messages/" + id,
                "get", {}),
            sendMessage: entity => self.invoke.call( self,
                MemberApi.route + "send/Message",
                "post", {}, entity),
            savePhone: entity => self.invoke.call(self,
                MemberApi.route + "save/Account/Phone", "post", {}, entity),
            saveAddress: entity => self.invoke.call(self,
                MemberApi.route + "save/Account/Address", "post", {}, entity),
            saveGeneralInfo: entity => self.invoke.call(self,
                MemberApi.route + "save/Account/GeneralInfo", "post", {}, entity),
            saveCreditCard: entity => self.invoke.call(self,
                MemberApi.route + "save/Account/CreditCard", "post", {}, entity),
            saveDependent: entity => self.invoke.call( self,
                MemberApi.route + "save/Account/dependent", "post", {}, entity),
            validateEmail: value => self.invoke.call(
                self, MemberApi.route + "validate/Email",
                "post", {}, value ),
            loadCreditCards: () => self.invoke.call(
                self, MemberApi.route + "get/Account/CC","get",{})
        }
    }
}