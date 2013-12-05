//
// <copyright company="Softerra">
//    Copyright (c) Softerra, Ltd. All rights reserved.
// </copyright>
//
// <summary>
//    Provides an access for the User GRUD operations
// </summary>
//
// <author email="mititch@softerra.com">Alex Mitin</author>
//
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

    /// <summary>
    /// Provides an access for the User GRUD operations
    /// </summary>
    public class UserController : ApiController
    {

        /// <summary>
        /// GET api/user
        /// Get users list
        /// </summary>
        /// <returns>Users list</returns>
        public IEnumerable<User> Get()
        {
            return HttpContext.Current.Application["Users"] as IEnumerable<User>;
        }

        /// <summary>
        /// GET api/user/5
        /// Get user by identifier
        /// </summary>
        /// <returns>User</returns>
        public User Get(int id)
        {
            IEnumerable<User> storage = HttpContext.Current.Application["Users"] as IEnumerable<User>;

            return storage.First(x=>x.Id == id);
        }

        /// <summary>
        /// POST api/user
        /// Add user (not implemented)
        /// </summary>
        public void Post([FromBody]User value)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// PUT api/user/5
        /// Update user (not implemented)
        /// </summary>
        public void Put(int id, [FromBody]User value)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// DELETE api/user/5
        /// Delete user
        /// </summary>
        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

    }
}
