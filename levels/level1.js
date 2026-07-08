let level1;

function initLevel1() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgroundObjects(),
    createCollectables(),
  );
}

function createEnemies() {
  return [
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Endboss(),
    new ChickenSmall(),
    new ChickenSmall(),
    new ChickenSmall(),
    new ChickenSmall(),
    new ChickenSmall(),
    new ChickenSmall(),
    new Chicken(1800),
    new Chicken(1800),
    new ChickenSmall(1800),
    new ChickenSmall(1800),
    new Chicken(1800),
    new Chicken(1800),
    new ChickenSmall(1800),
    new ChickenSmall(1800),
  ];
}

function createClouds() {
  return [new Cloud()];
}

function createBackgroundTile(x, variant) {
  return [
    new BackgroundObject("assets/imgs/5_background/layers/air.png", x),
    new BackgroundObject(
      `assets/imgs/5_background/layers/3_third_layer/${variant}.png`,
      x,
    ),
    new BackgroundObject(
      `assets/imgs/5_background/layers/2_second_layer/${variant}.png`,
      x,
    ),
    new BackgroundObject(
      `assets/imgs/5_background/layers/1_first_layer/${variant}.png`,
      x,
    ),
  ];
}

function createBackgroundObjects() {
  const tilePositions = [-720, 0, 720, 720 * 2, 720 * 3];
  return tilePositions
    .map((x, i) => createBackgroundTile(x, i % 2 === 0 ? "2" : "1"))
    .flat();
}

function createBottles() {
  return [
    new CollectibleObject(
      "assets/imgs/6_salsa_bottle/1_salsa_bottle_on_ground.png",
      400,
      360,
      60,
      70,
      "bottle",
    ),
    new CollectibleObject(
      "assets/imgs/6_salsa_bottle/2_salsa_bottle_on_ground.png",
      900,
      360,
      60,
      70,
      "bottle",
    ),
    new CollectibleObject(
      "assets/imgs/6_salsa_bottle/1_salsa_bottle_on_ground.png",
      1300,
      360,
      60,
      70,
      "bottle",
    ),
    new CollectibleObject(
      "assets/imgs/6_salsa_bottle/2_salsa_bottle_on_ground.png",
      1450,
      360,
      60,
      70,
      "bottle",
    ),
    new CollectibleObject(
      "assets/imgs/6_salsa_bottle/2_salsa_bottle_on_ground.png",
      1600,
      360,
      60,
      70,
      "bottle",
    ),
    new CollectibleObject(
      "assets/imgs/6_salsa_bottle/1_salsa_bottle_on_ground.png",
      1900,
      360,
      60,
      70,
      "bottle",
    ),
    new CollectibleObject(
      "assets/imgs/6_salsa_bottle/2_salsa_bottle_on_ground.png",
      2050,
      360,
      60,
      70,
      "bottle",
    ),
  ];
}

function createCoins() {
  return [
    new CollectibleObject("assets/imgs/8_coin/coin_2.png", 600, 140, 120, 120, "coin"),
    new CollectibleObject("assets/imgs/8_coin/coin_2.png", 900, 220, 120, 120, "coin"),
    new CollectibleObject("assets/imgs/8_coin/coin_2.png", 1200, 100, 120, 120, "coin"),
    new CollectibleObject("assets/imgs/8_coin/coin_2.png", 1500, 220, 120, 120, "coin"),
    new CollectibleObject("assets/imgs/8_coin/coin_2.png", 1800, 140, 120, 120, "coin"),
  ];
}

function createCollectables() {
  return [...createBottles(), ...createCoins()];
}
