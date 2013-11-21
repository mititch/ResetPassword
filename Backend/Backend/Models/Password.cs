using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Password
    {
        [Required]
        [MinLength(4)]
        public String Text { get; set; }
    }
}