class CollectibleObject extends MovableObject {
  collected = false;
  type;
  baseY;
  floatAmplitude = 8;

  constructor(imagePath, x, y, width, height, type = "coin") {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.offset = {
      top: type === "coin" ? 30 : 0,
      bottom: type === "coin" ? 30 : 0,
      right: type === "coin" ? 30 : 0,
      left: type === "coin" ? 30 : 0,
    };

    if (this.type === "coin") {
      this.animate();
    }
  }

  animate() {
    setInterval(() => {
      if (!this.collected) {
        this.y = this.baseY + Math.sin(Date.now() / 300) * this.floatAmplitude;
      }
    }, 1000 / 60);
  }

  collect() {
    this.collected = true;
  }
}
