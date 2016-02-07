import ko = require("knockout");
import IPageModel = require("core/IPageModel");
import PageModel = require("core/PageModel");

class FamilyMembers extends PageModel {
    title: KnockoutObservable<string>;
    hasData: KnockoutObservable<boolean>;
    isLoadingDetails: KnockoutObservable<boolean>;
    accounts: KnockoutObservableArray<any>;
    hasDependents: KnockoutObservable<boolean>;
    constructor() {
        super();
        var self = this;
        self.hasData = ko.observable(false);
        self.accounts = ko.observableArray();
        self.hasDependents = ko.observable( false );
        self.isLoadingDetails = ko.observable(false);
    }
    activate() {
        var self = this;
        self.isLoadingDetails(true);
        return this.databind();
    }
    canActivate() {
        return Q.resolve(true);
    }
    canDeActivate() {
        console.log("CAN DEACTIVEATE");
        return Q.resolve(true);
    }
    compositionComplete() {
        var self = this;
        self.appContext.resetViewPort();
   //     $("#page").css("background-color", "#ffffff");
        $('.tooltipped').tooltip({ delay: 30 });
    }
    databind() {
        var self = this;
        self.title = ko.observable( "Family Members" );
        self.accounts.removeAll();
        if ( self.appContext.identityUser.dataContext.data.hasDependents() ) {
            ko.utils.arrayForEach( self.appContext.identityUser.dependentLists(), item => {
                self.hasDependents( true );
                if ( item.RID !== self.appContext.identityUser.instance.RolodexItemID ) {
                    self.accounts.push( item );
                }
                
            });
           
        } else {
            self.hasDependents( false ); 
        }
        self.isLoadingDetails( false );
        return Q.resolve(true);
    }
    //self.appContext.service.routes.members.loadDependents(
        //    self.appContext.identityUser.instance.RolodexItemID).fail(() => {
        //    }).done(data => {
        //        data.forEach(item => {
        //            if (item.RID !== self.appContext.identityUser.instance.RolodexItemID) {
        //                self.accounts.push(item);
        //            }
        //        });
        //    }).then(() => {
        //        console.log("done");
        //        self.hasData(true);
        //        self.isLoadingDetails(false);
        //    });
    
}
var vm: IPageModel = new FamilyMembers(); export = vm;  