using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Optimization;

namespace RipThatPic
{
    public static class BundleConfig
    {
        //details on how to implement bundling in webforms/pages/mvc/
        //http://www.asp.net/mvc/overview/performance/bundling-and-minification

        public static void RegisterBundles(BundleCollection bundles)
        {
            //note: the call to ignorelist.clear() was to overcome an issue where STYLE BUNDLES were not rendering
            //http://stackoverflow.com/questions/12533591/why-are-my-style-bundles-not-rendering-correctly-in-asp-net-mvc-4
            bundles.IgnoreList.Clear();

            bundles.Add(new ScriptBundle("~/config/controllers-js-libraries")
               .Include(
                   "~/angularApp/controllers/Config/config.js",
                   "~/angularApp/controllers/Config/configArea.js",
                   "~/angularApp/controllers/Config/configComment.js",
                   "~/angularApp/controllers/Config/configVideo.js",
                   "~/angularApp/controllers/Config/configImage.js",
                   "~/angularApp/controllers/Config/configDocument.js",
                   "~/angularApp/controllers/Config/configLink.js",
                   "~/angularApp/controllers/Config/configFilestorage.js",
                   "~/angularApp/controllers/Config/configFont.js",
                   "~/angularApp/controllers/Config/configSession.js",
                   "~/angularApp/controllers/Config/configSetting.js",
                   "~/angularApp/controllers/Config/configUser.js",
                   "~/angularApp/controllers/Config/configPage.js",
                   "~/angularApp/controllers/Config/configDatacenter.js",
                   "~/angularApp/controllers/Config/configList.js",
                   "~/angularApp/controllers/Config/configPost.js",
                   "~/angularApp/controllers/Config/configPermission.js",
                   "~/angularApp/controllers/Config/configMap.js",
                   "~/angularApp/controllers/Config/configService.js",
                   "~/angularApp/controllers/Config/configExtension.js",
                   "~/angularApp/controllers/Config/configTheme.js",
                   "~/angularApp/controllers/Config/configLog.js",
                   "~/angularApp/controllers/Config/configInstall.js",
                   "~/angularApp/controllers/Config/configVersion.js",
                   "~/angularApp/controllers/Config/configGrouping.js",
                   "~/angularApp/controllers/Config/configEditor.js",
                   "~/angularApp/controllers/Config/configBanner.js"
               ));


            bundles.Add(new ScriptBundle("~/default/directives-js-libraries")
                .Include(
                    "~/angularApp/directives/billboard.js",
                    "~/angularApp/directives/inlineWindow.js",
                    "~/angularApp/directives/workarea.js",
                    "~/angularApp/directives/configMenu.js",
                    "~/angularApp/directives/configFooter.js",
                    "~/angularApp/directives/fileStorageList.js",
                    "~/angularApp/directives/fileStorageBillboard.js",
                    "~/angularApp/directives/fileStoragePicker.js",
                    "~/angularApp/directives/fontPicker.js",
                    "~/angularApp/directives/fileUpload.js",
                    "~/angularApp/directives/pageLite.js",
                    "~/angularApp/directives/postLite.js",
                    "~/angularApp/directives/pagesList.js",
                    "~/angularApp/directives/publicFooter.js"
                ));


            bundles.Add(new ScriptBundle("~/default/services-js-libraries")
                .Include(
                    "~/angularApp/services/serviceHelper.js",
                    "~/angularApp/services/dataService.js",
                    "~/angularApp/services/instanceFactory.js",
                    "~/angularApp/services/authService.js",
                    "~/angularApp/services/radioPubSubService.js",
                    "~/angularApp/services/realtimeDataService.js"
                ));


            bundles.Add(new ScriptBundle("~/default/thirdparty-js-libraries")
                .Include(
                    "~/Scripts/jquery-2.1.4.min.js",
                    "~/Scripts/angular.js",
                    "~/Scripts/angular-resource.js",
                    "~/Scripts/angular-route.js",
                    "~/Scripts/angular-sanitize.js",
                    "~/Scripts/angular-animate.js",
                    "~/Scripts/plupload/moxie.js",
                    "~/Scripts/plupload/plupload.dev.js",
                    "~/Scripts/radio.min.js",
                    "~/Scripts/jquery.signalR-2.2.0.min.js",
                    "~/signalr/hubs",
                    "~/Scripts/justified/jquery.justifiedGallery.min.js",
                    "~/Scripts/utilities/date-extensions.js"
                    //, "~/Scripts/tinymce/tinymce.min.js"
                ));




            bundles.Add(new ScriptBundle("~/default/realtime-js-libraries")
                .Include(
                    "~/Scripts/jquery.signalR-2.2.0.min.js",
                    "~/signalr/hubs"
                ));

            bundles.Add(new StyleBundle("~/default/css-libraries")
               .Include(
                   "~/Themes/Default.css",
                   "~/Themes/ConfigMenu.css",
                   "~/Themes/ConfigFooter.css",
                   "~/Themes/Configuration.css",
                   "~/Themes/Notifications.css",
                   "~/Themes/FileUpload.css",
                   "~/Themes/FileStorageBillboard.css",
                   "~/Themes/FileStorageList.css",
                   "~/Themes/FileStoragePicker.css",
                   "~/Themes/FontPicker.css",
                   "~/Themes/InlineWindow.css",
                   "~/Themes/PageLite.css",
                   "~/Themes/PostLite.css",
                   "~/Themes/PagesList.css",
                   "~/Themes/PublicFooter.css",
                   "~/Scripts/justified/justifiedGallery.min.css"
               ));



        }
    }
}
