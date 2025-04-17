
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
if (!fs.existsSync(path.join(__dirname, '../electron'))) {
  fs.mkdirSync(path.join(__dirname, '../electron'));
}

// Copy the Electron main file to the electron directory
fs.copyFileSync(
  path.join(__dirname, '../src/electron/main.ts'),
  path.join(__dirname, '../electron/main.js')
);

console.log('Building Vite app...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Error building app:', error);
  process.exit(1);
}

console.log('Installing Electron builder...');
try {
  execSync('npm install electron electron-builder --no-save', { stdio: 'inherit' });
} catch (error) {
  console.error('Error installing Electron dependencies:', error);
  process.exit(1);
}

console.log('Building Electron app...');
try {
  const platform = process.argv[2] || 'all';
  const command = `npx electron-builder build --${platform} -c electron-builder.config.js`;
  execSync(command, { stdio: 'inherit' });
  console.log('Electron build completed successfully!');
} catch (error) {
  console.error('Error building Electron app:', error);
  process.exit(1);
}
