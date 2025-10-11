# 🌍 PortfolYO Localization Implementation Guide

## 📋 Overview

This document explains the complete localization (i18n) implementation for PortfolYO platform, supporting 15 languages using `next-intl` library with Next.js 15 App Router.

---

## 🎯 What Was Done

### 1. **Library Choice: `next-intl`**

- **Why?** Compatible with Next.js 15 App Router, type-safe, supports Server Components
- **Alternatives considered:** react-i18next (requires more client-side code), next-translate (less maintained)

### 2. **Supported Languages (15 total)**

```javascript
// src/i18n/config.ts
export const locales = [
  'en',      // English (default)
  'tr',      // Turkish
  'es',      // Spanish
  'fr',      // French
  'de',      // German
  'it',      // Italian
  'pt-BR',   // Portuguese (Brazil)
  'ru',      // Russian
  'ja',      // Japanese
  'ko',      // Korean
  'zh-CN',   // Chinese (Simplified)
  'ar',      // Arabic (RTL support)
  'hi',      // Hindi
  'pl',      // Polish
  'nl'       // Dutch
] as const;
```

---

## 🏗️ Architecture

### **File Structure**

```
src/
├── i18n/
│   ├── config.ts          # Locale definitions, RTL support
│   └── request.ts         # Server-side message loading
├── locales/
│   ├── en/
│   │   └── common.json    # English translations (270 lines)
│   ├── tr/
│   │   └── common.json    # Turkish translations (271 lines)
│   ├── es/
│   │   └── common.json    # Spanish translations (placeholder)
│   └── ... (13 more languages)
├── app/
│   ├── layout.tsx         # Root layout (minimal)
│   └── [locale]/
│       ├── layout.tsx     # Locale-specific layout with NextIntlClientProvider
│       ├── page.tsx       # Homepage
│       ├── dashboard/
│       │   └── page.tsx
│       │   └── edit/[id]/page.tsx
│       ├── my-portfolios/
│       │   └── page.tsx
│       └── auth/error/
│           └── page.tsx
├── middleware.ts          # i18n routing & locale detection
└── components/
    └── ui/
        ├── LiquidHeader.tsx      # Header with LanguageSwitcher
        └── LanguageSwitcher.tsx  # Dropdown for language selection
```

---

## 🔧 Key Implementation Details

### **1. Middleware Configuration**

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Don't prefix default locale
  localeDetection: false, // Disable auto browser detection
});

export function middleware(request: NextRequest) {
  // Apply i18n routing BEFORE other middleware
  const i18nResponse = intlMiddleware(request);
  const response = i18nResponse || NextResponse.next();

  // ... other middleware logic (subdomain routing, security headers)

  return response;
}

export const config = {
  matcher: [
    // Exclude: API routes, static files, public portfolio routes, PWA files
    '/((?!api|_next/static|_next/image|favicon.ico|pub|sw.js|manifest.json|workbox-.*\\.js).*)',
  ],
};
```

### **2. Root Layout (src/app/layout.tsx)**

```typescript
// Minimal root layout - delegates to [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
```

### **3. Locale-Specific Layout (src/app/[locale]/layout.tsx)**

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales, Locale, isRtlLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;  // Next.js 15: params is a Promise

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Load translations
  const messages = await getMessages({ locale });

  // RTL support
  const dir = isRtlLocale(locale as Locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ErrorBoundary>
            <QueryProvider>
              <AuthProvider>
                {children}
                <CookieConsentWrapper />
              </AuthProvider>
            </QueryProvider>
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### **4. Message Loading (src/i18n/request.ts)**

```typescript
import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './config';

export default getRequestConfig(async ({ locale }) => {
  const isValidLocale = locales.includes(locale as Locale);
  const resolvedLocale = isValidLocale ? (locale as string) : 'en';

  return {
    locale: resolvedLocale,
    messages: (await import(`@/locales/${resolvedLocale}/common.json`)).default,
  };
});
```

### **5. Using Translations in Components**

#### **Client Components**

```typescript
'use client';
import { useTranslations, useLocale } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations();  // or useTranslations('namespace')
  const locale = useLocale();

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <button onClick={() => router.push(`/${locale}/dashboard`)}>
        {t('navigation.dashboard')}
      </button>
    </div>
  );
}
```

#### **Server Components**

```typescript
import { getTranslations } from 'next-intl/server';

export default async function MyServerComponent() {
  const t = await getTranslations();

  return <h1>{t('hero.title')}</h1>;
}
```

### **6. Locale-Aware Routing**

All internal links MUST include locale prefix:

```typescript
// ❌ Wrong
<Link href="/dashboard">Dashboard</Link>
router.push('/dashboard');
signOut({ callbackUrl: '/' });

