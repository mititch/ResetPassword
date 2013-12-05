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
using Backend.Models;
    using System.Collections.Generic;

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Fake passwords storage
            Application.Add("Passwords", new List<Password> {
                new Password { UserId = 1, Text = "qwerty"},
                new Password { UserId = 2, Text = "asdfgh"},
                new Password { UserId = 3, Text = "zxcvbn"}
            });

            // Fake users storage
            Application.Add("Users", new List<User> {
                new User { Id = 1},
                new User { Id = 2},
                new User { Id = 3}
            });

            // Register Web API routes
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            // Register MVC routes
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}