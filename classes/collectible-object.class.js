/**
 * Item that can be picked up by the character (coin or bottle).
 * @extends MovableObject
 */
class CollectibleObject extends MovableObject {
  collected = false;
  type;
  baseY;
  floatAmplitude = 8;

  /**
   * @param {string} imagePath - path to the item image
   * @param {number} x - horizontal position
   * @param {number} y - vertical position
   * @param {number} width - item width
   * @param {number} height - item height
   * @param {string} [type] - item type ("coin" or "bottle")
   */
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

  /**
   * Builds the collision offset box based on item type.
   * @param {string} type - item type
   * @returns {{top: number, bottom: number, right: number, left: number}}
   */
  buildOffset(type) {
    const inset = type === "coin" ? 30 : 0;
    return { top: inset, bottom: inset, right: inset, left: inset };
  }

  /** Makes the item float up and down while not collected. */
  animate() {
    World.track(setInterval(() => {
      if (!this.collected) {
        this.y = this.baseY + Math.sin(Date.now() / 300) * this.floatAmplitude;
      }
    }, 1000 / 60));
  }

  /** Marks the item as collected. */
  collect() {
    this.collected = true;
  }
}
