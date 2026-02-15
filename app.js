(function () {
    const images = ['media/1.jpeg', 'media/2.jpeg', 'media/3.jpeg', 'media/4.jpeg', 'media/5.jpeg', 'media/6.jpeg', 'media/7.jpeg', 'media/8.jpeg', 'media/9.jpeg', 'media/10.jpeg', 'media/11.jpeg', 'media/12.jpeg', 'media/13.jpeg', 'media/14.jpeg', 'media/15.jpeg', 'media/gulo.jpg'];
    const captions = images.map((p, i) => 'Seni Seviyorum');

    function showPanel(id) {
        document.querySelectorAll('#panel > div').forEach(d => d.style.display = 'none');
        const el = document.getElementById(id + 'Panel');
        if (el) el.style.display = 'block';
        if (id === 'flappy' || id === 'love') {
            setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
        }
    }

    document.querySelectorAll('.sidebar .btn[data-target]').forEach(b => b.addEventListener('click', () => showPanel(b.dataset.target)));

    // Flappy Game
    const canvas = document.getElementById('flappyCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const sprite = new Image(); sprite.src = 'media/flappy_gulcin.png';
        let game = null, rafF = null;

        function fit() {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        }
        window.addEventListener('resize', fit); fit();

        function start() {
            fit();
            game = { bird: { x: 50, y: 150, w: 50, h: 40, vy: 0 }, gravity: 0.25, flap: -6, pipes: [], pipeGap: 150, pipeW: 50, score: 0, over: false };
            if(!rafF) loop();
        }

        function loop() {
            if (!game || game.over) { rafF = null; return; }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Bird physics
            game.bird.vy += game.gravity;
            game.bird.y += game.bird.vy;
            
            // Draw Bird
            ctx.fillStyle = "#ff4da6";
            if (sprite.complete) ctx.drawImage(sprite, game.bird.x, game.bird.y, game.bird.w, game.bird.h);
            else ctx.fillRect(game.bird.x, game.bird.y, game.bird.w, game.bird.h);

            if (game.bird.y > canvas.height || game.bird.y < 0) game.over = true;

            ctx.fillStyle = "#222";
            ctx.fillText("Skor: " + game.score, 10, 20);
            
            rafF = requestAnimationFrame(loop);
        }

        const handleAction = (e) => {
            if(e.cancelable) e.preventDefault();
            if (game && !game.over) game.bird.vy = game.flap;
            else start();
        };

        // HEM DOKUNMATİK HEM MOUSE
        canvas.addEventListener('pointerdown', handleAction, { passive: false });
        window.addEventListener('keydown', (e) => { if(e.code === 'Space') handleAction(e); });

        document.getElementById('flappyStart').addEventListener('click', start);
    }
    
    showPanel('home');
})();
