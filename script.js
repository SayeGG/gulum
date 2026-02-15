window.addEventListener('load', () => {
    // Sayfa yükleme animasyonu (Gül simgesi)
    setTimeout(() => document.body.classList.remove("not-loaded"), 500);

    // --- ÖZEL VERİLER VE SÖZLER ---
    const romantikSozler = [
        "Gülüşün dünyamı aydınlatıyor Gül'üm...", "Her anımda sen varsın canım eşim.",
        "Seninle hayat bir başka güzel Gülçin'im.", "Muhammet sana her gün yeniden aşık oluyor.",
        "Kalbimin tek sahibi, bir tanem.", "Gözlerin en güzel manzaram benim.",
        "Seninle yaşlanmak tek hayalim Gül'üm.", "İyiki benimsin, iyiki eşimsin.",
        "Ruhumun eşi, kalbimin neşesi...", "Gül yüzlüm, her şeyim sensin.",
        "Ömrümün en güzel hikayesi seninle başladı.", "Sen benim sol yanım, can parçamsın.",
        "Sonsuza kadar sadece seninle Gülçin'im.", "Hayat seninle anlam kazanıyor birtanem.",
        "Sana olan sevgim hiç bitmeyecek Gül'üm.", "Dünyanın en güzel kalbi sende...",
        "Gülçin & Muhammet: Sonsuz Aşk ❤️"
    ];

    const mediaFiles = [];
    for(let i=1; i<=16; i++) { 
        mediaFiles.push({ src: `media/${i}.jpeg`, text: romantikSozler[i-1] }); 
    }
    mediaFiles.push({ src: 'media/gulobebek.mp4', text: "Senin o güzel hallerine kurban olurum Gül'üm!", type: 'video' });

    // --- PANEL SİSTEMİ (TIKLAMA SORUNUNU ÇÖZEN KISIM) ---
    function showPanel(id) {
        // Tüm panelleri kapat (main içindekiler dahil)
        document.querySelectorAll('.main > div, #panel > div').forEach(p => p.style.display = 'none');
        
        const target = document.getElementById(id + 'Panel') || document.getElementById(id);
        if (target) {
            target.style.display = 'block';
            if (id === 'gallery') buildGallery();
            if (id === 'love') { resetLoveGame(); loadLoveVideo(); }
            if (id === 'flappy') { resizeFlappy(); resetFlappy(); }
        }
    }

    // Buton Dinleyicileri (Hem PC hem Mobil için en garantisi)
    document.querySelectorAll('[data-target], #btnSurprise').forEach(btn => {
        const handleBtn = (e) => {
            e.preventDefault(); e.stopPropagation();
            const target = btn.getAttribute('data-target') || 'gallery';
            showPanel(target);
            if(btn.id === 'btnSurprise') createConfetti();
        };
        btn.addEventListener('click', handleBtn);
        btn.addEventListener('touchstart', handleBtn, { passive: false });
    });

    // --- GALERİ VE SÜRPRİZ SEKMESİ ---
    function buildGallery() {
        const gal = document.getElementById('galleryPanel') || document.getElementById('gallery');
        if(!gal) return;
        gal.innerHTML = '<h2 class="playfair" style="text-align:center; color:#ff69b4; margin-bottom:20px;">Gülçin\'im İçin Anılarımız</h2><div class="g-grid"></div>';
        const grid = gal.querySelector('.g-grid');
        grid.style.cssText = "display:grid; grid-template-columns:1fr; gap:25px; padding:10px;";

        mediaFiles.forEach(file => {
            const card = document.createElement('div');
            card.style.cssText = "background:#111; border-radius:15px; overflow:hidden; border:1px solid #ff69b4;";
            
            if(file.type === 'video') {
                card.innerHTML = `<video src="${file.src}" controls style="width:100%;"></video><p style="padding:15px; color:#ffc0cb; text-align:center;">${file.text}</p>`;
            } else {
                card.innerHTML = `<img src="${file.src}" style="width:100%; display:block;"><p style="padding:15px; color:#ffc0cb; text-align:center; font-style:italic;">${file.text}</p>`;
            }
            grid.appendChild(card);
        });
    }

    // --- SEVGİ OYUNU (HIZLI VE DİNAMİK) ---
    const barFill = document.getElementById('love-bar-fill');
    const loveMsg = document.getElementById('message-display');
    const loveSide = document.getElementById('loveSideContent');
    let loveVal = 0, loveDir = 1, loveRunning = false, loveRaf;

    function resetLoveGame() {
        loveVal = 0; loveRunning = false;
        if(barFill) barFill.style.transform = `scaleY(0)`;
        loveMsg.innerHTML = "Gül'üm seni ne kadar seviyor?<br>Ölçmek için BAS!";
    }

    function loveTick() {
        if (!loveRunning) return;
        loveVal += (2.8 + (loveVal / 35)) * loveDir; // Hızlı hareket
        if (loveVal >= 100) { loveVal = 100; loveDir = -1; }
        else if (loveVal <= 0) { loveVal = 0; loveDir = 1; }
        if (barFill) barFill.style.transform = `scaleY(${loveVal / 100})`;
        loveRaf = requestAnimationFrame(loveTick);
    }

    function loadLoveVideo() {
        if (loveSide) {
            loveSide.innerHTML = `
                <div id="dynamic-quote" style="color:#ff69b4; font-weight:bold; height:40px; text-align:center; margin-bottom:10px;">Seni dünyalar kadar seviyorum Gülçin'im!</div>
                <video src="media/gulobebek.mp4" autoplay muted loop playsinline style="width:100%; border-radius:15px; border:2px solid #ff69b4;"></video>
            `;
        }
    }

    // --- FLAPPY GÜLÇİN (YUVARLAK VE AKICI) ---
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
        // Yuvarlak Gülçin Simgesi
        ctx.save();
        ctx.beginPath();
        ctx.arc(65, flappy.y + 15, 25, 0, Math.PI * 2);
        ctx.clip();
        if(birdImg.complete) ctx.drawImage(birdImg, 40, flappy.y - 10, 50, 50);
        else { ctx.fillStyle = "#ff69b4"; ctx.fill(); }
        ctx.restore();
        ctx.strokeStyle = "#ff69b4"; ctx.lineWidth = 2; ctx.stroke();

        flappy.pipes.forEach(p => {
            ctx.fillStyle = "#4ade80";
            ctx.fillRect(p.x, 0, 50, p.top);
            ctx.fillRect(p.x, p.top + 160, 50, canvas.height);
        });

        ctx.fillStyle = "white"; ctx.font = "bold 20px Arial";
        ctx.fillText("Puan: " + flappy.score, 20, 40);
        if(!flappy.running) ctx.fillText("Başlamak için dokun Gül'üm", canvas.width/2 - 100, canvas.height/2);
    }

    function flappyTick() {
        if (!flappy.running) return;
        flappy.vy += flappy.g;
        flappy.y += flappy.vy;
        flappy.timer++;
        if (flappy.timer % 90 === 0) flappy.pipes.push({ x: canvas.width, top: Math.random() * (canvas.height - 250) + 50 });
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

    // --- MERKEZİ GİRİŞ KONTROLÜ (CLICK + TOUCH) ---
    const handleAction = (e) => {
        if (e.target.closest('button') || e.target.closest('aside')) return;
        
        // Sevgi Oyunu Kontrolü
        if (document.getElementById('lovePanel').style.display === 'block') {
            if (!loveRunning) {
                loveRunning = true; loveTick();
                loveMsg.innerText = "DURDUR!";
            } else {
                loveRunning = false; cancelAnimationFrame(loveRaf);
                const score = Math.floor(loveVal);
                loveMsg.innerHTML = `<span style="font-size:1.5rem">%${score} Aşk</span><br>Muhammet seni çok seviyor!`;
                const dq = document.getElementById('dynamic-quote');
                if(dq) dq.innerText = `%${score} - Gül'üm benim, sen Muhammet'in her şeyisin!`;
                createConfetti();
            }
        }
        // Flappy Kontrolü
        if (document.getElementById('flappyPanel').style.display === 'block') {
            if (!flappy.running) { resetFlappy(); flappy.running = true; flappyTick(); }
            else { flappy.vy = -6; }
        }
    };

    window.addEventListener('mousedown', handleAction);
    window.addEventListener('touchstart', (e) => { handleAction(e); }, { passive: false });

    function createConfetti() {
        for (let i = 0; i < 30; i++) {
            const c = document.createElement('div');
            c.style.cssText = `position:fixed; left:50%; top:50%; width:10px; height:10px; background:#ff69b4; border-radius:50%; z-index:999;`;
            document.body.appendChild(c);
            const a = Math.random()*Math.PI*2, d = Math.random()*100;
            c.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.cos(a)*d}vw,${Math.sin(a)*d}vh)`,opacity:0}], 1500).onfinish = () => c.remove();
        }
    }

    showPanel('home');
});
