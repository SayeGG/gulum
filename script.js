window.addEventListener('load', () => {
    // Gülçin Karakteri
    const guloHead = new Image();
    guloHead.src = 'media/1.jpeg';

    // Medya Listesi (16 Foto + Video)
    const mediaItems = [];
    for(let i=1; i<=16; i++) { mediaItems.push({src: `media/${i}.jpeg`, type: 'img'}); }
    mediaItems.push({src: 'media/gulobebek.mp4', type: 'vid'});

    let currentIdx = 0;

    // 1. Tab Geçişleri
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-item, .tab').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(btn.dataset.tab);
            target.classList.add('active');
            if(btn.dataset.tab === 'game') initFlappy();
        });
    });

    // 2. Slayt Sistemi
    function updateSlide() {
        const item = mediaItems[currentIdx];
        const img = document.getElementById('mainImg');
        const vid = document.getElementById('mainVid');
        if(item.type === 'vid') {
            img.style.display='none'; vid.style.display='block'; vid.src=item.src; vid.play();
        } else {
            vid.style.display='none'; img.style.display='block'; img.src=item.src;
        }
    }
    document.getElementById('nextBtn').onclick = () => { currentIdx = (currentIdx+1)%mediaItems.length; updateSlide(); };
    document.getElementById('prevBtn').onclick = () => { currentIdx = (currentIdx-1+mediaItems.length)%mediaItems.length; updateSlide(); };

    // 3. Sevgi Ölçer
    let val = 0, isPressing = false, raf;
    const fill = document.getElementById('meterFill');
    const quote = document.getElementById('loveQuote');

    window.onpointerdown = (e) => {
        if(!document.getElementById('love').classList.contains('active') || e.target.closest('.navbar')) return;
        if(!isPressing) {
            isPressing = true; quote.style.opacity = 0;
            (function loop() {
                if(!isPressing) return;
                val += 4; if(val > 100) val = 0;
                fill.style.height = val + '%';
                raf = requestAnimationFrame(loop);
            })();
        } else {
            isPressing = false; cancelAnimationFrame(raf);
            quote.innerText = "Seni %" + Math.floor(val) + " Seviyorum!";
            quote.style.opacity = 1;
        }
    };

    // 4. Flappy Gülçin (Sıfır Hata)
    function initFlappy() {
        const cvs = document.getElementById('flappyCvs');
        const ctx = cvs.getContext('2d');
        cvs.width = 300; cvs.height = 400;
        let y=200, v=0, pipes=[], score=0, active=true;

        function draw() {
            if(!active) return;
            ctx.clearRect(0,0,300,400);
            v += 0.25; y += v;
            
            // Karakter: Gülçin'in kafası
            ctx.save();
            ctx.beginPath(); ctx.arc(50, y, 18, 0, Math.PI*2); ctx.clip();
            ctx.drawImage(guloHead, 32, y-18, 36, 36);
            ctx.restore();

            if(pipes.length==0 || pipes[pipes.length-1].x < 150) pipes.push({x:300, h:Math.random()*200+50});
            pipes.forEach(p => {
                p.x -= 2; ctx.fillStyle="#444";
                ctx.fillRect(p.x, 0, 30, p.h); ctx.fillRect(p.x, p.h+100, 30, 400);
                if(p.x < 65 && p.x > 35 && (y < p.h || y > p.h+100)) active = false;
                if(p.x === 50) score++;
            });
            pipes = pipes.filter(p => p.x > -40);
            ctx.fillStyle="#fff"; ctx.fillText("Puan: "+score, 10, 20);
            if(y > 400 || y < 0) active = false;
            if(active) requestAnimationFrame(draw);
            else ctx.fillText("YANDIN! DOKUN", 110, 200);
        }
        cvs.onpointerdown = (e) => { e.preventDefault(); if(!active) initFlappy(); else v = -5; };
        draw();
    }
});
