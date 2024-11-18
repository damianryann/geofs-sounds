// Autopilot Disconnect Sound
let autopilotDisconnectSound = new Audio(
  "https://raw.githubusercontent.com/Ariakim-Taiyo/GeoFs-737-Immersion-SFX/main/737_autopilot_disconnect.mp3"
);

geofs.autopilot._turnOff = geofs.autopilot.turnOff; // duplicate the original
geofs.autopilot.turnOff = () => {
  // override the original function
  geofs.autopilot._turnOff();
  if (audio.on && !geofs.pause) autopilotDisconnectSound.play();
};

// Define sounds in a separate object
const soundFiles = {
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
  tcas: new Audio(
    "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/traffic.mp3"
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
  const altitudes = [
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

  // Check if in approach configuration
  if (isApprConfig) {
    altitudes.forEach((alt) => {
      if (
        geofs.animation.values.haglFeet >= alt.range[0] &&
        geofs.animation.values.haglFeet <= alt.range[1]
      ) {
        console.log(
          `Triggering sound for ${alt.value} at altitude ${geofs.animation.values.haglFeet}`
        );
        playSoundIfLoaded(soundFiles[alt.value]); // Play sound dynamically
      }
    });
  }
}

// TCAS Logic - Play sound if TCAS is active
function checkTCAS() {
  if (geofs.animation.values.isTCAS) {
    playSoundIfLoaded(soundFiles.tcas); // Play TCAS traffic sound if active
  }
}

// Flaps Sound Logic
let lastFlapPos = -1;
function getFlapsSound() {
  if (
    geofs.camera.currentModeName === "Left wing" ||
    geofs.camera.currentModeName === "Right wing"
  ) {
    if (geofs.animation.values.flapsPosition !== lastFlapPos) {
      geofs.animation.values.flapsSound = 1;
    } else {
      geofs.animation.values.flapsSound = 0;
    }
  } else {
    geofs.animation.values.flapsSound = 0;
  }
  lastFlapPos = geofs.animation.values.flapsPosition;
}

// GPWS Variables
let isApprConfig = false;
geofs.animation.values.isGearWarn = 0;
geofs.animation.values.isFlapsWarn = 0;
geofs.animation.values.isTerrainWarn = 0;

// GPWS Warning Logic
function getGearFlapsWarn() {
  // Reset warnings if aircraft is on the ground
  if (geofs.animation.values.groundContact === 1) {
    geofs.animation.values.isGearWarn = 0;
    geofs.animation.values.isFlapsWarn = 0;
    return;
  }
  // Gear Warning: Below 500 feet, gear should be down during descent
  if (
    geofs.animation.values.haglFeet <= 500 &&
    geofs.animation.values.gearPosition === 0 && // 0 indicates gear up
    geofs.animation.values.climbrate < 0
  ) {
    geofs.animation.values.isGearWarn = 1;
  } else {
    geofs.animation.values.isGearWarn = 0;
  }

  // Flaps Warning: Below 1000 feet, flaps should be deployed during descent
  if (
    geofs.animation.values.haglFeet <= 1000 &&
    geofs.animation.values.flapsPosition === 0 && // 0 indicates flaps retracted
    geofs.animation.values.climbrate < 0
  ) {
    geofs.animation.values.isFlapsWarn = 1;
  } else {
    geofs.animation.values.isFlapsWarn = 0;
  }
}

function testTerrainorAppr() {
  if (geofs.animation.values.gearPosition === 0) {
    if (
      geofs.animation.values.haglFeet <= 1000 &&
      geofs.animation.values.climbrate <= -100 &&
      geofs.animation.values.climbrate >= -5000 &&
      geofs.animation.values.isGearWarn === 0 &&
      geofs.animation.values.isFlapsWarn === 0
    ) {
      geofs.animation.values.isTerrainWarn = 1;
    } else {
      geofs.animation.values.isTerrainWarn = 0;
    }

    if (
      geofs.animation.values.haglFeet <= 5000 &&
      geofs.animation.values.climbrate <= -2000
    ) {
      geofs.animation.values.isPullupWarn = 1;
    } else {
      geofs.animation.values.isPullupWarn = 0;
    }
  } else {
    geofs.animation.values.isTerrainWarn = 0;
    geofs.animation.values.isPullupWarn = 0;
  }
}

function testForApproach() {
  console.log("Testing for Approach Configuration...");

  // Check if flaps warning is 0 and gear warning is 0
  if (
    geofs.animation.values.isFlapsWarn === 0 &&
    geofs.animation.values.isGearWarn === 0 &&
    geofs.animation.values.climbrate <= -1 // Descent condition
  ) {
    console.log("Conditions met for approach config.");
    isApprConfig = true;
  } else {
    console.log("Conditions NOT met for approach config.");
    isApprConfig = false;
  }

  // Additional checks for altitude could be included here if needed
  if (geofs.animation.values.haglFeet < 5000) {
    console.log("Altitude is below 5000ft.");
  }
}

// Main Sound Interval - Trigger conditions for sounds
setInterval(function () {
  getGearFlapsWarn();
  testForApproach();
  testTerrainorAppr();
  doRadioAltCall();
  checkTCAS();
  getFlapsSound();
}, 10);
