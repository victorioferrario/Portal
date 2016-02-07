using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.WebHost;
using System.Web.Routing;
using System.Web.SessionState;

namespace Members.Controllers
{
    public class SessionEnabledControllerHandler : HttpControllerHandler, IRequiresSessionState
    {
        public SessionEnabledControllerHandler(RouteData routeData)
            : base(routeData)
        { }
    }
   
}
