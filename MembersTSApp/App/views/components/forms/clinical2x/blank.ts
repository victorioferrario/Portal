import ko = require( "knockout" );
import AppModule = require( "durandal/app" );
import IViewModel = require( "core/IViewModel" );
import ViewModel = require( "core/ViewModel" );
import Env = require( "system/events/EventCommand" );
declare var Materialize;
class BlankForm extends ViewModel {
    constructor() {
        super();
    }
    activate() {
        return this.databind();
    }
    canActivate() {
        return Q.resolve( true );
    }
    canDeActivate() {
        return Q.resolve( true );
    }
    deactivate( parms?: any ) {
        return Q.resolve( true );
    }
    compositionComplete() {
        var self = this;
    }
    databind() {
       var self = this;
       return Q.resolve( true );
    }
}
export = BlankForm;