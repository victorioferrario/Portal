using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using LG.Owin.Security;
using System.Web.UI.WebControls;

namespace Members
{
    public partial class Logout : System.Web.UI.Page
    {
        string _antiXsrfTokenValue;
        protected void Page_Init(object sender, EventArgs e)
        {
            this._antiXsrfTokenValue = IdentityManager.AntiForgery(this.Page);
            IdentityManager.SignOut();
            Response.Redirect("~/default.aspx");
        }
        protected void master_Page_PreLoad(object sender, EventArgs e)
        {
         //   IdentityManager.PreLoad(this, ViewState, _antiXsrfTokenValue);
        }
    }
}