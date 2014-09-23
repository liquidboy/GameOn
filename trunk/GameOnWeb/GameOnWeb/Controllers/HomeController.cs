using Microsoft.AspNet.Mvc;

namespace GameOnWeb.Controllers
{
    public class HomeController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            ViewBag.LastRefreshed = AzureLib.NotificationCenter.Refresh();

            return View();
        }
    }
}
