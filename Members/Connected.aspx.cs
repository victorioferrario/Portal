using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using LG.Owin.Security;

namespace Members
{
    public partial class Connected : System.Web.UI.Page
    {
        string _antiXsrfTokenValue = string.Empty;
        const string AntiXsrfTokenKey = "__AntiXsrfToken";
        const string AntiXsrfUserNameKey = "__AntiXsrfUserName";
            
        protected void Page_Init(object sender, EventArgs e)
        {
            this._antiXsrfTokenValue = IdentityManager.AntiForgery(this);
            IdentityManager.Challenge();
        }
        protected async void Page_Load(object sender, EventArgs e)
        {
           await IdentityManager.StartAsync();
        }
    }
}