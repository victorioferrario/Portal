using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Members
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected async void Page_Init(object sender, EventArgs e)
        {
            var model = new LG.Owin.Identity.Models.IdentityUser()
            {
                RID = Convert.ToInt64(1001480),
                Name = "Manny",
                AccessToken = "4234521342134",
                TokenID = "3242334234"
            };
            UserContext.IsAuthenticated = true;
            UserContext.Identity = model;
        }

        protected async void Page_Load(object sender, EventArgs e)
        {

            await UserContext.Load();
            Response.Write(UserContext.PersonInfo.FName);

            if (await UserContext.LoadConsultHealthRecords())
            {
                txtOutput.Value = Newtonsoft.Json.JsonConvert.SerializeObject(UserContext.HealthRecords);
            }

        }


        public static LG.Owin.Identity.AppContextUser UserContext => LG.Owin.Identity.AppContextUser.GetCurrentSingleton();
    }
}