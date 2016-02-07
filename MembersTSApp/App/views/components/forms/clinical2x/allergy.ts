import ko = require( "knockout" );
import AppModule = require( "durandal/app" );
import IViewModel = require( "core/IViewModel" );
import ViewModel = require( "core/ViewModel" );
import LG = require( "models/clinical/HealthRecords" );
import HelperClinical = require( "components/clinical/IHealthRecords" );
import Env = require( "system/events/EventCommand" );
import Env2 = require( "system/events/ClinicalCommands" );
import sys = require( "system/utilities/ViewManager" );
import sysTools = require("system/utilities/Forms");
declare var Materialize;

class AllergyForm extends ViewModel {
    app: DurandalAppModule;

    vm: LG.models.clinical.HealthRecords.AllergyObservable;
    vmList: KnockoutObservableArray<LG.models.clinical.HealthRecords.AllergyObservable>;
    dataModel: HelperClinical.componentes.clinical.IHealthRecords.DataProvider;

    title: KnockoutObservable<string>;
    isShow: KnockoutObservable<boolean>;
    isLoading: KnockoutObservable<boolean>;
    isShowOnMedicalRecord: KnockoutComputed<boolean>;

    isInputFocused: KnockoutObservable<boolean>;
    isInputFocusedComputed: KnockoutComputed<boolean>;

    selectedItem: KnockoutObservable<any>;
    selectedItemValue: KnockoutObservable<any>;

    debugState: KnockoutObservable<string>;

    hasAddButtonsToSearch: KnockoutObservable<boolean>;
    hasDoneButtonsToSearch: KnockoutObservable<boolean>;

    isSearch: KnockoutObservable<boolean>;
    isNext: KnockoutObservable<boolean>;

    isInsert: KnockoutObservable<boolean>;
    isEdit: KnockoutObservable<boolean>;

    selectedItemList: KnockoutObservableArray<any>;

