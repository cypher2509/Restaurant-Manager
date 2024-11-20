const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const mysqldump = require('mysqldump');

// Function to perform the database backup
const backupDatabase = (dbConfig, backupPath) => {
  // Create the connection to the database
  const connection = mysql.createConnection(dbConfig);

  // Get today's date for backup filename
  const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const backupFile = path.join(backupPath, `restaurant_backup_${date}.sql`);

  // Command to execute mysqldump
  const backupCommand = `mysqldump -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} > ${backupFile}`;

  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ', err);
      return;
    }
    console.log('Connected to the database.');
  });

  // Execute backup command
  exec(backupCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during backup: ${stderr}`);
      return;
    }
    console.log('Database backup completed successfully.');
  });

  // Close the database connection
  connection.end();
};

module.exports = { backupDatabase };