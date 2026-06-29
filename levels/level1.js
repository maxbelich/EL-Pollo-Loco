const level1 = new Level(
  [new Chicken(), new Chicken(), new Chicken(), new Endboss()],
  [new Cloud()],
  [
    new BackgroundObject("assets/imgs/5_background/layers/air.png", -720),
    new BackgroundObject(
      "assets/imgs/5_background/layers/3_third_layer/2.png",
      -720,
    ),
    new BackgroundObject(
      "assets/imgs/5_background/layers/2_second_layer/2.png",
      -720,
    ),
    new BackgroundObject(
      "assets/imgs/5_background/layers/1_first_layer/2.png",
      -720,
    ),

    new BackgroundObject("assets/imgs/5_background/layers/air.png", 0),
    new BackgroundObject(
      "assets/imgs/5_background/layers/3_third_layer/1.png",
      0,
    ),
    new BackgroundObject(
      "assets/imgs/5_background/layers/2_second_layer/1.png",
      0,
    ),
    new BackgroundObject(
      "assets/imgs/5_background/layers/1_first_layer/1.png",
      0,
    ),

    new BackgroundObject("assets/imgs/5_background/layers/air.png", 720),
    new BackgroundObject(
      "assets/imgs/5_background/layers/3_third_layer/2.png",
      720,
    ),
    new BackgroundObject(
      "assets/imgs/5_background/layers/2_second_layer/2.png",
      720,
    ),
    new BackgroundObject(
      "assets/imgs/5_background/layers/1_first_layer/2.png",
      720,
    ),

    new BackgroundObject("assets/imgs/5_background/layers/air.png", 720 * 2),
    new BackgroundObject(
      "assets/imgs/5_background/layers/3_third_layer/1.png",
      720 * 2,
    ),
    new BackgroundObject(
      "assets/imgs/5_background/layers/2_second_layer/1.png",
      720 * 2,
    ),
    new BackgroundObject(
      "assets/imgs/5_background/layers/1_first_layer/1.png",
      720 * 2,
    ),

    new BackgroundObject("assets/imgs/5_background/layers/air.png", 720 * 3),
    new BackgroundObject(
      "assets/imgs/5_background/layers/3_third_layer/2.png",
      720 * 3,
    ),
    new BackgroundObject(
      "assets/imgs/5_background/layers/2_second_layer/2.png",
      720 * 3,
    ),
    new BackgroundObject(
      "assets/imgs/5_background/layers/1_first_layer/2.png",
      720 * 3,
    ),
  ],
  [
    new CollectibleObject(
      "assets/imgs/6_salsa_bottle/1_salsa_bottle_on_ground.png",
      400,
      360,
      50,
      60,
      "bottle",
    ),
    new CollectibleObject(
      "assets/imgs/6_salsa_bottle/2_salsa_bottle_on_ground.png",
      900,
      360,
      50,
      60,
      "bottle",
    ),
    new CollectibleObject(
      "assets/imgs/6_salsa_bottle/1_salsa_bottle_on_ground.png",
      1300,
      360,
      50,
      60,
      "bottle",
    ),
    new CollectibleObject(
      "assets/imgs/6_salsa_bottle/2_salsa_bottle_on_ground.png",
      1600,
      360,
      50,
      60,
      "bottle",
    ),
    new CollectibleObject(
      "assets/imgs/6_salsa_bottle/1_salsa_bottle_on_ground.png",
      1900,
      360,
      50,
      60,
      "bottle",
    ),
    new CollectibleObject(
      "assets/imgs/8_coin/coin_2.png",
      600,
      240,
      40,
      40,
      "coin",
    ),
    new CollectibleObject(
      "assets/imgs/8_coin/coin_2.png",
      900,
      220,
      40,
      40,
      "coin",
    ),
    new CollectibleObject(
      "assets/imgs/8_coin/coin_2.png",
      1200,
      200,
      40,
      40,
      "coin",
    ),
    new CollectibleObject(
      "assets/imgs/8_coin/coin_2.png",
      1500,
      220,
      40,
      40,
      "coin",
    ),
    new CollectibleObject(
      "assets/imgs/8_coin/coin_2.png",
      1800,
      240,
      40,
      40,
      "coin",
    ),
  ],
);
