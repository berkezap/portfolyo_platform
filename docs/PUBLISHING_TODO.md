### Free v1 — Subdomain Yayınlama (Model B) TODO Listesi

Amaç: Kullanıcı başına tek yayın (subdomain) kuralı ile `https://<slug>.portfolyo.tech` altında portfolyonun statik HTML olarak, veritabanından (published_html) servis edilmesi. Güvenlik için çok sıkı CSP, performans için CDN cache.

---

#### 0) Ön Koşullar (Sen)

- [ ] `portfolyo.tech` alan adını Vercel projesine ekle
- [ ] Wildcard DNS: `*.portfolyo.tech` → CNAME `cname.vercel-dns.com`
- [ ] Apex `portfolyo.tech` → Vercel (A/ALIAS veya CNAME flattening)
- [ ] (İsteğe bağlı) `www.portfolyo.tech` → CNAME `portfolyo.tech`

Doğrulama:

- [ ] Vercel Domains ekranında `portfolyo.tech` ve `*.portfolyo.tech` doğrulandı/sertifika hazır

---

#### 1) DB Migrasyonu (Supabase) — (Manuel SQL)

- [ ] `portfolios` tablosuna yayın alanlarını ekle
- [ ] Kullanıcı başına tek yayın (is_published=true) kısıtı

SQL:

```sql
ALTER TABLE portfolios
  ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS public_slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS published_html text,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'public' CHECK (visibility IN ('private','unlisted','public'));

-- Kullanıcı başına en fazla 1 yayın (is_published=true) kısıtı
CREATE UNIQUE INDEX IF NOT EXISTS uniq_published_per_user
  ON portfolios (user_id)
  WHERE is_published = true;
```

Doğrulama:

- [ ] Supabase SQL Editor’da başarıyla çalıştı
- [ ] `SELECT * FROM portfolios LIMIT 1;` ile kolonlar görünüyor

---

#### 2) Ortam Değişkenleri (Repo)

- [ ] `.env.local` içine `NEXT_PUBLIC_APP_URL=https://portfolyo.tech`

---

#### 3) Tip/Model Güncellemesi (Repo)

- [ ] `src/lib/supabase.ts` → `Portfolio` arayüzüne ekle:
  - [ ] `published_html?: string`
  - [ ] `is_published?: boolean`
  - [ ] `public_slug?: string`
  - [ ] `published_at?: string`
  - [ ] `visibility?: 'private' | 'unlisted' | 'public'`

---

#### 4) Publish/Unpublish API (Repo)

- [ ] Publish endpoint: `POST /api/portfolio/[id]/publish`
  - [ ] Auth + sahiplik kontrolü
  - [ ] Slug normalize: `^[a-z0-9-]{3,30}$`, trim/normalize; rezerve liste (`www, api, app, admin, static, cdn`)
  - [ ] Global benzersizlik kontrolü (`public_slug`)
  - [ ] Kullanıcı başına tek yayın: farklı bir kayıt zaten yayındaysa 409 döndür
  - [ ] `generated_html` → `published_html`, `is_published=true`, `public_slug`, `published_at=now()`, `visibility='public'`
  - [ ] Yanıt: `publicUrl = https://<slug>.portfolyo.tech`

- [ ] Unpublish endpoint: `POST /api/portfolio/[id]/unpublish`
  - [ ] Auth + sahiplik kontrolü
  - [ ] `is_published=false`

Doğrulama:

- [ ] Slug çakışmasında 409
- [ ] Yayınlı kayıt var ve farklı bir kaydı publish etmeye çalışınca 409
- [ ] Başarılı publish → 200 + publicUrl

---

#### 5) Subdomain Yönlendirme (Repo)

- [ ] `src/middleware.ts` içinde host-bazlı rewrite
  - [ ] `*.portfolyo.tech` ve rezerve subdomain’ler hariç: `__pub` route’una `slug` query ile rewrite

Örnek mantık:

```ts
const host = request.headers.get('host') || '';
if (host.endsWith('portfolyo.tech') && host.split('.').length >= 3) {
  const sub = host.split('.')[0];
  const reserved = ['www', 'api', 'app', 'admin', 'static', 'cdn'];
  if (!reserved.includes(sub)) {
    const url = request.nextUrl.clone();
    url.pathname = '/__pub';
    url.searchParams.set('slug', sub);
    return NextResponse.rewrite(url);
  }
}
```

---

#### 6) Public İçerik Route’u (Repo)

- [ ] `src/app/__pub/route.ts` oluştur
  - [ ] `runtime = 'edge'`
  - [ ] Supabase’den `published_html, is_published, visibility` oku (`public_slug=slug`)
  - [ ] 404 koşulları: kayıt yok | `is_published=false` | `visibility='private'` | `published_html` boş
  - [ ] Yanıt: `text/html; charset=utf-8`
  - [ ] Cache: `Cache-Control: public, max-age=300, s-maxage=600`
  - [ ] Çok sıkı CSP: `default-src 'none'; style-src 'self' 'unsafe-inline'; img-src https: data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'`

Doğrulama:

- [ ] `https://<slug>.portfolyo.tech` HTML döndürüyor
- [ ] 404 senaryoları doğru

---

#### 7) Düzenleme → Canlı Güncelleme (Repo)

- [ ] `PATCH /api/portfolio/[id]` akışına ek mantık:
  - [ ] Render sonrası eğer kayıt `is_published=true` ise `published_html` da güncellensin

Doğrulama:

- [ ] Edit sonrası public sayfa kısa sürede yeni HTML’i gösteriyor (cache süresi dolunca)

---

#### 8) Dashboard UI (Repo)

- [ ] `src/app/dashboard/edit/[id]/page.tsx` içine:
  - [ ] `slug` input’u (normalize hint)
  - [ ] “Yayınla” butonu → `POST /api/portfolio/{id}/publish`
  - [ ] “Yayından Kaldır” butonu → `POST /api/portfolio/{id}/unpublish`
  - [ ] Yayındaysa kopyalanabilir link: `https://<slug>.portfolyo.tech`

Doğrulama:

- [ ] UI’dan publish/unpublish akışları sorunsuz

---

#### 9) Güvenlik

- [ ] NextAuth cookie domain’ini subdomain’lere yaymayın (host-only bırakın)
- [ ] Public route’ta sıkı CSP başlıkları set ediliyor
- [ ] XSS yüzeyi: script yok, inline style izni sınırlı

---

#### 10) Test & Kabul Kriterleri

- [ ] Publish → `https://<slug>.portfolyo.tech` çalışıyor
- [ ] Unpublish → aynı URL 404
- [ ] Aynı kullanıcı için ikinci yayın denemesi → 409
- [ ] Slug çakışması → 409
- [ ] Edit → kısa süre sonra public sayfada yeni HTML (cache sonrasında)

---

#### 11) İzleme / Gözlemleme (Opsiyonel)

- [ ] Sentry etiketleri: publish/unpublish/public route hata/ratio
- [ ] Vercel Analytics/Logs: Edge request, cache hit/miss gözlemi

---

#### 12) Sonraki Aşama (Pro için hazırlık — notlar)

- [ ] Subdomain → özel domain desteği: `custom_domain`, doğrulama, sertifika
- [ ] Versiyonlama ve rollback (revision numarası)
- [ ] OG Image üretimi, gelişmiş SEO
