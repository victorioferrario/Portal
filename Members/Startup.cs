using LG.Owin.Security.Config;
using LG.Owin.Security.Core;
using LG.Owin.Security.Managers;
using Microsoft.IdentityModel.Protocols;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Notifications;
using Microsoft.Owin.Security.OpenIdConnect;
using Microsoft.Owin.Security.Provider;
using Owin;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;
using Thinktecture.IdentityModel.Client;
[assembly: OwinStartup(typeof(Members.Startup))]

namespace Members
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            AntiForgeryConfig.UniqueClaimTypeIdentifier = "sub";
            JwtSecurityTokenHandler.InboundClaimTypeMap = new Dictionary<string, string>();
            app.UseResourceAuthorization(new AuthorizationManager());
            app.UseCookieAuthentication(new CookieAuthenticationOptions()
            {
                AuthenticationType = "Cookies",
                AuthenticationMode = AuthenticationMode.Active
            });
            app.SetDefaultSignInAsAuthenticationType("External");
            app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions()
            {
                Authority = ServerSettings.Url,
                ClientId = ClientSettings.ClientID,
                ClientSecret = "51FC860D-07D3-4296-9147-2E40AC7FF6C8".Sha256(),
                Scope = "openid profile roles all_claims",
                ResponseType = "id_token token",
                RedirectUri = ClientSettings.ClientUrl,
                SignInAsAuthenticationType = "Cookies",
                UseTokenLifetime = false,
                Notifications = new OpenIdConnectAuthenticationNotifications()
                {
                    SecurityTokenValidated = async n =>
                    {
                        var nid = new ClaimsIdentity(
                            n.AuthenticationTicket.Identity.AuthenticationType,
                            LG.Owin.Security.Core.ClaimTypes.GivenName, LG.Owin.Security.Core.ClaimTypes.Role);

                        var userInfoClient = new UserInfoClient(
                            new Uri(n.Options.Authority + "/connect/userinfo"),
                            n.ProtocolMessage.AccessToken);

                        var userInfo = await userInfoClient.GetAsync();
                        userInfo.Claims.ToList().ForEach(
                            ui => nid.AddClaim(new Claim(ui.Item1, ui.Item2)));

                        // keep the id_token for logout
                        nid.AddClaim(new Claim("id_token",
                            n.ProtocolMessage.IdToken));

                        // add access token for sample API
                        nid.AddClaim(new Claim("access_token",
                            n.ProtocolMessage.AccessToken));

                        // keep track of access token expiration
                        nid.AddClaim(new Claim("expires_at",
                            DateTimeOffset.Now.AddSeconds(int.Parse(n.ProtocolMessage.ExpiresIn)).ToString()));

                        // add some other app specific claim
                        //nid.AddClaim(new Claim("app_specific", "some data"));
                        n.AuthenticationTicket = new AuthenticationTicket(nid, n.AuthenticationTicket.Properties);

                    },
                    RedirectToIdentityProvider = async (RedirectToIdentityProviderNotification<OpenIdConnectMessage, OpenIdConnectAuthenticationOptions> n) => {
                        if (n.ProtocolMessage.RequestType == OpenIdConnectRequestType.AuthenticationRequest)
                        {
                            await Startup.GetWaiter();
                            StringBuilder stringBuilder = new StringBuilder();
                            Dictionary<string, string> strs = n.OwinContext.Get<Dictionary<string, string>>("OpenIdConnect.Parameters");
                            if (strs != null)
                            {
                                foreach (KeyValuePair<string, string> keyValuePair in strs)
                                {
                                    stringBuilder.Append($" {keyValuePair.Key}={keyValuePair.Value}");
                                }
                            }
                            if (stringBuilder.Length > 0)
                            {
                                stringBuilder.Remove(0, 1);
                            }
                            n.ProtocolMessage.AcrValues = stringBuilder.ToString();
                        }
                        if (n.ProtocolMessage.RequestType == OpenIdConnectRequestType.LogoutRequest)
                        {
                            Claim claim = n.OwinContext.Authentication.User.FindFirst("id_token");
                            if (claim != null)
                            {
                                n.ProtocolMessage.IdTokenHint = claim.Value;
                            }
                        }
                    }
                }
            });
        }
    }
}

