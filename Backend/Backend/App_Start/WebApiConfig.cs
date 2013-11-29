namespace Backend
{
    using System.Web.Http;

    public static class WebApiConfig
    {
        /// <summary>
        /// Registers an ASP.NET WEB API routes
        /// </summary>
        /// <param name="config">HttpConfiguration object</param>
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
