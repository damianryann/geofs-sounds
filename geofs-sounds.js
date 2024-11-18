let aircraft = null;
let aircraftName = geofs.aircraft.instance.aircraftRecord.name.toLowerCase();

if (aircraftName.includes("boeing")) {
  aircraft = "boeing";
} else if (aircraftName.includes("airbus")) {
  aircraft = "airbus";
} else {
  console.log(
    "The aircraft is neither a Boeing nor an Airbus. Sounds will not execute."
  );
  // Exit the script if the aircraft is not Boeing or Airbus
  return;
}

/**
 * Autopilot Disconnect Sound
 **/
const autopilotDisconnectSound = new Audio(
  `https://raw.githubusercontent.com/damianryann/geofs-sounds/master/${aircraft}/autopilot-disconnect.mp3`
);

// duplicate the original
geofs.autopilot._turnOff = geofs.autopilot.turnOff;
geofs.autopilot.turnOff = () => {
  // override the original function
  geofs.autopilot._turnOff();
  if (audio.on && !geofs.pause) autopilotDisconnectSound.play();
};

/**
 * Altitude Callouts Sounds
 **/

// Define sounds in a separate object
const boeingSoundFiles = {
  gpws1000: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/1000.mp3"
  ),
  gpws500: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/500.mp3"
  ),
  gpws400: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/400.mp3"
  ),
  gpws300: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/300.mp3"
  ),
  gpws200: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/200.mp3"
  ),
  gpws100: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/100.mp3"
  ),
  gpws50: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/50.mp3"
  ),
  gpws40: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/40.mp3"
  ),
  gpws30: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/30.mp3"
  ),
  gpws20: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/20.mp3"
  ),
  gpws10: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/10.mp3"
  ),
};

const airbusSoundFiles = {
  gpws400: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/airbus/400.wav"
  ),
  gpws300: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/300.wav"
  ),
  gpws200: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/200.wav"
  ),
  gpws100: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/100.wav"
  ),
  gpws50: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/50.wav"
  ),
  gpws30: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/30.wav"
  ),
  gpws20: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/20.wav"
  ),
};

// Function to play sound dynamically when conditions are met
function playSoundIfLoaded(sound) {
  if (sound) {
    sound.play();
  } else {
    console.log(`${sound} is not loaded yet.`);
  }
}

// GPWS & TCAS Logic - Play sound based on altitude thresholds
function doRadioAltCall() {
  const boeingAltitudes = [
    { value: "gpws1000", range: [900, 1000] },
    { value: "gpws500", range: [400, 500] },
    { value: "gpws400", range: [300, 400] },
    { value: "gpws300", range: [200, 300] },
    { value: "gpws200", range: [100, 200] },
    { value: "gpws100", range: [50, 100] },
    { value: "gpws50", range: [40, 50] },
    { value: "gpws40", range: [30, 40] },
    { value: "gpws30", range: [20, 30] },
    { value: "gpws20", range: [10, 20] },
    { value: "gpws10", range: [5, 10] },
  ];

  const airbusAltitudes = [
    { value: "gpws400", range: [300, 400] },
    { value: "gpws300", range: [200, 300] },
    { value: "gpws200", range: [100, 200] },
    { value: "gpws100", range: [50, 100] },
    { value: "gpws50", range: [40, 50] },
    { value: "gpws30", range: [20, 30] },
    { value: "gpws20", range: [10, 20] },
  ];

  // Check if in approach configuration
  if (isApprConfig && aircraft === "boeing") {
    boeingAltitudes.forEach((alt) => {
      if (
        geofs.animation.values.haglFeet >= alt.range[0] &&
        geofs.animation.values.haglFeet <= alt.range[1]
      ) {
        console.log(
          `Triggering sound for ${alt.value} at altitude ${geofs.animation.values.haglFeet}`
        );

        // Play sound dynamically
        playSoundIfLoaded(boeingSoundFiles[alt.value]);
      }
    });
  }

  if (isApprConfig && aircraft === "airbus") {
    airbusAltitudes.forEach((alt) => {
      if (
        geofs.animation.values.haglFeet >= alt.range[0] &&
        geofs.animation.values.haglFeet <= alt.range[1]
      ) {
        console.log(
          `Triggering sound for ${alt.value} at altitude ${geofs.animation.values.haglFeet}`
        );

        // Play sound dynamically
        playSoundIfLoaded(airbusSoundFiles[alt.value]);
      }
    });
  }
}

// GPWS Variables
let isApprConfig = false;
geofs.animation.values.isGearWarn = 0;
geofs.animation.values.isFlapsWarn = 0;

function testForApproach() {
  // Check if flaps warning is 0 and gear warning is 0
  if (
    geofs.animation.values.isFlapsWarn === 0 &&
    geofs.animation.values.isGearWarn === 0 &&
    geofs.animation.values.climbrate <= -1 // Descent condition
  ) {
    isApprConfig = true;
  } else {
    isApprConfig = false;
  }
}

/**
 * Seatbelt Sound Toggle
 **/
const seatbeltOnSound = new Audio(
  "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/misc/seatbelt-on.mp3"
);
const seatbeltOffSound = new Audio(
  "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/misc/seatbelt-off.mp3"
);

// Seatbelt sign is off by default
let isSeatbeltOn = false;

// Event listener to detect Shift + Q key press
document.addEventListener("keydown", function (event) {
  // Check if Shift key and S key are pressed
  if (event.shiftKey && event.key === "Q") {
    // Toggle seatbelt state
    isSeatbeltOn = !isSeatbeltOn;

    // Play the corresponding sound based on the seatbelt state
    if (isSeatbeltOn) {
      if (audio.on && !geofs.pause) {
        seatbeltOnSound.play();
        console.log("Seatbelt sign ON, sound played.");
      }
    } else {
      if (audio.on && !geofs.pause) {
        seatbeltOffSound.play();
        console.log("Seatbelt sign OFF, sound played.");
      }
    }
  }
});

// Main Sound Interval - Trigger conditions for sounds
setInterval(function () {
  getGearFlapsWarn();
  testForApproach();
  doRadioAltCall();
}, 10);
