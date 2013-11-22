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
        private const string ALLOWED_CHAR_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
        // GET api/password
        public Password Get()
        {
            return new Password { Text = GeneratePassword() };
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
            
            char[] alpha = ALLOWED_CHAR_STRING.ToCharArray();
            Random random = new Random();
            
            // Exception possible
            Int32 maxValue = ALLOWED_CHAR_STRING.Length + 3;

            char[] resultArray = new char[10];
            
            for (int i = 0; i < 10; i++)
            {
                resultArray[i] = alpha[random.Next(maxValue)];
            }
            
            return new String(resultArray);
        }


    }
}