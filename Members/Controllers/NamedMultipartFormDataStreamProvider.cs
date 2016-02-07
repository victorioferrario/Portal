using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Members.Controllers
{
    public class NamedMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
    {
        public NamedMultipartFormDataStreamProvider(string fileName) : base(fileName)
        {
        }

        public override string GetLocalFileName(HttpContentHeaders headers)
        {
            var localFileName = base.GetLocalFileName(headers);
            if (!string.IsNullOrEmpty(headers.ContentDisposition.FileName))
            {
                localFileName = headers.ContentDisposition.FileName;
            }
            if (localFileName.StartsWith("\"") && localFileName.EndsWith("\""))
            {
                localFileName = localFileName.Trim(new char[] { '\"' });
            }
            if (localFileName.Contains("/") || localFileName.Contains("\\"))
            {
                localFileName = Path.GetFileName(localFileName);
            }
            return localFileName;
        }
    }
}