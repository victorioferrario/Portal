
import Api = require("services/routes/MemberApi");
import Clinical = require("services/routes/ClinicalApi");

class HttpService {
    routes: any;
    define: any;
    defaultOptions: {};
    constructor() {
        var self = this;
        self.routes = $.proxy || {};
        self.routes.members = new Api.MemberApi(self).instance;
        self.routes.clinical = new Clinical.ClinicalApi(self).instance;
    }
    get WebApi() {
        console.log(window.location.host);
        if (window.location.host === "localhost") {
            return "http://localhost/Members/";
        } else if (window.location.host === "10.0.75.163:3000") {
            return "http://10.0.75.163:3000/members/";
        } else {
            return "https://www.1888md.com/Members/";
        }
    }
    get WebApiBase() {
        return this.webApiBase;
    }
    /** 
    * @Helper Methods: 
    * Contains various functions for manipulating service calls.
    */
    //#region   [Helper Methods]
    invoke(url, type, urlParams, body) {
        var ajaxOptions = $.extend({},
            this.defaultOptions, {
                url: this.WebApi + url,
                type: type,
                xhrFields: {
                    withCredentials: true
                }
            });
        if (body) { ajaxOptions.data = body; } return $.ajax(ajaxOptions);

    }
    invokeLocal(url, type, urlParams, body) {
        var ajaxOptions = $.extend({},
            this.defaultOptions, {
                url: this.localApi + url,
                type: type
            });
        if (body) { ajaxOptions.data = body; } return $.ajax(ajaxOptions);
    }
    invokeBase(url, type, urlParams, body) {
        var ajaxOptions = $.extend({},
            this.defaultOptions, {
                url: this.webApiBase + url,
                type: type
            });
        if (body) { ajaxOptions.data = body; } return $.ajax(ajaxOptions);
    }
    getArgValue(val) {
        if (val === undefined || val === null) return null;
        return val;
    }
    getQueryString(params, queryString?: any) {
        queryString = queryString || "";
        for (var prop in params) {
            if (params.hasOwnProperty(prop)) {
                var val = this.getArgValue(params[prop]);
                if (val === null) continue;
                if ("" + val === "[object Object]") {
                    queryString = this.getQueryString(params[prop], queryString);
                    continue;
                }
                if (queryString != null) {
                    queryString += "&";
                } else {
                    queryString += "?";
                }
                queryString = queryString + prop + "=" + val;
            }
        }
        return queryString;
    }
    //#endregion
    /**
     * @Private Variable: Reference link to base url of Asp.NET WebAPI 2.0
      **/
    private localApi: string = "api/";
    private webApi: string = "http://localhost:26771/";
    private webApiBase: string = "http://cs1800md3.cloudapp.net/WebAPI-Base/";//http://localhost:1610/|"http://cs1800md3.cloudapp.net/WebAPI-Base/";
}
export = HttpService;