# Деплой: GitHub → Vercel → Supabase

Без локалки. Всё в трёх вкладках браузера.

---

## 1. Supabase — создаём проект

1. Зайти на https://supabase.com/dashboard → **New project**
   - Name: `senim`
   - Region: ближайший (Frankfurt / Mumbai)
   - Database password: записать в надёжное место.
2. После готовности проекта — **Project Settings → API**, скопировать:
   - `Project URL` → это `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` ключ → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` ключ → `SUPABASE_SERVICE_ROLE_KEY` (никому не показывать)
   - `Project ID` (короткий, в URL) → `SUPABASE_PROJECT_ID`

## 2. Supabase — применяем миграции

В **SQL Editor** запустить по очереди (всё лежит в `supabase/migrations/`):

1. `0001_create_tables.sql` — таблицы, enum’ы, триггеры `updated_at`.
2. `0002_rls_policies.sql` — RLS + bucket `media` для Storage.
3. `0003_seed_data.sql` — стартовые тексты на 3 языках.
4. `0004_bootstrap_admin.sql` — **сначала**: Authentication → Users → Add user (поставь Auto confirm), **потом** в этом файле заменить `CHANGE_ME@example.com` на тот же email и запустить.

После этого можно зайти в `/admin/login` под этим email/паролем.

## 3. GitHub — пушим код

```bash
cd /Users/arystanbekkeneskanov/Desktop/senim
git init
git add .
git commit -m "Initial: scaffolding + Supabase migrations"
# Создать пустой репозиторий на github.com (без README), затем:
git branch -M main
git remote add origin git@github.com:<your-user>/senim.git
git push -u origin main
```

## 4. Vercel — деплоим

1. https://vercel.com/new → **Import** репозиторий `senim`.
2. Framework Preset: **Next.js** (определится автоматически).
3. **Environment Variables** — вставить:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | из Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | из Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | из Supabase (Sensitive) |
   | `SUPABASE_PROJECT_ID` | из Supabase |
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-vercel-domain>` |
   | `NEXT_PUBLIC_DEFAULT_LOCALE` | `kk` |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | например `77000000000` (без +) |
   | `ADMIN_ALLOWED_EMAILS` | твой email (запасной канал доступа к /admin) |

4. **Deploy**.
5. После первого деплоя обнови `NEXT_PUBLIC_SITE_URL` на реальный Vercel домен (или кастомный) и задеплой ещё раз — это нужно для корректных canonical/OG.

## 5. Supabase — добавь Vercel-домен в Auth

**Authentication → URL Configuration**:
- **Site URL**: `https://<your-vercel-domain>`
- **Redirect URLs**: добавь `https://<your-vercel-domain>/**`

Иначе вход в `/admin` на проде не сработает.

## 6. Контент

Дальше всё через `/admin` — обновляешь телефон, услуги, специалистов, отзывы, заявки и т.д. Код трогать не нужно.

---

## Чек-лист первого запуска

- [ ] Supabase проект создан, ключи под рукой
- [ ] Все 4 SQL-файла выполнены без ошибок
- [ ] В Authentication → Users есть твой пользователь, Auto confirm = on
- [ ] Запущен 0004_bootstrap_admin.sql с твоим email
- [ ] Код запушен в GitHub
- [ ] Vercel-проект создан, все ENV заданы
- [ ] Деплой зелёный
- [ ] В Supabase → Auth → URL Configuration добавлен Vercel-домен
- [ ] Открывается `/kk` и видно hero
- [ ] Открывается `/admin/login`, удаётся войти
