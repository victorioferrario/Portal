/// <reference path="../../../../scripts/typings/knockout.postbox/knockout-postbox.d.ts" />
import ko = require( "knockout" );
import AppModule = require( "durandal/app" );
import activator = require( "durandal/activator" );
import IViewModel = require( "core/IViewModel" );
import ViewModel = require( "core/ViewModel" );
import BlankForm = require( "views/components/forms/clinical2x/blank" );
import AllergyForm = require( "views/components/forms/clinical2x/allergy" );
import ConditionForm = require( "views/components/forms/clinical2x/condition" );
import HistoryForm = require( "views/components/forms/clinical2x/history" );
import MedicationForm = require( "views/components/forms/clinical2x/medication" );
import Env = require( "system/events/ClinicalCommands" );
import Events = require( "system/events/EventCommand" );
import Sys = require( "system/utilities/ViewManager" );
import Data = require("../../../models/consults/data");
class DefaultManager2 extends ViewModel {
   // viewManager: Sys.utilities.Components.Views.IManager;
    // forms    
    blankForm: BlankForm;
    allergyForm: AllergyForm;
    historyForm: HistoryForm;
    conditionForm: ConditionForm;
    medicationForm: MedicationForm;
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
        self.appContext.appViewHealthRecords = new Sys.utilities.Components.Views.Manager();

        self.currentInstance = ko.observable();

        self.buttonLabel = ko.observable("Update");

        // Init Forms

        self.blankForm = new BlankForm();
        self.allergyForm = new AllergyForm();
        self.historyForm = new HistoryForm();
        self.conditionForm = new ConditionForm();
        self.medicationForm = new MedicationForm();

        self.pageControl = ko.observable();

        ko.postbox.subscribe(Env.system.events.Clinical.ADD_CONTROL_BLANK_EDGE, data => {
            self.AddBlankControl();
        }, self);

        ko.postbox.subscribe(Env.system.events.Clinical.ADD_CONTROL_EDGE, data => {
            self.AddFormControl(data);
        }, self);

