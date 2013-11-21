using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Backend.Models;

namespace Backend.Controllers
{
    public class PasswordController : ApiController
    {
        // GET api/password
        public Password Get()
        {
            return new Password {Text = GeneratePassword()};
        }

        // POST api/password
        public HttpResponseMessage Post([FromBody]Password value)
        {
            HttpResponseMessage result;
            
            if (ModelState.IsValid)
            {
                ResetPassword(value.Text);
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

        private void ResetPassword(String passwordText)
        {
            
        }

    }
}