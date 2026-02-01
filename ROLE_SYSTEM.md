# Role System Implementation - KONTRIBUTOR

## Overview
Sistem role dengan 2 tipe user:
- **Admin**: Full access ke semua menu dashboard
- **Kontributor**: Hanya bisa akses menu Artikel dan hanya bisa lihat/edit artikel sendiri

## Database Changes

### Migration 010: Add KONTRIBUTOR Role and Article Ownership
File: `backend/migrations/010_add_contributor_role.sql`

Perubahan:
1. Tambah kolom `author_id` di table `custom_articles` (foreign key ke `users.id`)
2. Buat index untuk `author_id`
3. Update role 'editor' menjadi 'kontributor' (jika ada data lama)

**Cara run migration di server:**
```bash
cd /root/rss-feed-backend
psql -U rssuser -d rss_feed -f migrations/010_add_contributor_role.sql
```

## Backend Changes

### 1. Middleware Role Check
File: `backend/middleware/roleCheck.js`

Functions:
- `requireAuth`: Check user authenticated
- `requireAdmin`: Check user adalah admin
- `requireKontributorOrAdmin`: Check user adalah kontributor atau admin
- `filterByAuthor`: Filter query berdasarkan role (kontributor hanya lihat artikel sendiri)

### 2. Custom Articles Routes
File: `backend/routes/customArticles.js`

Perubahan:
- `GET /api/custom-articles`: Auto filter by author_id untuk kontributor
- `POST /api/custom-articles`: Auto set author_id dari req.user.id
- `PUT /api/custom-articles/:id`: Check ownership sebelum update (kontributor hanya bisa edit artikel sendiri)
- `DELETE /api/custom-articles/:id`: Check ownership sebelum delete

### 3. Custom Article Model
File: `backend/models/CustomArticle.js`

Perubahan:
- `getAll()`: Tambah filter `author_id` di query dan count
- `create()`: Accept parameter `author_id`

## Frontend Changes

### 1. Admin Navigation Component
File: `src/components/AdminNav.svelte`

Reusable navigation component dengan conditional menu berdasarkan role:
- Admin: Lihat semua menu (RSS Sources, Categories, Artikel, Settings, Theme, Users)
- Kontributor: Hanya lihat menu Artikel

### 2. Admin Dashboard Pages
Files yang diupdate:
- `src/AdminShadcn.svelte` (RSS Sources)
- `src/CategoryManagement.svelte`
- `src/CustomArticlesManagement.svelte`
- `src/SettingsManagement.svelte`
- `src/ThemeManagement.svelte`
- `src/UserManagement.svelte`

Perubahan:
- Tambah `currentUser` state dari localStorage
- Update navigation untuk hide menu berdasarkan role
- UserManagement: Ubah option "Editor" menjadi "Kontributor"

### 3. Custom Articles Management
Behavior untuk kontributor:
- Hanya muncul artikel yang dibuat oleh kontributor tersebut (filter by author_id di backend)
- Tidak bisa edit/delete artikel orang lain (403 forbidden dari backend)
- Bisa buat artikel baru (otomatis set author_id)

## Testing

### Test 1: Create Kontributor User
1. Login sebagai admin
2. Buka `/admin/users`
3. Add User baru dengan role "Kontributor"
4. Logout

### Test 2: Login sebagai Kontributor
1. Login dengan user kontributor
2. Verify hanya muncul menu "Artikel" di navigation
3. Coba akses URL `/admin/dashboard` atau `/admin/settings` - should redirect/error

### Test 3: Article Ownership
1. Login sebagai kontributor A
2. Buat artikel baru
3. Logout, login sebagai kontributor B
4. Verify tidak bisa lihat/edit artikel dari kontributor A
5. Login sebagai admin
6. Verify admin bisa lihat semua artikel

## Security Notes

1. **Backend validation**: Semua permission check dilakukan di backend, bukan hanya frontend
2. **JWT token**: Token berisi user id dan role, verified di setiap request
3. **Database constraint**: Foreign key `author_id` dengan `ON DELETE SET NULL`
4. **Frontend hiding**: Menu disembunyikan di frontend tapi endpoint tetap protected di backend

## Role Values
- `admin`: Full access
- `kontributor`: Limited access (articles only, own articles only)
- Legacy `editor`: Auto converted to `kontributor` via migration

## API Endpoints Access Matrix

| Endpoint | Admin | Kontributor |
|----------|-------|-------------|
| GET /api/custom-articles | All articles | Own articles only |
| POST /api/custom-articles | ✅ | ✅ |
| PUT /api/custom-articles/:id | ✅ | Own articles only |
| DELETE /api/custom-articles/:id | ✅ | Own articles only |
| /api/admin (RSS sources) | ✅ | ❌ |
| /api/categories | ✅ | ❌ (read-only OK) |
| /api/settings | ✅ | ❌ |
| /api/users | ✅ | ❌ |

## Next Steps

1. ✅ Run migration `010_add_contributor_role.sql` di server production
2. ✅ Restart backend server untuk load middleware baru
3. ✅ Test dengan create kontributor user
4. ✅ Verify article filtering works correctly
5. Optional: Add email notification untuk kontributor saat artikel approved/published oleh admin
