window.addEventListener('load', () => {
    // 1. Karakter Resmini Yükle
    const birdImg = new Image();
    birdImg.src = 'media/1.jpeg';

    const media = [];
    for(let i=1; i<=16; i++) { media.push({src: `media/${i}.jpeg`, type:'img'}); }
    media.push({src: 'media/gulobebek.mp4', type:'vid'});

    let current = 0;

    // 2. Tab Sistemi
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.menu-btn, .tab-content').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.id).classList.add('active');
            if(btn.dataset.id === 'game') initGame();
        };
    });

    // 3. Slayt Gösterisi
    function update() {
        const item = media[current];
        const img = document.getElementById('mainImg');
        const vid = document.getElementById('mainVid');
        if(item.type === 'vid') {
            img.style.display='none'; vid.style.display='block'; vid.src=item.src; vid.play();
        } else {
            vid.style.display='none'; img.style.display='block'; img.src=item.src;
        }
    }
    document.getElementById('next').onclick = () => { current=(current+1)%media.length; update(); };
    document.getElementById('prev').onclick = () => { current=(current-1+media.length)%media.length; update(); };

    // 4. Sevgi Ölçer
    let val = 0, isPress = false, raf;
    const fill = document.getElementById('barInner'), msg = document.getElementById('loveMsg');
    const quotes = ["Dünyam!", "Her şeyimsin.", "Gülüşün yeter.", "Seni Çok Seviyorum."];

    window.onpointerdown = (e) => {
        if(!document.getElementById('love').classList.contains('active')) return;
        if(e.target.closest('.nav-bar')) return;
        if(!isPress) {
            isPress = true; msg.style.opacity=0;
            (function loop(){ if(!isPress)return; val+=4; if(val>100)val=0; fill.style.height=val+'%'; raf=requestAnimationFrame(loop); })();
        } else {
            isPress = false; cancelAnimationFrame(raf);
            msg.innerText = quotes[Math.floor(Math.random()*quotes.length)] + " %" + Math.floor(val);
            msg.style.opacity = 1;
        }
    };

    // 5. Flappy (Kafa ile uçma)
    function initGame() {
        const cvs = document.getElementById('gameCanvas');
        const ctx = cvs.getContext('2d');
        cvs.width = 300; cvs.height = 400;
        let y=200, v=0, pipes=[], score=0, active=true;

        function render() {
            if(!active) return;
            ctx.clearRect(0,0,300,400);
            v += 0.2; y += v;
            
            // Gülçin Karakteri
            ctx.save();
            ctx.beginPath(); ctx.arc(50, y, 15, 0, 7); ctx.clip();
            ctx.drawImage(birdImg, 35, y-15, 30, 30);
            ctx.restore();

            if(pipes.length==0 || pipes[pipes.length-1].x < 150) pipes.push({x:300, h:Math.random()*180+50});
            pipes.forEach(p => {
                p.x -= 2; ctx.fillStyle="#444";
                ctx.fillRect(p.x, 0, 30, p.h); ctx.fillRect(p.x, p.h+100, 30, 400);
                if(p.x<65 && p.x>35 && (y<p.h || y>p.h+100)) active=false;
                if(p.x==50) score++;
            });
            pipes = pipes.filter(p => p.x > -40);
            ctx.fillStyle="#fff"; ctx.fillText("Skor: "+score, 10, 20);
            if(y>400 || y<0) active=false;
            if(active) requestAnimationFrame(render);
            else ctx.fillText("YANDIN! TIKLA", 110, 200);
        }
        cvs.onpointerdown = (e) => { e.preventDefault(); if(!active) initGame(); else v=-4.5; };
        render();
    }
});
