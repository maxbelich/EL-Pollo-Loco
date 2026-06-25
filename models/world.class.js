class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.draw();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.ctx.save();
      this.ctx.translate(mo.width, 0);
      this.ctx.scale(-1, 1);
      mo.x = mo.x * -1;
    }
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    if (mo.otherDirection) {
      mo.x = mo.x * -1;
      this.ctx.restore();
    }
  }

  reateBackgroundObjects(tilesToLeft, tilesToRight) {
    const backgroundObjects = [];

    for (let tileIndex = -tilesToLeft; tileIndex <= tilesToRight; tileIndex++) {
      const x = tileIndex * 720;
      const imageNumber = Math.abs(tileIndex) % 2 === 0 ? 1 : 2;

      backgroundObjects.push(
        new BackgroundObject("assets/imgs/5_background/layers/air.png", x),
        new BackgroundObject(
          `assets/imgs/5_background/layers/3_third_layer/${imageNumber}.png`,
          x,
        ),
        new BackgroundObject(
          `assets/imgs/5_background/layers/2_second_layer/${imageNumber}.png`,
          x,
        ),
        new BackgroundObject(
          `assets/imgs/5_background/layers/1_first_layer/${imageNumber}.png`,
          x,
        ),
      );
    }

    return backgroundObjects;
  }
}
