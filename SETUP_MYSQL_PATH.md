# How to Add MySQL to Windows PATH

Adding MySQL to your PATH allows you to run MySQL commands from any directory in Command Prompt.

## Method 1: Using GUI (Easiest)

### Step 1: Find MySQL Installation Directory
MySQL is usually installed in one of these locations:
- `C:\Program Files\MySQL\MySQL Server 8.0\bin`
- `C:\Program Files\MySQL\MySQL Server 8.1\bin`
- `C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin`

**To find it:**
1. Open File Explorer
2. Navigate to `C:\Program Files\MySQL\`
3. Look for folders like `MySQL Server 8.0` or `MySQL Server 8.1`
4. Open the folder and check if `bin` folder exists
5. Copy the full path (e.g., `C:\Program Files\MySQL\MySQL Server 8.0\bin`)

### Step 2: Add to PATH
1. Press `Windows Key + R`
2. Type `sysdm.cpl` and press Enter
3. Click the **"Advanced"** tab
4. Click **"Environment Variables"** button at the bottom
5. Under **"System variables"** (bottom section), find and select **"Path"**
6. Click **"Edit"**
7. Click **"New"**
8. Paste the MySQL bin path (e.g., `C:\Program Files\MySQL\MySQL Server 8.0\bin`)
9. Click **"OK"** on all windows

### Step 3: Restart Command Prompt
- Close all Command Prompt windows
- Open a new Command Prompt
- Test with: `mysql --version`

## Method 2: Using Command Line (PowerShell as Administrator)

1. Open PowerShell as Administrator:
   - Right-click Start button
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"

2. Run this command (replace with your MySQL path):
```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\MySQL\MySQL Server 8.0\bin", [EnvironmentVariableTarget]::Machine)
```

3. Close and reopen Command Prompt/PowerShell

4. Test: `mysql --version`

## Method 3: Quick Test Without PATH

If you don't want to modify PATH, you can always use the full path:

```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

## Verify MySQL is in PATH

After adding to PATH, test it:

```cmd
mysql --version
```

You should see something like:
```
mysql  Ver 8.0.xx for Win64 on x86_64 (MySQL Community Server - GPL)
```

## Common Issues

### Issue: "mysql is not recognized"
- **Solution**: Make sure you restarted Command Prompt after adding to PATH
- **Solution**: Verify the path is correct (check for typos)
- **Solution**: Make sure you added it to System PATH, not User PATH

### Issue: Can't find MySQL installation
- Check `C:\Program Files\MySQL\`
- Check `C:\Program Files (x86)\MySQL\`
- Search for "mysql.exe" in File Explorer

### Issue: Permission denied
- Make sure you're running Command Prompt/PowerShell as Administrator when modifying PATH

## Alternative: Use MySQL Workbench

If you prefer a GUI, you can use MySQL Workbench instead:
1. Download from: https://dev.mysql.com/downloads/workbench/
2. Install and use the GUI to connect to MySQL
3. No PATH setup needed!

## After Setup

Once MySQL is in PATH, you can:
- Connect: `mysql -u root -p`
- Connect to specific database: `mysql -u coffee_admin -p coffee_shop`
- Run SQL file: `mysql -u root -p < setup-mysql.sql`

