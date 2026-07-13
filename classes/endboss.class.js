/**
 * Final boss enemy with alert, attack, hurt, and death behavior.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  x = 2550;
  y = 50;
  width = 350;
  height = 400;
  speed = 12;
  isAlerted = false;
  isAttacking = false;
  alertUntil = 0;
  sightRange = 500;
  deathFrameIndex = 0;
  bottleDropsGiven = 0;
  hurtDuration = 0.3;
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

  /** Preloads all animation frames and starts the behavior loop. */
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

  /** Reduces life by a fixed amount and records the hit time. */
  hit() {
    this.life -= 20;
    if (this.life < 0) this.life = 0;
    else this.lastHit = new Date().getTime();
  }

  /**
   * Horizontal distance to the character.
   * @returns {number}
   */
  distanceToPepe() {
    return Math.abs(this.world.character.x - this.x);
  }

  /**
   * Checks if the character is within sight range.
   * @returns {boolean}
   */
  isPepeNearby() {
    return this.distanceToPepe() < this.sightRange;
  }

  /**
   * Checks if the character is close enough to be attacked.
   * @returns {boolean}
   */
  isPepeInAttackRange() {
    return this.world.character.isColliding(this);
  }

  /** Runs the main behavior loop, checking states in priority order each tick. */
  animate() {
    let tick = 0;
    World.track(setInterval(() => {
      const isNewPoseFrame = tick % 3 === 0;
      tick++;
      if (this.tickDeathAnimation()) return;
      if (this.tickHurtAnimation(isNewPoseFrame)) return;
      if (this.tickAlertDetection(isNewPoseFrame)) return;
      if (this.tickAlertPose(isNewPoseFrame)) return;
      this.tickAttackBehavior(isNewPoseFrame);
    }, 1000 / 30));
  }

  /**
   * Plays the death animation frame by frame if the boss is dead.
   * @returns {boolean} true if the death animation handled this tick
   */
  tickDeathAnimation() {
    if (!this.isDead()) return false;
    if (this.deathFrameIndex < this.IMAGES_DEAD.length) {
      this.img = this.imageCache[this.IMAGES_DEAD[this.deathFrameIndex]];
      this.y += 50 / this.IMAGES_DEAD.length;
      this.deathFrameIndex++;
    }
    return true;
  }

  /**
   * Plays the hurt animation if the boss was hit recently.
   * @param {boolean} isNewPoseFrame - whether to advance to the next frame
   * @returns {boolean} true if the hurt animation handled this tick
   */
  tickHurtAnimation(isNewPoseFrame) {
    if (!this.isHurt()) return false;
    if (isNewPoseFrame) this.playAnimation(this.IMAGES_HURT);
    return true;
  }

  /**
   * Detects the character and switches to the alert state once nearby.
   * @param {boolean} isNewPoseFrame - whether to advance to the next frame
   * @returns {boolean} true while not yet alerted
   */
  tickAlertDetection(isNewPoseFrame) {
    if (this.isAlerted) return false;
    if (isNewPoseFrame) this.playAnimation(this.IMAGES_WALKING);
    if (this.world && this.isPepeNearby()) {
      this.isAlerted = true;
      this.alertUntil = Date.now() + this.IMAGES_ALERT.length * 200;
      this.world.soundManager.play("endbossApproach");
    }
    return true;
  }

  /**
   * Plays the alert pose animation until the alert timer runs out.
   * @param {boolean} isNewPoseFrame - whether to advance to the next frame
   * @returns {boolean} true while the alert pose is still active
   */
  tickAlertPose(isNewPoseFrame) {
    if (Date.now() >= this.alertUntil) return false;
    if (isNewPoseFrame) this.playAnimation(this.IMAGES_ALERT);
    return true;
  }

  /**
   * Attacks the character if in range, otherwise keeps walking left.
   * @param {boolean} isNewPoseFrame - whether to advance to the next frame
   */
  tickAttackBehavior(isNewPoseFrame) {
    this.isAttacking = this.isPepeInAttackRange();
    if (isNewPoseFrame) {
      this.playAnimation(
        this.isAttacking ? this.IMAGES_ATTACK : this.IMAGES_WALKING,
      );
    }
    if (!this.isAttacking) {
      this.moveLeft();
    }
  }
}
