/**
 * Bottle thrown by the character; flies, splashes on hit, then disappears.
 * @extends MovableObject
 */
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

  /**
   * @param {number} x - starting horizontal position
   * @param {number} y - starting vertical position
   * @param {boolean} [otherDirection] - true to throw to the left
   */
  constructor(x, y, otherDirection = false) {
    super();
    this.loadImage(this.IMAGES_BOTTLE[0]);
    this.loadImages(this.IMAGES_BOTTLE);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 60;
    this.otherDirection = otherDirection;
    this.throw();
    this.animateBottle();
  }

  /** Starts the fall (gravity) and horizontal flight of the bottle. */
  throw() {
    this.speedY = 30;
    this.applyGravity();
    const direction = this.otherDirection ? -1 : 1;
    this.moveInterval = World.track(setInterval(() => {
      if (!this.isSplash) {
        this.x += 20 * direction;
      }
    }, 25));
  }

  /** Runs the rotation animation while flying, or the splash once hit. */
  animateBottle() {
    this.animationInterval = World.track(setInterval(() => {
      if (this.isSplash) {
        this.advanceSplashAnimation();
      } else {
        this.playAnimation(this.IMAGES_BOTTLE);
      }
    }, 100));
  }

  /** Advances the splash animation and stops all intervals once it finishes. */
  advanceSplashAnimation() {
    this.splashTimer++;
    this.playAnimation(this.IMAGES_SPLASH);
    if (this.splashTimer > 4) {
      this.collected = true;
      clearInterval(this.animationInterval);
      clearInterval(this.moveInterval);
    }
  }

  /** Stops the flight and switches the bottle into its splash state. */
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

  /** Plays the rotation animation while the bottle hasn't splashed yet. */
  animateSplash() {
    if (!this.isSplash) {
      this.playAnimation(this.IMAGES_BOTTLE);
    }
  }
}
