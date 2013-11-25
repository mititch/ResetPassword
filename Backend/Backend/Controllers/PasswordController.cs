namespace Backend.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Backend.Models;
    using System.Web;

    public class PasswordController : ApiController
    {
        private const string VALID_CHARACTERS_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        private const Int32 PASSWORD_LENGTH = 10;

        // GET api/password
        public Password Get()
        {
            String newPassword = GeneratePassword();
            
            return new Password
            {
                Text = newPassword,
                Confirmation = newPassword
            };
        }

        // POST api/password
        public HttpResponseMessage Post([FromBody]Password value)
        {
            HttpResponseMessage result;

            if (value.Text != value.Confirmation)
            {
                ModelState.AddModelError("Confirmation", "Passwords not equals");
            }

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
            
            Char[] validCharacters = VALID_CHARACTERS_STRING.ToCharArray();
            Random random = new Random();
            
            // Exception possible
            Int32 maxValue = VALID_CHARACTERS_STRING.Length + 3;

            Char[] resultArray = new Char[PASSWORD_LENGTH];
            
            for (Int32 i = 0; i < 10; i++)
            {
                resultArray[i] = validCharacters[random.Next(maxValue)];
            }
            
            return new String(resultArray);
        }


    }
}