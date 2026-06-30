class Endboss extends MovableObject {
  x = 2550;
  y = 50;
  width = 350;
  height = 400;
  speed = 4;
  isAlerted = false;
  isAttacking = false;
  deathFrameIndex = 0;
  world;

  IMAGES_WALKING = [
    "assets/imgs/4_enemie_boss_chicken/1_walk/G1.png",
    "assets/imgs/4_enemie_boss_chicken/1_walk/G2.png",
    "assets/imgs/4_enemie_boss_chicken/1_walk/G3.png",
    "assets/imgs/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "assets/imgs/4_enemie_boss_chicken/2_alert/G5.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G6.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G7.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G8.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G9.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G10.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G11.png",
    "assets/imgs/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "assets/imgs/4_enemie_boss_chicken/3_attack/G13.png",
    "assets/imgs/4_enemie_boss_chicken/3_attack/G14.png",
    "assets/imgs/4_enemie_boss_chicken/3_attack/G15.png",
    "assets/imgs/4_enemie_boss_chicken/3_attack/G16.png",
    "assets/imgs/4_enemie_boss_chicken/3_attack/G17.png",
    "assets/imgs/4_enemie_boss_chicken/3_attack/G18.png",
    "assets/imgs/4_enemie_boss_chicken/3_attack/G19.png",
    "assets/imgs/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "assets/imgs/4_enemie_boss_chicken/4_hurt/G21.png",
    "assets/imgs/4_enemie_boss_chicken/4_hurt/G22.png",
    "assets/imgs/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "assets/imgs/4_enemie_boss_chicken/5_dead/G24.png",
    "assets/imgs/4_enemie_boss_chicken/5_dead/G25.png",
    "assets/imgs/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  hit() {
    this.life -= 20;
    if (this.life < 0) this.life = 0;
    else this.lastHit = new Date().getTime();
  }

  isPepeNearby() {
    return this.world.character.x > this.x - 500;
  }

  animate() {
    setInterval(() => {
      if (this.isDead()) {
        if (this.deathFrameIndex < this.IMAGES_DEAD.length) {
          this.img = this.imageCache[this.IMAGES_DEAD[this.deathFrameIndex]];
          this.y += 50 / this.IMAGES_DEAD.length;
          this.deathFrameIndex++;
        }
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else if (this.isAlerted) {
        this.playAnimation(this.IMAGES_ALERT);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
        if (this.world && this.isPepeNearby()) {
          this.isAlerted = true;
          setTimeout(() => {
            this.isAttacking = true;
          }, 1600);
        }
      }
    }, 200);

    setInterval(() => {
      if (this.isAttacking && !this.isDead() && !this.isHurt()) {
        this.moveLeft();
      }
    }, 1000 / 40);
  }
}
