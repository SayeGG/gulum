window.addEventListener('load', () => {
    // 1. Ateş Böcekleri
    const fBox = document.querySelector('.fireflies');
    for(let i=0; i<15; i++) {
        const f = document.createElement('div');
        f.className = 'firefly';
        f.style.left = Math.random()*100+'vw';
        f.style.animationDuration = (Math.random()*8+5)+'s';
        f.style.animationDelay = Math.random()*5+'s';
        fBox.appendChild(f);
    }

    // 2. Medya Verileri (16 Foto + Video)
    const mediaItems = [];
    for(let i=1; i<=16; i++) {
        mediaItems.push({ src: `media/${i}.jpeg`, text: `Seni her halinle çok seviyorum Gül'üm.` });
    }
    mediaItems.push({ src: 'media/gulobebek.mp4', text: "Canım karım, her şeyim!", type: 'video' });

    const loveQuotes = [
        "Sen benim en güzel manzaramsın.",
        "Kalbimin tek sahibi Gülçin'im.",
        "İyiki benimsin, iyiki eşimsin.",
        "Dünyanın en güzel gülen kadını.",
        "Sana her gün yeniden aşık oluyorum.",
        "Ömrümün en güzel hikayesi seninle.",
        "Gülüşüne kurban olduğum..."
    ];

    let currentIdx = 0;

    // 3. Panel Geçişleri
    function showPanel(id) {
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById(id + 'Panel').classList.add('active');
        if(id === 'gallery') buildGallery();
    }

    document.querySelectorAll('[data-panel]').forEach(btn => {
        btn.onclick = () => showPanel(btn.getAttribute('data-panel'));
    });

    document.getElementById('startSurprise').onclick = () => {
        currentIdx = 0; showPanel('surprise'); updateSlideshow();
    };

    // 4. Slayt Gösterisi
    function updateSlideshow() {
        const item = mediaItems[currentIdx];
        const img = document.getElementById('mainImage');
        const vid = document.getElementById('mainVideo');
        const cap = document.getElementById('mediaCaption');
        if(item.type === 'video') {
            img.style.display='none'; vid.style.display='block'; vid.src=item.src; vid.play();
        } else {
            vid.style.display='none'; img.style.display='block'; img.src=item.src;
        }
        cap.innerText = item.text;
    }

    document.getElementById('nextBtn').onclick = () => { currentIdx = (currentIdx+1)%mediaItems.length; updateSlideshow(); };
    document.getElementById('prevBtn').onclick = () => { currentIdx = (currentIdx-1+mediaItems.length)%mediaItems.length; updateSlideshow(); };
    document.getElementById('closeBtn').onclick = () => showPanel('home');

    // 5. Galeri Oluşturma
    function buildGallery() {
        const grid = document.getElementById('galleryGrid');
        grid.innerHTML = '';
        mediaItems.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'grid-item';
            div.innerHTML = item.type === 'video' ? '<div style="background:#333;height:100%;display:flex;align-items:center;justify-content:center">🎥</div>' : `<img src="${item.src}">`;
            div.onclick = () => { currentIdx = i; showPanel('surprise'); updateSlideshow(); };
            grid.appendChild(div);
        });
    }

    // 6. Sevgi Ölçer
    let loveVal = 0, isPlaying = false, raf;
    const fill = document.getElementById('meterFill');
    const status = document.getElementById('loveStatus');
    const quoteBox = document.getElementById('loveQuote');

    function runMeter() {
        if(!isPlaying) return;
        loveVal += 4.5; if(loveVal > 100) loveVal = 0;
        fill.style.height = loveVal + '%';
        raf = requestAnimationFrame(runMeter);
    }

    window.addEventListener('pointerdown', (e) => {
        if(!document.getElementById('lovePanel').classList.contains('active')) return;
        if(e.target.closest('.sidebar')) return;

        if(!isPlaying) {
            isPlaying = true; status.innerText = "DURDUR"; runMeter();
            quoteBox.style.opacity = 0;
        } else {
            isPlaying = false; cancelAnimationFrame(raf);
            status.innerText = "%" + Math.floor(loveVal);
            quoteBox.innerText = loveQuotes[Math.floor(Math.random()*loveQuotes.length)];
            quoteBox.style.opacity = 1;
        }
    });

    // 7. Flappy Gülçin (Kesin Tamir)
    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');
    let b = {y:200, v:0}, pipes = [], score = 0, gameActive = false;

    function initFlappy() {
        canvas.width = 300; canvas.height = 400;
        b = {y:200, v:0}; pipes = []; score = 0; gameActive = true;
        flappyLoop();
    }

    function flappyLoop() {
        if(!gameActive) return;
        ctx.clearRect(0,0,300,400);
        b.v += 0.25; b.y += b.v;
        ctx.fillStyle = "pink"; ctx.beginPath(); ctx.arc(50, b.y, 12, 0, Math.PI*2); ctx.fill();

        if(pipes.length === 0 || pipes[pipes.length-1].x < 150) {
            pipes.push({ x: 300, h: Math.random()*150+50 });
        }

        pipes.forEach(p => {
            p.x -= 2;
            ctx.fillStyle = "#555";
            ctx.fillRect(p.x, 0, 40, p.h);
            ctx.fillRect(p.x, p.h+100, 40, 400);
            if(p.x < 62 && p.x > 38 && (b.y < p.h || b.y > p.h+100)) gameActive = false;
            if(p.x === 50) score++;
        });
        pipes = pipes.filter(p => p.x > -40);
        ctx.fillStyle = "white"; ctx.fillText("Puan: "+score, 10, 20);
        if(b.y > 400 || b.y < 0) gameActive = false;
        
        if(gameActive) requestAnimationFrame(flappyLoop);
        else { ctx.fillStyle = "white"; ctx.fillText("YANDIN! DOKUN VE BAŞLA", 80, 200); }
    }

    canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if(!gameActive) initFlappy(); else b.v = -5;
    });

    document.body.classList.remove("not-loaded");
});
