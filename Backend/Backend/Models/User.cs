namespace Backend.Models
{
    using System;

    // TODO : add descriptions
    public class User
    {
        //
        // Fields
        //

        // Some user identificator
        private Int32 id;

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

    }
}