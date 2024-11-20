const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Backup directory (ensure this path is writable by the app)
const backupDir = path.join(__dirname, '..', 'backups');

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true }); // ensure all directories in path are created
}

/**
 * @route POST /api/backup
 * @description Create a backup of the database
 */
router.post('/', (req, res) => {
    const dbName = 'restaurant_db'; // Replace with your actual database name
    const dbUser = 'root'; // Replace with your MySQL username
    const dbPassword = 'L0kesh@123'; // Using environment variable for password
    const backupFileName = `backup_${new Date().toISOString().split('T')[0]}.sql`; // e.g., "backup_2024-11-20.sql"
    const backupPath = path.join(backupDir, backupFileName);

    // mysqldump command to back up the database
    // Make sure to use the full path to mysqldump if it's not in the system's PATH
    const command = `mysqldump -u ${dbUser} -p${dbPassword} ${dbName} > ${backupPath}`;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error('Backup failed:', stderr);
            return res.status(500).json({ message: 'Backup failed', error: stderr });
        }

        // Check if backup file exists to confirm the backup
        if (fs.existsSync(backupPath)) {
            res.json({ message: 'Backup created successfully', backupFile: backupFileName });
        } else {
            res.status(500).json({ message: 'Backup file not found after execution' });
        }
    });
});

module.exports = router;