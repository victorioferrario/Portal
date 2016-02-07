//dataLists
import ko = require("knockout");
import AppModule = require("durandal/app");
import IViewModel = require("core/IViewModel");
import ViewModel = require("core/ViewModel");
//componentes.clinical.IHealthRecords
import LG = require("models/clinical/HealthRecords");
import HelperClinical = require("components/clinical/IHealthRecords");
import Env = require("system/events/EventCommand");
declare var Materialize;
class HistoryForm extends ViewModel {
    app: DurandalAppModule;
    vm: LG.models.clinical.HealthRecords.FamilyHistoryObservable;
    title: KnockoutObservable<string>;
    dataModel: HelperClinical.componentes.clinical.IHealthRecords.DataProvider;
    isShow: KnockoutObservable<boolean>;
    isLoading: KnockoutObservable<boolean>;
    isShowOnMedicalRecord: KnockoutComputed<boolean>;
    isInsert: KnockoutObservable<boolean>;
    constructor() {
        super();
        var self = this;
        self.app = AppModule;
        self.isInsert = ko.observable(false);
        self.isShow = ko.observable(true);
        self.isLoading = ko.observable(true);
        self.dataModel = self.appContext.appHealthHelper.optionsModel;
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
        $('select').material_select();
    }
    databind() {
        var self = this;
        self.title = ko.observable("Family History");
        return Q.resolve(true);
    }
    populateInsert() {
        var self = this;
        self.isInsert(true);
        
        self.vm = new LG.models.clinical.HealthRecords.FamilyHistoryObservable();
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
    populate(data: LG.models.clinical.HealthRecords.IFamilyHistory) {
        var self = this;
        self.isInsert(false);
        self.vm = new LG.models.clinical.HealthRecords.FamilyHistoryObservable(data);

        self.isShow(!self.vm.IsHidden());

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

    onAddNewItem() {
        var self = this;
        self.isLoading(true);
        var entity = new LG.models.clinical.HealthRecords.Inputs.FamilyCondition.FamilyConditionEntitiy();

        entity.RID = self.appContext.identityUser.instance.RolodexItemID;
        entity.ActionHelper.ClinicalType = LG.models.clinical.HealthRecords.Enums.Type.FamilyHistory;
        entity.ActionHelper.ClinicalAction = LG.models.clinical.HealthRecords.Enums.Action.Add;
        entity.InsertInput = ko.mapping.toJS(self.vm);
        entity.InsertInput.RID = entity.RID;
        console.log(entity);

        self.appContext.identityUser.service.routes.clinical.insertFamilyHistory(entity).fail(() => {
            Materialize.toast("Item was not update. Try again later.", 4000);
            self.isLoading(false);
        }).done(data => {
            Materialize.toast("Success, item was updated.", 4000);
            self.app.trigger(Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD);
            }).always(() => {
            self.isLoading(false);
            $("#modalFrmManager").closeModal();
            self.appContext.router.navigate("#dashboard");
        });
    }
    onUpdate(isNew?:boolean) {
        var self = this;

        if (isNew) {
            self.onAddNewItem();
        } else {
            self.isLoading(true);
            var entity = new LG.models.clinical.HealthRecords.Inputs.FamilyCondition.FamilyConditionEntitiy();
            entity.RID = self.vm.RID();
            entity.ActionHelper.ClinicalAction =
            LG.models.clinical.HealthRecords.Enums.Action.Update;
            entity.ActionHelper.ClinicalType =
            LG.models.clinical.HealthRecords.Enums.Type.FamilyHistory;

            entity.UpdateInput = ko.toJS(self.vm);
            self.appContext.identityUser.service.routes.clinical.updateFamilyHistory(entity).fail(() => {
                self.isLoading(false);
                Materialize.toast("Item was not update. Try again later.", 4000);
            }).done(data => {
                Materialize.toast("Success, item was updated.", 4000);
                self.app.trigger(Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD);
            }).always(() => {
                self.isLoading(false);
                $("#modalFrmManager").closeModal();
                self.appContext.router.navigate("#dashboard");
            });
            $("#modalFrmManager").closeModal();
        }
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
                        self.appContext.service.routes.clinical.autoCompleteAllergies(request.term).done(data => {
                            var ds = data.Results.map(element => {
                                return {
                                    label: element.AllergyText,
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

}
export = HistoryForm;
 

