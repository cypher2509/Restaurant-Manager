const fs = require('fs');
const path = require('path');
const mysqldump = require('mysqldump');

// Database configuration
const dbUser = 'root';
const dbPassword = 'Pal@382003'; // Replace with environment variable in production
const dbName = 'restaurant_db';

// Directory to store backups
const backupDir = path.join(__dirname, 'backups');

// Ensure the backup directory exists
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// Function to perform the backup
const backupDatabase = async () => {
    const date = new Date().toISOString().split('T')[0]; // e.g., "2024-11-20"
    const backupFileName = `restaurant_backup_${date}.sql`;
    const backupFilePath = path.join(backupDir, backupFileName);

    try {
        await mysqldump({
            connection: {
                host: 'localhost', // Adjust if not using localhost
                user: dbUser,
                password: dbPassword,
                database: dbName,
            },
            dumpToFile: backupFilePath,
        });

        console.log(`Database backup completed: ${backupFileName}`);
        console.log('Backup file path:', backupDir);
        return backupFileName;
    } catch (error) {
        console.error('Error during backup:', error.message);
        throw new Error('Database backup failed');
    }
};

module.exports = { backupDatabase };
