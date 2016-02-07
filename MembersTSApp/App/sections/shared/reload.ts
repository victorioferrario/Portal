import PageModel = require( "core/PageModel" );
import IPageModel = require( "core/IPageModel" );
class Reload extends PageModel {
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
        self.domPage.css( "background-color", "#0c2238" );
        setTimeout(() => {
            this.appContext.router.navigate("#profile");
        } , 1000);

    }
}
export = Reload;  