//
// <copyright company="Softerra">
//    Copyright (c) Softerra, Ltd. All rights reserved.
// </copyright>
//
// <summary>
//    Registers an ASP.NET routes
// </summary>
//
// <author email="mititch@softerra.com">Alex Mitin</author>
//
namespace Backend
{
    using System.Web.Mvc;
    using System.Web.Routing;

    public class RouteConfig
    {
        /// <summary>
        /// Registers an ASP.NET routes
        /// </summary>
        /// <param name="routes">RouteCollection object</param>
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}