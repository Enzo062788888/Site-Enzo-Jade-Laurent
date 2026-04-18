import Vaisseau from "./vaisseau.js";
import Vagues from "./vagues.js";
import Rocher from "./rocher.js";

let backgroundImage = null;
let backgroundLoaded = false;
let introActif = true;
const introDureeMs = 8000;
let introStartTime = null;
const introLignes = [
    "2048",
    "L'humanité a disparu de la Terre.",
    "Il reste juste 2 astronautes,",
    "partis à la conquête de l'espace.",
];
// Image assets
const imgVaisseau = new Image();
imgVaisseau.src = "vaisseau.png";

const imgVaisseauShield = new Image();
imgVaisseauShield.src = "shell.png";

const imgVaisseauDeath = new Image();
imgVaisseauDeath.src = "vaisseaudeath.png";

const feu = new Image();
let feuCharge = false;
let feuSources = [
    "feu.png",
    "Feu.png",
    "feu.PNG",
    "Feu.PNG",
];
let feuIndex = 0;
setTimeout(() => {
    introActif = false;
}, introDureeMs);
const chargerFeu = () => {
    feu.src = feuSources[feuIndex];
};

feu.onload = () => {
    feuCharge = true;
};

feu.onerror = () => {
    feuIndex += 1;
    if (feuIndex < feuSources.length) {
        chargerFeu();
    } else {
        console.warn("Impossible de charger l'image du tir.");
    }
};

chargerFeu();

const imgShield = new Image();
imgShield.src = "shieldobject-removebg-preview.png";

// Game variables
let vaisseau = null;
let tirs = [];
let peutTirer = true;
const delaiTir = 300;
let shipHealth = 3; // Ship health system
let hitRocks = new Set(); // Track rocks we've already collided with
let gameOver = false;
let gameOverTime = null;

let objets = [];
let nextSpawnTime = null;
let shieldEndTime = null;
let shieldTimeoutId = null;

const motsBouclier = [
    "xefi",
    "lune",
    "aster",
    "nova",
    "plasma",
    "orion",
    "pixel",
];
let motActuel = "";
let saisieMot = "";
const dureeMotMs = 5000;
let motDeadline = null;
const maxExtensions = 3;
let extensionsRestantes = maxExtensions;
const maxMotsParBouclier = 3;
let motsRestants = maxMotsParBouclier;

function loadBackground() {
    backgroundImage = new Image();
    backgroundImage.onload = () => {
        backgroundLoaded = true;
    };
    backgroundImage.onerror = () => {
        console.warn(
            "Failed to load background image from Fond.png",
        );
        backgroundLoaded = false;
    };
    backgroundImage.src = "Fond.png";
}

class Tirer {
    constructor(x, y, ctx, canvas) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.canvas = canvas;
    }

    drawTir() {
        if (feuCharge && feu.complete && feu.naturalWidth > 0) {
            const scale = 0.25;
            const w = feu.naturalWidth * scale;
            const h = feu.naturalHeight * scale;
            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(-Math.PI / 2);
            this.ctx.drawImage(feu, -w / 2, -h / 2, w, h);
            this.ctx.restore();
        } else {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.x - 4, this.y - 10, 8, 16);
        }
    }
}

/**
 * Setup centralized event listeners for the game
 * This follows best practice of having a single event listener configuration
 */
