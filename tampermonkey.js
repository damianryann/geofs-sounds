// ==UserScript==
// @name         GeoFS Aircraft Sounds Package
// @namespace    https://github.com/damianryann/geofs-sounds
// @version      0.1.0
// @description  Aircraft sounds covering both Airbus and Boeing types.
// @author       Damian Ryan & Ariakim Taiyo
// @match        https://geo-fs.com/geofs.php*
// @match        https://*.geo-fs.com/geofs.php*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const waitForGeoFS = setInterval(() => {
    if (
      typeof geofs !== "undefined" &&
      geofs.aircraft &&
      geofs.aircraft.instance
    ) {
      clearInterval(waitForGeoFS); // Stop checking
      initializeScript(); // Initialize your main logic
    }
  }, 1000);

  function initializeScript() {
    // Place your script logic here (everything inside the IIFE)
    console.log("GeoFS detected. Starting script...");

    let aircraft = null;

    // Function to determine aircraft type
    function checkAircraftType() {
      let aircraftName =
        geofs.aircraft.instance.aircraftRecord.name.toLowerCase();
      if (aircraftName.includes("boeing")) {
        aircraft = "boeing";
      } else if (aircraftName.includes("airbus")) {
        aircraft = "airbus";
      } else {
        aircraft = null;
      }
      return aircraft;
    }

    // Initial check
    if (!checkAircraftType()) {
      console.log(
        "The aircraft is neither a Boeing nor an Airbus. Sounds will not execute."
      );
      return;
    }

    // Recheck every 1000 ms
    const aircraftCheckInterval = setInterval(() => {
      if (!checkAircraftType()) {
        console.log(
          "The aircraft is no longer a Boeing or Airbus. Stopping all sounds."
        );
        clearInterval(aircraftCheckInterval);
      }
    }, 1000);

    /**
     * Autopilot Disconnect Sound
     **/
    const autopilotDisconnectSound = new Audio(
      `https://raw.githubusercontent.com/damianryann/geofs-sounds/master/${aircraft}/autopilot-disconnect.mp3`
    );

    // Duplicate the original
    geofs.autopilot._turnOff = geofs.autopilot.turnOff;
    geofs.autopilot.turnOff = () => {
      // Override the original function
      geofs.autopilot._turnOff();
      if (audio.on && !geofs.pause) autopilotDisconnectSound.play();
    };

    /**
     * Altitude Callouts Sounds
     **/
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
      appMin: new Audio(
        "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/appmin.mp3"
      ),
      min: new Audio(
        "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/boeing/min.mp3"
      ),
    };

    const airbusSoundFiles = {
      gpws400: new Audio(
        "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/airbus/400.mp3"
      ),
      gpws300: new Audio(
        "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/airbus/300.mp3"
      ),
      gpws200: new Audio(
        "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/airbus/200.mp3"
      ),
      gpws100: new Audio(
        "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/airbus/100.mp3"
      ),
      gpws50: new Audio(
        "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/airbus/50.mp3"
      ),
      gpws30: new Audio(
        "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/airbus/30.mp3"
      ),
      gpws20: new Audio(
        "https://raw.githubusercontent.com/damianryann/geofs-sounds/master/airbus/20.mp3"
      ),
    };

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
        { value: "appMin", range: [200, 250] },
        { value: "gpws200", range: [100, 200] },
        { value: "gpws100", range: [50, 100] },
        { value: "min", range: [50, 80] },
        { value: "gpws50", range: [40, 50] },
        { value: "gpws40", range: [30, 40] },
        { value: "gpws30", range: [25, 30] },
        { value: "gpws20", range: [20, 25] },
        { value: "gpws10", range: [5, 20] },
      ];

      const airbusAltitudes = [
        { value: "gpws400", range: [300, 400] },
        { value: "gpws300", range: [200, 300] },
        { value: "gpws200", range: [100, 200] },
        { value: "gpws100", range: [50, 100] },
        { value: "gpws50", range: [40, 50] },
        { value: "gpws30", range: [25, 30] },
        { value: "gpws20", range: [20, 25] },
      ];

      if (isApprConfig && aircraft === "boeing") {
        boeingAltitudes.forEach((alt) => {
          if (
            geofs.animation.values.haglFeet >= alt.range[0] &&
            geofs.animation.values.haglFeet <= alt.range[1]
          ) {
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
      if (
        geofs.animation.values.isFlapsWarn === 0 &&
        geofs.animation.values.isGearWarn === 0 &&
        geofs.animation.values.climbrate <= -1
      ) {
        console.log("Approach configuration active");
        isApprConfig = true;
      } else {
        console.log("Approach configuration inactive");
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

    let isSeatbeltOn = false;

    document.addEventListener("keydown", function (event) {
      if (event.shiftKey && event.key === "Q") {
        isSeatbeltOn = !isSeatbeltOn;
        if (isSeatbeltOn) {
          if (audio.on && !geofs.pause) seatbeltOnSound.play();
        } else {
          if (audio.on && !geofs.pause) seatbeltOffSound.play();
        }
      }
    });

    // Main Sound Interval
    setInterval(function () {
      testForApproach();
      doRadioAltCall();
    }, 100);
  }
})();
