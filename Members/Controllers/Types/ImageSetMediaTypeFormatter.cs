using Members.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Members.Controllers
{
    public class ImageSetMediaTypeFormatter : MediaTypeFormatter
    {
        public ImageSetMediaTypeFormatter()
        {
            base.SupportedMediaTypes.Add(new MediaTypeHeaderValue("multipart/form-data"));
        }

        public override bool CanReadType(Type type)
        {
            return type == typeof(ImageSet);
        }

        public override bool CanWriteType(Type type)
        {
            return false;
        }

        public override async Task<object> ReadFromStreamAsync(Type type, Stream readStream, HttpContent content, IFormatterLogger formatterLogger)
        {
            MultipartMemoryStreamProvider multipartMemoryStreamProvider = await content.ReadAsMultipartAsync();
            Collection<HttpContent> contents = multipartMemoryStreamProvider.Contents;
            ImageSet imageSet = await contents.FirstOrDefault<HttpContent>((HttpContent c) => c.Headers.ContentDisposition.Name.NormalizeName() == "imageset").ReadAsAsync<ImageSet>();
            ImageSet images = imageSet;
            Collection<HttpContent> httpContents = multipartMemoryStreamProvider.Contents;
            List<HttpContent> list = (
                from c in httpContents
                where c.Headers.ContentDisposition.Name.NormalizeName().Matches("image\\d+")
                select c).ToList<HttpContent>();
            images.Images = new List<Image>();
            foreach (HttpContent httpContent in list)
            {
                List<Image> images1 = images.Images;
                Image image = new Image();
                Image image1 = image;
                image1.ImageData = await httpContent.ReadAsByteArrayAsync();
                image.MimeType = httpContent.Headers.ContentType.MediaType;
                image.FileName = httpContent.Headers.ContentDisposition.FileName.NormalizeName();
                images1.Add(image);
                images1 = null;
                image1 = null;
                image = null;
            }
            return images;
        }
    }
    public static class StringExtenstions
    {
        public static bool Matches(this string text, string pattern)
        {
            return Regex.IsMatch(text, pattern);
        }

        public static string NormalizeName(this string text)
        {
            return text.Replace("\"", "");
        }
    }
}