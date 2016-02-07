//dataLists
import AppModule = require( "durandal/app" );
import ko = require( "knockout" );
import IViewModel = require( "core/IViewModel" );
import ViewModel = require( "core/ViewModel" );
//componentes.clinical.IHealthRecords
import LG = require( "models/clinical/HealthRecords" );
import HelperClinical = require( "components/clinical/IHealthRecords" );
import Env = require( "system/events/EventCommand" );
declare var Materialize;
import sysTools = require( "system/utilities/Forms" );
class MedicationForm extends ViewModel {

    app: DurandalAppModule;
    vm: LG.models.clinical.HealthRecords.MedicationTakenObservable;
    vmList: KnockoutObservableArray<LG.models.clinical.HealthRecords.MedicationTakenObservable>;
    hasData: KnockoutObservable<boolean>;
    hasDoneButtonsToSearch: KnockoutObservable<boolean>;
    isInputFocused: KnockoutObservable<boolean>;
    isInputFocusedComputed: KnockoutComputed<boolean>;
    hasAddButtonsToSearch: KnockoutObservable<boolean>;
    isSearch: KnockoutObservable<boolean>;
    isNext: KnockoutObservable<boolean>;
    isValidate: KnockoutObservable<boolean>;
    isInsert: KnockoutObservable<boolean>;
    isEdit: KnockoutObservable<boolean>;

    title: KnockoutObservable<string>;
    dataModel: HelperClinical.componentes.clinical.IHealthRecords.DataProvider;
    isShow: KnockoutObservable<boolean>;
    isLoading: KnockoutObservable<boolean>;
    isSearchActive: KnockoutObservable<boolean>;
    isShowOnMedicalRecord: KnockoutComputed<boolean>;

    saveIndex: KnockoutObservable<number>;
    saveCount: KnockoutObservable<number>;

    selectedItem: KnockoutObservable<any>;
    selectedItemValue: KnockoutObservable<any>;
    selectedItemList: KnockoutObservableArray<any>;

    constructor() {
        super();
        var self = this;
        self.app = AppModule;
        self.dataModel = self.appContext.appHealthHelper.optionsModel;
        self.isShow = ko.observable( true );
        self.hasData = ko.observable( false );
        self.isLoading = ko.observable( true );
        //
        self.vmList = ko.observableArray( [] );
        self.vmList.removeAll();

        self.isSearch = ko.observable( true );

        self.isEdit = ko.observable( false );
        self.isInsert = ko.observable( false );

        self.isSearchActive = ko.observable( false );
        self.selectedItem = ko.observable();
        self.selectedItemValue = ko.observable( '' );

        self.isInputFocused = ko.observable( false );

        self.isValidate = ko.observable( false );

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
                $( "#nextCommandButton" ).removeClass( "m-hide" );

                $( ".tooltipped" ).tooltip( { delay: 50 });

            }

