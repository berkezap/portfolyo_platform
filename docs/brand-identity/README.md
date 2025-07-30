# 🎯 PortfolYO Brand Identity

Bu klasör, PortfolYO platformunun tüm marka kimliği dokümanlarını ve asset'lerini içerir.

## 📁 Klasör Yapısı

```
docs/brand-identity/
├── README.md                    # Bu dosya
├── BRAND_IDENTITY.md           # Kapsamlı marka kimliği
├── BRAND_AUDIT_REPORT.md       # Brand audit raporu
├── DESIGN_SYSTEM.md            # Detaylı design system
├── DESIGN_SYSTEM_README.md     # Hızlı başvuru kılavuzu
└── brand-assets/               # Marka asset'leri
    └── logos/                  # Logo dosyaları
        ├── portfolyo-logo.svg
        ├── portfolyo-icon.svg
        ├── portfolyo-favicon.svg
        └── logo-usage.md
```

## 📚 Dokümanlar

### **🎯 BRAND_IDENTITY.md**
PortfolYO'nun kapsamlı marka kimliği dokümanı:
- Marka stratejisi (Purpose, Vision, Mission, Values)
- Visual identity system
- Brand voice & tone
- Component guidelines
- Cross-platform harmonization

### **📊 BRAND_AUDIT_REPORT.md**
Platform genelinde yapılan brand audit raporu:
- Mevcut durum değerlendirmesi
- Compliance metrics
- Implementation roadmap
- Action items

### **🎨 DESIGN_SYSTEM.md**
Detaylı design system dokümanı:
- Renk paleti
- Typography sistemi
- Spacing sistemi
- Component guidelines
- Icon sistemi

### **⚡ DESIGN_SYSTEM_README.md**
Hızlı başvuru kılavuzu:
- Component kullanımı
- Renk kullanımı
- Spacing kuralları
- Implementation checklist

## 🎨 Brand Assets

### **Logos**
- **portfolyo-logo.svg**: Ana logo (GitHub + Portfolio + Text)
- **portfolyo-icon.svg**: Icon logo (PY)
- **portfolyo-favicon.svg**: Favicon (32x32px)
- **logo-usage.md**: Logo kullanım kılavuzu

### **Logo Varyasyonları**
1. **Full Logo**: Ana sayfa, header, footer
2. **Icon Logo**: Favicon, küçük alanlar, mobil
3. **Text Logo**: Sadece metin olarak

## 🚀 Hızlı Başlangıç

### **Logo Kullanımı**
```tsx
import Logo from '@/components/ui/Logo'

// Full logo
<Logo variant="full" size="lg" />

// Icon logo
<Logo variant="icon" size="md" />

// Text logo
<Logo variant="text" size="sm" />
```

### **Design Tokens**
```tsx
import { brand } from '@/lib/design-tokens'

// Renk kullanımı
const primaryColor = brand.colors.primary[600]

// Typography
const fontFamily = brand.typography.fontFamily.sans
```

### **Brand Compliance**
```tsx
import BrandCompliance from '@/components/ui/BrandCompliance'

<BrandCompliance 
  componentName="MyComponent"
  checks={brandComplianceChecks.colors}
/>
```

## 📋 Implementation Checklist

### **✅ Tamamlanan**
- [x] Marka kimliği dokümanı
- [x] Logo sistemi
- [x] Design tokens
- [x] Brand compliance component
- [x] Asset organizasyonu

### **🔄 Devam Eden**
- [ ] Logo implementation (tüm sayfalarda)
- [ ] Voice & tone guidelines
- [ ] Dark mode support
- [ ] Component documentation

### **📅 Planlanan**
- [ ] Brand testing
- [ ] User feedback analysis
- [ ] Marketing materials
- [ ] Community guidelines

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

## 📞 İletişim

Marka kimliği ile ilgili sorularınız için:
- **Design System**: `DESIGN_SYSTEM.md`
- **Logo Kullanımı**: `brand-assets/logos/logo-usage.md`
- **Brand Compliance**: `BRAND_AUDIT_REPORT.md`

---

*Bu klasör, PortfolYO platformunun tutarlı ve güçlü bir marka kimliği sunmasını sağlamak için oluşturulmuştur.* 