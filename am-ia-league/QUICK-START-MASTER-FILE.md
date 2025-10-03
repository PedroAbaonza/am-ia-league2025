# Quick Start - Master File Upload

## 🚀 5-Minute Setup Guide

### Step 1: Prepare Your CSV File

Create a CSV file with this exact header:

```csv
name,squadName,position,points,missions,squadChallenges,scrumMaster
```

### Step 2: Add Your Data

Fill in your developer data. **Important**:

- `squadChallenges` and `scrumMaster` should be **the same** for all members of a squad

Example:

```csv
name,squadName,position,points,missions,squadChallenges,scrumMaster
Carlos Rodriguez,Alpha Squadron,Senior Developer,520,8,5,Maria Garcia
Ana Martinez,Alpha Squadron,Developer,495,7,5,Maria Garcia
Luis Hernandez,Beta Flight,DevOps,465,6,3,Pedro Lopez
Elena Vargas,Beta Flight,Frontend Dev,485,8,3,Pedro Lopez
```

### Step 3: Access Admin Panel

1. Navigate to: `http://localhost:4200/admin`
2. Enter password: `aeromexico2025`
3. Click "Acceder"

### Step 4: Upload Master File

1. Look for the **"📊 Archivo Master (Todo en Uno)"** section (has a "Recomendado" badge)
2. Click **"Seleccionar Archivo Master CSV"**
3. Choose your CSV file
4. Wait for validation (you'll see a success message with record count)
5. Click **"Procesar Datos"**

### Step 5: Verify

1. Navigate to `/leaderboard` - See your squads with calculated totals
2. Navigate to `/individual` - See your developers with their individual stats

## ✅ What Gets Updated

### Squad Leaderboard (`/leaderboard`)

- Squad names
- Total points (automatically summed from individual points)
- Squad challenges (from `squadChallenges` column)
- Scrum Master names
- Developer lists

### Individual Rankings (`/individual`)

- Developer names
- Individual points
- Missions completed
- Squad assignments
- Positions/roles

## 📋 Field Reference

| Column          | Example          | Notes                                        |
| --------------- | ---------------- | -------------------------------------------- |
| name            | Carlos Rodriguez | Developer's full name                        |
| squadName       | Alpha Squadron   | Must match exactly for all squad members     |
| position        | Senior Developer | Developer's role                             |
| points          | 520              | Individual points (will be summed for squad) |
| missions        | 8                | Individual missions completed                |
| squadChallenges | 5                | **Same value for all squad members**         |
| scrumMaster     | Maria Garcia     | **Same value for all squad members**         |

## ⚠️ Common Mistakes

### ❌ Wrong: Different squadChallenges per member

```csv
Carlos,Alpha,Dev,520,8,3,Maria
Ana,Alpha,Dev,495,7,5,Maria  ← Different challenge count!
```

### ✅ Correct: Same squadChallenges for all members

```csv
Carlos,Alpha,Dev,520,8,5,Maria
Ana,Alpha,Dev,495,7,5,Maria  ← Same challenge count
```

### ❌ Wrong: Inconsistent squadName spelling

```csv
Carlos,Alpha Squadron,Dev,520,8,5,Maria
Ana,alpha squadron,Dev,495,7,5,Maria  ← Case mismatch!
```

### ✅ Correct: Exact squadName match

```csv
Carlos,Alpha Squadron,Dev,520,8,5,Maria
Ana,Alpha Squadron,Dev,495,7,5,Maria  ← Exact match
```

## 🎯 Pro Tips

1. **Use the template**: Download `/assets/templates/master-data-template.csv` as a starting point
2. **Download current data**: Use the "Descargar" buttons in admin panel to get current data
3. **Backup first**: System creates automatic backups, but download current data before big changes
4. **Validate after upload**: Check both views to ensure everything looks correct
5. **Check audit logs**: View recent activity in the admin panel

## 🔄 Update Workflow

```
Edit CSV → Upload → Validate → Process → Verify Both Views
```

Typical time: **< 2 minutes**

## 📞 Need Help?

- Check `MASTER-FILE-GUIDE.md` for detailed documentation
- Use "Validar Integridad" button in admin panel to check data
- View audit logs for upload history
- Check validation errors displayed after file selection

## 🎉 That's It!

You now have a single file that updates both the squad leaderboard and individual rankings. No more juggling multiple files or worrying about data consistency!
