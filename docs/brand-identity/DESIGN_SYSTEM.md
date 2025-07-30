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
6. **Modern Aesthetics (Modern Estetik)**: Glass morphism, gradients ve micro-interactions

---

## 🎨 Renk Paleti

### Primary Colors
```css
/* Ana Marka Rengi - Sadece primary actions için */
--blue-600: #2563EB
--blue-700: #1D4ED8 (hover state)
--purple-600: #9333EA (accent)
```

### Modern Gradients
```css
/* Hero Gradients */
.gradient-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-brand {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.gradient-accent {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}
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
- **Gradients**: Hero sections ve special elements
- **Neutral Grays**: Tüm metin, border ve arka planlar
- **Red**: Sadece destructive actions ve error states
- **Green**: Sadece success states

---

## 🌟 Modern Effects

### Glass Morphism
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Floating Elements
```css
.float-card {
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.float-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

### Micro-interactions
```css
.hover-lift {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: scale(1.02);
}
```

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
--rounded-4xl: 2rem (32px)   /* Hero elements */
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
rounded-xl
font-medium text-sm
transition-all duration-300
focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
shadow-lg hover:shadow-xl
```

#### Gradient Button (Hero Actions)
```css
/* Hero sections için */
gradient-brand text-white
px-8 py-4
rounded-xl
font-medium text-lg
transition-all duration-300
shadow-xl hover:shadow-2xl
hover-lift
```

#### Glass Button (Modern Actions)
```css
/* Modern glass effect */
glass text-gray-900
px-6 py-3
rounded-xl
font-medium text-sm
transition-all duration-300
hover:bg-white/20
```

#### Secondary Button (İkincil Aksiyon)
```css
/* Görüntüle, İptal */
bg-gray-100 hover:bg-gray-200
text-gray-700
px-4 py-2.5
rounded-xl
font-medium text-sm
transition-all duration-300
focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
shadow-sm hover:shadow-md
```

#### Destructive Button (Yıkıcı Aksiyon)
```css
/* Sil */
bg-gray-100 hover:bg-red-50
text-gray-400 hover:text-red-600
px-4 py-2.5
rounded-xl
font-medium text-sm
transition-all duration-300
focus:ring-2 focus:ring-red-500 focus:ring-offset-2
```

### Cards

#### Portfolio Card (Modern)
```css
glass rounded-2xl p-6
hover:shadow-xl
transition-all duration-300
float-card
```

#### Content Card (Default)
```css
bg-white border border-gray-200
rounded-xl p-6
shadow-sm hover:shadow-md
transition-all duration-300
```

#### Gradient Card (Special)
```css
gradient-brand text-white
rounded-2xl p-6
shadow-xl
float-card
```

### Form Elements

#### Input Fields
```css
border border-gray-300
rounded-xl
px-4 py-3
focus:ring-2 focus:ring-blue-500 focus:border-blue-500
transition-all duration-300
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
- `⭐` → `<Star />`
- `✨` → `<Sparkles />`

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
transition-all duration-300

/* Card hover */
transition-all duration-300

/* Focus states */
transition-all duration-150
```

### Animation Delays
```css
.animation-delay-200: 200ms
.animation-delay-400: 400ms
.animation-delay-600: 600ms
.animation-delay-800: 800ms
.animation-delay-1000: 1000ms
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
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## 🎯 Component Hierarchy

### Page Structure
1. **Header** (Glass morphism)
2. **Hero Section** (Gradient background)
3. **Page Title** (h1, text-4xl, font-bold)
4. **Page Description** (p, text-gray-600)
5. **Primary Action** (Gradient Button)
6. **Content Area** (Glass Cards, Lists, Forms)

### Card Structure
1. **Card Header** (Title, Icon)
2. **Metadata** (Info, Stats)
3. **Action Buttons** (Primary, Secondary, Destructive)

### Button Hierarchy
1. **Gradient** (Hero actions) - En önemli
2. **Primary** (Solid blue) - Ana aksiyon
3. **Glass** (Modern actions) - Modern touch
4. **Secondary** (Outline gray) - İkincil aksiyon
5. **Destructive** (Subtle red) - Yıkıcı aksiyon

---

## 🚫 Anti-Patterns

### Yapılmaması Gerekenler
- ❌ Emoji kullanımı (Lucide ikonları kullanın)
- ❌ Renkli gradient arka planlar (sadece hero sections)
- ❌ Eşit boyutlu butonlar (hiyerarşi yok)
- ❌ Büyük, dikkat çekici silme butonları
- ❌ Tutarsız spacing
- ❌ Çoklu renk kullanımı
- ❌ Gereksiz gölgeler ve efektler
- ❌ Aşırı glass morphism (sadece gerekli yerlerde)

### Yapılması Gerekenler
- ✅ Minimal, temiz tasarım
- ✅ Tutarlı spacing sistemi
- ✅ Hiyerarşik buton boyutları
- ✅ Subtle hover effects
- ✅ Focus states
- ✅ Responsive design
- ✅ Accessibility considerations
- ✅ Modern glass morphism
- ✅ Smooth animations
- ✅ TikTok-worthy moments

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
- [ ] Glass morphism (gerekirse)
- [ ] Micro-interactions

### Her Sayfa İçin
- [ ] Page title (text-4xl, font-bold)
- [ ] Page description (text-gray-600)
- [ ] Proper container max-width
- [ ] Consistent card structure
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Animation delays
- [ ] Hero sections (gerekirse)

---

## 🔄 Version History

### v1.1.0 (2025-01-10) - Modern Enhancement
- Glass morphism effects
- Modern gradients
- Enhanced button variants
- Floating card animations
- Micro-interactions
- TikTok-worthy hero sections
- Animation delays
- Enhanced typography

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
- **Glass Morphism Guide**: https://css-tricks.com/glassmorphism-design-trend/

---

*Bu design system, PortfolYO platformunun tutarlı ve profesyonel görünümünü sağlamak için oluşturulmuştur. Tüm tasarım kararları bu dokümana uygun olarak alınmalıdır.* 