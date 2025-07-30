# 🚀 PortfolYO Platform

GitHub projelerinizi 5 dakikada profesyonel portfolyoya dönüştüren platform.

## 🎯 Özellikler

- **⚡ Hızlı Oluşturma**: 5 dakikada portfolyo
- **🎨 Profesyonel Şablonlar**: 6 farklı tasarım
- **🔗 GitHub Entegrasyonu**: Otomatik proje yükleme
- **📱 Responsive Design**: Tüm cihazlarda mükemmel
- **🎯 AI Destekli**: Akıllı içerik önerileri

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm/yarn/pnpm
- GitHub hesabı

### Kurulum
```bash
# Repository'yi klonlayın
git clone https://github.com/your-username/portfolyo-platform.git
cd portfolyo-platform

# Bağımlılıkları yükleyin
npm install

# Environment variables'ları ayarlayın
cp env.example .env.local

# Development server'ı başlatın
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresinden platforma erişebilirsiniz.

## 📚 Dokümantasyon

### **🎯 Brand Identity**
- [Brand Identity](./docs/brand-identity/README.md) - Marka kimliği ana sayfası
- [Brand Identity Guide](./docs/brand-identity/BRAND_IDENTITY.md) - Kapsamlı marka kimliği
- [Brand Audit Report](./docs/brand-identity/BRAND_AUDIT_REPORT.md) - Brand audit raporu
- [Design System](./docs/brand-identity/DESIGN_SYSTEM.md) - Detaylı design system
- [Design System README](./docs/brand-identity/DESIGN_SYSTEM_README.md) - Hızlı başvuru

### **🔧 Teknik Dokümantasyon**
- [Docs Ana Sayfa](./docs/README.md) - Tüm dokümantasyon
- [Setup Guides](./docs/setup/) - Kurulum kılavuzları
- [Testing](./docs/testing/) - Test raporları
- [Technical](./docs/technical/) - Teknik dokümanlar

## 🎨 Design System

PortfolYO, tutarlı ve profesyonel bir design system kullanır:

### **Renk Paleti**
```css
--brand-primary: #2563EB    /* Ana marka rengi */
--brand-secondary: #1D4ED8  /* Hover states */
--gray-50: #F9FAFB         /* Background */
--gray-600: #4B5563        /* Text */
```

### **Typography**
```css
font-family: 'Inter', sans-serif
font-weights: 400, 500, 600, 700
type-scale: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl
```

### **Component'lar**
- `Button` - Primary, secondary, destructive variants
- `Card` - Portfolio ve content cards
- `IconButton` - Icon-only buttons
- `Logo` - Brand logo component
- `BrandCompliance` - Brand compliance checker

## 🏗️ Proje Yapısı

```
portfolyo-platform/
├── docs/                   # Dokümantasyon
│   ├── brand-identity/     # Marka kimliği
│   ├── setup/             # Kurulum kılavuzları
│   ├── testing/           # Test raporları
│   └── technical/         # Teknik dokümanlar
├── scripts/               # Test ve utility script'leri
│   ├── tests/             # Test script'leri
│   └── performance/       # Performance script'leri
├── config/                # Konfigürasyon dosyaları
│   └── backup/            # Backup dosyaları
├── src/                   # Kaynak kod
│   ├── app/               # Next.js app router
│   ├── components/        # React component'ları
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript type definitions
├── public/                # Statik dosyalar
│   └── templates/         # Portfolio şablonları
└── database/              # Database schema
```

## 🎯 Brand Compliance

### **Mevcut Skor: 75/100**

| Kategori | Skor | Durum |
|----------|------|-------|
| Design System | 95/100 | ✅ Excellent |
| Color System | 90/100 | ✅ Excellent |
| Typography | 85/100 | ✅ Good |
| Components | 80/100 | ✅ Good |
| Logo System | 30/100 | ❌ Poor |
| Asset Management | 40/100 | ❌ Poor |
| Voice & Tone | 60/100 | ⚠️ Fair |

### **Hedef: 90/100** (3 ay)

## 🚀 Deployment

### Vercel (Önerilen)
```bash
# Vercel CLI ile
npm i -g vercel
vercel

# GitHub ile
# Repository'yi Vercel'e bağlayın
```

### Environment Variables
```bash
# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# Database
DATABASE_URL=your_database_url

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_app_url
```

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🎉 Teşekkürler

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Lucide](https://lucide.dev) - Icon library
- [Supabase](https://supabase.com) - Database
- [Vercel](https://vercel.com) - Deployment platform

---

**PortfolYO** - GitHub projelerinizi 5 dakikada portfolyoya dönüştürün! 🚀
