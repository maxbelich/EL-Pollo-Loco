class Chicken extends MovableObject {
  x = 450 + Math.random() * 500;
  y = 345;
  width = 80;
  height = 80;
  IMAGES_WALKING = [
    "assets/imgs/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/imgs/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/imgs/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
    super();
    this.loadImage(
      "assets/imgs/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    );
    this.speed = 0.6 + Math.random() * 0.4;
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  animate() {
    this.moveLeft();

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 115);
  }
}