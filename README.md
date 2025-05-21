
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

- Node.js (v14 or higher)
- npm (v6 or higher)
- For building Windows apps: Windows or WSL
- For building macOS apps: macOS is required
- For building Linux apps: Any OS can build for Linux

### Building Desktop Applications

To build desktop applications for different platforms, follow these steps:

```sh
# Step 1: Clone the repository and install dependencies
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install

# Step 2: Build for specific platform
# For Windows (.exe)
node scripts/build-electron.js win

# For macOS (.dmg)
node scripts/build-electron.js mac

# For Linux (.AppImage, .deb, .rpm)
node scripts/build-electron.js linux

# For all platforms
node scripts/build-electron.js
```

### Output Files

After building, you will find the installation packages in the `release` directory:

- Windows: `release/DysAccess Buddy-[version]-Setup.exe`
- macOS: `release/DysAccess Buddy-[version]-Installer.dmg`
- Linux: `release/DysAccess Buddy-[version].AppImage`, `.deb`, and `.rpm` files

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
# Compile TypeScript files for Electron
npx tsc -p tsconfig.electron.json

# Start development server
npm run dev

# In another terminal, run Electron pointing to the development server
# For Windows:
set NODE_ENV=development && npx electron electron/main.js

# For macOS/Linux:
NODE_ENV=development npx electron electron/main.js
```

For more detailed information, see the ELECTRON.md file in this repository.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5ea874f3-7aef-41cb-bfd4-1d42e902ea31) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains in Lovable and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
