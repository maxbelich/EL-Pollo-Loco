class MovableObject extends DrawableObjet {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 3;
  offset = {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  };
  life = 100;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (!this.isAboveGround() && this.speedY <= 0) {
          this.y = 120;
          this.speedY = 0;
        }
      }
    }, 1000 / 60);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 120;
    }
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
    this.isJumping = true;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left && // R -> L
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top && // T-> B
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right && // L -> R
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom // B -> T
    );
  }

  hit(damage = 5) {
    this.life -= damage;
    if (this.life < 0) {
      this.life = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isDead() {
    return this.life == 0;
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.25;
  }
}
