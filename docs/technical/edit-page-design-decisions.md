# Edit Sayfası Tasarım Kararları

## Cal.com Tarzı Kompakt Tasarım - v2.0

### Tasarım Felsefesi

Bu güncelleme ile edit sayfası tamamen yeniden tasarlandı ve Cal.com'un minimalist, kullanıcı dostu yaklaşımından ilham alındı.

### Ana Değişiklikler

#### 1. Layout Yapısı

- **Önceki**: XL breakpoint'te 1:3 oranında grid (sidebar çok büyüktü)
- **Şimdi**: LG breakpoint'te 3:1 oranında grid (main content öncelikli)
- **Sebep**: Ana içerik daha fazla alan almalı, sidebar sadece özet bilgiler için

#### 2. Şablon Seçimi

- **Önceki**: Büyük kartlar, 2 sütun grid, çok fazla detay
- **Şimdi**: 3 sütun kompakt grid, mini önizlemeler
- **Özellikler**:
  - Daha küçük iframe önizlemeleri
  - Minimal metin açıklamaları
  - Seçim durumu için kompakt indikatorler

#### 3. Proje Listesi

- **Önceki**: Büyük kartlar, fazla padding, 2 sütun
- **Şimdi**: Liste view, kompakt satırlar, tek sütun
- **İyileştirmeler**:
  - Checkbox'lar projede isiminin yanında
  - Daha küçük arama ve filtre araçları
  - 264px max-height ile scroll kontrolü
  - Minimum bilgi maksimum verimlilik

#### 4. Sidebar Optimizasyonu

- **Portfolio Özeti**: Key-value çiftleri olarak kompakt gösterim
- **Yayın Durumu**:
  - Katlanabilir URL ayarları (details/summary)
  - Daha küçük form elementleri
  - Kompakt butonlar ve mesajlar

#### 5. Genel Tasarım Dili

- **Padding/Margin**: 4px/6px yerine büyük boşluklar (16px/24px) azaltıldı
- **Font Boyutları**: text-sm/text-base yerine text-xs/text-sm tercih edildi
- **Spacing**: space-y-6 yerine space-y-4, space-y-3 kullanıldı
- **Button Sizes**: sm boyutları için daha kompakt tasarım

### Kullanıcı Deneyimi İyileştirmeleri

1. **Daha Az Scroll**: Tüm önemli özellikler viewport'ta görünür
2. **Hızlı Erişim**: Sidebar'da özet bilgiler hızlıca kontrol edilebilir
3. **Verimli Alan Kullanımı**: Boş alanlar minimize edildi
4. **Cal.com Benzeri Flow**: Clean, purposeful, minimal UI

### Responsive Davranış

- **Mobile**: Tek sütun, stack layout
- **Tablet**: 2-3 sütun şablon seçimi, tek sütun sidebar
- **Desktop**: 4 sütun grid (3+1), optimal alan kullanımı

### Renk Şeması Tutarlılığı

- **Primary**: Blue (500/600 tonları)
- **Success**: Green (publishing durumu)
- **Warning**: Amber (limitations)
- **Error**: Red (validasyonlar)
- **Neutral**: Gray (900/600/500/400/200/100/50)

Bu tasarım kararları Cal.com'un "simple but powerful" felsefesini yansıtır ve kullanıcının işini hızlıca halletmesine odaklanır.
