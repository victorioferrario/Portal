import ko = require( "knockout" );
import IPageModel = require( "core/IPageModel" );
import IViewModel = require( "core/IViewModel" );
import PageModel = require( "core/PageModel" );
import ds = require( "sections/clinical/viewModelHealthRecords" );
import Env = require( "system/events/ClinicalCommands" );

class Default extends PageModel {
    results: ds.ViewModelHealthRecords;
    index: KnockoutObservable<number>;
    activeScreen: KnockoutObservable<any>;
    isLoaded: KnockoutObservable<boolean>;
    isHiddenItems: KnockoutObservable<boolean>;
    listItemTemplateProvider: KnockoutComputed<string>;
    // computeTemplateProvider: KnockoutComputed<string>;
    templateHidden: KnockoutObservable<string>;
    template: KnockoutObservable<string>;
    listTemplateTracker: KnockoutComputed<string>;

    constructor() {
        super();
        var self = this;
        self.index = ko.observable( 1 );
        self.isLoaded = ko.observable( false );
        self.template = ko.observable( "template-1" );
        self.templateHidden = ko.observable( "template-1-hidden" );
        self.isHiddenItems = ko.observable( false );
    }
    activate() {
        var self = this;
        self.index(1);
        return this.databind();
    }
    canActivate() {
        return Q.resolve( true );
    }
    canDeActivate() {
        return Q.resolve( true );
    }
    getDateFormat( a ): string {
        if ( a !== null && a !== undefined ) {
            var date = new Date( a ); return date.toLocaleDateString();
        } else {
            return "NA";
        }
    }
    getHeightFormat( arg ) {
        var ft = Math.floor( arg / 12 );
        var inches = arg % 12;
        var result = ft + "ft. "
            + inches + "in.";
        return result;
    }

    onEdit( data, event, item ) {
        var self = this;
        if ( self.initFormManger2() ) {

            switch ( self.index() ) {

                case 1:
                    ko.postbox.publish( Env.system.events.Clinical.ADD_CONTROL_EDGE,
                        { Data: item, Action: Env.system.events.Clinical.FORM_ALLERGY });
                    break;
                case 2:
                    ko.postbox.publish( Env.system.events.Clinical.ADD_CONTROL_EDGE,
                        { Data: item, Action: Env.system.events.Clinical.FORM_CONDITIONS });
                    break;
                case 3:
                    ko.postbox.publish( Env.system.events.Clinical.ADD_CONTROL_EDGE, {
                        Data: item, Action: Env.system.events.Clinical.FORM_HISTORY
                    });
                    break;
                case 4:
                    ko.postbox.publish( Env.system.events.Clinical.ADD_CONTROL_EDGE,
                        { Data: item, Action: Env.system.events.Clinical.FORM_MEASUREMENTS });
                    break;
                case 5:
                    $("#modalFrmManager").addClass("large");
                    ko.postbox.publish( Env.system.events.Clinical.ADD_CONTROL_EDGE,
                        { Data: item, Action: Env.system.events.Clinical.FORM_MEDICATIONS });
                    break;
            }
        }
    }
    initFormManger() {
        $( "#modalFrmManager" ).openModal( {
            dismissible: false
        });
        return true;
    }
    initFormManger2() {
        $( ".modal-content" ).removeClass( "m-hide" );
        $( "#modalFrmManager2" ).removeClass( "m-hide" );
        $( "#modalFrmManager2" ).openModal( {
            dismissible: false
        });
        return true;
    }
    compositionComplete() {
        var self = this;
        self.appContext.resetViewPort();
        $( "ul.tabs" ).tabs();
        $( "#spinnerTemplateID" ).velocity(
            "fadeOut", {
                delay: 1,
                duration: 800,
                begin( elements ) {
                },
                complete( elements ) {
                    $( "#spinnerTemplateID" ).addClass( "m-hide" );
                    $( "#viewHealthRecords" ).removeClass( "m-hide" );
                }
            });
        $( "#" ).addClass( "m-hide" );
        setInterval(() => {
            $( "#btn1" ).addClass( "active" );
        }, 100 );
        $( ".modal-trigger" ).leanModal( {
            dismissible: false
        });
        setTimeout(() => {
            $( "#viewHealthRecords" ).css( "overflow-y", "auto" );
        }, 200 );
        $( "#page" ).css( "overflow-y", "hidden" );
        $( "#page" ).css( "background-color", "#0d47a1" );
        $( ".tooltipped" ).tooltip( { delay: 30 });
        // $("#pageContainer").css("overflow-y", "hidden!important");
    }

