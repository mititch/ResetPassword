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

        // Password confirmation string
        private String confirmation;

        // Password string
        private String text;
        
        //
        // Properties
        //

        /// <summary>
        /// Gets and sets password confirmation field
        /// </summary>
        [Required]
        // Validation error possible
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
        // Validation error possible
        [StringLength(int.MaxValue, MinimumLength = 5)]
        public String Text 
        {
            get { return this.text; }
            set { this.text = value; }
        }
    }
}