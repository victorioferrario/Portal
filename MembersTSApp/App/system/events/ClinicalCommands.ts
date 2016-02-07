export module system.events {
    export class Clinical {


        static ADD_CONTROL = "COMMAND:CONTROL:ADD";
        static ADD_CONTROL_EDGE = "COMMAND:CONTROL:ADD:EDGE";

        static ADD_CONTROL_BLANK_EDGE = "COMMAND:CONTROL:ADD:BLANK:EDGE";

        static ADD_INSERT_CONTROL = "COMMAND:CONTROL:ADD:INSERT";
        static ADD_INSERT_CONTROL_EDGE = "COMMAND:CONTROL:ADD:INSERT:EDGE";

        static VIEW_DETAIL_CONTROL= "COMMAND:CONTROL:VIEW:DETAIL";
        static VIEW_PENDING_DETAIL_CONTROL = "COMMAND:CONTROL:VIEW:PENDING:DETAIL";


        static FORM_BLANK = "FORM:BLANK";
        static FORM_ALLERGY = "FORM:ALLERGY";
        static FORM_HISTORY = "FORM:HISTORY";
        static FORM_CONDITIONS = "FORM:CONDITIONS";
        static FORM_MEDICATIONS = "FORM:MEDICATIONS";
        static FORM_MEASUREMENTS = "FORM:MEASUREMENTS";

        static LOADER_ADD = "command:Loader:Add";
        static LOADER_REMOVE = "command:Loader:Remove";

    }
}