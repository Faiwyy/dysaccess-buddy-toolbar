
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
    buildResources: "public",
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
    artifactName: "${productName}-${version}-Setup.${ext}"
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false
  },
  mac: {
    target: ["dmg"],
    artifactName: "${productName}-${version}-Installer.${ext}"
  },
  linux: {
    target: ["AppImage"],
    artifactName: "${productName}-${version}.${ext}"
  }
};
