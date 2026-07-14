/**
 * Object with physics: gravity, movement, collision, and health.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.7;
  offset = {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  };
  life = 100;
  lastHit = 0;
  hurtDuration = 0.25;

  /** Applies gravity until the object reaches the ground. */
  applyGravity() {
    World.track(
      setInterval(() => {
        if (this.isAboveGround() || this.speedY > 0) {
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
          if (!this.isAboveGround() && this.speedY <= 0) {
            this.y = 120;
            this.speedY = 0;
          }
        }
      }, 1000 / 45),
    );
  }

  /**
   * Checks if the object is above the ground level.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 120;
    }
  }

  /** Moves the object to the right. */
  moveRight() {
    this.x += this.speed;
  }

  /** Moves the object to the left. */
  moveLeft() {
    this.x -= this.speed;
  }

  /** Starts a jump by setting the vertical speed. */
  jump() {
    this.speedY = 30.05;
    this.isJumping = true;
  }

  /**
   * Sets the current image to the next frame in the given animation.
   * @param {string[]} images - list of image paths for the animation
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Checks collision with another movable object using bounding boxes and offsets.
   * @param {MovableObject} mo - the other object
   * @returns {boolean}
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left && // R -> L
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top && // T-> B
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right && // L -> R
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom // B -> T
    );
  }

  /**
   * Reduces life by the given damage and records the hit time.
   * @param {number} [damage] - amount of damage to take
   */
  hit(damage = 5) {
    this.life -= damage;
    if (this.life < 0) this.life = 0;
    this.lastHit = new Date().getTime();
  }

  /**
   * Checks if the object has run out of life.
   * @returns {boolean}
   */
  isDead() {
    return this.life == 0;
  }

  /**
   * Checks if the object was hit recently and is still in the hurt state.
   * @returns {boolean}
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < this.hurtDuration;
  }
}
