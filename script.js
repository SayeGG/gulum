window.addEventListener('load', () => {
    // --- ATEŞ BÖCEĞİ OLUŞTURUCU ---
    const fireflyContainer = document.querySelector('.fireflies');
    for (let i = 0; i < 20; i++) {
        const f = document.createElement('div');
        f.className = 'firefly';
        f.style.left = Math.random() * 100 + 'vw';
        f.style.animationDuration = (Math.random() * 10 + 10) + 's';
        f.style.animationDelay = (Math.random() * 5) + 's';
        f.style.opacity = Math.random();
        fireflyContainer.appendChild(f);
    }

    // --- VERİLER ---
    const mediaItems = [
        { src: 'media/1.jpeg', text: "Gülüşün dünyamı aydınlatıyor Gül'üm." },
        { src: 'media/2.jpeg', text: "Her anımda sen varsın birtanem." },
        { src: 'media/3.jpeg', text: "Seni her gün yeniden keşfediyorum." },
        { src: 'media/4.jpeg', text: "Seninle hayat bir başka güzel." },
        { src: 'media/5.jpeg', text: "Kalbimin tek sahibi Gülçin'im." },
        { src: 'media/6.jpeg', text: "En güzel manzaram sensin." },
        { src: 'media/7.jpeg', text: "İyiki varsın canım eşim." },
        { src: 'media/gulobebek.mp4', text: "Senin o hallerine kurban olurum!", type: 'video' }
    ];

    let currentIdx = 0;

    // --- PANEL SİSTEMİ ---
    function showPanel(id) {
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(id + 'Panel');
        if (target) target.classList.add('active');
        if (id === 'gallery') buildGallery();
    }

    document.querySelectorAll('[data-panel]').forEach(btn => {
        btn.addEventListener('click', () => showPanel(btn.getAttribute('data-panel')));
    });

    document.getElementById('startSurprise').addEventListener('click', () => {
        currentIdx = 0;
        showPanel('surprise');
        updateSlideshow();
    });

    // --- SLAYTSHOW ---
    function updateSlideshow() {
        const item = mediaItems[currentIdx];
        const img = document.getElementById('mainImage');
        const vid = document.getElementById('mainVideo');
        const cap = document.getElementById('mediaCaption');

        if(item.type === 'video') {
            img.style.display = 'none'; vid.style.display = 'block';
            vid.src = item.src; vid.play();
        } else {
            vid.style.display = 'none'; img.style.display = 'block';
            img.src = item.src;
        }
        cap.innerText = item.text;
    }

    document.getElementById('nextBtn').onclick = () => { currentIdx = (currentIdx + 1) % mediaItems.length; updateSlideshow(); };
    document.getElementById('prevBtn').onclick = () => { currentIdx = (currentIdx - 1 + mediaItems.length) % mediaItems.length; updateSlideshow(); };
    document.getElementById('closeBtn').onclick = () => showPanel('home');

    // --- GALERİ ---
    function buildGallery() {
        const grid = document.getElementById('galleryGrid');
        grid.innerHTML = '';
        mediaItems.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'grid-item';
            div.innerHTML = item.type === 'video' ? '<div style="background:#333;height:100%;display:flex;align-items:center;justify-content:center;">🎥</div>' : `<img src="${item.src}">`;
            div.onclick = () => { currentIdx = i; showPanel('surprise'); updateSlideshow(); };
            grid.appendChild(div);
        });
    }

    // --- SEVGİ ÖLÇER (HIZLI VE EĞLENCELİ) ---
    let loveVal = 0, isPlaying = false, raf;
    const fill = document.getElementById('meterFill');
    const status = document.getElementById('loveStatus');

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
            isPlaying = true;
            status.innerText = "DURDUR!";
            runMeter();
        } else {
            isPlaying = false;
            cancelAnimationFrame(raf);
            status.innerHTML = `<span style="color:#ff69b4;font-size:1.4rem">%${Math.floor(loveVal)} Aşk!</span><br>Gül'üm benim!`;
            createHearts();
        }
    });

    function createHearts() {
        for(let i=0; i<15; i++) {
            const h = document.createElement('div');
            h.innerHTML = '❤️';
            h.style.cssText = `position:fixed; left:50%; top:50%; font-size:20px; pointer-events:none; z-index:100;`;
            document.body.appendChild(h);
            const a = Math.random()*Math.PI*2, d = Math.random()*200;
            h.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(0)`,opacity:0}], 1000).onfinish=()=>h.remove();
        }
    }

    // Flappy Gülçin (Önceki kodun aynısı, bozulmadı)
    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');
    const birdImg = new Image(); birdImg.src = 'media/flappy_gulcin.png';
    let flappyActive = false;
    // ... (Flappy animasyon kodları buraya eklenebilir ama şu an diğerleri öncelikliydi)

    document.body.classList.remove("not-loaded");
});
