/// <reference path="../../../../scripts/typings/knockout.postbox/knockout-postbox.d.ts" />
import ko = require( "knockout" );
import AppModule = require( "durandal/app" );
import activator = require( "durandal/activator" );
import IViewModel = require( "core/IViewModel" );
import ViewModel = require( "core/ViewModel" );
import BlankForm = require( "views/components/forms/clinical2x/blank" );
import DependentForm = require( "views/components/forms/account/dependent" );
import Env = require( "system/events/ClinicalCommands" );
import Events = require( "system/events/EventCommand" );
import Sys = require( "system/utilities/ViewManager" );
import Data = require( "../../../models/consults/data" );
import util = require( "components/cart/tools" );

class DefaultManager4 extends ViewModel {
   // viewManager: Sys.utilities.Components.Views.IManager;
    // forms    
    blankForm: BlankForm;
    dependentForm: DependentForm;
    // observables      
    app: DurandalAppModule;
    title: KnockoutObservable<string>;
    action: KnockoutObservable<any>;
    pageControl: KnockoutObservable<any>;
    buttonLabel: KnockoutObservable<string>;
    currentInstance: KnockoutObservable<any>;
    //frmControl: KnockoutObservable<any>;
    constructor() {
        super();
        var self = this;
        self.app = AppModule;
        self.currentInstance = ko.observable();
        self.buttonLabel = ko.observable("Update");
        // Init Forms
        self.blankForm = new BlankForm();
        self.pageControl = ko.observable();

        ko.postbox.subscribe( Env.system.events.Clinical.ADD_CONTROL_BLANK_EDGE, data => {
            self.AddBlankControl();
        }, self );

        ko.postbox.subscribe( Events.system.events.FormCommands.DependentForm, data => {
            self.AddDependentControl();
        }, self );

    }

    activate() {
        return this.databind();
    }
    canActivate() {
        return Q.resolve( true );
    }
    canDeActivate() {
        console.log( "CAN DEACTIVEATE" );
        return Q.resolve( true );
    }
    deactivate( parms?: any ) {
        return Q.resolve( true );
    }
    compositionComplete() {
        var self = this;
        self.appContext.resetViewPort();
    }
    databind() {
        var self = this;
        self.title = ko.observable( "Form Manager" );
        return Q.resolve( true );
    }
    onUpdateClick( data, event ) {
        var self = this;
        var isNew = self.buttonLabel() === "Save";
    }

    AddBlankControl() {
        var self = this;
        self.pageControl( self.blankForm );
    }
    AddDependentControl() {
        var self = this;
        self.dependentForm = new DependentForm();
        self.pageControl( self.dependentForm );
    }

    formButton_cancel_ModalWindow( data, event ) {
        $(".modal-content").addClass("m-hide");
        $( "#modalFrmManager4" ).closeModal();
        $( "#modalFrmManager4" ).css( "display", "none" );
    }

    formButton_next__CommandButton( data, event ) {
        var self = this;
       self.dependentForm.validateDependentInfo();
    }
    formButton_update__CommandButton( data, event ) {
        var self = this;
    }
    formButton_cancel_DetailCommand(data,event) {
        var self = this;
    }
    formButton_insert__DeaitlCommandButton( data, event ) {
        var self = this;
        
    }
    myPostProcessingLogic( element, index, data ) {
        console.log( element, index, data );
    }
}

export = DefaultManager4;  