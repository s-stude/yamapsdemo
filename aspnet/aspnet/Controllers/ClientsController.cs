using System.Collections.Generic;
using System.Web.Mvc;

namespace aspnet.Controllers
{
    public class ClientVM
    {
        public string manager { get; set; }
        public string client { get; set; }
        public string address { get; set; }
    }

    public class ClientsController : Controller
    {
        public ActionResult ClientInfo()
        {
            Response.AddHeader("Access-Control-Allow-Origin", "*");

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
//                            new ClientVM
//                                {
//                                    Client = "",
//                                    Address = "",
//                                    manager = ""
//                                },
                        }
                }, JsonRequestBehavior.AllowGet);
        }
    }
}