            if ( this.isInputFocused() ) {

                var newWidth = Math.floor( $( "#SearchText" ).width() );
                //$( ".ui-autocomplete" ).width(
                //    newWidth );
                //$( ".ui-autocomplete" ).css( "width", newWidth + "px!important;" );
                //$( ".ui-menu-item" ).width(
                //    newWidth );
                //$( ".ui-menu-item" ).css( "width", newWidth + "px!important;" );
                console.warn( newWidth );
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
        console.log( "CAN DEACTIVEATE" );
        return Q.resolve( true );
    }
    compositionComplete() {
        var self = this;
        self.appContext.resetViewPort();
        $( "#SearchText" ).keypress( event => {
            if ( event.keyCode === 13 ) {
                event.preventDefault();
                self.searchAdd( this, event, {});
            }
        });
        sysTools.utilities.Forms.InputMasks.maskDate(
            $( "#inputStartDate" ) );
        sysTools.utilities.Forms.InputMasks.maskDate(
            $( "#inputInsertDateEnd" ) );

        sysTools.utilities.Forms.InputMasks.maskDate(
            $( "#inputStartDate2" ) );
        sysTools.utilities.Forms.InputMasks.maskDate(
            $( "#inputEndDate2" ) );
    }
    databind() {
        var self = this;
        self.saveIndex = ko.observable( 0 );
        self.saveCount = ko.observable( 0 );
        self.title = ko.observable( "Medication Taken" );
        return Q.resolve( true );
    }
    populate( data: LG.models.clinical.HealthRecords.IMedicationTaken ) {
        var self = this;
        self.isInsert( false );
        self.isEdit(true);
        self.vm = new LG.models.clinical.HealthRecords.MedicationTakenObservable( data );
        self.isShow( !self.vm.IsHidden() );
        self.isShowOnMedicalRecord = ko.computed(() => {
            if ( self.isShow() ) {
                self.vm.IsHidden( false );
            } else {
                self.vm.IsHidden( true );
            }
            return !self.vm.IsHidden();
        }, self );
        self.hasData( true );
        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.Search );
        self.isLoading( false );
    }
    populateInsert() {
        var self = this;
        self.isInsert( true );
        self.vm = new LG.models.clinical.HealthRecords.MedicationTakenObservable();
        self.initBindHandler();
        self.isShow( !self.vm.IsHidden() );
        self.isShowOnMedicalRecord = ko.computed(() => {
            if ( self.isShow() ) {
                self.vm.IsHidden( false );
            } else {
                self.vm.IsHidden( true );
            }
            return !self.vm.IsHidden();
        }, self );
        self.hasData( true );
        self.isLoading( false );
    }

    getDateFormat( date: any ): string {
        console.log( date() );
        if ( date() !== null && date() !== undefined ) {
            console.log( date() );
            return new Date( date() ).toLocaleDateString();
        } else {
            return new Date().toLocaleDateString();
        }
    }
    onAddNewItem(itemVM) {
        var self = this;
        self.isLoading( true );
        var entity = new LG.models.clinical.HealthRecords.Inputs.MedicationTaken.MedicationTakenEntitiy();
        entity.RID = self.appContext.identityUser.instance.RolodexItemID;
        entity.ClinicalAction =
        LG.models.clinical.HealthRecords.Enums.Action.Add;
        entity.ActionHelper.ClinicalAction =
        LG.models.clinical.HealthRecords.Enums.Action.Add;
        entity.InsertInput = ko.mapping.toJS( itemVM);
        entity.InsertInput.RID = entity.RID;

        var dFO = new Date( itemVM.D_Start() ),
            dC = new Date( itemVM.D_End() );

        entity.InsertInput.D_Start = dFO.getUTCFullYear()
        + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dFO.getUTCMonth().toString() )
        + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dFO.getUTCDate().toString() )
        + "T12:00:00";

        entity.InsertInput.D_End = dC.getUTCFullYear()
        + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dC.getUTCMonth().toString() )
        + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dC.getUTCDate().toString() )
        + "T12:00:00";

        entity.InsertInput.MedicationID = itemVM.MedicationID();
        entity.InsertInput.MedicationName = itemVM.MedicationName();
        self.appContext.identityUser.service.routes.clinical.insertMedicationTaken( entity ).fail(() => {
            Materialize.toast( "Item was not update. Try again later.", 4000 );
            self.isLoading( false );
        }).done( data => {
            Materialize.toast( "Success, item was updated.", 4000 );
            self.onAddNewItemCallBack();
         
        });
    }
    onAddNewItemCallBack() {
        var self = this;
        self.saveIndex( self.saveIndex() + 1 );
        if ( self.saveCount() === self.saveIndex() ) {
            self.isLoading( false );
            self.resetForm();
            if ( self.removeFormManager() ) {
                self.hasDoneButtonsToSearch(false);
                self.app.trigger( Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD );
                self.appContext.router.navigate( "#dashboard" );
            }
        }
    }
    onUpdate( isNew?: boolean ) {
        var self = this;
        if ( isNew ) {
            self.onAddNewItem(self.vm);
        } else {
            self.isLoading( true );
            var entity = new LG.models.clinical.HealthRecords.Inputs.MedicationTaken.MedicationTakenEntitiy();
            entity.RID = self.vm.RID();
            entity.ClinicalAction = LG.models.clinical.HealthRecords.Enums.Action.Update;
            entity.ActionHelper.ClinicalAction = LG.models.clinical.HealthRecords.Enums.Action.Update;
            entity.UpdateInput = ko.mapping.toJS( self.vm );

            var dFO = new Date( self.vm.D_Start() ),
                dC = new Date( self.vm.D_End() );

            entity.UpdateInput.D_Start = dFO.getUTCFullYear()
            + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dFO.getUTCMonth().toString() )
            + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dFO.getUTCDate().toString() )
            + "T12:00:00";

            entity.UpdateInput.D_End = dC.getUTCFullYear()
            + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dC.getUTCMonth().toString() )
            + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dC.getUTCDate().toString() )
            + "T12:00:00";

            self.appContext.identityUser.service.routes.clinical.updateMedicationTaken( entity ).fail(() => {
                Materialize.toast( "Item was not update. Try again later.", 4000 );
                self.isLoading( false );
            }).done( data => {
                Materialize.toast( "Success, item was updated.", 4000 );
                self.isLoading( false );
                self.resetForm();
                if ( self.removeFormManager() ) {
                    self.hasDoneButtonsToSearch( false );
                    self.app.trigger( Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD );
                    self.appContext.router.navigate( "#dashboard" );
                }
            });
        }
    }
    searchAdd( data, event, item ) {
        var self = this,
            k = ko.unwrap( self.selectedItem() ),
            tempVM = new LG.models.clinical.HealthRecords.MedicationTakenObservable();

        tempVM.MedicationID( k.value );
        tempVM.MedicationName( k.label );

        self.vmList.push( tempVM );
        self.selectedItemList.push( k );

        self.selectedItem( null );
        self.selectedItemValue( "" );

    }
    getDate( a ): string {
        if ( a !== null && a !== undefined ) {
            var date = new Date( a ); return date.toLocaleDateString();
        } else {
            return "NA";
        }
    }
    removeTempItem( data, event, item ) {
        var self = this;
        self.selectedItemList.remove( item );
    }
    addDetailToTempItem( data, event, item ) {

        var self = this,
            k = ko.mapping.toJS( item );

        self.vm.Notes( item.Notes() );
        self.vm.MedicationID( item.MedicationID() );
        self.vm.MedicationName( item.MedicationName() );

        self.title( "Insert Details" );

        self.isSearch( false );

        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.Details );
        
        //self.selectedItemList.remove( item );
    }
    initBindHandler() {
        var self = this;
        ko.bindingHandlers.autoComplete = {
            init( element, valueAccessor, allBiindings, viewModel, bindingContext ) {
                var settings = valueAccessor();
                var selectedItem = settings.selected;
                var updateElementValueWithLabel = ( event, ui ) => {
                    event.preventDefault();
                    $( element ).val( ui.item.label );
                    if ( typeof ui.item !== "undefined" ) { selectedItem( ui.item ); }
                };
                $( element ).autocomplete( {
                    minLength: 3,
                    source( request, response ) {
                        self.isSearchActive( true );
                        self.appContext.service.routes.clinical.autoCompleteMedication( request.term ).done( data => {
                            var ds = data.Results.map( element => {
                                return {
                                    label: element.MedicationName,
                                    value: element.ID,
                                    codevalue: element.CodeValue,
                                    object: element
                                }
                            });
                            self.isSearchActive( false );
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


    do_insert__DetailCommand( data, event ) {
        var self = this;
        self.isSearch( true );
        self.title( "Add Allergies" );
        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.SearchItems );
    }

    resetForm() {
        var self = this;
        self.title( "Add Medication" );
        self.vmList.removeAll();
        self.isSearch( true );
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
        self.isSearch( true );
        self.onUpdate( false );
    }

    cancel_insert__DetailCommand( data, event ) {
        var self = this;
        self.isSearch( true );
        self.title( "Add Medication" );
        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.SearchItems );

    }
}
export = MedicationForm;