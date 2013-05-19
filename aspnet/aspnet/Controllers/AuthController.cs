using System.Web.Mvc;

namespace aspnet.Controllers
{
    public class LoginVM
    {
        public string Login { get; set; }
        public string Password { get; set; }
    }
    
    
    // alr9wUGYBf4783nJSByfb4


    public class AuthController : Controller
    {
        public ActionResult Login401(LoginVM loginPassword)
        {
            Response.AddHeader("Access-Control-Allow-Origin", "*");

            return Json(new
                {
                    error = new
                        {
                            code = 401,
                            error_message = "User unauthorized"
                        }
                }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Login500(LoginVM loginPassword)
        {
            Response.AddHeader("Access-Control-Allow-Origin", "*");
            return Json(new
                {
                    error = new
                        {
                            code = 500,
                            error_message = "Does not has all required fields"
                        }
                }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Login200(LoginVM loginPassword)
        {
            Response.AddHeader("Access-Control-Allow-Origin", "*");
            return Json(new
                {
                    access_token = "alr9wUGYBf4783nJSByfb4"
                }, JsonRequestBehavior.AllowGet);
        }
    }
}