import IViewModel = require( "core/IViewModel" );
import ViewModel = require( "core/ViewModel" );
import Env = require( "system/events/EventCommand" );
class NoResultsView extends ViewModel {
    constructor() {
        super();
    }
    navigateClick( data, event, index ) {
        var self = this;

        ko.postbox.publish( Env.system.events.GeneralCommands.NAVIGATION_TRIGGERED,
            "CONSULT_CENTER" );
        self.appContext.router.navigate( "#consults" );
    }
}
export = NoResultsView;