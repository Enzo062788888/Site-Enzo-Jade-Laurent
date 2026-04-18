export default class Rocher{
    static rockImage = null;
    static imageLoaded = false;

    static loadImage() {
        if (!Rocher.rockImage) {
            Rocher.rockImage = new Image();
            Rocher.rockImage.onload = () => {
                Rocher.imageLoaded = true;
            };
            Rocher.rockImage.onerror = () => {
                console.warn("Failed to load rock image from rocher.png");
                Rocher.imageLoaded = false;
            };
            Rocher.rockImage.src = "rocher.png";
        }
    }

    constructor(canvasWidth, canvasHeight){
        this.radius = 15 + Math.random() * 20;
        
        // Spawn at the top of the canvas with random X position, staying within bounds
        this.x = this.radius + Math.random() * (canvasWidth - this.radius * 6);
        this.y = -20;

        this.speed = 1 + Math.random() * 2;
        
        this.canvasHeight = canvasHeight;
    };

    update() {
        // Fall downward
        this.y += this.speed;
    }

    isOutOfBounds() {
        return this.y - this.radius > this.canvasHeight;
    }

    draw(ctx){
        ctx.save();
        
        // Translate to rock center
        ctx.translate(this.x, this.y);
        
        // Draw image centered at origin
        if (Rocher.imageLoaded && Rocher.rockImage) {
            const w = this.radius * 2;
            const h = this.radius * 2;
            ctx.drawImage(Rocher.rockImage, -this.radius, -this.radius, w, h);
        } else {
            // Fallback: draw gray circle if image not loaded
            ctx.fillStyle = 'gray';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

}