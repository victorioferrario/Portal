//dataLists
import AppModule = require("durandal/app");
import ko = require("knockout");
import IViewModel = require("core/IViewModel");
import ViewModel = require("core/ViewModel");
//componentes.clinical.IHealthRecords
import LG = require("models/clinical/HealthRecords");
import HelperClinical = require("components/clinical/IHealthRecords");
import Env = require("system/events/EventCommand");
declare var Materialize;
class MedicationForm extends ViewModel {

    app: DurandalAppModule;
    vm: LG.models.clinical.HealthRecords.MedicationTakenObservable;

    hasData: KnockoutObservable<boolean>;

    title: KnockoutObservable<string>;
    dataModel: HelperClinical.componentes.clinical.IHealthRecords.DataProvider;
    isShow: KnockoutObservable<boolean>;
    isLoading: KnockoutObservable<boolean>;
    isSearchActive:KnockoutObservable<boolean>;
    isShowOnMedicalRecord: KnockoutComputed<boolean>;

    isInsert: KnockoutObservable<boolean>;
    selectedItem: KnockoutObservable<any>;
    selectedItemValue: KnockoutObservable<any>;

    constructor() {
        super();
        var self = this;
        self.app = AppModule;
        self.dataModel = self.appContext.appHealthHelper.optionsModel;
        self.isShow = ko.observable( true );
        self.hasData = ko.observable( false );
        self.isLoading = ko.observable( true );
        //
        self.isInsert = ko.observable(false);
        self.isSearchActive = ko.observable(false);
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
       $('select').material_select();
    }
    databind() {
        var self = this;
        self.title = ko.observable("Medication Taken");
        return Q.resolve(true);
    }
   
    populate(data: LG.models.clinical.HealthRecords.IMedicationTaken) {
        var self = this;
        self.isInsert(false);
        self.vm = new  LG.models.clinical.HealthRecords.MedicationTakenObservable(data);
        self.isShow(!self.vm.IsHidden());
        self.isShowOnMedicalRecord = ko.computed(() => {
            if (self.isShow()) {
                self.vm.IsHidden(false);
            } else {
                self.vm.IsHidden(true);
            }
            return !self.vm.IsHidden();
        }, self );
        self.hasData( true );
        self.isLoading(false);
    }

    populateInsert() {
        var self = this;
        self.isInsert(true);
        self.vm = new LG.models.clinical.HealthRecords.MedicationTakenObservable();
        self.initBindHandler();
        self.isShow(!self.vm.IsHidden());
        self.isShowOnMedicalRecord= ko.computed(() => {
            if (self.isShow()) {
                self.vm.IsHidden(false);
            } else {
                self.vm.IsHidden(true);
            }
            return !self.vm.IsHidden();
        }, self );
        self.hasData( true );
        self.isLoading( false );

    }
    getDateFormat(date: any): string {
        console.log(date());
        if (date() !== null && date() !== undefined) {
            console.log(date());
            return new Date(date()).toLocaleDateString();
        } else {
            return new Date().toLocaleDateString();
        }
    }

    onAddNewItem() {
        var self = this;
        self.isLoading(true);
        var entity = new LG.models.clinical.HealthRecords.Inputs.MedicationTaken.MedicationTakenEntitiy();
        entity.RID = self.appContext.identityUser.instance.RolodexItemID;
        entity.ClinicalAction =
        LG.models.clinical.HealthRecords.Enums.Action.Add;
        entity.ActionHelper.ClinicalAction =
        LG.models.clinical.HealthRecords.Enums.Action.Add;
        entity.InsertInput = ko.mapping.toJS(self.vm);
        entity.InsertInput.RID = entity.RID;
        entity.InsertInput.MedicationID = self.selectedItem().value;
        entity.InsertInput.MedicationName = self.selectedItem().label;

        self.appContext.identityUser.service.routes.clinical.insertMedicationTaken(entity).fail(() => {
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

    onUpdate(isNew?:boolean) {
        var self = this;
        if (isNew) {
            self.onAddNewItem();
        } else {
            self.isLoading(true);
            var entity = new LG.models.clinical.HealthRecords.Inputs.MedicationTaken.MedicationTakenEntitiy();
            entity.RID = self.vm.RID();
            entity.ClinicalAction = LG.models.clinical.HealthRecords.Enums.Action.Update;
            entity.ActionHelper.ClinicalAction = LG.models.clinical.HealthRecords.Enums.Action.Update;
            entity.UpdateInput = ko.mapping.toJS(self.vm);
            self.appContext.identityUser.service.routes.clinical.updateMedicationTaken(entity).fail(() => {
                Materialize.toast("Item was not update. Try again later.", 4000);
                self.isLoading(false);
            }).done(data => {
                console.log(data);
                Materialize.toast("Success, item was updated.", 4000);
                self.isLoading(false);
                self.app.trigger(
                    Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD);
                $("#modalFrmManager").closeModal();
                self.appContext.router.navigate("#dashboard");
            });
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
                        self.isSearchActive(true);
                        self.appContext.service.routes.clinical.autoCompleteMedication(request.term).done(data => {
                            const ds = data.Results.map(element => {
                                return {
                                    label: element.MedicationName,
                                    value: element.ID,
                                    codevalue: element.CodeValue,
                                    object: element
                                }
                            });
                            self.isSearchActive(false);
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
export = MedicationForm;