    constructor() {

        super();

        var self = this;
        self.app = AppModule;

        self.vmList = ko.observableArray( [] );
        self.vmList.removeAll();

        self.dataModel = self.appContext.appHealthHelper.optionsModel;

        self.isShow = ko.observable( true );
        self.isLoading = ko.observable( true );

        self.isSearch = ko.observable( true );

        self.isEdit = ko.observable(false);
        self.isInsert = ko.observable( false );

        self.selectedItem = ko.observable();
        self.selectedItemValue = ko.observable( "" );
        self.debugState = ko.observable( "empty" );

        self.isInputFocused = ko.observable( false );

        self.hasAddButtonsToSearch = ko.observable( false );
        self.hasDoneButtonsToSearch = ko.observable( false );

        self.selectedItemList = ko.observableArray();

        self.isInputFocusedComputed = ko.computed(() => {
            if ( self.selectedItem() !== null && self.selectedItem() !== undefined ) {
                self.hasAddButtonsToSearch( true );
            } else {
                self.hasAddButtonsToSearch( false );
            }
            if ( self.selectedItemList().length > 0 ) {
                self.hasDoneButtonsToSearch( true );
                self.appContext.appViewHealthRecords.buttonState(
                    Env.system.events.LayoutCommands.FormButtonsHR.SearchItems );
            } else if ( self.selectedItemList().length === 0 ) {
                self.hasDoneButtonsToSearch( false );
                self.appContext.appViewHealthRecords.buttonState(
                    Env.system.events.LayoutCommands.FormButtonsHR.Search );
            }
            if ( this.isInputFocused() ) {
                return true;
            } else {
                return false;
            }
        });

    }
    activate() {
        return this.databind();
    }
    canActivate() {
        return Q.resolve( true );
    }
    canDeActivate() {
        return Q.resolve( true );
    }
    getDate( a ): string {
        if ( a !== null && a !== undefined ) {
            var date = new Date( a ); return date.toLocaleDateString();
        } else {
            return "NA";
        }
    }
    compositionComplete() {
        var self = this;
        $( "#SearchText" ).keypress(event => {
            if ( event.keyCode === 13 ) {
                event.preventDefault();
                self.searchAdd(this,event, {});
            }
        });
        sysTools.utilities.Forms.InputMasks.maskDate(
            $( "#inputDateDetail" ) );
        sysTools.utilities.Forms.InputMasks.maskDate(
            $( "#inputDateUpdate" ) );
        self.appContext.resetViewPort();
    }
    databind() {
        var self = this;
        self.saveIndex = ko.observable( 0 );
        self.saveCount = ko.observable(0);
        self.title = ko.observable( "Allergy" );
        self.initBindHandler();
        return Q.resolve( true );
    }
    searchAdd( data, event, item ) {
        var self = this,
            k = ko.unwrap( self.selectedItem() ),
            tempVM = new LG.models.clinical.HealthRecords.AllergyObservable();
        tempVM.AllergyID (k.value);
        tempVM.AllergyText( k.label );
        self.vmList.push( tempVM );
        self.selectedItemList.push( k );
        self.selectedItem( null );
        self.selectedItemValue( "" );
    }
    searchDone( data, event, item ) {}
    populateInsert() {
        var self = this;
        self.vm = new LG.models.clinical.HealthRecords.AllergyObservable();
        self.vm.RID( self.appContext.identityUser.instance.RolodexItemID );
        self.isShow( !self.vm.IsHidden() );
        self.isInsert( true );
        self.isShowOnMedicalRecord
        = ko.computed(() => {
            if ( self.isShow() ) {
                self.vm.IsHidden( false );
            } else {
                self.vm.IsHidden( true );
            }
            return !self.vm.IsHidden();
        }, self );
        self.isLoading( false );
    }
    populate(
        data: LG.models.clinical.HealthRecords.IAllergy ) {
        var self = this;
        self.isEdit( true );
        self.isInsert( false );
        self.vm = new LG.models.clinical.HealthRecords.AllergyObservable( data );
        self.isShow( !self.vm.IsHidden() );
        self.isShowOnMedicalRecord
        = ko.computed(() => {
            if ( self.isShow() ) {
                self.vm.IsHidden( false );
            } else {
                self.vm.IsHidden( true );
            }
            return !self.vm.IsHidden();
        }, self );
        if(self.vm.Notes()!==null && self.vm.Notes()!== undefined){
            if ( self.vm.Notes().length>0 ) {
                self.showNotes2();
                setTimeout(() => {
                    $("#divNote2").removeClass("m-hide");
                    $("#divAddNote2").addClass("m-hide");
                }, 300);
            }
        }
        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.Search );
        self.isLoading( false );
    }

    populateSelectedAllergen() {
        var self = this,
            selected = new HelperClinical.componentes.clinical.IHealthRecords.Option(
                self.vm.AllergenText(), self.vm.AllergenID() );
        self.dataModel.allergenList.options.selectedValue( selected );
    }
    populateSelectedReaction() {
        var self = this,
            selected = new HelperClinical.componentes.clinical.IHealthRecords.Option(
                self.vm.ReactionText(), self.vm.ReactionID() );
        self.dataModel.reactionList.options.selectedValue( selected );
    }

    getFormat( arg: any ) {
        console.log( arg() );
        var date = new Date( arg );
        return date.toLocaleDateString();
    }
    getDateFormat( date: any ): string {
        console.log( date );
        if ( date !== null && date !== undefined ) {
            console.log( date );
            return  date ;
        } else {
            return new Date().toLocaleDateString();
        }
    }
    /**
     * Converted, to Edge.
     * @param vmItem 
     * @returns {} 
     */ 
    onAddNewItem(vmItem) {
        var self = this;
        self.isLoading( true );
        var entity =
            new LG.models.clinical.HealthRecords.Inputs.Allergies.AllergyEntity();
        try {
        entity.RID =
            self.appContext.identityUser.instance.RolodexItemID;

        entity.ClinicalAction =
            LG.models.clinical.HealthRecords.Enums.Action.Add;

        entity.ActionHelper.ClinicalAction =
            LG.models.clinical.HealthRecords.Enums.Action.Add;

        console.warn( vmItem );

        var dFO = new Date(vmItem.D_FirstObserved()),
            dC = new Date(vmItem.DTUTC_Created());

        entity.InsertInput = ko.mapping.toJS( vmItem );
        entity.InsertInput.D_FirstObserved = dFO.getUTCFullYear()
        + "-" + dFO.getUTCMonth()
        + "-" + dFO.getUTCDate()
        + "T00:00:00";
        
        entity.InsertInput.RID = entity.RID;

        self.appContext.identityUser.service.routes.clinical.insertAllergy( entity ).fail(() => {
            Materialize.toast( "Item was not update. Try again later.", 4000 );
        }).done( data => {
            Materialize.toast( "Success, item was updated.", 4000 );
            self.onAddNewItemCallBack();
           });
        } catch(ex) {
            
        }

    }

    saveIndex:KnockoutObservable<number> ;
    saveCount: KnockoutObservable<number>;


    onAddNewItemCallBack() {
        var self = this;
        self.saveIndex( self.saveIndex() + 1 );
        if (self.saveCount() === self.saveIndex()) {
            self.isLoading( false );
            ko.postbox.publish(Env2.system.events.Clinical.ADD_CONTROL_BLANK_EDGE);
            self.resetForm();
          if (self.removeFormManager()) {
            self.app.trigger( Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD );
            self.appContext.router.navigate( "#dashboard" );
          }
        }
    }
    onUpdate( isNew?: boolean ) {
        
        var self = this
        self.isLoading( true );
        if ( isNew ) {
        //    self.onAddNewItem();
        } else {
            var entity = new LG.models.clinical.HealthRecords.Inputs.Allergies.AllergyEntity();
            entity.RID = self.vm.RID();
            entity.ClinicalAction =
            LG.models.clinical.HealthRecords.Enums.Action.Update;
            entity.ActionHelper.ClinicalAction =
            LG.models.clinical.HealthRecords.Enums.Action.Update;

            console.log(ko.toJSON(self.vm));

            entity.UpdateInput
            = new LG.models.clinical.HealthRecords.Inputs.Allergies.AllergyUpdateInput(
                self.vm );


            self.appContext.identityUser.service.routes.clinical.updateAllergy( entity ).fail(() => {
                Materialize.toast( "Item was not update. Try again later.", 4000 );
                self.isLoading( false );
            }).done( data => {
                Materialize.toast( "Success, item was updated.", 4000 );
                self.isLoading( false );
                if ( self.removeFormManager() ) {
                    self.hasDoneButtonsToSearch( false );
                    self.app.trigger( Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD );
                    self.appContext.router.navigate( "#dashboard" );
                }
            });
            //console.log(self.vm.D_FirstObserved());
            // Materialize.toast('Item was not update. Try again later.', 4000);
            // $("#modalFrmManager").closeModal();
        }
    }

    removeTempItem( data, event, item ) {
        var self = this;
        self.vmList.remove( item );
        self.selectedItemList.remove( item );
        if (self.vmList.length === 0) {
            self.hasDoneButtonsToSearch( false );
            self.appContext.appViewHealthRecords.buttonState(
                Env.system.events.LayoutCommands.FormButtonsHR.Search );
        }
    }

    addDetailToTempItem( data, event, item ) {
        var self = this, k = ko.mapping.toJS( item );
        self.title( "Insert Details" );
        self.vm.Notes( item.Notes() );
        self.vm.ReactionID( item.ReactionID() );
        self.vm.AllergenID( item.AllergenID() );
        self.vm.D_FirstObserved( item.D_FirstObserved() );
        self.vm.AllergyText( item.AllergyText() );
        self.vm.AllergyID( item.AllergyID() );
        self.isSearch( false );
  
        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.Details );
    }
    do_insert__DetailCommand( data, event ) {
        var self = this;
        self.isSearch( true );
        self.title( "Add Allergies" );
        ko.utils.arrayForEach( self.vmList(), item => {
            if ( item.AllergyText() === self.vm.AllergyText() ) {
                var t: LG.models.clinical.HealthRecords.Inputs.Allergies.IAllergyInput = ko.mapping.toJS(self.vm);
                item.AllergenID( t.AllergenID );
                item.AllergenText( t.AllergenText );
                item.D_FirstObserved( t.D_FirstObserved.toString() );
                item.IsStandardized( true );
                item.IsHidden( false );
                item.ReactionID(t.ReactionID);
                item.Notes(t.Notes);
            }
        });

        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.SearchItems );
    }
    resetForm() {
        var self = this;
        self.title( "Add Allergies" );
        self.vmList.removeAll();
        self.isSearch(true);
        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.Search );
    }
    next__CommandButton( data, event ) {
        var self = this;
        self.isSearch( true );
        self.saveIndex( 0 );
        self.saveCount( self.vmList().length );
        ko.utils.arrayForEach( self.vmList(), item => {
            self.onAddNewItem( item );
        });
    }
    update__CommandButton( data, event ) {
        var self = this;
        self.onUpdate( false );
    }
    cancel_insert__DetailCommand( data, event ) {
        var self = this;
        self.isSearch( true );
        self.title( "Add Allergies" );
        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.SearchItems );
    }
    initBindHandler() {
        var self = this;
        ko.bindingHandlers.autoComplete = {
            init( element, valueAccessor, allBiindings, viewModel, bindingContext ) {
                var settings = valueAccessor(),
                    selectedItem = settings.selected,
                    updateElementValueWithLabel = ( event, ui ) => {
                        event.preventDefault();
                        $( element ).val( ui.item.label );
                        if ( typeof ui.item !== "undefined" ) { selectedItem( ui.item ); }
                    };
                $( element ).autocomplete( {
                    minLength: 3,
                    source( request, response ) {
                        self.appContext.service.routes.clinical.autoCompleteAllergies( request.term ).done( data => {

                            var ds = data.Results.map( element => {
                                return {
                                    label: element.AllergyText,
                                    value: element.ID,
                                    codevalue: element.CodeValue,
                                    object: element
                                }
                            });
                            response( ds );
                        });
                    },
                    select( event, ui ) {
                        if ( ui.item ) {
                            updateElementValueWithLabel( event, ui );
                        }
                    },
                    focus( event, ui ) {
                        console.log( "focus" );
                        if ( ui.item ) {
                            updateElementValueWithLabel( event, ui );
                        }
                    },
                    change( event, ui ) {
                        if ( ui.item ) {
                            updateElementValueWithLabel( event, ui );
                        }
                    }
                });
            }
        };
    }
}
export = AllergyForm;
 