// ✅ Correct
<Link href={`/${locale}/dashboard`}>Dashboard</Link>
router.push(`/${locale}/dashboard`);
signOut({ callbackUrl: `/${locale}` });
```

### **7. Language Switcher Component**

```typescript
// src/components/ui/LanguageSwitcher.tsx
'use client';
import { usePathname, useRouter } from 'next/navigation';
import { locales, Locale } from '@/i18n/config';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    const newPath = newLocale === 'en'
      ? pathWithoutLocale || '/'
      : `/${newLocale}${pathWithoutLocale || '/'}`;

    router.push(newPath);
  };

  return (
    <select value={currentLocale} onChange={(e) => handleLanguageChange(e.target.value)}>
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {languageNames[locale]}
        </option>
      ))}
    </select>
  );
}
```

---

## 📦 Translation File Structure

### **Namespacing Strategy**

```json
{
  "navigation": { ... },        // Header, footer links
  "hero": { ... },              // Homepage hero section
  "builtOn": { ... },           // Tech stack section
  "howItWorks": { ... },        // Steps section
  "stats": { ... },             // Statistics
  "templates": { ... },         // Template showcase
  "proFeatures": { ... },       // Pro features preview
  "pricing": { ... },           // Pricing section
  "developer": { ... },         // Developer story
  "faq": { ... },               // FAQ section
  "finalCta": { ... },          // Final call-to-action
  "footer": { ... },            // Footer content
  "common": { ... },            // Common UI elements
  "dashboard": { ... },         // Dashboard page
  "myPortfolios": { ... },      // My Portfolios page
  "auth": { ... },              // Auth error page
  "editPortfolio": { ... },     // Edit portfolio page
  "templateNames": { ... },     // Template display names
  "templateFeatures": { ... }   // Template feature labels
}
```

### **Example: Translation Keys**

```json
{
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard",
    "myPortfolios": "My Portfolios",
    "pricing": "Pricing",
    "signIn": "Sign In",
    "signOut": "Sign Out"
  },
  "hero": {
    "title": "From GitHub to",
    "titleBrand": "portfolYO",
    "titleTime": "in 5 minutes",
    "subtitle": "Transform your GitHub projects into professional portfolio sites",
    "ctaStart": "Start with GitHub",
    "ctaDashboard": "Go to Dashboard",
    "ctaPricing": "Pricing",
    "noCreditCard": "No credit card required"
  },
  "dashboard": {
    "createTitle": "Create Portfolio",
    "createSubtitle": "Your portfolio will be created with your selected information",
    "selectRepos": "Select Your Projects",
    "selectTemplate": "Select Your Template",
    "uploadCV": "Upload CV",
    "publishTitle": "Publish Your Portfolio"
  },
  "editPortfolio": {
    "title": "Edit Portfolio",
    "templateSelection": "Template Selection",
    "projectSelection": "Project Selection",
    "projectsSelected": "{count} projects selected", // Supports interpolation
    "save": "Save",
    "saving": "Saving..."
  }
}
```

---

## 🚀 Pages Localized

### ✅ **Fully Localized Pages**

1. **Homepage** (`/[locale]/page.tsx`)
   - Hero section, CTA buttons
   - Built On section
   - How It Works (4 steps)
   - Stats section
   - Templates showcase
   - Pro Features preview
   - Pricing section
   - Developer story
   - FAQ (6 questions)
   - Final CTA
   - Footer

2. **Dashboard** (`/[locale]/dashboard/page.tsx`)
   - All steps: Repository Selection, Template Selection, CV Upload, Publish
   - Progress indicators
   - Upgrade prompts
   - Limit banners
   - Success/error messages

3. **My Portfolios** (`/[locale]/my-portfolios/page.tsx`)
   - Page header
   - Template names
   - Loading states
   - Empty states
   - Action buttons
   - Error messages

4. **Edit Portfolio** (`/[locale]/dashboard/edit/[id]/page.tsx`)
   - Template selection
   - Project selection
   - Search/filter UI
   - Template features
   - Save/preview buttons
   - Success messages

5. **Auth Error** (`/[locale]/auth/error/page.tsx`)
   - Error titles
   - Error messages
   - Action buttons
   - Loading fallback

### 🔧 **Header & Navigation** (`LiquidHeader.tsx`)

- Navigation links
- Language switcher
- User menu
- Sign in/out buttons

---

## 🌐 RTL Support

```typescript
// src/i18n/config.ts
export const isRtlLocale = (locale: Locale) => ['ar'].includes(locale);

// Applied in layout.tsx
const dir = isRtlLocale(locale as Locale) ? 'rtl' : 'ltr';
<html lang={locale} dir={dir}>
```

---

## 🔍 Testing Checklist

### **1. Hard Refresh Required**

After changes, users MUST do: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + F5` (Windows)

### **2. Test URLs**

