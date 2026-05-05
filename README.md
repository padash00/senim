# Сенім — корпоративный сайт центра

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase. Три языка: kk (по умолчанию), ru, en. Полноценная админка для редактирования всего контента без правки кода.

## Стек

- Next.js 15, React 19, TypeScript
- Tailwind CSS + shadcn/ui (radix primitives)
- next-intl — i18n с префиксами URL `/kk|/ru|/en`
- Supabase: PostgreSQL + Auth + Storage; `@supabase/ssr` для куки-based аутентификации
- React Hook Form + Zod
- sonner — тосты, lucide-react — иконки

## Быстрый старт

```bash
pnpm install
cp .env.example .env.local
# заполните NEXT_PUBLIC_SUPABASE_URL, ANON, SERVICE_ROLE и т.д.

# В Supabase Dashboard или через CLI применить миграции из supabase/migrations
# затем (опционально) сгенерировать типы:
pnpm db:types

pnpm dev
```

## Структура

```
app/
  [locale]/        — публичный сайт
  admin/           — админка (без локали)
components/
  ui/              — shadcn-примитивы
  site/            — публичные блоки
  admin/           — компоненты админки
lib/
  supabase/        — clients (browser, server, admin), типы
  i18n/            — конфиг, routing, navigation, request
  validators/      — Zod-схемы
messages/          — словари ui-строк (3 языка)
supabase/
  migrations/      — SQL: tables, RLS, seed
```

## Этапы разработки

1. **Scaffolding & config** — этот файл, Tailwind, i18n, supabase clients, middleware.
2. **SQL** — таблицы, RLS, seed.
3. **UI-компоненты** — shadcn-примитивы, Header/Footer, формы.
4. **Публичные страницы** — `/`, `/about`, `/services`, `/services/[slug]`, `/specialists`, `/parents`, `/reviews`, `/contacts`, `/blog`, `/blog/[slug]`.
5. **Админка** — login, dashboard, CRUD по 13 разделам.
6. **SEO/инфра** — sitemap, robots, 404/loading/error, OG.

## Безопасность

- `SUPABASE_SERVICE_ROLE_KEY` используется только в `lib/supabase/admin.ts` (помечен `import 'server-only'`).
- RLS на всех таблицах; публичный анон может только читать `is_published = true` и **только создавать** заявки.
- Маршруты `/admin/*` защищены middleware: проверяется Supabase Auth + наличие записи в `admin_profiles` (или email в `ADMIN_ALLOWED_EMAILS`).
- Форма заявки имеет honeypot-поле `website` и серверную Zod-валидацию.
