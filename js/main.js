let canvas;
let world;
let keyboard = new Keyboard();
let soundManager = new SoundManager();
let startScreenImage = new Image();
startScreenImage.src =
  "assets/imgs/9_intro_outro_screens/start/startscreen_2.png";

/** Sets up the canvas, UI bindings, touch controls, and sound on page load. */
function init() {
  canvas = document.getElementById("canvas");
  showStartScreen();
  bindControlButtons();
  bindOverlayBackdropClicks();
  initTouchControls();
  applyStoredSoundSettings();
  startBackgroundMusic();
}

/** Wires up click listeners for all main UI buttons. */
function bindControlButtons() {
  document.getElementById("startBtn").addEventListener("click", startGame);
  document.getElementById("restartBtn").addEventListener("click", startGame);
  document.getElementById("homeBtn").addEventListener("click", goToHome);
  document.getElementById("soundBtn").addEventListener("click", toggleSound);
  document.getElementById("volumeSlider").addEventListener("input", handleVolumeChange);
  document.getElementById("howToBtn").addEventListener("click", openHowTo);
  document.getElementById("howToCloseBtn").addEventListener("click", closeHowTo);
  document.getElementById("settingsBtn").addEventListener("click", openSettings);
  document.getElementById("settingsCloseBtn").addEventListener("click", closeSettings);
  document.getElementById("fullscreenBtn").addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateFullscreenIcon);
}

/** Closes the how-to/settings overlays on any click outside their dialog box. */
function bindOverlayBackdropClicks() {
  document.addEventListener("click", (event) => {
    if (isOutsideDialog(event.target, "howToBox", "howToBtn")) closeHowTo();
    if (isOutsideDialog(event.target, "settingsBox", "settingsBtn")) closeSettings();
  });
}

/**
 * Checks if a click landed outside a dialog box and its toggle button.
 * @param {EventTarget} target - the clicked element
 * @param {string} boxId - id of the dialog's content box
 * @param {string} toggleBtnId - id of the button that opens the dialog
 * @returns {boolean}
 */
function isOutsideDialog(target, boxId, toggleBtnId) {
  const box = document.getElementById(boxId);
  const toggleBtn = document.getElementById(toggleBtnId);
  return !box.contains(target) && !toggleBtn.contains(target);
}

/** Applies the saved mute/volume settings to the sound button and slider. */
function applyStoredSoundSettings() {
  document.getElementById("soundBtn").textContent = soundManager.muted ? "🔇" : "🔊";
  document.getElementById("volumeSlider").value = soundManager.volume;
}

/**
 * Updates volume and mute state from the volume slider.
 * @param {Event} event - input event from the volume slider
 */
function handleVolumeChange(event) {
  const value = Number(event.target.value);
  soundManager.setVolume(value);
  soundManager.setMuted(value === 0);
  document.getElementById("soundBtn").textContent = soundManager.muted ? "🔇" : "🔊";
}

/** Starts the background music loop, retrying on first user interaction if autoplay is blocked. */
function startBackgroundMusic() {
  soundManager.startLoop("musicTheme")?.catch(() => {
    const retry = () => {
      soundManager.loops.musicTheme?.play();
      document.removeEventListener("pointerdown", retry);
      document.removeEventListener("keydown", retry);
    };
    document.addEventListener("pointerdown", retry);
    document.addEventListener("keydown", retry);
  });
}

const EXPAND_ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 9 4 4 9 4"/><polyline points="15 4 20 4 20 9"/><polyline points="20 15 20 20 15 20"/><polyline points="9 20 4 20 4 15"/></svg>`;
const COMPRESS_ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 4 9 9 4 9"/><polyline points="15 4 15 9 20 9"/><polyline points="20 15 15 15 15 20"/><polyline points="4 15 9 15 9 20"/></svg>`;

/** Toggles fullscreen mode for the canvas wrapper. */
function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.getElementById("canvasWrapper").requestFullscreen();
  }
}

/** Swaps the fullscreen button icon to match the current fullscreen state. */
function updateFullscreenIcon() {
  document.getElementById("fullscreenBtn").innerHTML = document.fullscreenElement ? COMPRESS_ICON : EXPAND_ICON;
}

/** Shows the how-to-play overlay. */
function openHowTo() {
  document.getElementById("howToOverlay").classList.add("visible");
}

