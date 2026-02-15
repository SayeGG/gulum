// Service Worker Kaydı (PWA Desteği)
if ('serviceWorker' in navigator && location.hostname !== 'localhost' && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service Worker kaydı başarısız:', err);
    });
}

window.addEventListener('load', () => {
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

    function createHeartStar() {
        const star = document.createElement('div');
        star.classList.add('heart-star');
        star.style.left = (Math.random() * 50 + 50) + '%';
        star.style.top = (Math.random() * 50) + '%';
        star.style.animationDuration = (Math.random() * 0.8 + 1.2) + 's';
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 2000);
    }

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

    const mediaFiles = [
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
    let attempts = 9999;
    attemptsDisplay.innerText = attempts;

    function gameLoop(timestamp) {
        if (!isPlaying) return;
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        const timeScale = deltaTime / 16.67;

        let baseSpeed = 0.9;
        let ramp = (currentLevel / 70) * 1.2;
        let finalSpeed = (baseSpeed + ramp) * timeScale * 0.75;

        currentLevel += finalSpeed * direction;

        if (currentLevel >= 100) { direction = -1; }
        else if (currentLevel <= 0) { direction = 1; }

        loveBarFill.style.transform = `scaleY(${currentLevel / 100})`;
        animationId = requestAnimationFrame(gameLoop);
    }

    function stopGame(e) {
        // Eğer tıklanan yer bir buton ise oyunu durdurma (butonun kendi işlevi çalışsın)
        if (e && e.target.tagName === 'BUTTON') return;
        if (e && e.cancelable) e.preventDefault();
        if (gameOver) return;

        if (!isPlaying) {
            isPlaying = true;
            lastTime = 0;
            messageDisplay.innerText = "Durdurmak için bas!";
            animationId = requestAnimationFrame(gameLoop);
        } else {
            isPlaying = false;
            cancelAnimationFrame(animationId);
            attempts--;
            attemptsDisplay.innerText = attempts;
            const score = Math.floor(currentLevel);
            messageDisplay.innerText = `Skor: ${score}%`;
            if(score > 90) createConfetti();
        }
    }

    let lastTime = 0;
    // HEM MOUSE HEM TOUCH DESTEĞİ
    document.addEventListener('pointerdown', stopGame, { passive: false });
    document.addEventListener('keydown', (e) => { if (e.code === 'Space') stopGame(e); });

    function createConfetti() {
        const count = isMobile ? 15 : 40;
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = '50%';
            confetti.style.top = '50%';
            confetti.style.width = '2vmin';
            confetti.style.height = '2vmin';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '1000';
            document.body.appendChild(confetti);
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 20 + 10;
            confetti.animate([
                { transform: 'translate(0,0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle)*velocity}vmin, ${Math.sin(angle)*velocity}vmin) scale(0)`, opacity: 0 }
            ], { duration: 1000, fill: 'forwards' });
            setTimeout(() => confetti.remove(), 1000);
        }
    }
});
