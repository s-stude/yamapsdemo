using System.Web.Mvc;

namespace aspnet.Controllers
{
    public class DmsbClientController : Controller
    {
       public ActionResult Auth(int? error)
        {
            Response.AddHeader("Access-Control-Allow-Origin", "*");

            if (error.HasValue && error.Value == 401)
            {
                return Json(new
                    {
                        error = new
                            {
                                code = 401,
                                error_message = "User unauthorized"
                            }
                    }, JsonRequestBehavior.AllowGet);
            }

            if (error.HasValue && error.Value == 500)
            {
                return Json(new
                    {
                        error = new
                            {
                                code = 500,
                                error_message = "Does not has all required fields"
                            }
                    }, JsonRequestBehavior.AllowGet);
            }

            return Json(new
                {
                    access_token = "alr9wUGYBf4783nJSByfb4"
                }, JsonRequestBehavior.AllowGet);
        }
    }
}