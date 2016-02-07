using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace Members.Models
{
    public class ImageSet
    {
        public List<Image> Images
        {
            get;
            set;
        }

        public string Name
        {
            get;
            set;
        }

        public ImageSet()
        {
        }
    }
}