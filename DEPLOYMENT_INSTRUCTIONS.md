# Инструкции по развертыванию CFPB Case Management System

## Обзор проекта

Ваш проект полностью настроен и готов к работе:

- ✅ База данных создана со всеми таблицами (cases, contact_submissions)
- ✅ Все политики безопасности (RLS) настроены
- ✅ Storage bucket для PDF файлов создан
- ✅ Edge Functions задеплоены (create-admin-user, send-contact-email)
- ✅ Все миграции применены

## Переменные окружения (.env)

Ваш текущий `.env` файл содержит подключение к Supabase проекту:

```env
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
```

## Структура базы данных

### Таблица: cases
Хранит информацию о делах клиентов:
- case_number (уникальный номер дела)
- status (статус: Active/Blocked/Pending/On Hold/Received)
- full_name, id_number, email, phone_number
- country, date_of_birth
- total_retrieved_amount (сумма возврата)
- transaction_id, platform
- payment_required (требуемый платеж)
- pdf_file_name, pdf_file_url, pdf_uploaded_at

### Таблица: contact_submissions
Хранит обращения через контактную форму:
- name, email, phone
- subject, message
- is_read (прочитано/не прочитано)
- created_at

### Storage Bucket: case-pdfs
Публичное хранилище для PDF документов дел

## Создание администратора

Для создания административного пользователя выполните один из вариантов:

### Вариант 1: Через Edge Function (рекомендуется)

После деплоя на Vercel выполните:

```bash
curl -X POST \
  "https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1/create-admin-user" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

### Вариант 2: Через Supabase Dashboard

1. Откройте Supabase Dashboard: https://supabase.com/dashboard
2. Перейдите в раздел Authentication → Users
3. Нажмите "Add user"
4. Создайте пользователя:
   - Email: `admin@example.com`
   - Password: `admin123456`
   - Подтвердите email автоматически (Auto Confirm Email)

### Вариант 3: Через SQL Editor

В Supabase Dashboard → SQL Editor выполните:

```sql
-- Создать администратора
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('admin123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

## Развертывание на Vercel

### Шаг 1: Подготовка проекта

Убедитесь, что проект собирается локально:

```bash
npm install
npm run build
```

### Шаг 2: Загрузка на Vercel

1. Создайте новый проект на Vercel
2. Подключите ваш Git репозиторий или загрузите проект напрямую
3. Vercel автоматически определит настройки (Vite)

### Шаг 3: Настройка переменных окружения в Vercel

Перейдите в **Settings → Environment Variables** и добавьте:

```
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
```

**ВАЖНО:** Добавьте эти переменные для всех окружений:
- Production
- Preview
- Development

### Шаг 4: Deploy

Нажмите "Deploy" и дождитесь завершения деплоя.

## Доступ к админ-панели

После деплоя:

1. Перейдите на `https://ваш-домен.vercel.app/admin/login`
2. Войдите с учетными данными:
   - Email: `admin@example.com`
   - Password: `admin123456`

## Функциональность системы

### Для пользователей (публичная часть):
- Просмотр информации о CFPB
- Проверка статуса дела по номеру
- Контактная форма для обращений

### Для администраторов:
- Управление делами (создание, редактирование, удаление)
- Загрузка PDF документов к делам
- Просмотр обращений через контактную форму
- Управление статусами дел
- Поиск по делам

## Безопасность

### RLS (Row Level Security) настроена:

**Таблица cases:**
- Публичный доступ на чтение (SELECT)
- Только аутентифицированные пользователи могут создавать/изменять/удалять

**Таблица contact_submissions:**
- Только аутентифицированные пользователи могут просматривать/изменять/удалять

**Storage (case-pdfs):**
- Публичный доступ на чтение PDF
- Только аутентифицированные пользователи могут загружать/изменять/удалять

## Структура Edge Functions

### create-admin-user
Создает административного пользователя с email `admin@example.com` и паролем `admin123456`

### send-contact-email
Обрабатывает отправку контактной формы:
- Сохраняет обращение в базу данных
- (Опционально) Отправляет email уведомление если настроен RESEND_API_KEY

## Дополнительные настройки (опционально)

### Email уведомления для контактной формы

Если хотите получать email уведомления о новых обращениях:

1. Зарегистрируйтесь на https://resend.com
2. Получите API ключ
3. Добавьте в переменные окружения Supabase (Dashboard → Edge Functions → Configuration):
   ```
   RESEND_API_KEY=your_resend_api_key
   ```

## Проверка работоспособности

1. **База данных**: Проверьте таблицы в Supabase Dashboard → Table Editor
2. **Storage**: Проверьте bucket в Supabase Dashboard → Storage
3. **Edge Functions**: Проверьте статус в Supabase Dashboard → Edge Functions
4. **Сайт**: Откройте главную страницу
5. **Админка**: Войдите в `/admin/login`

## Поддержка

Если возникли проблемы:

1. Проверьте логи в Vercel Dashboard → Deployments → Logs
2. Проверьте логи Edge Functions в Supabase Dashboard
3. Проверьте Browser Console для ошибок фронтенда

## Важные URL

- **Сайт**: https://ваш-домен.vercel.app
- **Админ-панель**: https://ваш-домен.vercel.app/admin/login
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Готово!** Ваш проект полностью настроен и готов к использованию.
