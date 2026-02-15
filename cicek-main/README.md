Sevgi Barı — Hazır PWA sürümü

Bu proje "Sevgi Barı" adlı mobil ve masaüstü için hazırlanmış küçük bir interaktif sürpriz oyunudur. Bu repo tek dizinde statik bir web uygulaması olarak çalışır (HTML/CSS/JS).

Yaptığım güncellemeler
- `script.js` temizlendi: tekrar eden/bozuk kodlar kaldırıldı, medya yolları var olan dosyalara (media/gülo.jpg ve media/gülobebek.mp4.mp4) güncellendi ve yerel rekor kaydı için tek bir anahtar kullanıldı.
- Sürpriz modalı eklendi — Gülçin için özel karşılama mesajı ve fotoğraf (ilk açılışta görünür).

Nasıl çalıştırılır (yerel)

# Node.js - http-server (global yüklü ise)
npx http-server -c-1 . -p 8080

# Python 3
python -m http.server 8080

Ardından tarayıcıda http://localhost:8080/ adresini açın.

Uzak cihazlardan erişim
- Eğer bilgisayarınız ağa bağlıysa ve portu (ör. 8080) açarsanız, aynı ağdaki diğer cihazlar IP:8080 ile erişebilir.
- Kalıcı ve güvenli barındırma seçenekleri: GitHub Pages, Netlify veya Vercel (ücretsiz) ile bu klasörü direkt olarak deploy edebilirsiniz. Dosyaları GitHub'a push edip Pages veya Netlify ile otomatik deploy yapmak en kolay yoldur.

Notlar ve öneriler
- Medya dosya adlarında Türkçe karakterler var; çoğu yerel sunucu bunları sorunsuz sunar, ancak GitHub Pages gibi ortamlarda sorun yaşamamak için dosya adlarını ASCII'ye çevirip `script.js`'de güncellemek isteyebilirsiniz.
- Global rekor güncellemesi harici bir servis (jsonblob) kullanıyor; bu özelliği tamamen kapatmak veya kendi backend'inize yönlendirmek isterseniz yardımcı olabilirim.

Yaptığım değişikliklerin kısa doğrulaması
- `manifest.json` JSON parse edilebilir ve PWA manifest formatına uygundur.
- `sw.js` sözdizimi hataları giderildi.
- `script.js` artık çift eklenen kod bloklarını içermiyor ve temel oyun akışı çalışır durumda olmalı.

Bir şey daha yapmamı istemediğinizi belirttiniz; ben tüm düzenlemeleri kendim yaptım ve push/remote deploy işlemleri için erişiminiz olmadığı için sizi oraya yönlendirmiyorum. İsterseniz repo'yu GitHub Pages veya Netlify ile deploy etmeniz için adım adım yardımcı olabilirim.

İyi sürprizler — sevgililer gününüz kutlu olsun 💕
