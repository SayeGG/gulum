// TÜM SİSTEMİ YÖNETEN ANA DOSYA
window.addEventListener('load', () => {
    // Sayfa yükleme efekti
    setTimeout(() => document.body.classList.remove("not-loaded"), 500);

    // --- GENEL DEĞİŞKENLER VE AYARLAR ---
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let lastInputTime = 0;

    // --- PANEL SİSTEMİ (SEKMELER) ---
    function showPanel(id) {
        document.querySelectorAll('.main > div, #panel > div').forEach(d => d.style.display = 'none');
        const el = document.getElementById(id + 'Panel') || document.getElementById(id);
        if (el) el.style.display = 'block';
        window.dispatchEvent(new Event('resize')); // Canvasları hizalamak için
    }

    document.querySelectorAll('[data-target]').forEach(btn => {
        btn.onclick = () => showPanel(btn.getAttribute('data-target'));
    });

    // --- MEDYA GALERİSİ VE VİDEOLAR ---
    const mediaContainer = document.getElementById('media-container');
    const mediaImage = document.getElementById('media-image');
    const mediaVideo = document.getElementById('media-video');
    const mediaClose = document.getElementById('media-close');
    
    const mediaFiles = [
        { type: 'image', src: 'media/1.jpeg' }, { type: 'image', src: 'media/gulo.jpg' },
        { type: 'video', src: 'media/gulobebek.mp4' }, { type: 'image', src: 'media/2.jpeg' }
        // Diğer resimlerini buraya ekleyebilirsin
    ];

    document.getElementById('show-media')?.addEventListener('click', () => {
        mediaContainer.classList.add('active');
        const first = mediaFiles[0];
        if(first.type === 'image') { mediaImage.src = first.src; mediaImage.style.display='block'; mediaVideo.style.display='none'; }
        else { mediaVideo.src = first.src; mediaVideo.style.display='block'; mediaImage.style.display='none'; mediaVideo.play(); }
    });

    mediaClose?.addEventListener('click', () => {
        mediaContainer.classList.remove('active');
        mediaVideo.pause();
    });

    // --- SEVGİ BARI OYUNU ---
    const loveBarFill = document.getElementById('love-bar-fill');
    const messageDisplay = document.getElementById('message-display');
    let currentLevel = 0, direction = 1, isPlaying = false, loveAnim;

    function loveLoop() {
        if (!isPlaying) return;
        currentLevel += (0.8 + (currentLevel / 100)) * direction;
        if (currentLevel >= 100) direction = -1;
        else if (currentLevel <= 0) direction = 1;
        if(loveBarFill) loveBarFill.style.transform = `scaleY(${currentLevel / 100})`;
        loveAnim = requestAnimationFrame(loveLoop);
    }

    // --- FLAPPY OYUNU ---
    const canvas = document.getElementById('flappyCanvas');
    let game = null, flappyAnim;
    if(canvas) {
        const ctx = canvas.getContext('2d');
        function startFlappy() {
            game = { birdY: 150, vy: 0, gravity: 0.25, over: false, score: 0 };
            loopFlappy();
        }
        function loopFlappy() {
            if(!game || game.over) return;
            ctx.clearRect(0,0,canvas.width, canvas.height);
            game.vy += game.gravity;
            game.birdY += game.vy;
            ctx.fillStyle = "#ff69b4";
            ctx.fillRect(50, game.birdY, 30, 30);
            if(game.birdY > canvas.height || game.birdY < 0) game.over = true;
            flappyAnim = requestAnimationFrame(loopFlappy);
        }
        document.getElementById('flappyStart')?.addEventListener('click', startFlappy);
    }

    // --- MERKEZİ GİRİŞ KONTROLÜ (DOKUNMATİK VE MOUSE ÇÖZÜMÜ) ---
    function handleGlobalInput(e) {
        // Butonlara basıldığında oyunu tetikleme
        if (e.target.closest('button') || e.target.closest('aside')) return;

        // Mobilde çift tıklama ve gecikme koruması
        const now = Date.now();
        if (now - lastInputTime < 100) return; 
        lastInputTime = now;

        // Sayfanın kaymasını engelle
        if (e.cancelable) e.preventDefault();

        // 1. Sevgi Barı Kontrolü
        const lovePanel = document.getElementById('lovePanel');
        if (lovePanel && lovePanel.style.display !== 'none') {
            if (!isPlaying) {
                isPlaying = true;
                loveLoop();
                messageDisplay.innerText = "Durdurmak için bas!";
            } else {
                isPlaying = false;
                cancelAnimationFrame(loveAnim);
                messageDisplay.innerText = "Skor: %" + Math.floor(currentLevel);
                if(currentLevel > 80) createConfetti();
            }
        }

        // 2. Flappy Kontrolü
        if (game && !game.over) {
            game.vy = -5;
        }
    }

    // Tarayıcıya dokunmatiği biz yöneteceğiz diyoruz
    window.addEventListener('pointerdown', handleGlobalInput, { passive: false });
    window.addEventListener('keydown', (e) => { if(e.code === 'Space') handleGlobalInput(e); });

    function createConfetti() {
        for (let i = 0; i < 20; i++) {
            const c = document.createElement('div');
            c.style.cssText = `position:fixed;left:50%;top:50%;width:8px;height:8px;background:red;z-index:999;border-radius:50%;pointer-events:none;`;
            document.body.appendChild(c);
            c.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${(Math.random()-0.5)*100}vw,${(Math.random()-0.5)*100}vh)`,opacity:0}], 1000).onfinish = () => c.remove();
        }
    }
});
