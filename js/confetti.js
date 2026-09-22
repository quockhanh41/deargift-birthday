/**
 * BỘ TẠO HIỆU ỨNG PHÁO HOA, TRÁI TIM & HẠT LẤP LÁNH (CANVAS PARTICLES ENGINE)
 * Chạy mượt mà 60 FPS trên cả thiết bị di động và máy tính.
 */

class RomanticEffectsEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.particles = [];
        this.ambientHearts = [];
        this.isRunning = false;
        this.lastTime = 0;

        // Bảng màu pastel lãng mạn
        this.colors = [
            "#ff9ebb", "#ff6b8b", "#ffc2d1", "#ffe5ec",
            "#ffb3c6", "#fbc3bc", "#f7aef8", "#e2bbfd",
            "#ffd166", "#fff0f3", "#f48fb1"
        ];
    }

    init() {
        this.canvas = document.getElementById("effects-canvas");
        if (!this.canvas) {
            this.canvas = document.createElement("canvas");
            this.canvas.id = "effects-canvas";
            document.body.appendChild(this.canvas);
        }

        this.canvas.style.position = "fixed";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvas.style.width = "100vw";
        this.canvas.style.height = "100vh";
        this.canvas.style.pointerEvents = "none";
        this.canvas.style.zIndex = "999";

        this.ctx = this.canvas.getContext("2d");
        this.resize();
        window.addEventListener("resize", () => this.resize());

        // Chạm/click tạo vệt trái tim nhỏ đáng yêu
        window.addEventListener("pointerdown", (e) => {
            this.sparkleAt(e.clientX, e.clientY, 8);
        });

        this.startLoop();
        this.initAmbient();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
    }

    initAmbient() {
        // Tạo các hạt trái tim và đốm sáng lơ lửng ngẫu nhiên
        for (let i = 0; i < 20; i++) {
            this.ambientHearts.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 10 + 6,
                speedY: -(Math.random() * 0.6 + 0.3),
                speedX: (Math.random() - 0.5) * 0.4,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.5 + 0.2,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.02
            });
        }
    }

    // Vẽ hình trái tim bằng Bezier Curve chuẩn mực
    drawHeart(ctx, x, y, size, color, opacity = 1, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = Math.max(0, opacity);
        ctx.fillStyle = color;
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        // Nhánh trái
        ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
        ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 2 + size * 0.3, 0, size);
        // Nhánh phải
        ctx.bezierCurveTo(0, (size + topCurveHeight) / 2 + size * 0.3, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
        ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // Vẽ ngôi sao lấp lánh 4 cánh
    drawSparkle(ctx, x, y, size, color, opacity = 1) {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = Math.max(0, opacity);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.quadraticCurveTo(0, 0, size, 0);
        ctx.quadraticCurveTo(0, 0, 0, size);
        ctx.quadraticCurveTo(0, 0, -size, 0);
        ctx.quadraticCurveTo(0, 0, 0, -size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // Bùng nổ confetti & trái tim từ một toạ độ (Hộp quà mở, Thổi nến)
    burst(x = this.width / 2, y = this.height / 2, count = 100) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 12 + 4;
            const type = Math.random() > 0.4 ? "heart" : (Math.random() > 0.5 ? "confetti" : "sparkle");

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - (Math.random() * 4 + 2),
                gravity: 0.22,
                friction: 0.96,
                size: Math.random() * 12 + 8,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: 1,
                fadeSpeed: Math.random() * 0.012 + 0.008,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.15,
                type: type
            });
        }
    }

    // Vệt hạt lấp lánh nhẹ khi chạm tay / di chuột
    sparkleAt(x, y, count = 6) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1,
                gravity: 0.05,
                friction: 0.94,
                size: Math.random() * 8 + 6,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: 1,
                fadeSpeed: 0.03,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: 0.05,
                type: Math.random() > 0.5 ? "heart" : "sparkle"
            });
        }
    }

    // Bắn chuỗi pháo hoa liên hoàn chúc mừng sinh nhật
    launchFireworks(durationMs = 4000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            if (Date.now() - startTime > durationMs) {
                clearInterval(interval);
                return;
            }
            const rx = Math.random() * (this.width * 0.8) + (this.width * 0.1);
            const ry = Math.random() * (this.height * 0.5) + (this.height * 0.15);
            this.burst(rx, ry, 60);
        }, 350);
    }

    startLoop() {
        if (this.isRunning) return;
        this.isRunning = true;

        const loop = (timestamp) => {
            this.ctx.clearRect(0, 0, this.width, this.height);

            // 1. Cập nhật & vẽ các trái tim lơ lửng trong không khí
            for (let i = 0; i < this.ambientHearts.length; i++) {
                const h = this.ambientHearts[i];
                h.y += h.speedY;
                h.x += h.speedX + Math.sin(timestamp * 0.002 + i) * 0.3;
                h.rotation += h.rotSpeed;

                if (h.y < -30) {
                    h.y = this.height + 20;
                    h.x = Math.random() * this.width;
                }

                this.drawHeart(this.ctx, h.x, h.y, h.size, h.color, h.opacity, h.rotation);
            }

            // 2. Cập nhật & vẽ các hạt hiệu ứng bùng nổ
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.vx *= p.friction;
                p.vy *= p.friction;
                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotSpeed;
                p.opacity -= p.fadeSpeed;

                if (p.opacity <= 0 || p.y > this.height + 50) {
                    this.particles.splice(i, 1);
                    continue;
                }

                if (p.type === "heart") {
                    this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
                } else if (p.type === "sparkle") {
                    this.drawSparkle(this.ctx, p.x, p.y, p.size * 0.8, p.color, p.opacity);
                } else {
                    // Confetti mảnh dải ruy băng xoay 3D
                    this.ctx.save();
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate(p.rotation);
                    this.ctx.globalAlpha = Math.max(0, p.opacity);
                    this.ctx.fillStyle = p.color;
                    this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                    this.ctx.restore();
                }
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }
}

window.romanticEffects = new RomanticEffectsEngine();
