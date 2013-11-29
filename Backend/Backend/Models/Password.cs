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

        // Some identificator
        private Int32 id;

        // Password confirmation string
        private String confirmation;

        // Password string
        private String text;
        
        //
        // Properties
        //

        /// <summary>
        /// Gets and sets entity identificator
        /// </summary>
        public Int32 Id
        {
            get { return this.id; }
            set { this.id = value; }
        }

        /// <summary>
        /// Gets and sets password confirmation field
        /// </summary>
        [Required]
        [StringLength(int.MaxValue, MinimumLength = 5)]
        public String Confirmation
        {
            get { return this.confirmation; }
            set { this.confirmation = value; }
        }

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
    }
}