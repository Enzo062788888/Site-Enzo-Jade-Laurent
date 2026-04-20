class Arrow extends Entity {
    constructor(game, x, y, angle) {
        super(game, x, y);
        this.angle = angle;
        this.speed = 7;
        this.size = 4;  
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        this.game.entities.forEach(e => {
            if (e instanceof Enemy) {
                let d = Math.hypot(e.x - this.x, e.y - this.y);
                if (d < 40) {
                    e.dead = true;
                    this.dead = true;
                    this.game.score += 10;
                }
            }
        });
    }

  draw(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const s = this.size;

    ctx.fillStyle = "lightgray"; 
    for(let i=0; i<4; i++){
      ctx.fillRect(i*s, -1, s, 2); 
    }

    ctx.fillStyle = "lightgray"; 
    ctx.beginPath();
    ctx.moveTo(4*s, 0);  
    ctx.lineTo(3*s, -2);
    ctx.lineTo(3*s, 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
