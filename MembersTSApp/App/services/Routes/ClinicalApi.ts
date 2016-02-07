export interface IClinicalApi {
    defaultOptions: {};
    antiForgeryToken: string;
    findAllergies: (entity) => JQueryXHR;
    findConditions: (entity) => JQueryXHR;
    findMedications: (entity) => JQueryXHR;
    findFamilyHistory: (entity) => JQueryXHR;

    insertAllergy: (entity) => JQueryXHR;
    updateAllergy: (entity) => JQueryXHR;
    getAllergies: (entity) => JQueryXHR;

    insertCondition: (entity) => JQueryXHR;
    updateCondition: (entity) => JQueryXHR;
    getConditions: (entity) => JQueryXHR;

    loadFamilyHistory: (entity) => JQueryXHR;
    insertFamilyHistory: (entity) => JQueryXHR;
    updateFamilyHistory: (entity) => JQueryXHR;

    loadVitalReadings: (entity) => JQueryXHR;

    loadMedicationTaken: (entity) => JQueryXHR;
    insertMedicationTaken: (entity) => JQueryXHR;
    updateMedicationTaken: (entity) => JQueryXHR;

    insertVitalReadingHeight: (entity) => JQueryXHR;
    updateVitalReadingHeight: (entity) => JQueryXHR;
    insertVitalReadingWeight: (entity) => JQueryXHR;
    updateVitalReadingWeight: (entity) => JQueryXHR;

    autoCompleteAllergies: (value) => JQueryXHR;
    autoCompleteConditions: (value) => JQueryXHR;
    autoCompleteMedication: (value) => JQueryXHR;

}
export class ClinicalApi {
    ref: ClinicalApi;
    instance: IClinicalApi;
    static route: string = "api/clinical/";
    constructor(self: any) {
        this.instance = {
            defaultOptions: {},
            antiForgeryToken: "",
            findAllergies: entity => self.invoke.call(
                self, ClinicalApi.route + "find/Allergies",
                "post", {}, entity),
            findConditions: entity => self.invoke.call(
                self, ClinicalApi.route + "find/Conditions",
                "post", {}, entity),
            findMedications: entity => self.invoke.call(
                self, ClinicalApi.route + "find/Medications", "post",
                {}, entity),
            findFamilyHistory: entity => self.invoke.call(
                self, ClinicalApi.route + "find/FamilyHistory", "post",
                {}, entity),
            insertAllergy: entity => self.invoke.call(
                self, ClinicalApi.route + "insert/Allergy", "post", {}, entity),
            updateAllergy: entity => self.invoke.call(
                self, ClinicalApi.route + "update/Allergy", "post", {}, entity),
            getAllergies: entity => self.invoke.call(
                self, ClinicalApi.route + "load/Allergies", "post", {}, entity),
            insertCondition: entity => self.invoke.call(
                self, ClinicalApi.route + "insert/Condition", "post", {}, entity),
            updateCondition: entity => self.invoke.call(
                self, ClinicalApi.route + "update/Condition", "post", {}, entity),
            getConditions: entity => self.invoke.call(
                self, ClinicalApi.route + "load/Conditions", "post", {}, entity),
            insertMedicationTaken: entity => self.invoke.call(
                self, ClinicalApi.route + "insert/MedicationTaken", "post",
                {}, entity),
            updateMedicationTaken: entity => self.invoke.call(
                self, ClinicalApi.route + "update/MedicationTaken", "post",
                {}, entity),
            loadMedicationTaken: entity => self.invoke.call(
                self, ClinicalApi.route + "load/MedicationTaken", "post",
                {}, entity),
            loadFamilyHistory: entity => self.invoke.call(
                self, ClinicalApi.route + "load/FamilyHistory", "post",
                {}, entity),
            insertFamilyHistory: entity => self.invoke.call(
                self, ClinicalApi.route + "insert/FamilyHistory", "post",
                {}, entity),
            updateFamilyHistory: entity => self.invoke.call(
                self, ClinicalApi.route + "update/FamilyCondition", "post",
                {}, entity),
            loadVitalReadings: entity => self.invoke.call(
                self, ClinicalApi.route + "load/VitalReadings", "post",
                {}, entity),
            insertVitalReadingHeight: entity => self.invoke.call(
                self, ClinicalApi.route + "insert/VitalReading/Height", "post",
                {}, entity),
            updateVitalReadingHeight: entity => self.invoke.call(
                self, ClinicalApi.route + "update/VitalReading/Height", "post",
                {}, entity),
            insertVitalReadingWeight: entity => self.invoke.call(
                self, ClinicalApi.route + "insert/VitalReading/Weight", "post",
                {}, entity),
            updateVitalReadingWeight: entity => self.invoke.call(
                self, ClinicalApi.route + "update/VitalReading/Weight", "post",
                {}, entity),
            autoCompleteAllergies: value => self.invoke.call(
                self, ClinicalApi.route + "auto/Allergies/" + value,
                "get", {}),
            autoCompleteConditions: value => self.invoke.call(
                self, ClinicalApi.route + "auto/Conditions/" + value,
                "get", {}),
            autoCompleteMedication: value => self.invoke.call(
                self, ClinicalApi.route + "auto/Medications/" + value,
                "get", {})
        }
    }
}


