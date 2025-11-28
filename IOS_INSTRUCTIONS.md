# How to Run "Three Clues" on Your iPhone (Free Account)

Since you are using a free Apple Developer account, you need to manually sign and build the app using Xcode.

## Prerequisites
1.  **Xcode**: Ensure you have the full **Xcode** app installed from the App Store (not just Command Line Tools).
2.  **CocoaPods**: This project uses CocoaPods to manage iOS dependencies.
    *   Check if installed: `pod --version`
    *   Install if missing: `sudo gem install cocoapods`

## Step 1: Fix Xcode Path (Important)
The build system might try to use Command Line Tools instead of the full Xcode app. Run this command in your terminal to fix it:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

## Step 2: Install iOS Dependencies
Navigate to the iOS project folder and install the dependencies:

```bash
cd ios/App
pod install
```

*If `pod install` fails, make sure you ran the command in Step 1.*

## Step 3: Open Project in Xcode
Open the **workspace** file (this is important, do not open the `.xcodeproj` file):

```bash
open App.xcworkspace
```

## Step 4: Configure Signing (Crucial for Free Account)
1.  In Xcode, click on the **App** project in the left navigator (the top blue icon).
2.  Select the **App** target in the main view (under "Targets").
3.  Go to the **Signing & Capabilities** tab.
4.  Check the box for **Automatically manage signing**.
5.  In the **Team** dropdown, select your **Personal Team** (it should be your name followed by "(Personal Team)").
    *   *If you don't see it, go to **Xcode > Settings > Accounts** and add your Apple ID.*
6.  **Bundle Identifier**: You might need to change `com.sanzgiri.threeclues` to something unique, like `com.yourname.threeclues`, if Xcode complains about registration.

## Step 5: Run on Device
1.  Connect your iPhone to your Mac via USB.
2.  Unlock your iPhone.
3.  In Xcode, look at the top toolbar. Select your **iPhone** from the device list (it might currently say "Any iOS Device").
4.  Click the **Play** button (or press `Cmd + R`) to build and install the app.

## Step 6: Trust the App on iPhone
The first time you install, the app won't launch immediately due to security settings.
1.  On your iPhone, go to **Settings > General > VPN & Device Management** (or "Profiles & Device Management").
2.  Tap on your email address under "Developer App".
3.  Tap **Trust "Your Email"**.
4.  Tap **Trust** again to confirm.

## Step 7: Play!
You can now launch "Three Clues" from your home screen.

---

### ⚠️ Important Note on Expiration
With a free Apple Developer account, this "provisioning profile" expires every **7 days**.
- After 7 days, the app will stop opening.
- To fix this, simply connect your phone to your Mac, open Xcode, and click the **Play** button again to re-install/re-sign it.
