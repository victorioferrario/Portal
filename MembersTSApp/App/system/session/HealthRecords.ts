import LG = require("models/clinical/HealthRecords");
import AppContext = require("core/AppContext");
import IAppContext = require( "core/IAppContext" );

//import HelperClinicalData = require("system/session/ClinicalData");
export module sys.session {
    export class HealthRecords {
        appContext: IAppContext;
       // appSessionClinical:HelperClinicalData.system.session.clinical.ClinicalData;
        instance: LG.models.clinical.HealthRecords.IPayload;
        constructor() {
            var self = this;
            self.appContext = AppContext;
           // self.appSessionClinical = new HelperClinicalData.system.session.clinical.ClinicalData();
        }
        onServerHandler(data) {
            var self = this;
            console.log(data);
            self.instance = data;
        }
    }
}