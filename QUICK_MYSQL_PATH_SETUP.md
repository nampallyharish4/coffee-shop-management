# Quick MySQL PATH Setup Guide

## Your MySQL Installation
✅ MySQL Server 8.0 is installed at:
```
C:\Program Files\MySQL\MySQL Server 8.0\bin
```

## Quick Setup (Choose One Method)

### Method 1: Run the Batch Script (Easiest)
1. **Right-click** `add-mysql-to-path.bat`
2. Select **"Run as administrator"**
3. Follow the prompts
4. **Close and reopen** Command Prompt
5. Test: `mysql --version`

### Method 2: Manual Setup (GUI)
1. Press `Windows Key + R`
2. Type `sysdm.cpl` and press Enter
3. Click **"Advanced"** tab
4. Click **"Environment Variables"**
5. Under **"System variables"**, select **"Path"**
6. Click **"Edit"**
7. Click **"New"**
8. Paste: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
9. Click **"OK"** on all windows
10. **Close and reopen** Command Prompt
11. Test: `mysql --version`

### Method 3: PowerShell (One Command)
1. Open **PowerShell as Administrator**
2. Run:
```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\MySQL\MySQL Server 8.0\bin", [EnvironmentVariableTarget]::Machine)
```
3. **Close and reopen** Command Prompt
4. Test: `mysql --version`

## After Setup

Once MySQL is in PATH, you can use:

```cmd
# Connect to MySQL
mysql -u root -p

# Connect to specific database
mysql -u coffee_admin -p coffee_shop

# Run SQL file
mysql -u root -p < setup-mysql.sql

# Check version
mysql --version
```

## Verify It Works

After adding to PATH and reopening Command Prompt:

```cmd
mysql --version
```

Should show:
```
mysql  Ver 8.0.xx for Win64 on x86_64
```

## Troubleshooting

**"mysql is not recognized"**
- Make sure you **closed and reopened** Command Prompt
- Verify PATH was added correctly
- Check if you ran as Administrator

**Still not working?**
- Use full path: `"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p`
- Or use MySQL Workbench GUI instead

