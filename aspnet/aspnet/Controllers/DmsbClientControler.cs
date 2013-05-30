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
                                    opponent = "Конкурент Иванов",
                                    address = "Москва Знаменка 15",
                                },
                            new OpponentVM
                                {
                                    opponent = "Конкурент Петров",
                                    address = "Москва Колымажный переулок 10",
                                },
                            new OpponentVM
                                {
                                    opponent = "Конкурент Сидоров",
                                    address = "Москва Тверской бульвар 20",
                                },
                            new OpponentVM
                                {
                                    opponent = "Конкурент Смирнов",
                                    address = "Леонтьевский переулок 15"
                                },
                            new OpponentVM
                                {
                                    opponent = "Конкурент Терещенко",
                                    address = "Москва Новый Арбат 15",
                                },
                            new OpponentVM
                                {
                                    opponent = "Конкурент Иванкин",
                                    address = "Киев Гайдара 27",
                                },
                            new OpponentVM
                                {
                                    opponent = "Конкурент Иванов",
                                    address = "крымских партизан 7",
                                },
                            new OpponentVM
                                {
                                    opponent = "Конкурент Петров",
                                    address = "крымских партизан 12",
                                },
                            new OpponentVM
                                {
                                    opponent = "Конкурент Сидоров",
                                    address = "Саксаганского 60",
                                },
                            new OpponentVM
                                {
                                    opponent = "Конкурент Смирнов",
                                    address = "Саксаганского 87",
                                },
                            new OpponentVM
                                {
                                    opponent = "Конкурент Терещенко",
                                    address = "Жилянская 69",
                                },
                            new OpponentVM
                                {
                                    opponent = "Конкурент Иванкин",
                                    address = "Гайдара 27",
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
                                    client = "Клиент Иванов",
                                    address = "Москва Вознесенский переулок 20",
                                    manager = "Manager 1"
                                },
                            new ClientVM
                                {
                                    client = "Клиент Петров",
                                    address = "Москва Камергерский переулок 2",
                                    manager = "Manager 2"
                                },
                            new ClientVM
                                {
                                    client = "Клиент Сидоров",
                                    address = "Москва Моховая улица 11",
                                    manager = "Manager 3"
                                },
                            new ClientVM()
                                {
                                    client = "Client: Ivanov",
                                    address = "Москва Большая Никитская 8",
                                    manager = "Manager 4"
                                },
                            new ClientVM()
                                {
                                    client = "Client: Petrov",
                                    address = "Москва улица Воздвиженка 12",
                                    manager = "Manager 5"
                                },
                            new ClientVM()
                                {
                                    client = "Client: Sidorov",
                                    address = "Москва Газетный переулок",
                                    manager = ""
                                },

                            new ClientVM
                                {
                                    client = "Клиент Иванов",
                                    address = "крымских партизан 21",
                                    manager = "Менеджер 1"
                                },
                            new ClientVM
                                {
                                    client = "Клиент Петров",
                                    address = "крымских партизан 23",
                                    manager = "Менеджер 2"
                                },
                            new ClientVM
                                {
                                    client = "Клиент Сидоров",
                                    address = "крымских партизан",
                                    manager = "Mенеджер 3"
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

            _token = _token ?? Guid.NewGuid().ToString();

            return Json(new
                {
                    access_token = _token
                }, JsonRequestBehavior.AllowGet);
        }
    }
}