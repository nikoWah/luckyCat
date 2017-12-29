import PiServo from "pi-servo";

// const pwmRange = 2000;
// const pwmClockDiv = 8;
const interval = 5;

const maxPulse = 180;
const minPulse = 80;

// rpio.open(gpio, rpio.PWM);
// rpio.pwmSetClockDivider(pwmClockDiv);
// rpio.pwmSetRange(gpio, pwmRange);
const pin = 18;
let numberOfLoop = 2;
// pass the GPIO number

let direction = 1;
let currentPulse = minPulse;

const servo = new PiServo(pin);

servo.open().then(function(){
  const wave = setInterval(function() {
    servo.setDegree(currentPulse); // 0 - 180
      if (currentPulse === minPulse) {
        direction = 1;
        if (numberOfLoop-- === 0) {
            clearInterval(wave);
            return;
        }
      } else if (currentPulse === maxPulse) {
        direction = -1;
      }
      currentPulse += direction;
  }, interval, currentPulse, direction, numberOfLoop);
}).catch((error) => {
  console.log("some error occurred", error)
});

// servo.open().then(function(){
//   const wave = setInterval(function() {
//     servo.setDegree(currentPulse); // 0 - 180
//       if (currentPulse === minPulse) {
//               direction = 1;
//               if (numberOfLoop-- === 0) {
//                   clearInterval(wave);
//                   return;
//               }
//       } else if (currentPulse === maxPulse) {
//         direction = -1;
//       }
//       currentPulse += direction;
//   }, interval, currentPulse, direction, numberOfLoop);
//   servo.setDegree(100); // 0 - 180
// });
