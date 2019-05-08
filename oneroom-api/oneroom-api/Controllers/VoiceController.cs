using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Twilio.AspNet.Core;
using Twilio.TwiML;
using Twilio.TwiML.Voice;
using Twilio.Http;
using Microsoft.Extensions.Configuration;
using oneroom_api.data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace oneroom_api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class VoiceController : TwilioController
    {

        public IConfiguration Configuration { get; }
        private readonly OneRoomContext _context;

        public VoiceController(IConfiguration configuration, OneRoomContext context)
        {
            Configuration = configuration;
            _context = context;
        }


        [HttpGet("incoming")]
        public IActionResult HandleCall([FromQuery] string CallSid, [FromQuery] string From)
        {
            var response = new VoiceResponse();

            response.Say("Bonjour, pour vous mettre en relation avec votre correspondant, il est nécéssaire de vous identifier, quel est votre matricule ?",
                voice: Say.VoiceEnum.Man, language: Say.LanguageEnum.FrFr);

            var url = this.Configuration.GetValue<string>("HostUrl");

            response.Redirect(
                url: new Uri($"{url}/api/voice/gatherresponse"),
                method: HttpMethod.Get
                );

            return TwiML(response);
        }

        [HttpGet("gatherresponse")]
        public IActionResult GatherResponse()
        {
            var response = new VoiceResponse();

            var url = this.Configuration.GetValue<string>("HostUrl");

            response.Gather(
                    input: new List<Gather.InputEnum> { Gather.InputEnum.Speech },
                    language: Gather.LanguageEnum.FrFr,
                    action: new Uri($"{url}/api/voice/handleresponse"),
                    method: HttpMethod.Get,
                    speechTimeout: "auto"
                );
            return TwiML(response);
        }

        [HttpGet("handleresponse")]
        public IActionResult HandleResponse([FromQuery] string SpeechResult)
        {
            var response = new VoiceResponse();

            // lazy loading disabled
            _context.Challenges.Load();

            var team = _context.Teams
                .Include(t => t.TeamChallenges)
                .Where(t => t.TeamId.ToString().Equals(SpeechResult))
                .SingleOrDefault();

            if (team != null)
            {
                response.Say($"Identification validée, {team.TeamName} {team.TeamId}, ligne sécurisée établie, transfert en cours", voice: Say.VoiceEnum.Man, language: Say.LanguageEnum.FrFr);
                
                var teamChallenge = team.TeamChallenges
                    .Select(tc => tc.Challenge)
                    .Where(c => c.AppName == "voice")
                    .FirstOrDefault();
                
                if (teamChallenge != null && teamChallenge.Answers.Count > 0)
                {
                    Say.LanguageEnum language;
                    Say.VoiceEnum gender;
                    double loop;
                    
                    switch (teamChallenge.Config.GetValueOrDefault("language"))
                    {
                            case "japanese":
                                language = Say.LanguageEnum.JaJp; break;
                            case "english":
                                language = Say.LanguageEnum.EnUs; break;
                            case "italian":
                                language = Say.LanguageEnum.ItIt; break;
                            case "spanish":
                                language = Say.LanguageEnum.EsEs; break;
                            case "german":
                                language = Say.LanguageEnum.DeDe; break;
                            case "chinese":
                                language = Say.LanguageEnum.ZhCn; break;
                            default:
                                language = Say.LanguageEnum.FrFr; break;
                    }

                    switch(teamChallenge.Config.GetValueOrDefault("gender"))
                    {
                            case "male":
                                gender = Say.VoiceEnum.Woman; break;
                            case "female":
                                gender = Say.VoiceEnum.Man; break;
                            default: 
                                gender = Say.VoiceEnum.Alice; break;
                    }

                    if (teamChallenge.Config.ContainsKey("loop"))
                    {
                        try
                        {
                            loop = Convert.ToDouble(teamChallenge.Config.GetValueOrDefault("loop"));

                        }catch(Exception)
                        {
                            loop = 3;
                        }

                    } else {
                        loop = 3;
                    }

                    response.Say("" + teamChallenge.Answers.FirstOrDefault(), voice: gender, language: language, loop: (int) loop);
                }
                
                return TwiML(response);
            }
            
            response.Say($"Identification échouée, aucune équipe avec cet identifiant: '{SpeechResult}'.", voice: Say.VoiceEnum.Man, language: Say.LanguageEnum.FrFr);
   
            var url = this.Configuration.GetValue<string>("HostUrl");

            response.Redirect(
                url: new Uri($"{url}/api/voice/gatherresponse"),
                method: HttpMethod.Get
                );

            return TwiML(response);
        }
    }
}
