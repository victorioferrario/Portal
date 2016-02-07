using System;
using System.Web.UI;
using LG.Owin.Security;

namespace Members
{
    public partial class _Default : Page
    {

        public static LG.Owin.Identity.AppContextUser UserContext => LG.Owin.Identity.AppContextUser.GetCurrentSingleton();

        protected void Page_Init(object sender, EventArgs e)
        {
            IdentityManager.Challenge();
        }
        protected void onSignOut(object sender, EventArgs e)
        {
            IdentityManager.SignOut();
        }
        public String Payload { get; set; }
        protected async void Page_Load(object sender, EventArgs e)
        {
            if (UserContext.IsAuthenticated)
            {
               var result = await UserContext.Load();
                if (result)
                {
                    Payload = Newtonsoft.Json.JsonConvert.SerializeObject(UserContext);
                }
            }
            //await LG.Owin.Security.IdentityManager.StartAsync();
        }
        
    }
}