
import IViewModel = require( "core/IViewModel" );
import ViewModel = require( "core/ViewModel" );
import web = require( "components/grid/PagerMetrics" );
import Env = require( "system/events/ClinicalCommands" );
class DefaultView2 {
    contextSearch: KnockoutObservable<string>;
    itemsPerPageCount: KnockoutObservable<number>;
    watchItemsPerPageCount: KnockoutComputed<string>;
    isNoConsultationFlag: KnockoutObservable<boolean>;
    constructor( data: any ) {
        var self = this;
        self.sortDesc = ko.observable( true );
        self.sortColumn = ko.observable( "DTUTC_Created" );
        var clean = ko.mapping.toJS( data );
        var cleanDestination = ko.observableArray();
        clean.forEach( function ( item ) {
            cleanDestination.push( ko.mapping.fromJS( item ) );
        });
        self.datasource = cleanDestination;
        self.isSorting = ko.observable( false );
        if ( data !== null ) {
            if ( typeof self.datasource !== "function" ) {
                self.metrics = new web.components.grid.settings.PagerMetrics( self.datasource.length );
                self.isNoConsultationFlag = ko.observable( self.datasource.length === 0 );
            } else {
                self.metrics = new web.components.grid.settings.PagerMetrics( self.datasource().length );
                self.isNoConsultationFlag = ko.observable( self.datasource().length === 0 );
            }
            self.contextSearch = ko.observable( "" );
            self.items = ko.observableArray( [] );
            self.currentPage = ko.observable( 1 );
            self.pageButtons = ko.observableArray();
            self.pageSize = ko.observable( self.metrics.limit );
            self.totalCount = ko.observable( self.metrics.totalCount );
            self.totalPages = ko.observable( self.metrics.totalPages );
            self.itemsPerPageCount = ko.observable( 10 );
            self.watchItemsPerPageCount = ko.pureComputed( function () {
                self.metrics.update( self.itemsPerPageCount() );
                return " " + self.itemsPerPageCount().toString();
            }).extend( { notify: 'always' });
            for ( var i = 0; i < self.totalPages(); i++ ) {
                self.pageButtons.push( new web.components.grid.settings.PagerButton(
                    self.currentPage(), i + 1 ) );
            }
            self.isBack = ko.pureComputed(() =>
                self.currentPage() > 1 ? "" : "disabled", self );
            self.isNext = ko.computed(() =>
                self.currentPage() === self.totalPages() ? "disabled" : "en", self );

            self.firstItemOnPage = ko.computed(() =>
                ( self.currentPage() - 1 ) * self.pageSize() + 1 );

            self.lastItemOnPage = ko.computed(() => {
                var num = self.firstItemOnPage() + self.pageSize() - 1;
                return num > self.totalCount() ? self.totalCount() : num;
            });
            self.pagedItems = ko.computed(() => {
                if ( !self.isSorting() ) {
                    return self.datasource.slice( this.firstItemOnPage() - 1, self.lastItemOnPage() );
                } else {
                    return self.filteredRows().slice( self.firstItemOnPage() - 1, self.lastItemOnPage() );
                }
            });
            self.filteredRows = ko.computed( () => {
                var tttt = typeof this.datasource !== "function" ? this.datasource : this.datasource();
                var rows = tttt,
                    search = this.contextSearch().toLowerCase();
                if ( search === '' ) {
                    $( "#pagerButton-Container" ).show();
                    return rows.slice();
                }
                if ( search !== '' ) {
                    this.currentPage( 1 );
                    $( "#pagerButton-Container" ).hide();
                }
                return ko.utils.arrayFilter( rows, function ( row ) {
                    var v = row["DTUTC_Created"];
                    v = ko.unwrap( v );
                    if ( v ) {
                        if ( $.isNumeric( v ) ) {
                            if ( v === search )
                                return true;
                        }
                        else if ( Date.parse( v ) ) {
                            if ( Date.parse( v ) === Date.parse( search ) )
                                return true;
                        }
                        else if ( v.toString().toLowerCase().indexOf( search ) >= 0 ) {
                            this.currentPage();
                            return true;
                        }
                    }
                    return false;
                });
            }).extend( { throttle: 1 }); //We don't want typing to cause too many changes  
            var standardSort = ( a, b, sortProperty ) => {
                var propA = ko.unwrap( a[sortProperty] ),
                    propB = ko.unwrap( b[sortProperty] );
                if ( propA === propB )
                    return 0;
                return propA < propB ? 1 : -1;
            };
            self.isFirstSort = ko.observable( 0 );
            self.sortedRows = ko.computed(() => {
                self.pageSize( self.metrics.limit );
                self.totalCount( self.metrics.totalCount );
                self.totalPages( self.metrics.totalPages );
                var sorted = self.filteredRows().slice(), //We don't want to be sorting the original list
                    sortDirection = self.sortDesc() ? 1 : -1,
                    sortProperty = self.sortColumn() || "";
                if ( sortProperty === "" )
                    return sorted;
                var sort = ( a, b ) => standardSort( a, b, sortProperty ) * sortDirection;
                return sorted.sort( sort );
            }).extend( { throttle: 10 });
            self.getColumn = ( NAME: string, VALUE: KnockoutObservable<boolean> ) => {
                switch ( NAME ) {
                    case "IsActive":
                        return VALUE() ? "<div class=green-text><span class=\"glyphicon glyphicon-ok-circle\"></span></div>" : "<div class=\"yellow-text\"><span class=\"glyphicon glyphicon-ban-circle\"></span></div>";
                        break;
                    default:
                        return VALUE() ? "<div class=yellow-text><span class=\"glyphicon glyphicon-exclamation-sign\"></span></div>" : "<div class=\"grey-text\"><span class=\"glyphicon glyphicon-minus-sign\"></span></div>";
                        break;
                }
            }
            self.rows = ko.computed( {
                read: () => {
                    var sortedRows = self.sortedRows();
                    return sortedRows.slice(
                        self.firstItemOnPage() - 1, self.lastItemOnPage() );
                },
                deferEvaluation: true
            });
            self.sortColumn( "DTUTC_Created" );
            self.databind();
        }
    }

