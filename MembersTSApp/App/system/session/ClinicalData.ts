import HelperClinical = require("components/clinical/IHealthRecords");
import IClinicalData = require("system/session/IClinicalData");
import LG = require("models/clinical/HealthRecords");
export module system.session.clinical{
    export class ClinicalData implements IClinicalData {
        optionsModel: HelperClinical.componentes.clinical.IHealthRecords.DataProvider;
        selectedAllergy: KnockoutObservable<LG.models.clinical.HealthRecords.IAllergy>;
        selectedCondition: KnockoutObservable<LG.models.clinical.HealthRecords.ICondition>;
        selectedFamilyHistory: KnockoutObservable<LG.models.clinical.HealthRecords.IFamilyHistory>;
        selectedMedicationTaken: KnockoutObservable<LG.models.clinical.HealthRecords.IMedicationTaken>;
        selectedRID: KnockoutObservable<number>;
        listAllergies: Array<LG.models.clinical.HealthRecords.IAllergy>;
        constructor() {
            var self = this;
            self.selectedAllergy = ko.observable(null);
            self.selectedCondition = ko.observable(null);
            self.selectedFamilyHistory = ko.observable(null);
            self.selectedMedicationTaken = ko.observable(null);
            self.optionsModel = new HelperClinical.componentes.clinical.IHealthRecords.DataProvider();
            self.selectedRID = ko.observable(0);
            self.listAllergies = [];
        }
    }
}