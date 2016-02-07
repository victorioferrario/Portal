import ux = require("components/cart/view");
import ordering = require("components/cart/store");
import com = require("components/cart/layout");
export namespace components.cart.checkout {
    export class StoreManager {
        store: ordering.components.cart.Store;
        views: ux.components.cart.StoreViewManager;
        constructor() {
            var self = this;
            self.store = new ordering.components.cart.Store();
            self.views = new ux.components.cart.StoreViewManager(self.store);
        }
        click(item: any, command: string, data: any, event: any) {
            var self = this;
            switch (command) {
                case "ADD":
                    self.store.select(item);
                    self.views.layout.isPricingTable(false);
                    break;
                case "REMOVE":
                    if(!self.views.isOrderProcess()){
                        self.store.other("");
                        self.store.cart.instance.recipient("SELF");
                        self.store.select(null);
                        self.views.layout.display(0);
                        self.views.layout.isPricingTable(true);
                        if (!$(com.components.cart.ui.StoreSettings.zipCodeRow).hasClass("m-hide")) {
                            $(com.components.cart.ui.StoreSettings.zipCodeRow).addClass("m-hide");
                        }
                        self.views.layout.heightOfView2("0");
                        self.views.layout.heightOfView3("0");
                        self.views.index(0);
                        self.views.isNextButton(true);
                        self.views.isSearchButton(false);
                        
                        alert("you")
                        if ( !$( ".cart_step__4__view1" ).hasClass( "m-hide" ) ) {
                            $( ".cart_step__4__view1" ).addClass( "m-hide" );
                        }
                        if (!$(".cart_step__5__view1").hasClass("m-hide")) {
                            $(".cart_step__5__view1").addClass("m-hide");
                        }
                    }
                   
                    break;
            }
        }
        click2(item: any, command: string, data: any, event: any) {
            var self = this;
            console.log(self.store);
            switch (command) {
                case "ADD":
                    var ar = ko.unwrap(self.store.cart.Products);
                    self.store.select(ar[item - 1]);
                    self.views.layout.isPricingTable(false);
                    break;
                case "REMOVE":
                    self.store.other("");
                    self.store.cart.instance.recipient("SELF");
                    self.store.select(null);
                    self.views.layout.isPricingTable(true);
                    break;
            }
        }
    }
}