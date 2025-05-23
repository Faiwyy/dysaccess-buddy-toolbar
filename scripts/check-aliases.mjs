
#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Checking alias configuration and file structure...\n');

// Check if key files exist
const projectRoot = resolve(__dirname, '..');
const srcPath = resolve(projectRoot, 'src');

const filesToCheck = [
  'src/components/ui/toaster.tsx',
  'src/components/ui/toast.tsx', 
  'src/hooks/use-toast.ts',
  'src/lib/utils.ts',
  'vite.config.ts'
];

console.log('📁 Checking file existence:');
let allFilesExist = true;

filesToCheck.forEach(file => {
  const fullPath = resolve(projectRoot, file);
  const exists = existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. This may cause alias resolution errors.');
  process.exit(1);
}

// Check vite.config.ts alias configuration
console.log('\n⚙️  Checking Vite configuration:');
try {
  const viteConfigPath = resolve(projectRoot, 'vite.config.ts');
  const viteConfig = readFileSync(viteConfigPath, 'utf8');
  
  if (viteConfig.includes('"@"') && viteConfig.includes('path.resolve(__dirname, "./src")')) {
    console.log('✅ Vite alias configuration found');
  } else {
    console.log('❌ Vite alias configuration missing or incorrect');
  }
} catch (error) {
  console.log('❌ Could not read vite.config.ts');
}

console.log('\n🎯 Diagnosis complete!');
console.log('\nIf you still have alias issues, try:');
console.log('1. npm run clean-install');
console.log('2. npx vite --force');
console.log('3. npm run build');
