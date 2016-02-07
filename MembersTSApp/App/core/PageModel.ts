import ko = require("knockout");
import AppContext = require("core/AppContext");
import IAppContext = require("core/IAppContext");
import IPageModel = require("core/IPageModel");
import AppModule = require( "durandal/app" );
import Events = require( "system/events/EventCommand" );
class PageModel implements IPageModel {
    modelId: string;
    app: DurandalAppModule;
    appContext: IAppContext;
    domPage:JQuery;
    constructor() {
        var self = this;
        self.app = AppModule;
        self.domPage = $("#page");
        self.appContext = AppContext;
    }
    activate(parms?: any): Q.Promise<any> {
        var self = this;
        if (self.appContext.dialogTracker.isDialogDependents) {
            self.appContext.dialogTracker.closeDependentDialog();
        }
        return Q.resolve(true);
    }
    deactivate(parms?: any): Q.Promise<any> {
        return Q.resolve(true);
    }
    canActivate(parms?: any): Q.Promise<any> {
        var self = this;
        //self.appContext.service.routes.wizard.isAuthenticated().done(data => {
        //    console.log("issue");
        //    if (!data) {
        //        // document.location.href = "Logout.aspx";
        //    }
        //}).fail(() => {
        //    //  document.location.href = "Logout.aspx";
        //});
        return Q.resolve(true);
    }
    canDeactivate(): Q.Promise<any> {
        return Q.resolve(true);
    }
    attached(view: any): Q.Promise<any> {
        console.info( "attached" + view );
        $( "#modalFrmManager2" ).closeModal();
        return Q.resolve(true);
    }
    detached(view: any, parent: any): Q.Promise<any> {
        return Q.resolve(true);
    }
    compositionComplete() {
        var self = this;
    }

    openAddDependentDialog( data, event ) {
        var self = this;
        if ( self.initFormMangerDependentDialog() ) {
            ko.postbox.publish(
                Events.system.events.FormCommands.DependentForm );
        }
    }
    
    private initFormMangerDependentDialog() {
        var self = this;
        self.appContext.dialogTracker.isDialogDependents = true;
        $( ".modal-content" ).removeClass( "m-hide" );
        $( "#modalFrmManager4" ).removeClass( "m-hide" );
        $( "#modalFrmManager4" ).openModal( {
            dismissible: false
        });
        $( ".tooltipped").tooltip( "remove" );
        return true;
    }
}
export = PageModel;
