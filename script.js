window.addEventListener('load', () => {
    // Sayfa Yükleme Animasyonu
    setTimeout(() => document.body.classList.remove("not-loaded"), 500);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let lastInputTime = 0;

    // --- ÖZEL VERİLER ---
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
        document.querySelectorAll('.main > div, #panel > div').forEach(p => p.style.display = 'none');
        const target = document.getElementById(id + 'Panel') || document.getElementById(id);
        if (target) {
            target.style.display = 'block';
            if (id === 'gallery') buildGallery();
            if (id === 'love') { loadLoveContent(); resetLoveGame(); }
            if (id === 'flappy') { resizeFlappy(); resetFlappy(); }
        }
    }

    document.querySelectorAll('[data-target]').forEach(btn => {
        btn.onclick = (e) => { e.stopPropagation(); showPanel(btn.getAttribute('data-target')); };
    });

    document.getElementById('btnSurprise')?.addEventListener('click', () => {
        showPanel('gallery');
        createConfetti();
    });

    // --- GALERİ ---
    function buildGallery() {
        const gal = document.getElementById('galleryPanel');
        if(!gal) return;
        gal.innerHTML = '<h2 class="playfair" style="text-align:center; color:#ff69b4;">Sana Dair Her Şey...</h2><div class="gallery-grid"></div>';
        const grid = gal.querySelector('.gallery-grid');
        grid.style.cssText = "display:grid; grid-template-columns:1fr; gap:25px; padding:15px;";

        mediaFiles.forEach(file => {
            const card = document.createElement('div');
            card.style.cssText = "background:#111; border-radius:20px; overflow:hidden; border:1px solid #ff69b4; box-shadow: 0 5px 15px rgba(255,105,180,0.3);";
            if(file.type === 'image') {
                card.innerHTML = `<img src="${file.src}" style="width:100%; display:block;"><p style="padding:15px; font-style:italic; color:#ffc0cb; text-align:center; font-size:1.1rem;">${file.text}</p>`;
            } else {
                card.innerHTML = `<video src="${file.src}" controls style="width:100%;"></video><p style="padding:15px; color:#ffc0cb; text-align:center; font-weight:bold;">${file.text}</p>`;
            }
            grid.appendChild(card);
        });
    }

    // --- SEVGİ BARI (HIZLI VE AKICI) ---
    const barFill = document.getElementById('love-bar-fill');
    const loveMsg = document.getElementById('message-display');
    const loveSide = document.getElementById('loveSideContent');
    let loveVal = 0, loveDir = 1, loveRunning = false, loveRaf;

    function resetLoveGame() {
        loveVal = 0; loveRunning = false;
        if(barFill) barFill.style.transform = `scaleY(0)`;
        loveMsg.innerHTML = "Gül'üm seni ne kadar seviyor?<br>Öğrenmek için dokun!";
    }

    function loveTick() {
        if (!loveRunning) return;
        loveVal += (2.2 + (loveVal / 40)) * loveDir; // Daha oyunsu ve hızlı
        if (loveVal >= 100) { loveVal = 100; loveDir = -1; }
        else if (loveVal <= 0) { loveVal = 0; loveDir = 1; }
        if (barFill) barFill.style.transform = `scaleY(${loveVal / 100})`;
        loveRaf = requestAnimationFrame(loveTick);
    }

    function loadLoveContent() {
        if (loveSide) {
            loveSide.innerHTML = `
                <div id="love-status" style="color:#ff69b4; font-weight:bold; font-size:1.2rem; margin-bottom:15px; text-align:center;">Seni dünyalar kadar seviyorum Gülçin'im!</div>
                <video src="media/gulobebek.mp4" autoplay muted loop playsinline style="width:100%; border-radius:15px; border:2px solid #ff69b4;"></video>
            `;
        }
    }

    // --- FLAPPY GÜLÇİN (YUVARLAK KARAKTER VE BLOKLAR) ---
    const canvas = document.getElementById('flappyCanvas');
    let ctx, flappy = { running: false, pipes: [] };
    const birdImg = new Image(); 
    birdImg.src = 'media/flappy_gulcin.png'; // Senin logon

    function resizeFlappy() {
        if (!canvas) return;
        canvas.width = canvas.parentElement.clientWidth || 350;
        canvas.height = 500;
        ctx = canvas.getContext('2d');
    }

    function resetFlappy() {
        flappy = { y: 250, vy: 0
