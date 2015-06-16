using System.Collections.Generic;
using System.Threading.Tasks;

namespace Incite.Cloud
{
    public interface ILogger
    {
        Task<bool> LogInfo(string type, string content);
        Task<List<LogDataDisplay>> GetResults(string query);
    }
}
