/**
 * Status bar showing life, coins, bottles, or endboss health as an image.
 * @extends DrawableObject
 */
class Statusbar extends DrawableObject {
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

  IMAGES_ENDBOSS = [
    "assets/imgs/7_statusbars/2_statusbar_endboss/green/green0.png",
    "assets/imgs/7_statusbars/2_statusbar_endboss/green/green20.png",
    "assets/imgs/7_statusbars/2_statusbar_endboss/green/green40.png",
    "assets/imgs/7_statusbars/2_statusbar_endboss/green/green60.png",
    "assets/imgs/7_statusbars/2_statusbar_endboss/green/green80.png",
    "assets/imgs/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];

  percentage = 100;
  images = [];

  /** @param {string} [type] - bar type: "life", "coin", "bottle", or "endboss" */
  constructor(type = "life") {
    super();
    this.images = this.getImagesForType(type);
    this.loadImages(this.images);
    this.x = type === "endboss" ? 500 : 20;
    this.y = type === "bottle" ? 0 : type === "coin" ? 45 : 85;
    this.width = 200;
    this.height = 60;
    this.setPercentage(type === "life" || type === "endboss" ? 100 : 0);
  }

  /**
   * Returns the image set matching the given bar type.
   * @param {string} type - bar type
   * @returns {string[]}
   */
  getImagesForType(type) {
    if (type === "coin") {
      return this.IMAGES_COIN;
    } else if (type === "bottle") {
      return this.IMAGES_BOTTLE;
    } else if (type === "endboss") {
      return this.IMAGES_ENDBOSS;
    }
    return this.IMAGES_LIFE;
  }

  /**
   * Sets the fill percentage and updates the displayed image.
   * @param {number} percentage - value from 0 to 100
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Converts the current percentage into an image index (0-5).
   * Reacts to the smallest loss immediately and never looks empty above 0%.
   * @returns {number}
   */
  resolveImageIndex() {
    if (this.percentage <= 0) return 0;
    if (this.percentage >= 100) return 5;
    return Math.min(4, Math.max(1, Math.floor(this.percentage / 20)));
  }
}
