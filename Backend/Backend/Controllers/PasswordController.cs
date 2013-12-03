//
// <copyright company="Softerra">
//    Copyright (c) Softerra, Ltd. All rights reserved.
// </copyright>
//
// <summary>
//    Provides an access for the reset and generate password API
// </summary>
//
// <author email="mititch@softerra.com">Alex Mitin</author>
//
namespace Backend.Controllers
{
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Backend.Models;
    using System.Web;

    /// <summary>
    /// Represents access for the reset and generate password API
    /// </summary>
    public class PasswordController : ApiController
    {
        //
        // Fields 
        //

        // Length of the password
        private const Int32 PASSWORD_LENGTH = 10;
        
        // Valid charasters for password generation
        private const String VALID_CHARACTERS_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        //
        // Methods
        //

        /// <summary>
        /// GET api/password
        /// Generates a new password
        /// TRICK: Exception can be thrown to simulate a server error
        /// </summary>
        /// <returns>A new password object</returns>
        public Password Get()
        {
            String newPassword = GeneratePassword();
            
            return new Password
            {
                Text = newPassword,
                Confirmation = newPassword
            };
        }

        /// <summary>
        /// POST api/password
        /// Resets a password if model is valid
        /// TRICK: Server side validation is different from client
        /// it is made to simulate the validation error
        /// </summary>
        /// <param name="value">Password entity from request boby</param>
        /// <returns>Success of failure responce message depends of the models state</returns>
        public HttpResponseMessage Post([FromBody]Password value)
        {
            HttpResponseMessage result;

            // Add password equals validation
            if (value.Text != value.Confirmation)
            {
                ModelState.AddModelError("Confirmation", "Passwords not equals");
            }

            // Server side validation is different from client
            // It is made to simulate the server error
            if (ModelState.IsValid)
            {
                // Return success http status
                result = new HttpResponseMessage(HttpStatusCode.OK);
            }
            else
            {
                // Return failure http status
                result = new HttpResponseMessage(HttpStatusCode.Conflict);
                result.ReasonPhrase = ModelState.ToString();
            }

            return result;
        }

        /// <summary>
        /// Generates a random password string
        /// </summary>
        /// <returns>New password string</returns>
        /// <exception>OutOfRange exception can be thrown</exception>
        private String GeneratePassword() 
        {
            Random random = new Random();
            Int32 maxValue = VALID_CHARACTERS_STRING.Length;
            Char[] resultArray = new Char[PASSWORD_LENGTH];

            // Take random chars from VALID_CHARACTERS_STRING
            for (Int32 i = 0; i < PASSWORD_LENGTH; i++)
            {
                //Out of range exception possible
                resultArray[i] = VALID_CHARACTERS_STRING[random.Next(maxValue + 1)];
            }
            
            return new String(resultArray);
        }


    }
}