/** Handles all per-tick collision, combat, and item-pickup checks for a World. */
class CollisionManager {
  world;

  /** @param {World} world - the world this manager checks collisions for */
  constructor(world) {
    this.world = world;
  }

  /** Runs all per-tick collision checks (enemies, bottles, end conditions, items). */
  checkCollisions() {
    this.checkEnemyCollisions();
    this.checkBottleCollisions();
    this.checkGameEndConditions();
    this.checkCollectableCollisions();
  }

  /** Checks chicken stomps first, then applies damage from remaining enemies. */
  checkEnemyCollisions() {
    const stomped = this.processChickenStomps();
    this.processEnemyDamage(stomped);
  }

  /**
   * Stomps every chicken currently under the character's feet.
   * @returns {boolean} true if at least one chicken was stomped
   */
  processChickenStomps() {
    let stomped = false;
    this.world.level.enemies.forEach((enemy) => {
      if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
        if (this.checkChickenStomp(enemy)) stomped = true;
      }
    });
    return stomped;
  }

  /**
   * Applies damage from chickens (if none were stomped) and from the endboss.
   * @param {boolean} stomped - whether a chicken was stomped this tick
   */
  processEnemyDamage(stomped) {
    this.world.level.enemies.forEach((enemy) => {
      if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
        if (!stomped) this.checkChickenDamage(enemy);
      } else if (enemy instanceof Endboss) {
        this.checkEndbossCollision(enemy);
      }
    });
  }

  /**
   * Stomps the given chicken if the character is jumping on it.
   * @param {Chicken|ChickenSmall} enemy - the enemy to check
   * @returns {boolean} true if the enemy was stomped
   */
  checkChickenStomp(enemy) {
    if (enemy.isDead) return false;
    if (!this.isStompingOn(enemy) || !this.world.character.isColliding(enemy)) {
      return false;
    }

    enemy.hitFromAbove();
    this.world.character.speedY = 20;
    this.world.character.isJumping = true;
    this.world.soundManager.play(
      enemy instanceof ChickenSmall ? "chickenSmallDead" : "chickenDead",
    );
    return true;
  }

  /**
   * Damages the character if colliding with a living chicken.
   * @param {Chicken|ChickenSmall} enemy - the enemy to check
   */
  checkChickenDamage(enemy) {
    if (enemy.isDead) return;

    if (
      this.world.character.isColliding(enemy) &&
      !this.world.character.isHurt() &&
      !this.world.character.isDead()
    ) {
      this.world.character.hit(enemy instanceof ChickenSmall ? 2 : 5);
      this.world.statusbar.setPercentage(this.world.character.life);
      this.world.soundManager.play("hit");
    }
  }

  /**
   * Damages the character if the attacking endboss collides with it.
   * @param {Endboss} enemy - the endboss to check
   */
  checkEndbossCollision(enemy) {
    if (
      this.world.boss &&
      !this.world.boss.isDead() &&
      this.world.boss.isAttacking &&
      this.world.character.isColliding(this.world.boss) &&
      !this.world.character.isHurt() &&
      !this.world.character.isDead()
    ) {
      this.world.character.hit(10);
      this.world.statusbar.setPercentage(this.world.character.life);
      this.world.soundManager.play("hit");
    }
  }

  /** Checks all thrown bottles for hits on the endboss. */
  checkBottleCollisions() {
    this.world.throwableObjects.forEach((bottle) => {
      if (this.isBottleHittingBoss(bottle)) this.applyBossHit(bottle);
    });
  }

  /**
   * Applies a bottle hit to the endboss and updates its status bar.
   * @param {ThrowableObject} bottle - the bottle that hit
   */
  applyBossHit(bottle) {
    bottle.hitBoss();
    this.world.boss.hit();
    this.world.endbossStatusbar.setPercentage(this.world.boss.life);
    this.world.soundManager.play("bottleBreak");
    this.world.soundManager.play(this.world.boss.isDead() ? "endbossDead" : "endbossHit");
    this.maybeDropBossBottle();
  }

  /** Drops a bonus bottle from the boss once per life threshold, up to twice. */
  maybeDropBossBottle() {
    if (this.world.boss.life >= 50 || this.world.boss.bottleDropsGiven >= 2 || this.world.boss.isDead()) {
      return;
    }
    this.dropBossBottle();
    this.world.boss.bottleDropsGiven++;
  }

  /** Spawns a collectible bottle at the boss and sends it flying to the character. */
  dropBossBottle() {
    const startX = this.world.boss.x + this.world.boss.width / 2 - 30;
    const startY = this.world.boss.y + this.world.boss.height - 70;
    const bottle = new CollectibleObject(
      "assets/imgs/6_salsa_bottle/1_salsa_bottle_on_ground.png",
      startX,
      startY,
      60,
      70,
      "bottle",
    );
    this.world.collectibleObjects.push(bottle);
    this.flyBottleToCharacter(bottle, startX, startY);
  }

  /**
   * Animates a bottle flying in an arc from its start position to the character.
   * @param {CollectibleObject} bottle - the bottle to move
   * @param {number} startX - starting x position
   * @param {number} startY - starting y position
   */
  flyBottleToCharacter(bottle, startX, startY) {
    const targetX = this.world.character.x;
    const targetY = 360;
    const arcHeight = 120;
    const steps = 20;
    let step = 0;
    const flightInterval = World.track(setInterval(() => {
      step++;
      const t = step / steps;
      bottle.x = startX + (targetX - startX) * t;
      bottle.y = bottle.baseY = startY + (targetY - startY) * t - arcHeight * Math.sin(Math.PI * t);
      if (step >= steps) clearInterval(flightInterval);
    }, 25));
  }

  /**
   * Checks if a flying bottle overlaps the endboss's hit area.
   * @param {ThrowableObject} bottle - the bottle to check
   * @returns {boolean}
   */
  isBottleHittingBoss(bottle) {
    return (
      !bottle.isSplash &&
      this.world.boss &&
      !this.world.boss.isDead() &&
      bottle.x + bottle.width > this.world.boss.x + 80 &&
      bottle.x < this.world.boss.x + this.world.boss.width - 80 &&
      bottle.y + bottle.height > this.world.boss.y + 80 &&
      bottle.y < this.world.boss.y + this.world.boss.height - 80
    );
  }

  /** Checks whether the game should end (character or boss death). */
  checkGameEndConditions() {
    this.checkCharacterDeathEnd();
    this.checkBossDeathEnd();
  }

  /** Triggers the game-over sequence once the character dies. */
  checkCharacterDeathEnd() {
    if (this.world.gameEnding || !this.world.character.isDead()) return;
    this.world.gameEnding = true;
    this.world.soundManager.play("characterDead");
    setTimeout(() => {
      this.world.gameOver = true;
    }, 1500);
  }

  /** Triggers the win sequence once the endboss dies. */
  checkBossDeathEnd() {
    if (this.world.gameEnding || !this.world.boss || !this.world.boss.isDead()) return;
    this.world.gameEnding = true;
    setTimeout(() => {
      this.world.gameWon = true;
    }, 1500);
  }

  /** Collects any coin or bottle the character is currently touching. */
  checkCollectableCollisions() {
    this.world.collectibleObjects.forEach((item) => {
      if (item.collected || !this.world.character.isColliding(item)) return;
      if (item.type === "bottle") {
        this.collectBottle(item);
      } else if (item.type === "coin") {
        this.collectCoinItem(item);
      }
    });
  }

  /**
   * Collects a bottle item, if under the max bottle limit.
   * @param {CollectibleObject} item - the bottle to collect
   */
  collectBottle(item) {
    if (this.world.collectedBottles >= this.world.maxBottles) return;
    item.collect();
    this.world.collectedBottles++;
    this.world.updateBottleStatusbar();
    this.world.soundManager.play("collectBottle");
  }

  /**
   * Collects a coin item.
   * @param {CollectibleObject} item - the coin to collect
   */
  collectCoinItem(item) {
    item.collect();
    this.world.collectedCoins++;
    this.world.updateCoinStatusbar();
    this.world.soundManager.play("collectCoin");
  }

  /** Trades 5 collected coins for one bottle, if possible. */
  exchangeCoinsForBottle() {
    const cost = 5;
    if (
      this.world.character.isDead() ||
      this.world.collectedCoins < cost ||
      this.world.collectedBottles >= this.world.maxBottles
    )
      return;
    this.world.collectedCoins -= cost;
    this.world.collectedBottles++;
    this.world.updateCoinStatusbar();
    this.world.updateBottleStatusbar();
    this.world.soundManager.play("collectBottle");
  }

  /**
   * Checks if the character is falling onto the given enemy's upper body.
   * @param {Chicken|ChickenSmall} enemy - the enemy to check
   * @returns {boolean}
   */
  isStompingOn(enemy) {
    return (
      this.world.character.speedY < 0 &&
      this.world.character.y + this.world.character.height - this.world.character.offset.bottom <
        enemy.y + enemy.height * (enemy instanceof ChickenSmall ? 0.75 : 0.6)
    );
  }
}
