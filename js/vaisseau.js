export default class Vaisseau {
    constructor(x, y, image, shieldImage, deathImage) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.shieldImage = shieldImage;
        this.deathImage = deathImage;
        this.shield = false; // Word-game shield (timer-based)
        this.shieldedFromRocks = false; // Rock collision protection (1 hit)
        this.isDead = false; // Death state
        this.largeur = 100;
        this.hauteur = 100;
    }

    draw(ctx) {
        // Determine which image to use
        let imgToUse = this.image;
        if (this.isDead && this.deathImage && this.deathImage.complete && this.deathImage.naturalWidth > 0) {
            imgToUse = this.deathImage;
        } else if ((this.shield || this.shieldedFromRocks) && this.shieldImage && this.shieldImage.complete && this.shieldImage.naturalWidth > 0) {
            imgToUse = this.shieldImage;
        }

        // Image exists and is loaded
        if (!imgToUse.complete || imgToUse.naturalWidth === 0) {
            // Fallback: draw a simple rectangle
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x, this.y, this.largeur, this.hauteur);
            return;
        }

        // Use ctx.save/restore and translate/rotate for proper positioning
        ctx.save();
        
        // Translate to ship center
        const centerX = this.x + this.largeur / 2;
        const centerY = this.y + this.hauteur / 2;
        ctx.translate(centerX, centerY);
        
        // Draw image centered at origin (0,0)
        const baseScale = Math.min(
            this.hauteur / imgToUse.naturalHeight,
            this.largeur / imgToUse.naturalWidth
        );
        const w = imgToUse.naturalWidth * baseScale;
        const h = imgToUse.naturalHeight * baseScale;
        
        ctx.drawImage(imgToUse, -w / 2, -h / 2, w, h);
        
        ctx.restore();
    }
}