window.addEventListener('load', () => {
    // Fotoğraflar (Hepsini tek tek yazdım)
    const media = [
        {src:'media/1.jpeg'}, {src:'media/2.jpeg'}, {src:'media/3.jpeg'}, {src:'media/4.jpeg'},
        {src:'media/5.jpeg'}, {src:'media/6.jpeg'}, {src:'media/7.jpeg'}, {src:'media/8.jpeg'},
        {src:'media/9.jpeg'}, {src:'media/10.jpeg'}, {src:'media/11.jpeg'}, {src:'media/12.jpeg'},
        {src:'media/13.jpeg'}, {src:'media/14.jpeg'}, {src:'media/15.jpeg'}, {src:'media/16.jpeg'},
        {src:'media/gulobebek.mp4', type:'video'}
    ];

    const quotes = ["Gülüşün cennet...", "Seni çok seviyorum", "Her şeyimsin", "Dünyam seninle güzel", "Kalbimin tek sahibi"];
    let idx = 0;

    // Panel Geçişleri
    function openPanel(id) {
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById(id + 'Panel').classList.add('active');
        if(id === 'flappy') startFlappy();
    }

    document.querySelectorAll('[data-panel]').forEach(b => {
        b.onclick = () => openPanel(b.getAttribute('data-panel'));
    });

    document.getElementById('startSurprise').onclick = () => { idx=0; openPanel('surprise'); updateMedia(); };

    // Slayt Güncelleme
    function updateMedia() {
        const item = media[idx];
        const img = document.getElementById('mainImage');
        const vid = document.getElementById('mainVideo');
        if(item.type === 'video') {
            img.style.display='none'; vid.style.display='block'; vid.src=item.src; vid.play();
        } else {
            vid.style.display='none'; img.style.display='block'; img.src=item.src;
        }
    }

    document.getElementById('nextBtn').onclick = () => { idx=(idx+1)%media.length; updateMedia(); };
    document.getElementById('prevBtn').onclick = () => { idx=(idx-1+media.length)%media.length; updateMedia(); };
    document.getElementById('closeBtn').onclick = () => openPanel('home');

    // Sevgi Ölçer Mantığı
    let val = 0, active = false, raf;
    const fill = document.getElementById('meterFill');
    const qBox = document.getElementById('loveQuote');

    function tick() {
        if(!active) return;
        val += 5; if(val > 100) val = 0;
        fill.style.height = val + '%';
        raf = requestAnimationFrame(tick);
    }

    window.addEventListener('pointerdown', (e) => {
        if(!document.getElementById('lovePanel').classList.contains('active')) return;
        if(e.target.closest('.sidebar')) return;
        if(!active) {
            active = true; tick(); qBox.style.opacity = 0;
        } else {
            active = false; cancelAnimationFrame(raf);
            qBox.innerText = quotes[Math.floor(Math.random()*quotes.length)] + " %" + Math.floor(val);
            qBox.style.opacity = 1;
        }
    });

    // Flappy Fix
    function startFlappy() {
        const c = document.getElementById('flappyCanvas');
        const ctx = c.getContext('2d');
        c.width = 300; c.height = 400;
        let by = 200, bv = 0, pipes = [], score = 0, run = true;
        
        function loop() {
            if(!run) return;
            ctx.clearRect(0,0,300,400);
            bv += 0.2; by += bv;
            ctx.fillStyle = "#ff4d94"; ctx.beginPath(); ctx.arc(40, by, 10, 0, 7); ctx.fill();
            if(pipes.length===0 || pipes[pipes.length-1].x < 150) pipes.push({x:300, h:Math.random()*200+50});
            pipes.forEach(p => {
                p.x -= 2; ctx.fillStyle="#333"; ctx.fillRect(p.x, 0, 30, p.h); ctx.fillRect(p.x, p.h+100, 30, 400);
                if(p.x < 50 && p.x > 30 && (by < p.h || by > p.h+100)) run = false;
                if(p.x === 40) score++;
            });
            pipes = pipes.filter(p => p.x > -30);
            ctx.fillStyle="#fff"; ctx.fillText("Puan: " + score, 10, 20);
            if(by > 400 || by < 0) run = false;
            if(run) requestAnimationFrame(loop);
            else ctx.fillText("YANDIN - TIKLA", 100, 200);
        }
        c.onpointerdown = (e) => { e.preventDefault(); if(!run) startFlappy(); else bv = -4; };
        loop();
    }

    document.body.classList.remove("not-loaded");
});
