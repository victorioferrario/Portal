export module utilities.Forms {
    export class RegXSettings {
        static DateFormat = "99/99/9999";
        static PhoneFormat = "(999) 999-9999";
        static formattPhone( value: string ) {
                var phone = value.replace( "(", "" );
                phone = phone.replace( ")", "" );
                phone = phone.replace( "-", "" );
                phone = phone.replace( " ", "" );
                return phone;
        }
    }
    export class InputMasks {
        static maskDate( input: JQuery) {
            input.mask( RegXSettings.DateFormat, { placeholder: "mm/dd/yyyy" });
        }
        static maskPhone( input: JQuery ) {
            input.mask( RegXSettings.PhoneFormat);
        }
        static maskDynamic( input: JQuery, expression: string ) {
            input.mask( expression );
        }
    }
    export class InputValues {
        static doubleDigits( input: string ) {
            if (input === "0") {
                return "01";
            }
            var input2 = parseInt( input ) ;
            return input2 < 10 ? `0${input2}` : input2;
        }
        static doubleDigitsMonth( input: string ) {
            if ( input === "0" ) {
                return "01";
            }
            var input2 = parseInt( input )+1;
            return input2 < 10 ? `0${input2}` : input2;
        }
    }
}