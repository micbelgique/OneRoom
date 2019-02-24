using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using oneroom_api.Model;
using oneroom_api.SignalR;

namespace oneroom_api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(builder => 
            builder.AddPolicy("AllowSpecificOrigin",options =>
                options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()
            ));
            services.AddSignalR();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddDbContext<OneRoomContext>(options =>
                    options.UseSqlServer(Configuration.GetConnectionString("OneRoomContext")));
            // Register the Swagger services
            services.AddSwaggerDocument();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseDeveloperExceptionPage();

            app.UseHttpsRedirection();

            app.UseCors("AllowSpecificOrigin");

            app.UseSignalR(route =>
            {
                route.MapHub<CoordinatorHub>("/CoordinatorHub");
            });
            app.UseMvcWithDefaultRoute();

            // Register the Swagger generator and the Swagger UI middlewares
            app.UseSwagger();
            app.UseSwaggerUi3();
        }
    }
}
