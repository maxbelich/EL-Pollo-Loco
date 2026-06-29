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

  constructor() {
    super();
    this.loadImage(
      "assets/imgs/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    );
    this.speed = 0.6 + Math.random() * 0.4;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.isDead) {
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
      } else {
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 1000 / 60);
  }

  hitFromAbove() {
    if (!this.isDead) {
      this.isDead = true;
      this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }
  }
}
