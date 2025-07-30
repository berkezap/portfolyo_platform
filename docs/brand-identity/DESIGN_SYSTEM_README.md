# PortfolYO Design System - Hızlı Başvuru

## 🚀 Hızlı Başlangıç

Bu design system, PortfolYO platformunun tutarlı ve profesyonel görünümünü sağlamak için oluşturulmuştur.

## 📦 Mevcut Component'lar

### Button Component
```tsx
import Button from '@/components/ui/Button'
import { Plus, Edit3 } from 'lucide-react'

// Primary Button (Ana aksiyon)
<Button icon={Plus} size="lg">
  Yeni Portfolyo
</Button>

// Secondary Button (İkincil aksiyon)
<Button variant="secondary" icon={Edit3}>
  Düzenle
</Button>

// Destructive Button (Yıkıcı aksiyon)
<Button variant="destructive" loading={isDeleting}>
  Sil
</Button>
```

### Card Component
```tsx
import Card from '@/components/ui/Card'

// Default Card
<Card>
  <h3>Başlık</h3>
  <p>İçerik</p>
</Card>

// Portfolio Card (hover effects ile)
<Card variant="portfolio">
  <h3>Portfolio Başlığı</h3>
  <p>Portfolio açıklaması</p>
</Card>
```

### IconButton Component
```tsx
import IconButton from '@/components/ui/IconButton'
import { ExternalLink, Trash2 } from 'lucide-react'

// Secondary Icon Button
<IconButton 
  icon={ExternalLink} 
  variant="secondary"
  title="Görüntüle"
/>

// Destructive Icon Button
<IconButton 
  icon={Trash2} 
  variant="destructive"
  loading={isDeleting}
  title="Sil"
/>
```

## 🎨 Renk Kullanımı

### Primary Actions (Mavi)
```css
bg-blue-600 hover:bg-blue-700
```
- Düzenle, Kaydet, Oluştur butonları
- Ana aksiyonlar

### Secondary Actions (Gri)
```css
bg-gray-100 hover:bg-gray-200 text-gray-700
```
- Görüntüle, İptal butonları
- İkincil aksiyonlar

### Destructive Actions (Kırmızı)
```css
bg-gray-100 hover:bg-red-50 hover:text-red-600
```
- Sil butonları (sadece hover'da kırmızı)

## 📏 Spacing Kuralları

### Container
```css
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12
```

### Page Header
```css
mb-12 /* 48px */
```

### Cards
```css
gap-6 /* 24px between cards */
p-6 /* 24px padding inside cards */
```

### Buttons
```css
gap-2 /* 8px between buttons */
```

## 📝 Typography

### Page Titles
```css
text-3xl font-bold text-gray-900 tracking-tight
```

### Card Titles
```css
text-lg font-semibold text-gray-900
```

### Body Text
```css
text-gray-600 text-base
```

### Metadata
```css
text-sm text-gray-700
```

## 🎭 Icon Kullanımı

### Lucide React Icons
```tsx
import { Plus, Edit3, Trash2, ExternalLink } from 'lucide-react'

// Icon boyutları
<Plus className="w-4 h-4" />     // Button icons
<Plus className="w-5 h-5" />     // Card icons
<Plus className="w-8 h-8" />     // Page icons
```

### Icon Mapping
- `📁` → `<FolderOpen />`
- `📅` → `<Calendar />`
- `🎨` → `<Palette />`
- `🔗` → `<ExternalLink />`
- `✏️` → `<Edit3 />`
- `🗑️` → `<Trash2 />`
- `➕` → `<Plus />`

## 🚫 Yapılmaması Gerekenler

- ❌ Emoji kullanımı
- ❌ Renkli gradient arka planlar
- ❌ Eşit boyutlu butonlar
- ❌ Büyük, dikkat çekici silme butonları
- ❌ Tutarsız spacing
- ❌ Çoklu renk kullanımı

## ✅ Yapılması Gerekenler

- ✅ Design system component'larını kullan
- ✅ Tutarlı spacing uygula
- ✅ Lucide ikonları kullan
- ✅ Hiyerarşik buton yapısı
- ✅ Responsive design
- ✅ Focus states
- ✅ Smooth transitions

## 🔧 Yeni Component Ekleme

1. `src/components/ui/` klasörüne yeni component ekle
2. TypeScript interface tanımla
3. Design system renk paletini kullan
4. Tutarlı spacing uygula
5. Focus states ekle
6. Responsive design sağla
7. `DESIGN_SYSTEM.md` dosyasını güncelle

## 📚 Kaynaklar

- [Design System Detayları](./DESIGN_SYSTEM.md)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

*Bu hızlı başvuru, geliştiricilerin design system'i doğru kullanmasını sağlamak için oluşturulmuştur.* 