export module system.events {
    export class GeneralCommands {

        static NAVIGATION_TRIGGERED = "command:Navigation:triggered";

        static DATA_LOADED = "command:Data:Loaded"; 
        static DATA_LOAD_START = "command:Data:Start:Load"; 
        static DATA_LOADED__DETAIL = "command:Data:Loaded:Detail"; 
        static DATA_LOADED__DEPENDENTS = "command:Data:Loaded:Detail"; 
        static DATA_LOADED__CREDIT_CARDS = "command:Data:Loaded:CreditCards"; 
        static UI_RELOAD__CREDIT_CARDS = "command:UI:Reload:CreditCards"; 

        static DATA_HEALTH_RELOAD = "command:Data:HealthRecords:RELOAD"; 
        static DATA_HEALTH_LOADED = "command:Data:HealthRecords:Loaded"; 

        static DATA_LOADED_ORDERS_LIST = "command:Data:Loaded:ORDERS:LIST"; 

        static LOADER_ADD = "command:Loader:Add";
        static LOADER_REMOVE = "command:Loader:Remove";

        static DATA_CONSULT_DETAIL_LOADED = "command:Data:Loaded:Consult:Detail"; 
        static DATA_CONSULT_PENDING_DETAIL_LOADED = "command:Data:Loaded:Consult:PENDING:Detail"; 
        static DATA_CONSULT_PENDING_MESSAGES_LOADED = "command:Data:Loaded:Consult:PENDING:Messages"; 
        static DATA_CONSULT_COMPLETED_MESSAGES_LOADED = "command:Data:Loaded:Consult:COMPLETED:Messages"; 
    }
    export class FormCommands {
        static BillingForm = "command:FormCommands:Billing:Form";
        static DependentForm = "command:FormCommands:Dependent:Form";
    }
    export module LayoutCommands {
        export class ModalHR {
            static Reset = "command:LayoutCommands:Modal:Reset";
            static Close = "command:LayoutCommands:Modal:Close";
            static Insert = "command:LayoutCommands:Modal:Insert";
            static Update = "command:LayoutCommands:Modal:Update";
            static Details = "command:LayoutCommands:Modal:Details";
            static NotesRest="command:LayoutCommands:Modal:Notes:Reset";
        }
        export class FormButtonsHR {
            static Reset = "command:LayoutCommands:Button:Reset";
            static Search = "command:LayoutCommands:Button:Search";
            static Insert = "command:LayoutCommands:Button:Insert";
            static Update = "command:LayoutCommands:Button:Update";
            static Details = "command:LayoutCommands:Button:Details";
            static SearchItems = "command:LayoutCommands:Button:SearchItems";
        }
    }
    export class ConsultHistoryCommands {

        static VIEW_DETAILS = "command:ConsultHistory:Details";

        static VIEW_PENDING_DETAILS = "command:ConsultHistory:Pending:Details";

        //static DATA_LOAD_START = "command:Data:Start:Load";

        //static DATA_HEALTH_RELOAD = "command:Data:HealthRecords:RELOAD";
        //static DATA_HEALTH_LOADED = "command:Data:HealthRecords:Loaded";

        //static DATA_LOADED_ORDERS_LIST = "command:Data:Loaded:ORDERS:LIST";

        //static LOADER_ADD = "command:Loader:Add";
        //static LOADER_REMOVE = "command:Loader:Remove";

        //static DATA_CONSULT_DETAIL_LOADED = "command:Data:Loaded:Consult:Detail";

    }
}