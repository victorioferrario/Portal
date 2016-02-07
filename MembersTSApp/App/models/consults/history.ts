export module models.consults.history {
    export enum FollowUpEnum {
        HOURS_24 = 1,
        HOURS_36 = 2,
        HOURS_48 = 3,
        HOURS_OTHER = 4
    }
    export enum PatientReferredToEnum {
        EmergencyRoom = 1,
        HealthDepartment = 2,
        RetailClinic = 3,
        UrgentCareClinic = 4,
        Specialist = 5,
        PrimaryCarePhysician = 6,
        NA = 0
    }
    export enum PatientEducationEnum {
        SafeSexPractices = 1,
        ViralBacterialInfections = 2,
        Diet = 3,
        Excercise = 4,
        NA = 5,
    }
    export enum TreatmentPlanEnum {
        Undefined = 0,
        HomeOrSelfCare = 1,
        OTCMedication = 2,
        Prescription = 3,
    }
    export enum ProcessStateEnum {
        Undefined = 0,
        Initializing = 1,
        Initialized = 2,
        Running = 3,
        Completed = 4,
        Canceled = 5,
    }
    export interface IChiefComplaint {
            MemberRID: number;
            OrderID: number;
            ConsultationID: number;
            ChiefComplaintShort: string;
            ChiefComplaintVerbose?: any;
            DTUTC_Created: Date;
        }
    export interface IFile {
            FileGUID: string;
            CID: number;
            FileFullName: string;
            FileExtension: string;
            FilePlainBytes: string;
            IsHidden: boolean;
            DTUTC_Uploaded: Date;
            Description: string;
    }
    export interface IEncounterData {
            ChiefComplaints: IChiefComplaint[];
            Files: IFile[];
            HealthChart?: any;
            CorporationRID: number;
            Message: string;
            IsError: boolean;
        }
    export interface IPlanOfCareDetail {
            SnapshotGUID: string;
            DTUTC_SnapshopTaken: Date;
            PatientRID: number;
            ConsultationID: number;
            MedicalPractitionerRID: number;
            PatientReferredTo: number;
            ListOfTreatmentPlanOptions: number[];
            Note?: any;
            ListOfPatientEducationOptions: number[];
            PatientInstructedToFollowUpInHours: number;
        }
    export interface ListOfLegalDisclaimer {
            LegalID: number;
            LegalText?: any;
        }
    export interface IPlanOfCare {
            PlanOfCare: IPlanOfCareDetail;
            ListOfLegalDisclaimers: ListOfLegalDisclaimer[];
        }
    export interface IListDiagnosis {
            ID: number;
            MemberRID: number;
            OrderID: number;
            ConsultationID: number;
            ICD10Code: string;
            ICD10_1: string;
            ICD10_2: string;
            ShortDesc: string;
            DiagnosisFreeHandStr: string;
            CreatedByRID: number;
            IsHidden: boolean;
            DTUTC_Created: Date;
            DTUTC_Modified: Date;
        }
    export interface RootObject {
            ConsultationID: number;
            OrderDetails?: any;
            EncounterData: IEncounterData;
            PlanOfCare: IPlanOfCareDetail;
            ListDiagnoses: IListDiagnosis[];
            ChiefComplaints: any[];
            Files: any[];
            HealthChart?: any;
            CorporationRID: number;
            Message: string;
            IsError: boolean;
        }

 
}

export module models.consults.history.controls {
    export class AttachmentItem {
        FileGUID:KnockoutObservable<string>;
        FileFullName: KnockoutObservable<string>;
        FileExtension: KnockoutObservable<string>;
        FilePlainBytes: KnockoutObservable<string>;
        ImagePlaceHolder: KnockoutObservable<string>;
        ImageFullView: KnockoutObservable<string>;

        constructor(data: models.consults.history.IFile) {
            var self = this, dataImageEncoding: string = "";
            self.FileGUID = ko.observable(data.FileGUID);
            self.FileFullName = ko.observable(data.FileFullName);
            self.FileExtension = ko.observable(data.FileExtension);
            self.FilePlainBytes = ko.observable(data.FilePlainBytes);
            console.warn(data);
            switch (data.FileExtension) {
            case ".jpg":
                dataImageEncoding = "data:image/jpg;base64,";
                break;
            case ".png":
                dataImageEncoding = "data:image/png;base64,";
                break;
            }
            self.ImagePlaceHolder =
                ko.observable(`<img src=${dataImageEncoding}${data.FilePlainBytes} class='img-thumbnail attachment-preview hoverable' style='cursor:pointer' />`);
            self.ImageFullView =
            ko.observable( `<div class='image_preview__container  m-hide' style='' id='large__${data.FileGUID}'><img src=${dataImageEncoding}${data.FilePlainBytes} class='img-responsive image image_large__class z-depth-4 fadeInUp animated-300 ' /></div>`);
        
    }

        viewFull() {
            var self = this;
        }
    }
}