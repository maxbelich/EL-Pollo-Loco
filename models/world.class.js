class World {
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
  imageGameOver = new Image();
  imageWon = new Image();

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
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
    setInterval(() => {
      this.checkCollisions();
    }, 16);

    setInterval(() => {
      this.checkThrowObjects();
    }, 50);
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
          return;
        }

        if (this.character.isColliding(enemy) && !this.character.isHurt()) {
          this.character.hit(enemy instanceof ChickenSmall ? 2 : 5);
          this.statusbar.setPercentage(this.character.life);
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
      }
    });

    if (!this.gameEnding && this.character.isDead()) {
      this.gameEnding = true;
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
      } else if (item.type === "coin") {
        item.collect();
        this.collectedCoins++;
        this.updateCoinStatusbar();
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);
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

    if (this.gameOver) {
      this.ctx.drawImage(
        this.imageGameOver,
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
    } else if (this.gameWon) {
      this.ctx.drawImage(
        this.imageWon,
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
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
