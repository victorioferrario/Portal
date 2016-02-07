using System;
using System.Runtime.CompilerServices;

namespace Members.Models
{
    public class Image
    {
        public string FileName
        {
            get;
            set;
        }

        public byte[] ImageData
        {
            get;
            set;
        }

        public string MimeType
        {
            get;
            set;
        }

        public Image()
        {
        }
    }
}