//
// <copyright company="Softerra">
//    Copyright (c) Softerra, Ltd. All rights reserved.
// </copyright>
//
// <summary>
//    Fake data controller
// </summary>
//
// <author email="mititch@softerra.com">Alex Mitin</author>
//
namespace Backend.Controllers
{
    using System.Threading;
    using System.Web.Http;

    /// <summary>
    /// Fake data controller
    /// </summary>
    public class DataController : ApiController
    {

        /// <summary>
        /// Gets fake data.
        /// </summary>
        /// <returns></returns>
        public string Get()
        {
            Thread.Sleep(5000);
            return "data";
        }

    }
}
