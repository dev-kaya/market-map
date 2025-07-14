# Supabase Setup Verification Checklist

## 1. Verify Your Supabase Project

1. **Login to Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project (appears to be: `bxiqugtqobtqoounuwtn`)

2. **Check Database Status**
   - In the dashboard, ensure your database shows as "Active" (green status)
   - If paused, click "Resume" to restart it

## 2. Get Correct Connection String

1. **Navigate to Settings > Database**
2. **Find "Connection string" section**
3. **Copy the correct URL**:
   - Use "URI" for direct connections
   - Use "Connection pooling" → "Transaction" for Prisma

Your connection string should look like:
```
# Direct connection (port 5432)
postgresql://postgres:[YOUR-PASSWORD]@db.bxiqugtqobtqoounuwtn.supabase.co:5432/postgres

# OR Connection pooling (port 6543) - Recommended for Prisma
postgresql://postgres:[YOUR-PASSWORD]@db.bxiqugtqobtqoounuwtn.supabase.co:6543/postgres?pgbouncer=true
```

## 3. Update Your Configuration

1. **Update `.env.local`** with the correct connection string:
```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.bxiqugtqobtqoounuwtn.supabase.co:6543/postgres?pgbouncer=true"
```

2. **For Prisma with Supabase**, you might need both URLs:
```bash
# Direct connection for migrations
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.bxiqugtqobtqoounuwtn.supabase.co:5432/postgres"

# Pooled connection for queries
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.bxiqugtqobtqoounuwtn.supabase.co:6543/postgres?pgbouncer=true"
```

## 4. Update Prisma Schema (if using both URLs)

If you need both connections, update `prisma/schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 5. Test Your Connection

```bash
# Test with explicit URL
DATABASE_URL="your-connection-string" npx prisma db pull

# If successful, run migrations
DATABASE_URL="your-connection-string" npx prisma db push

# Generate Prisma Client
npx prisma generate
```

## 6. Common Issues

### Issue: Connection timeout
- **Solution**: Check if your database is active in Supabase dashboard
- Supabase pauses free databases after 1 week of inactivity

### Issue: Authentication failed
- **Solution**: Verify password in connection string matches your Supabase project password

### Issue: IP not allowed
- **Solution**: Supabase allows all IPs by default, but check Settings > Database > Connection Info

### Issue: SSL required
- **Solution**: Add `?sslmode=require` to your connection string:
  ```
  postgresql://...supabase.co:5432/postgres?sslmode=require
  ```

## 7. Verify Setup

Once connected, verify your tables:
```bash
# Open Prisma Studio
DATABASE_URL="your-connection-string" npx prisma studio

# Or check via SQL in Supabase Dashboard
# Go to SQL Editor and run:
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

## Need Help?

1. Check Supabase logs: Dashboard → Logs → Database
2. Verify connection string format in: Settings → Database → Connection string
3. Ensure database is not paused: Dashboard → Home (check status)