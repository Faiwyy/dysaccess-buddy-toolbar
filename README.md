
# Welcome to your DysAccess Buddy project

## Project info

**URL**: https://lovable.dev/projects/5ea874f3-7aef-41cb-bfd4-1d42e902ea31

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5ea874f3-7aef-41cb-bfd4-1d42e902ea31) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Electron

## Building Desktop Applications

This project supports building desktop applications for Windows, macOS, and Linux using Electron.

### Prerequisites

- **Node.js** (v18 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **npm** (v8 or higher) - comes with Node.js
- **Git** - for cloning the repository

### Platform-specific requirements:
- For building Windows apps: Windows OS or WSL on Windows
- For building macOS apps: macOS is **required** (cannot build .dmg on other platforms)
- For building Linux apps: Any OS can build for Linux

### Installation Instructions

1. **Clone the repository**
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```sh
npm install
```

3. **Verify your setup**
```sh
# Check Node.js version (should be 18+)
node --version

# Check npm version (should be 8+)
npm --version
```

### Building Desktop Applications Locally

⚠️ **Important**: Use `.cjs` extension for build scripts to avoid CommonJS/ESM conflicts.

#### Build for specific platforms:

```sh
# For Windows (.exe installer)
node scripts/build-electron.cjs win

# For macOS (.dmg installer) - macOS only
node scripts/build-electron.cjs mac

# For Linux (.AppImage, .deb, .rpm)
node scripts/build-electron.cjs linux

# For all platforms (requires appropriate OS for each)
node scripts/build-electron.cjs
```

### Troubleshooting Common Issues

#### 1. Module Type Conflicts
**Error**: `SyntaxError: Invalid or unexpected token`

**Solution**: The project uses ESM modules (`"type": "module"` in package.json), but build scripts use CommonJS. Make sure to use the `.cjs` extension for CommonJS scripts.

#### 2. File Encoding Issues
**Error**: `SyntaxError: Invalid or unexpected token` on first line

**Solutions**:
- Ensure all script files are saved as **UTF-8 without BOM**
- In VS Code: File → Save with Encoding → UTF-8
- In other editors: Check encoding settings and remove BOM if present

#### 3. Permission Issues (macOS/Linux)
**Error**: Permission denied when running build scripts

**Solution**:
```sh
chmod +x scripts/build-electron.cjs
```

#### 4. Missing Dependencies
**Error**: Cannot find module 'electron' or 'electron-builder'

**Solution**: The build script automatically installs these dependencies, but you can install them manually:
```sh
npm install electron electron-builder --no-save
```

### Output Files Location

After building, you will find the installation packages in the `release` directory:

- **Windows**: `release/DysAccess Buddy-[version]-Setup.exe`
- **macOS**: `release/DysAccess Buddy-[version]-Installer.dmg`
- **Linux**: `release/DysAccess Buddy-[version].AppImage`, `.deb`, and `.rpm` files

### Automated Builds with GitHub Actions

This project is configured with GitHub Actions to automatically build and release desktop applications when a new version tag is pushed.

#### Creating a new release:

1. **Update the version in `package.json`**
2. **Create and push a new tag**:
```sh
# Create a new tag (replace with your version)
git tag v1.0.0

# Push the tag to GitHub
git push origin v1.0.0
```

3. **GitHub Actions will automatically**:
   - Build the application for Windows, macOS, and Linux
   - Create installers for each platform
   - Upload the build artifacts to the "Releases" section

### Features of the Desktop Application

- **Floating Toolbar**: Always accessible on your desktop
- **Local Application Launcher**: Launch applications installed on your computer
- **Web Application Launcher**: Open websites in your default browser
- **Voice Dictation**: Type with your voice in any application
- **Always on Top**: Stays visible above other windows
- **Auto-start**: Option to launch at system startup
- **System Tray Icon**: Quick access to settings and control

### Development Mode

For development and testing without building installation packages:

```sh
# 1. Compile TypeScript files for Electron
npx tsc -p tsconfig.electron.json

# 2. Start development server
npm run dev

# 3. In another terminal, run Electron pointing to the development server
# For Windows:
set NODE_ENV=development && npx electron electron/main.js

# For macOS/Linux:
NODE_ENV=development npx electron electron/main.js
```

### Additional Resources

For more detailed information about Electron builds and configuration, see the [ELECTRON.md](./ELECTRON.md) file in this repository.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5ea874f3-7aef-41cb-bfd4-1d42e902ea31) and click on Share → Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains in Lovable and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
