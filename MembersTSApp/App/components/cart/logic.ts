declare var localforage;
export namespace components.cart.logic {
    export class ActivityTracker {
        getHandler: Function;
        setHandler: Function;
        removeHandler: Function;
        localforage: LocalForage;
        constructor(getCallBack, setCallBack, removeCallBack) {
            var self = this;
            self.localforage = localforage;
            self.localforage.config({
                name: "1800MD-Members-Checkout-Tracker"
            });
            self.getHandler = getCallBack;
            self.setHandler = setCallBack;
        }
        getItem(key: string) {
            var self = this;
            self.localforage.getItem(key, (err, value) => {
                console.log(value, err);
                self.getHandler(value, err);
            });
        }
        setItem(key: string, item: any) {
            var self = this;
            self.localforage.setItem(key, item, (err, value) => {
                // Do other things once the value has been saved.
                console.log(value, err);
                self.setHandler(value, err);
            });
        }
        removeItem(key: string) {
            var self = this;
            self.localforage.removeItem(key, self.removeHandler());
        }
    }
}