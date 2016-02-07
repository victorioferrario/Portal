
export module models.Account {
    export interface IDependent {
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
}
export module models.Identity.IPayload {

    export interface IEmailValidation {
        RID: number;
        Value: string;
        Valid: boolean;
        CorporationRID: number;
        Message: string;
        IsError: boolean;
    }

    export enum AddressUsageEnum {
        Undefined = 0,
        Residential = 1,
        Mailing = 2,
        Shipping = 3,
        Billing = 4,
        Business = 5,
        CurrentLocation = 6,
    }
    export interface IAddressUsage {
        AddressUsageEnum: AddressUsageEnum;
        IsPrimary: boolean;
    }
    export interface IAddress {
        ID: number;
        AddressLine1: string;
        AddressLine2?: any;
        AddressLine3?: any;
        City: string;
        State: string;
        ZipCode: string;
        CountryCode: string;
        AddressUsages: IAddressUsage[];
    }
    export interface IEmailAddressUsage {
        EmailAddressUsageEnum: number;
        IsPrimary: boolean;
    }
    export interface IEmailAddress {
        ID: number;
        Email: string;
        EmailAddressUsages: IEmailAddressUsage[];
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
    export interface IPhoneUsage {
        IsPrimary: boolean;
        PhoneUsageEnum: PhoneUsageEnum;
    }
    export interface IPhone {
        ID: number;
        PhoneCountryCode: string;
        PhoneNumber: string;
        PhoneExtension?: any;
        PhoneUsages: IPhoneUsage[];
        PhoneUsageEnum?: PhoneUsageEnum;
        IsPrimary?:boolean;
        PhoneUsageEnumToUpdate?: PhoneUsageEnum;
    }
    export interface IEntity {
        Addresses: IAddress[];
        EmailAddresses: IEmailAddress[];
        IsActive: boolean;
        IsTesting: boolean;
        Phones: IPhone[];
        RID: number;
        RTypeEnum: number;
    }
    export interface IProduct {
        Icon:string;
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
    export interface IPersonInfo {
        FName: string;
        MName: string;
        LName: string;
        Gender: number;
        Dob: Date;
     }
    export class PersonInfo {
        FName   : KnockoutObservable<string>;
        MName   : KnockoutObservable<string>;
        LName   : KnockoutObservable<string>;
        Gender  : KnockoutObservable<number>;
        Dob     : KnockoutObservable<string>;
        constructor() {
            var self = this;
            self.FName =   ko.observable("");
            self.MName =   ko.observable("");
            self.LName   = ko.observable("");
            self.Gender  = ko.observable(0);
            self.Dob     = ko.observable("");
        }
    }

    export interface IAccount {
        AccountID: number;
        RID: number;
        MembershipPlanID: number;
        DTUTC_Activated: Date;
        DTUTC_Expires: Date;
        PrimaryAccountID?: any;
        IsSelfManaged: boolean;
        IsActive: boolean;
        IsAutorenewal: boolean;
        IsTesting: boolean;
    }
    export interface IAccountInfo {
        RID: number;
        AccountID: number;
        ClientRID: number;
        GroupRID: number;
        CoverageCode?: any;
        GroupNumber?: any;
        MemberNumber?: any;
        EffectiveDate: Date;
        MembershipPlanID: number;
        Account: IAccount;
        AccountInfo: IAccount;
        CorporationRID: number;
        Message: string;
        IsError: boolean;
    }


    export interface IBAddress {
        ID?: any;
        AddressLine1: string;
        AddressLine2: string;
        AddressLine3?: any;
        City: string;
        State?: any;
        ZipCode?: any;
        CountryCode?: any;
        IsValid: boolean;
        AddressUsages?: any;
    }

    export interface ICreditCardInfoInput {
        AccountID?: number;
        NameOnCard?: string;
        CCType?: number;
        CCNumber?: string;
        ExpMonth?: string;
        ExpYear?: string;
        CVVCode?: string;
        IsActive?: boolean;
        IsDefault?: boolean;
        BAddress: IBAddress;
    }

