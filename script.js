// Service Worker Kaydı
if ('serviceWorker' in navigator && location.hostname !== 'localhost' && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW hatası:', err));
}

window.addEventListener('load', () => {
    // Sayfa yükleme efekti
    setTimeout(() => document.body.classList.remove("not-loaded"), 600);

    const isMobile = window.innerWidth < 768;

    // --- Görsel Efektler ---
    const firefliesContainer = document.querySelector('.fireflies');
    const fireflyCount = isMobile ? 8 : 25;
    for (let i = 0; i < fireflyCount; i++) {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';
        firefly.style.animationDuration = (Math.random() * 4 + 4) + 's, ' + (Math.random() * 1.5 + 0.8) + 's';
        firefly.style.animationDelay = Math.random() * 3 + 's';
        firefliesContainer?.appendChild(firefly);
    }

    // --- Medya Galerisi Ayarları ---
    const mediaContainer = document.getElementById('media-container');
    const mediaImage = document.getElementById('media-image');
    const mediaVideo = document.getElementById('media-video');
    const mediaClose = document.getElementById('media-close');
    const showMediaBtn = document.getElementById('show-media');

    const mediaFiles = [
        { type: 'image', src: 'media/1.jpeg' }, { type: 'image', src: 'media/2.jpeg' },
        { type: 'image', src: 'media/3.jpeg' }, { type: 'image', src: 'media/4.jpeg' },
        { type: 'image', src: 'media/5.jpeg' }, { type: 'image', src: 'media/6.jpeg' },
        { type: 'image', src: 'media/7.jpeg' }, { type: 'image', src: 'media/8.jpeg' },
        { type: 'image', src: 'media/9.jpeg' }, { type: 'image', src: 'media/10.jpeg' },
        { type: 'image', src: 'media/11.jpeg' }, { type: 'image', src: 'media/12.jpeg' },
        { type: 'image', src: 'media/13.jpeg' }, { type: 'image', src: 'media/14.jpeg' },
        { type: 'image', src: 'media/15.jpeg' }, { type: 'image', src: 'media/gulo.jpg' },
        { type: 'video', src: 'media/gulobebek.mp4' }
    ];

    function showMedia(index) {
        const media = mediaFiles[index];
        if (!media) return;
        mediaImage.style.display = 'none';
        mediaVideo.style.display = 'none';
        if (media.type === 'image') {
            mediaImage.src = media.src;
            mediaImage.style.display = 'block';
        } else {
            mediaVideo.src = media.src;
            mediaVideo.style.display = 'block';
            mediaVideo.play().catch(() => {});
        }
    }

    showMediaBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        mediaContainer.classList.add('active');
        showMedia(0);
    });

    mediaClose?.addEventListener('click', (e) => {
        e.stopPropagation();
        mediaContainer.classList.remove('active');
        mediaVideo.pause();
    });

    // --- Sürpriz Modal ---
    const surpriseModal = document.getElementById('surprise-modal');
    const surpriseOpenBtn = document.getElementById('surprise-open');
    const surpriseCloseBtn = document.getElementById('surprise-close');
    const SURPRISE_KEY = 'sevgi_bari_seen_surprise';

    if (!localStorage.getItem(SURPRISE_KEY)) {
        setTimeout(() => { if(surpriseModal) surpriseModal.style.display = 'flex'; }, 700);
    }

    surpriseOpenBtn?.addEventListener('click', () => {
        if(surpriseModal) surpriseModal.style.display = 'none';
        localStorage.setItem(SURPRISE_KEY, '1');
        createConfetti();
    });

    surpriseCloseBtn?.addEventListener('click', () => {
        if(surpriseModal) surpriseModal.style.display = 'none';
    });

    // --- Sevgi Barı Oyunu ---
    const loveBarFill = document.getElementById('love-bar-fill');
    const recordMarker = document.getElementById('record-marker');
    const messageDisplay = document.getElementById('message-display');
    const attemptsDisplay = document.getElementById('attempts-count');

    let currentLevel = 0, direction = 1, isPlaying = false, animationId, lastTime = 0;
    let attempts = parseInt(localStorage.getItem('Sevgi Barı Denemeleri')) || 9999;
    attemptsDisplay.innerText = attempts;

    function gameLoop(timestamp) {
        if (!isPlaying) return;
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        let speed = (0.8 + (currentLevel / 100)) * (deltaTime / 16);
        currentLevel += speed * direction;

        if (currentLevel >= 100) { currentLevel = 100; direction = -1; }
        else if (currentLevel <= 0) { currentLevel = 0; direction = 1; }

        if(loveBarFill) loveBarFill.style.transform = `scaleY(${currentLevel / 100})`;
        animationId = requestAnimationFrame(gameLoop);
    }

    function handleInput(e) {
        // Tıklanan şey bir buton veya kapatma simgesi ise oyunu tetikleme
        if (e.target.closest('button') || e.target.closest('#media-close') || e.target.closest('.sidebar')) return;
        
        // Mobilde çift tıklamayı ve sayfa kaymasını engelle
        if (e.cancelable) e.preventDefault();

        if (!isPlaying) {
            if (attempts > 0) {
                isPlaying = true;
                lastTime = 0;
                messageDisplay.innerText = "Durdurmak için dokun!";
                animationId = requestAnimationFrame(gameLoop);
            }
        } else {
            isPlaying = false;
            cancelAnimationFrame(animationId);
            attempts--;
            localStorage.setItem('Sevgi Barı Denemeleri', attempts);
            attemptsDisplay.innerText = attempts;
            const score = Math.floor(currentLevel);
            messageDisplay.innerText = `Skor: %${score}`;
            if(score > 80) createConfetti();
            
            // Sağ taraftaki video alanını güncelle
            const loveSide = document.getElementById('loveSideContent');
            if(loveSide) {
                loveSide.innerHTML = `<div style="text-align:center"><b>Skorun: %${score}</b><br><video src="media/gulobebek.mp4" autoplay muted loop style="width:100%; border-radius:10px; margin-top:10px;"></video></div>`;
            }
        }
    }

    // ÇAKIŞMAYI ÖNLEYEN DİNLEYİCİLER
    // Sadece pointerdown kullanıyoruz, click ve touchstart'ı iptal ediyoruz
    document.addEventListener('pointerdown', handleInput, { passive: false });
    document.addEventListener('keydown', (e) => { if(e.code === 'Space') handleInput(e); });

    function createConfetti() {
        for (let i = 0; i < 30; i++) {
            const c = document.createElement('div');
            c.style.cssText = `position:fixed;left:50%;top:50%;width:8px;height:8px;background:hsl(${Math.random()*360},100%,50%);z-index:9999;border-radius:50%;pointer-events:none;`;
            document.body.appendChild(c);
            const a = Math.random()*Math.PI*2, v = Math.random()*20+10;
            c.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.cos(a)*v}vmax,${Math.sin(a)*v}vmax)`,opacity:0}], {duration:1000, easing:'ease-out'}).onfinish = () => c.remove();
        }
    }
});
