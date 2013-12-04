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
    public class UserController : ApiController
    {
        // GET api/user
        public IEnumerable<User> Get()
        {
            return HttpContext.Current.Application["Users"] as IEnumerable<User>;
        }

        // GET api/user/5
        public User Get(int id)
        {
            IEnumerable<User> storage = HttpContext.Current.Application["Users"] as IEnumerable<User>;

            return storage.First(x=>x.Id == id);
        }

        // POST api/user
        public void Post([FromBody]User value)
        {
            throw new NotImplementedException();
        }

        // PUT api/user/5
        public void Put(int id, [FromBody]User value)
        {
            throw new NotImplementedException();
        }

        // DELETE api/user/5
        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

    }
}
