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
        // Validation error possible
        [MinLength(5)]
        public String Text { get; set; }


        [Required]
        // Validation error possible
        [MinLength(5)]
        public String Confirmation { get; set; }
    }
}