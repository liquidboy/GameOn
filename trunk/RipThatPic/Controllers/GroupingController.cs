using Microsoft.WindowsAzure.Storage.Table;
using System.Web.Http;

namespace RipThatPic.Controllers
{
    public class GroupingController : ApiController
    {
        


    }

    public class GroupingEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public GroupingEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public GroupingEntity() { }

        public string TableName { get; set; }
        public string GroupingName { get; set; }

    }
}
