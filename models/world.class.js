class World {
  static intervalIds = [];

  static track(id) {
    World.intervalIds.push(id);
    return id;
  }

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

  setWorld() {
    this.character.world = this;
    this.boss = this.level.enemies.find((e) => e instanceof Endboss);
    if (this.boss) this.boss.world = this;
  }

  run() {
    World.track(setInterval(() => {
      this.checkCollisions();
    }, 16));

    World.track(setInterval(() => {
      this.checkThrowObjects();
    }, 50));
  }

  destroy() {
    this.destroyed = true;
    World.clearAllIntervals();
  }

  showEndOverlay() {
    if (this.endOverlayShown) return;
    this.endOverlayShown = true;
    this.keyboard.RIGHT = false;
    this.keyboard.LEFT = false;
    this.keyboard.UP = false;
    this.keyboard.DOWN = false;
    this.keyboard.SPACE = false;
    this.keyboard.E = false;
    World.clearAllIntervals();
    document.getElementById("endOverlay").style.display = "flex";
    document.getElementById("touchControls").classList.add("dimmed");
  }

  checkThrowObjects() {
    if (this.bottleThrowCooldown > 0) {
      this.bottleThrowCooldown--;
    }

    if (
      this.keyboard.E &&
      this.bottleThrowCooldown === 0 &&
      this.collectedBottles > 0
    ) {
      this.throwableObjects.push(
        new ThrowableObject(this.character.x + 100, this.character.y + 100),
      );
      this.collectedBottles--;
      this.updateBottleStatusbar();
      this.bottleThrowCooldown = 10;
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
        if (enemy.isDead) return;

        if (this.isStompingOn(enemy) && this.character.isColliding(enemy)) {
          enemy.hitFromAbove();
          this.character.speedY = 20;
          this.character.isJumping = true;
          this.soundManager.play(
            enemy instanceof ChickenSmall ? "chickenSmallDead" : "chickenDead",
          );
          return;
        }

        if (this.character.isColliding(enemy) && !this.character.isHurt()) {
          this.character.hit(enemy instanceof ChickenSmall ? 2 : 5);
          this.statusbar.setPercentage(this.character.life);
          this.soundManager.play("hit");
        }
      } else if (enemy instanceof Endboss) {
        if (
          this.boss &&
          !this.boss.isDead() &&
          this.boss.isAttacking &&
          this.character.isColliding(this.boss) &&
          !this.character.isHurt()
        ) {
          this.character.hit(10);
          this.statusbar.setPercentage(this.character.life);
          this.soundManager.play("hit");
        }
      }
    });

    this.throwableObjects.forEach((bottle) => {
      if (
        !bottle.isSplash &&
        this.boss &&
        !this.boss.isDead() &&
        bottle.x + bottle.width > this.boss.x + 80 &&
        bottle.x < this.boss.x + this.boss.width - 80 &&
        bottle.y + bottle.height > this.boss.y + 80 &&
        bottle.y < this.boss.y + this.boss.height - 80
      ) {
        bottle.hitBoss();
        this.boss.hit();
        this.endbossStatusbar.setPercentage(this.boss.life);
        this.soundManager.play("bottleBreak");
      }
    });

    if (!this.gameEnding && this.character.isDead()) {
      this.gameEnding = true;
      this.soundManager.play("characterDead");
      setTimeout(() => {
        this.gameOver = true;
      }, 1500);
    }
    if (!this.gameEnding && this.boss && this.boss.isDead()) {
      this.gameEnding = true;
      setTimeout(() => {
        this.gameWon = true;
      }, 1500);
    }

    this.collectibleObjects.forEach((item) => {
      if (item.collected || !this.character.isColliding(item)) return;
      if (item.type === "bottle") {
        if (this.collectedBottles >= this.maxBottles) return;
        item.collect();
        this.collectedBottles++;
        this.updateBottleStatusbar();
        this.soundManager.play("collectBottle");
      } else if (item.type === "coin") {
        item.collect();
        this.collectedCoins++;
        this.updateCoinStatusbar();
        this.soundManager.play("collectCoin");
      }
    });
  }

  isStompingOn(enemy) {
    return (
      this.character.speedY < 0 &&
      this.character.y + this.character.height - this.character.offset.bottom <
        enemy.y + enemy.height * (enemy instanceof ChickenSmall ? 0.75 : 0.6)
    );
  }

  updateBottleStatusbar() {
    this.bottleStatusbar.setPercentage(
      Math.max(0, Math.min(100, this.collectedBottles * 20)),
    );
  }

  updateCoinStatusbar() {
    this.coinStatusbar.setPercentage(
      Math.max(0, Math.min(100, this.collectedCoins * 20)),
    );
  }

  draw() {
    if (this.destroyed) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    if (!this.gameOver) this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.collectibleObjects);

    //------------Space for fixed objects--------------
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusbar);
    this.addToMap(this.coinStatusbar);
    this.addToMap(this.bottleStatusbar);
    if (this.boss && this.boss.isAlerted) this.addToMap(this.endbossStatusbar);
    this.ctx.translate(this.camera_x, 0);
    //-------------------------------------------------

    this.ctx.translate(-this.camera_x, 0);

    if (this.gameOver || this.gameWon) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (this.gameOver) {
      this.ctx.drawImage(
        this.imageGameOver,
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
      this.showEndOverlay();
    } else if (this.gameWon) {
      this.ctx.drawImage(
        this.imageWon,
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
      this.showEndOverlay();
    }

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      if (!o.collected) {
        this.addToMap(o);
      }
    });
  }

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

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
