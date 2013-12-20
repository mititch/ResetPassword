//
// <copyright company="Softerra">
//    Copyright (c) Softerra, Ltd. All rights reserved.
// </copyright>
//
// <summary>
//    Fake authentication controller 
//      
// </summary>
//
// <author email="mititch@softerra.com">Alex Mitin</author>
//

namespace Backend.Controllers
{
    using System;
    using System.Web.Http;

    /// <summary>
    /// Fake authentication controller 
    /// </summary>
    public class AuthController : ApiController
    {

        /// <summary>
        /// Logon.
        /// </summary>
        /// <param name="login">The login.</param>
        /// <param name="password">The password.</param>
        public void Post([FromBody]String login, [FromBody]String password)
        {
        }

        /// <summary>
        /// Logout.
        /// </summary>
        public void Delete()
        {
        }
    }
}
