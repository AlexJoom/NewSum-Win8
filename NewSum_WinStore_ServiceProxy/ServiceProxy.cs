using NewSum_WinStore_ServiceProxy.NewSumFreeService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewSum_WinStore_ServiceProxy
{
    //http://www.silverlightrecipes.com/2012/03/consuming-soap-web-services-in-windows.html
    //http://code.msdn.microsoft.com/windowsapps/Consume-Soap-based-JSON-b6cb14c6#content
    public sealed class ServiceProxy
    {
        public static Windows.Foundation.IAsyncOperation<string> getSeperator()
        {
            return getSeperatorAsync().AsAsyncOperation();
        }
        public static Windows.Foundation.IAsyncOperation<string> getSentenceSeparator()
        {
            return getSentenceSeperatorAsync().AsAsyncOperation();
        }
        public static Windows.Foundation.IAsyncOperation<string> getCategorySources(string sCategory)
        {
            return getCategorySourcesAsync(sCategory).AsAsyncOperation();
        }
        public static Windows.Foundation.IAsyncOperation<string> getCategories(string sCategory)
        {
            return getCategoriesAsync(sCategory).AsAsyncOperation();
        }
        public static Windows.Foundation.IAsyncOperation<string> getTopicIDs(string uSources, string sCategory)
        {
            return getTopicIDsAsync(uSources, sCategory).AsAsyncOperation();
        }
        public static Windows.Foundation.IAsyncOperation<string> getTopicTitles(string uSources, string sCategory)
        {
            return getTopicTitlesAsync(uSources, sCategory).AsAsyncOperation();
        }
        public static Windows.Foundation.IAsyncOperation<string> getSummary(string sTopicID, string uSources)
        {
            return getSummaryAsync(sTopicID, uSources).AsAsyncOperation();
        }
        public static Windows.Foundation.IAsyncOperation<string> getLinkLabels()
        {
            return getLinkLabelsAsync().AsAsyncOperation();
        }

        #region internal stuff
        //TODO: Close the connection
        internal static async Task<string> getSeperatorAsync()
        {
            return await Task.Run(async () =>
            {
                var result = await GetClient().getSeparatorAsync();
                return result.Body.@return;
            });
        }
        //TODO: Close the connection
        internal static async Task<string> getSentenceSeperatorAsync()
        {
            return await Task.Run(async () =>
            {
                var result = await GetClient().getSentenceSeparatorAsync();
                return result.Body.@return;
            });
        }
        //TODO: Close the connection
        internal static async Task<string> getCategorySourcesAsync(string sCategory)
        {
            return await Task.Run(async () =>
            {
                var result = await GetClient().getCategorySourcesAsync(sCategory);
                return result.Body.@return;
            });
        }
        //TODO: Close the connection
        internal static async Task<string> getCategoriesAsync(string sCategory)
        {
            return await Task.Run(async () =>
            {
                var result = await GetClient().getCategoriesAsync(sCategory);
                return result.Body.@return;
            });
        }
        //TODO: Close the connection
        internal static async Task<string> getTopicIDsAsync(string uSources, string sCategory)
        {
            return await Task.Run(async () =>
            {
                var result = await GetClient().getTopicIDsAsync(uSources, sCategory);
                return result.Body.@return;
            });
        }
        //TODO: Close the connection
        internal static async Task<string> getTopicTitlesAsync(string uSources, string sCategory)
        {
            return await Task.Run(async () =>
            {
                var result = await GetClient().getTopicTitlesAsync(uSources, sCategory);
                return result.Body.@return;
            });
        }
        //TODO: Close the connection
        internal static async Task<string> getSummaryAsync(string sTopicID, string uSources)
        {
            return await Task.Run(async () =>
            {
                var result = await GetClient().getSummaryAsync(sTopicID, uSources);
                return result.Body.@return;
            });
        }

        //TODO: Close the connection
        internal static async Task<string> getLinkLabelsAsync()
        {
            return await Task.Run(async () =>
            {
                var result = await GetClient().getLinkLabelsAsync();
                return result.Body.@return;
            });
        }

        private static NewSumFreeServiceClient GetClient()
        {
            return new NewSumFreeService.NewSumFreeServiceClient();

        }
        #endregion
    }



}
