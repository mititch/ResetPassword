//
// <copyright company="Softerra">
//    Copyright (c) Softerra, Ltd. All rights reserved.
// </copyright>
//
// <summary>
//    Password view model
// </summary>
//
// <author email="mititch@softerra.com">Alex Mitin</author>
//
namespace Backend.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// Password view model
    /// </summary>
    public class Password
    {
        //
        // Fields
        //

        // Password string
        private String text;

        // Some user identificator
        private Int32 userId;
        
        //
        // Properties
        //

        /// <summary>
        /// Gets and sets password test field
        /// </summary>
        [Required]
        [StringLength(int.MaxValue, MinimumLength = 5)]
        public String Text 
        {
            get { return this.text; }
            set { this.text = value; }
        }

        /// <summary>
        /// Gets and sets entity identificator
        /// </summary>
        public Int32 UserId
        {
            get { return this.userId; }
            set { this.userId = value; }
        }
    }
}