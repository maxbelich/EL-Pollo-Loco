/** Holds all objects of a game level (enemies, clouds, background, items). */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  collectables;
  level_end_x = 2200;

  /**
   * @param {Array} enemies - enemy objects of the level
   * @param {Array} clouds - cloud objects of the level
   * @param {Array} backgroundObjects - background objects of the level
   * @param {Array} [collectables] - collectable items (coins, bottles)
   */
  constructor(enemies, clouds, backgroundObjects, collectables = []) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.collectables = collectables;
  }
}