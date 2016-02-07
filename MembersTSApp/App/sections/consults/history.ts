import ko = require( "knockout" );
import IPageModel = require( "core/IPageModel" );
import PageModel = require( "core/PageModel" );

import Grid = require( "components/grid/viewModel" );
import Grid2 = require( "components/grid/viewModel2" );
import NoGrid = require( "components/grid/viewNoResults" );
import Env = require( "system/events/EventCommand" );

class History extends PageModel {

    grid: Grid;
    noGrid: NoGrid;

    grid2: Grid2;
    noGrid2: NoGrid;

    title: KnockoutObservable<string>;
    list: KnockoutObservableArray<any>;

    pageViewControl_Pending: KnockoutObservable<any>;
    pageViewControl_Completed: KnockoutObservable<any>;

    isDataLoaded: KnockoutObservable<boolean>;

    constructor() {

        super();

        var self = this;

        self.isDataLoaded = ko.observable( false );

        self.pageViewControl_Pending = ko.observable();

        self.pageViewControl_Completed = ko.observable();

        ko.postbox.subscribe(
            Env.system.events.GeneralCommands.DATA_LOADED,
            self.dataloaded, this );

        ko.postbox.subscribe(
            Env.system.events.GeneralCommands.DATA_LOADED_ORDERS_LIST,
            self.onHandleOrderListLoaded, this );

        ko.postbox.subscribe(
            Env.system.events.ConsultHistoryCommands.VIEW_DETAILS,
            self.onGetDetails, this);

        ko.postbox.subscribe(
            Env.system.events.ConsultHistoryCommands.VIEW_PENDING_DETAILS,
            self.onGetPendingDetails, this);

    }
    activate() {
        var self = this;
        self.domPage.css( "background-color", "#0d47a1" );
        return this.databind();
    }
    canActivate() {
        return Q.resolve( true );
    }
    canDeActivate() {
        return Q.resolve( true );
    }

    compositionComplete() {
        var self = this;
        self.appContext.resetViewPort();
        $( "#page" ).css( "background-color", "#0d47a1" );
        $( ".tooltipped" ).tooltip( { delay: 30 });
        self.appContext.resetViewPort();
        $( "ul.tabs" ).tabs();
        $( "#spinnerTemplateID" ).velocity(
            "fadeOut", {
                delay: 1,
                duration: 800,
                begin( elements ) { },
                complete( elements ) {
                    $( "#spinnerTemplateID" ).addClass( "m-hide" );
                    $( "#viewHistoryWrapper" ).removeClass( "m-hide" );
                }
            });

        $( ".app_content" ).css( "overflow-y", "hidden!important" );
        $( "#page" ).css( "background-color", "#0c2238" );
        $( "#page" ).css( "overflow-y", "hidden!important" );
        $( "#page-container" ).css( "overflow-y", "hidden!important" );
    }

    databind() {
        var self = this;
        self.title = ko.observable( "Welcome" );
        self.appContext.identityUser.dataContext.loadOrderActivity();
        return Q.resolve( true );
    }

    dataloaded() {
        var self = this;

        if ( self.appContext.identityUser.dataContext.data.history.ConsultationsFoundExpanded.length !== 0 ) {
            self.grid = new Grid( self.appContext.identityUser
                .dataContext.data.history.ConsultationsFoundExpanded );
            self.pageViewControl_Completed(
                self.grid );
            self.isDataLoaded( true );

        } else {
            // $("#altContent").removeClass("m-hide");
            //   $("#listWrapper").addClass("m-hide");
        }
    }

    onHandleOrderListLoaded() {

        var self = this;
        console.warn(self.appContext.identityUser.dataContext.data.history.ConsultationsFoundExpanded.length);

        //if ( self.appContext.identityUser.dataContext.data.history.ConsultationsFoundExpanded.length > 0 ) {

        //    self.grid = new Grid( self.appContext.identityUser
        //        .dataContext.data.history.ConsultationsFoundExpanded ); self.pageViewControl_Completed( self.grid );

        //} else {

        //    self.noGrid = new NoGrid();
        //    self.pageViewControl_Completed( self.noGrid );
        //}

        var dataItem = ko.mapping.toJS( self.appContext.identityUser.dataContext.data.orders );
        console.warn( dataItem );
        if (dataItem.ConsultationsFoundExpanded.length > 0) {
            self.grid2 = new Grid2(self.appContext.identityUser
                .dataContext.data.orders.ConsultationsFoundExpanded);
            self.pageViewControl_Pending(self.grid2);
        } else {
            self.noGrid2 = new NoGrid();
            self.pageViewControl_Pending( self.noGrid2 );
        }
    }

    detailloaded() {
        var self = this;
        //console.log(self.appContext.identityUser.dataContext.data.detail);
    }
    onGetDetails( data: any ) {
        var self = this;
        console.warn("onGetDetails");
        self.appContext.identityUser.dataContext.loadConsultDetail( data() );
    }
    onGetPendingDetails(data: any) {
        var self = this;
        console.warn("onGetPendingDetails");
        self.appContext.identityUser.dataContext.loadPendingConsultDetail(data());
    }
    getChiefComplaint() {
        var self = this;

        //     return self.appContext.identityUser.dataContext.data.detail.EncounterData.ChiefComplaints[0].ChiefComplaintShort;
    }
    onclickHealthRecords() {
        var self = this;
        self.appContext.add();
        $( "#page-container" ).css( "overflow-y", "hidden!important" );
        self.appContext.bootHealthRecords();
    }
    click( data, event, arg ) {
        console.log( arg );
    }
    onView( data, evet ) {
        var self = this;
        console.log( 'dataview' );
    }
    onViewChange( data, event, index ) {
        var self = this;
        // self.appContext.identityUser.dataContext.loadHistory();// self
        self.appContext.identityUser.dataContext.loadOrderActivity();
    }
    resetView( data, event, index ) {
        var self = this;
        $( ".app_content" ).scrollTop( 0 );
        console.log("this", this, index);
        switch ( index ) {
            case 1:

                var dataItem1 = ko.mapping.toJS( self.appContext.identityUser.dataContext.data.history );
                if ( dataItem1.ConsultationsFoundExpanded.length > 0 ) {

                    self.grid = new Grid(dataItem1.ConsultationsFoundExpanded);
                    self.pageViewControl_Completed( self.grid );

                } else {

                    self.noGrid = new NoGrid();
                    self.pageViewControl_Completed( self.noGrid );

                    $( "#viewHistoryWrapper" ).css( "background-color", "#0c2238" );

                }
                break;
            case 2:
                var dataItem2 = ko.mapping.toJS( self.appContext.identityUser.dataContext.data.orders );
                if ( dataItem2.ConsultationsFoundExpanded.length > 0 ) {
                    self.grid2 = new Grid2( dataItem2.ConsultationsFoundExpanded );
                    self.pageViewControl_Pending(self.grid2);

                } else {

                    self.noGrid2 = new NoGrid();
                    self.pageViewControl_Pending( self.noGrid2 );
                }

                break;
        }
        return true;
    }
}
export = History;  