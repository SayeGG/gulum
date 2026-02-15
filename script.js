window.addEventListener('load', () => {
    // Giriş animasyonu
    setTimeout(() => document.body.classList.remove("not-loaded"), 500);

    // --- DEĞİŞKENLER ---
    let lastInputTime = 0;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Medya Listesi (Dosya adlarını kontrol et: .jpeg mi .jpg mi?)
    const mediaFiles = [
        { type: 'image', src: 'media/1.jpeg' }, { type: 'image', src: 'media/2.jpeg' },
        { type: 'image', src: 'media/gulo.jpg' }, { type: 'video', src: 'media/gulobebek.mp4' }
    ];

    // --- PANEL SİSTEMİ ---
    function showPanel(id) {
        // Tüm panelleri kapat (Hem ana main içindekiler hem de panel divi içindekiler)
        document.querySelectorAll('.main > div, #panel > div').forEach(p => p.style.display = 'none');
        
        const target = document.getElementById(id + 'Panel') || document.getElementById(id);
        if (target) {
            target.style.display = 'block';
            if (id === 'love') loadLoveVideo();
            if (id === 'flappy') { resizeFlappy(); resetFlappy(); }
        }
    }

    // Buton bağlantıları
    document.querySelectorAll('[data-target]').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            showPanel(btn.getAttribute('data-target'));
        };
    });

    // --- SEVGİ BARI OYUNU ---
    const barFill = document.getElementById('love-bar-fill');
    const msg = document.getElementById('message-display');
    let loveVal = 0, loveDir = 1, loveRunning = false, loveRaf;

    function loveTick() {
        if (!loveRunning) return;
        loveVal += (0.9 + (loveVal / 100)) * loveDir;
        if (loveVal >= 100) { loveVal = 100; loveDir = -1; }
        else if (loveVal <= 0) { loveVal = 0; loveDir = 1; }
        if (barFill) barFill.style.transform = `scaleY(${loveVal / 100})`;
        loveRaf = requestAnimationFrame(loveTick);
    }

    function loadLoveVideo() {
        const side = document.getElementById('loveSideContent');
        if (side) side.innerHTML = `<video src="media/gulobebek.mp4" autoplay muted loop playsinline style="width:100%; border-radius:10px;"></video>`;
    }

    // --- FLAPPY GÜLÇİN (BLOKLU SİSTEM) ---
    const canvas = document.getElementById('flappyCanvas');
    let ctx, flappy = { running: false, pipes: [] };

    function resizeFlappy() {
        if (!canvas) return;
        canvas.width = canvas.parentElement.clientWidth || 350;
        canvas.height = 500;
        ctx = canvas.getContext('2d');
    }

    function resetFlappy() {
        flappy = {
            y: 200, vy: 0, g: 0.25, score: 0, running: false,
            pipes: [], timer: 0
        };
        drawFlappyFrame();
    }

    function drawFlappyFrame() {
        ctx.clearRect(0,0,canvas.width, canvas.height);
        // Kuş
        ctx.fillStyle = "#ff69b4";
        ctx.fillRect(50, flappy.y, 30, 30);
        // Borular
        ctx.fillStyle = "#4ade80";
        flappy.pipes.forEach(p => {
            ctx.fillRect(p.x, 0, 50, p.top);
            ctx.fillRect(p.x, p.top + 150, 50, canvas.height);
        });
        ctx.fillStyle = "white";
        ctx.fillText("Skor: " + flappy.score, 10, 25);
    }

    function flappyTick() {
        if (!flappy.running) return;
        flappy.vy += flappy.g;
        flappy.y += flappy.vy;
        
        flappy.timer++;
        if (flappy.timer % 100 === 0) {
            flappy.pipes.push({ x: canvas.width, top: Math.random() * (canvas.height - 250) + 50 });
        }

        flappy.pipes.forEach(p => {
            p.x -= 2;
            // Çarpışma
            if (50+30 > p.x && 50 < p.x+50 && (flappy.y < p.top || flappy.y+30 > p.top+150)) flappy.running = false;
            if (p.x === 50) flappy.score++;
        });

        flappy.pipes = flappy.pipes.filter(p => p.x > -60);
        if (flappy.y > canvas.height || flappy.y < 0) flappy.running = false;

        drawFlappyFrame();
        if (flappy.running) requestAnimationFrame(flappyTick);
        else { msg.innerText = "Yandın! Tekrar dokun."; }
    }

    // --- MERKEZİ DOKUNMATİK KONTROLÜ ---
    function handleAction(e) {
        if (e.target.closest('button') || e.target.closest('aside')) return;
        
        const now = Date.now();
        if (now - lastInputTime < 150) return; // Çift tıklama önleyici
        lastInputTime = now;

        // Sevgi Barı Etkileşimi
        if (document.getElementById('lovePanel').style.display === 'block') {
            if (!loveRunning) { loveRunning = true; loveTick(); }
            else { loveRunning = false; cancelAnimationFrame(loveRaf); }
        }

        // Flappy Etkileşimi
        if (document.getElementById('flappyPanel').style.display === 'block') {
            if (!flappy.running) { resetFlappy(); flappy.running = true; flappyTick(); }
            else { flappy.vy = -5; }
        }
    }

    // Dinleyiciler
    window.addEventListener('pointerdown', handleAction, { passive: false });
    window.addEventListener('keydown', (e) => { if(e.code === 'Space') handleAction(e); });
    
    // İlk açılış
    showPanel('home');
});
