namespace aspnet.Controllers
{
    public class ClientVM
    {
        public string manager { get; set; }
        public string client { get; set; }
        public string address { get; set; }
    }

    public class OpponentVM
    {
        public string opponent { get; set; }
        public string address { get; set; }
    }

    public class AuthVM
    {
        public string login { get; set; }
        public string password { get; set; }
    }
}