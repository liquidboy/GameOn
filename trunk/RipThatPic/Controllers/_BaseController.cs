using Incite.Cloud.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace RipThatPic.Controllers
{
    public class _BaseController : ApiController
    {

        internal AzureProcessor GetAzureProcessor()
        {
            return new AzureProcessor(AzureProcessor.Location.Sydney); 
        }

        internal string CleanContainerName(string cn)
        {
            return cn.Trim().ToLower();
        }


        internal List<FontEntity> GetFonts(string fontDisplayIds)
        {
            var listOfFonts = new List<FontEntity>();

            if (!string.IsNullOrEmpty(fontDisplayIds))
            {
                var processor = GetAzureProcessor();

                var fonts = processor.RetrieveAll("Font");
                var parts = fontDisplayIds.Split(",".ToCharArray());
                foreach (var part in parts)
                {
                    foreach (FontEntity font in fonts)
                    {
                        if (font.DisplayId.ToString().ToLower() == part.ToLower())
                        {
                            listOfFonts.Add(font);
                        }
                    }
                }
            }

            return listOfFonts;
        }

        internal string GetClientIp(HttpRequestMessage request = null)
        {
            request = request ?? Request;

            if (request.Properties.ContainsKey("MS_HttpContext"))
            {
                return ((System.Web.HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserHostAddress;
            }
            //else if (request.Properties.ContainsKey(RemoteEndpointMessageProperty.Name))
            //{
            //    RemoteEndpointMessageProperty prop = (RemoteEndpointMessageProperty)request.Properties[RemoteEndpointMessageProperty.Name];
            //    return prop.Address;
            //}
            else if (System.Web.HttpContext.Current != null)
            {
                return System.Web.HttpContext.Current.Request.UserHostAddress;
            }
            else
            {
                return null;
            }
        }

        internal string GetUserAgent(HttpRequestMessage request = null)
        {
            request = request ?? Request;

            if (request.Properties.ContainsKey("MS_HttpContext"))
            {
                return ((System.Web.HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserAgent;
            }
            //else if (request.Properties.ContainsKey(RemoteEndpointMessageProperty.Name))
            //{
            //    RemoteEndpointMessageProperty prop = (RemoteEndpointMessageProperty)request.Properties[RemoteEndpointMessageProperty.Name];
            //    return prop.Address;
            //}
            else if (System.Web.HttpContext.Current != null)
            {
                return System.Web.HttpContext.Current.Request.UserAgent;
            }
            else
            {
                return null;
            }
        }

    }





}
