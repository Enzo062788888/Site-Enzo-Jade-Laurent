class Player extends Entity {
    constructor(game, x, y) {
        super(game, x, y);
        this.speed = 3;
        this.angle = 0;
        this.dirX = 1;
        this.dirY = 0;
    }

    update() {
        let k = this.game.input.keys;

        let moveX = 0;
        let moveY = 0;

        if (k["z"] || k["arrowup"]) moveY -= 1;
        if (k["s"] || k["arrowdown"]) moveY += 1;
        if (k["q"] || k["arrowleft"]) moveX -= 1;
        if (k["d"] || k["arrowright"]) moveX += 1;

        if (moveX !== 0 || moveY !== 0) {
            let length = Math.hypot(moveX, moveY);
            moveX /= length;
            moveY /= length;

            this.x += moveX * this.speed;
            this.y += moveY * this.speed;

            this.dirX = moveX;
            this.dirY = moveY;

            // Coldown pour éviter de spammer les flèches à corriger
            this.shootCooldown = 0; 
            this.shootDelay = 300;
        }

        // Pour que le personnage reste dans les limites du canvas
        const margin = 12;
        this.x = Math.max(margin, Math.min(this.x, this.game.canvas.width - margin));
        this.y = Math.max(margin, Math.min(this.y, this.game.canvas.height - margin));


        this.angle = Math.atan2(this.dirY, this.dirX);
    }

    shoot() {
        this.game.entities.push(
            new Arrow(this.game, this.x, this.y, this.angle)
        );
    }

    // Design du personnage avec L'IA
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(0, -6, 12, Math.PI, 2*Math.PI); 
        ctx.fill();

        ctx.fillStyle = "#FFDAB9"; 
        ctx.beginPath();
        ctx.moveTo(-12, -2);
        ctx.lineTo(-20, -10);
        ctx.lineTo(-12, 4);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(12, -2);
        ctx.lineTo(20, -10); 
        ctx.lineTo(12, 4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#FFDAB9";
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(-4, -2, 3, 0, Math.PI*2); 
        ctx.arc(4, -2, 3, 0, Math.PI*2);  
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(-4, -2, 1.5, 0, Math.PI*2); 
        ctx.arc(4, -2, 1.5, 0, Math.PI*2);  
        ctx.fill();

        ctx.strokeStyle = "#8B4513";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 2, 18, Math.PI*0.2, Math.PI*1.8, true);
        ctx.stroke();

        ctx.restore();
    }
}
