let canvas;
let world;
let keyboard = new Keyboard();
let soundManager = new SoundManager();
let startScreenImage = new Image();
startScreenImage.src =
  "assets/imgs/9_intro_outro_screens/start/startscreen_2.png";

function init() {
  canvas = document.getElementById("canvas");
  showStartScreen();
  bindControlButtons();
  bindOverlayBackdropClicks();
  initTouchControls();
  applyStoredSoundSettings();
  startBackgroundMusic();
}

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

function bindOverlayBackdropClicks() {
  document.getElementById("howToOverlay").addEventListener("click", (event) => {
    if (event.target.id === "howToOverlay") closeHowTo();
  });
  document.getElementById("settingsOverlay").addEventListener("click", (event) => {
    if (event.target.id === "settingsOverlay") closeSettings();
  });
}

function applyStoredSoundSettings() {
  document.getElementById("soundBtn").textContent = soundManager.muted ? "🔇" : "🔊";
  document.getElementById("volumeSlider").value = soundManager.volume;
}

function handleVolumeChange(event) {
  const value = Number(event.target.value);
  soundManager.setVolume(value);
  soundManager.setMuted(value === 0);
  document.getElementById("soundBtn").textContent = soundManager.muted ? "🔇" : "🔊";
}

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

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.getElementById("canvasWrapper").requestFullscreen();
  }
}

function updateFullscreenIcon() {
  document.getElementById("fullscreenBtn").innerHTML = document.fullscreenElement ? COMPRESS_ICON : EXPAND_ICON;
}

function openHowTo() {
  document.getElementById("howToOverlay").classList.add("visible");
}

function closeHowTo() {
  document.getElementById("howToOverlay").classList.remove("visible");
}

function openSettings() {
  document.getElementById("settingsOverlay").classList.add("visible");
}

function closeSettings() {
  document.getElementById("settingsOverlay").classList.remove("visible");
}

function bindTouchButton(id, key) {
  const btn = document.getElementById(id);
  btn.addEventListener("touchstart", (event) => { event.preventDefault(); keyboard[key] = true; });
  btn.addEventListener("touchend", (event) => { event.preventDefault(); keyboard[key] = false; });
  btn.addEventListener("touchcancel", (event) => { event.preventDefault(); keyboard[key] = false; });
  btn.addEventListener("contextmenu", (event) => event.preventDefault());
}

function initTouchControls() {
  bindTouchButton("btnLeft", "LEFT");
  bindTouchButton("btnRight", "RIGHT");
  bindTouchButton("btnJump", "SPACE");
  bindTouchButton("btnThrow", "E");
}

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

function toggleSound() {
  const muted = soundManager.toggleMute();
  document.getElementById("soundBtn").textContent = muted ? "🔇" : "🔊";
}

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
  DOWN: [40, 83],
  SPACE: [32],
  E: [69],
};

function setKeyState(keyCode, value) {
  for (const [key, codes] of Object.entries(KEY_CODES)) {
    if (codes.includes(keyCode)) keyboard[key] = value;
  }
}

function handleKeyDown(event) {
  if (world && (world.gameOver || world.gameWon)) return;
  if (event.code === "KeyQ" && world && !event.repeat) world.exchangeCoinsForBottle();
  setKeyState(event.keyCode, true);
}

function handleKeyUp(event) {
  setKeyState(event.keyCode, false);
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