/** Hides the how-to-play overlay. */
function closeHowTo() {
  document.getElementById("howToOverlay").classList.remove("visible");
}

/** Shows the settings overlay. */
function openSettings() {
  document.getElementById("settingsOverlay").classList.add("visible");
}

/** Hides the settings overlay. */
function closeSettings() {
  document.getElementById("settingsOverlay").classList.remove("visible");
}

/**
 * Binds touchstart/touchend/touchcancel on a button to set a keyboard key's state.
 * @param {string} id - element id of the touch button
 * @param {string} key - Keyboard property to control
 */
function bindTouchButton(id, key) {
  const btn = document.getElementById(id);
  btn.addEventListener("touchstart", (event) => { event.preventDefault(); keyboard[key] = true; });
  btn.addEventListener("touchend", (event) => { event.preventDefault(); keyboard[key] = false; });
  btn.addEventListener("touchcancel", (event) => { event.preventDefault(); keyboard[key] = false; });
  btn.addEventListener("contextmenu", (event) => event.preventDefault());
}

/** Binds all on-screen touch control buttons to their keyboard keys. */
function initTouchControls() {
  bindTouchButton("btnLeft", "LEFT");
  bindTouchButton("btnRight", "RIGHT");
  bindTouchButton("btnJump", "SPACE");
  bindTouchButton("btnThrow", "E");
  bindExchangeButton();
}

/** Binds the mobile coin-exchange button to trigger the trade on click/tap. */
function bindExchangeButton() {
  const btn = document.getElementById("btnExchange");
  btn.addEventListener("click", () => {
    if (world) world.collisionManager.exchangeCoinsForBottle();
  });
  btn.addEventListener("contextmenu", (event) => event.preventDefault());
}

/** Draws the start screen image on the canvas once it has loaded. */
function showStartScreen() {
  let ctx = canvas.getContext("2d");
  let draw = () =>
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);

  if (startScreenImage.complete) {
    draw();
  } else {
    startScreenImage.onload = draw;
  }
}

/** Toggles mute and updates the sound button icon. */
function toggleSound() {
  const muted = soundManager.toggleMute();
  document.getElementById("soundBtn").textContent = muted ? "🔇" : "🔊";
}

/** Tears down any running game, resets the UI, and starts a new game. */
function startGame() {
  if (world) world.destroy();
  document.getElementById("startOverlay").style.display = "none";
  document.getElementById("howToBtn").style.display = "none";
  document.getElementById("settingsBtn").style.display = "none";
  document.getElementById("endOverlay").style.display = "none";
  document.getElementById("touchControls").classList.remove("dimmed");
  document.body.classList.add("playing");
  initLevel1();
  world = new World(canvas, keyboard, soundManager);
  soundManager.play("gameStart");
}

/** Tears down the running game and returns to the start screen. */
function goToHome() {
  if (world) world.destroy();
  document.getElementById("endOverlay").style.display = "none";
  document.getElementById("startOverlay").style.display = "";
  document.getElementById("howToBtn").style.display = "";
  document.getElementById("settingsBtn").style.display = "";
  document.body.classList.remove("playing");
  showStartScreen();
}

const KEY_CODES = {
  RIGHT: [39, 68],
  LEFT: [37, 65],
  UP: [38, 87],
  SPACE: [32],
  E: [69],
};

/**
 * Sets the keyboard state for whichever key matches the given key code.
 * @param {number} keyCode - key code from a keyboard event
 * @param {boolean} value - true if pressed, false if released
 */
function setKeyState(keyCode, value) {
  for (const [key, codes] of Object.entries(KEY_CODES)) {
    if (codes.includes(keyCode)) keyboard[key] = value;
  }
}

/**
 * Handles key-down events: coin exchange shortcut and keyboard state.
 * @param {KeyboardEvent} event - key-down event
 */
function handleKeyDown(event) {
  if (world && (world.gameOver || world.gameWon)) return;
  if (event.code === "KeyQ" && world && !event.repeat) world.collisionManager.exchangeCoinsForBottle();
  setKeyState(event.keyCode, true);
}

/**
 * Handles key-up events by releasing the matching keyboard key.
 * @param {KeyboardEvent} event - key-up event
 */
function handleKeyUp(event) {
  setKeyState(event.keyCode, false);
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
