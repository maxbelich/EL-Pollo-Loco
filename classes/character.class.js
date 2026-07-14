/**
 * The playable character (Pepe): movement, jumping, and idle/hurt/dead states.
 * @extends MovableObject
 */
class Character extends MovableObject {
  width = 150;
  height = 310;
  speed = 10;
  isJumping = false;
  offset = {
    top: 120,
    bottom: 30,
    right: 40,
    left: 40,
  };

  IMAGES_WALKING = [
    "assets/imgs/2_character_pepe/2_walk/W-21.png",
    "assets/imgs/2_character_pepe/2_walk/W-22.png",
    "assets/imgs/2_character_pepe/2_walk/W-23.png",
    "assets/imgs/2_character_pepe/2_walk/W-24.png",
    "assets/imgs/2_character_pepe/2_walk/W-25.png",
    "assets/imgs/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "assets/imgs/2_character_pepe/3_jump/J-31.png",
    "assets/imgs/2_character_pepe/3_jump/J-32.png",
    "assets/imgs/2_character_pepe/3_jump/J-33.png",
    "assets/imgs/2_character_pepe/3_jump/J-34.png",
    "assets/imgs/2_character_pepe/3_jump/J-35.png",
    "assets/imgs/2_character_pepe/3_jump/J-36.png",
    "assets/imgs/2_character_pepe/3_jump/J-37.png",
    "assets/imgs/2_character_pepe/3_jump/J-38.png",
    "assets/imgs/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "assets/imgs/2_character_pepe/5_dead/D-51.png",
    "assets/imgs/2_character_pepe/5_dead/D-52.png",
    "assets/imgs/2_character_pepe/5_dead/D-53.png",
    "assets/imgs/2_character_pepe/5_dead/D-54.png",
    "assets/imgs/2_character_pepe/5_dead/D-55.png",
    "assets/imgs/2_character_pepe/5_dead/D-56.png",
    "assets/imgs/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "assets/imgs/2_character_pepe/4_hurt/H-41.png",
    "assets/imgs/2_character_pepe/4_hurt/H-42.png",
    "assets/imgs/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_IDLE = [
    "assets/imgs/2_character_pepe/1_idle/idle/I-1.png",
    "assets/imgs/2_character_pepe/1_idle/idle/I-2.png",
    "assets/imgs/2_character_pepe/1_idle/idle/I-3.png",
    "assets/imgs/2_character_pepe/1_idle/idle/I-4.png",
    "assets/imgs/2_character_pepe/1_idle/idle/I-5.png",
    "assets/imgs/2_character_pepe/1_idle/idle/I-6.png",
    "assets/imgs/2_character_pepe/1_idle/idle/I-7.png",
    "assets/imgs/2_character_pepe/1_idle/idle/I-8.png",
    "assets/imgs/2_character_pepe/1_idle/idle/I-9.png",
    "assets/imgs/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "assets/imgs/2_character_pepe/1_idle/long_idle/I-11.png",
    "assets/imgs/2_character_pepe/1_idle/long_idle/I-12.png",
    "assets/imgs/2_character_pepe/1_idle/long_idle/I-13.png",
    "assets/imgs/2_character_pepe/1_idle/long_idle/I-14.png",
    "assets/imgs/2_character_pepe/1_idle/long_idle/I-15.png",
    "assets/imgs/2_character_pepe/1_idle/long_idle/I-16.png",
    "assets/imgs/2_character_pepe/1_idle/long_idle/I-17.png",
    "assets/imgs/2_character_pepe/1_idle/long_idle/I-18.png",
    "assets/imgs/2_character_pepe/1_idle/long_idle/I-19.png",
    "assets/imgs/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  lastMoveTime = new Date().getTime();
  isSnoring = false;
  world;

  /** Preloads all animation frames and starts gravity and animation loops. */
  constructor() {
    super();
    this.loadImage("assets/imgs/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.applyGravity();
    this.animate();
  }

  /** Starts both the movement and idle animation loops. */
  animate() {
    this.animateMovement();
    this.animateIdle();
  }

  /** Runs the main loop: updates sprite, reads input, and moves the camera. */
  animateMovement() {
    World.track(
      setInterval(() => {
        this.updateSprite();
        this.handleMovementInput();
        this.world.camera_x = -this.x + 100;
      }, 1000 / 15),
    );
  }

  /** Picks the correct animation frame based on the character's current state. */
  updateSprite() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else {
      this.isJumping = false;
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }
  }

  /** Reads keyboard input and applies horizontal movement and jumping. */
  handleMovementInput() {
    if (this.isDead()) return;
    this.handleHorizontalMovement();
    this.handleJumpInput();
  }

  /** Moves left or right based on keyboard state, within level bounds. */
  handleHorizontalMovement() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.lastMoveTime = new Date().getTime();
    }

    if (this.world.keyboard.LEFT && this.x > -100) {
      this.moveLeft();
      this.otherDirection = true;
      this.lastMoveTime = new Date().getTime();
    }
  }

  /** Triggers a jump when the jump keys are pressed and not already jumping. */
  handleJumpInput() {
    if (
      (this.world.keyboard.SPACE && !this.isJumping) ||
      (this.world.keyboard.UP && !this.isJumping)
    ) {
      this.jump();
      this.world.soundManager.play("jump");
      this.lastMoveTime = new Date().getTime();
    }
  }

  /** Starts the loop that checks and updates the idle state. */
  animateIdle() {
    World.track(setInterval(() => this.tickIdleState(), 175));
  }

  /** Advances idle/long-idle/snoring animation for the current frame. */
  tickIdleState() {
    const eligible = this.isIdleEligible();
    if (eligible && this.isLongIdleDue()) {
      this.startLongIdle();
      return;
    }
    this.stopSnoringIfActive();
    if (eligible) this.playAnimation(this.IMAGES_IDLE);
  }

  /**
   * Checks if the character is idle (not dead, hurt, jumping, or moving).
   * @returns {boolean}
   */
  isIdleEligible() {
    return (
      !this.isDead() &&
      !this.isHurt() &&
      !this.isAboveGround() &&
      !this.world.keyboard.RIGHT &&
      !this.world.keyboard.LEFT
    );
  }

  /**
   * Checks if the character has been idle long enough to start snoring.
   * @returns {boolean}
   */
  isLongIdleDue() {
    return (new Date().getTime() - this.lastMoveTime) / 1000 > 5;
  }

  /** Plays the long-idle animation and starts the snoring sound loop. */
  startLongIdle() {
    this.playAnimation(this.IMAGES_LONG_IDLE);
    this.isSnoring = true;
    this.world.soundManager.startLoop("snoring");
  }

  /** Stops the snoring sound loop if it is currently playing. */
  stopSnoringIfActive() {
    if (this.isSnoring) {
      this.isSnoring = false;
      this.world.soundManager.stopLoop("snoring");
    }
  }
}
