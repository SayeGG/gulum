window.addEventListener('load', () => {
    // Gülçin'in fotoğrafını oyun karakteri yapmak için hazırlıyoruz
    const birdImg = new Image();
    birdImg.src = 'media/1.jpeg'; 

    const media = [];
    for(let i=1; i<=16; i++) { media.push({src: `media/${i}.jpeg`}); }
    media.push({src: 'media/gulobebek.mp4', type: 'video'});

    const quotes = ["Seninle her an çok özel.", "Kalbimin sahibi Gülçin...", "Gülüşün ömre bedel.", "İyiki varsın sevgilim.", "Seni her gün daha çok seviyorum."];
    let idx = 0;

    // Panel Yönetimi
    function show(id) {
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById(id + 'Panel').classList.add('active');
        if(id === 'gallery') buildGallery();
        if(id === 'flappy') startFlappy();
    }

    document.querySelectorAll('[data-panel]').forEach(b => b.onclick = () => show(b.getAttribute('data-panel')));
    document.getElementById('startSurprise').onclick = () => { idx=0; show('surprise'); updateMedia(); };

    function updateMedia() {
        const item = media[idx];
        const iEl = document.getElementById('mainImage');
        const vEl = document.getElementById('mainVideo');
        if(item.type === 'video') { iEl.style.display='none'; vEl.style.display='block'; vEl.src=item.src; vEl.play(); }
        else { vEl.style.display='none'; iEl.style.display='block'; iEl.src=item.src; }
    }

    document.getElementById('nextBtn').onclick = () => { idx=(idx+1)%media.length; updateMedia(); };
    document.getElementById('prevBtn').onclick = () => { idx=(idx-1+media.length)%media.length; updateMedia(); };
    document.getElementById('closeBtn').onclick = () => show('home');

    function buildGallery() {
        const grid = document.getElementById('galleryGrid');
        grid.innerHTML = '';
        media.forEach((m, i) => {
            if(m.type !== 'video') {
                const img = document.createElement('img');
                img.src = m.src;
                img.onclick = () => { idx=i; show('surprise'); updateMedia(); };
                grid.appendChild(img);
            }
        });
    }

    // Sevgi Ölçer
    let val = 0, active = false, raf;
    const fill = document.getElementById('meterFill'), qBox = document.getElementById('loveQuote');
    function run() { if(!active) return; val += 4; if(val > 100) val = 0; fill.style.height = val + '%'; raf = requestAnimationFrame(run); }

    window.onpointerdown = (e) => {
        if(!document.getElementById('lovePanel').classList.contains('active')) return;
        if(e.target.closest('.sidebar')) return;
        if(!active) { active = true; run(); qBox.style.opacity = 0; }
        else { active = false; cancelAnimationFrame(raf); qBox.innerText = quotes[Math.floor(Math.random()*quotes.length)] + " %" + Math.floor(val); qBox.style.opacity = 1; }
    };

    // Flappy Gülçin (FOTOĞRAFLI)
    function startFlappy() {
        const c = document.getElementById('flappyCanvas');
        const ctx = c.getContext('2d');
        c.width = 300; c.height = 400;
        let y = 200, v = 0, p = [], s = 0, run = true;

        function loop() {
            if(!run) return;
            ctx.clearRect(0,0,300,400);
            v += 0.25; y += v;
            
            // Gülçin'in resmini yuvarlak içine çizme
            ctx.save();
            ctx.beginPath();
            ctx.arc(50, y, 18, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(birdImg, 32, y - 18, 36, 36);
            ctx.restore();
            ctx.strokeStyle = "#ff4d94"; ctx.lineWidth = 2; ctx.stroke();

            if(p.length === 0 || p[p.length-1].x < 150) p.push({x:300, h:Math.random()*200+50});
            p.forEach(pipe => {
                pipe.x -= 2; ctx.fillStyle="#444";
                ctx.fillRect(pipe.x, 0, 35, pipe.h);
                ctx.fillRect(pipe.x, pipe.h+110, 35, 400);
                if(pipe.x < 65 && pipe.x > 35 && (y < pipe.h || y > pipe.h+110)) run = false;
                if(pipe.x === 50) s++;
            });
            p = p.filter(pipe => pipe.x > -40);
            ctx.fillStyle="#fff"; ctx.font="16px Arial"; ctx.fillText("Puan: "+s, 10, 25);
            if(y > 400 || y < 0) run = false;
            if(run) requestAnimationFrame(loop);
            else { ctx.fillStyle="#fff"; ctx.fillText("YANDIN! DOKUN", 100, 200); }
        }
        c.onpointerdown = (e) => { e.preventDefault(); if(!run) startFlappy(); else v = -5; };
        loop();
    }

    document.body.classList.remove("not-loaded");
});
