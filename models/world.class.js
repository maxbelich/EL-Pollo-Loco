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
  throwableObjects = [];
  collectibleObjects = [];
  bottleThrowCooldown = 0;
  collectedBottles = 0;
  collectedCoins = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.collectibleObjects = this.level.collectables || [];
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
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
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100,
      );
      this.throwableObjects.push(bottle);
      this.collectedBottles--;
      this.updateBottleStatusbar();
      this.bottleThrowCooldown = 10;
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusbar.setPercentage(this.character.life);
      }
    });

    const boss = this.level.enemies.find((enemy) => enemy instanceof Endboss);

    this.throwableObjects.forEach((bottle) => {
      const hitBoss =
        boss &&
        bottle.x + bottle.width > boss.x + 80 &&
        bottle.x < boss.x + boss.width - 80 &&
        bottle.y + bottle.height > boss.y + 80 &&
        bottle.y < boss.y + boss.height - 80;

      if (!bottle.collected && hitBoss) {
        bottle.hitBoss();
      }
    });

    this.collectibleObjects.forEach((item) => {
      if (!item.collected && this.character.isColliding(item)) {
        item.collect();
        if (item.type === "bottle") {
          this.collectedBottles++;
          this.updateBottleStatusbar();
        } else if (item.type === "coin") {
          this.collectedCoins++;
          this.updateCoinStatusbar();
        }
      }
    });
  }

  updateBottleStatusbar() {
    const percentage = this.collectedBottles * 20;
    this.bottleStatusbar.setPercentage(Math.max(0, Math.min(100, percentage)));
  }

  updateCoinStatusbar() {
    const percentage = this.collectedCoins * 20;
    this.coinStatusbar.setPercentage(Math.max(0, Math.min(100, percentage)));
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
    this.ctx.translate(this.camera_x, 0);
    //-------------------------------------------------

    this.ctx.translate(-this.camera_x, 0);

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

    mo.drawFrame(this.ctx);
    mo.drawFrameOffset(this.ctx);

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
