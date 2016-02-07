export namespace models.rxnt {
    export interface IAddressField {
        address1Field: string;
        address2Field: string;
        cityField: string;
        stateField: string;
        countryField?: any;
        zipCodeField: string;
    }
    export interface IContactField {
        emailField: string;
        faxField: string;
        phoneField: string;
        cellPhoneField: string;
    }
    export interface IPharmacy {
        serviceLevelField: number;
        isMailOrderField: boolean;
        ncpdpField: string;
        nPIField?: any;
        deliveryMethodsField: number;
        addressField: IAddressField;
        contactField: IContactField;
        pharmacyIdField: number;
        nameField: string;
    }
}