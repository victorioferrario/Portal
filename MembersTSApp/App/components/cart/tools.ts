export module components.cart.tools {
    export function getCreditCardType(type: string) {
        var result = "fa-credit-card";
        switch (type) {
            case "amex":
                result = "fa-cc-amex";
                break;
            case "visa":
                result= "fa-cc-visa";
                break;
            case "discover":
                result = "fa-cc-discover";
                break;
            case "mastercard":
                result = "fa-cc-mastercard";

        }
        return result;
    }
    export function ccIcon(type: string) {
        return `<i  class="fa ${getCreditCardType(type)} fa-2x blue-text"></i>`;
    }
    export function ccIconWhite( type: string ) {
        return `<i  class="fa ${getCreditCardType( type ) } fa-2x blue-text "></i>`;
    }
    export enum CCTypeEnum {
        Visa = 1,
        MasterCard = 2,
        Amex = 3,
        Discover = 4,
    }
    export function ccIconByEnum( arg: CCTypeEnum ) {
        var result = "fa-credit-card";
        switch(arg) {
            case CCTypeEnum.Visa:
                result = "fa-cc-visa";
                break;
            case CCTypeEnum.MasterCard:
                result = "fa-cc-mastercard";
                break;
            case CCTypeEnum.Discover:
                result = "fa-cc-discover";
                break;
            case CCTypeEnum.Amex:
                result = "fa-cc-amex";
                break;
        }
        return "fa " + result;
    }
    export function ccTextByEnum( arg: CCTypeEnum ) {
        var result = "fa-credit-card";
        switch ( arg ) {
            case CCTypeEnum.Visa:
                result = "Visa Card";
                break;
            case CCTypeEnum.MasterCard:
                result = "MasterCard";
                break;
            case CCTypeEnum.Discover:
                result = "Discover Card";
                break;
            case CCTypeEnum.Amex:
                result = "American Express Card";
                break;
        }
        return  result;
    }

    export function isValid(valid: boolean) {
        return valid ? "<i class=\"fa fa-check-circle-o green-text\"></i>" : "<i class=\"fa fa-minus-circle red-text\"></i>";
    }
}