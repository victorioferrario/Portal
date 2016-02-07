using System;
using System.Web;
using System.Web.Http.WebHost;
using System.Web.Routing;

namespace Members.Controllers
{
    public class SessionEnabledHttpControllerRouteHandler : HttpControllerRouteHandler
    {
        public SessionEnabledHttpControllerRouteHandler()
        {
        }

        protected override IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            return new SessionEnabledControllerHandler(requestContext.RouteData);
        }
    }
}