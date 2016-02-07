import ko = require( "knockout" );
import AppContext = require( "core/AppContext" );
import IAppContext = require( "core/IAppContext" );
import IViewModel = require( "core/IViewModel" );
import HelperClinical = require( "components/clinical/IHealthRecords" );
import Env = require( "system/events/EventCommand" );
import Env2 = require( "system/events/ClinicalCommands" );
import Sys = require( "system/utilities/ViewManager" );
declare var Materialize;
class ViewModel implements IViewModel {

    helper: any;
    modelId: string;
    appContext: IAppContext;

    nonHTML5:KnockoutObservable<boolean>;

    constructor() {
        var self = this;
        this.appContext = AppContext;

    }

    activate( parms?: any ): Q.Promise<any> {
        var self = this;
        self.nonHTML5 = ko.observable( self.appContext.browser.Browser.name === "IE" ); return Q.resolve( true );
    }
    deactivate( parms?: any ): Q.Promise<any> {
        return Q.resolve( true );
    }
    canActivate( parms?: any ): Q.Promise<any> {
        var self = this;
        //self.appContext.service.routes.wizard.isAuthenticated().done(data => {
        //    console.log("issue");
        //    if (!data) {
        //        // document.location.href = "Logout.aspx";
        //    }
        //}).fail(() => {
        //    //  document.location.href = "Logout.aspx";
        //});
        return Q.resolve( true );
    }
    canDeactivate(): Q.Promise<any> {
        return Q.resolve( true );
    }
    attached( view: any ): Q.Promise<any> {
        console.info( "attached" + view );
        return Q.resolve( true );
    }
    detached( view: any, parent: any ): Q.Promise<any> {
        return Q.resolve( true );
    }
    compositionComplete() {
        var self = this;
    }

    removeFormManager() {
        var self = this;
        ko.postbox.publish(
            Env2.system.events.Clinical.ADD_CONTROL_BLANK_EDGE,
            null );
        self.appContext.appViewHealthRecords.modalState(
            Env.system.events.LayoutCommands.ModalHR.Close );
        return true;
    }

    showNotes() {
        var self = this;
        ///  alert("hallo");
        Sys.utilities.Components.Views.DOM.add(
            $( "#divNote" ) );
        Sys.utilities.Components.Views.DOM.remove(
            $( "#divAddNote" ) );
    }
    hideNotes() {
        Sys.utilities.Components.Views.DOM.add(
            $( "#divAddNote" ) );
        Sys.utilities.Components.Views.DOM.remove(
            $( "#divNote" ) );
    }
    showNotes2() {
        var self = this;
        Sys.utilities.Components.Views.DOM.add(
            $( "#divNote2" ) );
        Sys.utilities.Components.Views.DOM.remove(
            $( "#divAddNote2" ) );
    }
    hideNotes2() {
        var self = this;
        Sys.utilities.Components.Views.DOM.add(
            $( "#divAddNote2" ) );
        Sys.utilities.Components.Views.DOM.remove(
            $( "#divNote2" ) );
    }

    searchOnBlur( data, event ) {
        Sys.utilities.Components.Views.DOM.remove(
            $( "#searchLoadIndicatorControl" ) );
    }
    searchOnFocus( data, event ) {
        Sys.utilities.Components.Views.DOM.add(
            $( "#searchLoadIndicatorControl" ) );
    }
}
export = ViewModel;