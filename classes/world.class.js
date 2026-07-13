/** Central game engine: runs the game loop, collisions, drawing, and state. */
class World {
  static intervalIds = [];

  /**
   * Registers an interval id so it can be cleared later.
   * @param {number} id - id returned by setInterval
   * @returns {number} the same id
   */
  static track(id) {
    World.intervalIds.push(id);
    return id;
  }

  /** Clears every interval registered via track(). */
  static clearAllIntervals() {
    World.intervalIds.forEach((id) => clearInterval(id));
    World.intervalIds = [];
  }

  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusbar = new Statusbar();
  coinStatusbar = new Statusbar("coin");
  bottleStatusbar = new Statusbar("bottle");
  endbossStatusbar = new Statusbar("endboss");
  throwableObjects = [];
  collectibleObjects = [];
  bottleThrowCooldown = 0;
  collectedBottles = 0;
  maxBottles = 5;
  collectedCoins = 0;
  boss;
  gameOver = false;
  gameWon = false;
  gameEnding = false;
  endOverlayShown = false;
  imageGameOver = new Image();
  imageWon = new Image();
  collisionManager = new CollisionManager(this);

  /**
   * @param {HTMLCanvasElement} canvas - canvas to draw the game on
   * @param {Keyboard} keyboard - shared keyboard input state
   * @param {SoundManager} soundManager - shared sound manager
   */
  constructor(canvas, keyboard, soundManager) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.soundManager = soundManager;
    this.collectibleObjects = this.level.collectables || [];
    this.imageGameOver.src =
      "assets/imgs/9_intro_outro_screens/game_over/game over.png";
    this.imageWon.src = "assets/imgs/You won, you lost/You Win A.png";
    this.draw();
    this.setWorld();
    this.run();
  }

  /** Links the character and the endboss (if present) back to this world. */
  setWorld() {
    this.character.world = this;
    this.boss = this.level.enemies.find((e) => e instanceof Endboss);
    if (this.boss) this.boss.world = this;
  }

  /** Starts the collision-check and bottle-throw intervals. */
  run() {
    World.track(
      setInterval(() => {
        this.collisionManager.checkCollisions();
      }, 16),
    );

    World.track(
      setInterval(() => {
        this.checkThrowObjects();
      }, 50),
    );
  }

  /** Stops the draw loop and clears all running intervals. */
  destroy() {
    this.destroyed = true;
    World.clearAllIntervals();
  }

  /** Shows the win/lose overlay once and disables further input. */
  showEndOverlay() {
    if (this.endOverlayShown) return;
    this.endOverlayShown = true;
    this.keyboard.RIGHT = false;
    this.keyboard.LEFT = false;
    this.keyboard.UP = false;
    this.keyboard.SPACE = false;
    this.keyboard.E = false;
    World.clearAllIntervals();
    this.soundManager.play(this.gameWon ? "win" : "lose");
    document.getElementById("endOverlay").style.display = "flex";
    document.getElementById("touchControls").classList.add("dimmed");
  }

  /** Checks the throw cooldown and throws a bottle if allowed. */
  checkThrowObjects() {
    this.updateThrowCooldown();
    if (this.canThrowBottle()) {
      this.throwBottle();
    }
  }

  /** Counts down the bottle throw cooldown. */
  updateThrowCooldown() {
    if (this.bottleThrowCooldown > 0) {
      this.bottleThrowCooldown--;
    }
  }

  /**
   * Checks if the character may throw a bottle right now.
   * @returns {boolean}
   */
  canThrowBottle() {
    return (
      this.keyboard.E &&
      !this.character.isDead() &&
      this.bottleThrowCooldown === 0 &&
      this.collectedBottles > 0
    );
  }

  /** Spawns a thrown bottle in front of the character and starts the cooldown. */
  throwBottle() {
    const otherDirection = this.character.otherDirection;
    const spawnX = this.character.x + (otherDirection ? -20 : 100);
    this.throwableObjects.push(
      new ThrowableObject(spawnX, this.character.y + 100, otherDirection),
    );
    this.collectedBottles--;
    this.updateBottleStatusbar();
    this.bottleThrowCooldown = 10;
  }

  /** Updates the bottle status bar from the collected bottle count. */
  updateBottleStatusbar() {
    this.bottleStatusbar.setPercentage(
      Math.max(0, Math.min(100, this.collectedBottles * 20)),
    );
  }

  /** Updates the coin status bar from the collected coin count. */
  updateCoinStatusbar() {
    this.coinStatusbar.setPercentage(
      Math.max(0, Math.min(100, this.collectedCoins * 20)),
    );
  }

  /** Clears the canvas and redraws the whole frame, then schedules the next one. */
  draw() {
    if (this.destroyed) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawWorldLayer();
    this.drawFixedStatusbars();
    this.drawEndScreen();

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /** Draws all camera-scrolled objects (background, enemies, character, items). */
  drawWorldLayer() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    if (!this.gameOver) this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.collectibleObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /** Draws the fixed-position status bars (life, coin, bottle, endboss). */
  drawFixedStatusbars() {
    this.addToMap(this.statusbar);
    this.addToMap(this.coinStatusbar);
    this.addToMap(this.bottleStatusbar);
    if (this.boss && this.boss.isAlerted) this.addToMap(this.endbossStatusbar);
    this.drawCoinExchangeHint();
  }

  /** Draws the "exchange coins for a bottle" hint (desktop) or toggles the mobile button. */
  drawCoinExchangeHint() {
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const canExchange = this.collectedCoins >= 5 && !this.gameOver && !this.gameWon;
    document.getElementById("btnExchange").classList.toggle("visible", isTouch && canExchange);
    if (isTouch || !canExchange) return;
    const { text, x, y } = this.getCoinHintLayout();
    this.drawCoinHintBadge(text, x, y);
    this.drawCoinHintText(text, x, y);
  }

  /**
   * Computes text and position for the coin exchange hint.
   * @returns {{text: string, x: number, y: number}}
   */
  getCoinHintLayout() {
    return {
      text: "Q ➜ 🍾",
      x: this.coinStatusbar.x + this.coinStatusbar.width + 10,
      y: this.coinStatusbar.y + this.coinStatusbar.height / 2 + 10,
    };
  }

  /**
   * Draws the rounded background badge behind the coin hint text.
   * @param {string} text - hint text (used to size the badge)
   * @param {number} x - badge x position
   * @param {number} y - badge y position
   */
  drawCoinHintBadge(text, x, y) {
    this.ctx.font = "bold 20px sans-serif";
    this.ctx.textBaseline = "middle";
    const padding = 10;
    const boxWidth = this.ctx.measureText(text).width + padding * 2;
    const boxHeight = 32;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    this.ctx.beginPath();
    this.ctx.roundRect(x - padding, y - boxHeight / 2, boxWidth, boxHeight, 8);
    this.ctx.fill();
  }

  /**
   * Draws the coin hint text with an outline over the badge.
   * @param {string} text - hint text
   * @param {number} x - text x position
   * @param {number} y - text y position
   */
  drawCoinHintText(text, x, y) {
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "#000";
    this.ctx.strokeText(text, x, y);
    this.ctx.fillStyle = "#ffe066";
    this.ctx.fillText(text, x, y);
  }

  /** Draws the game-over or win overlay and shows the end overlay once. */
  drawEndScreen() {
    if (this.gameOver || this.gameWon) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    if (this.gameOver) {
      this.ctx.drawImage(this.imageGameOver, 0, 0, this.canvas.width, this.canvas.height);
      this.showEndOverlay();
    } else if (this.gameWon) {
      this.ctx.drawImage(this.imageWon, 0, 0, this.canvas.width, this.canvas.height);
      this.showEndOverlay();
    }
  }

  /**
   * Draws every non-collected object from the given list.
   * @param {Array} objects - objects to draw
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      if (!o.collected) {
        this.addToMap(o);
      }
    });
  }

  /**
   * Draws a single object, flipping it horizontally if facing the other direction.
   * @param {MovableObject} mo - the object to draw
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    if (mo instanceof ThrowableObject) {
      mo.animateSplash();
    }
    mo.draw(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Mirrors the canvas horizontally to draw a flipped object.
   * @param {MovableObject} mo - the object being flipped
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the canvas after drawing a flipped object.
   * @param {MovableObject} mo - the object that was flipped
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
