namespace Backend.Controllers
{
    using System.Web;
    using System.Web.Mvc;

    /// <summary>
    /// Main application controller
    /// </summary>
    public class HomeController : Controller
    {
        /// <summary>
        /// Redirect request to static page
        /// </summary>
        public RedirectResult Index()
        {
            return Redirect("~/Static/Frontend/app/index.html");
        }
    }
}
