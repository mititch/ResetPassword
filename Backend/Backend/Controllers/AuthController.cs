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

using Backend.Models;

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
        /// <param name="model">The logon model.</param>
        public void Post(LogonModel model)
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
