using LG.Data.Models.Orders;
using LG.Data.Orders;
using LG.Owin.Identity;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Members.Controllers
{
    [EnableCors("*", "*", "*")]
    public class MediaController : ApiController
    {
        private readonly static string ServerUploadFolder;

        protected static AppContextUser UserContext
        {
            get
            {
                return AppContextUser.GetCurrentSingleton();
            }
        }

        static MediaController()
        {
            MediaController.ServerUploadFolder = "C:\\Temp";
        }

        public MediaController()
        {
        }

        [HttpPost]
        public async Task<List<ConsultationFileAttachment>> PostFormData()
        {
            List<ConsultationFileAttachment> consultationFileAttachments;
            Func<string, IEnumerable<string>> func;
            Func<string, IEnumerable<string>> func1 = null;
            Func<string, IEnumerable<string>> func2 = null;
            List<ConsultationFileAttachment> consultationFileAttachments1 = new List<ConsultationFileAttachment>();
            HttpRequest request = HttpContext.Current.Request;
            HttpContext.Current.Server.MapPath("~/App_Data");
            NamedMultipartFormDataStreamProvider namedMultipartFormDataStreamProvider = new NamedMultipartFormDataStreamProvider(HttpContext.Current.Server.MapPath("~/App_Data/"));
            await this.Request.Content.ReadAsMultipartAsync<NamedMultipartFormDataStreamProvider>(namedMultipartFormDataStreamProvider);
            StringBuilder stringBuilder = new StringBuilder();
            try
            {
                string empty = string.Empty;
                int num = 0;
                string[] allKeys = namedMultipartFormDataStreamProvider.FormData.AllKeys;
                Func<string, IEnumerable<string>> func3 = func1;
                if (func3 == null)
                {
                    Func<string, IEnumerable<string>> values = (string key) =>
                        from val in namedMultipartFormDataStreamProvider.FormData.GetValues(key)
                        where key == "inputDescription"
                        select val;
                    func = values;
                    func1 = values;
                    func3 = func;
                }
                foreach (string str in allKeys.SelectMany<string, string>(func3))
                {
                    empty = str;
                }
                string[] strArrays = namedMultipartFormDataStreamProvider.FormData.AllKeys;
                Func<string, IEnumerable<string>> func4 = func2;
                if (func4 == null)
                {
                    Func<string, IEnumerable<string>> values1 = (string key) =>
                        from val in namedMultipartFormDataStreamProvider.FormData.GetValues(key)
                        where key == "inputConsultationID"
                        select val;
                    func = values1;
                    func2 = values1;
                    func4 = func;
                }
                foreach (string str1 in strArrays.SelectMany<string, string>(func4))
                {
                    num = Convert.ToInt32(str1);
                }
                if (num != 0)
                {
                    foreach (MultipartFileData fileDatum in namedMultipartFormDataStreamProvider.FileData)
                    {
                        FileInfo fileInfo = new FileInfo(fileDatum.LocalFileName);
                        FileStream fileStream = fileInfo.OpenRead();
                        int num1 = Convert.ToInt32(fileStream.Length);
                        byte[] numArray = new byte[num1];
                        await fileStream.ReadAsync(numArray, 0, num1);
                        List<ConsultationFileAttachment> consultationFileAttachments2 = consultationFileAttachments1;
                        ConsultationFileAttachment consultationFileAttachment = new ConsultationFileAttachment()
                        {
                            ConsultationID = num,
                            FilePlainBytes = numArray,
                            Description = empty,
                            FileFullName = fileInfo.Name,
                            CorporationRID = (long)10
                        };
                        consultationFileAttachments2.Add(consultationFileAttachment);
                        fileInfo = null;
                        numArray = null;
                    }
                }
                consultationFileAttachments = await this.updateService(consultationFileAttachments1);
            }
            catch (Exception exception1)
            {
                Exception exception = exception1;
                List<ConsultationFileAttachment> consultationFileAttachments3 = consultationFileAttachments1;
                ConsultationFileAttachment consultationFileAttachment1 = new ConsultationFileAttachment()
                {
                    IsError = true,
                    Message = exception.Message
                };
                consultationFileAttachments3.Add(consultationFileAttachment1);
                consultationFileAttachments = consultationFileAttachments1;
            }
            return consultationFileAttachments;
        }

        private async Task<byte[]> ReadFile(HttpPostedFile file)
        {
            byte[] numArray = new byte[file.ContentLength];
            await file.InputStream.ReadAsync(numArray, 0, file.ContentLength);
            return numArray;
        }

        private StreamContent StreamConversion()
        {
            Stream result = base.Request.Content.ReadAsStreamAsync().Result;
            MemoryStream memoryStream = new MemoryStream();
            result.CopyTo(memoryStream);
            memoryStream.Seek((long)0, SeekOrigin.End);
            StreamWriter streamWriter = new StreamWriter(memoryStream);
            streamWriter.WriteLine();
            streamWriter.Flush();
            memoryStream.Position = (long)0;
            StreamContent streamContent = new StreamContent(memoryStream);
            foreach (KeyValuePair<string, IEnumerable<string>> header in base.Request.Content.Headers)
            {
                streamContent.Headers.Add(header.Key, header.Value);
            }
            return streamContent;
        }

        private async Task<List<LG.Data.Models.Orders.ConsultationFileAttachment>> updateService(
             List<LG.Data.Models.Orders.ConsultationFileAttachment> list)
        {
            var result = new List<LG.Data.Models.Orders.ConsultationFileAttachment>();
            foreach (var item in list)
            {
                result.Add(await LG.Data.Orders.OrderService.StoreFile(item));
            }
            return result;
        }
    }
}