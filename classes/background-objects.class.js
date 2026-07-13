/**
 * Static background layer image placed at a fixed x position.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * @param {string} imagePath - path to the background image
   * @param {number} x - horizontal position
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
} 