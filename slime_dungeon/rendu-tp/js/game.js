class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;

        this.state = "MENU";
        this.lastTime = 0;

        this.player = new Player(this, 450, 300);
        this.entities = [];

        this.input = new Input(this);

        this.score = 0;
        this.lives = 3; 

        this.level = 1;
        this.maxLevel = 3;
        this.levelTimes = [30000, 45000, 60000];
        this.levelTimer = this.levelTimes[0];

        this.highScore = parseInt(localStorage.getItem('slimeHighScore') || '0', 10);
        this._scoreSaved = false;
    }

    start() {
        requestAnimationFrame(t => this.loop(t));
    }

    loop(t) {
        let delta = t - this.lastTime;
        this.lastTime = t;

        this.update(delta);
        this.draw();

        requestAnimationFrame(t => this.loop(t));
    }

    update(delta) {
        if (this.state === "PLAY") {
            this.player.update(delta);

            this.entities.forEach(e => e.update(delta));
            this.entities = this.entities.filter(e => !e.dead);

            this.levelTimer -= delta;
            if (this.levelTimer > 0) {
                this.spawnEnemies();
            }

            if (this.levelTimer <= 0) {
                if (this.level < this.maxLevel) {
                    this.level++;
                    this.levelTimer = this.levelTimes[this.level - 1];
                    this.entities = [];
                    this._scoreSaved = false;
                    this.state = "PLAY";
                } else {
                    this.endGame("VICTORY");
                }
            }
        }
    }

    endGame(state) {
        if (!this._scoreSaved && (state === "GAMEOVER" || state === "VICTORY")) {
            const previousHigh = this.highScore || 0;
            this._isNewHigh = false;
            if (this.score > previousHigh) {
                this.highScore = this.score;
                this._isNewHigh = true;
                try { localStorage.setItem('slimeHighScore', String(this.highScore)); } catch (e) {}
            }
            this._scoreSaved = true;
        }
        this.state = state;
    }

    spawnEnemies() {
        if (Math.random() < 0.02 + (this.level - 1) * 0.01) {
            const side = Math.floor(Math.random() * 4);

            let x, y;

            switch (side) {
                case 0: x = 0; y = this.canvas.height / 2; break;
                case 1: x = this.canvas.width; y = this.canvas.height / 2; break;
                case 2: x = this.canvas.width / 2; y = 0; break;
                case 3: x = this.canvas.width / 2; y = this.canvas.height; break;
            }

            const enemy = new Enemy(this, x, y);
            enemy.speed += 0.5 * (this.level - 1);
            this.entities.push(enemy);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, 900, 600);

        if (this.state === "MENU") {
            this.drawMenu();
            return;
        }

        if (this.state === "GAMEOVER") {
            this.drawGameOver();
            return;
        }

        if (this.state === "VICTORY") {
            this.drawVictory();
            return;
        }

        this.player.draw(this.ctx);
        this.entities.forEach(e => e.draw(this.ctx));

        this.drawHUD();
    }

    drawMenu() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "40px Pixelify Sans";
        this.ctx.lineWidth = 7;
        this.ctx.strokeStyle = "black";
        this.ctx.strokeText("Slime Dungeon", 230, 200);

        this.ctx.fillStyle = "white";
        this.ctx.fillText("Slime Dungeon", 230, 200);

        this.ctx.font = "20px Pixelify Sans";
        this.ctx.fillText("Appuyez sur Entrée pour commencer", 190, 250);
        this.ctx.fillStyle = "black";
    }

    drawGameOver() {
        this.ctx.fillStyle = "red";
        this.ctx.font = "50px Pixelify Sans";
        this.ctx.fillText("GAME OVER", 230, 200);
        this.ctx.font = "20px Pixelify Sans";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Score: " + this.score, 230, 250);
        this.ctx.fillText("Highscore: " + this.highScore, 230, 280);
        if (this._isNewHigh) {
            this.ctx.fillStyle = "yellow";
            this.ctx.fillText("Nouveau high score !", 230, 310);
            this.ctx.fillStyle = "white";
        }
        this.ctx.fillText("Appuyez sur Entrée pour recommencer", 190, 350);
    }

    drawVictory() {
        this.ctx.fillStyle = "#00b300";
        this.ctx.font = "50px Pixelify Sans";
        this.ctx.fillText("VICTOIRE !", 260, 200);
        this.ctx.font = "20px Pixelify Sans";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Score: " + this.score, 260, 250);
        this.ctx.fillText("Highscore: " + this.highScore, 260, 280);
        if (this._isNewHigh) {
            this.ctx.fillStyle = "yellow";
            this.ctx.fillText("Nouveau high score !", 260, 310);
            this.ctx.fillStyle = "white";
        }
        this.ctx.fillText("Appuyez sur Entrée pour revenir au menu", 140, 350);
    }

    drawHUD() {
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`Vies: ${this.lives}`, 10, 20);
        this.ctx.fillText("Score: " + this.score, 10, 40);
        this.ctx.fillText("Level: " + this.level, 10, 60);
        this.ctx.fillText("High: " + this.highScore, 10, 80);

        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(100, 5, 700, 20);
        this.ctx.fillStyle = "green";
        let w = 700 * (this.levelTimer / this.levelTimes[this.level - 1]);
        this.ctx.fillRect(100, 5, w, 20);
    }
}
