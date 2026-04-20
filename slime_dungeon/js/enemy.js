class Enemy extends Entity {
  constructor(game, x, y){
    super(game, x, y);
    this.size = 40;      
    this.speed = 1;
    this.bounce = 0;     
    this.bounceDir = 1;
  }

  update(delta){
    let p = this.game.player;
    let dx = p.x - this.x;
    let dy = p.y - this.y;
    let dist = Math.hypot(dx, dy);

    this.x += dx/dist * this.speed * (delta / 16.67);
    this.y += dy/dist * this.speed * (delta / 16.67);

    let collisionRadius = this.size / 2 + 10; 
    if(dist < collisionRadius){
      this.dead = true;
      this.game.lives--;
      if(this.game.lives <= 0) this.game.endGame("GAMEOVER");
    }

    this.bounce += this.bounceDir * 0.1;
    if(this.bounce > 3 || this.bounce < -3) this.bounceDir *= -1;
  }

  draw(ctx){
    ctx.save();
    ctx.translate(this.x, this.y + this.bounce);

    ctx.fillStyle = "lime";
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size/2, this.size/2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(-10, -5, 5, 0, Math.PI*2);
    ctx.arc(10, -5, 5, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(-10, -5, 2, 0, Math.PI*2);
    ctx.arc(10, -5, 2, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
}
