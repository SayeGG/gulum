window.addEventListener('load', () => {
    // Giriş Animasyonu
    setTimeout(() => document.body.classList.remove("not-loaded"), 500);

    let lastInputTime = 0;

    // --- ÖZEL VERİLER (1-16 arası resimler + 1 video) ---
    const romantikSozler = [
        "Gülüşün cennetten bir köşe gibi gülüm...", "Her bakışında yeniden aşık oluyorum.",
        "Dünyam seninle daha renkli, hayatımın anlamı.", "Gülçin'im, kalbimin tek sahibi...",
        "Seninle geçen her saniye bir hazine.", "Ömrümün en güzel manzarası sensin.",
        "Gözlerindeki ışık yolumu aydınlatıyor.", "Sen benim sol yanım, canım eşimsin.",
        "Ruhumun eşi, iyiki varsın.", "Mucizelere inanma sebebimsin.",
        "Sana olan sevgim kelimelere sığmaz.", "Hayat yolculuğumdaki en güzel durak.",
        "Sen benim her şeyimsin, birtanem.", "Gül yüzlüm, dünyalar güzeli sevgilim.",
        "Sonsuza kadar sadece sen ve ben...", "Kalbimin ritmi senin adınla atıyor."
    ];

    const mediaFiles = [];
    for(let i=1; i<=16; i++) { 
        mediaFiles.push({ type: 'image', src: `media/${i}.jpeg`, text: romantikSozler[i-1] || "Seni seviyorum!" }); 
    }
    mediaFiles.push({ type: 'video', src: 'media/gulobebek.mp4', text: "Senin o güzel hallerine kurban olurum Gül'üm!" });

    // --- PANEL YÖNETİMİ ---
    function showPanel(id) {
        // Tüm olası içerik alanlarını gizle
        const targets = ['home', 'gallery', 'love', 'flappy', 'galleryPanel', 'lovePanel', 'flappyPanel'];
        targets.forEach(t => {
            const el = document.getElementById(t);
            if (el) el.style.display = 'none';
        });

        // Hedef paneli göster
        const activePanel = document.getElementById(id + 'Panel') || document.getElementById(id);
        if (activePanel) {
            activePanel.style.display = 'block';
            if (id === 'gallery') buildGallery();
            if (id === 'love') { loadLoveContent(); resetLoveGame(); }
            if (id === 'flappy') { resizeFlappy(); resetFlappy(); }
        }
    }

    // Buton Dinleyicileri (Masaüstü ve Mobil için en garanti yol)
    document.querySelectorAll('[data-target]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showPanel(btn.getAttribute('data-target'));
        });
    });

    // Sürpriz Butonu
    document.getElementById('btnSurprise')?.addEventListener('click', () => {
        showPanel('gallery');
        createConfetti();
    });

    // --- GALERİ ---
    function buildGallery() {
        const gal = document.getElementById('galleryPanel') || document.getElementById('gallery');
        if(!gal) return;
        gal.innerHTML = '<h2 style="text-align:center; color:#ff69b4; font-family:serif;">Gülçin & Muhammet</h2><div id="grid-inner"></div>';
        const grid = gal.querySelector('#grid-inner');
        grid.style.cssText = "display:grid; grid-template-columns:1fr; gap:20px; padding:15px; overflow-y:auto; max-height:80vh;";

        mediaFiles.forEach(file => {
            const card = document.createElement('div');
            card.style.cssText = "background:#111; border-radius:15px; overflow:hidden; border:1px solid #ff69b4;";
            if(file.type === 'image') {
                card.innerHTML = `<img src="${file.src}" style="width:100%; display:block;"><p style="padding:15px; color:#ffc0cb; text-align:center;">${file.text}</p>`;
            } else {
                card.innerHTML = `<video src="${file.src}" controls style="width:100%;"></video><p style="padding:15px; color:#ffc0cb; text-align:center;">${file.text}</p>`;
            }
            grid.appendChild(card);
        });
    }

    // --- SEVGİ BARI ---
    const barFill = document.getElementById('love-bar-fill');
    const loveMsg = document.getElementById('message-display');
    const loveSide = document.getElementById('loveSideContent');
    let loveVal = 0, loveDir = 1, loveRunning = false, loveRaf;

    function resetLoveGame() {
        loveVal = 0; loveRunning = false;
        if(barFill) barFill.style.transform = `scaleY(0)`;
        if(loveMsg) loveMsg.innerHTML = "Gül'üm seni ne kadar seviyor?<br>Öğrenmek için dokun!";
    }

    function loveTick() {
        if (!loveRunning) return;
        loveVal += (2.5 + (loveVal / 30)) * loveDir;
        if (loveVal >= 100) { loveVal = 100; loveDir = -1; }
        else if (loveVal <= 0) { loveVal = 0; loveDir = 1; }
        if (barFill) barFill.style.transform = `scaleY(${loveVal / 100})`;
        loveRaf = requestAnimationFrame(loveTick);
    }

    function loadLoveContent() {
        if (loveSide) {
            loveSide.innerHTML = `
                <div id="love-status" style="color:#ff69b4; font-weight:bold; margin-bottom:10px; text-align:center;">Seni dünyalar kadar seviyorum!</div>
                <video src="media/gulobebek.mp4" autoplay muted loop playsinline style="width:100%; border-radius:10px;"></video>
            `;
        }
    }

    // --- FLAPPY GÜLÇİN (YUVARLAK) ---
    const canvas = document.getElementById('flappyCanvas');
    let ctx, flappy = { running: false, pipes: [] };
    const birdImg = new Image(); birdImg.src = 'media/flappy_gulcin.png';

    function resizeFlappy() {
        if (!canvas) return;
        canvas.width = canvas.parentElement.clientWidth || 320;
        canvas.height = 450;
        ctx = canvas.getContext('2d');
    }

    function resetFlappy() {
        flappy = { y: 200, vy: 0, g: 0.3, score: 0, running: false, pipes: [], timer: 0 };
        drawFlappy();
    }

    function drawFlappy() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Yuvarlak Karakter
        ctx.save();
        ctx.beginPath();
        ctx.arc(65, flappy.y + 15, 25, 0, Math.PI * 2);
        ctx.clip();
        if(birdImg.complete) ctx.drawImage(birdImg, 40, flappy.y - 10, 50, 50);
        else { ctx.fillStyle = "#ff69b4"; ctx.fill(); }
        ctx.restore();

        flappy.pipes.forEach(p => {
            ctx.fillStyle = "#4ade80";
            ctx.fillRect(p.x, 0, 50, p.top);
            ctx.fillRect(p.x, p.top + 160, 50, canvas.height);
        });
        ctx.fillStyle = "white"; ctx.fillText("Skor: " + flappy.score, 20, 30);
    }

    function flappyTick() {
        if (!flappy.running) return;
        flappy.vy += flappy.g; flappy.y += flappy.vy; flappy.timer++;
        if (flappy.timer % 90 === 0) flappy.pipes.push({ x: canvas.width, top: Math.random() * (canvas.height - 250) + 50 });
        flappy.pipes.forEach(p => {
            p.x -= 3;
            if (65+20 > p.x && 45 < p.x+50 && (flappy.y < p.top || flappy.y+30 > p.top+160))
