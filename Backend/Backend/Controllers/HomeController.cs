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
            /// Redirect request to static page
            return Redirect("~/Static/Frontend/app/index.html");
        }
    }
}
