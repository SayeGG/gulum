window.addEventListener('load', () => {
    // Gülçin'in yüzü (Oyun karakteri)
    const bird = new Image();
    bird.src = 'media/1.jpeg'; 

    const media = [];
    for(let i=1; i<=16; i++) { media.push({src: `media/${i}.jpeg`}); }
    media.push({src: 'media/gulobebek.mp4', type: 'video'});

    const quotes = ["Seni çok seviyorum!", "Sen benim her şeyimsin.", "Dünyam seninle güzel.", "İyiki varsın Gül'üm."];
    let idx = 0;

    // Panel Sistemi
    function show(id) {
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById(id + 'Panel').classList.add('active');
        if(id === 'gallery') buildGallery();
        if(id === 'flappy') startFlappy();
    }

    document.querySelectorAll('[data-target]').forEach(b => {
        b.onclick = () => show(b.getAttribute('data-target'));
    });

    document.getElementById('btnSurprise').onclick = () => { idx=0; show('surprise'); update(); };

    function update() {
        const item = media[idx], img = document.getElementById('displayImg'), vid = document.getElementById('displayVid');
        if(item.type === 'video') { img.style.display='none'; vid.style.display='block'; vid.src=item.src; vid.play(); }
        else { vid.style.display='none'; img.style.display='block'; img.src=item.src; }
    }

    document.getElementById('next').onclick = () => { idx=(idx+1)%media.length; update(); };
    document.getElementById('prev').onclick = () => { idx=(idx-1+media.length)%media.length; update(); };
    document.getElementById('closeMedia').onclick = () => show('home');

    function buildGallery() {
        const g = document.getElementById('gGrid'); g.innerHTML = '';
        media.forEach((m, i) => {
            if(m.type !== 'video') {
                const img = document.createElement('img'); img.src = m.src;
                img.onclick = () => { idx=i; show('surprise'); update(); };
                g.appendChild(img);
            }
        });
    }

    // Sevgi Ölçer
    let val = 0, active = false, raf;
    const fill = document.getElementById('barFill'), q = document.getElementById('quoteBox');

    window.onpointerdown = (e) => {
        if(!document.getElementById('lovePanel').classList.contains('active')) return;
        if(e.target.closest('.sidebar')) return;
        if(!active) {
            active=true; q.style.opacity=0;
            (function r(){ if(!active)return; val+=5; if(val>100)val=0; fill.style.height=val+'%'; raf=requestAnimationFrame(r); })();
        } else {
            active=false; cancelAnimationFrame(raf);
            q.innerText = quotes[Math.floor(Math.random()*quotes.length)] + " %" + Math.floor(val);
            q.style.opacity=1;
        }
    };

    // Flappy Gülçin (FOTOĞRAFLI)
    function startFlappy() {
        const cvs = document.getElementById('flappyCanvas');
        const ctx = cvs.getContext('2d');
        cvs.width = 320; cvs.height = 400;
        let y=200, v=0, pipes=[], score=0, go=true;

        function draw() {
            if(!go) return;
            ctx.clearRect(0,0,320,400);
            v += 0.25; y += v;

            // Gülçin'in kafasını çizme
            ctx.save();
            ctx.beginPath(); ctx.arc(50, y, 20, 0, Math.PI*2); ctx.clip();
            ctx.drawImage(bird, 30, y-20, 40, 40);
            ctx.restore();

            if(pipes.length==0 || pipes[pipes.length-1].x < 170) pipes.push({x:320, h:Math.random()*200+50});
            pipes.forEach(p => {
                p.x -= 2; ctx.fillStyle="#444";
                ctx.fillRect(p.x, 0, 35, p.h); ctx.fillRect(p.x, p.h+110, 35, 400);
                if(p.x<70 && p.x>30 && (y<p.h || y>p.h+110)) go=false;
                if(p.x==50) score++;
            });
            pipes = pipes.filter(p => p.x > -40);
            ctx.fillStyle="#fff"; ctx.fillText("Skor: "+score, 10, 25);
            if(y>400 || y<0) go=false;
            if(go) requestAnimationFrame(draw);
            else ctx.fillText("YANDIN! TIKLA", 110, 200);
        }
        cvs.onpointerdown = (e) => { e.preventDefault(); if(!go) startFlappy(); else v=-5; };
        draw();
    }

    document.body.classList.remove("not-loaded");
});
