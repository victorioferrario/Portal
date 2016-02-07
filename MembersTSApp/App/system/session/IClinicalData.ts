import HelperClinical = require("components/clinical/IHealthRecords");
import LG =require("models/clinical/HealthRecords");
interface IClinicalData {
    optionsModel: HelperClinical.componentes.clinical.IHealthRecords.DataProvider;
    selectedAllergy: KnockoutObservable<LG.models.clinical.HealthRecords.IAllergy>;
    selectedCondition: KnockoutObservable<LG.models.clinical.HealthRecords.ICondition>;
    selectedFamilyHistory: KnockoutObservable<LG.models.clinical.HealthRecords.IFamilyHistory>;
    selectedMedicationTaken: KnockoutObservable<LG.models.clinical.HealthRecords.IMedicationTaken>;
    selectedRID: KnockoutObservable<number>;
    listAllergies: Array<LG.models.clinical.HealthRecords.IAllergy>;
}
export = IClinicalData;