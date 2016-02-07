using Members.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
namespace Members.Controllers.Types
{
    public class BinaryMediaTypeFormatter : MediaTypeFormatter
    {
        private static Type _supportedType;

        private bool _isAsync = true;

        public bool IsAsync
        {
            get
            {
                return this._isAsync;
            }
            set
            {
                this._isAsync = value;
            }
        }

        static BinaryMediaTypeFormatter()
        {
            BinaryMediaTypeFormatter._supportedType = typeof(byte[]);
        }

        public BinaryMediaTypeFormatter() : this(false)
        {
        }

        public BinaryMediaTypeFormatter(bool isAsync)
        {
            base.SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/octet-stream"));
            this.IsAsync = isAsync;
        }

        public override bool CanReadType(Type type)
        {
            return type == BinaryMediaTypeFormatter._supportedType;
        }

        public override bool CanWriteType(Type type)
        {
            return type == BinaryMediaTypeFormatter._supportedType;
        }

        private Task<object> GetReadTask(Stream stream)
        {
            return new Task<object>(() => {
                MemoryStream memoryStream = new MemoryStream();
                stream.CopyTo(memoryStream);
                return memoryStream.ToArray();
            });
        }

        private Task GetWriteTask(Stream stream, byte[] data)
        {
            return new Task(() => (new MemoryStream(data)).CopyTo(stream));
        }

        public override Task<object> ReadFromStreamAsync(Type type, Stream stream, HttpContent contentHeaders, IFormatterLogger formatterLogger)
        {
            Task<object> readTask = this.GetReadTask(stream);
            if (!this._isAsync)
            {
                readTask.RunSynchronously();
            }
            else
            {
                readTask.Start();
            }
            return readTask;
        }

        public override Task WriteToStreamAsync(Type type, object value, Stream stream, HttpContent contentHeaders, TransportContext transportContext)
        {
            if (value == null)
            {
                value = new byte[0];
            }
            Task writeTask = this.GetWriteTask(stream, (byte[])value);
            if (!this._isAsync)
            {
                writeTask.RunSynchronously();
            }
            else
            {
                writeTask.Start();
            }
            return writeTask;
        }
    }
}