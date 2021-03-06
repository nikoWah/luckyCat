"use strict";
require("dotenv").config();

const Pigpio = process.env.ENVIRONMENT !== "PRODUCTION" ?
  require("pigpio-mock") : require("pigpio");

const Express = require("express");
const Alexa = require("alexa-app");
const Gpio = Pigpio.Gpio;
const expressApp = Express();

const pin = 18;
const servoMotor = new Gpio(pin, {mode: Gpio.OUTPUT});

const intervalMillisecond = 50;
const maxPulse = parseInt(process.env.MAX_PULSE);
const minPulse = parseInt(process.env.MIN_PULSE);
const numberOfWave = parseInt(process.env.NUMBER_OF_WAVE);

const openDoorSpeeches = [
  "Yes, master!", "Yes!", "Sure!", "Meow",
  "Your wish is my command", "Open sesame",
  "Behold", "Hodor"
];

const whoBuildYouSpeeches = [
  "watashi no Master wa Niko sama", "My loyalty lies with Niko",
];

const whatDoYouLikeSpeeches = [
  "everything about ASIA!", "Fish! Definitely fish",
  "Money! Shiny Coins, notes, and credit cards", "I love Niko"
];

const getRandomSpeeches = (speeches) => {
  return speeches[Math.floor(Math.random() * speeches.length)];
}

const alexaApp = new Alexa.app("luckyCat");

alexaApp.launch(function(request, response) {
  response.say("Hello Master, thanks for awakening me.");
});

alexaApp.intent("OpenDoor", {},
  function(request, response) {
    luckyCatWave();
    response.say(getRandomSpeeches(openDoorSpeeches));
  }
);

alexaApp.intent("WhoBuildYou", {},
  function(request, response) {
    response.say(getRandomSpeeches(whoBuildYouSpeeches));
  }
);

alexaApp.intent("WhatDoYouLike", {},
  function(request, response) {
    response.say(getRandomSpeeches(whatDoYouLikeSpeeches));
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
  let numberOfLoop = numberOfWave;
  let currentPulse = minPulse;
  let pulseIncrement = 100;

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