    onAddClick( data, event ) {
        var self = this;
        console.log(self.index());
                self.initFormManger2();
            switch ( self.index() ) {
                case 1:
                        ko.postbox.publish(Env.system.events.Clinical.ADD_INSERT_CONTROL_EDGE, { Data: "", Action: Env.system.events.Clinical.FORM_ALLERGY });
                    break;
                case 2:
                        ko.postbox.publish( Env.system.events.Clinical.ADD_INSERT_CONTROL_EDGE, { Data: "", Action: Env.system.events.Clinical.FORM_CONDITIONS });
                    break;
                case 3:
                    ko.postbox.publish( Env.system.events.Clinical.ADD_INSERT_CONTROL_EDGE, { Data: "", Action: Env.system.events.Clinical.FORM_HISTORY });
                    break;
                case 4:
                    ko.postbox.publish( Env.system.events.Clinical.ADD_INSERT_CONTROL_EDGE, { Data: "", Action: Env.system.events.Clinical.FORM_MEASUREMENTS });
                    break;
                case 5:
                    $( "#modalFrmManager2" ).addClass( "large" );
                    ko.postbox.publish( Env.system.events.Clinical.ADD_INSERT_CONTROL_EDGE, { Data: "", Action: Env.system.events.Clinical.FORM_MEDICATIONS });
                    break;
        }

        
    }
    resetView( data, event, index ) {
        var self = this;
        self.index( index );
        $( "#viewHealthRecords" ).css( "overflow-y", "hidden" );
        $( "#viewHealthRecords" ).scrollTop( 0 );
        setTimeout(() => {
            $( "#viewHealthRecords" ).css( "overflow-y", "auto" );
        }, 1000 );
        return true;
    }
    getData( arg ) {
        console.log( arg );
        return "striped";
    }
    databind() {
        var self = this;
        self.results = new ds.ViewModelHealthRecords( self.appContext );
        if ( self.results.databind() ) {
            self.isLoaded( true );
        }
        self.appContext.remove();
        $( "#viewHealthRecords" ).scrollTop( 0 );
        self.listItemTemplateProvider = ko.computed(function() {
            console.log(self.isHiddenItems());
            return !self.isHiddenItems()
                       ? self.template()
                       : self.templateHidden();
        });
        self.listTemplateTracker = ko.computed(() => {
            var result = null;
            switch ( self.index() ) {
                case 1:
                    result = 1;
                    self.template( 'template___health__records_item' );
                    self.templateHidden( "template___health__records_item_hidden" );
                    break;
                case 2:
                    self.template( 'template___health__records_item___2' );
                    self.templateHidden( "template___health__records_item___2___hidden" );
                    break;
                case 3:
                    self.template( 'template___health__records_item___3' );
                    self.templateHidden( "template___health__records_item___3___hidden" );
                    break;
                case 4:
                    self.template( 'template___health__records_item___4' );
                    self.templateHidden( "template___health__records_item___4___hidden" );
                    break;
                case 5:
                    self.template('template___health__records_item___4');
                    self.templateHidden("template___health__records_item___4___hidden");
                    break;
            }
            return result;
        });
        return Q.resolve( true );
    }

    getStatus( arg ) {
        console.log(arg);
        switch(arg) {
            case 0:
                return "Unknown";
            case 1:
                return "Current";
                break;
            case 2:
                return "Intermittent";
            case 3:
                return "Past";
                break;
        }
       // return "";
        /* Current = 1,
        Intermittent = 2,
        Past = 3*/
    }
}
var vm: IPageModel = new Default(); export = vm;  