// UI glue: tabs, gallery population, slideshow controls
(function () {
    const images = [
        'media/1.jpeg', 'media/2.jpeg', 'media/3.jpeg', 'media/4.jpeg', 'media/5.jpeg', 'media/6.jpeg', 'media/7.jpeg', 'media/8.jpeg', 'media/9.jpeg', 'media/10.jpeg', 'media/11.jpeg', 'media/12.jpeg', 'media/13.jpeg', 'media/14.jpeg', 'media/15.jpeg', 'media/gulo.jpg'
    ];
    const captions = images.map((p, i) => ['Gülüşün dünyam', 'Birlikte nice anı', 'Seni seviyorum', 'Kalbim sende', 'Hayatımın ışığı', 'Sana adanmış bir gün', 'Canım eşim'][i % 7]);

    function showPanel(id) {
        document.querySelectorAll('#panel > div').forEach(d => d.style.display = 'none');
        const el = document.getElementById(id + 'Panel');
        if (el) el.style.display = 'block';
        // If showing flappy or love, notify resize so canvas fits and media adapts
        if (id === 'flappy' || id === 'love') {
            setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
            // also, if love panel, populate right side with autoplaying looping muted video only
            if (id === 'love') {
                const loveSide = document.getElementById('loveSideContent');
                if (loveSide) {
                    loveSide.innerHTML = `\
                        <div style="font-weight:700;font-size:1.1rem">Muhammet → Gülçin 🌸</div>\
                        <div id="loveSidePhrase" style="color:var(--muted);margin-top:6px">Hoşgeldin canım.</div>\
                        <div style="margin-top:8px;width:100%;display:flex;align-items:center;justify-content:center">\
                            <video id="loveMainVideo" src="media/gulobebek.mp4" playsinline muted loop style="width:560px;max-width:100%;aspect-ratio:16/10;height:auto;max-height:420px;border-radius:8px;object-fit:contain;background:#000;"></video>\
                        </div>`;
                    const v = document.getElementById('loveMainVideo');
                    if (v) {
                        // try to play; browsers allow muted autoplay
                        const p = v.play();
                        if (p && p.catch) p.catch(() => { });
                    }
                }
            }
        }
    }
    document.querySelectorAll('.sidebar .btn[data-target]').forEach(b => b.addEventListener('click', () => showPanel(b.dataset.target)));

    // populate gallery
    const grid = document.getElementById('galleryGrid');
    images.forEach((src, i) => {
        const div = document.createElement('div'); div.className = 'gallery-item'; div.dataset.index = i;
        const img = document.createElement('img'); img.src = src; img.alt = ''; img.onerror = function () { div.style.display = 'none' };
        const cap = document.createElement('div'); cap.className = 'caption'; cap.textContent = captions[i];
        div.appendChild(img); div.appendChild(cap); grid.appendChild(div);
    });

    // slideshow
    const modal = document.getElementById('slideModal');
    const slideImage = document.getElementById('slideImage');
    const slideCaption = document.getElementById('slideCaption');
    const slidePhrase = document.getElementById('slidePhrase');
    let si = 0; const phrases = ['Canım eşim ❤️', 'Gülüşün her şeyi aydınlatır', 'Sana hep aşkla bakıyorum', 'Seni çok seviyorum'];
    function openSlide(index) { si = index; slideImage.src = images[si]; slideCaption.textContent = captions[si] || ''; slidePhrase.textContent = phrases[si % phrases.length]; modal.style.display = 'flex'; }
    function closeSlide() { modal.style.display = 'none'; }
    document.getElementById('prevSlide').onclick = () => { si = (si - 1 + images.length) % images.length; openSlide(si) };
    document.getElementById('nextSlide').onclick = () => { si = (si + 1) % images.length; openSlide(si) };
    document.getElementById('closeSlide').onclick = closeSlide;
    grid.addEventListener('click', e => { const g = e.target.closest('.gallery-item'); if (!g) return; openSlide(Number(g.dataset.index)); });
    document.getElementById('btnSurprise').addEventListener('click', () => openSlide(0));

    // love side media play
    const lovePlayBtn = document.getElementById('lovePlayMedia');
    if (lovePlayBtn) {
        lovePlayBtn.addEventListener('click', () => {
            const loveSide = document.getElementById('loveSideContent');
            if (!loveSide) return;
            // try to play the supplied video if exists
            const videoSrc = 'media/gulobebek.mp4';
            loveSide.innerHTML = `<video src="${videoSrc}" controls style="max-width:100%;border-radius:8px"></video>`;
            const v = loveSide.querySelector('video'); if (v) v.play().catch(() => { });
        });
    }

    // Surprise modal open/close (script.js also uses surprise modal; keep safe)
    const surpriseOpen = document.getElementById('surprise-open');
    const surpriseClose = document.getElementById('surprise-close');
    if (surpriseOpen) surpriseOpen.addEventListener('click', () => { document.getElementById('surprise-modal').style.display = 'none'; /* script.js handles more */ });
    if (surpriseClose) surpriseClose.addEventListener('click', () => { document.getElementById('surprise-modal').style.display = 'none'; });

    // Ensure home shown by default
    showPanel('home');
    // --- Floating flowers (simple) ---
    (function addFlowers() {
        const css = `
        .floating-flowers{position:fixed;left:50%;top:36%;transform:translateX(-50%);pointer-events:none;z-index:1}
        .floating-flowers span{font-size:30px;margin:0 8px;display:inline-block;animation:flowerFloat 4s ease-in-out infinite}
        .floating-flowers span:nth-child(2){animation-delay:.4s}
        .floating-flowers span:nth-child(3){animation-delay:.9s}
        @keyframes flowerFloat{0%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.05)}100%{transform:translateY(0) scale(1)}}
      `;
        const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
        const f = document.createElement('div'); f.className = 'floating-flowers'; f.innerHTML = '<span>🌸</span><span>🌺</span><span>🌼</span>';
        document.body.appendChild(f);
    })();

    // --- Flappy game implementation ---
    (function () {
        const canvas = document.getElementById('flappyCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const sprite = new Image(); sprite.src = 'media/flappy_gulcin.png';
        let dpr = window.devicePixelRatio || 1;
        function fit() {
            dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            if (!rect.width || !rect.height) {
                // canvas not yet visible/mounted; retry shortly
                setTimeout(fit, 120);
                return;
            }
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        window.addEventListener('resize', fit); fit();

        let game = null, rafF = null;
        function reset() { fit(); game = { bird: { x: 70, y: 220, w: 64, h: 50, vy: 0 }, gravity: 0.28, flap: -9.2, pipes: [], pipeGap: 180, pipeW: 56, spawnMs: 2000, lastSpawn: 0, speed: 1.4, score: 0, width: canvas.width / dpr, height: canvas.height / dpr, over: false, lastTs: 0 } }
        function spawn() { const min = 36, max = game.height - game.pipeGap - 36; const top = Math.floor(Math.random() * (max - min + 1)) + min; game.pipes.push({ x: game.width, top: top, passed: false }); }
        function draw() { const g = ctx.createLinearGradient(0, 0, 0, game.height); g.addColorStop(0, '#bfefff'); g.addColorStop(1, '#fff'); ctx.fillStyle = g; ctx.fillRect(0, 0, game.width, game.height); ctx.fillStyle = 'rgba(255,77,166,0.95)'; for (const p of game.pipes) { ctx.fillRect(Math.round(p.x), 0, game.pipeW, p.top); ctx.fillRect(Math.round(p.x), p.top + game.pipeGap, game.pipeW, game.height - (p.top + game.pipeGap)); } if (sprite.complete) { ctx.drawImage(sprite, game.bird.x, game.bird.y, game.bird.w, game.bird.h); } else { ctx.fillStyle = '#ff4da6'; ctx.beginPath(); ctx.arc(game.bird.x + game.bird.w / 2, game.bird.y + game.bird.h / 2, 18, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = '#222'; ctx.font = '16px Inter,Arial'; ctx.fillText('Skor: ' + game.score, 12, 22); if (game.over) { ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fillRect(20, game.height / 2 - 48, game.width - 40, 96); ctx.fillStyle = '#222'; ctx.textAlign = 'center'; ctx.font = '18px Inter,Arial'; ctx.fillText('Yandın — Skor: ' + game.score, game.width / 2, game.height / 2); ctx.textAlign = 'start'; } }
        function collide() { const b = game.bird; if (b.y < 0 || b.y + b.h > game.height) return true; for (const p of game.pipes) { if (b.x + b.w > p.x && b.x < p.x + game.pipeW) { if (b.y < p.top || b.y + b.h > p.top + game.pipeGap) return true; } } return false }
        function loop(ts) { if (!game || game.over) return; if (!game.lastTs) game.lastTs = ts; const dt = ts - game.lastTs; game.lastTs = ts; game.lastSpawn += dt; if (game.lastSpawn > game.spawnMs) { spawn(); game.lastSpawn = 0; } for (const p of game.pipes) p.x -= game.speed * (dt / 16); if (game.pipes.length && game.pipes[0].x < -game.pipeW) game.pipes.shift(); game.bird.vy += game.gravity; game.bird.y += game.bird.vy; for (const p of game.pipes) { if (!p.passed && p.x + game.pipeW < game.bird.x) { p.passed = true; game.score++; } } if (collide()) { game.over = true; document.getElementById('flappyInfo').textContent = 'Yandın — tekrar dene'; } draw(); rafF = requestAnimationFrame(loop); }
        function start() { if (rafF) return; reset(); game.lastTs = 0; game.lastSpawn = 0; game.over = false; game.score = 0; document.getElementById('flappyInfo').textContent = 'Oyun başladı'; rafF = requestAnimationFrame(loop); }
        function stop() { if (rafF) cancelAnimationFrame(rafF); rafF = null; document.getElementById('flappyInfo').textContent = 'Durdu'; }
        document.getElementById('flappyStart').addEventListener('click', () => { fit(); setTimeout(start, 80); });
        document.getElementById('flappyStop').addEventListener('click', stop);
        canvas.addEventListener('click', () => { if (game && !game.over) game.bird.vy = game.flap; });
        window.addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); if (game && !game.over) game.bird.vy = game.flap; } });
    })();

})();
