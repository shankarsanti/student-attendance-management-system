# MongoDB Atlas Connection Error Fix

## Error
```
MongoServerError: bad auth : Authentication failed.
code: 8000
codeName: 'AtlasError'
```

## Root Cause
The MongoDB Atlas authentication is failing. This means:
- Username or password is incorrect
- Password contains special characters that need URL encoding
- Database user doesn't exist or was deleted
- Database user doesn't have proper permissions

## Solution Steps

### Step 1: Verify MongoDB Atlas Credentials

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Login to your account
3. Select your cluster (Cluster0)
4. Click "Database Access" in the left sidebar
5. Check if user `shankarsanti2005_db_user` exists
6. If not, create a new database user

### Step 2: Create/Update Database User

1. Click "Database Access" → "Add New Database User"
2. **Authentication Method:** Password
3. **Username:** `shankarsanti2005_db_user` (or any name you prefer)
4. **Password:** Generate a new password (IMPORTANT: Note it down!)
5. **Database User Privileges:** Select "Atlas admin" or "Read and write to any database"
6. Click "Add User"

### Step 3: Check Network Access

1. Click "Network Access" in the left sidebar
2. Make sure your IP address is whitelisted
3. For development, you can add `0.0.0.0/0` (allows all IPs)
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere"
   - Click "Confirm"

### Step 4: Get Correct Connection String

1. Go back to "Database" → Click "Connect" on your cluster
2. Select "Connect your application"
3. Driver: Node.js
4. Version: 4.1 or later
5. Copy the connection string
6. It should look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.vh9zbbn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

### Step 5: Update .env File

Replace the connection string in `backend/.env`:

```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.vh9zbbn.mongodb.net/smsproject?retryWrites=true&w=majority&appName=Cluster0
```

**Important Notes:**
- Replace `<username>` with your actual username
- Replace `<password>` with your actual password
- If password contains special characters (like @, #, $, %, etc.), you need to URL encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `^` → `%5E`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`

### Step 6: Restart Backend Server

After updating the .env file, restart the backend:

```bash
# Stop the current server (Ctrl+C)
# Then start again
cd backend
npm start
```

You should see:
```
Connected to MongoDB
Server started at port no. 5001
```

WITHOUT any "NOT CONNECTED TO NETWORK" error.

## Quick Fix Option

If you want to use the local MongoDB instead of Atlas:

1. Install MongoDB locally on your Mac:
   ```bash
   brew install mongodb-community
   brew services start mongodb-community
   ```

2. Update `backend/.env`:
   ```env
   MONGO_URL=mongodb://127.0.0.1:27017/smsproject
   ```

3. Restart backend server

## Testing the Connection

After fixing, test with:

```bash
cd backend
node scripts/test-payment-settings.js
```

You should see:
```
✅ Connected to MongoDB
✅ Found admin: ...
```

## Common Issues

### Issue 1: Password with Special Characters
**Solution:** URL encode the password in the connection string

### Issue 2: User Doesn't Exist
**Solution:** Create the user in MongoDB Atlas → Database Access

### Issue 3: IP Not Whitelisted
**Solution:** Add your IP or 0.0.0.0/0 in Network Access

### Issue 4: Wrong Database Name
**Solution:** Make sure `/smsproject` is at the end of the connection string

### Issue 5: Cluster Paused
**Solution:** Resume the cluster in MongoDB Atlas

## Current Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@cluster0.vh9zbbn.mongodb.net/smsproject?retryWrites=true&w=majority&appName=Cluster0
```

Parts:
- `USERNAME`: shankarsanti2005_db_user
- `PASSWORD`: GiUD9fKM2aHV4zcQ (verify this is correct!)
- `CLUSTER`: cluster0.vh9zbbn.mongodb.net
- `DATABASE`: smsproject
- `OPTIONS`: retryWrites=true&w=majority&appName=Cluster0

## Next Steps

1. Verify credentials in MongoDB Atlas
2. Update .env file with correct credentials
3. Restart backend server
4. Test the connection
5. Refresh student page

---

**Status:** Authentication Error
**Action Required:** Verify MongoDB Atlas credentials
