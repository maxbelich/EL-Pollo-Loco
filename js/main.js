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
  document.getElementById("startBtn").addEventListener("click", startGame);
  document.getElementById("restartBtn").addEventListener("click", startGame);
  document.getElementById("homeBtn").addEventListener("click", goToHome);
  document.getElementById("soundBtn").addEventListener("click", toggleSound);
  document.getElementById("howToBtn").addEventListener("click", openHowTo);
  document.getElementById("howToCloseBtn").addEventListener("click", closeHowTo);
  initTouchControls();
}

function openHowTo() {
  document.getElementById("howToOverlay").classList.add("visible");
}

function closeHowTo() {
  document.getElementById("howToOverlay").classList.remove("visible");
}

function bindTouchButton(id, key) {
  const btn = document.getElementById(id);
  btn.addEventListener("touchstart", (e) => { e.preventDefault(); keyboard[key] = true; });
  btn.addEventListener("touchend", (e) => { e.preventDefault(); keyboard[key] = false; });
  btn.addEventListener("touchcancel", (e) => { e.preventDefault(); keyboard[key] = false; });
  btn.addEventListener("contextmenu", (e) => e.preventDefault());
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
  document.getElementById("endOverlay").style.display = "none";
  document.getElementById("touchControls").classList.remove("dimmed");
  document.body.classList.add("playing");
  initLevel1();
  world = new World(canvas, keyboard, soundManager);
  soundManager.play("gameStart");

  console.log("My Character is", world.character);
}

function goToHome() {
  if (world) world.destroy();
  document.getElementById("endOverlay").style.display = "none";
  document.getElementById("startOverlay").style.display = "";
  document.getElementById("howToBtn").style.display = "";
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

function handleKeyDown(e) {
  if (world && (world.gameOver || world.gameWon)) return;
  setKeyState(e.keyCode, true);
}

function handleKeyUp(e) {
  setKeyState(e.keyCode, false);
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