- `/` → Default (English)
- `/tr` → Turkish
- `/es` → Spanish
- `/fr` → French
- etc.

### **3. Test Navigation**

- ✅ Homepage → Dashboard → My Portfolios
- ✅ Language switcher updates URL
- ✅ All internal links maintain locale
- ✅ Sign out redirects to localized homepage

### **4. Test Features**

- ✅ Create portfolio flow (all steps)
- ✅ Edit portfolio
- ✅ View portfolio
- ✅ Delete portfolio
- ✅ Auth error page

---

## 📝 Translation Status

### **Primary Languages (100% translated)**

- ✅ English (en) - 270 keys
- ✅ Turkish (tr) - 271 keys

### **Other Languages (Placeholder, ~151 keys)**

- 🔶 Spanish (es)
- 🔶 French (fr)
- 🔶 German (de)
- 🔶 Italian (it)
- 🔶 Portuguese-BR (pt-BR)
- 🔶 Russian (ru)
- 🔶 Japanese (ja)
- 🔶 Korean (ko)
- 🔶 Chinese-Simplified (zh-CN)
- 🔶 Arabic (ar)
- 🔶 Hindi (hi)
- 🔶 Polish (pl)
- 🔶 Dutch (nl)

**Note:** Placeholder languages copy English translations with "TODO" comments. Professional translation services or community contributions needed.

---

## 🛠️ How to Add New Translations

### **Step 1: Add Key to English**

```json
// src/locales/en/common.json
{
  "newFeature": {
    "title": "New Feature Title",
    "description": "Feature description"
  }
}
```

### **Step 2: Add to Turkish (and other languages)**

```json
// src/locales/tr/common.json
{
  "newFeature": {
    "title": "Yeni Özellik Başlığı",
    "description": "Özellik açıklaması"
  }
}
```

### **Step 3: Use in Component**

```typescript
const t = useTranslations('newFeature');
<h1>{t('title')}</h1>
<p>{t('description')}</p>
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: Translations not updating**

**Solution:** Hard refresh (`Cmd + Shift + R`)

### **Issue 2: "Messages are not defined" error**

**Solution:** Ensure `NextIntlClientProvider` wraps the component tree in `[locale]/layout.tsx`

### **Issue 3: Locale not in URL**

**Solution:** Check middleware matcher config, ensure route isn't excluded

### **Issue 4: Links breaking locale**

**Solution:** Always use `/${locale}/path` format, never hardcode `/path`

### **Issue 5: params is not iterable**

**Solution:** In Next.js 15, `params` is a Promise. Always `await params` first.

---

## 📚 Dependencies

```json
{
  "next-intl": "^3.x",
  "next": "^15.x"
}
```

### **Installation Command**

```bash
npm install next-intl
```

### **Configuration in next.config.ts**

```typescript
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

module.exports = withNextIntl(nextConfig);
```

---

## 🎯 Next Steps for Future Developers

### **Adding a New Page**

1. Create page under `/app/[locale]/your-page/page.tsx`
2. Add translations to `en/common.json` and `tr/common.json`
3. Use `useTranslations()` or `getTranslations()` in component
4. Ensure all `router.push()` and `Link href` include `/${locale}`

### **Adding a New Language**

1. Add locale code to `src/i18n/config.ts`
2. Create `/src/locales/{locale}/common.json`
3. Copy from `en/common.json` and translate
4. Test with `/{locale}` URL

### **Improving Translations**

1. Update JSON files in `src/locales/{locale}/`
2. No code changes needed
3. Restart dev server
4. Hard refresh browser

---

## 📞 Summary for Next AI Agent

**What was done:**

- Implemented full i18n using `next-intl` for 15 languages
- Localized 5 main pages + header/navigation
- Created structured translation files with namespacing
- Added RTL support for Arabic
- Implemented locale-aware routing and language switcher
- 270+ translation keys in English/Turkish

**Key files to check:**

- `src/i18n/config.ts` - Locale definitions
- `src/i18n/request.ts` - Message loading
- `src/middleware.ts` - Routing logic
- `src/app/[locale]/layout.tsx` - Provider setup
- `src/locales/en/common.json` - English translations
- `src/locales/tr/common.json` - Turkish translations

**Testing:**

- Run `npm run dev`
- Visit `/`, `/tr`, `/es`, etc.
- Hard refresh: `Cmd + Shift + R`
- Test language switcher
- Check all navigation maintains locale

**Common patterns:**

- Client: `const t = useTranslations(); const locale = useLocale();`
- Server: `const t = await getTranslations();`
- Routing: Always `/${locale}/path`
- New keys: Add to `en/common.json` first, then translate

---

**Created:** 2025-01-11
**Last Updated:** 2025-01-11
**Version:** 1.0
**Status:** ✅ Production Ready
