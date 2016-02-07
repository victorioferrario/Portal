export module models.account {
    export enum Action {
        None = 0,
        Add = 1,
        Update = 2,
        Remove = 3
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
    export interface IAccount {
        RID: number;
        AccountID?: number;
        AccountInfo?: {};
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
        PhoneUsageEnum: PhoneUsageEnum;
        IsPrimary: boolean;
    }
    export interface IPhone {
        IsPrimary: boolean;
        PhoneId?: number;
        CountryCode?: any;
        PhoneNumber: string;
        PhoneExtension?: any;
        PhoneUsageEnum: PhoneUsageEnum;
        PhoneUsageEnumToUpdate?: PhoneUsageEnum;
        PhoneUsages?: IPhoneUsage[];
    }
    export interface IAddressUsage {
        AddressUsageEnumValue: AddressUsageEnum;
        AddressUsageEnum: AddressUsageEnum;
        IsPrimary: boolean;
    }
    export interface IAddress {
        ID?: number;
        AddressLine1: string;
        AddressLine2?: any;
        AddressLine3?: any;
        City: string;
        State: string;
        ZipCode: string;
        CountryCode: string;
        IsPrimary: boolean;
        AddressUsages: IAddressUsage[];
        AddressUsageEnumValue: AddressUsageEnum;
        AddressUsageEnumToUpdate?: AddressUsageEnum;
    }
    export enum EmailAddressUsageEnum {
        Undefined = 0,
        Personal = 1,
        Group = 2,
        AccountRecovery = 3,
        Username = 4,
    }

    export interface IEmailAddress {
        Id: number;
        Email: string;
        IsPrimary: boolean;
        EmailUsageEnum: number;
    }
    export interface IGeneralInfo {
        FName: string;
        MName: string;
        LName: string;
        Dob: string;
        DateOfBirthString?:string;
        Gender: number;
    }
    
   

    export interface IMemberInstance {
        GroupRID?: number;
        IsActive?: boolean;
        AccountDetails?: any;
        EventAction?: number;
        Phone?: any;
        Phones?: IPhone[];
        Addresses?: any;
        EmailAddress?: IEmailAddress;
        EmailAddresses?: any;
        GeneralInfo?: IGeneralInfo;
        UserRID?: number;
        ClientRID?: number;
        UserTypeEnumInt?: number;
        UserTypeEnum?: number;
        PrevUserTypeEnumInt?: number;
        CorporationRID?: number;
        Message?: string;
        IsError?: boolean;
    }
    export class MemberInstance implements IMemberInstance {
        UserRID: number;
        GroupRID: number;
        ClientRID: number;
    }

}