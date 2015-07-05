using Incite.Cloud.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace RipThatPic.Controllers
{
    public class LoginController : _BaseController
    {

       

        // POST: api/Login
        [HttpPost]
        public LoginEntity Post([FromBody]LoginEntity loginEntity)
        {
            loginEntity.IsSuccessful = false;
            loginEntity.SessionId = Guid.Empty;
            loginEntity.DisplayName = string.Empty;


            if (string.IsNullOrEmpty(loginEntity.Username) || string.IsNullOrEmpty(loginEntity.Password)) return loginEntity;

            //var processor = GetAzureProcessor();
            //var ret = await processor.CreateTable("Login");
            //return await processor.AddToTable("Log", data);

            loginEntity.SessionId = Guid.NewGuid();
            loginEntity.IsSuccessful = true;
            loginEntity.DisplayName = "Anonymous";

            return loginEntity;

        }




        


    }


    

    public class LoginEntity 
    {
        public bool IsSuccessful { get; set; }
        public Guid SessionId { get; set; }

        public string DisplayName { get; set; }

        public string Username { get; set; }
        public string Password { get; set; }


        public LoginEntity() { }
    
    }
}
