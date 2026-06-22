# App Store Distribution Guide for ShopGrad

## Android (Google Play Store)

### Prerequisites
- Node.js installed
- Java JDK 8 or higher
- Android SDK
- Bubblewrap CLI installed

### Step 1: Install Bubblewrap CLI
```bash
npm install -g @bubblewrap/cli
```

### Step 2: Initialize the Project
```bash
cd d:\rci\shopgrad
bubblewrap init --manifest twa-manifest.json
```

### Step 3: Build the Project
```bash
cd android
gradlew assembleRelease
```

### Step 4: Generate Signed APK/AAB
```bash
# Create keystore (first time only)
keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000

# Build signed AAB for Play Store
gradlew bundleRelease
```

### Step 5: Upload to Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Upload the AAB file from `android/app/release/app-release.aab`
4. Complete the store listing (screenshots, description, etc.)
5. Submit for review

## iOS (Apple App Store)

### Prerequisites
- Mac computer with Xcode
- Apple Developer Account ($99/year)
- PWA Builder

### Step 1: Use PWA Builder
1. Go to [PWA Builder](https://www.pwabuilder.com/)
2. Enter your app URL: `https://your-domain.com`
3. Click "Package for iOS"
4. Download the generated Xcode project

### Step 2: Open in Xcode
1. Open the downloaded project in Xcode
2. Sign the app with your Apple Developer account
3. Configure app icons and splash screens
4. Test on a physical device

### Step 3: Submit to App Store
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app
3. Upload the built app from Xcode
4. Complete the store listing
5. Submit for review

## Important Notes

### Before Distribution
- Update the `host` in `twa-manifest.json` to your production domain
- Replace `localhost:3000` with your actual domain
- Create proper app icons (PNG format required for app stores)
- Add app screenshots for store listings
- Prepare app descriptions and privacy policy

### Domain Requirements
- Must use HTTPS (SSL certificate required)
- Domain must be publicly accessible
- Manifest and service worker must be accessible

### Testing
- Test the PWA thoroughly before distribution
- Test on multiple devices
- Ensure all features work offline
- Verify dark mode functionality

### Costs
- Google Play: $25 one-time registration fee
- Apple App Store: $99/year developer fee
- Hosting: Varies by provider

## Next Steps
1. Deploy your app to a production domain
2. Update the manifest with production URLs
3. Create proper PNG app icons (192x192 and 512x512)
4. Follow the platform-specific steps above
