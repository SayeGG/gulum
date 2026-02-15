window.addEventListener('load', () => {
    // 1. Ateş Böcekleri
    const fBox = document.querySelector('.fireflies');
    for(let i=0; i<15; i++) {
        const f = document.createElement('div');
        f.className = 'firefly';
        f.style.left = Math.random()*100+'vw';
        f.style.animationDuration = (Math.random()*10+5)+'s';
        f.style.animationDelay = Math.random()*5+'s';
        fBox.appendChild(f);
    }

    // 2. Medya Verileri (Hepsini Ekledim)
    const mediaItems = [];
    for(let i=1; i<=16; i++) {
        mediaItems.push({ src: `media/${i}.jpeg`, text: `Anı #${i}: Seni her şeyden çok seviyorum Gül'üm.` });
    }
    mediaItems.push({ src: 'media/gulobebek.mp4', text: "Senin o hallerine kurban olurum!", type: 'video' });

    const loveQuotes = [
        "Dünyanın en güzel gülen kadınına...",
        "Kalbimin her atışı senin için Gülçin.",
        "Seninle hayat bir bayram tadında.",
        "İyiki benim eşimsin, iyiki varsın.",
        "Ömrümün sonuna kadar sadece sen.",
        "Sen benim en güzel duamsın.",
        "Gözlerine bakınca dünyayı unutuyorum."
    ];

    let currentIdx = 0;

    // 3. Panel Yönetimi
    function showPanel(id) {
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById(id + 'Panel').classList.add('active');
        if(id === 'gallery') buildGallery();
        if(id === 'flappy') initFlappy();
    }

    document.querySelectorAll('[data-panel]').forEach(btn => {
        btn.onclick = () => showPanel(btn.getAttribute('data-panel'));
    });

    document.getElementById('startSurprise').onclick = () => {
        currentIdx = 0; showPanel('surprise'); updateSlideshow();
    };

    // 4. Slayt Sistemi
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

    // 5. Galeri
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

    // 6. Sevgi Ölçer + Sözler
    let loveVal = 0, isPlaying = false, raf;
    const fill = document.getElementById('meterFill');
    const status = document.getElementById('loveStatus');
    const quoteBox = document.getElementById('loveQuote');

    function runMeter() {
        if(!isPlaying) return;
        loveVal += 4; if(loveVal > 100) loveVal = 0;
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

    // 7. Flappy Gülçin (Fixlendi)
    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');
    let b, p, s, active = false;

    function initFlappy() {
        canvas.width = 320; canvas.height = 400;
        b = { y: 200, v: 0 }; p = []; s = 0; active = true;
        flappyLoop();
    }

    function flappyLoop() {
        if(!active) return;
        ctx.clearRect(0,0,320,400);
        b.v += 0.25; b.y += b.v;
        ctx.fillStyle = "pink"; ctx.beginPath(); ctx.arc(50, b.y, 15, 0, Math.PI*2); ctx.fill();

        if(p.length === 0 || p[p.length-1].x < 150) p.push({ x: 320, h: Math.random()*150+50 });
        p.forEach((pipe, i) => {
            pipe.x -= 2;
            ctx.fillStyle = "#555";
            ctx.fillRect(pipe.x, 0, 40, pipe.h);
            ctx.fillRect(pipe.x, pipe.h+100, 40, 400);
            if(pipe.x < 65 && pipe.x > 15 && (b.y < pipe.h || b.y > pipe.h+100)) active = false;
            if(pipe.x === 50) s++;
        });
        p = p.filter(x => x.x > -40);
        ctx.fillStyle = "white"; ctx.fillText("Puan: "+s, 10, 20);
        if(b.y > 400 || b.y < 0) active = false;
        if(active) requestAnimationFrame(flappyLoop);
        else ctx.fillText("YANDIN! TIKLA", 120, 200);
    }

    canvas.onpointerdown = (e) => { 
        e.preventDefault();
        if(!active) initFlappy(); else b.v = -5; 
    };

    document.body.classList.remove("not-loaded");
});
