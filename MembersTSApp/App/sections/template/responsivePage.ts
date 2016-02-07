import PageModel = require( "core/PageModel" );
import IPageModel = require( "core/IPageModel" );
class ResponsivePage extends PageModel {
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
    compositionComplete() {

    }
}
export = ResponsivePage;  