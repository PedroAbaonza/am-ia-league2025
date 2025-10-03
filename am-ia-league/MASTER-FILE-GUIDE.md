# Master File Guide - Aeromexico AI League 2025

## 📊 Single File Upload System

The admin panel now supports a **Master CSV file** that updates both the Squad Leaderboard and Individual Rankings with a single upload.

## ✨ Benefits

- **One file updates everything** - No need to maintain separate files
- **Automatic calculations** - Squad points are automatically summed from individual points
- **Data consistency** - Squad challenges and scrum masters are consistent across all members
- **Simpler workflow** - Upload once, update both views

## 📝 Master CSV Format

### Required Columns

```csv
name,squadName,position,points,missions,squadChallenges,scrumMaster
```

### Column Descriptions

| Column            | Type    | Description                                  | Scope            |
| ----------------- | ------- | -------------------------------------------- | ---------------- |
| `name`            | String  | Developer's full name                        | Individual       |
| `squadName`       | String  | Squad name (links squad and individual data) | Both             |
| `position`        | String  | Developer's role (e.g., "Senior Developer")  | Individual       |
| `points`          | Integer | Individual points (summed for squad total)   | Individual       |
| `missions`        | Integer | Missions completed by developer              | Individual       |
| `squadChallenges` | Integer | Special challenges completed by squad        | Squad (repeated) |
| `scrumMaster`     | String  | Squad's scrum master name                    | Squad (repeated) |

### Important Notes

- **squadChallenges**: This value should be the **same for all members of a squad**. It represents the squad's total challenges, not individual challenges.
- **scrumMaster**: This value should be the **same for all members of a squad**.
- **Squad points**: Automatically calculated by summing all individual `points` for each squad.

## 📋 Example Master CSV

```csv
name,squadName,position,points,missions,squadChallenges,scrumMaster
Carlos Rodríguez,Alpha Squadron,Senior Developer,520,8,5,María González
Ana Martínez,Alpha Squadron,Full Stack Developer,495,7,5,María González
Luis Hernández,Alpha Squadron,AI Specialist,460,7,5,María González
Elena Vargas,Beta Flight,Frontend Developer,485,8,3,Roberto Silva
Miguel Torres,Beta Flight,DevOps Engineer,465,6,3,Roberto Silva
```

### What This Creates

**Squad Leaderboard:**

- Alpha Squadron: 1,475 points (520+495+460), 5 challenges, María González as Scrum Master
- Beta Flight: 950 points (485+465), 3 challenges, Roberto Silva as Scrum Master

**Individual Rankings:**

- Carlos Rodríguez: 520 points, 8 missions, Alpha Squadron
- Ana Martínez: 495 points, 7 missions, Alpha Squadron
- Elena Vargas: 485 points, 8 missions, Beta Flight
- Miguel Torres: 465 points, 6 missions, Beta Flight
- Luis Hernández: 460 points, 7 missions, Alpha Squadron

## 🚀 How to Use

1. **Access Admin Panel**: Navigate to `/admin` and login with password `aeromexico2025`
2. **Prepare Your CSV**: Use the format above with all required columns
3. **Upload**: Click "Seleccionar Archivo Master CSV" in the recommended section
4. **Validate**: The system will validate your file format
5. **Process**: Click "Procesar Datos" to update both views
6. **Verify**: Check both the Squad Leaderboard and Individual Rankings

## 🔄 Data Flow

```
Master CSV File
      ↓
   Upload
      ↓
   Parse & Validate
      ↓
   ├─→ Generate Squad Data (group by squadName, sum points)
   └─→ Generate Individual Data (use as-is)
      ↓
   Update Both Views
```

## 📥 Download Template

A sample master CSV template is available at:
`/assets/templates/master-data-template.csv`

You can also download the current data from the admin panel to use as a starting point.

## 🔧 Legacy Support

The system still supports uploading separate Squad and Individual CSV files for backward compatibility, but the Master File approach is **recommended** for simplicity and consistency.

## ⚠️ Validation Rules

The system validates:

- ✅ All required columns are present
- ✅ File size is under 5MB
- ✅ File format is CSV
- ✅ Data contains valid records
- ✅ Points and missions are numeric values

## 🎯 Best Practices

1. **Keep squadChallenges consistent** - Use the same value for all squad members
2. **Keep scrumMaster consistent** - Use the same name for all squad members
3. **Use consistent squadName spelling** - Exact match required for grouping
4. **Backup before upload** - System creates automatic backups, but download current data first
5. **Validate after upload** - Check both views to ensure data is correct

## 🆘 Troubleshooting

**Problem**: Squad points don't match expected total

- **Solution**: Check that all squad members have the correct squadName (case-sensitive)

**Problem**: Squad challenges showing wrong number

- **Solution**: Ensure squadChallenges value is the same for all squad members

**Problem**: Developer not showing in squad

- **Solution**: Verify squadName spelling matches exactly across all rows

**Problem**: File validation fails

- **Solution**: Check that all required columns are present and spelled correctly

## 📞 Support

For issues or questions, check the audit logs in the admin panel or validate data integrity using the "Validar Integridad" button.
