using System;
using Microsoft.AspNet.Builder;
using Microsoft.Framework.DependencyInjection;

namespace GameOnWeb
{
    public class Startup
    {
        public void Configure(IBuilder app)
        {
            app.UseServices(services =>
            {
                services.AddMvc();
            });

            app.UseMvc();
        }
    }
}
