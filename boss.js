// ENGINE DEL JEFE OMEGA FLOWEY (CANVAS RENDERER)
class BossEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.player = { x: 375, y: 440, size: 12, speed: 6 };
        this.boss = {
            x: 375, y: 160,
            hp: 800, maxHp: 800,
            displayHp: 0,
            faceMode: 'SMILE',
            laserCharging: false,
            laserTimer: 0,
            laserX: 375
        };

        this.playerBullets = [];
        this.bossBullets = [];
        this.particles = [];
        this.cyberVines = [];
        this.keys = {};
        this.frameCount = 0;
        this.gameState = 'INTRO'; // 'INTRO', 'FIGHT', 'VICTORY'
        this.introFrame = 0;
        this.animId = null;

        this.initVines();
        this.bindEvents();
    }

    initVines() {
        for (let i = 0; i < 8; i++) {
            this.cyberVines.push({
                side: i % 2 === 0 ? 'LEFT' : 'RIGHT',
                y: 50 + i * 48,
                length: 0,
                maxLength: 190 + Math.random() * 70
            });
        }
    }

    bindEvents() {
        window.addEventListener("keydown", e => this.keys[e.code] = true);
        window.addEventListener("keyup", e => this.keys[e.code] = false);

        this.canvas.addEventListener("mousemove", e => {
            const rect = this.canvas.getBoundingClientRect();
            this.player.x = e.clientX - rect.left;
            this.player.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener("mousedown", () => this.firePlayerBullet());
        this.canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.player.x = e.touches[0].clientX - rect.left;
            this.player.y = e.touches[0].clientY - rect.top;
            this.firePlayerBullet();
        });
    }

    firePlayerBullet() {
        if (this.gameState !== 'FIGHT') return;
        this.playerBullets.push({ x: this.player.x, y: this.player.y - 12 });
        sounds.play('shoot');
    }

    start() {
        this.loop();
    }

    loop() {
        this.frameCount++;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameState === 'INTRO') {
            this.renderIntro();
        } else if (this.gameState === 'FIGHT') {
            this.updateFight();
        }

        if (this.gameState !== 'VICTORY') {
            this.animId = requestAnimationFrame(() => this.loop());
        }
    }

    renderIntro() {
        this.introFrame++;

        // 1. Vianas cibernéticas creciendo
        this.cyberVines.forEach(v => {
            if (v.length < v.maxLength) v.length += 4;
            this.drawVine(v);
        });

        // 2. Monitor CRT descandiendo
        let monitorY = Math.min(150, -100 + this.introFrame * 3);
        this.drawCRTMonitor(375, monitorY);

        // 3. Encendido y Risa
        if (this.introFrame === 70) {
            sounds.play('laugh');
            document.body.classList.add("shake");
            document.getElementById("dialogueText").innerText = "¡JA JA JA! ¿CREÍSTE QUE ESTO ERA UN SIMPLE TEST?";
        }

        if (this.introFrame > 70) {
            this.drawFace(375, monitorY, 'GLITCH');
        }

        if (this.introFrame === 120) {
            document.body.classList.remove("shake");
            document.getElementById("dialogueText").innerText = "* ¡EL OMEGA-VIRUS BLOQUEA TU CAMINO!";
        }

        if (this.introFrame > 120) {
            this.drawFace(375, monitorY, 'SMILE');
            if (this.boss.displayHp < this.boss.maxHp) {
                this.boss.displayHp += 16;
                sounds.play('hit');
                this.updateHealthUI(this.boss.displayHp);
            }
        }

        if (this.introFrame > 190) {
            this.gameState = 'FIGHT';
            this.boss.displayHp = this.boss.maxHp;
            this.updateHealthUI(this.boss.maxHp);
            document.getElementById("dialogueText").innerText = "* [FLECHAS / MOUSE] para mover tu Alma. ¡DISPARA CON CLICK / ESPACIO!";
        }
    }

    updateFight() {
        // Movimiento por Teclado
        if (this.keys["ArrowLeft"] || this.keys["KeyA"]) this.player.x -= this.player.speed;
        if (this.keys["ArrowRight"] || this.keys["KeyD"]) this.player.x += this.player.speed;
        if (this.keys["ArrowUp"] || this.keys["KeyW"]) this.player.y -= this.player.speed;
        if (this.keys["ArrowDown"] || this.keys["KeyS"]) this.player.y += this.player.speed;
        if (this.keys["Space"] && this.frameCount % 5 === 0) this.firePlayerBullet();

        // Límites
        this.player.x = Math.max(20, Math.min(this.canvas.width - 20, this.player.x));
        this.player.y = Math.max(250, Math.min(this.canvas.height - 20, this.player.y));

        // Dibujar elementos
        this.cyberVines.forEach(v => this.drawVine(v));

        // Cara Cambiante
        this.boss.faceMode = (this.frameCount % 120 < 22) ? 'SCREAM' : (this.frameCount % 60 < 10 ? 'GLITCH' : 'SMILE');
        this.drawCRTMonitor(375, 150);
        this.drawFace(375, 150, this.boss.faceMode);

        // ATAQUE 1: RAYO LÁSER CON ADVERTENCIA
        if (this.frameCount % 180 === 0) {
            this.boss.laserCharging = true;
            this.boss.laserTimer = 0;
            this.boss.laserX = this.player.x;
        }

        if (this.boss.laserCharging) {
            this.boss.laserTimer++;
            // Guía de advertencia
            this.ctx.strokeStyle = "rgba(255, 0, 85, 0.4)";
            this.ctx.lineWidth = 35;
            this.ctx.beginPath();
            this.ctx.moveTo(this.boss.laserX, 180);
            this.ctx.lineTo(this.boss.laserX, this.canvas.height);
            this.ctx.stroke();

            if (this.boss.laserTimer > 38) {
                sounds.play('laser');
                this.ctx.fillStyle = "#ffffff";
                this.ctx.fillRect(this.boss.laserX - 35, 180, 70, this.canvas.height);
                this.ctx.fillStyle = "#00f0ff";
                this.ctx.fillRect(this.boss.laserX - 20, 180, 40, this.canvas.height);
                
                document.body.classList.add("shake");
                setTimeout(() => document.body.classList.remove("shake"), 200);

                this.boss.laserCharging = false;
            }
        }

        // ATAQUE 2: PROYECTILES ESPIRAL
        if (this.frameCount % 28 === 0) {
            let angle = (this.frameCount * 0.12);
            this.bossBullets.push({ x: 375, y: 180, vx: Math.cos(angle) * 4.2, vy: Math.sin(angle) * 4.2 });
            this.bossBullets.push({ x: 375, y: 180, vx: -Math.cos(angle) * 4.2, vy: -Math.sin(angle) * 4.2 });
        }

        // Actualizar Proyectiles Jefe
        this.ctx.fillStyle = "#ff0055";
        this.bossBullets.forEach((b, i) => {
            b.x += b.vx;
            b.y += b.vy;
            this.ctx.beginPath();
            this.ctx.arc(b.x, b.y, 7, 0, Math.PI * 2);
            this.ctx.fill();

            if (b.y > this.canvas.height || b.x < 0 || b.x > this.canvas.width) {
                this.bossBullets.splice(i, 1);
            }
        });

        // Actualizar Disparos Jugador
        this.ctx.fillStyle = "#00ff66";
        this.playerBullets.forEach((pb, i) => {
            pb.y -= 9;
            this.ctx.fillRect(pb.x - 3, pb.y, 6, 14);

            // Colisión con Jefe
            if (Math.hypot(pb.x - 375, pb.y - 150) < 95) {
                this.boss.hp -= 11;
                sounds.play('hit');
                this.createDebris(pb.x, pb.y);
                this.updateHealthUI(this.boss.hp);
                this.playerBullets.splice(i, 1);
            }
        });

        // Partículas
        this.updateParticles();

        // Alma del Jugador
        this.drawSoul(this.player.x, this.player.y);

        // VICTORIA
        if (this.boss.hp <= 0) {
            this.gameState = 'VICTORY';
            onBossDefeated();
        }
    }

    createDebris(x, y) {
        for (let i = 0; i < 4; i++) {
            this.particles.push({
                x: x, y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 15
            });
        }
    }

    updateParticles() {
        this.ctx.fillStyle = "#00ff66";
        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            this.ctx.fillRect(p.x, p.y, 4, 4);
            if (p.life <= 0) this.particles.splice(i, 1);
        });
    }

    drawCRTMonitor(x, y) {
        // Brazos Robóticos
        this.ctx.strokeStyle = "#475569";
        this.ctx.lineWidth = 12;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 95, y);
        this.ctx.lineTo(x - 230, y + Math.sin(this.frameCount * 0.08) * 25);
        this.ctx.moveTo(x + 95, y);
        this.ctx.lineTo(x + 230, y + Math.sin(this.frameCount * 0.08) * 25);
        this.ctx.stroke();

        // Monitor CRT
        this.ctx.fillStyle = "#1e293b";
        this.ctx.fillRect(x - 120, y - 85, 240, 170);
        this.ctx.strokeStyle = "#00f0ff";
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(x - 120, y - 85, 240, 170);

        // Pantalla
        this.ctx.fillStyle = "#05050d";
        this.ctx.fillRect(x - 105, y - 72, 210, 144);
    }

    drawFace(x, y, mode) {
        let eyeOffsetX = (this.player.x - x) * 0.04;
        let eyeOffsetY = (this.player.y - y) * 0.04;

        if (mode === 'SMILE') {
            this.ctx.fillStyle = "#ff0055";
            this.ctx.beginPath();
            this.ctx.arc(x - 45, y - 20, 24, 0, Math.PI * 2);
            this.ctx.arc(x + 45, y - 20, 24, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = "#ffffff";
            this.ctx.beginPath();
            this.ctx.arc(x - 45 + eyeOffsetX, y - 20 + eyeOffsetY, 10, 0, Math.PI * 2);
            this.ctx.arc(x + 45 + eyeOffsetX, y - 20 + eyeOffsetY, 10, 0, Math.PI * 2);
            this.ctx.fill();

            // Dientes
            this.ctx.fillStyle = "#ffffff";
            this.ctx.beginPath();
            this.ctx.arc(x, y + 18, 50, 0, Math.PI, false);
            this.ctx.fill();

            this.ctx.strokeStyle = "#000000";
            this.ctx.lineWidth = 3;
            for (let i = -35; i <= 35; i += 11) {
                this.ctx.beginPath();
                this.ctx.moveTo(x + i, y + 18);
                this.ctx.lineTo(x + i, y + 50);
                this.ctx.stroke();
            }
        } else if (mode === 'SCREAM') {
            this.ctx.fillStyle = "#ffffff";
            this.ctx.fillRect(x - 70, y - 48, 48, 48);
            this.ctx.fillRect(x + 22, y - 48, 48, 48);
            this.ctx.fillStyle = "#ff0055";
            this.ctx.fillRect(x - 55 + eyeOffsetX, y - 38 + eyeOffsetY, 20, 20);
            this.ctx.fillRect(x + 37 + eyeOffsetX, y - 38 + eyeOffsetY, 20, 20);

            this.ctx.fillStyle = "#ff0055";
            this.ctx.fillRect(x - 50, y + 8, 100, 48);
            this.ctx.fillStyle = "#000";
            this.ctx.fillRect(x - 40, y + 18, 80, 28);
        } else if (mode === 'GLITCH') {
            for (let i = 0; i < 22; i++) {
                this.ctx.fillStyle = Math.random() > 0.5 ? "#ff0055" : "#00f0ff";
                this.ctx.fillRect(x - 100 + Math.random() * 200, y - 65 + Math.random() * 130, 45, 9);
            }
        }
    }

    drawVine(v) {
        this.ctx.strokeStyle = "#16a34a";
        this.ctx.lineWidth = 14;
        this.ctx.beginPath();
        let startX = v.side === 'LEFT' ? 0 : this.canvas.width;
        let endX = v.side === 'LEFT' ? v.length : this.canvas.width - v.length;
        this.ctx.moveTo(startX, v.y);
        this.ctx.lineTo(endX, v.y + Math.sin(this.frameCount * 0.05 + v.y) * 16);
        this.ctx.stroke();

        this.ctx.fillStyle = "#00ff66";
        this.ctx.beginPath();
        this.ctx.arc(endX, v.y, 8, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawSoul(x, y) {
        this.ctx.fillStyle = "#ff0000";
        this.ctx.shadowColor = "#ff0000";
        this.ctx.shadowBlur = 12;
        this.ctx.beginPath();
        this.ctx.arc(x - 6, y - 6, 6, Math.PI, 0, false);
        this.ctx.arc(x + 6, y - 6, 6, Math.PI, 0, false);
        this.ctx.lineTo(x, y + 8);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    updateHealthUI(hp) {
        const fill = document.getElementById("bossHealthFill");
        const hpText = document.getElementById("bossHpText");
        const pct = Math.max(0, (hp / this.boss.maxHp) * 100);
        fill.style.width = `${pct}%`;
        hpText.innerText = `${Math.max(0, Math.floor(hp))} / ${this.boss.maxHp} HP`;
    }
}
