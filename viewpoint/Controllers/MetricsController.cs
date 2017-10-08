using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace viewpoint.Controllers
{
    [Route("api/[controller]")]
    public class MetricsController : Controller
    {
        private CacheHelper cacheHelper;

        private static byte[] leakedMemory;
        public MetricsController()
        {
            cacheHelper = new CacheHelper();
        }

        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            try
            {
                var metrics = cacheHelper.Get();

                var instance = Environment.GetEnvironmentVariable("INSTANCE_ID") ?? "LOCALHOST";
                metrics.InstanceName = instance;

                metrics.Version = "1.0.0.0";

                // memory
                leakedMemory = new byte[metrics.MemoryLeak];

                // latency
                await Task.Delay(metrics.LatencyOffset);

                // failure
                if (metrics.FailedState)
                {
                    return this.StatusCode(500);
                }

                return Ok(metrics);
            }
            catch (Exception ex)
            {
                return this.StatusCode(500);
            }
        }

        [HttpPost]
        public void Post([FromBody]Metrics metrics)
        {
            cacheHelper.Set(metrics);
        }

        public class Metrics
        {
            public string InstanceName { get; set; }
            public bool FailedState { get; set; }
            public int LatencyOffset { get; set; }
            public int MemoryLeak { get; set; }
            public string Version { get; set; }
        }

        public class CacheHelper
        {
            private static IDatabase database;

            public CacheHelper()
            {
                if (database == null)
                {
                    ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(
                                        "dalind.redis.cache.windows.net:6380,password=QQ7T90wQnWdFw2NpCv+IGSO6S+LOcogNm7aPC9+RzdE=,ssl=True,abortConnect=False");
                    database = redis.GetDatabase();
                }
            }

            public Metrics Get()
            {
                string x = database.StringGet("metrics");

                return (x != null) ? JsonConvert.DeserializeObject<Metrics>(x) : new Metrics();
            }

            public void Set(Metrics metrics)
            {
                var json = JsonConvert.SerializeObject(metrics);

                database.StringSet("metrics", json);
            }
        }
    }
}
