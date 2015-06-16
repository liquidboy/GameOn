using System.Threading.Tasks;

namespace Incite.Cloud
{
    public interface IJobProcessor
    {
        Task<bool> CreateJob(string jobName);
    }
}
