class CollectibleObject extends MovableObject {
  collected = false;
  type;
  baseY;
  floatAmplitude = 8;

  constructor(imagePath, x, y, width, height, type = "coin") {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = this.baseY = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.offset = this.buildOffset(type);
    if (this.type === "coin") this.animate();
  }

  buildOffset(type) {
    const inset = type === "coin" ? 30 : 0;
    return { top: inset, bottom: inset, right: inset, left: inset };
  }

  animate() {
    World.track(setInterval(() => {
      if (!this.collected) {
        this.y = this.baseY + Math.sin(Date.now() / 300) * this.floatAmplitude;
      }
    }, 1000 / 60));
  }

  collect() {
    this.collected = true;
  }
}
