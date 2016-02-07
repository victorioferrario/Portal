/// <reference path="../../../../scripts/typings/knockout.postbox/knockout-postbox.d.ts" />
import ko = require("knockout");
import AppModule = require("durandal/app");
import activator =require("durandal/activator");
import IViewModel = require("core/IViewModel");
import ViewModel = require("core/ViewModel");
import AllergyForm = require("views/components/forms/clinical/allergy");
import ConditionForm = require("views/components/forms/clinical/condition");
import HistoryForm = require("views/components/forms/clinical/history");
import MedicationForm = require("views/components/forms/clinical/medication");
import Env = require("system/events/ClinicalCommands");
class DefaultManager extends ViewModel {

        allergyForm: AllergyForm;
        historyForm: HistoryForm;
        conditionForm: ConditionForm;
        medicationForm: MedicationForm;
        buttonLabel:KnockoutObservable<string>;
        app: DurandalAppModule;
        title: KnockoutObservable<string>;
        pageControl:KnockoutObservable<any>;
        frmControl: KnockoutObservable<any>;
        currentInstance: KnockoutObservable<any>;
        action:KnockoutObservable<any>;

        constructor() {
            super();

            var self = this;
            
            self.app = AppModule;
            self.currentInstance = ko.observable();
            self.buttonLabel = ko.observable("Update");
            self.allergyForm = new AllergyForm();
            self.historyForm = new HistoryForm();
            self.conditionForm = new ConditionForm();
            self.medicationForm = new MedicationForm();

            self.pageControl = ko.observable();

            ko.postbox.subscribe(Env.system.events.Clinical.ADD_CONTROL, data => {
                self.AddFormControl(data);
            }, this);

            ko.postbox.subscribe(Env.system.events.Clinical.ADD_INSERT_CONTROL, data => {
                self.AddInsertFormControl(data);
            }, this);


        }
        activate() {
            return this.databind();
        }
        canActivate() {
            return Q.resolve(true);
        }
        canDeActivate() {
            console.log("CAN DEACTIVEATE");
            return Q.resolve(true);
        }
        compositionComplete() {
            var self = this;
            self.appContext.resetViewPort();
        }
        databind() {
            var self = this;
            self.title = ko.observable("Form Manager");
            return Q.resolve(true);
        }
        cleanUpModal() {
            if ($("#modalFrmManager").hasClass("largest")) {
                $("#modalFrmManager").removeClass("largest");
            }
        }
        AddFormControl(data) {
            console.log("command", this, data);

            var self = this;
            self.buttonLabel("Update");
            switch(data.Action) {
                case Env.system.events.Clinical.FORM_ALLERGY:
                    self.allergyForm.populate(data.Data);
                    self.pageControl(self.allergyForm);
                    self.currentInstance(data.Action);
                    self.cleanUpModal();
                    break;
                case Env.system.events.Clinical.FORM_CONDITIONS:
                    console.log(data.Data);
                    self.conditionForm.populate(data.Data);
                    self.pageControl(self.conditionForm);
                    self.currentInstance(data.Action);
                    self.cleanUpModal();
                    break;
                case Env.system.events.Clinical.FORM_HISTORY:
                    self.historyForm.populate(data.Data);
                    self.pageControl(self.historyForm);
                    self.currentInstance(data.Action);
                    self.cleanUpModal();
                    break;
                case Env.system.events.Clinical.FORM_MEDICATIONS:
                    self.medicationForm.populate(data.Data);
                    self.pageControl(self.medicationForm);
                    self.currentInstance(data.Action);
                    if (!$("#modalFrmManager").hasClass("larger")) {
                        $("#modalFrmManager").addClass("larger");
                    }
                    break;
            }
        }
        AddInsertFormControl(data) {
            console.log("command", this, data);
            var self = this;
            self.buttonLabel("Save");
            switch (data.Action) {
                case Env.system.events.Clinical.FORM_ALLERGY:
                    self.allergyForm.populateInsert();
                    self.allergyForm.isInsert(true);
                    self.pageControl(self.allergyForm);
                    self.currentInstance(data.Action);
                    self.cleanUpModal();
                    break;
                case Env.system.events.Clinical.FORM_CONDITIONS:
                    self.conditionForm.populateInsert();
                    self.pageControl(self.conditionForm);
                    self.currentInstance(data.Action);
                    self.cleanUpModal();
                    break;
                case Env.system.events.Clinical.FORM_HISTORY:
                  self.historyForm.populateInsert();
                    self.pageControl(self.historyForm);
                    self.currentInstance(data.Action);
                    self.cleanUpModal();
                    break;
                case Env.system.events.Clinical.FORM_MEDICATIONS:
                    self.medicationForm.populateInsert();
                    self.pageControl(self.medicationForm);
                    self.currentInstance(data.Action);
                    if (!$("#modalFrmManager").hasClass("largest")) {
                        $("#modalFrmManager").addClass("largest");
                    }
                    break;
            }
        }
        onUpdateClick(data, event) {
            var self = this;
            var isNew = self.buttonLabel() === "Save";
            switch(self.currentInstance()) {
                case Env.system.events.Clinical.FORM_ALLERGY:
                    self.allergyForm.onUpdate(isNew);
                    break;
                case Env.system.events.Clinical.FORM_CONDITIONS:
                    self.conditionForm.onUpdate(isNew);
                    break;
                case Env.system.events.Clinical.FORM_HISTORY:
                    self.historyForm.onUpdate(isNew);
                    break;
                case Env.system.events.Clinical.FORM_MEDICATIONS:
                    self.medicationForm.onUpdate(isNew);
                    break;
            }
        }
    }

export = DefaultManager;  