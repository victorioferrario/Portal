import IAppView = require("core/ILoaders")
import Lg = require("core/AppTransitionManager");
class AppViewTransitions extends Lg.Sys.UI.TransitionManager implements IAppView.ILoaders {
    //@Event Handlers
    add() {
        var self = this;
        if (self.inprogress) {
            setTimeout(() => {
                self.add();
            }, 200);
        } else if (!self.inprogress) {
            self.inprogress = true;
            if (self.contextLoader !== undefined) {
                try {
                    self.context.removeChild(self.contextLoader);
                } catch (ex) {
                    console.info(ex);
                }
            }
            if (self.addLoader()) {
                self.addAnimateLoader();
            }
        }
    }
    remove() {
        var self = this;
        if (self.inprogress) {
            setTimeout(() => {
                self.remove();
            }, 200);
        } else if (!self.inprogress) {
            self.inprogress = true;
            self.removeAnimateLoader();
        }
    }
    constructor(container: string, id?: string) {
        super(container, id);
        var self = this;
        self.register(
            "start", this, this.add);
        self.register(
            "end", this, this.remove);
    }
}
export = AppViewTransitions;