import StateTracker = require( "core/DialogState" );
import global = require( "system/session/IdentityUser" )
import AppTrans = require("core/AppViewTransitions");
import lg = require("system/session/HealthRecords");
import Service = require("services/HttpService");
import health = require( "system/session/ClinicalData" );
import Sys = require( "system/utilities/ViewManager" );
import SysTools = require("system/utilities/BrowserManager");
interface IAppContext {
    app: DurandalAppModule;
    router: DurandalRootRouter;
    service: Service;
    DEBUGGING: boolean;
    dialogTracker: StateTracker.core.DialogStateTracker;
    appViewHealthRecords: Sys.utilities.Components.Views.IManager;
    appHealthHelper: health.system.session.clinical.ClinicalData;
    boot: () => Q.Promise<boolean>; 
    bootHealthRecords: () => Q.Promise<boolean>; 
    isTransBinded:boolean;
    bindTrans: () => Q.Promise<boolean>;
    add: () => void;
    remove: () => void;
    authenticate: () => void;
    setupLogic: () => Q.Promise<boolean>; 
    setupRouter: () => Q.Promise<boolean>; 
    appTransitions: AppTrans;
    selectedOrderType: KnockoutObservable<any>;
    identityUser: global.sys.session.IdentityUser;
    identityHealthRecords: lg.sys.session.HealthRecords;
    resetViewPort: () => Q.Promise<boolean>; 
    get_browser_info: () => any;
    browser: SysTools.utilities.platform.BrowserManager;
}
export = IAppContext;