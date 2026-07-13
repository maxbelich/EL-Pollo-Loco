let level1;

/** Builds level 1 with its enemies, clouds, background, and items. */
function initLevel1() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgroundObjects(),
    createCollectables(),
  );
}

/**
 * Creates the enemies for level 1.
 * @returns {Array}
 */
function createEnemies() {
  return [
    new Chicken(), new Chicken(), new Chicken(), new Endboss(),
    new ChickenSmall(), new ChickenSmall(), new ChickenSmall(),
    new ChickenSmall(), new ChickenSmall(), new ChickenSmall(),
    new Chicken(1800), new Chicken(1800), new ChickenSmall(1800), new ChickenSmall(1800),
    new Chicken(1800), new Chicken(1800), new ChickenSmall(1800), new ChickenSmall(1800),
  ];
}

/**
 * Creates the clouds for level 1.
 * @returns {Cloud[]}
 */
function createClouds() {
  return [new Cloud()];
}

/**
 * Creates one background tile (all four parallax layers) at the given x position.
 * @param {number} x - horizontal position of the tile
 * @param {string} variant - image variant ("1" or "2")
 * @returns {BackgroundObject[]}
 */
function createBackgroundTile(x, variant) {
  return [
    new BackgroundObject("assets/imgs/5_background/layers/air.png", x),
    new BackgroundObject(`assets/imgs/5_background/layers/3_third_layer/${variant}.png`, x),
    new BackgroundObject(`assets/imgs/5_background/layers/2_second_layer/${variant}.png`, x),
    new BackgroundObject(`assets/imgs/5_background/layers/1_first_layer/${variant}.png`, x),
  ];
}

/**
 * Creates all background tiles that make up the level's parallax background.
 * @returns {BackgroundObject[]}
 */
function createBackgroundObjects() {
  const tilePositions = [-720, 0, 720, 720 * 2, 720 * 3];
  return tilePositions
    .map((x, i) => createBackgroundTile(x, i % 2 === 0 ? "2" : "1"))
    .flat();
}

/**
 * Creates the collectible bottles for level 1.
 * @returns {CollectibleObject[]}
 */
function createBottles() {
  return [
    new CollectibleObject("assets/imgs/6_salsa_bottle/1_salsa_bottle_on_ground.png", 400, 360, 60, 70, "bottle"),
    new CollectibleObject("assets/imgs/6_salsa_bottle/2_salsa_bottle_on_ground.png", 900, 360, 60, 70, "bottle"),
    new CollectibleObject("assets/imgs/6_salsa_bottle/1_salsa_bottle_on_ground.png", 1300, 360, 60, 70, "bottle"),
    new CollectibleObject("assets/imgs/6_salsa_bottle/2_salsa_bottle_on_ground.png", 1450, 360, 60, 70, "bottle"),
    new CollectibleObject("assets/imgs/6_salsa_bottle/2_salsa_bottle_on_ground.png", 1600, 360, 60, 70, "bottle"),
    new CollectibleObject("assets/imgs/6_salsa_bottle/1_salsa_bottle_on_ground.png", 1900, 360, 60, 70, "bottle"),
    new CollectibleObject("assets/imgs/6_salsa_bottle/2_salsa_bottle_on_ground.png", 2050, 360, 60, 70, "bottle"),
  ];
}

/**
 * Creates the collectible coins for level 1.
 * @returns {CollectibleObject[]}
 */
function createCoins() {
  return [
    new CollectibleObject("assets/imgs/8_coin/coin_2.png", 600, 140, 120, 120, "coin"),
    new CollectibleObject("assets/imgs/8_coin/coin_2.png", 900, 220, 120, 120, "coin"),
    new CollectibleObject("assets/imgs/8_coin/coin_2.png", 1200, 100, 120, 120, "coin"),
    new CollectibleObject("assets/imgs/8_coin/coin_2.png", 1500, 220, 120, 120, "coin"),
    new CollectibleObject("assets/imgs/8_coin/coin_2.png", 1800, 140, 120, 120, "coin"),
  ];
}

/**
 * Combines bottles and coins into the full collectables list.
 * @returns {CollectibleObject[]}
 */
function createCollectables() {
  return [...createBottles(), ...createCoins()];
}
