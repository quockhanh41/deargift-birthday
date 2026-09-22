/**
 * HIỆU ỨNG MÁY GÕ CHỮ CHO BỨC THƯ TÌNH CẢM ĐỘNG
 * Gõ từng ký tự tự nhiên kèm âm thanh lách cách êm tai và con trỏ nhấp nháy.
 */

class TypewriterLetter {
    constructor(options = {}) {
        this.containerId = options.containerId || "letter-content";
        this.paragraphs = options.paragraphs || [];
        this.speed = options.speed || 38; // ms mỗi ký tự
        this.isTyping = false;
        this.isPaused = false;
        this.isFinished = false;
        this.currentParaIndex = 0;
        this.currentCharIndex = 0;
        this.timer = null;
        this.onComplete = options.onComplete || null;
        this.soundCounter = 0;
    }

    start() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = "";
        this.isTyping = true;
        this.isPaused = false;
        this.isFinished = false;
        this.currentParaIndex = 0;
        this.currentCharIndex = 0;

        this.typeNextCharacter();
    }

    typeNextCharacter() {
        if (!this.isTyping || this.isPaused) return;

        const container = document.getElementById(this.containerId);
        if (!container) return;

        if (this.currentParaIndex >= this.paragraphs.length) {
            this.finish();
            return;
        }

        let pElem = container.children[this.currentParaIndex];
        if (!pElem) {
            pElem = document.createElement("p");
            pElem.className = "letter-para";
            container.appendChild(pElem);
        }

        const currentParaText = this.paragraphs[this.currentParaIndex];

        if (this.currentCharIndex < currentParaText.length) {
            const char = currentParaText[this.currentCharIndex];
            pElem.textContent += char;
            this.currentCharIndex++;

            // Phát âm thanh gõ bàn phím nhẹ nhàng mỗi vài ký tự
            this.soundCounter++;
            if (this.soundCounter % 2 === 0 && window.romanticAudio && char.trim()) {
                window.romanticAudio.playTypewriterKey();
            }

            // Dấu chấm, dấu phẩy nghỉ lâu hơn cho cảm xúc chân thật
            let delay = this.speed;
            if (char === "." || char === "!" || char === "?") {
                delay = 400;
            } else if (char === "," || char === ";") {
                delay = 200;
            } else if (char === " ") {
                delay = this.speed * 0.8;
            }

            this.timer = setTimeout(() => this.typeNextCharacter(), delay);
        } else {
            // Chuyển sang đoạn tiếp theo
            this.currentParaIndex++;
            this.currentCharIndex = 0;
            this.timer = setTimeout(() => this.typeNextCharacter(), 450);
        }
    }

    pause() {
        this.isPaused = true;
        if (this.timer) clearTimeout(this.timer);
    }

    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.typeNextCharacter();
        }
    }

    // Hiển thị toàn bộ ngay lập tức nếu muốn đọc nhanh
    skipToEnd() {
        if (this.isFinished) return;
        if (this.timer) clearTimeout(this.timer);

        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = "";
        this.paragraphs.forEach(para => {
            const p = document.createElement("p");
            p.className = "letter-para";
            p.textContent = para;
            container.appendChild(p);
        });

        this.finish();
    }

    finish() {
        this.isTyping = false;
        this.isFinished = true;
        if (this.timer) clearTimeout(this.timer);

        const container = document.getElementById(this.containerId);
        if (container) {
            const cursor = document.getElementById("letter-cursor");
            if (cursor) cursor.style.display = "none";
        }

        if (typeof this.onComplete === "function") {
            this.onComplete();
        }
    }
}

window.TypewriterLetter = TypewriterLetter;
