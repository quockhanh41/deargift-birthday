/**
 * BỘ QUẢN LÝ ÂM THANH & TỔNG HỢP NHẠC NỀN LÃNG MẠN (Web Audio API)
 * Tự động tạo nhạc hộp quà (Music Box), giai điệu Happy Birthday & hiệu ứng âm thanh sống động.
 */

class RomanticAudioManager {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.musicTimeout = null;
        this.noteTimeouts = []; // Danh sách các timer nốt nhạc cần dọn dẹp sạch sẽ
        this.externalAudio = null;
        this.useExternal = false;
        this.activeSource = "none"; // "external" | "synth" | "none"
        this.musicPlayerEl = null;
        this.discEl = null;
        this.toggleBtn = null;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        // Kiểm tra xem có file mp3 tùy chỉnh không
        this.checkExternalAudio();
        this.bindUI();
    }

    bindUI() {
        this.musicPlayerEl = document.getElementById("music-player");
        this.discEl = document.getElementById("music-disc");
        this.toggleBtn = document.getElementById("music-toggle-btn");

        if (this.toggleBtn) {
            this.toggleBtn.addEventListener("click", () => {
                this.toggleMusic();
            });
        }
    }

    checkExternalAudio() {
        const audio = new Audio();
        audio.src = "assets/audio/romantic-bgm.mp3";
        audio.loop = true;
        audio.preload = "auto";
        audio.addEventListener("canplaythrough", () => {
            this.externalAudio = audio;
            this.useExternal = true;
        });
        audio.addEventListener("canplay", () => {
            this.externalAudio = audio;
            this.useExternal = true;
        });
        audio.addEventListener("error", () => {
            this.useExternal = false;
        });
    }

    async ensureContext() {
        if (!this.ctx) {
            this.init();
        }
        if (this.ctx && this.ctx.state === "suspended") {
            await this.ctx.resume();
        }
    }

    startMusic() {
        this.ensureContext();
        if (this.isPlaying) return;
        this.isPlaying = true;

        if (this.discEl) {
            this.discEl.classList.add("spinning");
        }
        if (this.toggleBtn) {
            this.toggleBtn.setAttribute("aria-label", "Tạm dừng nhạc");
            this.toggleBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            `;
        }

        // Luôn dọn dẹp sạch sẽ tất cả timer synthesizer cũ trước khi phát
        this.clearAllMusicTimers();

        // Ưu tiên phát file MP3 nếu có
        if (this.useExternal && this.externalAudio) {
            this.activeSource = "external";
            this.externalAudio.play().catch(err => {
                console.log("External audio play prevented, fallback to synth:", err);
                this.activeSource = "synth";
                this.playMusicBoxLoop();
            });
        } else {
            this.activeSource = "synth";
            this.playMusicBoxLoop();
        }
    }

    pauseMusic() {
        this.isPlaying = false;
        if (this.discEl) {
            this.discEl.classList.remove("spinning");
        }
        if (this.toggleBtn) {
            this.toggleBtn.setAttribute("aria-label", "Phát nhạc");
            this.toggleBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        }

        if (this.externalAudio) {
            this.externalAudio.pause();
        }

        // Hủy bỏ toàn bộ timer nốt nhạc ngay lập tức
        this.clearAllMusicTimers();
        this.activeSource = "none";
    }

    clearAllMusicTimers() {
        if (this.musicTimeout) {
            clearTimeout(this.musicTimeout);
            this.musicTimeout = null;
        }
        if (this.noteTimeouts && this.noteTimeouts.length > 0) {
            this.noteTimeouts.forEach(t => clearTimeout(t));
            this.noteTimeouts = [];
        }
    }

    toggleMusic() {
        if (this.isPlaying) {
            this.pauseMusic();
        } else {
            this.startMusic();
        }
    }

    // Âm thanh Music Box / Chuông gió tinh tế
    playTone(freq, duration = 0.8, type = "sine", time = 0) {
        if (!this.ctx || this.isMuted) return;
        const startTime = this.ctx.currentTime + time;

        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        // Họa âm nhẹ tạo cảm giác ấm áp như hộp nhạc gỗ
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq * 2, startTime);

        // Envelope mềm mại
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.musicGain);

        osc.start(startTime);
        osc2.start(startTime);
        osc.stop(startTime + duration);
        osc2.stop(startTime + duration);
    }

    // Vòng lặp giai điệu Happy Birthday và Lofi Chord ngọt ngào
    playMusicBoxLoop() {
        if (!this.isPlaying || this.activeSource !== "synth") return;

        this.clearAllMusicTimers();
        this.noteTimeouts = [];

        // Tần số các nốt: C4, D4, E4, F4, G4, A4, B4, C5, D5, E5, F5...
        const N = {
            C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
            C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
            G3: 196.00, A3: 220.00, F3: 174.61, C3: 130.81
        };

        // Giai điệu Happy Birthday nhẹ nhàng kết hợp hợp âm rải như hộp nhạc tình yêu
        const melody = [
            // Cụm 1: Happy birthday to you
            { note: N.G4, dur: 0.35, beat: 0.4 },
            { note: N.G4, dur: 0.25, beat: 0.3 },
            { note: N.A4, dur: 0.6,  beat: 0.65, bass: N.C4 },
            { note: N.G4, dur: 0.6,  beat: 0.65 },
            { note: N.C5, dur: 0.6,  beat: 0.65, bass: N.G3 },
            { note: N.B4, dur: 1.1,  beat: 1.2 },

            // Cụm 2: Happy birthday to you
            { note: N.G4, dur: 0.35, beat: 0.4 },
            { note: N.G4, dur: 0.25, beat: 0.3 },
            { note: N.A4, dur: 0.6,  beat: 0.65, bass: N.F3 },
            { note: N.G4, dur: 0.6,  beat: 0.65 },
            { note: N.D5, dur: 0.6,  beat: 0.65, bass: N.G3 },
            { note: N.C5, dur: 1.1,  beat: 1.2 },

            // Cụm 3: Happy birthday to dear Yen Ngan
            { note: N.G4, dur: 0.35, beat: 0.4 },
            { note: N.G4, dur: 0.25, beat: 0.3 },
            { note: N.G5, dur: 0.6,  beat: 0.65, bass: N.C4 },
            { note: N.E5, dur: 0.6,  beat: 0.65 },
            { note: N.C5, dur: 0.6,  beat: 0.65, bass: N.A3 },
            { note: N.B4, dur: 0.6,  beat: 0.65 },
            { note: N.A4, dur: 1.1,  beat: 1.2,  bass: N.F3 },

            // Cụm 4: Happy birthday to you
            { note: N.F5, dur: 0.35, beat: 0.4 },
            { note: N.F5, dur: 0.25, beat: 0.3 },
            { note: N.E5, dur: 0.6,  beat: 0.65, bass: N.C4 },
            { note: N.C5, dur: 0.6,  beat: 0.65 },
            { note: N.D5, dur: 0.6,  beat: 0.65, bass: N.G3 },
            { note: N.C5, dur: 1.3,  beat: 1.5,  bass: N.C3 }
        ];

        let accumulatedTime = 0;
        melody.forEach(item => {
            const timer = setTimeout(() => {
                if (this.isPlaying && this.activeSource === "synth") {
                    this.playTone(item.note, item.dur);
                    if (item.bass) {
                        this.playTone(item.bass, item.dur * 1.5, "sine");
                    }
                }
            }, accumulatedTime * 1000);
            this.noteTimeouts.push(timer);
            accumulatedTime += item.beat;
        });

        // Lặp lại chu kỳ
        this.musicTimeout = setTimeout(() => {
            if (this.isPlaying && this.activeSource === "synth") {
                this.playMusicBoxLoop();
            }
        }, (accumulatedTime + 0.8) * 1000);
    }

    // Hiệu ứng mở hộp quà: âm thanh pop nảy vui tai + chimes
    playGiftPop() {
        this.ensureContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Âm pop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.18);

        // Chuỗi chuông ngân
        const chimes = [523.25, 659.25, 783.99, 1046.5];
        chimes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 0.6, "triangle");
            }, (idx + 1) * 70);
        });
    }

    // Hiệu ứng thổi nến: tiếng gió nhẹ 'phùùù'
    playBlowSound() {
        this.ensureContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const dur = 1.2;

        // Tạo tiếng ồn trắng (white noise) mô phỏng tiếng gió thổi
        const bufferSize = this.ctx.sampleRate * dur;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(350, now);
        filter.frequency.exponentialRampToValueAtTime(150, now + dur);
        filter.Q.setValueAtTime(2, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.exponentialRampToValueAtTime(0.4, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(now);
        noise.stop(now + dur);
    }

    // Hiệu ứng pháo hoa / chúc mừng vui vẻ
    playCelebrationChime() {
        this.ensureContext();
        const chords = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        chords.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 1.2, "sine");
            }, idx * 100);
        });
    }

    // Tiếng gõ bàn phím nhẹ nhàng cho typewriter
    playTypewriterKey() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        // random frequency xê dịch nhẹ cho tự nhiên
        const randFreq = 900 + Math.random() * 400;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(randFreq, now);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    // Hiệu ứng lật ảnh Polaroid
    playFlipSound() {
        this.ensureContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.15);
    }
}

window.romanticAudio = new RomanticAudioManager();

/**
 * BỘ PHÁT HIỆN HƠI THỔI TỪ MICROPHONE (BLOW DETECTOR)
 * Phân tích năng lượng tần số thấp của luồng gió khi người dùng thổi vào mic.
 */
class MicBlowDetector {
    constructor(options = {}) {
        this.onBlow = options.onBlow || null;
        this.onIntensity = options.onIntensity || null; // Nhận độ mạnh hơi thở (0 đến 1)
        this.audioCtx = null;
        this.analyser = null;
        this.micStream = null;
        this.isListening = false;
        this.animationId = null;
        this.sustainedCount = 0;
        this.threshold = options.threshold || 30; // Ngưỡng nhận diện luồng gió thực sự mạnh (50)
        this.startTime = 0;
    }

    async start() {
        if (this.isListening) return { success: true };

        // 1. Kiểm tra môi trường bảo mật (HTTPS)
        if (!window.isSecureContext && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
            console.warn("getUserMedia yêu cầu kết nối HTTPS bảo mật trên thiết bị di động.");
            return {
                success: false,
                reason: "insecure",
                message: "Trình duyệt điện thoại bắt buộc kết nối HTTPS bảo mật để mở Micro."
            };
        }

        // 2. Kiểm tra API mediaDevices
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn("Trình duyệt không hỗ trợ navigator.mediaDevices.getUserMedia.");
            return {
                success: false,
                reason: "unsupported",
                message: "Trình duyệt này không hỗ trợ truy cập Micro trực tiếp."
            };
        }

        try {
            // 3. Khởi tạo AudioContext NGAY TRONG LƯỢT GESTURE
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!this.audioCtx) {
                this.audioCtx = new AudioContext();
            }
            if (this.audioCtx.state === "suspended") {
                try {
                    await this.audioCtx.resume();
                } catch (e) {}
            }

            // 4. Lấy stream microphone với fallback cho mobile
            try {
                this.micStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false
                    }
                });
            } catch (err) {
                console.warn("Thử lại getUserMedia với cấu hình cơ bản cho mobile:", err);
                this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            }

            if (this.audioCtx.state === "suspended") {
                try {
                    await this.audioCtx.resume();
                } catch (e) {}
            }

            const source = this.audioCtx.createMediaStreamSource(this.micStream);
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.25;
            source.connect(this.analyser);

            this.isListening = true;
            this.sustainedCount = 0;
            this.startTime = Date.now(); // Ghi nhận thời gian bắt đầu
            this.listenLoop();
            return { success: true };
        } catch (err) {
            console.error("Lỗi khi mở micro:", err);
            this.isListening = false;
            let reason = "denied";
            let msg = "Micro bị từ chối hoặc không khả dụng.";
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                reason = "denied";
                msg = "Bạn đã từ chối quyền Micro. Hãy cho phép trong cài đặt trình duyệt.";
            } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                reason = "no_device";
                msg = "Không tìm thấy thiết bị Microphone.";
            }
            return { success: false, reason: reason, message: msg, error: err };
        }
    }

    listenLoop() {
        if (!this.isListening || !this.analyser) return;

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);

        // Bỏ qua 450ms đầu tiên sau khi bấm nút mở mic để tránh nhận diện cú chạm màn hình
        if (Date.now() - this.startTime < 450) {
            this.animationId = requestAnimationFrame(() => this.listenLoop());
            return;
        }

        // 1. Tính năng lượng dải tần gió thổi (khoảng 80Hz - 600Hz)
        let lowFreqSum = 0;
        const lowBins = Math.min(18, bufferLength);
        for (let i = 2; i < lowBins; i++) {
            lowFreqSum += dataArray[i];
        }
        const lowAvg = lowFreqSum / (lowBins - 2);

        // 2. Tính năng lượng dải tần tiếng rít gió (khoảng 600Hz - 2200Hz)
        let midFreqSum = 0;
        const midBins = Math.min(52, bufferLength);
        for (let i = 18; i < midBins; i++) {
            midFreqSum += dataArray[i];
        }
        const midAvg = midFreqSum / (midBins - 18);

        // Chuẩn hóa cường độ hơi thổi (0 đến 1) theo ngưỡng 30
        const intensity = Math.min(Math.max((lowAvg - 16) / (this.threshold - 16), 0), 1);
        if (typeof this.onIntensity === "function") {
            this.onIntensity(intensity, lowAvg);
        }

        // Nhận diện luồng gió thổi đạt ngưỡng 30
        const isBlowing = (lowAvg >= this.threshold) && (midAvg >= 10);

        if (isBlowing) {
            this.sustainedCount++;
            // Duy trì luồng gió thổi ~180ms (11 frames) để kích hoạt thổi tắt nến
            if (this.sustainedCount >= 11) {
                this.stop();
                if (typeof this.onBlow === "function") {
                    this.onBlow();
                }
                return;
            }
        } else {
            // Giảm nhanh nếu luồng gió bị ngắt hoặc chỉ là tiếng va đập thoáng qua
            this.sustainedCount = Math.max(0, this.sustainedCount - 2);
        }

        this.animationId = requestAnimationFrame(() => this.listenLoop());
    }

    stop() {
        this.isListening = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.micStream) {
            this.micStream.getTracks().forEach(track => track.stop());
            this.micStream = null;
        }
        if (this.audioCtx && this.audioCtx.state !== "closed") {
            this.audioCtx.close().catch(() => {});
            this.audioCtx = null;
        }
    }
}

window.MicBlowDetector = MicBlowDetector;
