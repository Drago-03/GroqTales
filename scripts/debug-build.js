// Debug build script for GroqTales

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running debug build for GroqTales...');

// Create a log file name with timestamp
const logFile = path.join(__dirname, '..', `build-debug-log-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`);

// Function to log messages to both console and file
function log(message) {
  console.log(message);
  fs.appendFileSync(logFile, message + '\n', { flag: 'a+' });
}

log('Debug build process started at ' + new Date().toISOString());

try {
  log('Running npm install to ensure dependencies are up to date...');
  execSync('npm install', { stdio: 'inherit' });
  log('Dependencies installed.');

  log('\nRunning Next.js build with verbose output...');
  execSync('npm run build', { stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DEBUG: '1' } });
  log('Build completed successfully.');
} catch (error) {
  log('ERROR: Build failed. Details below:');
  log(error.message || error.toString());
  log('Full error object:');
  log(JSON.stringify(error, null, 2));
  console.error('Build failed. Check ' + logFile + ' for detailed error logs.');
  process.exit(1);
} finally {
  log('Debug process completed. Log file: ' + logFile);
} 