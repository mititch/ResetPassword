using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Backend.Models;
using System.Web;

namespace Backend.Controllers
{
    public class PasswordController : ApiController
    {
        // GET api/password
        public Password Get()
        {
            HttpContext.Current.Response.AppendHeader("Access-Control-Allow-Origin", "*");
            return new Password {Text = GeneratePassword()};
        }

        // POST api/password
        public HttpResponseMessage Post([FromBody]Password value)
        {
            return ResetPassword(value);
        }

        private HttpResponseMessage ResetPassword(Password value)
        {
            HttpResponseMessage result;
            
            if (ModelState.IsValid)
            {
                result = new HttpResponseMessage(HttpStatusCode.OK);
            }
            else
            {
                result = new HttpResponseMessage(HttpStatusCode.Conflict);
                result.ReasonPhrase = ModelState.ToString();
            }

            return result;

        }

        private string GeneratePassword() {
            return "newpassword";
        }


    }
}