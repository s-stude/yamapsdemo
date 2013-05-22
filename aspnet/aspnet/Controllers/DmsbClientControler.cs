using System.Collections.Generic;
using System.Net;
using System.Web.Mvc;

namespace aspnet.Controllers
{
    public class DmsbClientController : Controller
    {
        [HttpPost]
        public ActionResult OpponentInfo(string access_token)
        {
            if (string.IsNullOrWhiteSpace(access_token))
            {
                return new HttpStatusCodeResult(
                    HttpStatusCode.Unauthorized,
                    "Invalid access token. Please try with the correct one");
            }

            return Json(new
            {
                opponent_list = new List<OpponentVM>
                        {
                            new OpponentVM
                                {
                                    opponent = "Конкурент 1",
                                    address = "крымских партизан 7",
                                },
                            new OpponentVM
                                {
                                    opponent = "Конкурент 2",
                                    address = "крымских партизан 12",
                                },
                            new OpponentVM
                                {
                                    opponent = "Конкурент 3",
                                    address = "крымских партизан 19",
                                }
                        }
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult ClientInfo(string access_token)
        {
            if (string.IsNullOrWhiteSpace(access_token))
            {
                return new HttpStatusCodeResult(
                    HttpStatusCode.Unauthorized,
                    "Invalid access token. Please try with the correct one");
            }

            return Json(new
                {
                    client_list = new List<ClientVM>
                        {
                            new ClientVM
                                {
                                    client = "Иванов",
                                    address = "крымских партизан 21",
                                    manager = "Мэн1"
                                },
                            new ClientVM
                                {
                                    client = "Петров",
                                    address = "крымских партизан 23",
                                    manager = "Мэн2"
                                },
                            new ClientVM
                                {
                                    client = "Сидоров",
                                    address = "крымских партизан",
                                    manager = "Мэн3"
                                }
                        }
                }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Auth(int? error)
        {
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