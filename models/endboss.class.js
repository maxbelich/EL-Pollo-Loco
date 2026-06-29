class Endboss extends MovableObject {
  x = 450;
  y = 50;
  width = 350;
  height = 400;

  IMAGES_WALKING = [
    "assets/imgs/4_enemie_boss_chicken/2_alert/G5.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G6.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G7.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G8.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G9.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G10.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G11.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);

    this.x = 2550;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }
}
