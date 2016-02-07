import PageModel = require( "core/PageModel" );
import IPageModel = require( "core/IPageModel" );

class DefaultTemplate extends PageModel {
    constructor() {
        super();
        var self = this;
    }
    databind() {
        var self = this;
        return Q.resolve( true );
    }
    activate( parms?: any ) {
        var self = this;
        return Q.resolve( true );
    }
    canActivate() {
        return Q.resolve( true );
    }
    canDeActivate() {
        return Q.resolve( true );
    }

    domATop: JQuery;
    domArticlePage: JQuery;
    domABottom: JQuery;

    resizeCommand() {
        // Define Variables
        var self = this,
            height = Math.floor( $( document ).height() ),
            offSet = Math.floor( self.domArticlePage.offset().top ),
            newHeight = ( height - Math.floor( offSet ) ),
            topH = self.domATop.height(),
            bottomH = Math.floor( newHeight + topH ),
            newTop = Math.floor( topH );
        // set new height
        self.domABottom.velocity( { top: newTop }, "easeInSine" );
    }
    bindDomReferences() {
        var self = this;
        self.domArticlePage = $( "#domArticlePage" );
        self.domATop = $( ".responsive_page_article__top" );
        self.domABottom = $( ".responsive_page_article__bottom" );
        $( ".app_content" ).css( "overflow-y", "hidden!important" );
        $( "#pageContainer" ).css( "overflow-y", "hidden!important" );
        $( "#pageContainer" ).addClass( "no-scroll" );
        return true;
    }
    compositionComplete() {
        var self = this;

        if ( self.bindDomReferences() ) {
            $( document ).resize( self.resizeCommand );
        }
        self.domABottom.css( "overflow-y", "auto" );
        self.resizeCommand();
        //  9
    }
    disablePageAndContainerScrolling() { }
}

export = DefaultTemplate;  