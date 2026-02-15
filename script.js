window.addEventListener('load', () => {
    // Sayfa yükleme animasyonunu kaldır
    setTimeout(() => document.body.classList.remove("not-loaded"), 400);

    // --- ÖZEL VERİLER ---
    const romantikSozler = [
        "Seninle her saniye bir ömre bedel Gül'üm...", "Gözlerin dünyamı aydınlatan en parlak yıldız.",
        "Muhammet sana her gün yeniden aşık oluyor.", "Canım eşim, kalbimin tek sahibi Gülçin'im.",
        "Seninle yaşlanmak hayattaki en büyük şansım.", "Gülüşün cennetten bir köşe gibi birtanem.",
        "Dünyam seninle daha renkli, daha anlamlı.", "Her anımda, her nefesimde sen varsın.",
        "Ruhumun eşi, hayatımın anlamı iyiki varsın.", "Mucizelere inanma sebebim senin varlığın.",
        "Sana olan sevgim kelimelere sığmayacak kadar büyük.", "Hayat yolculuğumdaki en güzel durak sensin.",
        "Sen benim her şeyimsin, dünyalar güzeli sevgilim.", "Gül yüzlüm, kalbinin güzelliği yüzüne yansımış.",
        "Sonsuza kadar sadece sen ve ben, el ele...", "Kalbimin ritmi senin adınla anlam kazanıyor.",
        "Sen benim başıma gelen en güzel şeysin."
    ];

    // Galeri Verileri (16 Resim + 1 Video)
    const mediaFiles = [];
    for(let i=1; i<=16; i++) { 
        mediaFiles.push({ type: 'image', src: `media/${i}.jpeg`, text: romantikSozler[i-1] || "Seni çok seviyorum!" }); 
    }
    mediaFiles.push({ type: 'video', src: 'media/gulobebek.mp4', text: "Gül'üm senin o güzel hallerine kurban olurum!" });

    // --- PANEL VE BUTON YÖNETİMİ (Windows + Mobil Uyumlu) ---
    function showPanel(id) {
        // Tüm panelleri gizle
        document.querySelectorAll('.main > div, #panel > div').forEach(p => p.style.display = 'none');
        
        const target = document.getElementById(id + 'Panel') || document.getElementById(id);
        if (target) {
            target.style.display = 'block';
            if (id === 'gallery') buildGallery();
            if (id === 'love') { loadLoveContent(); resetLoveGame(); }
            if (id === 'flappy') { resizeFlappy(); resetFlappy(); }
        }
    }

    // Butonlara tıklama ve dokunma desteği
    document.querySelectorAll('[data-target], .sidebar .btn').forEach(btn => {
        const action = (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target') || btn.id.replace('btn', '').toLowerCase();
            if(targetId) showPanel(targetId);
        };
        btn.addEventListener('click', action);
        btn.addEventListener('touchstart', action, { passive: false });
    });

    // Sürprizi Başlat butonu
    document.getElementById('btnSurprise')?.addEventListener('click', () => {
        showPanel('gallery');
        createConfetti();
    });

    // --- GALERİ OLUŞTURMA ---
    function buildGallery() {
        const grid = document.getElementById('galleryGrid');
        if(!grid) return;
        grid.innerHTML = '';
        grid.style.cssText = "display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px; padding:20px;";

        mediaFiles.forEach(file => {
            const card = document.createElement('div');
            card.style.cssText = "background:#111; border-radius:20px; overflow:hidden; border:1px solid #ff69b4; box-shadow: 0 10px 20px rgba(0,0,0,0.4);";
            
            if(file.type === 'image') {
                card.innerHTML = `<img src="${file.src}" style="width:100%; display:block; aspect-ratio:1/1; object-fit:cover;">
                                  <p style="padding:15px; color:#ffc0cb; text-align:center; font-style:italic;">${file.text}</p>`;
            } else {
                card.innerHTML = `<video src="${file.src}" controls style="width:100%; aspect-ratio:1/1; object-fit:cover;"></video>
                                  <p style="padding:15px; color:#ffc0cb; text-align:center; font-weight:bold;">${file.text}</p>`;
            }
            grid.appendChild(card);
        });
    }

    // --- SEVGİ BARI (HIZLI VE HEYECANLI) ---
    const barFill = document.getElementById('love-bar-fill');
    const loveMsg = document.getElementById('message-display');
    const loveSide = document.getElementById('loveSideContent');
    let loveVal = 0, loveDir = 1, loveRunning = false, loveRaf;

    function resetLoveGame() {
        loveVal = 0; loveRunning = false;
        if(barFill) barFill.style.transform = `scaleY(0)`;
        loveMsg.innerHTML = "Gül'üm, Muhammet seni ne kadar seviyor?<br>Ölçmek için BAS!";
    }

    function loveTick() {
        if (!loveRunning) return;
        loveVal += (3 + (loveVal / 25)) * loveDir; // Hızlı oyun hissi
        if (loveVal >= 100) { loveVal = 100; loveDir = -1; }
        else if (loveVal <= 0) { loveVal = 0; loveDir = 1; }
        if (barFill) barFill.style.transform = `scaleY(${loveVal / 100})`;
        loveRaf = requestAnimationFrame(loveTick);
    }

    function loadLoveContent() {
        if (loveSide) {
            loveSide.innerHTML = `
                <div style="color:#ff69b4; font-weight:bold; font-size:1.2rem; margin-bottom:10px; text-align:center;">Sana olan aşkım sonsuz!</div>
                <video src="media/gulobebek.mp4" autoplay muted loop playsinline style="width:100%; border-radius:15px; border:2px solid #ff69b4;"></video>
            `;
        }
    }

    // --- FLAPPY GÜLÇİN (YUVARLAK KARAKTER) ---
    const canvas = document.getElementById('flappyCanvas');
    let ctx, flappy = { running: false, pipes: [] };
    const birdImg = new Image(); 
    birdImg.src = 'media/flappy_gulcin.png'; // Senin yüklediğin logo

    function resizeFlappy() {
        if (!canvas) return;
        canvas.width = canvas.parentElement.clientWidth || 320;
        canvas.height = 480;
        ctx = canvas.getContext('2d');
    }

    function resetFlappy() {
        flappy = { y: 240, vy: 0, g: 0.35, score: 0, running: false, pipes: [], timer: 0 };
        drawFlappy();
    }

    function drawFlappy() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // --- YUVARLAK KARAKTER ---
        ctx.save();
        ctx.beginPath();
        // Gülçin'in yüzünü tam daire içine alıyoruz
        ctx.arc(65, flappy.y + 15, 25, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip(); // Resmi yuvarlak kes
        if(birdImg.complete) {
            ctx.drawImage(birdImg, 40, flappy.y - 10, 50, 50);
        } else {
            ctx.fillStyle = "#ff69b4"; ctx.fill();
        }
        ctx.restore();
        
        // Dışına pembe halka
        ctx.strokeStyle = "#ff69b4"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(65, flappy.y + 15, 26, 0, Math.PI * 2); ctx.stroke();

        // Borular (Pipes)
        flappy.pipes.forEach(p => {
            ctx.fillStyle = "#4ade80";
            ctx.fillRect(p.x, 0, 50, p.top);
            ctx.fillRect(p.x, p.top + 160, 50, canvas.height);
        });

        ctx.fillStyle = "white"; ctx.font = "bold 20px Arial";
        ctx.fillText("Skor: " + flappy.score, 15, 30);
        if(!flappy.running) {
            ctx.textAlign = "center";
            ctx.fillText("Uçurmak için bas Gül'üm!", canvas.width/2, canvas.height/2);
        }
    }

    function flappyTick() {
        if (!flappy.running) return;
        flappy.vy += flappy.g;
        flappy.y += flappy.vy;
        flappy.timer++;
        if (flappy.timer % 90 === 0) {
            flappy.pipes.push({ x: canvas.width, top: Math.random() * (canvas.height - 250) + 50 });
        }
        flappy.pipes.forEach(p => {
            p.x -= 3;
            if (65+20 > p.x && 45 < p.x+50 && (flappy.y < p.top || flappy.y+30 > p.top+160)) flappy.running = false;
            if (p.x === 50) flappy.score++;
        });
        flappy.pipes = flappy.pipes.filter(p => p.x > -60);
        if (flappy.y > canvas.height || flappy.y < 0) flappy.running = false;
        drawFlappy();
        if (flappy.running) requestAnimationFrame(flappyTick);
    }

    // --- MERKEZİ GİRİŞ (TOUCH + CLICK) ---
    function handleAction(e) {
        if (e.target.closest('.btn') || e.target.closest('aside')) return;
        
        // Sevgi Barı İşlemi
        if (document.getElementById('lovePanel')?.style.display === 'block') {
            if (!loveRunning) { 
                loveRunning = true; loveTick(); 
                loveMsg.innerText = "DURDUR!";
            } else {
                loveRunning = false; cancelAnimationFrame(loveRaf);
                const s = Math.floor(loveVal);
                loveMsg.innerHTML = `<span style="font-size:1.8rem; color:#ff69b4;">%${s} Aşk</span><br>${s > 90 ? 'Muhammet sana deli gibi aşık Gülçin!' : 'Seni çok seviyorum!'}`;
                createConfetti();
            }
        }
        // Flappy İşlemi
        if (document.getElementById('flappyPanel')?.style.display === 'block') {
            if (!flappy.running) { resetFlappy(); flappy.running = true; flappyTick(); }
            else { flappy.vy = -6.5; }
        }
    }

    window.addEventListener('pointerdown', handleAction);
    window.addEventListener('keydown', (e) => { if(e.code === 'Space') handleAction(e); });

    function createConfetti() {
        for (let i = 0; i < 30; i++) {
            const c = document.createElement('div');
            c.style.cssText = `position:fixed; left:50%; top:50%; width:10px; height:10px; background:#ff69b4; border-radius:50%; z-index:9999;`;
            document.body.appendChild(c);
            const a = Math.random()*Math.PI*2, d = Math.random()*120;
            c.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.cos(a)*d}vw,${Math.sin(a)*d}vh)`,opacity:0}], 1200).onfinish = () => c.remove();
        }
    }

    showPanel('home');
});
