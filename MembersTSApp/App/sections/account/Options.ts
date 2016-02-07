import IData = require("models/identity/IPayLoad");
export module utils.forms {
    export class OptionItem {
        id: KnockoutObservable<string>;
        label: KnockoutObservable<string>;
        value: KnockoutObservable<string>;
        constructor(l: string, v: string) {
            var self = this;
            self.id = ko.observable("radio__" + l);
            self.label = ko.observable(l);
            self.value = ko.observable(v);
        }
    }
    export class OptionsGender {
        selectedValue: KnockoutObservable<any>;
        items: KnockoutObservableArray<OptionItem>;
        constructor() {
            var self = this;
            self.items = ko.observableArray([
                new OptionItem("Male", "0"),
                new OptionItem("Female", "1")
            ]);
            self.selectedValue = ko.observable();
        }
    }
    export interface IEmailAddressUsage {
        EmailAddressUsageEnum: number;
        IsPrimary: boolean;
    }
    export interface IEmailAddress {
        ID: number;
        Email: string;
        EmailAddressUsages?: IEmailAddressUsage[];
    }
    export class EmailAddress implements IEmailAddress {

        ID: number;
        Email: string;
        EmailAddressUsages: IEmailAddressUsage[];

    }
    
    export class EmailAddressObservable {
        ID: KnockoutObservable<number>;
        Email: KnockoutObservable<string>;
        constructor(arg?: any) {
            var self = this;
            if (arg !== null && arg !== undefined) {
                self.ID = ko.observable(arg.ID);
                self.Email = ko.observable(arg.Email);
            } else {
                self.ID = ko.observable(0);
                self.Email = ko.observable("");
            }
        }
    }
    export enum CCTypeEnum
    {
        Visa = 1,
        MasterCard = 2,
        Amex = 3,
        Discover = 4,
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
        PhoneUsageEnum: IData.models.Identity.IPayload.PhoneUsageEnum;
    }
    export interface IPhone {
        PhoneCountryCode: string;
        PhoneNumber: string;
        PhoneExtension: string;
        PhoneUsages: IPhoneUsage[];
        PhoneLabel?: string;
        PhoneIcon?: string;
        PhoneLabelID?: string;
        IsPrimary?: boolean;
    }
    export class Phone implements IPhone {
        PhoneCountryCode: string;
        PhoneNumber: string;
        PhoneExtension: string;
        PhoneUsages: IPhoneUsage[];
        PhoneLabel: string;
        PhoneIcon: string;
        PhoneLabelID: string;
    }
    export class PhoneObservable {
        ID: KnockoutObservable<number>;
        PhoneCountryCode: KnockoutObservable<string>;
        PhoneNumber: KnockoutObservable<string>;
        PhoneExtension: KnockoutObservable<string>;
        PhoneUsages: KnockoutObservableArray<IPhoneUsage>;
        constructor(arg?: any) {
            var self = this;
            if (arg !== null && arg !== undefined) {
                self.ID = ko.observable(arg.ID);
                self.PhoneCountryCode = ko.observable(arg.PhoneCountryCode);
                self.PhoneNumber = ko.observable(arg.PhoneNumber);
                self.PhoneExtension = ko.observable(arg.PhoneExtension);
                self.PhoneUsages = ko.observableArray([]);
            } else {
                self.ID = ko.observable(0);
                self.PhoneCountryCode = ko.observable("");
                self.PhoneNumber = ko.observable("");
                self.PhoneExtension = ko.observable("");
                self.PhoneUsages = ko.observableArray([]);
            }
        }
        //PhoneLabel: KnockoutObservable<string>;
        //PhoneIcon: KnockoutObservable<string>;
        //PhoneLabelID: KnockoutObservable<string>;
    }
    export class ContactList {
        Work: PhoneObservable;
        Home: PhoneObservable;
        Mobile: PhoneObservable;
        Email: EmailAddressObservable;
        constructor() {
            var self = this;
            self.Home = new PhoneObservable();
            self.Work = new PhoneObservable();
            self.Mobile = new PhoneObservable();
            self.Email = new EmailAddressObservable();
        }
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
        AddressUsageEnumValue: AddressUsageEnum;
        AddressUsageEnum: AddressUsageEnum;
        IsPrimary: boolean;
    }
    export class Option {
        constructor( newLabel: string, newValue: number ) {
            var self = this;
            self.Label = ko.observable( newLabel );
            self.Value = ko.observable( newValue );
        }
        Label: KnockoutObservable<string>;
        Value: KnockoutObservable<number>;
    }
    export class OptionList {
        selectedValue: KnockoutObservable<Option>;
        availableOptions: KnockoutObservableArray<Option>;
        selectedValueCompute: KnockoutComputed<any>;
        isTriggerAvailable: KnockoutObservable<boolean>;
        constructor() {
            var self = this;
            self.selectedValue = ko.observable( null );
            self.availableOptions = ko.observableArray( [new Option( "", null )] );
            self.isTriggerAvailable = ko.observable( false );
            self.selectedValueCompute = ko.computed(() => {
                if ( self.selectedValue() !== null && self.selectedValue() != undefined ) {
                    var item = ko.unwrap( self.selectedValue );
                    if ( item !== undefined ) {
                        self.isTriggerAvailable( true );
                    }
                    return item;
                }
            });
        }
    }
    export class Address {
        ID: KnockoutObservable<number>;
        isError: KnockoutObservable<boolean>;
        isLoading:KnockoutObservable<boolean>;
        AddressLine1: KnockoutObservable<string>;
        AddressLine2: KnockoutObservable<string>;
        AddressLine3: KnockoutObservable<string>;
        City: KnockoutObservable<string>;
        State: KnockoutObservable<string>;
        ZipCode: KnockoutObservable<string>;
        AddressUsageEnumValue: KnockoutObservable<number>;
        CountryCode: KnockoutObservable<string>;
        AddressUsages: IAddressUsage[];
        AddressUsage: KnockoutObservable<IAddressUsage>;
        SelectedValue:KnockoutObservable<number>;
        ButtonLabel: KnockoutComputed<string>;
        Options: OptionList;

