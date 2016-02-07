using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Microsoft.Owin.Security;

namespace Members.Incoming
{
    /// <summary>
    /// Summary description for AutoLogin
    /// </summary>
    public class AutoLogin : IHttpHandler
    {

        HttpContext __Context;

        string __ActionName => __Context.Request.Form["ActionName"];
        string __ClientName => __Context.Request.Form["ClientName"];
        string __ClientSecret => __Context.Request.Form["ClientSecret"];
        string __StoredClientSecret => ConfigurationManager.AppSettings["ClientSecret_" + __ClientName];
        string __ExternalLoginProvider => __Context.Request.Form["ExternalLoginProvider"];
        string __RID => __Context.Request.Form["RID"];

        public void ProcessRequest(HttpContext context)
        {
            __Context = context;
            if (string.IsNullOrEmpty(__ClientName)
                || string.IsNullOrEmpty(__ClientSecret)
                || string.IsNullOrEmpty(__StoredClientSecret)
                || string.IsNullOrEmpty(__ActionName)
                || string.IsNullOrEmpty(__RID)
                || __ClientSecret != __StoredClientSecret)
            {
                SendInvalidResponse("Invalid Request");
            }
            if (__ActionName == "EnsureExternalLogin")
            {
                ExternalLogin();
            }
            else if (__ActionName == "AutoLoginByRID")
            {
                Login();
            }
        }
        void SendInvalidResponse(
            string message)
        {
            __Context.Response.Clear();
            __Context.Response.Write(message);
            __Context.Response.Redirect("500Error.aspx");
        }
        public bool IsReusable
        {
            get
            {
                return true;
            }
        }

        void Login()
        {
            var ctx = __Context.Request.GetOwinContext();
            var valuesToBeSent = new Dictionary<string, string>
                {
                    {"ClientName", "Members"},
                    {"ClientSecret", ConfigurationManager.AppSettings["CLIENT:SECRET:MEMBERS"]},
                    {"ClientIPAddress", __Context.Request.ServerVariables["REMOTE_ADDR"]},
                    {"ActionName", __ActionName},
                    {"RID", __RID}
                };
            ctx.Set("OpenIdConnect.Parameters", valuesToBeSent);
            var authProperties = new AuthenticationProperties
            {
                RedirectUri = ConfigurationManager.AppSettings["CLIENT:URL:MEMBERS"]
            };
            ctx.Authentication.Challenge(authProperties);
        }
        void ExternalLogin()
        {
            var ctx = __Context.Request.GetOwinContext();
            var valuesToBeSent = new Dictionary<string, string>
                {
                    {"ClientName", "Members"},
                    {"ClientSecret", ConfigurationManager.AppSettings["CLIENT:SECRET:MEMBERS"]},
                    {"ClientIPAddress", __Context.Request.ServerVariables["REMOTE_ADDR"]},
                    {"ActionName", __ActionName},
                    {"RID", __RID},
                    { "ExternalLoginProvider",__ExternalLoginProvider}
                };
            ctx.Set("OpenIdConnect.Parameters", valuesToBeSent);
            var authProperties = new AuthenticationProperties
            {
                RedirectUri = ConfigurationManager.AppSettings["CLIENT:URL:MEMBERS"]
            };
            ctx.Authentication.Challenge(authProperties);
        }

    }
}