    export interface IAccountInfoCCInfo {
        Email?: any;
        Phone?: any;
        CoverageCode?: any;
        GroupNumber?: any;
        MemberNumber?: any;
        EffectiveDate: Date;
        Address?: any;
        LoginInfo?: any;
        Accounts?: any;
        AccountInfo?: any;
        AccountInfoInput?: any;
        CreditCards?: any;
        CreditCardInfoInput?: ICreditCardInfoInput;
        EventAction: number;
        EventActionResult: number;
        AccountAction: number;
        AccountActionResult: number;
        GroupRID: number;
        ClientRID: number;
        MembershipPlanID: number;
        EntityType: number;
        RID: number;
        Phones: any[];
        PersonInfo?: any;
        Addresses: any[];
        EmailAddresses: any[];
        CorporationRID: number;
        Message: string;
        IsError: boolean;
    }
    export interface IMembershipPlan {
        IsActive: boolean;
        CoverageCode: string;
        MembershipLabel: string;
        PerMemberPerMonth: number;
        FamilyMemberPerMonth: number;
        BillingType: number;
        GroupID: number;
        GroupRID: number;
        ClientRID: number;
        MembershipPlanID: number;
        CorporationRID: number;
        Message: string;
        IsError: boolean;
    }
    export interface IdentityUser {
        RID: number;
        Name: string;
        AccessToken: string;
        TokenID: string;
        ExpirationDate: Date;
        IsPrimaryMember: boolean;
        IsAccountManager: boolean;
    }
    
    export interface IMembershipItem {
        IsActive: boolean;
        CoverageCode: string;
        MembershipLabel: string;
        PerMemberPerMonth: number;
        FamilyMemberPerMonth: number;
        BillingType: number;
        GroupID: number;
        GroupRID: number;
        ClientRID: number;
        MembershipPlanID: number;
        CorporationRID: number;
        Message: string;
        IsError: boolean;
    }
    export interface GroupInfo {
        GroupName: string;
        GroupNumber: string;
        List: IMembershipItem[];
        LogoUrl: string;
        ActivationUrl: string;
        GroupRID: number;
        ClientRID: number;
        IsActive: boolean;
        IsTesting: boolean;
        CorporationRID: number;
        Message: string;
        IsError: boolean;
    }
    export interface IGroup {
        ClientRID: number;
        ClientName: string;
        GroupRID: number;
        GroupName: string;
        GroupNumber: string;
        IsActive: boolean;
        IsTesting: boolean;
        PathToLogoImage: string;
        ActivationURL: string;
    }
    export interface IClient {
        RID: number;
        Name: string;
        IsActive: boolean;
        IsTesting: boolean;
        PathToLogoImage: string;
        WebsiteURL: string;
        Groups: IGroup[];
    }
    export interface IServiceResponse {
        Client: IClient;
    }
    export interface IClientInfo {
        ServiceResponse: IServiceResponse;
        CorporationRID: number;
        Message: string;
        IsError: boolean;
    }
     export interface IJsonPage {
         RID:number;
    }

     export interface ICreditCartListItem {
         ID: number;
         AccountID: number;
         NameOnCard: string;
         CCType: number;
         Last4: string;
         ExpMonth: string;
         ExpYear: string;
         CVVCode?: any;
         IsActive: boolean;
         IsDefault: boolean;
         IsValid: boolean;
         BAddress: IAddress;
         ButtonLabel:string;
     }
    export interface ICreditCartList {
       List: ICreditCartListItem[];
    }
     export interface IInstance {
         RolodexItemID:number;
         Entity: IEntity;
         CreditCartList: ICreditCartListItem[];
         Products: IProductObservable[];
         PersonInfo: IPersonInfo;
         AccountInfo: IAccountInfo;
         AccountInfoCCInfo: IAccountInfoCCInfo;
         MembershipPlan: IMembershipPlan;
         IsSessionNew: boolean;
         IsAuthenticated: boolean;
         DTCreatedInstance: Date;
         Identity: IdentityUser;
         ContextPortal: number;
         GroupInfo:GroupInfo;
         ClientInfo: IClientInfo;
     }
}