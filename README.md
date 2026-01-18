# Zenith Focus Launcher

A minimalist focus launcher app inspired by Minimal Phone, designed to promote intentional phone usage and digital wellbeing.

## Features

### 🎯 Focus & Productivity
- **Focus Timer**: Customizable Pomodoro-style timer with notifications
- **Session Tracking**: Automatic tracking of focus sessions with completion rates
- **Statistics Dashboard**: Weekly analytics and productivity insights

### 🧘 Digital Minimalism
- **Grayscale Mode**: Reduce visual appeal to minimize phone addiction
- **Intentional Mode**: Hide distracting apps, show only essentials
- **Intention Prompts**: Ask "Why?" before launching distracting apps
- **Launch Delay**: Add friction (3-15s) before opening apps
- **App Categorization**: Mark apps as Essential, Productive, or Distracting

### 📊 Analytics
- Total focus time and session count
- Completion rate tracking
- App launch analytics
- Most productive day insights
- Weekly progress charts

### ⚙️ Customization
- Pure black or dark gray themes
- Configurable launch delays
- Data export/import
- Daily motivational mantras

## Installation

### Option 1: PWA (Progressive Web App)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Deploy** to any static hosting service (Vercel, Netlify, GitHub Pages)

5. **Install on mobile**:
   - Open the deployed URL in Chrome/Edge on Android
   - Tap the menu (⋮) → "Add to Home screen"
   - The app will install as a PWA

### Option 2: Android APK (Native App)

#### Prerequisites
- Node.js and npm installed
- Android Studio or Android SDK Command Line Tools
- Java JDK 17 or higher

#### Build Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the web app**:
   ```bash
   npm run build
   ```

3. **Initialize Capacitor** (first time only):
   ```bash
   npx cap init
   ```
   - App name: `Zenith`
   - App ID: `com.zenith.focuslauncher`
   - Web directory: `dist`

4. **Add Android platform** (first time only):
   ```bash
   npx cap add android
   ```

5. **Sync web assets to Android**:
   ```bash
   npm run sync
   ```

6. **Open in Android Studio**:
   ```bash
   npm run android
   ```

7. **Build APK in Android Studio**:
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK will be in `android/app/build/outputs/apk/debug/`

#### Build from Command Line

```bash
cd android
./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

## Development

### Project Structure

```
zenith-focus-launcher/
├── components/          # React components
│   ├── Home.tsx        # Main launcher screen
│   ├── FocusTimer.tsx  # Focus session timer
│   ├── AppDrawer.tsx   # App list with categorization
│   ├── Stats.tsx       # Analytics dashboard
│   ├── Settings.tsx    # Settings screen
│   ├── IntentionPrompt.tsx  # Intention dialog
│   └── Camera.tsx      # Camera interface
├── services/           # Business logic
│   ├── focusService.ts # Daily mantras
│   └── storageService.ts # localStorage management
├── public/
│   └── sw.js          # Service worker for PWA
├── types.ts           # TypeScript interfaces
├── constants.tsx      # App constants
├── App.tsx           # Main app component
├── manifest.json     # PWA manifest
└── capacitor.config.ts # Capacitor configuration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run sync` - Sync web assets to Capacitor
- `npm run android` - Open Android project in Android Studio
- `npm run build:android` - Build web app and sync to Android

## How It Works

### Focus Sessions
1. Select duration (5, 15, 25, 45, 60, 90 min or custom)
2. Start timer - session is tracked in localStorage
3. Complete or cancel - data is saved for analytics
4. View progress in Statistics screen

### App Categorization
1. Open App Drawer
2. Use dropdown next to each app to categorize:
   - **Essential**: Always visible, even in Intentional Mode
   - **Productive**: Normal apps
   - **Distracting**: Triggers intention prompt if enabled
3. Categories are saved in localStorage

### Intentional Mode
- Enable in Settings → Focus → Intentional Mode
- Only Essential apps will be shown in App Drawer
- Helps reduce distractions

### Intention Prompts
- Enable in Settings → Focus → Intention Prompt
- When launching a Distracting app, you'll be asked:
  - "What's your intention for using this app?"
  - Wait 5 seconds (configurable) before proceeding
- Helps build mindful usage habits

### Grayscale Mode
- Enable in Settings → Visual → Grayscale Mode
- Entire app turns grayscale
- Makes phone less visually appealing
- Reduces dopamine-driven usage

## Data Management

All data is stored locally in your browser's localStorage:
- User settings
- App categories
- Focus session history
- App launch logs

### Export Data
Settings → Data → Export Data (downloads JSON file)

### Import Data
Settings → Data → Import Data (upload JSON file)

### Clear Data
Settings → Data → Clear All Data (cannot be undone)

## Browser Compatibility

- **Chrome/Edge**: Full support (PWA + all features)
- **Firefox**: Works, limited PWA support
- **Safari**: Works, limited PWA support

## Android Compatibility

- Minimum SDK: 22 (Android 5.1)
- Target SDK: 34 (Android 14)
- Tested on Android 10+

## Troubleshooting

### Build Errors

If `npm run build` fails:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Try `npm run build` again

### Capacitor Sync Issues

If `npm run sync` fails:
1. Make sure `dist` folder exists: `npm run build`
2. Try `npx cap sync android` directly

### Android Build Issues

1. **Gradle errors**: Update Android Studio and SDK tools
2. **Java version**: Ensure JDK 17 is installed
3. **SDK not found**: Set `ANDROID_HOME` environment variable

## License

MIT

## Credits

Inspired by [Minimal Phone](https://www.minimalistphone.com/) and digital minimalism principles.

Built with React, TypeScript, Vite, and Capacitor.
