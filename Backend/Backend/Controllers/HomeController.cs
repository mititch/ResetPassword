//
// <copyright company="Softerra">
//    Copyright (c) Softerra, Ltd. All rights reserved.
// </copyright>
//
// <summary>
//    Default application controller
// </summary>
//
// <author email="mititch@softerra.com">Alex Mitin</author>
//
namespace Backend.Controllers
{
    using System.Web;
    using System.Web.Mvc;

    /// <summary>
    /// Default application controller
    /// </summary>
    public class HomeController : Controller
    {
        /// <summary>
        /// Default controller action
        /// </summary>
        public RedirectResult Index()
        {
            /// Redirect request to the static page
            return Redirect("~/Static/Frontend/app/index.html");
        }
    }
}
