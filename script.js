// Service Worker Kaydı (PWA Desteği)
if ('serviceWorker' in navigator && location.hostname !== 'localhost' && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service Worker kaydı başarısız:', err);
    });
} else {
    console.log('Service Worker kaydı atlandı (localhost veya dosya protokolü).');
}

// Sayfa yüklendiğinde
window.addEventListener('load', () => {
    // Browser rendering süresi
    setTimeout(() => {
        document.body.classList.remove("not-loaded");
    }, 600);

    // Ateşböceği oluşturma
    const firefliesContainer = document.querySelector('.fireflies');
    const isMobile = window.innerWidth < 768;
    const fireflyCount = isMobile ? 8 : 25;

    for (let i = 0; i < fireflyCount; i++) {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';
        firefly.style.animationDuration = (Math.random() * 4 + 4) + 's, ' + (Math.random() * 1.5 + 0.8) + 's';
        firefly.style.animationDelay = Math.random() * 3 + 's';
        firefliesContainer.appendChild(firefly);
    }

    // Ay Emojileri
    const emojis = ['❤️', '💖', '💘', '💕', '💓', '💗', '💞', '💟', '😍', '😘'];

    function createMoonEmoji() {
        const emoji = document.createElement('div');
        emoji.classList.add('moon-emoji');
        emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        const tx = (Math.random() * 12 - 10) + 'vmin';
        const ty = (Math.random() * 12 - 2) + 'vmin';
        emoji.style.setProperty('--tx', tx);
        emoji.style.setProperty('--ty', ty);
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 1500);
    }

    // Kalp Yıldızları
    function createHeartStar() {
        const star = document.createElement('div');
        star.classList.add('heart-star');
        star.style.left = (Math.random() * 50 + 50) + '%';
        star.style.top = (Math.random() * 50) + '%';
        star.style.animationDuration = (Math.random() * 0.8 + 1.2) + 's';
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 2000);
    }

    // Masaüstü animasyonları
    if (!isMobile) {
        setInterval(createMoonEmoji, 1000);
        setInterval(createHeartStar, 1500);
    }

    // Medya Galerisi
    const mediaContainer = document.getElementById('media-container');
    const mediaImage = document.getElementById('media-image');
    const mediaVideo = document.getElementById('media-video');
    const mediaClose = document.getElementById('media-close');
    const showMediaBtn = document.getElementById('show-media');

    // Medya dosyalarını içeren dizi (media klasöründeki tüm görselleri ve videoyu ekliyoruz)
    const mediaFiles = [
        // fotoğraflar
        { type: 'image', src: 'media/1.jpeg', name: '1' },
        { type: 'image', src: 'media/2.jpeg', name: '2' },
        { type: 'image', src: 'media/3.jpeg', name: '3' },
        { type: 'image', src: 'media/4.jpeg', name: '4' },
        { type: 'image', src: 'media/5.jpeg', name: '5' },
        { type: 'image', src: 'media/6.jpeg', name: '6' },
        { type: 'image', src: 'media/7.jpeg', name: '7' },
        { type: 'image', src: 'media/8.jpeg', name: '8' },
        { type: 'image', src: 'media/9.jpeg', name: '9' },
        { type: 'image', src: 'media/10.jpeg', name: '10' },
        { type: 'image', src: 'media/11.jpeg', name: '11' },
        { type: 'image', src: 'media/12.jpeg', name: '12' },
        { type: 'image', src: 'media/13.jpeg', name: '13' },
        { type: 'image', src: 'media/14.jpeg', name: '14' },
        { type: 'image', src: 'media/15.jpeg', name: '15' },
        // diğer
        { type: 'image', src: 'media/gulo.jpg', name: 'Gül' },
        { type: 'video', src: 'media/gulobebek.mp4', name: 'Video' }
    ];

    let currentMediaIndex = 0;

    function showMedia(index) {
        if (index < 0 || index >= mediaFiles.length) return;

        const media = mediaFiles[index];
        mediaImage.style.display = 'none';
        mediaVideo.style.display = 'none';

        if (media.type === 'image') {
            mediaImage.src = media.src;
            mediaImage.style.display = 'block';
        } else {
            mediaVideo.src = media.src;
            mediaVideo.style.display = 'block';
        }
        currentMediaIndex = index;
    }

    if (showMediaBtn) {
        showMediaBtn.addEventListener('click', () => {
            mediaContainer.classList.add('active');
            showMedia(0);
        });
    }

    mediaClose.addEventListener('click', () => {
        mediaContainer.classList.remove('active');
        mediaVideo.pause();
    });

    mediaContainer.addEventListener('click', (e) => {
        if (e.target === mediaContainer) {
            mediaContainer.classList.remove('active');
            mediaVideo.pause();
        }
    });

    // --- Sürpriz modal (Gülçin için) ---
    const surpriseModal = document.getElementById('surprise-modal');
    const surpriseOpenBtn = document.getElementById('surprise-open');
    const surpriseCloseBtn = document.getElementById('surprise-close');
    const SURPRISE_KEY = 'sevgi_bari_seen_surprise';

    function openSurprise() {
        surpriseModal.setAttribute('aria-hidden', 'false');
        // ensure visible for our CSS-driven modal
        try { surpriseModal.style.display = 'flex'; } catch (e) { }
        // Açınca galeriyi/oyunu kısa süreli durdurabiliriz
        surpriseOpenBtn?.focus();
    }

    function closeSurprise(remember = true) {
        surpriseModal.setAttribute('aria-hidden', 'true');
        try { surpriseModal.style.display = 'none'; } catch (e) { }
        if (remember) localStorage.setItem(SURPRISE_KEY, '1');
    }

    // Eğer daha önce gösterilmemişse aç
    try {
        if (!localStorage.getItem(SURPRISE_KEY)) {
            // Kısa gecikme ile göster
            setTimeout(() => openSurprise(), 700);
        }
    } catch (e) {
        // localStorage erişimi blokluysa sessizce atla
    }

    surpriseOpenBtn?.addEventListener('click', () => {
        // Aç butonuna basınca modalı kapatıp oyunu başlatıyoruz
        closeSurprise(true);
        // Oyun mesajını özelleştir
        messageDisplay.innerText = "Sürpriz Açıldı — Seni Seviyorum, Gülçin 💕";
        // Kısa bir konfeti göster
        createConfetti();
    });

    surpriseCloseBtn?.addEventListener('click', () => {
        closeSurprise(true);
    });

    // Sevgi Barı Oyunu
    const loveBarFill = document.getElementById('love-bar-fill');
    const recordMarker = document.getElementById('record-marker');
    const messageDisplay = document.getElementById('message-display');
    const attemptsDisplay = document.getElementById('attempts-count');

    let currentLevel = 0;
    let direction = 1;
    let isPlaying = false;
    let animationId;
    let gameOver = false;

    localStorage.setItem('Sevgi Barı Denemeleri', 9999);
    let attempts = 9999;
    attemptsDisplay.innerText = attempts;

    const BLOB_ID = '019ad62c-fab5-7a9a-8d90-c702da37beb1';
    const API_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

    // Yerel rekoru yükle (varsa)
    const LOCAL_RECORD_KEY = 'sevgi_bari_record';
    let localRecord = 0;
    if (localStorage.getItem(LOCAL_RECORD_KEY)) {
        const parsed = parseInt(localStorage.getItem(LOCAL_RECORD_KEY), 10);
        if (!isNaN(parsed)) localRecord = parsed;
    }
    let globalRecord = 0;
    let displayRecord = Math.max(localRecord, globalRecord);

    async function fetchGlobalRecord() {
        try {
            const res = await fetch(API_URL, { cache: "no-store" });
            if (!res.ok) throw new Error('Network response not ok: ' + res.status);
            const data = await res.json();
            globalRecord = data.record || 0;
            displayRecord = globalRecord > localRecord ? globalRecord : localRecord;
            updateRecordDisplay();
            // cache locally
            try { localStorage.setItem('globalRecord_cache', JSON.stringify(globalRecord)); } catch (e) { }
        } catch (err) {
            console.warn('Rekor yükleme hatası, local cache kullanılıyor:', err);
            try {
                const cached = localStorage.getItem('globalRecord_cache');
                if (cached) {
                    globalRecord = JSON.parse(cached) || 0;
                    displayRecord = Math.max(localRecord, globalRecord);
                    updateRecordDisplay();
                }
            } catch (e) {
                // ignore parse errors
            }
        }
    }

    async function updateGlobalRecord(newScore) {
        try {
            await fetch(API_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ record: newScore })
            });
            try { localStorage.setItem('globalRecord_cache', JSON.stringify(newScore)); } catch (e) { }
        } catch (err) {
            console.warn('Rekor güncelleme hatası, localStorage\'a kaydedildi:', err);
            try { localStorage.setItem('globalRecord_cache', JSON.stringify(newScore)); } catch (e) { }
        }
    }

    fetchGlobalRecord();
    setInterval(fetchGlobalRecord, 5000);

    function updateRecordDisplay() {
        // recordMarker'ın bottom konumunu % ile ayarlıyoruz, sınırlandırarak
        const val = Math.max(0, Math.min(100, displayRecord));
        recordMarker.style.bottom = val + '%';
    }

    updateRecordDisplay();

    if (attempts <= 0) {
        gameOver = true;
        messageDisplay.innerText = `Ben Daha Çok Seviyorum 💕: ${displayRecord}%`;
        loveBarFill.style.backgroundColor = '#555';
    }

    let lastTime = 0;

    function gameLoop(timestamp) {
        if (!isPlaying) return;

        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        const timeScale = deltaTime / 16.67;

        let finalSpeed;
        if (currentLevel > 70) {
            // when near top, allow some bounce but slower
            finalSpeed = (8.0 + Math.random() * 3.0) * timeScale * 0.6;
        } else {
            // slow base speed and gentler ramp so bar moves more smoothly and takes longer
            let baseSpeed = 0.9;
            let ramp = (currentLevel / 70) * 1.2;
            finalSpeed = (baseSpeed + ramp) * timeScale * 0.75;
        }

        currentLevel += finalSpeed * direction;

        if (currentLevel >= 100) {
            currentLevel = 100;
            direction = -1;
        } else if (currentLevel <= 0) {
            currentLevel = 0;
            direction = 1;
        }

        loveBarFill.style.transform = `scaleY(${currentLevel / 100})`;
        animationId = requestAnimationFrame(gameLoop);
    }

    function stopGame(e) {
        if (e && e.type === 'touchstart') e.preventDefault();
        if (gameOver) return;

        if (!isPlaying) {
            if (attempts > 0) {
                isPlaying = true;
                lastTime = 0;
                messageDisplay.innerText = "Durdurmak için bas!";
                animationId = requestAnimationFrame(gameLoop);
            }
        } else {
            isPlaying = false;
            cancelAnimationFrame(animationId);

            attempts--;
            localStorage.setItem('Sevgi Barı Denemeleri', attempts);
            attemptsDisplay.innerText = attempts;

            const score = Math.floor(currentLevel);
            // gösterilecek mesaj ve sağ alan içeriğini güncelle
            const loveSide = document.getElementById('loveSideContent');
            const lovePhrase = document.getElementById('loveSidePhrase');

            function personalMessage(s) {
                if (s >= 95) return `Sonsuz sevgimle — ${s}%`;
                if (s >= 80) return `Kalbim seninle dolu — ${s}%`;
                if (s >= 60) return `Her gün seni daha çok seviyorum — ${s}%`;
                if (s >= 40) return `Yanında olmak benim en büyük mutluluğum — ${s}%`;
                if (s >= 20) return `Gülüşün dünyamı aydınlatıyor — ${s}%`;
                return `Seninle her an özel — ${s}%`;
            }

            if (score > displayRecord) {
                localRecord = score;
                displayRecord = score;
                localStorage.setItem(LOCAL_RECORD_KEY, localRecord);
                if (score > globalRecord) updateGlobalRecord(score);
                updateRecordDisplay();
                messageDisplay.innerText = `Gülümü Ben Daha Çok Seviyorum 💕: ${score}% 🎉`;
                createConfetti();
            } else {
                messageDisplay.innerText = `Skor: ${score}%.`;
            }

            // personalized message into side area — show only the special video (no photo)
            try {
                if (loveSide) {
                    const videoHtml = `<video src="media/gulobebek.mp4" muted playsinline loop autoplay style="width:560px;max-width:100%;aspect-ratio:16/10;height:auto;max-height:420px;border-radius:8px;object-fit:contain;background:#000"></video>`;
                    loveSide.innerHTML = `<div style="font-weight:700;font-size:1.1rem">Muhammet → Gülçin</div><div id=\"loveSidePhrase\" style="color:var(--muted);margin-top:6px">${personalMessage(score)}</div><div style=\"margin-top:8px\">${videoHtml}</div>`;
                    const v = loveSide.querySelector('video'); if (v) v.play().catch(() => { });
                }
            } catch (e) { }

            if (attempts === 0) {
                gameOver = true;
                messageDisplay.innerText = `Ben Daha Çok Seviyorum 💕: ${displayRecord}%`;
                loveBarFill.style.backgroundColor = '#555';
            }
        }
    }

    function createConfetti() {
        const confettiCount = isMobile ? 15 : 40;
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = '50%';
            confetti.style.top = '50%';
            confetti.style.width = '0.8vmin';
            confetti.style.height = '0.8vmin';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.zIndex = '100';
            confetti.style.pointerEvents = 'none';
            confetti.style.borderRadius = '50%';

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 15 + 8;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            confetti.animate([
                { transform: 'translate(0,0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}vmin, ${ty}vmin) scale(0)`, opacity: 0 }
            ], {
                duration: 800 + Math.random() * 800,
                easing: 'cubic-bezier(0, .9, .57, 1)',
                fill: 'forwards'
            });

            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 1600);
        }
    }

    // Kontroller
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') stopGame();
    });

    // Handle touchstart with passive: false to allow preventDefault
    document.addEventListener('touchstart', stopGame, { passive: false });

    // Masaüstü için click desteği
    document.addEventListener('click', (e) => {
        stopGame();
    });
});

// Fallback: DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.classList.remove("not-loaded");
    }, 1000);
});


// ===== SAFE BALANCE PATCH =====
let pipeSpeedOverride = 2;
let gravityOverride = 0.25;
let jumpOverride = -5;

function applyDifficulty(level){
    if(level === "Kolay"){
        pipeSpeedOverride = 1.8;
        gravityOverride = 0.22;
        jumpOverride = -4.8;
    }
    if(level === "Orta"){
        pipeSpeedOverride = 2.5;
        gravityOverride = 0.28;
        jumpOverride = -5.5;
    }
    if(level === "Zor"){
        pipeSpeedOverride = 3.2;
        gravityOverride = 0.34;
        jumpOverride = -6.2;
    }
}

document.addEventListener("change", function(e){
    if(e.target && e.target.tagName === "SELECT"){
        applyDifficulty(e.target.value);
    }
});
// ===== END PATCH =====
