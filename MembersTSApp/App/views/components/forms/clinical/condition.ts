import ko = require("knockout");
import AppModule = require("durandal/app");
import IViewModel = require("core/IViewModel");
import ViewModel = require("core/ViewModel");
import LG = require("models/clinical/HealthRecords");
import HelperClinical = require("components/clinical/IHealthRecords");
import Env = require("system/events/EventCommand");
declare var Materialize;
class ConditionForm extends ViewModel {
    app: DurandalAppModule;
    vm: LG.models.clinical.HealthRecords.ConditionObservable;

    hasData:KnockoutObservable<boolean>;
    title: KnockoutObservable<string>;
    isShow: KnockoutObservable<boolean>;
    isLoading: KnockoutObservable<boolean>;
    isShowOnMedicalRecord: KnockoutComputed<boolean>;
    isInsert: KnockoutObservable<boolean>;
    selectedItem: KnockoutObservable<any>;
    selectedItemValue: KnockoutObservable<any>;
    constructor() {
        super();
        var self = this;
        self.app = AppModule;
        self.hasData = ko.observable(false);
        self.isShow = ko.observable(true);
        self.isLoading = ko.observable(true);
        self.isInsert = ko.observable(false);
        self.selectedItem = ko.observable();
        self.selectedItemValue = ko.observable('');
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
    getFormat(arg: any) {
        var date = new Date(arg);
        return date.toLocaleDateString();
    } 
    getDateFormat(date: any): string {
        console.log(date);
        if (date !== null && date !== undefined) {
            console.log(date);
            return new Date(date).toLocaleDateString();
        } else {
            return new Date().toLocaleDateString();
        }
    }
    databind() {
        var self = this;
        self.title = ko.observable("Condition");
        return Q.resolve(true);
    }
    populate(data: LG.models.clinical.HealthRecords.ICondition) {
        var self = this;
        self.isInsert(false);
        self.vm = new LG.models.clinical.HealthRecords.ConditionObservable(data);
        self.hasData(true);
        self.isShow(!self.vm.IsHidden());
        self.isShowOnMedicalRecord = ko.computed(() => {
            if (self.isShow()) {
                self.vm.IsHidden(false);
            } else {
                self.vm.IsHidden(true);
            }
            return !self.vm.IsHidden();
        }, self);
        self.isLoading(false);
    }

    populateInsert() {
        var self = this;
        self.isInsert(true);
        self.hasData(true);
        self.vm = new LG.models.clinical.HealthRecords.ConditionObservable();
        self.vm.RID( self.appContext.identityUser.instance.RolodexItemID );
        self.initBindHandler();
        self.isShow(!self.vm.IsHidden());
        self.isInsert(true);
        self.isShowOnMedicalRecord
        = ko.computed(() => {
            if (self.isShow()) {
                self.vm.IsHidden(false);
            } else {
                self.vm.IsHidden(true);
            }
            return !self.vm.IsHidden();
        }, self);
        self.isLoading(false);
    }

    initBindHandler() {
        var self = this;
        ko.bindingHandlers.autoComplete = {
            init(element, valueAccessor, allBiindings, viewModel, bindingContext) {
                var settings = valueAccessor();
                var selectedItem = settings.selected;
                var updateElementValueWithLabel = (event, ui) => {
                    event.preventDefault();
                    $(element).val(ui.item.label);
                    if (typeof ui.item !== "undefined") { selectedItem(ui.item); }
                };
                $(element).autocomplete({
                    minLength: 3,
                    source(request, response) {
                        self.appContext.service.routes.clinical.autoCompleteConditions(request.term).done(data => {
                            var ds = data.Results.map(element => {
                                return {
                                    label: element.MedicalConditionText,
                                    value: element.ID,
                                    codevalue: element.CodeValue,
                                    object: element
                                }
                            });
                            response(ds);
                        });
                    },
                    select(event, ui) {
                        if (ui.item) {
                            updateElementValueWithLabel(event, ui);
                        }
                    },
                    focus(event, ui) {
                        console.log("focus");
                        if (ui.item) {
                            updateElementValueWithLabel(event, ui);
                        }
                    },
                    change(event, ui) {
                        if (ui.item) {
                            updateElementValueWithLabel(event, ui);
                        }
                    }
                });
            }
        };
    }

    onAddNewItem() {
            var self = this;
            self.isLoading(true);

            var entity = new LG.models.clinical.HealthRecords.Inputs.MedConditions.MedConditionEntity();
            entity.RID = self.appContext.identityUser.instance.RolodexItemID;
            entity.ActionHelper.ClinicalAction =

            LG.models.clinical.HealthRecords.Enums.Action.Add;
            entity.ActionHelper.ClinicalType =

            LG.models.clinical.HealthRecords.Enums.Type.Condition;
            entity.InsertInput = ko.mapping.toJS(self.vm);

            entity.InsertInput.RID
            = entity.RID;

            entity.InsertInput.MedicalConditionText
            = self.selectedItem().label;

            entity.InsertInput.MedicalConditionID
            = self.selectedItem().value;

        console.log(entity);
            self.appContext.identityUser.service.routes.clinical.insertCondition(entity).fail(() => {
                Materialize.toast("Item was not updated. Try again later.", 4000);
                self.isLoading(false);
            }).done(data => {
                self.isLoading(false);
                Materialize.toast("Success, item was updated.", 4000);
                self.app.trigger(
                    Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD);

                $("#modalFrmManager").closeModal();

                self.appContext.router.navigate("#dashboard");
            });
    }

    onUpdate(isNew?:boolean) {
        var self = this;
        self.isLoading(true);
        if (isNew) {
            self.onAddNewItem();
        } else {
            // Materialize.toast('Item was not update. Try again later.', 4000);
            var entity = new LG.models.clinical.HealthRecords.Inputs.MedConditions.MedConditionEntity();
            entity.RID = self.appContext.identityUser.instance.RolodexItemID;
            entity.ActionHelper.ClinicalAction =
                LG.models.clinical.HealthRecords.Enums.Action.Update;
            entity.ActionHelper.ClinicalType =
                LG.models.clinical.HealthRecords.Enums.Type.Condition;
            entity.UpdateInput = ko.toJS(self.vm);
            self.appContext.identityUser.service.routes.clinical.updateCondition(entity).fail(() => {
                Materialize.toast("Item was not update. Try again later.", 4000);
                self.isLoading(false);
            }).done(data => {
                Materialize.toast("Success, item was updated.", 4000);
                self.isLoading(false);
                self.app.trigger(
                    Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD);
                $("#modalFrmManager").closeModal();
                self.appContext.router.navigate("#dashboard");
            });
            $("#modalFrmManager").closeModal();
        }
    }

}

export = ConditionForm;
 

