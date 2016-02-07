import ko = require( "knockout" );
import AppModule = require( "durandal/app" );
import IViewModel = require( "core/IViewModel" );
import ViewModel = require( "core/ViewModel" );
import LG = require( "models/clinical/HealthRecords" );
import HelperClinical = require( "components/clinical/IHealthRecords" );
import Env = require( "system/events/EventCommand" );
import sysTools = require( "system/utilities/Forms" );
declare var Materialize;
class ConditionForm extends ViewModel {
    app: DurandalAppModule;
    vm: LG.models.clinical.HealthRecords.ConditionObservable;
    vmList: KnockoutObservableArray<LG.models.clinical.HealthRecords.ConditionObservable>;

    dataModel: HelperClinical.componentes.clinical.IHealthRecords.DataProvider;

    hasData: KnockoutObservable<boolean>;
    title: KnockoutObservable<string>;
    isShow: KnockoutObservable<boolean>;
    isLoading: KnockoutObservable<boolean>;
    isShowOnMedicalRecord: KnockoutComputed<boolean>;

    isEdit: KnockoutObservable<boolean>;
    isInsert: KnockoutObservable<boolean>;

    hasAddButtonsToSearch: KnockoutObservable<boolean>;
    hasDoneButtonsToSearch: KnockoutObservable<boolean>;
   
    isSearch: KnockoutObservable<boolean>;
    isNext: KnockoutObservable<boolean>;

    isInputFocused: KnockoutObservable<boolean>;
    isInputFocusedComputed: KnockoutComputed<boolean>;

    selectedItem: KnockoutObservable<any>;
    selectedItemValue: KnockoutObservable<any>;
    selectedItemList: KnockoutObservableArray<any>;

    saveIndex: KnockoutObservable<number>;
    saveCount: KnockoutObservable<number>;

