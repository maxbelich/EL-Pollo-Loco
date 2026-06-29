class Statusbar extends DrawableObjet {
  IMAGES_LIFE = [
    "assets/imgs/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "assets/imgs/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "assets/imgs/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "assets/imgs/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "assets/imgs/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "assets/imgs/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  IMAGES_COIN = [
    "assets/imgs/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "assets/imgs/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "assets/imgs/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "assets/imgs/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "assets/imgs/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "assets/imgs/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  IMAGES_BOTTLE = [
    "assets/imgs/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "assets/imgs/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "assets/imgs/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "assets/imgs/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "assets/imgs/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "assets/imgs/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];

  percentage = 100;
  images = [];

  constructor(type = "life") {
    super();
    this.images = this.getImagesForType(type);
    this.loadImages(this.images);
    this.x = 20;
    this.y = type === "bottle" ? 0 : type === "coin" ? 45 : 85;
    this.width = 200;
    this.height = 60;
    this.setPercentage(type === "life" ? 100 : 0);
  }

  getImagesForType(type) {
    if (type === "coin") {
      return this.IMAGES_COIN;
    } else if (type === "bottle") {
      return this.IMAGES_BOTTLE;
    }
    return this.IMAGES_LIFE;
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentage >= 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
