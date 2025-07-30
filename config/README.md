# ⚙️ PortfolYO Configuration

Bu klasör, PortfolYO platformunun konfigürasyon dosyalarını ve backup'larını içerir.

## 📁 Klasör Yapısı

```
config/
├── README.md                   # Bu dosya
└── backup/                     # Backup dosyaları
    ├── sentry.edge.config.ts.bak
    └── sentry.server.config.ts.bak
```

## 🔧 Konfigürasyon Dosyaları

### **Root Dizindeki Konfigürasyon Dosyaları**
- `next.config.ts` - Next.js konfigürasyonu
- `tailwind.config.ts` - Tailwind CSS konfigürasyonu
- `postcss.config.mjs` - PostCSS konfigürasyonu
- `eslint.config.mjs` - ESLint konfigürasyonu
- `tsconfig.json` - TypeScript konfigürasyonu
- `env.example` - Environment variables örneği

### **Backup Dosyaları**
- `sentry.edge.config.ts.bak` - Sentry edge config backup'ı
- `sentry.server.config.ts.bak` - Sentry server config backup'ı

## 🚀 Kullanım

### **Environment Variables**
```bash
# .env.local dosyası oluşturun
cp env.example .env.local

# Gerekli değerleri doldurun
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
```

### **Next.js Konfigürasyonu**
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@sentry/nextjs']
  },
  sentry: {
    hideSourceMaps: true
  }
}
```

### **Tailwind Konfigürasyonu**
```typescript
// tailwind.config.ts
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
}
```

## 📋 Konfigürasyon Kategorileri

### **Build Konfigürasyonu**
- Next.js build ayarları
- TypeScript compiler options
- PostCSS processing

### **Development Konfigürasyonu**
- ESLint rules
- Development server settings
- Hot reload configuration

### **Production Konfigürasyonu**
- Sentry monitoring
- Performance optimization
- Security settings

### **Styling Konfigürasyonu**
- Tailwind CSS setup
- Custom CSS variables
- Design tokens

## 🔧 Konfigürasyon Yönetimi

### **Development Ortamında**
```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

### **Production Ortamında**
```bash
# Production build
npm run build

# Production server
npm start
```

## 📊 Monitoring Konfigürasyonu

### **Sentry Setup**
```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
});
```

### **Performance Monitoring**
```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
});
```

## 🔒 Güvenlik

### **Environment Variables**
- `.env.local` dosyası git'e commit edilmemeli
- Production secrets güvenli şekilde saklanmalı
- Development secrets farklı olmalı

### **Backup Dosyaları**
- Backup dosyaları sadece referans için saklanır
- Production'da kullanılmamalı
- Güncel konfigürasyonlar root dizinde olmalı

## 📞 İletişim

Konfigürasyon ile ilgili sorularınız için:
- **Build Konfigürasyonu**: `next.config.ts`
- **Styling Konfigürasyonu**: `tailwind.config.ts`
- **Development Konfigürasyonu**: `eslint.config.mjs`
- **Backup Dosyaları**: `config/backup/` klasörü

---

*Bu konfigürasyon dosyaları, PortfolYO platformunun farklı ortamlarda çalışmasını sağlamak için oluşturulmuştur.* 