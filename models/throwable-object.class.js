class ThrowableObject extends MovableObject {
  IMAGES_BOTTLE = [
    "assets/imgs/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/imgs/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/imgs/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/imgs/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "assets/imgs/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "assets/imgs/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "assets/imgs/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "assets/imgs/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "assets/imgs/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "assets/imgs/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  isSplash = false;
  splashTimer = 0;
  moveInterval;
  animationInterval;

  constructor(x, y) {
    super();
    this.loadImage(this.IMAGES_BOTTLE[0]);
    this.loadImages(this.IMAGES_BOTTLE);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 60;
    this.throw();
    this.animateBottle();
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();
    this.moveInterval = setInterval(() => {
      if (!this.isSplash) {
        this.x += 20;
      }
    }, 25);
  }

  animateBottle() {
    this.animationInterval = setInterval(() => {
      if (this.isSplash) {
        this.splashTimer++;
        this.playAnimation(this.IMAGES_SPLASH);
        if (this.splashTimer > 4) {
          this.collected = true;
          clearInterval(this.animationInterval);
          clearInterval(this.moveInterval);
        }
      } else {
        this.playAnimation(this.IMAGES_BOTTLE);
      }
    }, 100);
  }

  hitBoss() {
    if (!this.isSplash) {
      this.isSplash = true;
      this.splashTimer = 0;
      this.currentImage = 0;
      this.speedY = 0;
      this.acceleration = 0;
      if (this.moveInterval) {
        clearInterval(this.moveInterval);
      }
    }
  }

  animateSplash() {
    if (!this.isSplash) {
      this.playAnimation(this.IMAGES_BOTTLE);
    }
  }
}
