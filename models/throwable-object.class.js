class ThrowableObject extends MovableObject {
  IMAGES_BOTTLE = [
    "assets/imgs/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/imgs/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/imgs/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/imgs/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  constructor(x, y) {
    super().loadImage(
      "assets/imgs/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.throw(100, 150);
  }

  throw (x, y) {
    this.speedY = 30;
    this.applyGravity();
    setInterval(() => {
        this.x += 25;
    }, 25);
  }
}
