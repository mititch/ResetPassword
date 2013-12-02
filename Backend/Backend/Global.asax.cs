//
// <copyright company="Softerra">
//    Copyright (c) Softerra, Ltd. All rights reserved.
// </copyright>
//
// <summary>
//    The application entry point
// </summary>
//
// <author email="mititch@softerra.com">Alex Mitin</author>
//
namespace Backend
{
    using System.Web.Http;
    using System.Web.Routing;

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Register Web API routes
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            // Register MVC routes
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}