using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TensorFlow;

namespace oneroom_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomVisionController : ControllerBase
    {
        [HttpGet]
        public ActionResult Endpoint()
        {
            return Ok();
        }

        [HttpPost]
        public ActionResult Predict(IFormFile image)
        {

            var graph = new TFGraph();
            var model = System.IO.File.ReadAllBytes(@"..\Assets\model.pb");
            var labels = System.IO.File.ReadAllLines(@"..\Assets\labels.txt");
            graph.Import(model);

            var bestIdx = 0;
            float best = 0;

            using (var session = new TFSession(graph))
            {
                var tensor = ImageUtil.CreateTensorFromImageFile(image.FileName);
                var runner = session.GetRunner();
                runner.AddInput(graph["Placeholder"][0], tensor).Fetch(graph["loss"][0]);
                var output = runner.Run();
                var result = output[0];

                var probabilities = ((float[][])result.GetValue(jagged: true))[0];
                for (int i = 0; i < probabilities.Length; i++)
                {
                    if (probabilities[i] > best)
                    {
                        bestIdx = i;
                        best = probabilities[i];
                    }
                }
            }


            return Ok(new { labels = labels[bestIdx], confidence = best*100.0 });
        }
    
    }
}