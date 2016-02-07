export module models.consults.messaging
{
        export interface IMessageExchange {
            ID: number;
            MemberRID: number;
            OrderID: number;
            ConsultationID: number;
            SendByRID: number;
            Message: string;
            MessageEnc: string;
            IsHidden: boolean;
            DTUTC_Created: Date;
            index?:number;
        }
        export interface IPayload {
            ConsultationID?: number;
            MessageExchange: IMessageExchange[];
            CorporationRID?: number;
            Message?: string;
            IsError?: boolean;
        }
        export interface IMessageEntity {
            Message: string;
            ConsultationID?:number;
        }
        export class MessageEntity implements IMessageEntity {
            Message: string;
            ConsultationID: number;
            constructor(message: string) {
                var self = this;
                self.Message = message;
            }
        }
 }