    constructor() {
        super();
        var self = this;

        self.app = AppModule;
        self.dataModel = self.appContext.appHealthHelper.optionsModel;

        self.saveIndex = ko.observable( 0 );
        self.saveCount = ko.observable( 0 );

        self.vmList = ko.observableArray( [] );
        self.vmList.removeAll();

        self.hasData = ko.observable( false );
        self.isShow = ko.observable( true );
        self.isLoading = ko.observable( true );

        self.isEdit = ko.observable( false );
        self.isInsert = ko.observable( false );

        self.selectedItem = ko.observable();
        self.selectedItemValue = ko.observable( '' );
       
        self.isSearch = ko.observable( true );
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
        console.log( "CAN DEACTIVEATE" );
        return Q.resolve( true );
    }
    compositionComplete() {
        var self = this;
        $( "#SearchText" ).keypress( event => {
            if ( event.keyCode === 13 ) {
                event.preventDefault();
                self.searchAdd( this, event, {});
            }
        });

        sysTools.utilities.Forms.InputMasks.maskDate(
            $( "#inputInsertDateStart" ) );
        sysTools.utilities.Forms.InputMasks.maskDate(
            $( "#inputInsertDateEnd" ) );

        sysTools.utilities.Forms.InputMasks.maskDate(
            $( "#inputDateStart" ) );
        sysTools.utilities.Forms.InputMasks.maskDate(
            $( "#inputDateEnd" ) );

        //

        self.appContext.resetViewPort();
    }
    getFormat( arg: any ) {
        var date = new Date( arg() );
        return date.toLocaleDateString();
    }
    getDateFormat( date: any ): string {
        console.log( date );
        if ( date !== null && date !== undefined ) {
            console.log( date );
            return new Date( date ).toLocaleDateString();
        } else {
            return new Date().toLocaleDateString();
        }
    }
    databind() {
        var self = this;
        self.title = ko.observable( "Condition" );
        return Q.resolve( true );
    }
    populate( data: LG.models.clinical.HealthRecords.ICondition ) {
        var self = this;
        self.isEdit( true );
        self.isInsert( false );
        self.vm = new LG.models.clinical.HealthRecords.ConditionObservable( data );
        self.hasData( true );
        self.isShow( !self.vm.IsHidden() );
        self.isShowOnMedicalRecord = ko.computed(() => {
            if ( self.isShow() ) {
                self.vm.IsHidden( false );
            } else {
                self.vm.IsHidden( true );
            }
            return !self.vm.IsHidden();
        }, self );

        self.isLoading( false );
        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.Search );
    }
    populateInsert() {
        var self = this;
        self.hasData( true );
        self.isInsert( true );
        self.vm = new LG.models.clinical.HealthRecords.ConditionObservable();
        self.vm.RID( self.appContext.identityUser.instance.RolodexItemID );
        self.initBindHandler();
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
    searchAdd( data, event, item ) {
        var self = this,
            k = ko.unwrap( self.selectedItem() ),
            tempVM = new LG.models.clinical.HealthRecords.ConditionObservable();

        console.warn( item() );

        tempVM.MedicalConditionID( item().value );
        tempVM.MedicalConditionText( item().label );

        self.vmList.push( tempVM );

        self.selectedItemList.push( k );

        self.selectedItem( null );
        self.selectedItemValue( "" );
    }
    searchDone( data, event, item ) {

    }
    getDate( a ): string {
        console.log( a );
        if ( a !== null && a !== undefined ) {
            var date = new Date( a ); return date.toLocaleDateString();
        } else {
            return "NA";
        }
    }
    addDetailToTempItem( data, event, item ) {

        var self = this,
            k = ko.mapping.toJS( item );
        self.vm.Notes( item.Notes() );
        self.vm.MedicalConditionID( item.MedicalConditionID() );
        self.vm.MedicalConditionText( item.MedicalConditionText() );
        self.vm.MedicalConditionStatus( item.MedicalConditionStatus() );
        self.vm.D_Start( item.D_Start() );
        self.vm.D_End( item.D_End() );

        self.isSearch( false );

        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.Details );
        
        //self.selectedItemList.remove( item );
    }
    removeTempItem( data, event, item ) {
        var self = this, k = ko.mapping.toJS( item );
        console.log( k );
        self.vmList.remove( item );
        ko.utils.arrayForEach( self.selectedItemList(), function ( condition ) {
            if ( condition !== null && condition !== undefined ) {
                if ( condition.label !== null && condition.label !== undefined ) {
                    if ( condition.label === item.MedicalConditionText() ) {
                        self.selectedItemList.remove( condition );
                    }
                }
            }
        });
        if ( self.vmList.length === 0 ) {
            self.hasDoneButtonsToSearch( false );
            self.appContext.appViewHealthRecords.buttonState(
                Env.system.events.LayoutCommands.FormButtonsHR.Search );
        }
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
                        self.appContext.service.routes.clinical.autoCompleteConditions( request.term ).done( data => {
                            var ds = data.Results.map( element => {
                                return {
                                    label: element.MedicalConditionText,
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

    onAddNewItem( vmItem ) {
        var self = this;
        self.isLoading( true );
        var entity = new LG.models.clinical.HealthRecords.Inputs.MedConditions.MedConditionEntity();

        entity.RID = self.appContext.identityUser.instance.RolodexItemID;
        entity.ActionHelper.ClinicalAction = LG.models.clinical.HealthRecords.Enums.Action.Add;
        entity.ActionHelper.ClinicalType = LG.models.clinical.HealthRecords.Enums.Type.Condition;

        entity.InsertInput = ko.mapping.toJS( vmItem );
        entity.InsertInput.RID = entity.RID;

        var dFO = new Date( vmItem.D_Start() ),
            dC = new Date( vmItem.D_End()  );

        entity.InsertInput.D_Start = dFO.getUTCFullYear()
        + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dFO.getMonth().toString() )
        + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dFO.getDate().toString() )
        + "T12:00:00";

        entity.InsertInput.D_End = dC.getUTCFullYear()
        + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dC.getMonth().toString() )
        + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dC.getDate().toString() )
        + "T12:00:00";
        

        self.appContext.identityUser.service.routes.clinical.insertCondition( entity ).fail(() => {
            Materialize.toast( "Item was not updated. Try again later.", 4000 );
            self.isLoading(false);
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
                self.app.trigger( Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD );
                self.appContext.router.navigate( "#dashboard" );
            }
        }
    }

    

    onUpdate( isNew?: boolean ) {
        var self = this;
        self.isLoading( true );
        if ( isNew ) {
            //self.onAddNewItem();
        } else {
            var entity = new LG.models.clinical.HealthRecords.Inputs.MedConditions.MedConditionEntity();
            entity.RID = self.appContext.identityUser.instance.RolodexItemID;

            entity.ActionHelper.ClinicalAction =
            LG.models.clinical.HealthRecords.Enums.Action.Update;

            entity.ActionHelper.ClinicalType =
            LG.models.clinical.HealthRecords.Enums.Type.Condition;

            entity.UpdateInput = ko.toJS( self.vm );

            var dFO = new Date( self.vm.D_Start() ),
                dC = new Date( self.vm.D_End() );

            entity.UpdateInput.D_Start = dFO.getUTCFullYear()
            + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dFO.getUTCMonth().toString() )
            + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dFO.getUTCDate().toString() ) 
            + "T12:00:00";

            entity.UpdateInput.D_End = dC.getUTCFullYear()
            + "-" + sysTools.utilities.Forms.InputValues.doubleDigits(dC.getUTCMonth().toString())
            + "-" + sysTools.utilities.Forms.InputValues.doubleDigits( dC.getUTCDate().toString() ) 
            + "T12:00:00";

            self.appContext.identityUser.service.routes.clinical.updateCondition( entity ).fail(() => {
                Materialize.toast( "Item was not update. Try again later.", 4000 );
                self.isLoading( false );

            }).done( data => {
                Materialize.toast( "Success, item was updated.", 4000 );
                setTimeout( () => {
                    self.isLoading( false );
                }, 500 );
                if ( self.removeFormManager() ) {
                    self.app.trigger( Env.system.events.GeneralCommands.DATA_HEALTH_RELOAD );
                    self.appContext.router.navigate( "#dashboard" );}
            });
        }
    }

    do_insert__DetailCommand( data, event ) {
        var self = this;
        ko.utils.arrayForEach( self.vmList(), item => {
            if ( item.MedicalConditionText() === self.vm.MedicalConditionText() ) {
                var t: LG.models.clinical.HealthRecords.Inputs.MedConditions.IMedConditionInput
                    = ko.mapping.toJS( self.vm );
                item.D_End( t.D_End );
                item.D_Start( t.D_Start );
                item.MedicalConditionStatus( t.MedicalConditionStatus );
                item.HowItEnded( t.HowItEnded );
                item.IsStandardized( true );
                item.IsHidden( false );
                item.Notes( t.Notes );
                console.log( "update this one", item );
            }
        });
        self.vm.Notes( "" );
        self.vm.D_End( null );
        self.vm.D_Start( null );
        self.vm.HowItEnded( "" );
        self.vm.MedicalConditionStatus( 0 );
        var eT = ko.mapping.toJS( self.vmList() );
        console.log( eT );
        self.isSearch( true );
        self.title( "Add Conditions" );
        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.SearchItems );
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
        //self.isSearch( true );
        self.onUpdate( false );
    }

    cancel_insert__DetailCommand( data, event ) {
        var self = this;
        self.title( "Add Condition" );
        self.hasDoneButtonsToSearch( false );
        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.Search );
        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.SearchItems );
    }

    resetForm() {
        var self = this;
        self.title( "Add Conditions" );
        self.vmList.removeAll();
        self.isSearch( true );
        self.isInsert( true );
        self.isEdit(false);
        self.appContext.appViewHealthRecords.buttonState(
            Env.system.events.LayoutCommands.FormButtonsHR.Search );
    }
}

export = ConditionForm;
 

