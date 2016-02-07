import ko = require("knockout");
import AppModule = require("durandal/app");
import IViewModel = require("core/IViewModel");
import ViewModel = require("core/ViewModel");
import LG = require("models/clinical/HealthRecords");
import HelperClinical = require("components/clinical/IHealthRecords");
import Env = require("system/events/EventCommand");
declare var Materialize;
class Form extends ViewModel {
    app: DurandalAppModule;
    vm: LG.models.clinical.HealthRecords.AllergyObservable;
    dataModel: HelperClinical.componentes.clinical.IHealthRecords.DataProvider;
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
        self.dataModel = self.appContext.appHealthHelper.optionsModel;
        self.isShow = ko.observable(true);
        self.isLoading = ko.observable(true);
        self.isInsert = ko.observable(false);
        self.selectedItem = ko.observable();
        self.selectedItemValue = ko.observable("");
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
        console.log("compositionComplete");
        $('select').material_select();
        self.appContext.resetViewPort();
    }
    databind() {
        var self = this;
        self.title = ko.observable("Allergy");
        return Q.resolve(true);
    }
    populateInsert() {
        var self = this;
        self.vm = new LG.models.clinical.HealthRecords.AllergyObservable();
        self.vm.RID (self.appContext.identityUser.instance.RolodexItemID);
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
    populate(data: LG.models.clinical.HealthRecords.IAllergy) {
        var self = this;
        console.log("populate");
        self.isInsert(false);
        self.vm = new LG.models.clinical.HealthRecords.AllergyObservable(data);
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
    populateSelectedAllergen() {
        var self = this;
        const selected = new HelperClinical.componentes.clinical.IHealthRecords.Option(
            self.vm.AllergenText(), self.vm.AllergenID());
        self.dataModel.allergenList.options.selectedValue(selected);
        console.log(self.dataModel.allergenList.options.selectedValue());
    }
    populateSelectedReaction() {
        var self = this;
        const selected = new HelperClinical.componentes.clinical.IHealthRecords.Option(
            self.vm.ReactionText(), self.vm.ReactionID());
        self.dataModel.reactionList.options.selectedValue(selected);
    }

    getFormat(arg: any) {
        console.log(arg());
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

    onAddNewItem() {
        var self = this;
        self.isLoading(true);
        var entity = new LG.models.clinical.HealthRecords.Inputs.Allergies.AllergyEntity();
        entity.RID = self.appContext.identityUser.RID;
        entity.ClinicalAction =
        LG.models.clinical.HealthRecords.Enums.Action.Add;
        entity.ActionHelper.ClinicalAction =
        LG.models.clinical.HealthRecords.Enums.Action.Add;
        entity.InsertInput = ko.mapping.toJS(self.vm);
        entity.InsertInput.RID = entity.RID;
        entity.InsertInput.AllergyID = self.selectedItem().value;
        entity.InsertInput.AllergyText = self.selectedItem().label;
        
        console.log(entity);

        self.appContext.identityUser.service.routes.clinical.insertAllergy(entity).fail(() => {
            Materialize.toast("Item was not update. Try again later.", 4000);
            self.isLoading(false);
        }).done(data => {
            console.log(data);
            Materialize.toast("Success, item was updated.", 4000);
            self.isLoading(false);
            self.app.trigger(Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD);
            $("#modalFrmManager").closeModal();
            self.appContext.router.navigate("#dashboard");
        });
    }

    onUpdate(isNew?: boolean) {
        var self = this;
        self.isLoading(true);
        if (isNew) {
            self.onAddNewItem();
        } else {
            var entity = new LG.models.clinical.HealthRecords.Inputs.Allergies.AllergyEntity();
            entity.RID = self.vm.RID();
            entity.ClinicalAction =
            LG.models.clinical.HealthRecords.Enums.Action.Update;
            entity.ActionHelper.ClinicalAction =
            LG.models.clinical.HealthRecords.Enums.Action.Update;
            entity.UpdateInput
            = new LG.models.clinical.HealthRecords.Inputs.Allergies.AllergyUpdateInput(self.vm);
            self.appContext.identityUser.service.routes.clinical.updateAllergy(entity).fail(() => {
                Materialize.toast("Item was not update. Try again later.", 4000);
                self.isLoading(false);
            }).done(data => {
                console.log(data);
                Materialize.toast("Success, item was updated.", 4000);
                self.isLoading(false);
                self.app.trigger(Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD);
                $("#modalFrmManager").closeModal();
                self.appContext.router.navigate("#dashboard");
            });
            //console.log(self.vm.D_FirstObserved());
            // Materialize.toast('Item was not update. Try again later.', 4000);
            // $("#modalFrmManager").closeModal();
        }
    }

    initBindHandler() {
        var self = this;
        ko.bindingHandlers.autoComplete = {
            init(element, valueAccessor, allBiindings, viewModel, bindingContext) {
                const settings = valueAccessor();
                const selectedItem = settings.selected;
                const updateElementValueWithLabel = (event, ui) => {
                    event.preventDefault();
                    $(element).val(ui.item.label);
                    if (typeof ui.item !== "undefined") { selectedItem(ui.item); }
                };
                $(element).autocomplete({
                    minLength: 3,
                    source(request, response) {
                        self.appContext.service.routes.clinical.autoCompleteAllergies(request.term).done(data => {
                            const ds = data.Results.map(element => {
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
export = Form;
 