function setupEventListeners(canvas, ctx) {
    // Prevent context menu on canvas
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());

    // Mouse movement - update ship position
    document.addEventListener("mousemove", (e) => {
        if (!vaisseau) return;
        const rect = canvas.getBoundingClientRect();

        // Account for canvas scaling (displayed size vs drawing surface)
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const sourisX = (e.clientX - rect.left) * scaleX;
        const sourisY = (e.clientY - rect.top) * scaleY;

        const minX = 0;
        const maxX = canvas.width - vaisseau.largeur;
        const minY = 0;
        const maxY = canvas.height - vaisseau.hauteur;

        vaisseau.x = Math.max(
            minX,
            Math.min(maxX, sourisX - vaisseau.largeur / 2),
        );
        vaisseau.y = Math.max(
            minY,
            Math.min(maxY, sourisY - vaisseau.hauteur / 2),
        );
    });

    // Keyboard controls
    window.addEventListener("keydown", (e) => {
        if (!vaisseau) return;

        // Shield word typing
        if (
            vaisseau.shield &&
            motActuel &&
            e.key &&
            e.key.length === 1 &&
            /[a-zA-Z]/.test(e.key)
        ) {
            saisieMot += e.key.toLowerCase();
            if (!motActuel.startsWith(saisieMot)) {
                saisieMot = "";
            } else if (saisieMot === motActuel) {
                if (extensionsRestantes > 0) {
                    extensionsRestantes -= 1;
                    rallongerBouclier(5000);
                    genererMot();
                }
            }
        }

        // Shield backspace handling
        if (vaisseau.shield && motActuel && e.key === "Backspace") {
            saisieMot = saisieMot.slice(0, -1);
        }

        // Shooting with spacebar
        if (e.key === " " || e.code === "Space") {
            e.preventDefault(); // Prevent page scroll
            if (peutTirer) {
                tirs.push(
                    new Tirer(
                        vaisseau.x + vaisseau.largeur / 2,
                        vaisseau.y + vaisseau.hauteur / 2,
                        ctx,
                        canvas,
                    ),
                );
                console.log("Tir!");
                peutTirer = false;

                setTimeout(() => {
                    peutTirer = true;
                }, delaiTir);
            }
        }
    });

    // Handle window resize
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function initSpaceGame() {
    const canvas = document.getElementById("game");
    if (!canvas) return;

    // Load images
    loadBackground();
    Rocher.loadImage();

    const ctx = canvas.getContext("2d");

    // Set canvas to full screen size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize vaisseau with image and health
    vaisseau = new Vaisseau(
        canvas.width / 2,
        canvas.height - 100,
        imgVaisseau,
        imgVaisseauShield,
        imgVaisseauDeath,
    );
    vaisseau.isDead = false;
    shipHealth = 3;
    hitRocks.clear();

    const waves = new Vagues(null, canvas);
    waves.startWave();

    // Setup all event listeners (centralized)
    setupEventListeners(canvas, ctx);

    // Shield spawn scheduling
    function planifierApparition() {
        const delai = 30000 + Math.random() * 30000; // 30s to 60s
        nextSpawnTime = Date.now() + delai;
        setTimeout(() => {
            creerObjet(canvas);
            planifierApparition();
        }, delai);
    }

    setTimeout(() => creerObjet(canvas), 1000);
    planifierApparition();

    // Timers display
    setInterval(() => {
        if (nextSpawnTime) {
            const restant = Math.max(
                0,
                Math.ceil((nextSpawnTime - Date.now()) / 1000),
            );
            console.log(`Prochain objet dans ${restant}s`);
        }
        if (shieldEndTime) {
            const restantShield = Math.max(
                0,
                Math.ceil((shieldEndTime - Date.now()) / 1000),
            );
            console.log(`Bouclier: ${restantShield}s restantes`);
        }
    }, 1000);

    // ===== Loop =====
    function loop() {
        if (introActif) {
            if (!introStartTime) {
                introStartTime = Date.now();
            }

            const elapsedMs = Date.now() - introStartTime;
            const progress = Math.min(1, elapsedMs / 3000); // 3 seconds for intro animation

            if (backgroundLoaded && backgroundImage) {
                ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            // Draw black overlay that fades out
            const overlayOpacity = Math.max(0, 1 - progress * 0.8); // Fade out slower
            ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw falling text lines
            ctx.fillStyle = "white";
            ctx.font = "24px Arial";
            ctx.textAlign = "center";
            
            const startY = canvas.height / 2 - 40;
            const lineHeight = 30;
            const gravity = 800; // pixels per second squared
            
            for (let i = 0; i < introLignes.length; i++) {
                const text = introLignes[i];
                
                // Stagger each line's start time
                const lineDelayMs = i * 200;
                const lineElapsedMs = Math.max(0, elapsedMs - lineDelayMs);
                const lineProgress = Math.min(1, lineElapsedMs / 800); // Each line falls over 800ms
                
                // Calculate falling position (simple gravity effect)
                const fallDistance = (gravity * (lineProgress ** 2)) / 2;
                const y = startY + i * lineHeight - 400 + fallDistance;
                
                // Only draw line if it's visible on screen
                if (y < canvas.height) {
                    // Add opacity fade in
                    const opacity = Math.min(1, lineProgress * 2);
                    ctx.globalAlpha = opacity;
                    ctx.fillText(text, canvas.width / 2, y);
                    ctx.globalAlpha = 1;
                }
            }

            // Draw vaisseau entering from bottom
            const vaisseauDelayMs = 1000;
            const vaisseauElapsedMs = Math.max(0, elapsedMs - vaisseauDelayMs);
            const vaisseauProgress = Math.min(1, vaisseauElapsedMs / 4500); // 4.5 seconds to come up and exit
            
            const vaisseauStartY = canvas.height + 50;
            const vaisseauEndY = -150; // Exit the screen at the top
            const vaisseauY = vaisseauStartY - (vaisseauStartY - vaisseauEndY) * vaisseauProgress;
            
            // Draw vaisseau at calculated position
            if (vaisseauProgress > 0 && imgVaisseau.complete && imgVaisseau.naturalWidth > 0) {
                const scale = 0.25; // Smaller ship
                const w = imgVaisseau.naturalWidth * scale;
                const h = imgVaisseau.naturalHeight * scale;
                const vaisseauX = (canvas.width - w) / 2 - 80; // Center and shift left
                ctx.drawImage(imgVaisseau, vaisseauX, vaisseauY, w, h);
            }

            requestAnimationFrame(loop);
            return;
        }
        // Handle game over state
        if (gameOver && gameOverTime) {
            const timeSinceGameOver = Date.now() - gameOverTime;
            const remainingTime = Math.max(0, 5000 - timeSinceGameOver);

            if (backgroundLoaded && backgroundImage) {
                ctx.drawImage(
                    backgroundImage,
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                );
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            // Draw game over message
            ctx.font = "bold 60px Arial";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);

            ctx.font = "bold 40px Arial";
            ctx.fillStyle = "white";
            const secondsLeft = Math.ceil(remainingTime / 1000);
            ctx.fillText(
                `Restarting in ${secondsLeft}s...`,
                canvas.width / 2,
                canvas.height / 2 + 40,
            );
            ctx.textAlign = "left";

            if (remainingTime <= 0) {
                // Restart the game
                gameOver = false;
                gameOverTime = null;
                shipHealth = 3;
                hitRocks.clear();
                tirs = [];
                objets = [];
                motActuel = "";
                saisieMot = "";
                motDeadline = null;
                extensionsRestantes = maxExtensions;
                motsRestants = maxMotsParBouclier;
                vaisseau.shieldedFromRocks = false;
                vaisseau.shield = false;
                vaisseau.isDead = false;

                // Clear shield timeout
                if (shieldTimeoutId) {
                    clearTimeout(shieldTimeoutId);
                    shieldTimeoutId = null;
                }
                shieldEndTime = null;

                // Restart waves
                waves.wave = 1;
                waves.rocks = [];
                waves.spawnCounter = 0;
                waves.nbLeftToKill = 0;
                waves.startWave();
            }

            requestAnimationFrame(loop);
            return;
        }

        if (backgroundLoaded && backgroundImage) {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Check if shield has expired FIRST (before drawing ship)
        if (vaisseau && shieldEndTime && Date.now() >= shieldEndTime) {
            console.log("Shield expiration check in game loop - clearing now");
            vaisseau.shield = false;
            vaisseau.shieldedFromRocks = false;
            motActuel = "";
            saisieMot = "";
            motDeadline = null;
            shieldEndTime = null;
            if (shieldTimeoutId) {
                clearTimeout(shieldTimeoutId);
                shieldTimeoutId = null;
            }
        }

        if (vaisseau) {
            vaisseau.draw(ctx);
        }

        // Update and draw shots
        for (let i = tirs.length - 1; i >= 0; i--) {
            tirs[i].y -= 5;
            tirs[i].drawTir();
            if (tirs[i].y < 0) {
                tirs.splice(i, 1);
            }
        }

        // Check collisions between projectiles and rocks
        for (let i = tirs.length - 1; i >= 0; i--) {
            for (let j = waves.rocks.length - 1; j >= 0; j--) {
                if (collisionProjectileRock(tirs[i], waves.rocks[j])) {
                    // Remove projectile
                    tirs.splice(i, 1);
                    // Remove rock
                    waves.rocks.splice(j, 1);
                    // Decrease kill counter
                    waves.nbLeftToKill = Math.max(0, waves.nbLeftToKill - 1);
                    console.log(
                        `Rock destroyed by projectile! ${waves.nbLeftToKill} left to kill`,
                    );
                    break; // Exit inner loop since we removed the projectile
                }
            }
        }

        // Update and draw shield objects
        for (let i = objets.length - 1; i >= 0; i--) {
            objets[i].y += objets[i].vy;
            if (imgShield.complete && imgShield.naturalWidth > 0) {
                ctx.drawImage(
                    imgShield,
                    objets[i].x,
                    objets[i].y,
                    objets[i].w,
                    objets[i].h,
                );
            } else {
                ctx.fillStyle = "green";
                ctx.fillRect(
                    objets[i].x,
                    objets[i].y,
                    objets[i].w,
                    objets[i].h,
                );
            }

            if (vaisseau && collisionObjetVaisseau(objets[i], vaisseau)) {
                // Shield item gives protection for 1 rock collision AND starts word game
                vaisseau.shieldedFromRocks = true;
                vaisseau.shield = true;
                activerBouclier(10000, true);
                objets.splice(i, 1);
                continue;
            }

            if (objets[i].y > canvas.height) {
                objets.splice(i, 1);
            }
        }

        // Update waves and rocks
        waves.update();

        // Check collisions between rocks and ship
        for (let i = waves.rocks.length - 1; i >= 0; i--) {
            const rock = waves.rocks[i];
            const rockId = `${rock.x}_${rock.y}_${rock.radius}`;

            if (collisionRockShip(rock, vaisseau) && !hitRocks.has(rockId)) {
                if (vaisseau.shieldedFromRocks) {
                    // Shield absorbs 1 collision - end both shields after use
                    vaisseau.shieldedFromRocks = false;
                    vaisseau.shield = false;
                    console.log("Rock blocked by shield!");

                    // Clear the shield timeout
                    if (shieldTimeoutId) {
                        clearTimeout(shieldTimeoutId);
                        shieldTimeoutId = null;
                    }
                    shieldEndTime = null;
                    motActuel = "";
                    saisieMot = "";
                    motDeadline = null;
                } else if (!vaisseau.shield) {
                    // Only take damage if no word-game shield and no rock shield
                    shipHealth--;
                    console.log(`Rock collision! Health: ${shipHealth}`);

                    if (shipHealth <= 0) {
                        console.log("Game Over!");
                        shipHealth = 0;
                        gameOver = true;
                        gameOverTime = Date.now();
                        if (vaisseau) {
                            vaisseau.isDead = true;
                        }
                    }
                }

                hitRocks.add(rockId);
                // Decrement nbLeftToKill since we're destroying a rock
                waves.nbLeftToKill = Math.max(0, waves.nbLeftToKill - 1);
                // Remove rock after collision
                waves.rocks.splice(i, 1);
            }
        }

        // Clean up old rock IDs to prevent memory leak
        if (hitRocks.size > waves.rocks.length + 100) {
            hitRocks.clear();
        }

        // Check if wave should transition to next wave
        if (waves.nbLeftToKill <= 0 && waves.rocks.length === 0) {
            waves.nextWave();
        }

        waves.draw(ctx, canvas);

        // Draw shield UI and word game
        if (vaisseau && vaisseau.shield) {
            // Check if shield has expired
            if (shieldEndTime && Date.now() > shieldEndTime) {
                vaisseau.shield = false;
                motActuel = "";
                saisieMot = "";
                motDeadline = null;
                shieldEndTime = null;
            } else if (motActuel && shieldEndTime) {
                if (motDeadline && Date.now() > motDeadline) {
                    genererMot();
                }
                const restantMs = Math.max(0, (motDeadline ?? 0) - Date.now());
                const restantS = Math.ceil(restantMs / 1000);

                ctx.font = "20px Arial";
                ctx.fillStyle = "white";
                const baseY = canvas.height - 30;
                const fullMot = `Mot: ${motActuel}`;
                const fullMotWidth = ctx.measureText(fullMot).width;
                const centerX = (canvas.width - fullMotWidth) / 2;
                ctx.fillText("Mot:", centerX, baseY);

                const prefix = saisieMot;
                const suffix = motActuel.slice(saisieMot.length);
                const xMot = centerX + ctx.measureText("Mot: ").width;
                const yMot = baseY;

                ctx.fillStyle = "#5CFF5C";
                ctx.fillText(prefix, xMot, yMot);
                const prefixWidth = ctx.measureText(prefix).width;
                ctx.fillStyle = "white";
                ctx.fillText(suffix, xMot + prefixWidth, yMot);

                ctx.fillStyle = "#00E5FF";
                const shieldRestantMs = Math.max(0, shieldEndTime - Date.now());
                const shieldRestantS = Math.ceil(shieldRestantMs / 1000);
                const infoText = `Temps Shield: ${shieldRestantS}s  |  Bonus: ${extensionsRestantes}  |  Mots: ${motsRestants}`;
                const infoWidth = ctx.measureText(infoText).width;
                ctx.fillText(
                    infoText,
                    (canvas.width - infoWidth) / 2,
                    baseY + 24,
                );
            }
        }

        // Update wave display and health (if elements exist)
        const waveElement = document.getElementById("currentWave");
        if (waveElement) waveElement.textContent = waves.wave;
        const killElement = document.getElementById("nbLeftToKill");
        if (killElement) killElement.textContent = waves.nbLeftToKill;

        // Draw health/lives with hearts
        ctx.font = "24px Arial";
        ctx.fillStyle = shipHealth > 1 ? "#FF1493" : "#FF0000";
        const healthDisplay = "♥".repeat(Math.max(0, shipHealth));
        ctx.fillText(healthDisplay, 20, 40);

        // Draw wave and remaining objectives
        ctx.font = "20px Arial";
        ctx.fillStyle = "#FFFF00";
        ctx.fillText(`Wave: ${waves.wave}`, 20, 70);
        ctx.fillText(`Remaining: ${waves.nbLeftToKill}`, 20, 95);

        // Draw rock shield indicator
        if (vaisseau && vaisseau.shieldedFromRocks) {
            ctx.font = "20px Arial";
            ctx.fillStyle = "#FFD700";
            ctx.fillText("🛡 Shield Active (1 hit)", 20, 120);
        }

        requestAnimationFrame(loop);
    }

    loop();

    // Handle window resize
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function creerObjet(canvas) {
    if (objets.length > 0) return;
    const x = Math.random() * (canvas.width - 50);
    const y = -50;
    objets.push({ x, y, w: 50, h: 50, vy: 2 });
}

function collisionRockShip(rock, ship) {
    // Circle (rock) vs Rectangle (ship) collision
    // Reduce ship hitbox to 60% of actual size
    const shipScale = 0.6;
    const scaledWidth = ship.largeur * shipScale;
    const scaledHeight = ship.hauteur * shipScale;
    const shipCenterX = ship.x + ship.largeur / 2;
    const shipCenterY = ship.y + ship.hauteur / 2;
    
    // Find closest point on scaled rectangle to circle center
    const closestX = Math.max(shipCenterX - scaledWidth / 2, Math.min(rock.x, shipCenterX + scaledWidth / 2));
    const closestY = Math.max(shipCenterY - scaledHeight / 2, Math.min(rock.y, shipCenterY + scaledHeight / 2));

    // Calculate distance between closest point and circle center
    const distX = rock.x - closestX;
    const distY = rock.y - closestY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // Enlarged rock hitbox to 0.7 radius
    return distance < rock.radius * 0.7;
}

function collisionProjectileRock(projectile, rock) {
    // Projectile is a point at (x, y), rock is a circle
    // Check if point is within enlarged circle radius
    const dx = projectile.x - rock.x;
    const dy = projectile.y - rock.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < rock.radius * 0.7;
}

function collisionObjetVaisseau(objet, vaisseau) {
    return (
        objet.x < vaisseau.x + vaisseau.largeur &&
        objet.x + objet.w > vaisseau.x &&
        objet.y < vaisseau.y + vaisseau.hauteur &&
        objet.y + objet.h > vaisseau.y
    );
}

function activerBouclier(dureeMs, resetMots = false) {
    console.log(
        `Activating shield for ${dureeMs}ms`,
        resetMots ? "(reset words)" : "(extend)",
    );
    vaisseau.shield = true;
    if (shieldTimeoutId) {
        clearTimeout(shieldTimeoutId);
    }
    if (resetMots) {
        extensionsRestantes = maxExtensions;
        motsRestants = maxMotsParBouclier;
        genererMot();
    }
    shieldEndTime = Date.now() + dureeMs;
    shieldTimeoutId = setTimeout(() => {
        console.log("Shield timeout fired! Clearing shield now.");
        if (vaisseau) {
            vaisseau.shield = false;
            vaisseau.shieldedFromRocks = false;
            console.log(`Confirmed: vaisseau.shield is now ${vaisseau.shield}`);
        }
        shieldEndTime = null;
        shieldTimeoutId = null;
        motActuel = "";
        saisieMot = "";
        motDeadline = null;
        motsRestants = maxMotsParBouclier;
    }, dureeMs);
}

function rallongerBouclier(dureeMs) {
    if (!shieldEndTime) return;
    const restant = Math.max(0, shieldEndTime - Date.now());
    activerBouclier(restant + dureeMs, false);
}

function genererMot() {
    if (motsRestants <= 0) {
        motActuel = "";
        saisieMot = "";
        motDeadline = null;
        return;
    }
    motsRestants -= 1;
    motActuel = motsBouclier[Math.floor(Math.random() * motsBouclier.length)];
    saisieMot = "";
    motDeadline = Date.now() + dureeMotMs;
}


// Vérifier régulièrement si le canvas existe
let spaceGameCheckInterval = setInterval(() => {
    if (document.getElementById("game")) {
        clearInterval(spaceGameCheckInterval);
        const canvas = document.getElementById("game");
        initSpaceGame();
    }
}, 100);
