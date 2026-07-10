class Chicken extends MovableObject {
  x = 450 + Math.random() * 500;
  y = 345;
  width = 80;
  height = 80;
  isDead = false;
  
  IMAGES_WALKING = [
    "assets/imgs/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/imgs/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/imgs/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = [
    "assets/imgs/3_enemies_chicken/chicken_normal/2_dead/dead.png",
  ];

  constructor(xMin = 450) {
    super();
    this.x = xMin + Math.random() * 500;
    this.loadImage(
      "assets/imgs/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    );
    this.speed = 2.5 + Math.random() * 0.6;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  animate() {
    World.track(setInterval(() => {
      if (this.isDead) {
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
      } else {
        this.checkMapBounds();
        this.otherDirection ? this.moveRight() : this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 1000 / 20));
  }

  checkMapBounds() {
    if (this.x <= 0) {
      this.otherDirection = true;
    } else if (this.x >= 2200) {
      this.otherDirection = false;
    }
  }

  hitFromAbove() {
    if (!this.isDead) {
      this.isDead = true;
      this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }
  }
}
