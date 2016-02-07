using Members.Controllers.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.WebHost;
using Members.Controllers;
using System.Web.Http.ExceptionHandling;

namespace Members
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Web API configuration and services
            var cors = new EnableCorsAttribute(
                "*", "*", "*");

            config.EnableCors(cors);
            config.Formatters.Add(new BinaryMediaTypeFormatter());

            var httpControllerRouteHandler = typeof(HttpControllerRouteHandler).GetField("_instance",
                         BindingFlags.Static |
                         BindingFlags.NonPublic);

            httpControllerRouteHandler?.SetValue(null,
                new Lazy<HttpControllerRouteHandler>(() => new Members.Controllers.SessionEnabledHttpControllerRouteHandler(), true));

            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Services.Add(typeof(IExceptionLogger), new Members.App_Start.AiExceptionLogger());
            // Capture exceptions for Application Insights:
           
        }
    }
}
