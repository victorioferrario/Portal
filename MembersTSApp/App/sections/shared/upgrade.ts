import PageModel = require( "core/PageModel" );
import IPageModel = require( "core/IPageModel" );
class Upgrade extends PageModel {
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
        var self = this;
      
    }
    cancel(data, event) {
        var self = this;
        $( ".modal-content" ).addClass( "m-hide" );
        $( "#modalFrmManager5" ).closeModal();
        $( "#modalFrmManager5" ).css( "display", "none" );
    }
}
export = Upgrade;  