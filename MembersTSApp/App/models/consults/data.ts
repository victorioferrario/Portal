export module models.consults.data {
    export interface IConsultationsFound {
        ConsultationID: number;
        ConsultationRecipientAccountID: number;
        ProductID: string;
        ConsultationName: string;
        ConsultationCustomLabel: string;
        StateCodeRecipientLocatedDuringConsultation: string;
        ContactInfoOfRecipientDuringConsultation: string;
        AssignedToRID: number;
        DTUTC_AssignedToRID?: Date;
        IsTesting: boolean;
        ConsultationProcessingProcessState: number;
        ConsultationServicingProcessState: number;
        ListeningForValue: string;
        DTUTC_Created: Date;
    }
    export interface IConsultationsFoundExpanded {
        ConsultationID: number;
        ConsultationRecipientAccountID: number;
        ProductID: string;
        ConsultationName: string;
        ConsultationCustomLabel: string;
        StateCodeRecipientLocatedDuringConsultation: string;
        ContactInfoOfRecipientDuringConsultation: string;
        AssignedToRID: number;
        DTUTC_AssignedToRID?: Date;
        IsTesting: boolean;
        ConsultationProcessingProcessState: number;
        ConsultationServicingProcessState: number;
        ListeningForValue: string;
        DTUTC_Created: Date;
        DrName: string;
    }
    export interface IObject {
        AccountID?: number;
        ProcessState?: number;
        ConsultationsFound?: IConsultationsFound[];
        ConsultationsFoundExpanded?: IConsultationsFoundExpanded[];
        OrdersFound?: any;
        OrderAction?: number;
        OrderResult?: number;
        CorporationRID?: number;
        Message?: string;
        IsError?: boolean;
    }
}

