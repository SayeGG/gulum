window.addEventListener('load', () => {
    // Giriş Animasyonu
    setTimeout(() => document.body.classList.remove("not-loaded"), 500);

    // --- DEĞİŞKENLER VE AYARLAR ---
    let lastInputTime = 0;
    const romantikSozler = [
        "Gülüşün dünyamı aydınlatıyor Gül'üm...", "Her anımda sen varsın birtanem.",
        "Seninle hayat bir başka güzel Gülçin'im.", "Muhammet sana her gün yeniden aşık oluyor.",
        "Kalbimin tek sahibi, canım eşim.", "Gözlerin en güzel manzaram.",
        "Seninle yaşlanmak tek hayalim.", "İyiki benimsin, iyiki eşimsin.",
        "Ruhumun eşi, kalbimin neşesi.", "Gül yüzlüm, her şeyim.",
        "Ömrümün en güzel hikayesi sensin.", "Sen benim sol yanım, can parçamsın.",
        "Sonsuza kadar sadece seninle...", "Hayat seninle anlam kazanıyor.",
        "Sana olan sevgim hiç bitmeyecek.", "Dünyanın en güzel annesi/eşi..."
    ];

    // 1-16 arası resimler + video
    const mediaFiles = [];
    for(let i=1; i<=16; i++) { 
        mediaFiles.push({ type: 'image', src: `media/${i}.jpeg`, text: romantikSozler[i-1] || "Seni çok seviyorum!" }); 
    }
    mediaFiles.push({ type: 'video', src: 'media/gulobebek.mp4', text: "Gül'üm senin o güzel hallerine kurban olurum!" });

    // --- PANEL (SEKME) SİSTEMİ ---
    function showPanel(id) {
        // Tüm panelleri kapat
        document.querySelectorAll('.main > div, #panel > div').forEach(p => p.style.display = 'none');
        
        // Hedef paneli bul ve aç
        const target = document.getElementById(id + 'Panel') || document.getElementById(id);
        if (target) {
            target.style.display = 'block';
            if (id === 'gallery') buildGallery();
            if (id === 'love') { loadLoveContent(); resetLoveGame(); }
            if (id === 'flappy') { resizeFlappy(); resetFlappy(); }
            
            // Sidebar'daki başlığı güncelle
            const brand = document.querySelector('.brand');
            if(brand) brand.innerText = "Canım Gülçin 💖";
        }
    }

    // Buton Bağlantıları (Hem ID hem data-target kontrolü)
    document.querySelectorAll('[data-target], .sidebar .btn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target') || btn.id.replace('btn', '').toLowerCase();
            if(targetId) showPanel(targetId);
        };
    });

    // Sürpriz Butonu Özel
    document.getElementById('btnSurprise')?.addEventListener('click', () => {
        showPanel('gallery');
        createConfetti();
    });

    // --- GALERİ İNŞA ETME ---
    function buildGallery() {
        const gal = document.getElementById('galleryPanel') || document.getElementById('gallery');
        if(!gal) return;
        gal.innerHTML = '<h2 class="playfair" style="text-align:center; color:#ff69b4; margin-bottom:20px;">Anılarımız ve Gül'üm</h2><div id="g-grid"></div>';
        const grid = document.getElementById('g-grid');
        grid.style.cssText = "display:grid; grid-template-columns:1fr; gap:25px; padding:10px;";

        mediaFiles.forEach(file => {
            const card = document.createElement('div');
            card.className = "gallery-card";
            card.style.cssText = "background:#111; border-radius:15px; overflow:hidden; border:1px solid #ff69b4; box-shadow:0 10px 20px rgba(0,0,0,0.5);";
            
            if(file.type === 'image') {
                card.innerHTML = `<img src="${file.src}" style="width:100%; display:block;"><p style="padding:15px; color:#ffc0cb; text-align:center; font-style:italic;">${file.text}</p>`;
            } else {
                card.innerHTML = `<video src="${file.src}" controls style="width:100%;"></video><p style="padding:15px; color:#ffc0cb; text-align:center; font-weight:bold;">${file.text}</p>`;
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
        loveMsg.innerHTML = "Gül'üm, Muhammet seni ne kadar seviyor?<br>Ölçmek için dokun veya tıkla!";
    }

    function loveTick() {
        if (!loveRunning) return;
        loveVal += (2.5 + (loveVal / 30)) * loveDir; // Hızlı ve heyecanlı
        if (loveVal >= 100) { loveVal = 100; loveDir = -1; }
        else if (loveVal <= 0) { loveVal = 0; loveDir = 1; }
        if (barFill) barFill.style.transform = `scaleY(${loveVal / 100})`;
        loveRaf = requestAnimationFrame(loveTick);
    }

    function loadLoveContent() {
        if (loveSide) {
            loveSide.innerHTML = `
                <div id="love-status" style="color:#ff69b4; font-weight:bold; font-size:1.1rem; margin-bottom:10px; text-align:center;">Canım eşim Gülçin'im...</div>
                <video src="media/gulobebek.mp4" autoplay muted loop playsinline style="width:100%; border-radius:15px; border:2px solid #ff69b4;"></video>
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
        canvas.height = 480;
        ctx = canvas.getContext('2d');
    }

    function resetFlappy() {
        flappy = { y: 240, vy: 0, g: 0.35, score: 0, running: false, pipes: [], timer: 0 };
        drawFlappy();
    }

    function drawFlappy() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Yuvarlak Gülçin
        ctx.save();
        ctx.beginPath();
        ctx.arc(65, flappy.y + 15, 25, 0, Math.PI * 2);
        ctx.clip();
        if(birdImg.complete) ctx.drawImage(birdImg, 40, flappy.y - 10, 50, 50);
        else { ctx.fillStyle = "#ff69b4"; ctx.fill(); }
        ctx.restore();
        
        // Bloklar
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

    // --- MERKEZİ GİRİŞ (MOUSE + TOUCH) ---
    function handleAction(e) {
        // Eğer tıklanan şey bir buton ise veya sidebar ise oyun işlemine girme
        if (e.target.closest('.btn') || e.target.closest('aside')) return;
        
        const now = Date.now();
        if (now - lastInputTime < 150) return;
        lastInputTime = now;

        // Sevgi Barı
        if (document.getElementById('lovePanel')?.style.display === 'block') {
            if (!loveRunning) { loveRunning = true; loveTick(); loveMsg.innerText = "DURDUR!"; }
            else { 
                loveRunning = false; cancelAnimationFrame(loveRaf); 
                const s = Math.floor(loveVal);
                loveMsg.innerHTML = `<span style="font-size:1.5rem; color:#ff69b4;">%${s} Aşk</span><br>${s > 90 ? 'Muhammet sana deli gibi aşık Gülçin!' : 'Seni çok seviyorum!'}`;
                createConfetti();
            }
        }
        // Flappy
        if (document.getElementById('flappyPanel')?.style.display === 'block') {
            if (!flappy.running) { resetFlappy(); flappy.running = true; flappyTick(); }
            else { flappy.vy = -6; }
        }
    }

    // Tıklama ve Dokunma Olaylarını Dinle
    window.addEventListener('mousedown', handleAction); // PC için
    window.addEventListener('touchstart', (e) => { handleAction(e); }, { passive: false }); // Telefon için
    window.addEventListener('keydown', (e) => { if(e.code === 'Space') handleAction(e); });

    function createConfetti() {
        for (let i = 0; i < 30; i++) {
            const c = document.createElement('div');
            c.style.cssText = `position:fixed; left:50%; top:50%; width:8px; height:8px; background:#ff69b4; border-radius:50%; z-index:9999;`;
            document.body.appendChild(c);
            const a = Math.random()*Math.PI*2, d = Math.random()*100;
            c.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.cos(a)*d}vw,${Math.sin(a)*d}vh)`,opacity:0}], 1000).onfinish = () => c.remove();
        }
    }

    // Başlangıç Sayfası
    showPanel('home');
});
