# Velaris House

Butik otel rezervasyon sitesi. pnpm workspace olarak yapılandırılmış bir monorepo; ana uygulama `artifacts/hotel-reserve` altındaki Türkçe, premium hissiyatlı rezervasyon frontend'i.

## Workspace yapısı

```
artifacts/
  hotel-reserve/     # Ana frontend uygulaması (React + Vite + TypeScript)
  api-server/        # Express backend (workspace içinde yer alıyor)
  mockup-sandbox/     # Tasarım/mockup sandbox'ı
lib/
  api-client-react/  # Paylaşılan fetch/API client (customFetch, ApiError, setBaseUrl)
  api-spec/          # OpenAPI spec ve codegen
  api-zod/           # Zod şemaları
  db/                # Drizzle ORM DB katmanı
scripts/             # Workspace yardımcı scriptleri
```

## hotel-reserve

- Rota yapısı Türkçe: `/`, `/odalar`, `/odalar/:slug`, `/rezervasyon`, `/rezervasyonlarim`, `/rezervasyonlarim/:id`, `/iletisim`, `/giris`, `/kayit`
- Kimlik doğrulama: JWT access/refresh token'ları `src/lib/auth.tsx` içinde localStorage'da tutulur; `src/lib/api.ts` 401 durumunda otomatik token refresh dener
- API katmanı: `src/services/` altında (`rooms.ts`, `reservations.ts`), bazı statik/örnek veriler `src/data/mock.ts` içinde
- Backend: harici bir Django API'sine bağlanır (bu repo'ya backend eklenmez) — adres `VITE_API_BASE_URL` ortam değişkeniyle ayarlanır, varsayılan `http://127.0.0.1:8000/api`

## Geliştirmeye başlama

```bash
pnpm install

# hotel-reserve için ortam değişkenlerini ayarla
cp artifacts/hotel-reserve/.env.example artifacts/hotel-reserve/.env.local
# VITE_API_BASE_URL değerini çalışan Django API adresine göre düzenle

pnpm --filter @workspace/hotel-reserve run dev
```

## Genel komutlar

- `pnpm run typecheck` — tüm paketlerde tip kontrolü
- `pnpm run build` — typecheck + tüm paketleri derleme
- `pnpm --filter @workspace/hotel-reserve run dev` — hotel-reserve dev sunucusu
- `pnpm --filter @workspace/hotel-reserve run build` — hotel-reserve üretim derlemesi

## Stack

- pnpm workspaces, TypeScript
- Frontend: React 19, Vite, Tailwind CSS, Radix UI, TanStack Query, wouter (routing), React Hook Form + Zod
