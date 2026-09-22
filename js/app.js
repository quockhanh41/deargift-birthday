/**
 * ĐIỀU KHIỂN CHÍNH TRẢI NGHIỆM WEB (MAIN APP CONTROLLER)
 * Kết nối config, âm thanh, hiệu ứng hạt, máy gõ chữ và tương tác các màn chơi.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Khởi tạo cấu hình và hiệu ứng
    const config = window.BIRTHDAY_CONFIG || {};
    window.romanticEffects.init();

    // 2. Khởi tạo biến trạng thái
    let currentSceneIndex = 1;
    const totalScenes = 5;
    let letterTypewriter = null;
    let candleBlown = false;

    // 3. Render dữ liệu từ config.js vào giao diện
    populateContent(config);

    // 4. Thiết lập tương tác cho từng màn
    initGiftScene();
    initCakeScene();
    initLetterScene();
    initPolaroidScene();
    initEndingScene();
    initLightbox();
    initVideoModal();

    /**
     * Điền thông tin cá nhân hóa từ config
     */
    function populateContent(cfg) {
        // Màn 1: Quà tặng
        if (cfg.giftBox) {
            safeSetText("gift-badge-text", cfg.giftBox.badge);
            safeSetText("gift-title-text", cfg.giftBox.title || `Gửi tặng ${cfg.recipient?.name || "Em"}`);
            safeSetText("gift-hint-text", cfg.giftBox.tapHint);
        }

        // Màn 2: Bánh sinh nhật
        if (cfg.cake) {
            safeSetText("cake-title-text", cfg.cake.title);
            safeSetText("cake-sub-text", cfg.cake.subtitle);
            safeSetText("cake-instruction-text", cfg.cake.instruction);
            safeSetText("btn-blow-candle-text", cfg.cake.blowButtonText);
            safeSetText("wish-title-text", cfg.cake.wishGrantedTitle);
            safeSetText("wish-sub-text", cfg.cake.wishGrantedSubtitle);
            safeSetText("btn-to-letter-text", cfg.cake.nextButtonText);
        }

        // Màn 3: Bức thư
        if (cfg.letter) {
            safeSetText("letter-stamp-date", cfg.letter.stamp || cfg.recipient?.birthdayDate || "Special Day");
            safeSetText("letter-salutation-text", cfg.letter.title || `Gửi ${cfg.recipient?.name || "em"},`);
            safeSetText("sign-off-text", cfg.letter.ending || "Yêu em rất nhiều ❤️");
            safeSetText("sign-off-name", cfg.sender?.signature || cfg.sender?.name || "Anh");
            safeSetText("btn-to-polaroid-text", cfg.letter.nextButtonText);
        }

        // Màn 5: Lời kết
        if (cfg.ending) {
            safeSetText("ending-title-text", cfg.ending.title);
            safeSetText("ending-subtitle-text", cfg.ending.subtitle);
            safeSetText("btn-replay-text", cfg.ending.replayButton);
        }

        // Cập nhật Header
        safeSetText("header-recipient-name", `${cfg.recipient?.name || "Em Yêu"} • ${cfg.recipient?.birthdayDate || "Happy Birthday"}`);
    }

    function safeSetText(id, text) {
        const el = document.getElementById(id);
        if (el && text) el.textContent = text;
    }

    /**
     * Chuyển màn mượt mà và cập nhật Step Indicator
     */
    function goToScene(sceneNumber) {
        if (sceneNumber < 1 || sceneNumber > totalScenes) return;

        const prevScene = document.getElementById(`scene-${currentSceneIndex}`);
        const nextScene = document.getElementById(`scene-${sceneNumber}`);

        if (prevScene) prevScene.classList.remove("active");
        if (nextScene) nextScene.classList.add("active");

        currentSceneIndex = sceneNumber;
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Cập nhật các chấm trạng thái
        for (let i = 1; i <= totalScenes; i++) {
            const dot = document.getElementById(`step-dot-${i}`);
            if (!dot) continue;
            dot.classList.remove("active", "completed");
            if (i === currentSceneIndex) {
                dot.classList.add("active");
            } else if (i < currentSceneIndex) {
                dot.classList.add("completed");
            }
        }
    }

    /**
     * MÀN 1: HỘP QUÀ BẤT NGỜ
     */
    function initGiftScene() {
        const giftBox = document.getElementById("gift-box-trigger");
        const giftLid = document.getElementById("gift-lid");
        const giftBody = document.getElementById("gift-body");

        if (!giftBox) return;

        let opened = false;
        const triggerOpen = () => {
            if (opened) return;
            opened = true;

            // Âm thanh và nhạc nền
            window.romanticAudio.playGiftPop();
            window.romanticAudio.startMusic();

            // Hiệu ứng mở nắp
            if (giftLid) giftLid.classList.add("lid-opening");
            if (giftBody) giftBody.classList.add("gift-opened");

            // Bắn tung tóe pháo hoa trái tim và confetti
            const rect = giftBox.getBoundingClientRect();
            window.romanticEffects.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 90);

            // Chuyển sang màn bánh kem sau 1.2s
            setTimeout(() => {
                goToScene(2);
            }, 1200);
        };

        giftBox.addEventListener("click", triggerOpen);
        const btnOpen = document.getElementById("btn-open-gift");
        if (btnOpen) {
            btnOpen.addEventListener("click", triggerOpen);
        }
    }

    /**
     * MÀN 2: BÁNH SINH NHẬT 3D XOAY 360 ĐỘ (2 TẦNG ẢNH & NẾN TIKTOK)
     */
    function initCakeScene() {
        const candleWrapper = document.getElementById("candle-trigger");
        const candleFlame = document.getElementById("candle-flame");
        const btnBlow = document.getElementById("btn-blow-candle");
        const wishBanner = document.getElementById("wish-granted-banner");
        const btnToLetter = document.getElementById("btn-to-letter");
        const topCylinder = document.getElementById("tier-top-cylinder");
        const bottomCylinder = document.getElementById("tier-bottom-cylinder");
        const rotator = document.getElementById("cake-3d-rotator");
        const stage = document.getElementById("cake-3d-stage");
        const topImgEl = document.getElementById("cake-top-img");

        // 1. Cập nhật ảnh tròn trên đỉnh bánh
        if (topImgEl && config.cake?.topImage) {
            topImgEl.src = config.cake.topImage;
        }

        // Bánh sinh nhật CHỈ hiển thị duy nhất 10 ảnh photo-1 đến photo-10 và portrait.jpeg trên đỉnh bánh
        const cakePhotos = (config.cake && Array.isArray(config.cake.photos) && config.cake.photos.length > 0)
            ? config.cake.photos
            : [
                "assets/images/photo-1.jpeg",
                "assets/images/photo-2.jpeg",
                "assets/images/photo-3.jpeg",
                "assets/images/photo-4.jpeg",
                "assets/images/photo-5.jpeg",
                "assets/images/photo-6.jpeg",
                "assets/images/photo-7.jpeg",
                "assets/images/photo-8.jpeg",
                "assets/images/photo-9.jpeg",
                "assets/images/photo-10.jpeg"
            ];
        const memoryImgs = cakePhotos;

        const topCaptions = [
            "It's your birthday ✨",
            "My Sweet Girl 💖",
            "Happy 24.09 🌸",
            "Love You Most ❤️"
        ];
        const bottomCaptions = [
            "Happy Birthday Yến Ngân! 🎉",
            "Công Chúa Nhỏ 💖",
            "Nụ Cười Tỏa Nắng 📸",
            "Khoảnh Khắc Ngọt Ngào 🌸",
            "Yến Ngân & Khánh 💕",
            "Yêu Em Nhất Đời ❤️"
        ];

        // 2. Tạo 8 panels ghép thành hình trụ tròn mịn cho TẦNG TRÊN (R = 92px)
        if (topCylinder && topCylinder.children.length === 0) {
            const numPanelsTop = 8;
            const angleStepTop = 360 / numPanelsTop; // 45 độ
            const zTop = 92;

            for (let i = 0; i < numPanelsTop; i++) {
                const panel = document.createElement("div");
                panel.className = "tier-panel";
                const deg = i * angleStepTop;
                panel.style.transform = `rotateY(${deg}deg) translateZ(${zTop}px)`;
                panel.style.backgroundImage = `url('${memoryImgs[i % memoryImgs.length]}')`;

                const overlay = document.createElement("div");
                overlay.className = "tier-panel-overlay";
                overlay.textContent = topCaptions[i % topCaptions.length];
                panel.appendChild(overlay);

                topCylinder.appendChild(panel);
            }
        }

        // 3. Tạo 12 panels ghép thành hình trụ tròn mịn cho TẦNG DƯỚI (R = 142px)
        if (bottomCylinder && bottomCylinder.children.length === 0) {
            const numPanelsBottom = 12;
            const angleStepBottom = 360 / numPanelsBottom; // 30 độ
            const zBottom = 142;

            for (let i = 0; i < numPanelsBottom; i++) {
                const panel = document.createElement("div");
                panel.className = "tier-panel";
                const deg = i * angleStepBottom;
                panel.style.transform = `rotateY(${deg}deg) translateZ(${zBottom}px)`;
                // Bắt đầu từ ảnh số 4 để so le và phô diễn đầy đủ cả photo-9, photo-10
                const imgIndex = (i + 4) % memoryImgs.length;
                panel.style.backgroundImage = `url('${memoryImgs[imgIndex]}')`;

                const overlay = document.createElement("div");
                overlay.className = "tier-panel-overlay";
                overlay.textContent = bottomCaptions[i % bottomCaptions.length];
                panel.appendChild(overlay);

                bottomCylinder.appendChild(panel);
            }
        }

        // 4. Cơ chế xoay 360 độ liên tục mượt mà mãi mãi (không bao giờ quay ngược lại điểm bắt đầu)
        let currentAngle = 0;
        let isDragging = false;
        let startX = 0;
        let lastX = 0;
        let startAngle = 0;
        let velocityX = 0;

        const updateRotation = () => {
            if (rotator) {
                rotator.style.transform = `rotateX(-18deg) rotateY(${currentAngle}deg)`;
            }
        };

        const rotationLoop = () => {
            if (!isDragging) {
                if (Math.abs(velocityX) > 0.05) {
                    currentAngle += velocityX;
                    velocityX *= 0.94; // đà quán tính mượt mà sau khi thả tay
                } else {
                    currentAngle += 0.32; // quay đều mượt mà mãi mãi theo 1 chiều
                }
                updateRotation();
            }
            requestAnimationFrame(rotationLoop);
        };
        requestAnimationFrame(rotationLoop);

        // Kéo thả chuột hoặc vuốt cảm ứng để xoay bánh 360 độ
        if (stage) {
            stage.addEventListener("pointerdown", (e) => {
                isDragging = true;
                startX = e.clientX;
                lastX = e.clientX;
                startAngle = currentAngle;
                velocityX = 0;
                try { stage.setPointerCapture(e.pointerId); } catch (_) {}
            });

            stage.addEventListener("pointermove", (e) => {
                if (!isDragging) return;
                const deltaX = e.clientX - startX;
                velocityX = (e.clientX - lastX) * 0.65;
                lastX = e.clientX;
                currentAngle = startAngle + deltaX * 0.85;
                updateRotation();
            });

            const stopDrag = (e) => {
                if (isDragging) {
                    isDragging = false;
                    try { stage.releasePointerCapture(e.pointerId); } catch (_) {}
                }
            };
            stage.addEventListener("pointerup", stopDrag);
            stage.addEventListener("pointercancel", stopDrag);
        }

        // 5. Tương tác Thổi nến bằng Micro thật hoặc Nút bấm
        const btnEnableMic = document.getElementById("btn-enable-mic");
        const micActiveBox = document.getElementById("mic-active-box");
        const blowMeterFill = document.getElementById("blow-meter-fill");
        const micBlowZone = document.getElementById("mic-blow-zone");
        const candleFallbackZone = document.getElementById("candle-fallback-zone");

        let blowDetector = null;

        const startMicDetection = async () => {
            if (candleBlown) return;
            if (!window.MicBlowDetector) return;

            // Kiểm tra bảo mật HTTPS trước
            if (!window.isSecureContext && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
                if (btnEnableMic) {
                    btnEnableMic.innerHTML = "<span>🔒 Cần mở qua link HTTPS để dùng Mic trên điện thoại</span>";
                    alert("⚠️ Trình duyệt trên điện thoại (Safari/Chrome) chỉ cấp quyền Micro qua liên kết bảo mật HTTPS (không hỗ trợ qua IP Wi-Fi cục bộ http://192.168...)\n\n👉 Bạn hãy dùng nút bấm dự phòng bên dưới để thổi nến, hoặc mở bằng link HTTPS nhé!");
                }
                return;
            }

            blowDetector = new window.MicBlowDetector({
                threshold: 28,
                onIntensity: (intensity) => {
                    if (candleBlown) return;
                    if (blowMeterFill) {
                        blowMeterFill.style.width = `${Math.min(100, Math.round(intensity * 100))}%`;
                    }
                    if (candleFlame) {
                        if (intensity > 0.15) {
                            candleFlame.style.transform = `scale(${1 - intensity * 0.35}) skewX(${intensity * 18}deg)`;
                        } else {
                            candleFlame.style.transform = "";
                        }
                    }
                },
                onBlow: () => {
                    performBlow();
                }
            });

            const result = await blowDetector.start();
            if (result && result.success) {
                if (btnEnableMic) btnEnableMic.style.display = "none";
                if (micActiveBox) micActiveBox.style.display = "flex";
            } else {
                if (btnEnableMic) {
                    if (result && result.reason === "insecure") {
                        btnEnableMic.innerHTML = "<span>🔒 Cần mở qua link HTTPS để dùng Mic</span>";
                        alert("⚠️ Safari & Chrome trên điện thoại yêu cầu đường link HTTPS bảo mật để mở Micro.\n\nBạn có thể bấm trực tiếp nút bên dưới để thổi nến nhé!");
                    } else if (result && result.reason === "denied") {
                        btnEnableMic.innerHTML = "<span>⚠️ Quyền Micro bị chặn - Bấm nút bên dưới nhé!</span>";
                    } else {
                        btnEnableMic.innerHTML = "<span>⚠️ Không mở được Mic - Bấm nút bên dưới nhé!</span>";
                    }
                }
            }
        };

        if (btnEnableMic) {
            btnEnableMic.addEventListener("click", startMicDetection);
        }

        // Cho phép chạm trực tiếp vào nến để thổi nến luôn
        if (candleWrapper) {
            candleWrapper.style.cursor = "pointer";
            candleWrapper.addEventListener("click", () => {
                if (!candleBlown) performBlow();
            });
        }

        const performBlow = () => {
            if (candleBlown) return;
            candleBlown = true;

            // Dừng microphone ngay để tiết kiệm pin và bảo mật
            if (blowDetector) {
                blowDetector.stop();
            }

            // Ẩn vùng mic và nút thổi
            if (micBlowZone) micBlowZone.style.display = "none";
            if (candleFallbackZone) candleFallbackZone.style.display = "none";

            // Âm thanh thổi nến phùùù
            window.romanticAudio.playBlowSound();

            // Tắt lửa nến
            if (candleFlame) {
                candleFlame.classList.add("flame-extinguished");
            }

            // Tạo làn khói nến bốc lên
            if (candleWrapper) {
                const smoke = document.createElement("div");
                smoke.className = "smoke-puff";
                candleWrapper.appendChild(smoke);
            }

            // Sau 0.6s bắn pháo hoa ăn mừng và hiện banner chúc mừng
            setTimeout(() => {
                window.romanticAudio.playCelebrationChime();
                window.romanticEffects.launchFireworks(4500);

                if (wishBanner) {
                    wishBanner.style.display = "flex";
                }
            }, 600);
        };

        if (btnBlow) btnBlow.addEventListener("click", performBlow);
        if (candleWrapper) candleWrapper.addEventListener("click", performBlow);

        if (btnToLetter) {
            btnToLetter.addEventListener("click", () => {
                goToScene(3);
                // Bắt đầu gõ thư khi vào màn 3
                if (letterTypewriter) {
                    setTimeout(() => letterTypewriter.start(), 400);
                }
            });
        }
    }

    /**
     * MÀN 3: BỨC THƯ TÌNH MÁY GÕ CHỮ
     */
    function initLetterScene() {
        const letterConfig = config.letter || {};
        const btnToPolaroid = document.getElementById("btn-to-polaroid");
        const btnSkipLetter = document.getElementById("btn-skip-letter");
        const btnReplayLetter = document.getElementById("btn-replay-letter");

        letterTypewriter = new window.TypewriterLetter({
            containerId: "letter-content",
            paragraphs: letterConfig.paragraphs || [
                "Chúc mừng sinh nhật người con gái anh yêu thương nhất...",
                "Chúc em luôn xinh đẹp, hạnh phúc và bình yên!"
            ],
            speed: 36,
            onComplete: () => {
                if (btnToPolaroid) {
                    btnToPolaroid.style.display = "inline-flex";
                    btnToPolaroid.classList.add("pulse-glow");
                }
                if (btnSkipLetter) {
                    btnSkipLetter.style.display = "none";
                }
            }
        });

        if (btnSkipLetter) {
            btnSkipLetter.addEventListener("click", () => {
                letterTypewriter.skipToEnd();
            });
        }

        if (btnReplayLetter) {
            btnReplayLetter.addEventListener("click", () => {
                if (btnToPolaroid) btnToPolaroid.style.display = "none";
                if (btnSkipLetter) btnSkipLetter.style.display = "inline-flex";
                letterTypewriter.start();
            });
        }

        if (btnToPolaroid) {
            btnToPolaroid.addEventListener("click", () => {
                goToScene(4);
            });
        }
    }

    /**
     * MÀN 4: ALBUM POLAROID (LẬT 3D XEM MẶT SAU)
     */
    function initPolaroidScene() {
        const polaroidGrid = document.getElementById("polaroid-grid");
        const btnToEnding = document.getElementById("btn-to-ending");
        const items = config.polaroids || [];

        if (!polaroidGrid) return;
        polaroidGrid.innerHTML = "";

        items.forEach((item) => {
            const card = document.createElement("div");
            card.className = "polaroid-card";
            card.id = `polaroid-card-${item.id}`;

            const hasVideo = Boolean(item.video);
            const videoBadgeHtml = hasVideo
                ? `<div class="polaroid-video-badge" data-video="${item.video}" title="Bấm để xem video">
                       <span>🎬 Video</span>
                   </div>`
                : "";

            const videoBtnHtml = hasVideo
                ? `<button class="btn-watch-polaroid-video" data-video="${item.video}" type="button">
                       <span>🎬 Xem Video Kỷ Niệm 🎆</span>
                   </button>`
                : "";

            card.innerHTML = `
                <div class="polaroid-inner">
                    <!-- Mặt trước -->
                    <div class="polaroid-front">
                        <div class="polaroid-img-wrapper">
                            <img src="${item.image}" alt="${item.title}" loading="lazy" />
                            ${videoBadgeHtml}
                        </div>
                        <div class="polaroid-caption">
                            <div class="photo-title">${item.title}</div>
                            <div class="photo-date">${item.date}</div>
                            <div class="polaroid-hint">Chạm để lật xem thông điệp bí mật 💌</div>
                        </div>
                    </div>
                    <!-- Mặt sau -->
                    <div class="polaroid-back">
                        <div class="stamp-heart">💖</div>
                        <div class="secret-title">${item.title}</div>
                        <div class="secret-note">"${item.secretNote}"</div>
                        ${videoBtnHtml}
                        <div class="flip-back-hint">Chạm để lật lại ảnh ↺</div>
                    </div>
                </div>
            `;

            // Bắt sự kiện bấm vào nút hoặc badge xem video
            const videoTriggers = card.querySelectorAll(".polaroid-video-badge, .btn-watch-polaroid-video");
            videoTriggers.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation(); // Không lật thẻ khi bấm xem video
                    if (window.openVideoModal && item.video) {
                        window.openVideoModal(item.video, item.title, item.caption);
                    }
                });
            });

            // Tương tác lật mặt trước / mặt sau
            card.addEventListener("click", () => {
                card.classList.toggle("is-flipped");
                window.romanticAudio.playFlipSound();
            });

            polaroidGrid.appendChild(card);
        });

        if (btnToEnding) {
            btnToEnding.addEventListener("click", () => {
                goToScene(5);
                window.romanticEffects.launchFireworks(3000);
            });
        }
    }

    /**
     * MÀN 5: LỜI KẾT & XEM LẠI
     */
    function initEndingScene() {
        const btnReplay = document.getElementById("btn-replay-all");
        if (btnReplay) {
            btnReplay.addEventListener("click", () => {
                // Đặt lại nến
                candleBlown = false;
                const flame = document.getElementById("candle-flame");
                if (flame) flame.classList.remove("flame-extinguished");
                const blowBtn = document.getElementById("btn-blow-candle");
                if (blowBtn) blowBtn.style.display = "inline-flex";
                const wishBanner = document.getElementById("wish-granted-banner");
                if (wishBanner) wishBanner.style.display = "none";

                // Về màn 1
                goToScene(1);
            });
        }
    }

    /**
     * LIGHTBOX PHÓNG TO ẢNH (MODAL)
     */
    
    /**
     * MODAL XEM VIDEO KỶ NIỆM (VIDEO PLAYER)
     */
    function initVideoModal() {
        const modal = document.getElementById("video-memory-modal");
        const backdrop = document.getElementById("video-modal-backdrop");
        const closeBtn = document.getElementById("video-modal-close");
        const videoPlayer = document.getElementById("memory-video-player");
        const videoSource = document.getElementById("memory-video-source");
        const titleEl = document.getElementById("video-modal-title");
        const captionEl = document.getElementById("video-modal-caption");

        if (!modal || !videoPlayer) return;

        window.openVideoModal = (videoSrc, title, caption) => {
            if (videoSource) videoSource.src = videoSrc;
            videoPlayer.load();
            if (titleEl && title) titleEl.textContent = title;
            if (captionEl && caption) captionEl.textContent = `"${caption}" 💖`;

            // Tạm dừng nhạc nền để người yêu nghe rõ âm thanh trong video
            if (window.romanticAudio && window.romanticAudio.bgmAudio) {
                try { window.romanticAudio.bgmAudio.pause(); } catch (e) {}
            }

            modal.classList.add("active");
            const playPromise = videoPlayer.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.log("Video autoplay prevented:", err);
                });
            }
        };

        const closeVideoModal = () => {
            modal.classList.remove("active");
            videoPlayer.pause();
            videoPlayer.currentTime = 0;

            // Tiếp tục phát nhạc nền nếu nhạc đang trong trạng thái bật
            if (window.romanticAudio && window.romanticAudio.isPlaying && window.romanticAudio.bgmAudio) {
                try { window.romanticAudio.bgmAudio.play(); } catch (e) {}
            }
        };

        if (closeBtn) closeBtn.addEventListener("click", closeVideoModal);
        if (backdrop) backdrop.addEventListener("click", closeVideoModal);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("active")) {
                closeVideoModal();
            }
        });
    }

    function initLightbox() {
        const modal = document.getElementById("lightbox-modal");
        const modalImg = document.getElementById("lightbox-img");
        const closeBtn = document.getElementById("lightbox-close");

        if (!modal || !modalImg) return;

        window.openLightbox = (src, alt) => {
            modalImg.src = src;
            modalImg.alt = alt || "Ảnh kỷ niệm";
            modal.classList.add("active");
        };

        const closeLightbox = () => {
            modal.classList.remove("active");
        };

        if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeLightbox();
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeLightbox();
        });
    }

    // Cho phép click vào step dots để điều hướng nhanh
    for (let i = 1; i <= totalScenes; i++) {
        const dot = document.getElementById(`step-dot-${i}`);
        if (dot) {
            dot.addEventListener("click", () => {
                goToScene(i);
                if (i === 3 && letterTypewriter && !letterTypewriter.isFinished) {
                    setTimeout(() => letterTypewriter.start(), 300);
                }
            });
        }
    }
});
