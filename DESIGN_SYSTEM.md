# PortfolYO Design System

## 🎯 Tasarım Felsefesi

**"Less, but better"** - Dieter Rams

PortfolYO, geliştiriciler için profesyonel, minimal ve zarif bir portfolyo platformudur. Tasarım dili, güven, kalite ve profesyonellik hissi yaratmayı amaçlar.

### Temel Prensipler

1. **Hierarchy (Hiyerarşi)**: Kullanıcının gözü otomatik olarak önemli bilgilere yönlenmelidir
2. **Space (Boşluk)**: Boşluk aktif bir tasarım elementidir, lüks ve sakinlik hissi yaratır
3. **Intentional Color (Amaçlı Renk)**: Renkler dekorasyon için değil, amaç için kullanılır
4. **Consistency (Tutarlılık)**: Her element tutarlı bir sistemin parçasıdır
5. **Delight in Details (Detaylarda Keyif)**: Pixel-perfect alignment ve smooth transitions

---

## 🎨 Renk Paleti

### Primary Colors
```css
/* Ana Marka Rengi - Sadece primary actions için */
--blue-600: #2563EB
--blue-700: #1D4ED8 (hover state)
```

### Neutral Colors
```css
/* Sophisticated gri tonları */
--gray-50: #F9FAFB   /* Arka plan */
--gray-100: #F3F4F6  /* Kart arka planı, secondary buttons */
--gray-200: #E5E7EB  /* Border */
--gray-300: #D1D5DB  /* Hover border */
--gray-500: #6B7280  /* Secondary text */
--gray-600: #4B5563  /* Primary text */
--gray-700: #374151  /* Metadata text */
--gray-900: #111827  /* Headings */
```

### Semantic Colors
```css
/* Sadece gerekli durumlarda kullanılır */
--red-50: #FEF2F2   /* Error background */
--red-200: #FECACA  /* Error border */
--red-600: #DC2626  /* Destructive action (hover only) */
--red-700: #B91C1C  /* Error text */

--green-50: #F0FDF4  /* Success background */
--green-200: #BBF7D0 /* Success border */
--green-600: #16A34A /* Success text */
```

### Kullanım Kuralları
- **Primary Blue**: Sadece ana aksiyonlar (Düzenle, Kaydet, Oluştur)
- **Neutral Grays**: Tüm metin, border ve arka planlar
- **Red**: Sadece destructive actions ve error states
- **Green**: Sadece success states

---

## 📝 Typography

### Font Scale
```css
/* Headings */
--text-3xl: 1.875rem (30px) /* Page titles */
--text-xl: 1.25rem (20px)   /* Section titles */
--text-lg: 1.125rem (18px)  /* Card titles */
--text-base: 1rem (16px)    /* Body text */
--text-sm: 0.875rem (14px)  /* Metadata, buttons */
--text-xs: 0.75rem (12px)   /* Labels, captions */
```

### Font Weights
```css
--font-bold: 700    /* Page titles, card titles */
--font-semibold: 600 /* Section titles, important text */
--font-medium: 500   /* Button text, labels */
--font-normal: 400   /* Body text */
```

### Line Heights
```css
--leading-tight: 1.25    /* Headings */
--leading-normal: 1.5    /* Body text */
--leading-relaxed: 1.625 /* Long paragraphs */
```

---

## 📏 Spacing System

### Base Unit: 4px (0.25rem)

```css
/* Spacing Scale */
--space-1: 0.25rem (4px)   /* Minimal spacing */
--space-2: 0.5rem (8px)    /* Button padding */
--space-3: 0.75rem (12px)  /* Card padding */
--space-4: 1rem (16px)     /* Section spacing */
--space-6: 1.5rem (24px)   /* Component spacing */
--space-8: 2rem (32px)     /* Page spacing */
--space-12: 3rem (48px)    /* Major section spacing */
--space-16: 4rem (64px)    /* Page margins */
```

### Kullanım Kuralları
- **4px**: Minimal element spacing
- **8px**: Button padding, small gaps
- **16px**: Card padding, component spacing
- **24px**: Section spacing
- **48px**: Major section spacing

---

## 🔲 Border Radius

```css
--rounded-lg: 0.5rem (8px)   /* Cards, containers */
--rounded-xl: 0.75rem (12px) /* Primary card radius */
--rounded-2xl: 1rem (16px)   /* Large containers */
```

---

## 🎭 Component Guidelines

### Buttons

#### Primary Button (Ana Aksiyon)
```css
/* Düzenle, Kaydet, Oluştur */
bg-blue-600 hover:bg-blue-700
text-white
px-6 py-3
rounded-lg
font-medium text-sm
transition-all duration-200
focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
```

#### Secondary Button (İkincil Aksiyon)
```css
/* Görüntüle, İptal */
bg-gray-100 hover:bg-gray-200
text-gray-700
px-4 py-2.5
rounded-lg
font-medium text-sm
transition-all duration-200
focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
```

#### Destructive Button (Yıkıcı Aksiyon)
```css
/* Sil */
bg-gray-100 hover:bg-red-50
text-gray-400 hover:text-red-600
px-4 py-2.5
rounded-lg
font-medium text-sm
transition-all duration-200
focus:ring-2 focus:ring-red-500 focus:ring-offset-2
```

### Cards

#### Portfolio Card
```css
bg-white
border border-gray-200 hover:border-gray-300
rounded-xl
p-6
hover:shadow-lg
transition-all duration-200
```

