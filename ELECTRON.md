
# DysAccess Buddy - Desktop Application

Cette application peut être exécutée comme une application de bureau grâce à Electron. Voici comment la compiler et l'exécuter sans modifier le fichier package.json.

## Prérequis

- Node.js (v18 ou supérieur)
- npm (v8 ou supérieur)

## Construction de l'application

### 1. Installer les dépendances du projet

```bash
npm install
```

### 2. Installer les dépendances d'Electron (première fois uniquement)

```bash
npm install electron@latest --no-save
```

### 3. Exécuter le script de construction pour Windows

```bash
node scripts/build-electron.cjs win
```

### 4. Exécuter le script de construction pour Mac

```bash
node scripts/build-electron.cjs mac
```

### 5. Exécuter le script de construction pour Linux

```bash
node scripts/build-electron.cjs linux
```

### 6. Exécuter le script de construction pour toutes les plateformes

```bash
node scripts/build-electron.cjs
```

## Résolution des problèmes courants

### Problème de type de module CommonJS/ESM

**Erreur** : `SyntaxError: Invalid or unexpected token`

**Solution** : Le projet utilise `"type": "module"` dans package.json, mais les scripts de build utilisent CommonJS. L'extension `.cjs` force Node.js à interpréter le fichier comme CommonJS.

### Problème d'encodage de fichier

**Erreur** : `SyntaxError: Invalid or unexpected token` sur la première ligne

**Solutions** :
- Assurez-vous que tous les fichiers de script sont sauvegardés en **UTF-8 sans BOM**
- Dans VS Code : Fichier → Enregistrer avec l'encodage → UTF-8
- Dans d'autres éditeurs : Vérifiez les paramètres d'encodage et supprimez le BOM si présent

## Où trouver l'application

Après la construction, vous trouverez les installateurs et les fichiers binaires dans le dossier `release` à la racine du projet.

## Processus de Release Automatisée

Ce projet est configuré avec GitHub Actions pour automatiquement construire et publier des applications de bureau lorsqu'un nouveau tag de version est poussé.

### Pour créer une nouvelle release:

1. Mettez à jour la version dans `package.json`
2. Créez un nouveau tag et poussez-le sur GitHub:

```bash
git tag v1.0.0  # Changez ceci pour votre numéro de version
git push origin v1.0.0
```

3. GitHub Actions va automatiquement construire l'application pour Windows, macOS et Linux
4. Les artefacts de build seront disponibles dans la section "Releases" du dépôt GitHub

### Structure du Workflow GitHub Actions

Le workflow `.github/workflows/build-and-release.yml` effectue les étapes suivantes:

1. Déclenche le build quand un tag commençant par "v" est poussé (ex: v1.0.0)
2. Configure des environnements de build pour Windows, macOS et Linux
3. Compile les fichiers TypeScript et construit l'application Vite
4. Exécute le script de build Electron pour chaque plateforme (avec l'extension `.cjs`)
5. Télécharge les artefacts générés (fichiers .exe, .dmg, .AppImage, etc.)
6. Crée une nouvelle release GitHub avec ces artefacts

## Développement en mode Electron

Pour développer et tester l'application en mode Electron sans créer d'installateur, vous pouvez utiliser les commandes suivantes:

```bash
# Compiler les fichiers TypeScript de l'application Electron
npx tsc -p tsconfig.electron.json

# Lancer le serveur de développement Vite
npm run dev

# Dans un autre terminal, lancer Electron qui pointera vers le serveur de développement
NODE_ENV=development npx electron electron/main.js
```

Pour Windows, utilisez la syntaxe suivante pour définir la variable d'environnement:

```bash
set NODE_ENV=development && npx electron electron/main.js
```

## Notes importantes

- Cette application utilise Electron pour créer une expérience de bureau native
- Les applications web s'ouvrent dans le navigateur par défaut de l'utilisateur
- Les applications locales sont lancées via le système d'exploitation
- Le script de build utilise l'extension `.cjs` pour éviter les conflits CommonJS/ESM

## Fonctionnalités spécifiques à la version de bureau

- Possibilité de lancer des applications locales
- Possibilité d'ouvrir des sites web dans le navigateur par défaut
- L'application peut être exécutée au démarrage de l'ordinateur (configurable via l'installateur)
- La barre d'outils flottante reste toujours visible au-dessus des autres fenêtres
