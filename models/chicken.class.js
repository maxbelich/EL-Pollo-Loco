class Chicken extends MovableObject {

    constructor() {
        super();
        this.loadImage("assets/imgs/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.width = 50;
        this.height = 50;
        this.x = 450 + Math.random() * 500;
        this.y = 350;
        
    }
}
