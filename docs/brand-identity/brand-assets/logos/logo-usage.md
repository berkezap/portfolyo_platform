# PortfolYO Logo Kullanım Kılavuzu

## Logo Varyasyonları

### 1. Full Logo (Ana Logo)
- **Dosya**: `portfolyo-logo.svg`
- **Kullanım**: Ana sayfa, header, footer
- **Minimum boyut**: 200x48px
- **Aspect ratio**: 4.17:1

### 2. Icon Logo (PY)
- **Dosya**: `portfolyo-icon.svg`
- **Kullanım**: Favicon, küçük alanlar, mobil
- **Minimum boyut**: 48x48px
- **Aspect ratio**: 1:1

### 3. Text Logo
- **Kullanım**: Sadece metin olarak
- **Font**: Inter Bold (700)
- **Letter spacing**: -0.025em

## Renk Varyasyonları

### Primary (Ana Renk)
- **Renk**: Blue-600 (#2563EB)
- **Kullanım**: Beyaz arka plan üzerinde

### White (Beyaz)
- **Renk**: White (#FFFFFF)
- **Kullanım**: Koyu arka plan üzerinde

### Dark (Koyu)
- **Renk**: Gray-900 (#111827)
- **Kullanım**: Açık arka plan üzerinde

## Clear Space (Temiz Alan)

### Minimum Clear Space
- Logo etrafında minimum 1x logo height boşluk
- Logo boyutunun %50'si kadar minimum margin

### Örnek
```
┌─────────────────────────────────────┐
│                                     │
│    ┌─────────────────────────┐      │
│    │      PortfolYO Logo     │      │
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

## Kullanım Kuralları

### ✅ Yapılması Gerekenler
- Logo'yu orijinal aspect ratio'da kullan
- Minimum boyut kurallarına uy
- Clear space kurallarına uy
- Yüksek kaliteli dosyaları kullan

### ❌ Yapılmaması Gerekenler
- Logo'yu stretch etme veya distort etme
- Logo'yu çok küçük boyutlarda kullanma
- Logo'yu renkli gradient üzerinde kullanma
- Logo'yu şeffaf arka plan üzerinde kullanma
- Logo'yu döndürme veya eğme

## Dosya Formatları

### SVG (Önerilen)
- **Avantajlar**: Vektörel, ölçeklenebilir, küçük dosya boyutu
- **Kullanım**: Web, dijital medya

### PNG
- **Avantajlar**: Şeffaflık desteği, yüksek kalite
- **Kullanım**: Print, sosyal medya

### JPG
- **Avantajlar**: Küçük dosya boyutu
- **Kullanım**: Web (şeffaflık gerekmiyorsa)

## Responsive Kullanım

### Desktop
- Full logo kullan
- Minimum 200px genişlik

### Tablet
- Full logo veya icon logo
- Minimum 150px genişlik

### Mobile
- Icon logo veya text logo
- Minimum 100px genişlik

## Implementation

### React Component
```tsx
import Logo from '@/components/ui/Logo'

// Full logo
<Logo variant="full" size="lg" />

// Icon logo
<Logo variant="icon" size="md" />

// Text logo
<Logo variant="text" size="sm" />
```

### CSS Classes
```css
/* Logo container */
.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Logo image */
.logo-image {
  height: auto;
  width: auto;
  max-width: 100%;
}
```

## Favicon

### Favicon Dosyası
- **Dosya**: `portfolyo-favicon.svg`
- **Boyut**: 32x32px
- **Format**: SVG (modern browser'lar için)

### HTML Implementation
```html
<link rel="icon" type="image/svg+xml" href="/brand-assets/logos/portfolyo-favicon.svg" />
<link rel="icon" type="image/png" href="/brand-assets/logos/portfolyo-favicon.png" />
```

## Sosyal Medya

### Profile Pictures
- **Boyut**: 400x400px
- **Format**: PNG
- **İçerik**: Icon logo (PY)

### Cover Images
- **Boyut**: 1200x630px
- **Format**: PNG
- **İçerik**: Full logo + tagline

## Print Materials

### Business Cards
- **Logo boyutu**: 1.5 inch genişlik
- **Renk**: CMYK değerleri kullan

### Letterhead
- **Logo boyutu**: 2 inch genişlik
- **Pozisyon**: Sol üst köşe

### Brochures
- **Logo boyutu**: 3 inch genişlik
- **Renk**: Brand colors kullan

---

*Bu kılavuz, PortfolYO markasının tutarlı ve profesyonel görünümünü sağlamak için oluşturulmuştur.* 