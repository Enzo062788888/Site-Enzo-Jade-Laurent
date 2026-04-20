class Entity {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.dead = false;
    }

    update(delta) { }
    draw(ctx) { }
}
