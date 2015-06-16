using System;
using System.Threading.Tasks;

namespace Incite.Cloud.Compute
{
    public class AzureJobProcessor : IJobProcessor
    {
        public async  Task<bool> CreateJob(string jobName)
        {
            return false;
        }
    }
}
