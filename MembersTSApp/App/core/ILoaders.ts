import Lg = require("core/AppTransitionManager");
export interface ILoaders extends Lg.Sys.UI.ITransitionManager {
    add();
    remove();
} 