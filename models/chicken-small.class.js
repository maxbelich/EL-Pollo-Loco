class ChickenSmall extends MovableObject {
  x = 450 + Math.random() * 700;
  y = 385;
  width = 40;
  height = 40;
  isDead = false;
  offset = {
    top: -20,
    bottom: 0,
    left: 0,
    right: 0,
  };

  IMAGES_WALKING = [
    "assets/imgs/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/imgs/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/imgs/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = [
    "assets/imgs/3_enemies_chicken/chicken_small/2_dead/dead.png",
  ];

  constructor(xMin = 450) {
    super();
    this.x = xMin + Math.random() * 500;
    this.loadImage(this.IMAGES_WALKING[0]);
    this.speed = 2.5 + Math.random() * 1;
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
    }, 1000 / 20);
  }

  hitFromAbove() {
    if (!this.isDead) {
      this.isDead = true;
      this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }
  }
}
