require('dotenv').config();

const Pigpio = process.env.NODE_ENV !== "PRODUCTION" ?
  require("pigpio-mock") : require("pigpio");

const Express = require("express");
const Alexa = require("alexa-app");
const Gpio = Pigpio.Gpio;
const expressApp = Express();

const pin = 18;
const servoMotor = new Gpio(pin, {mode: Gpio.OUTPUT});

const intervalMillisecond = 50;
const maxPulse = 1800;
const minPulse = 800;

const yesSpeeches = [
  "Yes, master!", "Yes!", "Sure!", "Meow",
  "Your wish is my command", "Open sesame",
  "Behold", "Hodor"
];

const getRandomYesSpeech = () => {
  return yesSpeeches[Math.floor(Math.random() * yesSpeeches.length)];
}

const alexaApp = new Alexa.app("luckyCat");

alexaApp.launch(function(request, response) {
  response.say("Hello Master, thanks for awakening me.");
});

alexaApp.intent("OpenDoor", {},
  function(request, response) {
    luckyCatWave();
    response.say(getRandomYesSpeech());
  }
);

alexaApp.intent("AMAZON.StopIntent", {},
  function(request, response) {
    response.say("ok, fine");
  }
);

alexaApp.intent("AMAZON.CancelIntent", {},
  function(request, response) {
    response.say("ok, good bye");
  }
);

alexaApp.express({ expressApp: expressApp, checkCert: false, debug: true });
expressApp.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));

const luckyCatWave = () => {
  let numberOfLoop = 4;
  let pulseIncrement = 100;
  let currentPulse = minPulse;

  const servoWaveAction = () => {
    servoMotor.servoWrite(currentPulse);

    if (currentPulse >= maxPulse && pulseIncrement > 0
      || currentPulse <= minPulse && pulseIncrement < 0) {
      pulseIncrement = pulseIncrement * -1;

      if (numberOfLoop-- === 1) {
          clearInterval(wave);
          return;
      }
    }
    currentPulse += pulseIncrement;
  }

  const wave = setInterval(servoWaveAction, intervalMillisecond);
}
