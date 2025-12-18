# Notes Migration Qo'llash Yo'riqnomasi

## Qadam 1: Supabase Dashboard'ga kirish

1. [Supabase Dashboard](https://app.supabase.com/) ga kiring
2. Loyihangizni tanlang

## Qadam 2: SQL Editor'ni ochish

1. Chap menudan **SQL Editor** ni tanlang
2. **New query** tugmasini bosing

## Qadam 3: Migration SQL'ni qo'llash

1. `supabase/migrations/apply_notes_migration.sql` faylini oching
2. Barcha SQL kodini nusxalang (Ctrl+A, Ctrl+C)
3. Supabase SQL Editor'ga yopishtiring (Ctrl+V)
4. **Run** tugmasini bosing yoki `Ctrl+Enter` bosing

## Qadam 4: Tekshirish

Migration muvaffaqiyatli qo'llangan bo'lsa, quyidagi xabarni ko'rasiz:
- ✅ "Success. No rows returned"

## Qadam 5: Jadvalni tekshirish

1. Chap menudan **Table Editor** ni tanlang
2. `portfolio_notes_rows` jadvalini toping
3. Jadval mavjud bo'lishi kerak

## Qadam 6: Frontend'ni tekshirish

1. Browser'da Notes sahifasini oching
2. Console'ni oching (F12)
3. Quyidagi log'larni ko'ring:
   - `GET /api/notes - Data:` - bu yerda ma'lumotlar ko'rinishi kerak
   - `fetchNotes - API response:` - bu yerda ma'lumotlar ko'rinishi kerak

## Muammo bo'lsa

Agar migration xato bersa:
1. Xato xabarni ko'ring
2. Ehtimol jadval allaqachon mavjud bo'lishi mumkin
3. Bu holatda migration yana bir bor ishga tushirish xavfsiz (IF NOT EXISTS ishlatilgan)

## Qo'shimcha ma'lumot

- Migration fayl: `supabase/migrations/apply_notes_migration.sql`
- Jadval nomi: `portfolio_notes_rows`
- RLS Policy: Public read, Authenticated write

