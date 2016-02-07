export module models.icart {
        export interface IProduct {
            Icon?: string;
            ProductID: string;
            ProductName: string;
            ProductLabel: string;
            MemberPrice: number;
            ClientPrice: number;
            BusinessLevel: number;
        }
        export interface IProductObservable {
            Icon: KnockoutObservable<string>;
            ProductID: KnockoutObservable<string>;
            ProductName: KnockoutObservable<string>;
            ProductLabel: KnockoutObservable<string>;
            MemberPrice: KnockoutObservable<number>;
            ClientPrice: KnockoutObservable<number>;
            BusinessLevel: KnockoutObservable<number>;
        }
        export class Reason {
            phone:KnockoutObservable<string>;
            reason: KnockoutObservable<string>;
            alternative: KnockoutObservable<any>;
            constructor() {
                var self = this;
                self.phone = ko.observable("");
                self.reason = ko.observable("");
                self.alternative = ko.observable();
            }
        }
        export interface IBillingAddress {
            Address1: KnockoutObservable<any>;
            Address2: KnockoutObservable<any>;
            City: KnockoutObservable<any>;
            State: KnockoutObservable<any>;
            ZipCode:KnockoutObservable<any>;
        }
        export interface ICreditCard {
            NameOnCard: KnockoutObservable<string>;
            CardNumber: KnockoutObservable<string>;
            CardExpirationMonth: KnockoutObservable<any>;
            CardExpirationYear: KnockoutObservable<any>;
            CardCCV:KnockoutObservable<any>;
        }
        export interface IPayment {
            CreditCard: ICreditCard;
            BillingAddress:IBillingAddress;
        }
        export class Payment implements IPayment {
            CreditCard: ICreditCard;
            BillingAddress: IBillingAddress;
            constructor() {
                var self = this;
                self.CreditCard = {
                    CardCCV: ko.observable(),
                    CardExpirationMonth: ko.observable(),
                    CardExpirationYear: ko.observable(),
                    CardNumber: ko.observable(""),
                    NameOnCard:ko.observable("")
                }
                self.BillingAddress = {
                    Address1: ko.observable(),
                    Address2: ko.observable(),
                    City: ko.observable(),
                    State: ko.observable(""),
                    ZipCode: ko.observable("")
                }
            }
    }
        export interface ICheckOutInstance {
            data:Reason;
            other: KnockoutObservable<string>;
            recipient: KnockoutObservable<string>;
            selectedState: KnockoutObservable<string>;
            selectedZipCode: KnockoutObservable<string>;
            selectedPharmacy: KnockoutObservable<any>;
            payment:IPayment;
        }
        export interface IStore {
            hasData:KnockoutObservable<boolean>;
            instance: ICheckOutInstance;
            Selected: IProductObservable;
            Products: IProductObservable[];
        }
        export class RxIcon {
            static PATH: string = "Content/images/rx/";
            static get CVS(): string {
                return this.PATH + "cvs.png";
            }
            static get KGR(): string {
                return this.PATH + "kroger.png";
            }
            static get PBX(): string {
                return this.PATH + "publix.png";
            }
            static get RTE(): string {
                return this.PATH + "riteaid.png";
            }
            static get WLG(): string {
                return this.PATH + "walgreens.png";
            }
            static get WMT(): string {
                return this.PATH + "walmart.png";
            }
            static get GENERIC(): string {
                return this.PATH + "generic.png";
            }
            static getIcon(arg): string {
                var self = this,
                    value = arg.toUpperCase();
                if (value.indexOf("CVS") !== -1) {
                    return self.CVS;
                } else if (value.indexOf("WALGREENS") !== -1) {
                    return self.WLG;
                } else if (value.indexOf("PUBLIX") !== -1) {
                    return self.PBX;
                } else if (value.indexOf("WALGREENS") !== -1) {
                    return self.WLG;
                } else if (value.indexOf("WALMART") !== -1) {
                    return self.WMT;
                } else if (value.indexOf("RITEAID") !== -1) {
                    return self.RTE;
                } else if (value.indexOf("RITEAID") !== -1) {
                    return self.RTE;
                } else {
                    return self.GENERIC;
                }
            }
        }
        export enum ProcessStateEnum {
            Undefined = 0,
            Initializing = 1,
            Initialized = 2,
            Running = 3,
            Completed = 4,
            Canceled = 5,
        }
        export enum OrderAction {
            None = 0,
            StartOrder = 1,
            CancelOrder = 2,
            GetOrderStatus = 3,
            RetryProcessPayment = 4,
            ForcePaymentProcessing = 5,
            GetConsultationStatus = 6,
            FindOrdersInProcessState = 7,
            FindConsultationsInProcessState = 8,
            ManuallyAssignMedicalPractitioner = 9,
        }
        export enum OrderActionResult {
            None = 0,
            Failed = 1,
            Success = 2,
        }
        export enum AlternativeMedicalCareType {
            Undefined = 0,
            EmergencyRoom = 1,
            UrgentCare = 2,
            PrimaryCarePhysician = 3,
            RetailsClinic = 4,
        }
        export interface IOrderInput {
            MSPRID: number;
            GuarantorAccountID: number;
            ConsultationRecipientAccountID: number;
            PlacedByRID: number;
            ProductID: string;
            ConsultationMemberAdjustedPrice: number;
            ConsultationClientAdjustedPrice: number;
            StateCodeRecipientLocatedDuringConsultation: string;
            ContactInfoOfRecipientDuringConsultation: string;
            PreferredPharmacyRID?: any;
            IsTesting: boolean;
            IsReRouting: boolean;
            ChiefComplaint: string;
            AlternativeMedicalCareType: AlternativeMedicalCareType;
            RxNTPharmacyID: string;
        }
        export class OrderInput implements IOrderInput {
            MSPRID: number;
            AlternativeMedicalCareType: AlternativeMedicalCareType;
            GuarantorAccountID: number;
            ConsultationRecipientAccountID: number;
            PlacedByRID: number;
            ProductID: string;
            PreferredPharmacyRID: number;
            ConsultationMemberAdjustedPrice: number;
            ConsultationClientAdjustedPrice: number;
            StateCodeRecipientLocatedDuringConsultation: string;
            ContactInfoOfRecipientDuringConsultation: string;
            IsTesting: boolean;
            IsReRouting: boolean;
            ChiefComplaint: string;
            RxNTPharmacyID: string;
            constructor() {
                var self = this;
                self.MSPRID = 100;
                self.AlternativeMedicalCareType = AlternativeMedicalCareType.Undefined;
            }
        }
        export interface IDependentAccount {
            AccountID: number;
            RID: number;
            MembershipPlanID: number;
            DTUTC_Activated: Date;
            DTUTC_Expires: Date;
            PrimaryAccountID?: number;
            IsSelfManaged: boolean;
            IsActive: boolean;
            IsAutorenewal: boolean;
            IsTesting: boolean;
            FName: string;
            MName?: any;
            LName: string;
            Gender: number;
            Dob: Date;
        }
        export interface IDependentObservable {
            AccountID: KnockoutObservable<number>;
            RID: KnockoutObservable<number>;
            MembershipPlanID: KnockoutObservable<number>;
            DTUTC_Activated: KnockoutObservable<Date>;
            DTUTC_Expires: KnockoutObservable<Date>;
            PrimaryAccountID?: KnockoutObservable<number>;
            IsSelfManaged: KnockoutObservable<boolean>;
            IsActive: KnockoutObservable<boolean>;
            IsAutorenewal: KnockoutObservable<boolean>;
            IsTesting: KnockoutObservable<boolean>;
            FName: KnockoutObservable<string>;
            MName?: KnockoutObservable<any>;
            LName: KnockoutObservable<string>;
            Gender: KnockoutObservable<number>;
            Dob: KnockoutObservable<Date>;
        }
        export interface List {
            Dependents: IDependentObservable[];
        }
}