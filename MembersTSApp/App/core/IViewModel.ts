import HelperClinical = require("components/clinical/IHealthRecords");
import IAppContext = require( "core/IAppContext" );
import Env = require( "system/events/EventCommand" );
import Sys = require( "system/utilities/ViewManager" );
interface IViewModel {
    helper: any;
    modelId: string;
    appContext: IAppContext;

    activate(parms?: any): Q.Promise<boolean>;
    deactivate(parms?: any): Q.Promise<boolean>;

    canDeactivate(): Q.Promise<boolean>;
    canActivate(parms?: any): Q.Promise<boolean>;

    attached(view: any): Q.Promise<boolean>;
    detached(view: any, parent: any): Q.Promise<boolean>;

    compositionComplete: () => void;
    removeFormManager: () => boolean;

    showNotes: () => void;
    hideNotes: () => void;
    showNotes2: () => void;
    hideNotes2: () => void;

    searchOnBlur: ( data, event ) => void;
    searchOnFocus: ( data, event ) => void;
    
}
export = IViewModel; 