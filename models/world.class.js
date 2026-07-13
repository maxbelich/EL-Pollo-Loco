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
    World.track(
      setInterval(() => {
        this.checkCollisions();
      }, 16),
    );

    World.track(
      setInterval(() => {
        this.checkThrowObjects();
      }, 50),
    );
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
    this.soundManager.play(this.gameWon ? "win" : "lose");
    document.getElementById("endOverlay").style.display = "flex";
    document.getElementById("touchControls").classList.add("dimmed");
  }

  checkThrowObjects() {
    this.updateThrowCooldown();
    if (this.canThrowBottle()) {
      this.throwBottle();
    }
  }

  updateThrowCooldown() {
    if (this.bottleThrowCooldown > 0) {
      this.bottleThrowCooldown--;
    }
  }

  canThrowBottle() {
    return (
      this.keyboard.E &&
      this.bottleThrowCooldown === 0 &&
      this.collectedBottles > 0
    );
  }

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

  checkCollisions() {
    this.checkEnemyCollisions();
    this.checkBottleCollisions();
    this.checkGameEndConditions();
    this.checkCollectableCollisions();
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
        this.checkChickenCollision(enemy);
      } else if (enemy instanceof Endboss) {
        this.checkEndbossCollision(enemy);
      }
    });
  }

  checkChickenCollision(enemy) {
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

    if (
      this.character.isColliding(enemy) &&
      !this.character.isHurt() &&
      !this.character.isDead()
    ) {
      this.character.hit(enemy instanceof ChickenSmall ? 2 : 5);
      this.statusbar.setPercentage(this.character.life);
      this.soundManager.play("hit");
    }
  }

  checkEndbossCollision(enemy) {
    if (
      this.boss &&
      !this.boss.isDead() &&
      this.boss.isAttacking &&
      this.character.isColliding(this.boss) &&
      !this.character.isHurt() &&
      !this.character.isDead()
    ) {
      this.character.hit(10);
      this.statusbar.setPercentage(this.character.life);
      this.soundManager.play("hit");
    }
  }

  checkBottleCollisions() {
    this.throwableObjects.forEach((bottle) => {
      if (this.isBottleHittingBoss(bottle)) {
        bottle.hitBoss();
        this.boss.hit();
        this.endbossStatusbar.setPercentage(this.boss.life);
        this.soundManager.play("bottleBreak");
        if (
          this.boss.life < 50 &&
          this.boss.bottleDropsGiven < 2 &&
          !this.boss.isDead()
        ) {
          this.dropBossBottle();
          this.boss.bottleDropsGiven++;
        }
      }
    });
  }

  dropBossBottle() {
    const startX = this.boss.x + this.boss.width / 2 - 30;
    const startY = this.boss.y + this.boss.height - 70;
    const bottle = new CollectibleObject(
      "assets/imgs/6_salsa_bottle/1_salsa_bottle_on_ground.png",
      startX,
      startY,
      60,
      70,
      "bottle",
    );
    this.collectibleObjects.push(bottle);
    this.flyBottleToCharacter(bottle, startX, startY);
  }

  flyBottleToCharacter(bottle, startX, startY) {
    const targetX = this.character.x;
    const targetY = 360;
    const arcHeight = 120;
    const steps = 20;
    let step = 0;
    const flightInterval = World.track(
      setInterval(() => {
        step++;
        const t = step / steps;
        bottle.x = startX + (targetX - startX) * t;
        bottle.y = bottle.baseY =
          startY + (targetY - startY) * t - arcHeight * Math.sin(Math.PI * t);
        if (step >= steps) clearInterval(flightInterval);
      }, 25),
    );
  }

  isBottleHittingBoss(bottle) {
    return (
      !bottle.isSplash &&
      this.boss &&
      !this.boss.isDead() &&
      bottle.x + bottle.width > this.boss.x + 80 &&
      bottle.x < this.boss.x + this.boss.width - 80 &&
      bottle.y + bottle.height > this.boss.y + 80 &&
      bottle.y < this.boss.y + this.boss.height - 80
    );
  }

  checkGameEndConditions() {
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
  }

  checkCollectableCollisions() {
    this.collectibleObjects.forEach((item) => {
      if (item.collected || !this.character.isColliding(item)) return;
      if (item.type === "bottle") {
        this.collectBottle(item);
      } else if (item.type === "coin") {
        this.collectCoinItem(item);
      }
    });
  }

  collectBottle(item) {
    if (this.collectedBottles >= this.maxBottles) return;
    item.collect();
    this.collectedBottles++;
    this.updateBottleStatusbar();
    this.soundManager.play("collectBottle");
  }

  collectCoinItem(item) {
    item.collect();
    this.collectedCoins++;
    this.updateCoinStatusbar();
    this.soundManager.play("collectCoin");
  }

  exchangeCoinsForBottle() {
    const cost = 5;
    if (this.collectedCoins < cost || this.collectedBottles >= this.maxBottles)
      return;
    this.collectedCoins -= cost;
    this.collectedBottles++;
    this.updateCoinStatusbar();
    this.updateBottleStatusbar();
    this.soundManager.play("collectBottle");
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

    this.drawWorldLayer();
    this.drawFixedStatusbars();
    this.drawEndScreen();

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

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

  drawFixedStatusbars() {
    this.addToMap(this.statusbar);
    this.addToMap(this.coinStatusbar);
    this.addToMap(this.bottleStatusbar);
    if (this.boss && this.boss.isAlerted) this.addToMap(this.endbossStatusbar);
    this.drawCoinExchangeHint();
  }

  drawCoinExchangeHint() {
    if (this.collectedCoins < 5) return;
    const text = "Q ➜ 🍾";
    const x = this.coinStatusbar.x + this.coinStatusbar.width + 10;
    const y = this.coinStatusbar.y + this.coinStatusbar.height / 2 + 10;

    this.ctx.font = "bold 20px sans-serif";
    this.ctx.textBaseline = "middle";

    const padding = 10;
    const boxWidth = this.ctx.measureText(text).width + padding * 2;
    const boxHeight = 32;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    this.ctx.beginPath();
    this.ctx.roundRect(x - padding, y - boxHeight / 2, boxWidth, boxHeight, 8);
    this.ctx.fill();

    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "#000";
    this.ctx.strokeText(text, x, y);
    this.ctx.fillStyle = "#ffe066";
    this.ctx.fillText(text, x, y);
  }

  drawEndScreen() {
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
