using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Mvc;

namespace aspnet.Controllers
{
    public class DmsbClientController : Controller
    {
        private static string _token;

        [HttpPost]
        public ActionResult OpponentInfo(string access_token)
        {
            ActionResult incorrectTokenResult;
            if (!VerifyToken(access_token, out incorrectTokenResult))
                return incorrectTokenResult;

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

        private static bool VerifyToken(string access_token, out ActionResult result)
        {
            result = new HttpStatusCodeResult(
                HttpStatusCode.Conflict,
                "Invalid access token. Please try with the correct one");

            return !string.IsNullOrWhiteSpace(access_token) && _token.Equals(access_token);
        }

        [HttpPost]
        public ActionResult ClientInfo(string access_token)
        {
            ActionResult incorrectTokenResult;
            if (!VerifyToken(access_token, out incorrectTokenResult))
                return incorrectTokenResult;

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
                                },
                            new ClientVM()
                                {
                                    client = "Ivanov",
                                    address = "Саксаганского 66В",
                                    manager = ""
                                },
                            new ClientVM()
                                {
                                    client = "Petrov",
                                    address = "Саксаганского 66В",
                                    manager = ""
                                },
                            new ClientVM()
                                {
                                    client = "Sidorov",
                                    address = "Жилянская 55",
                                    manager = ""
                                },
                            new ClientVM()
                                {
                                    client = "Trenev",
                                    address = "Саксаганского 70",
                                    manager = ""
                                },
                        }
                }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Auth(AuthVM auth)
        {
            if (auth.login != "demo")
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

            if (auth.password != "demo")
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

            var next = new Random().Next(0, 2);

            if (next == 0)
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

            _token = Guid.NewGuid().ToString();

            return Json(new
                {
                    access_token = _token
                }, JsonRequestBehavior.AllowGet);
        }
    }
}