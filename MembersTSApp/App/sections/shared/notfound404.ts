import ko = require("knockout");
import IPageModel = require("core/IPageModel");
import PageModel = require("core/PageModel");
class NotFound extends PageModel {
    constructor() {
        super();
    }
    activate() {
        return Q.resolve(true);
    }
    canActivate() {
        return Q.resolve(true);
    }
    canDeActivate() {
        return Q.resolve(true);
    }
    compositionComplete() {

    }
    databind() {
        var self = this;
        return Q.resolve(true);
    }
}
var vm: IPageModel = new NotFound(); export = vm;  