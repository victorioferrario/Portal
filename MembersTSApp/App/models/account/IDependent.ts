export module models.Account.Dependents {
    export interface IAccountInfo {
        AccountID?: number;
        RID?: number;
        MembershipPlanID: number;
        DTUTC_Activated?: Date;
        DTUTC_Expires?: any;
        PrimaryAccountID?: any;
        IsSelfManaged: boolean;
        IsActive: boolean;
        IsAutorenewal: boolean;
        IsTesting: boolean;
    }
    export enum Action {
        None = 0,
        Add = 1,
        Update = 2,
        Remove = 3
    }
    export enum ActionResult {
        None = 0,
        Failed = 1,
        Success = 2,
    }
    export enum AccountAction {
        None = 0,
        IsActive = 1,
        ParentAccount = 2,
        IsSelfManaged = 3,
        IsAutorenewal = 4,
        IsTesting = 5,
        MembershipPlan = 6,
        ExpirationDate = 7,
        CreditCard = 8,
        AccountInfo = 9,
        LoadCreditCard = 10,
        LoadDependents = 11
    }
    export enum PhoneUsageEnum {
        Undefined = 0,
        Home = 1,
        Work = 2,
        Mobile = 3,
        Fax = 4,
        Pager = 5,
        Other = 6,
        TTY_TDD = 7,
        Business = 8,
    }
    export interface IEvents {
        EventAction: Action;
        EventActionResult: ActionResult;
        AccountAction: AccountAction;
        AccountActionResult: ActionResult;
    }
    export interface IPhoneUsage {
        IsPrimary: boolean;
        PhoneUsageEnum: PhoneUsageEnum;
    }
    export interface IPhone {
        ID?: any;
        PhoneCountryCode?: any;
        PhoneNumber: string;
        PhoneExtension?: any;
        PhoneUsages: IPhoneUsage[];
    }
    export class Phone {
        PhoneCountryCode: any="01";
        PhoneNumber: string;
        PhoneExtension: any="";
        PhoneUsages: IPhoneUsage[];
        constructor(phone) {
            var self = this;
            self.PhoneNumber = phone;
            self.PhoneUsages = [{IsPrimary: true,PhoneUsageEnum: PhoneUsageEnum.Mobile}];
        }
    }
    export interface IPersonInfo {
        FName: string;
        MName?: any;
        LName: string;
        Gender?: any;
        Dob?: any;
    }
    export enum EntityType {
        System = 1,
        Corporation = 2,
        MedicalServicesProvider = 3,
        Practitioner = 4,
        Client = 5,
        Group = 6,
        Member = 7,
        Creator = 8,
        Administrator = 9,
        PaymentGatewayProvider = 10,
        IVRProvider = 11,
        Pharmacy = 12,
        MemberServicesRep = 13,
        Contact = 14,
        MessageSender = 15,
    }
    export enum EmailAddressUsageEnum {
        Undefined = 0,
        Personal = 1,
        Group = 2,
        AccountRecovery = 3,
        Username = 4,
    }
    export interface IEmailAddressUsage {
        EmailAddressUsageEnum: EmailAddressUsageEnum;
        IsPrimary: boolean;
    }
    export interface IEmailAddress {
        ID?: any;
        Email: string;
        EmailAddressUsages: IEmailAddressUsage[];
    }
    export class EmailAddress {
        Email: string;
        EmailAddressUsages: IEmailAddressUsage[];
        constructor(email:string) {
            var self = this;
            self.Email = email;
            self.EmailAddressUsages = [
                {
                    EmailAddressUsageEnum: EmailAddressUsageEnum.Personal,
                    IsPrimary: true
                }
            ];
        }
    }
    export interface IDependent {
        AccountInfo: IAccountInfo;
        Events: IEvents;
        GroupRID: number;
        ClientRID: number;
        MembershipPlanID?: number;
        EntityType: EntityType;
        Phones?: IPhone[];
        PersonInfo: IPersonInfo;
        EmailAddresses?: IEmailAddress[];
        CorporationRID: number;
        Message?: string;
        IsError?: boolean;
    }

}

