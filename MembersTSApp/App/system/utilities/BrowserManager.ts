
export module utilities.platform{
    export class BrowserManager {
        noneHTML: boolean;
        isIE: boolean;
        isMSIE: boolean;
        Browser:any;
        constructor() {
            var self = this;
            self.Browser = self.get_browser_info();
            if (self.Browser.name === "IE" || self.Browser.name === "MSIE") {
                self.isIE = true;
            } else {
                self.isIE = false;
            }
            self.isMSIE = self.Browser.name === "MSIE";
        }
        get_browser_info() {
            var ua = navigator.userAgent, tem, M = ua.match( /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i ) || [];
            if ( /trident/i.test( M[1] ) ) {
                tem = /\brv[ :]+(\d+)/g.exec( ua ) || [];
                return { name: 'IE', version: ( tem[1] || '' ) };
            }
            if ( M[1] === 'Chrome' ) {
                tem = ua.match( /\bOPR\/(\d+)/ )
                if ( tem != null ) { return { name: 'Opera', version: tem[1] }; }
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ( ( tem = ua.match( /version\/(\d+)/i ) ) != null ) { M.splice( 1, 1, tem[1] ); }
            return {
                name: M[0],
                version: M[1]
            };
        }
    }
}