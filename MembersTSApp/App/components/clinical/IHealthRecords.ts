
export module componentes.clinical.IHealthRecords {
    export interface IAllergen {
        AllergenID: number;
        AllergenText: string;
    }
    export interface IReaction {
        ReactionID: number;
        ReactionText: string;
    }
    export interface IGenericItem {
        ID: number;
        Label: string;
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
    export class OptionList2 {
        selectedValue: KnockoutObservable<number>;
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
    export class AllergenList {
        options: OptionList;
        constructor() {
            var self = this;
            self.options = new OptionList();
        }
        databind( data: IAllergen[] ) {
            var self = this;
            self.options.availableOptions.removeAll();
            data.forEach(( allergen: IAllergen ) => {
                self.options.availableOptions.push(
                    new Option( allergen.AllergenText, allergen.AllergenID ) );
            });
        }
    }
    export class ReactionList {
        options: OptionList;
        constructor() {
            var self = this;
            self.options = new OptionList();
        }
        databind( data: IReaction[] ) {
            var self = this;
            self.options.availableOptions.removeAll();
            data.forEach(( reaction: IReaction ) => {
                self.options.availableOptions.push(
                    new Option( reaction.ReactionText, reaction.ReactionID ) );
            });
        }
    }
    export class GenericList {
        options: OptionList;
        constructor() {
            var self = this;
            self.options = new OptionList();
        }
        databind( data: IGenericItem[] ) {
            var self = this;
            self.options.availableOptions.removeAll();
            data.forEach(( generic: IGenericItem ) => {
                self.options.availableOptions.push(
                    new Option( generic.Label, generic.ID ) );
            });
        }
    }
    export class GenericList2 {
        options: OptionList2;
        constructor() {
            var self = this;
            self.options = new OptionList2();
        }
        databind( data: IGenericItem[] ) {
            var self = this;
            self.options.availableOptions.removeAll();
            data.forEach(( generic: IGenericItem ) => {
                self.options.availableOptions.push(
                    new Option( generic.Label, generic.ID ) );
            });
        }
    }
    export interface IDataSet {
        Allergens: IAllergen[];
        Reactions: IReaction[];
        MedicationDose: IGenericItem[];
        MedicationRoutes: IGenericItem[];
        MedicationStrength: IGenericItem[];
        FamilyRelationship: IGenericItem[];
        FamilyHistoryCondition: IGenericItem[];
        ConditionStatus: IGenericItem[];
    }
    export class DataProvider {
        data: IDataSet;

        allergenList: AllergenList;
        conditionStatus: GenericList;
        reactionList: ReactionList;
        medicationStrengthList: GenericList;
        medicationDoseList: GenericList;
        medicationRoutesList: GenericList;
        familyRelationship: GenericList2;
        familyHistoryCondition: GenericList2;
        constructor() {
            var self = this;
            self.allergenList = new AllergenList();
            self.reactionList = new ReactionList();
            /* condition */
            self.conditionStatus = new GenericList();
            /*med*/
            self.medicationStrengthList = new GenericList();
            self.medicationDoseList = new GenericList();
            self.medicationRoutesList = new GenericList();
            /*family*/
            self.familyRelationship = new GenericList2();
            self.familyHistoryCondition = new GenericList2();
            self.databind();
        }
        databind() {
            var self = this;
            Data.loadPayload().done( result => {
                self.data = result;
                self.allergenList.databind( self.data.Allergens );
                self.reactionList.databind( self.data.Reactions );
                /* condition */
                self.conditionStatus.databind( self.data.ConditionStatus );
                /*med*/
                self.medicationDoseList.databind( self.data.MedicationDose );
                self.medicationStrengthList.databind( self.data.MedicationStrength );
                self.medicationRoutesList.databind( self.data.MedicationRoutes );
                /*family*/
                self.familyRelationship.databind( self.data.FamilyRelationship );
                self.familyHistoryCondition.databind( self.data.FamilyHistoryCondition );
            });
        }
    }
    export class Data {
        static loadPayload(): JQueryXHR {
            return $.getJSON( "App/data/clinical.json" );
        }
    }
}