    //#region [ Sorting               ]

    onSort() {
        var self = this;
    }
    isFirstSort: KnockoutObservable<number>;
    onSortCommand( column: string ) {
        var self = this;
        self.currentPage( 1 );
        self.isSorting( true );
        if ( self.sortDesc() ) {
            self.sortColumn( column );
            self.sortDesc( false );
        } else {
            self.sortDesc( true );
            self.sortColumn( column );
        }
        self.updateView( self.currentPage() );
    }
    getSortColumn( instance: string ) {
        var self = this;
        return self.sortColumn() === instance;
    }
    //#endregion


    getColumn: ( name: string, value: KnockoutObservable<boolean> ) => any;

    //#region [ Rendering             ]

    getProductIcon( arg: any ) {
        var result = "";
        switch ( arg() ) {
            case "SV1":
                result = "<i class=\"material-icons cart-icon\">contact_phone</i>";
                break;
            case "SV2":
                result = "<i class=\"material-icons cart-icon green-text\">speaker_notes</i>";
                break;
            case "SV3":
                result = "<i class=\"material-icons cart-icon blue-text\">voice_chat</i>";
                break;
        }
        return result;
    }

    activate( data: any ) {
        var self = this;
        return self.databind();
    }
    deactive( data: any ) {

        return Q.resolve( true );
    }
    databind() {
        var self = this;
        //  self.appContext.isLoading(false);
        return Q.resolve( true );
    }
    loadHandler( data: any ) {
        console.log( data );
        var self = this;
        self.datasource = data;
    }
    updateView( index ) {
        var self = this;
        self.currentPage( index );
        ko.utils.arrayForEach( self.pageButtons(), ( item: web.components.grid.settings.PagerButton ) => {
            item.pageIndex( index );
        });
    }
    //#endregion

    //#region [ Events                ]

    onNextPage( data, event ) {
        var self = this;
        var index = self.currentPage() + 1;
        if ( index <= self.metrics.totalPages ) {
            self.updateView( index );
        }
    }
    onBackPage() {
        var self = this;
        var index = self.currentPage() - 1;
        if ( index >= 1 ) {
            self.updateView( index );
        }
    }
    onClickPage( value ) {
        var self = this;
        self.updateView( value() );
    }
    onSelect( data, event, value ) {
        var arg = ko.unwrap(value);
        console.log(arg);

            $( ".modal-content" ).removeClass( "m-hide" );
            $( "#modalPendingDetailsManager" ).removeClass( "m-hide" );
            $( "#modalPendingDetailsManager" ).openModal( {
                dismissible: false
            });

            ko.postbox.publish(
                Env.system.events.Clinical.VIEW_PENDING_DETAIL_CONTROL, value );
        
    }
    openModal() {
        var self = this;
        //   self.ctxDialog = new Dialog();
        //   app.showDialog(self.ctxDialog).then(() => {
        //     console.log("re-route");
        //  });
    }
  
    //#endregion

    //#region [ Properties            ]

    isBack: KnockoutComputed<string>;
    isNext: KnockoutComputed<string>;

    totalCount: KnockoutObservable<number>;
    totalPages: KnockoutObservable<number>;
    currentPage: KnockoutObservable<number>;
    pageSize: KnockoutObservable<number>;
    items: KnockoutObservableArray<any>;
    pageButtons: KnockoutObservableArray<any>;

    firstItemOnPage: KnockoutComputed<number>;
    lastItemOnPage: KnockoutComputed<number>;
    pagedItems: KnockoutComputed<any>;

    datasource: any;
    metrics: web.components.grid.settings.IPagerMetrics;
    isSorting: KnockoutObservable<boolean>;

    rows: KnockoutObservable<any>;
    sortDesc: KnockoutObservable<boolean>;
    sortColumn: KnockoutObservable<any>;
    sortedRows: KnockoutComputed<any>;
    filteredRows: KnockoutComputed<any>;

    //#endregion
}



export = DefaultView2;