        ko.postbox.subscribe(Env.system.events.Clinical.ADD_INSERT_CONTROL_EDGE, data => {
            self.AddInsertFormControl(data);
        }, self);


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
        self.appContext.appViewHealthRecords = new Sys.utilities.Components.Views.Manager();
    }
    databind() {
        var self = this;
        self.title = ko.observable( "Form Manager" );
        return Q.resolve( true );
    }
    AddFormControl( data ) {
        var self = this;
        self.buttonLabel( "Update" );
        self.currentInstance( data.Action );
        switch ( data.Action ) {
            case Env.system.events.Clinical.FORM_ALLERGY:
                self.allergyForm.populate( data.Data );
                self.pageControl( self.allergyForm );
                break;
            case Env.system.events.Clinical.FORM_CONDITIONS:
                self.conditionForm.populate( data.Data );
                self.pageControl( self.conditionForm );
                break;
            case Env.system.events.Clinical.FORM_HISTORY:
                self.historyForm.populate( data.Data );
                self.pageControl( self.historyForm );
                break;
            case Env.system.events.Clinical.FORM_MEDICATIONS:
                self.medicationForm.populate( data.Data );
                self.pageControl( self.medicationForm );
                break;
        }
        self.appContext.appViewHealthRecords.buttonState(
            Events.system.events.LayoutCommands.FormButtonsHR.Update );
    }
    AddInsertFormControl( data ) {
        var self = this;
        self.buttonLabel( "Save" );
        self.currentInstance( data.Action );
        switch ( data.Action ) {
            case Env.system.events.Clinical.FORM_ALLERGY:
                self.allergyForm.populateInsert();
                self.allergyForm.isEdit( false );
                self.allergyForm.isInsert( true );
                self.allergyForm.isSearch( true );
                self.pageControl( self.allergyForm );
                break;
            case Env.system.events.Clinical.FORM_CONDITIONS:
                self.conditionForm.populateInsert();
                self.conditionForm.isEdit( false );
                self.conditionForm.isInsert( true );
                self.conditionForm.isSearch( true );
                self.pageControl( self.conditionForm );
                break;
            case Env.system.events.Clinical.FORM_HISTORY:
                self.historyForm.populateInsert();
                self.historyForm.isInsert( true );
                self.historyForm.isEdit( false );
                self.pageControl( self.historyForm );
                break;
            case Env.system.events.Clinical.FORM_MEDICATIONS:
                self.medicationForm.populateInsert();
                self.medicationForm.isSearch(true);
                self.medicationForm.isEdit( false );
                self.medicationForm.isInsert( true );
                self.addLarge();
                self.pageControl( self.medicationForm );
                break;
        }
        if ( data.Action !== Env.system.events.Clinical.FORM_HISTORY){
        self.appContext.appViewHealthRecords.buttonState(
                Events.system.events.LayoutCommands.FormButtonsHR.Search );
        }
    }
    addLarge() {
        if (!$("#modalFrmManager2").addClass("large")) {
            $( "#modalFrmManager2" ).addClass( "large" );
        }
    }
    onUpdateClick( data, event ) {
        var self = this;
        var isNew = self.buttonLabel() === "Save";
        switch ( self.currentInstance() ) {
            case Env.system.events.Clinical.FORM_ALLERGY:
                self.allergyForm.onUpdate( isNew );
                break;
            case Env.system.events.Clinical.FORM_CONDITIONS:
                self.conditionForm.onUpdate( isNew );
                break;
            case Env.system.events.Clinical.FORM_HISTORY:
                self.historyForm.onUpdate( isNew );
                break;
            case Env.system.events.Clinical.FORM_MEDICATIONS:
                self.medicationForm.onUpdate( isNew );
                break;
        }
    }

    AddBlankControl() {
        var self = this;
        self.pageControl( self.blankForm );
        console.log("called insert blank")
    }

    formButton_cancel_ModalWindow( data, event ) {


        ko.postbox.publish(
            Env.system.events.Clinical.ADD_CONTROL_BLANK_EDGE, null );

        $(".modal-content").addClass("m-hide");
        $( "#modalFrmManager2" ).closeModal();
        $( "#modalFrmManager2" ).css( "display", "none" );
        

    }

    formButton_next__CommandButton( data, event ) {
        var self = this;
        switch ( self.currentInstance() ) {
            case Env.system.events.Clinical.FORM_ALLERGY:
                self.allergyForm.next__CommandButton( data, event );
                break;
            case Env.system.events.Clinical.FORM_CONDITIONS:
                self.conditionForm.next__CommandButton( data, event );
                break;
            case Env.system.events.Clinical.FORM_HISTORY:
                self.historyForm.next__CommandButton( data, event );
                break;
            case Env.system.events.Clinical.FORM_MEDICATIONS:
              self.medicationForm.next__CommandButton( data, event );
                break;
        }
    }
    formButton_update__CommandButton( data, event ) {
        var self = this;
        switch ( self.currentInstance() ) {
            case Env.system.events.Clinical.FORM_ALLERGY:
                self.allergyForm.update__CommandButton( data, event );
                break;
            case Env.system.events.Clinical.FORM_CONDITIONS:
                self.conditionForm.update__CommandButton( data, event );
                break;
            case Env.system.events.Clinical.FORM_HISTORY:
                self.historyForm.update__CommandButton( data, event );
                break;
            case Env.system.events.Clinical.FORM_MEDICATIONS:
                self.medicationForm.update__CommandButton( data, event );
                break;
        }
    }
    formButton_cancel_DetailCommand(data,event) {
        var self = this;
        switch ( self.currentInstance() ) {
            case Env.system.events.Clinical.FORM_ALLERGY:
                self.allergyForm.cancel_insert__DetailCommand( data, event );
                break;
            case Env.system.events.Clinical.FORM_CONDITIONS:
                self.conditionForm.cancel_insert__DetailCommand( data, event );
                break;
            case Env.system.events.Clinical.FORM_HISTORY:
                self.historyForm.cancel_insert__DetailCommand( data, event );
                break;
            case Env.system.events.Clinical.FORM_MEDICATIONS:
                self.medicationForm.cancel_insert__DetailCommand( data, event );
                break;
        }
    }
    formButton_insert__DeaitlCommandButton( data, event ) {
        var self = this;
        switch (self.currentInstance()) {
        case Env.system.events.Clinical.FORM_ALLERGY:
            self.allergyForm.do_insert__DetailCommand(data, event);
            break;
        case Env.system.events.Clinical.FORM_CONDITIONS:
            self.conditionForm.do_insert__DetailCommand(data, event);
            break;
        case Env.system.events.Clinical.FORM_HISTORY:
            self.historyForm.do_insert__DetailCommand( data, event );
            break;
        case Env.system.events.Clinical.FORM_MEDICATIONS:
                self.medicationForm.do_insert__DetailCommand( data, event );
            break;
        }
    }

}

export = DefaultManager2;  