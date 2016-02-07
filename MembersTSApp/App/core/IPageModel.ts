import IAppContext = require("core/IAppContext");
import AppModule = require("durandal/app");
interface IPageModel {
    modelId: string;
    domPage: JQuery;
    app: DurandalAppModule;
    appContext: IAppContext;
    compositionComplete: () => void;
    canDeactivate(): Q.Promise<boolean>;
    attached( view: any ): Q.Promise<boolean>;
    activate(parms?: any): Q.Promise<boolean>;
    deactivate(parms?: any): Q.Promise<boolean>;
    canActivate(parms?: any): Q.Promise<boolean>;
    detached( view: any, parent: any ): Q.Promise<boolean>;
    openAddDependentDialog: ( data, event ) => void;
}
export = IPageModel; 