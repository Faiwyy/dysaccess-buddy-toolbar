
/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: "dev.dysaccess.buddy-toolbar",
  productName: "DysAccess Buddy",
  copyright: "Copyright © 2023",
  asar: true,
  directories: {
    output: "release",
    buildResources: "build/resources",
  },
  files: [
    "dist/**/*",
    "electron/**/*"
  ],
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"]
      }
    ],
    icon: "build/resources/icon.ico",
    artifactName: "${productName}-${version}-Setup.${ext}"
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    runAfterFinish: true
  },
  mac: {
    target: ["dmg"],
    icon: "public/favicon.ico", 
    artifactName: "${productName}-${version}-Installer.${ext}",
    category: "public.app-category.education",
    hardenedRuntime: true
  },
  linux: {
    target: ["AppImage", "deb", "rpm"],
    artifactName: "${productName}-${version}.${ext}",
    icon: "public/favicon.ico",
    category: "Education"
  }
};
