const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Performing clean installation...\n');

// Remove node_modules and lock files
console.log('Removing node_modules and lock files...');
try {
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules', { stdio: 'inherit' });
  }
  if (fs.existsSync('package-lock.json')) {
    execSync('rm -f package-lock.json', { stdio: 'inherit' });
  }
  if (fs.existsSync('.vite')) {
    execSync('rm -rf .vite', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Error during cleanup:', error);
}

// Clear npm cache
console.log('Clearing npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
} catch (error) {
  console.error('Error clearing cache:', error);
}

// Fresh install
console.log('Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Clean installation completed!');
} catch (error) {
  console.error('Error during installation:', error);
  process.exit(1);
}
