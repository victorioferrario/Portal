using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using LG.Owin.Security;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OpenIdConnect;
using static System.String;

namespace Members
{
    public partial class SiteMaster : MasterPage
    {
        string _antiXsrfTokenValue;

        protected void Page_Init(object sender, EventArgs e)
        {
            this._antiXsrfTokenValue = IdentityManager.AntiForgery(this.Page);
            IdentityManager.Challenge();
            Page.PreLoad += master_Page_PreLoad;
        }
        protected void master_Page_PreLoad(object sender, EventArgs e)
        {
            IdentityManager.PreLoad(this, ViewState, _antiXsrfTokenValue);
        }
        protected void Page_Load(object sender, EventArgs e)
        {

        }
    }
}