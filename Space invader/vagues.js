import Rocher from "./rocher.js";

export default class Vagues{
    constructor(player, canvas){
        this.wave = 1;
        this.rocks = [];
        this.player = player;
        this.canvas = canvas;
        this.spawnCounter = 0;
        this.maxRocks = 0;
        this.nbLeftToKill = 0;
        this.spawnRate = 60; // Spawn a new rock every 60 frames
    }

    startWave(){
        this.nbLeftToKill = 10 * this.wave; // Increase kill count each wave
        this.maxRocks = Math.max(15, this.nbLeftToKill + 5); // Ensure enough rocks can spawn
    }

    nextWave(){
        this.wave++;
        this.spawnRate = Math.max(10, this.spawnRate * 0.8); // Decrease spawn rate by 20% each wave (min 10)
        this.spawnCounter = 0;
        this.rocks = []; // Clear all remaining rocks
        this.startWave(); // Immediately start the next wave
    }

    update() {
        // Update all rocks
        this.rocks.forEach(r => r.update());
        
        // Remove rocks that are out of bounds (but don't count as killed)
        this.rocks = this.rocks.filter(r => !r.isOutOfBounds());
        
        // Spawn new rocks gradually, respecting max limit and kill requirement
        this.spawnCounter++;
        if (this.spawnCounter > this.spawnRate && this.rocks.length < this.maxRocks && this.nbLeftToKill > 0) {
            this.rocks.push(new Rocher(this.canvas.width, this.canvas.height));
            this.spawnCounter = 0;
        }
        
        // Check if wave is complete (when we've killed enough rocks)
        if (this.nbLeftToKill <= 0 && this.rocks.length === 0) {
            this.nextWave();
        }
    }

    draw(ctx, canvas) {
        this.rocks.forEach(r => r.draw(ctx));
    }
}