#### Content Card
```css
bg-white
border border-gray-200
rounded-lg
p-6
shadow-sm
```

### Form Elements

#### Input Fields
```css
border border-gray-300
rounded-lg
px-4 py-3
focus:ring-2 focus:ring-blue-500 focus:border-blue-500
transition-all duration-200
```

#### Checkboxes
```css
h-5 w-5
text-blue-600
rounded
focus:ring-2 focus:ring-blue-500
```

---

## 🎨 Icon System

### Lucide React Icons
Tüm emojiler Lucide React ikonlarıyla değiştirilmiştir.

#### Icon Sizes
```css
--icon-xs: 0.75rem (12px)  /* Small labels */
--icon-sm: 1rem (16px)     /* Button icons */
--icon-md: 1.25rem (20px)  /* Card icons */
--icon-lg: 1.5rem (24px)   /* Section icons */
--icon-xl: 2rem (32px)     /* Page icons */
```

#### Icon Colors
```css
--icon-primary: #2563EB    /* Primary actions */
--icon-secondary: #6B7280  /* Secondary actions */
--icon-muted: #9CA3AF     /* Muted states */
--icon-destructive: #DC2626 /* Destructive actions */
```

### Icon Mapping
- `📁` → `<FolderOpen />`
- `📅` → `<Calendar />`
- `🎨` → `<Palette />`
- `🔗` → `<ExternalLink />`
- `✏️` → `<Edit3 />`
- `🗑️` → `<Trash2 />`
- `➕` → `<Plus />`
- `⚠️` → `<AlertCircle />`
- `🔄` → `<RefreshCw />`

---

## 🎬 Animations & Transitions

### Duration
```css
--duration-fast: 150ms    /* Hover effects */
--duration-normal: 200ms  /* Standard transitions */
--duration-slow: 300ms    /* Page transitions */
```

### Easing
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
```

### Common Transitions
```css
/* Button hover */
transition-all duration-200

/* Card hover */
transition-all duration-200

/* Focus states */
transition-all duration-150
```

---

## 📱 Responsive Design

### Breakpoints
```css
--sm: 640px   /* Small devices */
--md: 768px   /* Medium devices */
--lg: 1024px  /* Large devices */
--xl: 1280px  /* Extra large devices */
--2xl: 1536px /* 2X large devices */
```

### Container Max Widths
```css
--container-sm: 640px
--container-md: 768px
--container-lg: 1024px
--container-xl: 1280px
--container-2xl: 1536px
--container-7xl: 80rem (1280px) /* Primary container */
```

### Grid System
```css
/* Portfolio Cards */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Template Selection */
grid-cols-1 md:grid-cols-3
```

---

## 🎯 Component Hierarchy

### Page Structure
1. **Header** (DashboardHeader)
2. **Page Title** (h1, text-3xl, font-bold)
3. **Page Description** (p, text-gray-600)
4. **Primary Action** (Primary Button)
5. **Content Area** (Cards, Lists, Forms)

### Card Structure
1. **Card Header** (Title, Icon)
2. **Metadata** (Info, Stats)
3. **Action Buttons** (Primary, Secondary, Destructive)

### Button Hierarchy
1. **Primary** (Solid blue) - Ana aksiyon
2. **Secondary** (Outline gray) - İkincil aksiyon
3. **Destructive** (Subtle red) - Yıkıcı aksiyon

---

## 🚫 Anti-Patterns

### Yapılmaması Gerekenler
- ❌ Emoji kullanımı (Lucide ikonları kullanın)
- ❌ Renkli gradient arka planlar
- ❌ Eşit boyutlu butonlar (hiyerarşi yok)
- ❌ Büyük, dikkat çekici silme butonları
- ❌ Tutarsız spacing
- ❌ Çoklu renk kullanımı
- ❌ Gereksiz gölgeler ve efektler

### Yapılması Gerekenler
- ✅ Minimal, temiz tasarım
- ✅ Tutarlı spacing sistemi
- ✅ Hiyerarşik buton boyutları
- ✅ Subtle hover effects
- ✅ Focus states
- ✅ Responsive design
- ✅ Accessibility considerations

---

## 📋 Implementation Checklist

### Her Yeni Component İçin
- [ ] Design system renk paletini kullan
- [ ] Tutarlı spacing uygula
- [ ] Lucide ikonları kullan
- [ ] Hiyerarşik buton yapısı
- [ ] Responsive design
- [ ] Focus states
- [ ] Smooth transitions
- [ ] Accessibility test

### Her Sayfa İçin
- [ ] Page title (text-3xl, font-bold)
- [ ] Page description (text-gray-600)
- [ ] Proper container max-width
- [ ] Consistent card structure
- [ ] Loading states
- [ ] Error states
- [ ] Empty states

---

## 🔄 Version History

### v1.0.0 (2025-01-10)
- Initial design system creation
- Color palette definition
- Typography scale
- Component guidelines
- Icon system (Lucide React)
- Spacing system
- Animation guidelines

---

## 📚 Resources

- **Lucide React**: https://lucide.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Dieter Rams Principles**: https://www.vitsoe.com/about/good-design

---

*Bu design system, PortfolYO platformunun tutarlı ve profesyonel görünümünü sağlamak için oluşturulmuştur. Tüm tasarım kararları bu dokümana uygun olarak alınmalıdır.* 