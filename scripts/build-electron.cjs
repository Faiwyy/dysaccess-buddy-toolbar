const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
if (!fs.existsSync(path.join(__dirname, '../electron'))) {
  fs.mkdirSync(path.join(__dirname, '../electron'));
}

// Function to check if alias resolution is working
function checkAliasResolution() {
  console.log('Checking alias resolution...');
  const srcPath = path.join(__dirname, '../src');
  const componentsPath = path.join(srcPath, 'components/ui/toaster.tsx');
  
  if (!fs.existsSync(componentsPath)) {
    console.error('Error: toaster.tsx not found at expected path');
    process.exit(1);
  }
  
  console.log('✓ Source files found');
}

// Compile TypeScript to JavaScript for Electron
console.log('Compiling Electron TypeScript...');
try {
  execSync('npx tsc -p tsconfig.electron.json', { stdio: 'inherit' });
} catch (error) {
  console.error('Error compiling Electron TypeScript:', error);
  process.exit(1);
}

console.log('Building Vite app...');
try {
  // Check alias resolution before building
  checkAliasResolution();
  
  // Build with verbose output to catch alias issues
  execSync('npm run build -- --mode production', { stdio: 'inherit' });
} catch (error) {
  console.error('Error building app:', error);
  console.log('\nTroubleshooting: If you see alias resolution errors:');
  console.log('1. Run: node scripts/clean-install.cjs');
  console.log('2. Clear Vite cache: npx vite --force');
  console.log('3. Check that all @/ imports have corresponding files in src/');
  process.exit(1);
}

// Copy icons and resources
console.log('Copying resources...');
try {
  // Ensure directory exists
  if (!fs.existsSync(path.join(__dirname, '../build/resources'))) {
    fs.mkdirSync(path.join(__dirname, '../build/resources'), { recursive: true });
  }
  
  // Copy favicon for use as app icon
  if (fs.existsSync(path.join(__dirname, '../public/favicon.ico'))) {
    fs.copyFileSync(
      path.join(__dirname, '../public/favicon.ico'), 
      path.join(__dirname, '../build/resources/icon.ico')
    );
  } else {
    console.warn('Warning: favicon.ico not found, using default icon');
  }
} catch (error) {
  console.error('Error copying resources:', error);
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
