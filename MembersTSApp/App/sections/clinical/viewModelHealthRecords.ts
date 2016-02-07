import lg = require("models/clinical/HealthRecords");
import AppContext = require("core/AppContext");
import IAppContext = require( "core/IAppContext" );

export class ViewModelHealthRecords {
    appContext: IAppContext;
    __rows: KnockoutObservableArray<any>;
    listAllergies: KnockoutObservableArray<lg.models.clinical.HealthRecords.IAllergy>;

    computedlistAllergies: KnockoutComputed<any>;

    listConditions: KnockoutObservableArray<lg.models.clinical.HealthRecords.ICondition>;
    listFamilyHistory: KnockoutObservableArray<lg.models.clinical.HealthRecords.IFamilyHistory>;
    listMedicationTaken: KnockoutObservableArray<lg.models.clinical.HealthRecords.IMedicationTaken>;
    listVitals: KnockoutObservableArray<lg.models.clinical.HealthRecords.IVital>;

    isViewingHidden:KnockoutObservable<boolean>;

    constructor(ctx: IAppContext) {
        var self = this;
        self.appContext = ctx;
        self.isViewingHidden = ko.observable(false);
    }

    rows: any;

    databind() {
        var self = this;
        ko.observableArray.fn.sortByProperty = function ( prop ) {
            this.sort( (obj1, obj2) => {
                if ( obj1[prop] === obj2[prop] )
                    return 0;
                else if ( obj1[prop] < obj2[prop] )
                    return -1;
                else
                    return 1;
            });
        }
        if (self.appContext.identityHealthRecords === null || self.appContext.identityHealthRecords === undefined) {
            self.appContext.router.navigate("#dashboard");
        } else {
        self.__rows
            = ko.observableArray();
        ///@type: Allergies
        self.listAllergies = ko.observableArray(
            self.appContext.identityHealthRecords.instance.Allergies );

        self.listAllergies.sortByProperty(
            "AllergyText" );

        self.computedlistAllergies = ko.computed(() => {
            if (!self.isViewingHidden()) {
                self.__rows.removeAll();
                ko.utils.arrayForEach(self.listAllergies(), (item: any) => {
                    if (!item.IsHidden) {
                        self.__rows.push(item);
                    }
                });
            } else {
                self.__rows.removeAll();
                ko.utils.arrayForEach(self.listAllergies(), (item: any) => {
                        self.__rows.push(item);
                });
            }
            return self.__rows;
        });

        ///@type: Conditions
        self.listConditions = ko.observableArray(
            self.appContext.identityHealthRecords.instance.Conditions );

        self.listConditions.sortByProperty(
            "MedicalConditionText" );
      
        ///@type: Allergies
        self.listFamilyHistory
            = ko.observableArray(
            self.appContext.identityHealthRecords.instance.FamilyHistory );

        self.listFamilyHistory.sortByProperty(
            "FamilyHistoryConditionName" );

        self.listMedicationTaken
            = ko.observableArray(
            self.appContext.identityHealthRecords.instance.MedicationTaken );

        self.listMedicationTaken.sortByProperty(
            "MedicationName" );
        self.listVitals
            = ko.observableArray(
            self.appContext.identityHealthRecords.instance.Vitals);

        }
        return true;
    }

   
}

