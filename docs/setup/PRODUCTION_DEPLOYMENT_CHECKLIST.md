# ✅ Production Deployment Checklist

Bu checklist'i her production deployment öncesi kontrol et.

## 🚨 Kritik Güvenlik

- [ ] `.env.local` ve `.env.production` dosyaları `.gitignore`'da
- [ ] Hiçbir secret git history'de yok (kontrol: `git log --all -- .env*`)
- [ ] Production secret'ları Vercel environment variables'da
- [ ] Development ve Production farklı secret'lar kullanıyor

## 🔐 Servis Ayrımı

### Supabase

- [ ] Development DB ayrı proje
- [ ] Production DB ayrı proje
- [ ] RLS (Row Level Security) aktif
- [ ] Backup stratejisi var

### GitHub OAuth

- [ ] Development OAuth App: `http://localhost:3000/api/auth/callback/github`
- [ ] Production OAuth App: `https://portfolyo.tech/api/auth/callback/github`
- [ ] İki app farklı secret'lar kullanıyor

### Stripe

- [ ] Development: `sk_test_*` ve `pk_test_*`
- [ ] Production: `sk_live_*` ve `pk_live_*`
- [ ] Webhooks ayrı endpoint'ler kullanıyor
- [ ] Test mode'dan live mode'a geçiş yapıldı

### Redis (Upstash)

- [ ] Development Redis ayrı database
- [ ] Production Redis ayrı database
- [ ] Rate limiting aktif

### Sentry

- [ ] Development environment ayarlı
- [ ] Production environment ayarlı
- [ ] Release tracking aktif
- [ ] Source maps yükleniyor

## 🌐 Domain & URL

- [ ] `NEXT_PUBLIC_APP_URL` doğru domain
- [ ] HTTPS sertifikası geçerli
- [ ] DNS kayıtları doğru
- [ ] Redirect kuralları çalışıyor (www → non-www vb.)

## 🔄 CI/CD

- [ ] Main branch protected
- [ ] PR required before merge
- [ ] Otomatik testler geçiyor
- [ ] Preview deployments çalışıyor
- [ ] Production deploy sadece main'den

## 🧪 Testing

- [ ] Unit testler geçiyor
- [ ] Integration testler geçiyor
- [ ] Smoke test production'da çalıştı
- [ ] Critical flows manuel test edildi

## 📊 Monitoring & Observability

- [ ] Sentry error tracking aktif
- [ ] Analytics çalışıyor
- [ ] Performance monitoring aktif
- [ ] Uptime monitoring kurulu
- [ ] Alert'ler ayarlı

## 🗄️ Database

- [ ] Migration'lar test edildi
- [ ] Backup alındı
- [ ] Rollback planı hazır
- [ ] Data retention policies aktif

## 🔧 Environment Variables

Run: `./scripts/validate-prod-secrets.sh`

- [ ] `NEXTAUTH_URL` HTTPS
- [ ] `NEXTAUTH_SECRET` güçlü ve unique
- [ ] `GITHUB_CLIENT_ID` production app
- [ ] `GITHUB_CLIENT_SECRET` production app
- [ ] `NEXT_PUBLIC_SUPABASE_URL` production DB
- [ ] `SUPABASE_SERVICE_ROLE_KEY` production key
- [ ] `STRIPE_SECRET_KEY` live mode (`sk_live_*`)
- [ ] `STRIPE_PUBLISHABLE_KEY` live mode (`pk_live_*`)
- [ ] `UPSTASH_REDIS_REST_URL` production instance
- [ ] `SENTRY_DSN` production project

## 📝 Documentation

- [ ] `CHANGELOG.md` güncellendi
- [ ] API changes dokümante edildi
- [ ] README güncel
- [ ] Migration guide hazır (breaking changes varsa)

## 👥 Team Communication

- [ ] Team'e deploy bilgisi verildi
- [ ] Deployment window belirlendi
- [ ] Rollback prosedürü paylaşıldı
- [ ] On-call schedule güncel

## 🚀 Deployment

### Pre-deployment

```bash
# 1. Son testleri çalıştır
npm run test
npm run build

# 2. Secret'ları validate et
./scripts/validate-prod-secrets.sh

# 3. Branch'i güncel tut
git pull origin main

# 4. Changelog oluştur
git log --oneline $(git describe --tags --abbrev=0)..HEAD
```

### Deployment

```bash
# Vercel CLI
vercel --prod

# veya GitHub'a push (otomatik deploy)
git push origin main
```

### Post-deployment

```bash
# 1. Smoke test
curl -I https://portfolyo.tech
curl -I https://portfolyo.tech/api/health

# 2. Sentry'de yeni release'i kontrol et
# 3. Analytics dashboard'ı kontrol et
# 4. Error rate'i izle (ilk 15 dakika)

# 5. Rollback gerekirse
vercel rollback
```

## 🆘 Rollback Plan

Eğer kritik hata varsa:

```bash
# Vercel'de önceki deployment'a dön
vercel rollback

# veya spesifik deployment
vercel inspect <deployment-url>
vercel promote <deployment-url>
```

Database rollback:

```bash
# Supabase'de backup'tan restore
# Migration'ı geri al (down migration)
```

## 📞 Emergency Contacts

- **On-call Developer**: [İsim]
- **DevOps**: [İsim]
- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **Stripe Support**: https://support.stripe.com

## 🎯 Sign-off

- [ ] Developer checked all items
- [ ] QA approved
- [ ] Product owner approved
- [ ] DevOps reviewed

**Deployed by**: ******\_\_\_******  
**Date**: ******\_\_\_******  
**Time**: ******\_\_\_******  
**Deployment ID**: ******\_\_\_******

---

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/berkezaps-projects/portfolyo-platform
- Supabase Dashboard: https://supabase.com/dashboard
- Stripe Dashboard: https://dashboard.stripe.com
- Sentry Dashboard: https://sentry.io
- GitHub Repository: https://github.com/berkezap/portfolyo-platform

---

**Last Updated**: 2025-10-03