        getLabel( value ) {
            var result = "";
            switch(value) {
                case 1:
                    result = "Home";
                    break;
                case 4:
                    result = "Billing";
                    break;
                case 5:
                    result = "Work";
                    break;
            }
            return result;
        }

        constructor( arg?: any | number ) {
            var self = this;
           
            if ( typeof arg === "number" ) {

                self.ID = ko.observable( 0 );
                self.AddressLine1 = ko.observable( "" );
                self.AddressLine2 = ko.observable( "" );
                self.City = ko.observable( "" );
                self.State = ko.observable( "" );
                self.ZipCode = ko.observable( "" );
                var u: IAddressUsage = {
                    AddressUsageEnum: arg,
                    AddressUsageEnumValue: arg,
                    IsPrimary: arg===1
                };
                self.AddressUsageEnumValue = ko.observable(arg);
                self.AddressUsage = ko.observable( u );
            } else if ( arg !== null && arg !== undefined ) {

               // self.ButtonLabel = ko.observable( "Update" );

                self.ID = ko.observable(arg.ID);
                self.AddressLine1 = ko.observable(arg.AddressLine1);
                self.AddressLine2 = ko.observable(arg.AddressLine2);
                self.City = ko.observable(arg.City);
                self.State = ko.observable(arg.State);
                self.ZipCode = ko.observable( arg.ZipCode );
                self.AddressUsage = ko.observable( arg.AddressUsages[0] );
              //  self.AddressUsage.
                self.Options = new OptionList();
                self.Options.availableOptions = ko.observableArray([
                    new Option("Home", 1),
                    new Option("Billing", 4),
                    new Option("Work", 5)
                ] );

                self.SelectedValue = ko.observable( arg.AddressUsages[0].AddressUsageEnum.toFixed( 0 ) );
                self.AddressUsageEnumValue = ko.observable( arg.AddressUsages[0].AddressUsageEnum );
                self.Options.selectedValue = ko.observable(
                    new Option(self.getLabel(arg.AddressUsages[0].AddressUsageEnum),
                        arg.AddressUsages[0].AddressUsageEnum));
            } else {
                self.ID = ko.observable(0 );
                self.AddressLine1 = ko.observable( "" );
                self.AddressLine2 = ko.observable( "");
                self.City = ko.observable( "");
                self.State = ko.observable("");
                self.ZipCode = ko.observable( "" );
                var u: IAddressUsage = {
                    AddressUsageEnumValue:1,
                    AddressUsageEnum: 1,
                    IsPrimary: true
                };
                self.AddressUsage = ko.observable( u );
                self.AddressUsageEnumValue = ko.observable( 1);
            }
            self.isError = ko.observable(false);
            self.isLoading = ko.observable( false );

            self.ButtonLabel = ko.computed(function() {
                return self.ID() === 0 ? "Save" : "Update";
            });
        }

    }

