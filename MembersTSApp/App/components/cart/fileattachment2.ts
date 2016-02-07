import IAppContext = require( "core/IAppContext" );
import AppContext = require( "core/AppContext" );
import ref = require( "sections/consults/viewManager" );
class FileAttachment2 {
    appContext: IAppContext;
    parent: ref.cart.ViewManager;
    filePath: KnockoutObservable<string>;
    postUrl: KnockoutObservable<string>;
    filename: KnockoutObservable<string>;
    Description: KnockoutObservable<string>;
    isEnabled: KnockoutObservable<boolean>;
    fileAvailable: KnockoutComputedFunctions<boolean>;
    listDisplay: KnockoutObservableArray<any>;
    IsUploading: KnockoutObservable<boolean>;
    constructor( app: ref.cart.ViewManager ) {
        var self = this;
        self.parent = app;
        self.appContext = AppContext;
        self.filename = ko.observable( "" );
        self.listDisplay = ko.observableArray();
        self.Description = ko.observable( "" );
        self.isEnabled = ko.observable( true );
        self.IsUploading = ko.observable( false );
    }
    doUpload() {
        $( "#app_store_content" ).scrollTop( 0 );
        var self = this;
        self.parent.isProcessingOrder(true);
        self.IsUploading( true );
        var form = $( "#frmUpload" );
        //$("#upload").val()
        var fload = $( "#upload" ).val();
        var formData = new FormData().append( "", "" );
        // $('form')[0]
        var server = document.location.host.indexOf("localhost") !== -1 ? "http://localhost/Members/" : "https://www.1888md.com/Members/";
        $( "#frmUpload" ).ajaxSubmit( {
            url: server + "api/media",
            type: "POST",
            headers: {
                "Content-Disposition": "attachment; filename=" + fload
            },
            beforeSubmit() {
                return true;
            },
            success( data ) {
                self.onUploadComplete( data ); //bindingContext.$root.updateCommand(data);
            },
            error( jqXhr, textStatus, errorThrown ) {

            }
        });
    }
    onUploadComplete( data ) {
        var self = this;
        $( "#frmUpload" ).addClass( "m-hide" );
        $( "#uploadComplete" ).removeClass( "m-hide" );
        self.parent.onuploadSuccess();
        self.IsUploading( false );
        // self.parent.onDone();
    }
    hasExtension( input, exts ) {
        return ( new RegExp( '(' + exts.join( '|' ).replace( /\./g, '\\.' ) + ')$' ) ).test( $( input ).val() );
    }
    databind() {  
        var self = this, element = document.getElementsByTagName( "input" );
        //$("#buttonUpload").on("click", e => {
        //    this.doUpload();
        //});
    }
    changeEvent2() {
        var self = this, elements = document.getElementsByTagName( "input" ), extArry = [".jpg", ".png", ".gif", ".pdf", ".tiff", ".bmp"];
        if ( !self.hasExtension( "#upload", [".jpg", ".png", ".gif", ".pdf", ".tiff", ".bmp"] ) ) {
            console.log( "Error" );
        } else {
            for ( var i = 0; i < elements.length; i++ ) {
                if ( elements[i].id === "upload" ) {
                    console.log( elements[i] );
                    if ( elements[i].files.length > 0 ) {
                        var fileInput = elements[i];
                        for ( var k = 0; k < fileInput.files.length; k++ ) {
                            self.listDisplay.push( fileInput.files[k] );
                        }
                    }
                }
            }
            var list = $( "#upload" ).val();
            console.log( list );

        }
    }
    changeEvent() {
        var self = this, elements = document.getElementsByTagName( "input" ), extArry = [".jpg", ".png", ".gif", ".pdf", ".tiff", ".bmp"];
        console.log(self["views"].ctxUpload);
        if ( !self["views"].ctxUpload.hasExtension( "#upload", [".jpg", ".png", ".gif", ".pdf", ".tiff", ".bmp"] ) ) {
            console.log( "Error" );
        } else {
            console.log( self );
            self["views"].showNoteRow();
            for ( var i = 0; i < elements.length; i++ ) {
                if ( elements[i].id === "upload" ) {
                    console.log( elements[i] );
                    if ( elements[i].files.length > 0 ) {
                        var fileInput = elements[i];
                        for ( var k = 0; k < fileInput.files.length; k++ ) {
                            self["views"].ctxUpload.listDisplay.push( fileInput.files[k] );
                        }
                    }
                }
            }
            var list = $( "#upload" ).val();
            console.log( list );
            self["views"].ctxUpload.isEnabled( true );
            // self.
        }
    }

    deleteCommand() {
        var self = this;
    }
    updateCommand( data: any ) {

    }
    updateView() {
        console.info( "Update View" );
    }
}
export = FileAttachment2;