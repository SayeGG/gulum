window.addEventListener('load', () => {
    // --- VERİLER ---
    const mediaItems = [
        { src: 'media/1.jpeg', text: "Gülüşün dünyamı aydınlatıyor Gül'üm." },
        { src: 'media/2.jpeg', text: "Her anımda sen varsın birtanem." },
        { src: 'media/3.jpeg', text: "Muhammet sana her gün yeniden aşık oluyor." },
        { src: 'media/4.jpeg', text: "Seninle hayat bir başka güzel Gülçin'im." },
        { src: 'media/5.jpeg', text: "Kalbimin tek sahibi, canım eşim." },
        { src: 'media/6.jpeg', text: "Gözlerin en güzel manzaram benim." },
        { src: 'media/7.jpeg', text: "Sonsuza kadar sadece sen ve ben." },
        { src: 'media/8.jpeg', text: "Seninle yaşlanmak hayattaki en büyük şansım." },
        { src: 'media/9.jpeg', text: "Ruhumun eşi, kalbimin neşesi iyiki varsın." },
        { src: 'media/10.jpeg', text: "Gül yüzlüm, her şeyim sensin." },
        { src: 'media/11.jpeg', text: "Sana olan sevgim kelimelere sığmaz." },
        { src: 'media/12.jpeg', text: "Ömrümün en güzel hikayesi seninle başladı." },
        { src: 'media/13.jpeg', text: "Dünyanın en güzel kalbi sende Gülçin'im." },
        { src: 'media/14.jpeg', text: "Hayat seninle daha anlamlı, daha renkli." },
        { src: 'media/15.jpeg', text: "Can parçam, sol yanım, her şeyim..." },
        { src: 'media/16.jpeg', text: "İyiki benimsin, iyiki eşimsin!" },
        { src: 'media/gulobebek.mp4', text: "O hallerine kurban olurum Gül'üm!", type: 'video' }
    ];

    let currentIdx = 0;

    // --- PANEL SİSTEMİ ---
    function showPanel(id) {
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(id + 'Panel');
        if (target) target.classList.add('active');
        if (id === 'gallery') buildGallery();
    }

    // Menü Butonları
    document.querySelectorAll('[data-panel]').forEach(btn => {
        btn.addEventListener('click', () => showPanel(btn.getAttribute('data-panel')));
    });

    document.getElementById('startSurprise').addEventListener('click', () => {
        currentIdx = 0;
        showPanel('surprise');
        updateSlideshow();
    });

    // --- SLAYTSHOW MANTIĞI ---
    function updateSlideshow() {
        const item = mediaItems[currentIdx];
        const img = document.getElementById('mainImage');
        const vid = document.getElementById('mainVideo');
        const cap = document.getElementById('mediaCaption');

        if(item.type === 'video') {
            img.style.display = 'none';
            vid.style.display = 'block';
            vid.src = item.src;
            vid.play();
        } else {
            vid.style.display = 'none';
            vid.pause();
            img.style.display = 'block';
            img.src = item.src;
        }
        cap.innerText = item.text;
    }

    document.getElementById('nextBtn').addEventListener('click', () => {
        currentIdx = (currentIdx + 1) % mediaItems.length;
        updateSlideshow();
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        currentIdx = (currentIdx - 1 + mediaItems.length) % mediaItems.length;
        updateSlideshow();
    });

    document.getElementById('closeBtn').addEventListener('click', () => showPanel('home'));

    // --- GALERİ MANTIĞI ---
    function buildGallery() {
        const grid = document.getElementById('galleryGrid');
        grid.innerHTML = '';
        mediaItems.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'grid-item';
            div.innerHTML = item.type === 'video' ? '<div style="background:#333;height:100%;display:flex;align-items:center;justify-content:center;">🎥</div>' : `<img src="${item.src}">`;
            div.addEventListener('click', () => {
                currentIdx = i;
                showPanel('surprise');
                updateSlideshow();
            });
            grid.appendChild(div);
        });
    }

    // --- SEVGİ ÖLÇER (HIZLI OYUN) ---
    let loveVal = 0, isPlaying = false, loveRaf;
    const fill = document.getElementById('meterFill');
    const status = document.getElementById('loveStatus');

    function runMeter() {
        if(!isPlaying) return;
        loveVal += 3.5;
        if(loveVal > 100) loveVal = 0;
        fill.style.height = loveVal + '%';
        loveRaf = requestAnimationFrame(runMeter);
    }

    window.addEventListener('pointerdown', (e) => {
        if(!document.getElementById('lovePanel').classList.contains('active')) return;
        if(e.target.closest('.sidebar')) return;

        if(!isPlaying) {
            isPlaying = true;
            status.innerText = "DURDURMAK İÇİN BAS!";
            runMeter();
        } else {
            isPlaying = false;
            cancelAnimationFrame(loveRaf);
            status.innerHTML = `<span style="font-size:1.5rem; color:#ff69b4;">%${Math.floor(loveVal)} AŞK</span><br>Muhammet sana deli oluyor!`;
        }
    });

    // --- FLAPPY GÜLÇİN (YUVARLAK SİMGE) ---
    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');
    const birdImg = new Image(); birdImg.src = 'media/flappy_gulcin.png';
    let bird = { y: 200, v: 0, g: 0.4 }, pipes = [], score = 0, flappyActive = false;

    function initFlappy() {
        canvas.width = 320; canvas.height = 480;
        bird = { y: 200, v: 0, g: 0.4 }; pipes = []; score = 0; flappyActive = true;
        animateFlappy();
    }

    function animateFlappy() {
        if(!flappyActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        bird.v += bird.g; bird.y += bird.v;
        
        // Yuvarlak Gülçin
        ctx.save();
        ctx.beginPath(); ctx.arc(60, bird.y, 25, 0, Math.PI*2); ctx.clip();
        if(birdImg.complete) ctx.drawImage(birdImg, 35, bird.y-25, 50, 50);
        else { ctx.fillStyle = "pink"; ctx.fill(); }
        ctx.restore();

        if(pipes.length === 0 || pipes[pipes.length-1].x < 180) {
            pipes.push({ x: 320, h: Math.random()*200+50 });
        }

        pipes.forEach((p, i) => {
            p.x -= 2.5;
            ctx.fillStyle = "#4ade80";
            ctx.fillRect(p.x, 0, 50, p.h);
            ctx.fillRect(p.x, p.h + 150, 50, canvas.height);

            if(p.x < 85 && p.x > 15 && (bird.y < p.h || bird.y > p.h + 150)) flappyActive = false;
            if(p.x === 60) score++;
        });
        pipes = pipes.filter(p => p.x > -50);

        ctx.fillStyle = "white"; ctx.font = "20px Poppins"; ctx.fillText("Puan: " + score, 20, 40);
        if(bird.y > 480 || bird.y < 0) flappyActive = false;

        if(flappyActive) requestAnimationFrame(animateFlappy);
        else ctx.fillText("YANDIN! Dokun ve Başla", 50, 240);
    }

    canvas.addEventListener('pointerdown', () => {
        if(!flappyActive) initFlappy();
        else bird.v = -7;
    });

    document.body.classList.remove("not-loaded");
});