    export interface IBAddress {
        ID?: KnockoutObservable<number>;
        AddressLine1:KnockoutObservable<string>;
        AddressLine2:KnockoutObservable<string>;
        City:KnockoutObservable<string>;
        State? :KnockoutObservable<string>;
        ZipCode?: KnockoutObservable<string>;
        CountryCode?: any;
        IsValid?:KnockoutObservable<boolean>;
        AddressUsages?: any;
    }
    export interface ICreditCardInfoInput {
        CCNumber?: string;
        AccountID?: number;
        NameOnCard?: string;
        CCType?: number;
        Last4?: string;
        ExpMonth?: string;
        ExpYear?: string;
        CVVCode?: string;
        IsActive?: boolean;
        IsValid?: boolean;
        IsDefault?: boolean;
        BAddress: IBAddress;
    }
    export interface ICreditCardInfoInputObservable {
        AccountID?:KnockoutObservable<number>;
        NameOnCard?:KnockoutObservable<string>;
        CCType?:KnockoutObservable<number>;
        CCNumber?:KnockoutObservable<string>;
        ExpMonth?:KnockoutObservable<string>;
        ExpYear?:KnockoutObservable<string>;
        CVVCode?:KnockoutObservable<string>;
        IsActive?:KnockoutObservable<boolean>;
        IsDefault?:KnockoutObservable<boolean>;
        BAddress: IBAddress;
        IsError:KnockoutObservable<boolean>;
    }
    export interface ICreditCard {
        AccountID?: number;
        NameOnCard?: string;
        CCType?: number;
        Last4?: string;
        ExpMonth?: string;
        ExpYear?: string;
        CVVCode?: string;
        IsActive?: boolean;
        IsValid?: boolean;
        IsDefault?: boolean;
        BAddress: IBAddress;
    }
    export interface ICreditCardObservable {
        AccountID?: KnockoutObservable<number>;
        NameOnCard?: KnockoutObservable<string>;
        CCType?: KnockoutObservable<number>;
        Last4?: KnockoutObservable<string>;
        ExpMonth?: KnockoutObservable<string>;
        ExpYear?: KnockoutObservable<string>;
        CVVCode?: KnockoutObservable<string>;
        IsActive?: KnockoutObservable<boolean>;
        IsValid?: KnockoutObservable<boolean>;
        IsDefault?: KnockoutObservable<boolean>;
        BAddress: IBAddress;
    }

    export class CreditCardInfoInput implements ICreditCardInfoInputObservable {
        AccountID: KnockoutObservable<number>;
        NameOnCard: KnockoutObservable<string>;
        CCType: KnockoutObservable<number>;
        CCNumber: KnockoutObservable<string>;
        ExpMonth: KnockoutObservable<string>;
        ExpYear: KnockoutObservable<string>;
        CVVCode: KnockoutObservable<string>;
        IsActive: KnockoutObservable<boolean>;
        IsDefault: KnockoutObservable<boolean>;
        BAddress: IBAddress;
        ButtonLabel: string;
        IsError: KnockoutObservable<boolean>;
        constructor( arg?: ICreditCardInfoInput) {
            var self = this;
            if (arg !== undefined && arg !== null) {
                self.AccountID = ko.observable(arg.AccountID);
                self.NameOnCard = ko.observable(arg.NameOnCard);
                self.CCType = ko.observable(arg.CCType);
                self.CCNumber = ko.observable(arg.CCNumber);
                self.ExpMonth = ko.observable(arg.ExpMonth);
                self.ExpYear = ko.observable(arg.ExpYear);
                self.CVVCode = ko.observable(arg.CVVCode);
                self.IsActive = ko.observable(arg.IsActive);
                self.IsDefault = ko.observable( arg.IsDefault );
            } else {
                self.AccountID  = ko.observable(null );
                self.NameOnCard = ko.observable( null );
                self.CCType     = ko.observable(null );
                self.CCNumber   = ko.observable(null );
                self.ExpMonth   = ko.observable(null );
                self.ExpYear    = ko.observable(null );
                self.CVVCode    = ko.observable(null );
                self.IsActive   = ko.observable(null );
                self.IsDefault = ko.observable( null );
                self.BAddress = {
                    AddressLine1: ko.observable( "" ),
                    AddressLine2: ko.observable( "" ),
                    City: ko.observable( "" ),
                    State: ko.observable( "" ),
                    ZipCode:ko.observable("")
                }
            }
            self.IsError = ko.observable( false );
            self.ButtonLabel = "Save";
        }
    }
    export class CreditCard implements ICreditCardObservable {
        AccountID: KnockoutObservable<number>;
        NameOnCard: KnockoutObservable<string>;
        CCType: KnockoutObservable<number>;
        Last4: KnockoutObservable<string>;
        ExpMonth: KnockoutObservable<string>;
        ExpYear: KnockoutObservable<string>;
        CVVCode: KnockoutObservable<string>;
        IsActive: KnockoutObservable<boolean>;
        IsDefault: KnockoutObservable<boolean>;
        IsValid: KnockoutObservable<boolean>;
        BAddress: IBAddress;
        constructor( arg?: ICreditCard ) {
            var self = this;
            if ( arg !== undefined && arg !== null ) {
                self.AccountID = ko.observable( arg.AccountID );
                self.NameOnCard = ko.observable( arg.NameOnCard );
                self.CCType = ko.observable( arg.CCType );
                self.Last4 = ko.observable( arg.Last4 );
                self.ExpMonth = ko.observable( arg.ExpMonth );
                self.ExpYear = ko.observable( arg.ExpYear );
                self.CVVCode = ko.observable( arg.CVVCode );
                self.IsActive = ko.observable( arg.IsActive );
                self.IsDefault = ko.observable( arg.IsDefault );
                self.IsValid = ko.observable( arg.IsValid );
            } else {
                self.AccountID = ko.observable( null );
                self.NameOnCard = ko.observable( null );
                self.CCType = ko.observable( null );
                self.Last4 = ko.observable( null );
                self.ExpMonth = ko.observable( null );
                self.ExpYear = ko.observable( null );
                self.CVVCode = ko.observable( null );
                self.IsActive = ko.observable( null );
                self.IsDefault = ko.observable( null );
            }
        }
    }

}