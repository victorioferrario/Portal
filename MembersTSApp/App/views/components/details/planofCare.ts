import IModel = require("models/consults/history");
class PlanOfCare {

    //#region [@    Properties   @]

    dataContext: IModel.models.consults.history.IPlanOfCareDetail;

    Note: KnockoutObservable<string>;
    isNoteAvailable: KnockoutObservable<boolean>;
    PatientReferredTo: KnockoutObservable<string>;
    ListOfTreatmentPlanOptions: KnockoutObservableArray<string>;
    ListOfPatientEducationOptions: KnockoutObservableArray<string>;
    PatientInstructedToFollowUpInHours: KnockoutObservable<string>;

    //#endregion

    //#region [@    Page         @]

    constructor(data: IModel.models.consults.history.IPlanOfCare) {
        var self = this;
        self.dataContext = data.PlanOfCare;
        self.Note = ko.observable(self.dataContext.Note);
        self.PatientReferredTo = ko.observable("");
        self.ListOfTreatmentPlanOptions = ko.observableArray([]);
        self.ListOfPatientEducationOptions = ko.observableArray([]);
        self.PatientInstructedToFollowUpInHours = ko.observable("");

        self.bindPatientReferredTo();
        self.bindListOfEducationOptions();
        self.bindListOfTreatmentPlanOptions();
        self.bindPatientInstructedToFollowUpInHours();
    }

    //#endregion

    //#region [@    Event        @]

    //#endregion

    //#region [@    Functions    @]

    bindPatientReferredTo() {
        var self = this, result = "";
        switch (self.dataContext.PatientReferredTo) {
            case IModel.models.consults.history.PatientReferredToEnum.NA:
                result = "NA";
                break;
            case IModel.models.consults.history.PatientReferredToEnum.EmergencyRoom:
                result = "Emergency Room";
                break;
            case IModel.models.consults.history.PatientReferredToEnum.HealthDepartment:
                result = "Health Department";
                break;
            case IModel.models.consults.history.PatientReferredToEnum.PrimaryCarePhysician:
                result = "Primary Care Physician";
                break;
            case IModel.models.consults.history.PatientReferredToEnum.RetailClinic:
                result = "Retail Clinic";
                break;
            case IModel.models.consults.history.PatientReferredToEnum.Specialist:
                result = "Specialist";
                break;
            case IModel.models.consults.history.PatientReferredToEnum.UrgentCareClinic:
                result = "Urgent Care Clinic";
                break;
        }
        self.PatientReferredTo(result);
    }
    bindListOfEducationOptions() {
        var self = this;
        self.dataContext.ListOfPatientEducationOptions.forEach(
            (item: IModel.models.consults.history.PatientEducationEnum) => {
                var subResult = "";
                switch (item) {
                    case IModel.models.consults.history.PatientEducationEnum.NA:
                        subResult = "NA";
                    case IModel.models.consults.history.PatientEducationEnum.Diet:
                        subResult = "Diet";
                    case IModel.models.consults.history.PatientEducationEnum.Excercise:
                        subResult = "Excercise";
                    case IModel.models.consults.history.PatientEducationEnum.SafeSexPractices:
                        subResult = "Safe Sex Practices";
                    case IModel.models.consults.history.PatientEducationEnum.ViralBacterialInfections:
                        subResult = "Viral / Bacterial Infections";
                }
                self.ListOfPatientEducationOptions.push(subResult);
            });
    }
    bindListOfTreatmentPlanOptions() {
        var self = this;
        self.dataContext.ListOfTreatmentPlanOptions.forEach(
            (item: IModel.models.consults.history.TreatmentPlanEnum) => {
                var subResult = "";
                switch (item) {
                    case IModel.models.consults.history.TreatmentPlanEnum.Undefined:
                        subResult = "NA";
                    case IModel.models.consults.history.TreatmentPlanEnum.HomeOrSelfCare:
                        subResult = "Home / Self Care";
                    case IModel.models.consults.history.TreatmentPlanEnum.OTCMedication:
                        subResult = "OTC Medication";
                    case IModel.models.consults.history.TreatmentPlanEnum.Prescription:
                        subResult = "Rx Medications";
                }
                self.ListOfTreatmentPlanOptions.push(subResult);
            });
    }
    bindPatientInstructedToFollowUpInHours() {
        var self = this, result = "";
        switch (self.dataContext.PatientInstructedToFollowUpInHours) {
            case IModel.models.consults.history.FollowUpEnum.HOURS_24:
                result = "24 HRS";
                break;
            case IModel.models.consults.history.FollowUpEnum.HOURS_36:
                result = "36 HRS";
                break;
            case IModel.models.consults.history.FollowUpEnum.HOURS_48:
                result = "48 HRS";
                break;
            case IModel.models.consults.history.FollowUpEnum.HOURS_OTHER:
                result = "OTHER";
                break;
        }
        self.PatientInstructedToFollowUpInHours(result);
    }

    //#endregion

}
export = PlanOfCare;