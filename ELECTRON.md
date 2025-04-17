
# DysAccess Buddy - Desktop Application

Cette application peut être exécutée comme une application de bureau grâce à Electron. Voici comment la compiler et l'exécuter sans modifier le fichier package.json.

## Prérequis

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)

## Construction de l'application

### 1. Installer les dépendances du projet

```bash
npm install
```

### 2. Exécuter le script de construction pour Windows

```bash
node scripts/build-electron.js win
```

### 3. Exécuter le script de construction pour Mac

```bash
node scripts/build-electron.js mac
```

### 4. Exécuter le script de construction pour Linux

```bash
node scripts/build-electron.js linux
```

### 5. Exécuter le script de construction pour toutes les plateformes

```bash
node scripts/build-electron.js
```

## Où trouver l'application

Après la construction, vous trouverez les installateurs et les fichiers binaires dans le dossier `release` à la racine du projet.

## Développement en mode Electron

Pour développer et tester l'application en mode Electron sans créer d'installateur, vous pouvez utiliser les commandes suivantes:

```bash
# Installer Electron (uniquement la première fois)
npm install electron --no-save

# Lancer le serveur de développement Vite
npm run dev

# Dans un autre terminal, lancer Electron qui pointera vers le serveur de développement
npx electron electron/main.js
```

## Notes importantes

- Cette application utilise Electron pour créer une expérience de bureau native
- Les applications web s'ouvrent dans le navigateur par défaut de l'utilisateur
- Les applications locales sont lancées via le système d'exploitation

## Fonctionnalités spécifiques à la version de bureau

- Possibilité de lancer des applications locales
- Possibilité d'ouvrir des sites web dans le navigateur par défaut
- L'application peut être exécutée au démarrage de l'ordinateur (configurable via l'installateur)
