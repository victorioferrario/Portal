export module models.clinical.HealthRecords {
    export interface IAllergy {
        ID: number;
        RID: number;
        IsStandardized: boolean;
        AllergyID: number;
        AllergyText: string;
        ReactionID: number;
        ReactionText: string;
        AllergenID: number;
        AllergenText: string;
        D_FirstObserved?: Date;
        Notes: string;
        IsHidden: boolean;
        DTUTC_Created: Date;
    }
    export interface IAllergyObservable {
        ID: KnockoutObservable<number>;
        RID: KnockoutObservable<number>;
        IsStandardized: KnockoutObservable<boolean>;
        AllergyID: KnockoutObservable<number>;
        AllergyText: KnockoutObservable<string>;
        ReactionID: KnockoutObservable<number>;
        ReactionText: KnockoutObservable<string>;
        AllergenID: KnockoutObservable<number>;
        AllergenText: KnockoutObservable<string>;
        D_FirstObserved?: KnockoutObservable<string>;
        Notes: KnockoutObservable<string>;
        IsHidden: KnockoutObservable<boolean>;
        DTUTC_Created: KnockoutObservable<Date>;

    }
    export class AllergyObservable {
        ID: KnockoutObservable<number>;
        RID: KnockoutObservable<number>;
        IsStandardized: KnockoutObservable<boolean>;
        AllergyID: KnockoutObservable<number>;
        AllergyText: KnockoutObservable<string>;
        ReactionID: KnockoutObservable<number>;
        ReactionText: KnockoutObservable<string>;
        AllergenID: KnockoutObservable<number>;
        AllergenText: KnockoutObservable<string>;
        D_FirstObserved: KnockoutObservable<string>;
        Notes: KnockoutObservable<string>;
        IsHidden: KnockoutObservable<boolean>;
        DTUTC_Created: KnockoutObservable<Date>;
        constructor(arg?: models.clinical.HealthRecords.IAllergy) {
            var self = this;
            if (arg !== null && arg !== undefined) {

                self.ID = ko.observable(arg.ID);

                self.RID = ko.observable(arg.RID);

                self.IsStandardized = ko.observable(arg.IsStandardized);

                self.AllergyID = ko.observable(arg.AllergyID);
                self.AllergyText = ko.observable(arg.AllergyText);

                self.AllergenID = ko.observable(arg.AllergenID);
                self.AllergenText = ko.observable(arg.AllergenText);

                self.ReactionID = ko.observable(arg.ReactionID);

                self.ReactionText = ko.observable(arg.ReactionText);

                self.D_FirstObserved = ko.observable(self.getDate(arg.D_FirstObserved));

                self.DTUTC_Created = ko.observable(arg.DTUTC_Created);

                self.IsHidden = ko.observable(arg.IsHidden);

                self.Notes = ko.observable(arg.Notes);

            } else {
                self.ID = ko.observable(0);

                self.RID = ko.observable(0);

                self.IsStandardized = ko.observable(true);

                self.AllergyID = ko.observable(0);
                self.AllergyText = ko.observable("");

                self.AllergenID = ko.observable(0);
                self.AllergenText = ko.observable("");

                self.ReactionID = ko.observable(null);

                self.ReactionText = ko.observable(null);

                self.D_FirstObserved = ko.observable(self.setDate());

                self.DTUTC_Created = ko.observable(new Date());

                self.IsHidden = ko.observable(false);
                self.Notes = ko.observable("");
            }
        }
        getDate(date) {
            if (date !== null && date !== undefined) {
                return date;
            } else {
                return new Date().toLocaleDateString();
            }
        }
        setDate() {
            
                return new Date().toLocaleDateString();
            
        }

    }
    export interface ICondition {
        ID: number;
        RID: number;
        IsStandardized: boolean;
        MedicalConditionID: number;
        MedicalConditionText: string;
        MedicalConditionStatus: number;
        D_Start?: any;
        D_End?: any;
        HowItEnded?: any;
        Notes?: any;
        IsHidden: boolean;
        DTUTC_Created: Date;
    }
    export class ConditionObservable {
        ID: KnockoutObservable<number>;
        RID: KnockoutObservable<number>;
        IsStandardized: KnockoutObservable<boolean>;
        MedicalConditionID: KnockoutObservable<number>;
        MedicalConditionText: KnockoutObservable<string>;
        MedicalConditionStatus: KnockoutObservable<number>;
        D_Start: KnockoutObservable<any>;
        D_End: KnockoutObservable<any>;
        HowItEnded: KnockoutObservable<any>;
        Notes: KnockoutObservable<any>;
        IsHidden: KnockoutObservable<boolean>;
        DTUTC_Created: KnockoutObservable<string>;

        IsPast: KnockoutComputed<boolean>;

        constructor(arg?: any) {
            var self = this;
            if (arg !== null && arg !== undefined) {
                self.ID = ko.observable(arg.ID);
                self.RID = ko.observable(arg.RID);
                self.IsStandardized = ko.observable(arg.IsStandardized);
                self.MedicalConditionID = ko.observable(arg.MedicalConditionID);
                self.MedicalConditionText = ko.observable(arg.MedicalConditionText);
                self.MedicalConditionStatus = ko.observable(arg.MedicalConditionStatus);
                self.D_Start = ko.observable(self.getDate(arg.D_Start));
                self.D_End = ko.observable(self.getDate(arg.D_End));
                self.HowItEnded = ko.observable(arg.HowItEnded);
                self.Notes = ko.observable(arg.Notes);
                self.IsHidden = ko.observable(arg.IsHidden);
                self.DTUTC_Created = ko.observable(self.getDate(arg.DTUTC_Created));
            } else {
                self.RID = ko.observable(0);
                self.IsStandardized = ko.observable(true);
                self.MedicalConditionID = ko.observable(0);
                self.MedicalConditionText = ko.observable("");
                self.MedicalConditionStatus = ko.observable(0);
                self.D_Start = ko.observable(self.setDate());
                self.D_End = ko.observable(self.setDate());
                self.HowItEnded = ko.observable("");
                self.Notes = ko.observable("");
                self.IsHidden = ko.observable(false);
                self.DTUTC_Created = ko.observable(self.setDate());
            }
            self.IsPast = ko.computed( function () {
                console.log(self.MedicalConditionStatus());

                return self.MedicalConditionStatus() === 3;
            });
        }
        getDate(date) {
            if (date !== null && date !== undefined) {
                return new Date(date).toLocaleDateString();
            } else {
                return new Date().toLocaleDateString();
            }
        }
        setDate() {
           
                return new Date().toLocaleDateString();
            
        }
    }
    export interface IMedicationTaken {
        ID: number;
        RID: number;
        IsStandardized: boolean;
        MedicationID: number;
        MedicationName: string;
        MedicationStrength: string;
        MedicationStrengthUnitID: number;
        MedicationStrengthName: string;
        MedicationDosage: string;
        MedicationDosageUnitID: number;
        MedicationDosageUnitName: string;
        HowTakenID: number;
        MedicationRouteName: string;
        HowOftenTaken: string;
        ReasonForTaking?: any;
        D_Start?: Date;
        D_End?: Date;
        Notes: string;
        IsHidden: boolean;
        DTUTC_Created: Date;
    }

    export class MedicationTakenObservable {

        ID: KnockoutObservable<number>;
        RID: KnockoutObservable<number>;
        IsStandardized: KnockoutObservable<boolean>;
        MedicationID: KnockoutObservable<number>;
        MedicationName: KnockoutObservable<string>;
        MedicationStrength: KnockoutObservable<string>;
        MedicationStrengthUnitID: KnockoutObservable<number>;
        MedicationStrengthName: KnockoutObservable<string>;
        MedicationDosage: KnockoutObservable<string>;
        MedicationDosageUnitID: KnockoutObservable<number>;
        MedicationDosageUnitName: KnockoutObservable<string>;
        HowTakenID: KnockoutObservable<number>;
        MedicationRouteName: KnockoutObservable<string>;
        HowOftenTaken: KnockoutObservable<string>;
        ReasonForTaking: KnockoutObservable<any>;
        D_Start: KnockoutObservable<string>;
        D_End: KnockoutObservable<string>;
        Notes: KnockoutObservable<string>;
        IsHidden: KnockoutObservable<boolean>;
        DTUTC_Created: KnockoutObservable<string>;

        constructor(arg?: any) {
            var self = this;
            if (arg !== undefined && arg !== null) {
                self.ID = ko.observable(arg.ID);
                self.RID = ko.observable(arg.RID);
                self.IsStandardized = ko.observable(arg.IsStandardized);
                self.MedicationID = ko.observable(arg.MedicationID);
                self.MedicationName = ko.observable(arg.MedicationName);
                self.MedicationStrength = ko.observable(arg.MedicationStrength);
                self.MedicationStrengthUnitID = ko.observable(arg.MedicationStrengthUnitID);
                self.MedicationStrengthName = ko.observable(arg.MedicationStrengthName);
                self.MedicationDosage = ko.observable(arg.MedicationDosage);
                self.MedicationDosageUnitID = ko.observable(arg.MedicationDosageUnitID);
                self.MedicationDosageUnitName = ko.observable(arg.MedicationDosageUnitName);
                self.HowTakenID = ko.observable(arg.HowTakenID);
                self.MedicationRouteName = ko.observable(arg.MedicationRouteName);
                self.HowOftenTaken = ko.observable(arg.HowOftenTaken);
                self.ReasonForTaking = ko.observable(arg.ReasonForTaking);
                self.D_Start = ko.observable(self.getDate(arg.D_Start));
                self.D_End = ko.observable(self.getDate(arg.D_End));
                self.Notes = ko.observable(arg.Notes);
                self.IsHidden = ko.observable(arg.IsHidden);
                self.DTUTC_Created = ko.observable(self.getDate(arg.DTUTC_Created));
            } else {
                self.ID = ko.observable(0);
                self.RID = ko.observable(0);
                self.IsStandardized = ko.observable(true);
                self.MedicationID = ko.observable(null);
                self.MedicationName = ko.observable(null);
                self.MedicationStrength = ko.observable(null);
                self.MedicationStrengthUnitID = ko.observable(null);
                self.MedicationStrengthName = ko.observable(null);
                self.MedicationDosage = ko.observable(null);
                self.MedicationDosageUnitID = ko.observable(null);
                self.MedicationDosageUnitName = ko.observable(null);
                self.HowTakenID = ko.observable(null);
                self.MedicationRouteName = ko.observable(null);
                self.HowOftenTaken = ko.observable(null);
                self.ReasonForTaking = ko.observable(null);
                self.D_Start = ko.observable(null);
                self.D_End = ko.observable(
                   null);
                self.Notes = ko.observable(null);
                self.IsHidden = ko.observable(null);
                self.DTUTC_Created = ko.observable(self.setDate());
            }

        }
        getDate(date) {
            if (date !== null && date !== undefined) {
                return new Date(date).toLocaleDateString();
            } else {
                return new Date().toLocaleDateString();
            }
        }
        setDate() {
           
                return new Date().toLocaleDateString();
            
        }
    }

    export interface IFamilyHistory {
        ID: number;
        RID: number;
        FamilyRelationshipID: number;
        FamilyRelationshipName: string;
        FamilyHistoryConditionID: number;
        FamilyHistoryConditionName: string;
        Notes: string;
        IsHidden: boolean;
        DTUTC_Created: Date;
    }
    export class FamilyHistoryObservable {

        ID: KnockoutObservable<number>;
        RID: KnockoutObservable<number>;
        FamilyRelationshipID: KnockoutObservable<number>;
        FamilyRelationshipName: KnockoutObservable<string>;
        FamilyHistoryConditionID: KnockoutObservable<number>;
        FamilyHistoryConditionName: KnockoutObservable<string>;
        Notes: KnockoutObservable<string>;
        IsHidden: KnockoutObservable<boolean>;
        DTUTC_Created: KnockoutObservable<string>;

        constructor(arg?: any) {
            var self = this;
            if (arg !== null && arg !== undefined) {

                self.ID = ko.observable(arg.ID);
                self.RID = ko.observable(arg.RID);
                self.FamilyRelationshipID = ko.observable(arg.FamilyRelationshipID);
                self.FamilyRelationshipName = ko.observable(arg.FamilyRelationshipName);
                self.FamilyHistoryConditionID = ko.observable(arg.FamilyHistoryConditionID);
                self.FamilyHistoryConditionName = ko.observable(arg.FamilyHistoryConditionName);
                self.Notes = ko.observable(arg.Notes);
                self.IsHidden = ko.observable(arg.IsHidden);
                self.DTUTC_Created = ko.observable(arg.DTUTC_Created);

            } else {

                self.ID                             = ko.observable(0);
                self.RID                            = ko.observable(0);
                self.FamilyRelationshipID           = ko.observable(0);
                self.FamilyRelationshipName         = ko.observable("");
                self.FamilyHistoryConditionID       = ko.observable(0);
                self.FamilyHistoryConditionName     = ko.observable("");
                self.Notes                          = ko.observable("");
                self.IsHidden                       = ko.observable(false);
                self.DTUTC_Created                  = ko.observable("");
            }
        }

    }
    export interface IVital {
        ID: number;
        RID: number;
        VitalStatistics: number;
        VitalReadingAsSent?: any;
        SentByRID: number;
        D_Start?: any;
        D_End?: any;
        Notes?: any;
        IsHidden: boolean;
        DTUTC_Created: Date;
    }
    export interface IPayload {
        Vitals: IVital[];
        Allergies: IAllergy[];
        Details?: any;
        Conditions: ICondition[];
        MedicationTaken: IMedicationTaken[];
        FamilyHistory: IFamilyHistory[];
    }
}
export module models.clinical.HealthRecords.Enums {
    export enum FormType {
        None = 0,
        AllergyForm = 1,
        ConditionForm = 2,
        HistoryForm = 3,
        VitalForm = 4,
        MedicationForm = 5,
    }
    export enum Action {
        None = 0,
        Add = 1,
        Update = 2,
        LoadAll = 3,
        LoadDetail = 4,
        ToggleHidden = 5
    }
    export enum Type {
        None = 0,
        Allergy = 1,
        Condition = 2,
        Medication = 3,
        FamilyHistory = 4,
        VitalReading = 5,
    }
    export enum Result {
        None = 0,
        Failed = 1,
        Success = 2,
    }
    export enum MedicalConditionStatus {
        Undefiend = 0,
        Current = 1,
        Intermittent = 2,
        Past = 3
    }
}
export module models.clinical.HealthRecords.Inputs {
    export module Allergies {
        export interface IAllergyInput {
            RID?: number;
            ActionHelper: ActionHelper;
            IsStandardized?: boolean;
            AllergyID?: number;
            AllergyText?: string;
            ReactionText?: string;
            ReactionID?: number;
            AllergenID?: number;
            AllergenText?: string;
            D_FirstObserved?: string;
            Notes?: string;
            IsHidden?: boolean;
        }
        export interface IAllergyUpdateInput {
            ID: number;
            RID: number;
            AllergyID: number;
            AllergyText: any;
            ReactionID?: number;
            ReactionText?: string;
            AllergenID?: number;
            AllergenText?: string;
            D_FirstObserved: any;
            IsHidden: boolean;
            IsStandardized: boolean;
            Notes: any;
        }
        export class AllergyInput implements IAllergyInput {
            RID: number;
            IsStandardized: boolean;
            AllergyID: number;
            ActionHelper: ActionHelper;
            AllergyText: string;
            ReactionID: number;
            ReactionText: string;
            AllergenID: number;
            AllergenText: string;
            D_FirstObserved: string;
            Notes: string;
            IsHidden: boolean;
            constructor() {
                var self = this;
                self.RID = 0;
                self.Notes = "";
                self.AllergyID = 0;
                self.AllergyText = "";
                self.IsHidden = false;
                self.IsStandardized = true;
            }
        }
        export class AllergyUpdateInput implements IAllergyUpdateInput {
            ID: number;
            RID: number;
            IsStandardized: boolean;
            AllergyID: number;
            ActionHelper: ActionHelper;
            AllergyText: string;
            AllergenText: string;
            ReactionID: number;
            ReactionText: string;
            AllergenID: number;
            D_FirstObserved: string;
            Notes: string;
            IsHidden: boolean;
            constructor(arg?: models.clinical.HealthRecords.IAllergyObservable) {
                if (arg !== undefined && arg !== null) {

                    var self = this;

                    self.ID = arg.ID();

                    self.RID = arg.RID();

                    self.AllergyID = arg.AllergyID();
                    self.AllergenID = arg.AllergenID();
                    self.ReactionID = arg.ReactionID();

                    self.Notes = arg.Notes();

                    self.AllergyText = arg.AllergyText();
                    self.AllergenText = arg.AllergenText();
                    self.ReactionText = arg.ReactionText();
                    
                    // D_FirstObserved=1982-10-02T00:00:00
                    var tempDate = new Date( arg.D_FirstObserved() );
                    
                    self.D_FirstObserved = tempDate.getUTCFullYear() + "-" + tempDate.getUTCMonth() + "-" + tempDate.getUTCDate() +"T00:00:00";


                    self.IsHidden = arg.IsHidden();
                    self.IsStandardized = arg.IsStandardized();
                }
            }
        }
        export interface IAllergyEntitiy {
            NewAllergyID?: number;
            InsertInput?: IAllergyInput;
            UpdateInput?: AllergyUpdateInput;
            ActionHelper: ActionHelper;
            ActionResult?: number;
            List?: IAllergy[];
            RID: number;
            CorporationRID?: number;
            Message?: string;
            IsError?: boolean;
            ClinicalType?: models.clinical.HealthRecords.Enums.Type;
            ClinicalAction?: models.clinical.HealthRecords.Enums.Action;
            ClinicalActionResult?: models.clinical.HealthRecords.Enums.Result;
        }
        export class AllergyEntity implements IAllergyEntitiy {
            RID: number;
            ActionHelper: IActionHelper;
            InsertInput: AllergyInput;
            UpdateInput: AllergyUpdateInput;
            ClinicalType: models.clinical.HealthRecords.Enums.Type = models.clinical.HealthRecords.Enums.Type.Allergy;
            ClinicalAction: models.clinical.HealthRecords.Enums.Action;
            ClinicalActionResult: models.clinical.HealthRecords.Enums.Result;
            constructor() {
                var self = this;
                self.ActionHelper = new ActionHelper();
                self.ActionHelper.ClinicalType = models.clinical.HealthRecords.Enums.Type.Allergy;
                self.ActionHelper.ClinicalAction = models.clinical.HealthRecords.Enums.Action.Add;
            }
        }
    }
    export module MedConditions {
        export interface IMedCondition {
            ID: number;
            RID: number;
            IsStandardized: boolean;
            MedicalConditionID: number;
            MedicalConditionText?: any;
            MedicalConditionStatus: number;
            D_Start?: any;
            D_End?: any;
            HowItEnded?: any;
            Notes?: any;
            IsHidden: boolean;
            DTUTC_Created: Date;
        }
        export interface IMedConditionInput {
            RID: number;
            IsStandardized: boolean;
            MedicalConditionID: number;
            MedicalConditionText: string;
            MedicalConditionStatus: models.clinical.HealthRecords.Enums.MedicalConditionStatus;
            D_Start: string;
            D_End: string;
            HowItEnded: string;
            Notes?: string;
            IsHidden?: boolean;
        }
        export interface IMedConditionUpdateInput {
            ID: number;
            RID: number;
            IsStandardized: boolean;
            MedicalConditionID: number;
            MedicalConditionText: string;
            MedicalConditionStatus: number;
            D_Start: string;
            D_End: string;
            HowItEnded: string;
            Notes?: string;
            IsHidden?: boolean;
        }
        export class MedConditionInput implements IMedConditionInput {
            RID: number;
            IsStandardized: boolean;
            MedicalConditionID: number;
            MedicalConditionText: string;
            MedicalConditionStatus: number;
            D_Start: string;
            D_End: string;
            HowItEnded: string;
            Notes: string;
            IsHidden: boolean;
            constructor() {
                var self = this;
                self.RID = 0;
                self.IsStandardized = true;
                self.MedicalConditionID = 0;
                self.MedicalConditionText = "";
            }
        }
        export class MedConditionUpdateInput implements IMedConditionUpdateInput {
            ID: number;
            RID: number;
            IsStandardized: boolean;
            MedicalConditionID: number;
            MedicalConditionText: string;
            MedicalConditionStatus: number;
            D_Start: string;
            D_End: string;
            HowItEnded: string;
            Notes: string;
            IsHidden: boolean;
            constructor() {
                var self = this;
                self.ID = 0;
                self.RID = 0;
                self.IsStandardized = true;
                self.MedicalConditionID = 0;
                self.MedicalConditionText = "";
            }
        }
        export interface IMedConditionEntitiy {
            RID: number;
            ActionHelper: ActionHelper;
            NewMedicalConditionID?: number;
            ActionResult?: number;
            List?: IMedCondition[];
            InsertInput?: IMedConditionInput;
            UpdateInput?: IMedConditionUpdateInput;
            CorporationRID?: number;
            Message?: string;
            IsError?: boolean;
        } 
        export class MedConditionEntity
            implements IMedConditionEntitiy {
            RID: number;
            InsertInput: MedConditionInput;
            UpdateInput: MedConditionUpdateInput;
            ActionHelper: ActionHelper;
            constructor() {
                var self = this;
                self.ActionHelper = new ActionHelper();
                self.ActionHelper.ClinicalAction = models.clinical.HealthRecords.Enums.Action.Update;
            }
        }
    }
    export module FamilyCondition {
        export interface IFamilyHistoryRecordItem {
            ID: number;
            RID: number;
            FamilyRelationshipID: number;
            FamilyRelationshipName?: any;
            FamilyHistoryConditionID: number;
            FamilyHistoryConditionName?: any;
            Notes?: any;
            IsHidden: boolean;
            DTUTC_Created: Date;
        }
        export interface IInsertInput {
            RID: number;
            FamilyRelationshipID: number;
            FamilyHistoryConditionID: number;
            Notes?: any;
            IsHidden: boolean;
        }
        export interface IUpdateInput {
            ID: number;
            RID: number;
            FamilyRelationshipID: number;
            FamilyHistoryConditionID: number;
            Notes?: any;
            IsHidden: boolean;
        }
        export interface IFamilyConditionEntitiy {
            NewFamilyHistoryRecordID?: number;
            RID: number;
            Action?: number;
            ActionType?: number;
            ActionResult?: number;
            List?: any;
            FamilyHistoryRecordItem?: IFamilyHistoryRecordItem;
            InsertInput?: IInsertInput;
            UpdateInput?: IUpdateInput;
            CorporationRID?: number;
            Message?: string;
            IsError?: boolean;
        }
        export class FamilyConditionEntitiy {
            RID: number;
            InsertInput: IInsertInput;
            UpdateInput: IUpdateInput;
            ActionHelper: ActionHelper;
            constructor() {
                var self = this;
                self.ActionHelper = new ActionHelper();
                self.ActionHelper.ClinicalAction = models.clinical.HealthRecords.Enums.Action.Update;
                self.ActionHelper.ClinicalType = models.clinical.HealthRecords.Enums.Type.FamilyHistory;
            }
        }
    }
    export module MedicationTaken {
        export interface IMedicationTakenItem {
            ID: number;
            RID: number;
            IsStandardized: boolean;
            MedicationID: number;
            MedicationName?: any;
            MedicationStrength?: any;
            MedicationStrengthUnitID: number;
            MedicationStrengthName?: any;
            MedicationDosage?: any;
            MedicationDosageUnitID: number;
            MedicationDosageUnitName?: any;
            HowTakenID: number;
            MedicationRouteName?: any;
            HowOftenTaken?: any;
            ReasonForTaking?: any;
            D_Start?: any;
            D_End?: any;
            Notes?: any;
            IsHidden: boolean;
            DTUTC_Created: Date;
        }
        export interface IMedicationInsertInput {
            RID: number;
            IsStandardized: boolean;
            MedicationID: number;
            MedicationName?: any;
            MedicationStrength?: any;
            MedicationStrengthUnitID: number;
            MedicationDosage?: any;
            MedicationDosageUnitID: number;
            HowTakenID: number;
            HowOftenTaken?: any;
            ReasonForTaking?: any;
            D_Start?: any;
            D_End?: any;
            Notes?: any;
            IsHidden: boolean;
        }
        export class MedicationInsertInput {
            RID: number;
            IsStandardized: boolean;
            MedicationID: number;
            MedicationName: any;
            MedicationStrength: any;
            MedicationStrengthUnitID: number;
            MedicationDosage: any;
            MedicationDosageUnitID: number;
            HowTakenID: number;
            HowOftenTaken: any;
            ReasonForTaking: any;
            D_Start: any;
            D_End: any;
            Notes: any;
            IsHidden: boolean;
            constructor() {
                var self = this;
                self.IsStandardized = true;
                self.MedicationID = 0;
                self.MedicationName = "";
                self.MedicationStrength = "";
                self.Notes = "";
                self.RID = 0;
                self.IsHidden = false;
                self.MedicationStrengthUnitID = 0;
                self.MedicationDosage = "";
                self.MedicationDosageUnitID = 0;
                self.HowTakenID = 0;
                self.HowOftenTaken = "";
                self.ReasonForTaking = "";
                var date = new Date();
                self.D_Start = new Date(date.getFullYear(), date.getMonth(), date.getDay());
                self.D_End = new Date(date.getFullYear(), date.getMonth(), date.getDay());

            }
        }
        export interface IMedicationUpdateInput {
            ID: number;
            RID: number;
            IsStandardized: boolean;
            MedicationID: number;
            MedicationName?: any;
            MedicationStrength?: any;
            MedicationStrengthUnitID: number;
            MedicationDosage?: any;
            MedicationDosageUnitID: number;
            HowTakenID: number;
            HowOftenTaken?: any;
            ReasonForTaking?: any;
            D_Start?: any;
            D_End?: any;
            Notes?: any;
            IsHidden: boolean;
        }
        export class MedicationUpdateInput implements IMedicationUpdateInput {
            ID: number;
            RID: number;
            IsStandardized: boolean;
            MedicationID: number;
            MedicationName: any;
            MedicationStrength: any;
            MedicationStrengthUnitID: number;
            MedicationDosage: any;
            MedicationDosageUnitID: number;
            HowTakenID: number;
            HowOftenTaken: any;
            ReasonForTaking: any;
            D_Start: any;
            D_End: any;
            Notes: any;
            IsHidden: boolean;
            constructor() {
                var self = this;
                self.ID = 0;
                self.RID = 0;
                self.MedicationID = 0;
                self.MedicationName = "";
                self.MedicationStrength = "";
                self.Notes = "";
                self.RID = 0;
                self.IsHidden = false;
                self.MedicationStrengthUnitID = 0;
                self.MedicationDosage = "";
                self.MedicationDosageUnitID = 0;
                self.HowTakenID = 0;
                self.HowOftenTaken = "";
                self.ReasonForTaking = "";
                var date = new Date();
                self.D_Start = Date.UTC(date.getFullYear(), date.getMonth(), date.getDay());
                self.D_End = Date.UTC(date.getFullYear(), date.getMonth(), date.getDay());
            }
        }
        export interface IMedicationTakenEntitiy {
            NewMedicationTakenID?: number;
            RID: number;
            List?: any;
            MedicationTakenItem?: IMedicationTakenItem;
            InsertInput?: IMedicationInsertInput;
            UpdateInput?: IMedicationUpdateInput;
            CorporationRID?: number;
            Message?: string;
            IsError?: boolean;
        }
        export class MedicationTakenEntitiy {
            NewMedicationTakenID: number;
            RID: number;
            List: any;
            MedicationTakenItem: IMedicationTakenItem;
            InsertInput: IMedicationInsertInput;
            UpdateInput: IMedicationUpdateInput;
            CorporationRID: number;
            Message: string;
            IsError: boolean;
            ActionHelper: IActionHelper;
            ClinicalType: models.clinical.HealthRecords.Enums.Type = models.clinical.HealthRecords.Enums.Type.Medication;
            ClinicalAction: models.clinical.HealthRecords.Enums.Action;
            ClinicalActionResult: models.clinical.HealthRecords.Enums.Result;
            constructor() {
                var self = this;
                self.ActionHelper = new ActionHelper();

            }
        }
    }
    export interface IActionHelper {
        ClinicalType: models.clinical.HealthRecords.Enums.Type;
        ClinicalAction: models.clinical.HealthRecords.Enums.Action;
        ClinicalActionResult: models.clinical.HealthRecords.Enums.Result;
    }
    export class ActionHelper implements IActionHelper {
        ClinicalType: models.clinical.HealthRecords.Enums.Type;
        ClinicalAction: models.clinical.HealthRecords.Enums.Action;
        ClinicalActionResult: models.clinical.HealthRecords.Enums.Result;
        constructor() {
            var self = this;
            self.ClinicalType = models.clinical.HealthRecords.Enums.Type.None;
            self.ClinicalAction = models.clinical.HealthRecords.Enums.Action.None;
            self.ClinicalActionResult = models.clinical.HealthRecords.Enums.Result.None;
        }
    }
}