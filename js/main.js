let canvas;
let world;
let keyboard = new Keyboard();
let muted = false;
let startScreenImage = new Image();
startScreenImage.src =
  "assets/imgs/9_intro_outro_screens/start/startscreen_2.png";

function init() {
  canvas = document.getElementById("canvas");
  showStartScreen();
  document.getElementById("startBtn").addEventListener("click", startGame);
  document.getElementById("soundBtn").addEventListener("click", toggleSound);
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
  muted = !muted;
  document.getElementById("soundBtn").textContent = muted ? "🔇" : "🔊";
}

function startGame() {
  document.getElementById("startOverlay").style.display = "none";
  initLevel1();
  world = new World(canvas, keyboard);

  console.log("My Character is", world.character);
}

window.addEventListener("keydown", (e) => {
  console.log(e.keyCode);

  if (e.keyCode == 39 || e.keyCode == 68) {
    keyboard.RIGHT = true;
  }

  if (e.keyCode == 37 || e.keyCode == 65) {
    keyboard.LEFT = true;
  }

  if (e.keyCode == 38 || e.keyCode == 87) {
    keyboard.UP = true;
  }

  if (e.keyCode == 40 || e.keyCode == 83) {
    keyboard.DOWN = true;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }

  if (e.keyCode == 69) {
    keyboard.E = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39 || e.keyCode == 68) {
    keyboard.RIGHT = false;
  }

  if (e.keyCode == 37 || e.keyCode == 65) {
    keyboard.LEFT = false;
  }

  if (e.keyCode == 38 || e.keyCode == 87) {
    keyboard.UP = false;
  }

  if (e.keyCode == 40 || e.keyCode == 83) {
    keyboard.DOWN = false;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.keyCode == 69) {
    keyboard.E = false;
  }
});
