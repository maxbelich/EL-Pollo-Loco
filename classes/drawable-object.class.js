/** Base class for objects that can be drawn on the canvas. */
class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 100;
  y = 120;
  width = 100;
  height = 150;

  /**
   * Loads a single image and sets it as the current image.
   * @param {string} path - path to the image file
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /** Draws the current image on the canvas.
   * @param {CanvasRenderingContext2D} ctx - drawing context
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Preloads a list of images into the image cache for later use.
   * @param {string[]} arr - list of image paths
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Debug helper: draws the object's bounding box (Character, Chicken only).
   * @param {CanvasRenderingContext2D} ctx - drawing context
   */
    drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "green";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  /**
   * Debug helper: draws the object's collision offset box.
   * @param {CanvasRenderingContext2D} ctx - drawing context
   */
    drawFrameOffset(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof CollectibleObject) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "red";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.left - this.offset.right,
        this.height - this.offset.top - this.offset.bottom,
      );
      ctx.stroke();
    }
  }
}
