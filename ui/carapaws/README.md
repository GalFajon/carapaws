# CaraPaws UI
React + Capacitor mobile UI for the CaraPaws app.

## Sitter profile prototype

Owners can open **View sitter profile** from a dog's **Your sitter** card or the
**Find sitter** directory.
Sitters can open **My profile** from the bottom navigation. The simple read-only
form shows a centered initials avatar, name, location, contact, qualifications and
reference points, followed by past client references. Profile editing and review
submission are not implemented in this display prototype.

All profile details, qualifications, reviews and references are fictional; the
contact uses an example.com address. Reference points mean care experience and
strengths. Ratings and feedback remain in the mock data but are not displayed.
Empty, loading
and load-error states are included. Profiles are fetched through the in-memory
care service so an API can replace the mock data later.

The two seeded dogs start with Jane Doe as their accepted sitter. Past client
references describe the displayed sitter, not a history of the dog's sitters.

## Add a dog demo

The owner dog list has an **Add dog** form for a photo, profile details, feeding
routine, medical information, emergency contact, and likes and dislikes. A photo
is optional in this demo; a generic paw placeholder appears when none is chosen.
The form checks the required identity and emergency fields and accepts photos up
to 5 MB. New dogs are kept only in React state for the current app session; they
disappear on reload and are not written to the mock fixtures or an API. They have
no sitter or updates until a sitter accepts a request. The sitter view shows
only dogs assigned to the currently selected demo sitter.
The owner dog profile includes an **Edit** button as a placeholder; editing is
not implemented yet, and tapping it explains that no details will change.

## Find and add a sitter demo

From a dog's profile, owners can open **Find sitter**, filter demo profiles by
name or @username, location, care type, and availability, then send one
**Add sitter** request. Each sitter has a unique lowercase username in the
mock directory; the profile is still linked internally by its stable user ID.
The chosen sitter sees a pending request on their dog list and can accept or
decline it. Acceptance adds the dog to that sitter's list and lets them post
photo updates. Declining frees the owner to try another sitter. Use the header
demo menu to switch among sitter accounts and try both responses.

This is an in-memory connection flow with no dates, prices, payments, or
booking confirmation. Requests, assignments, availability, and newly added
dogs reset when the app reloads. The database schema has not yet been adapted
to this simpler request/assignment model; future persistence should enforce a
case-insensitive unique sitter username.

## How the project works

- **React and TypeScript** contain the application screens and behaviour.
- **Material UI** provides the visual components, such as buttons and cards.
- **Vite** runs the project in a browser and creates the production web build.
- **Capacitor** places that web build inside a native Android application.
- **Android Studio and the Android SDK** provide the Android compiler, emulator,
  and device tools.

The usual Android workflow is:

```text
React source -> Vite build in dist/ -> Capacitor sync -> Android app
```

## Project location

From your command line, enter the UI project directory before running any command in
this guide:

```powershell
cd C:\...\carapaws\ui\carapaws
```

## Installation requirements

### 1. Node.js

Install Node.js 22 or newer.

Check the installation:

```powershell
node --version
npm --version
```

If either command is not recognized, close and reopen PowerShell after
installing Node.js.

### 2. Android Studio and Android SDK

Install Android Studio 2025.2.1 or newer. The project can be operated mainly
from the command line, but Android Studio is the easiest way to install the
required Android SDK, emulator, and Java Development Kit (JDK).

> **Heads up:** Android Studio does not always install the Android SDK
> Command-line Tools by default. Gradle/Capacitor builds can fail even when
> Android Studio itself is installed. In Android Studio, open **Tools > SDK
> Manager > SDK Tools**, select **Android SDK Command-line Tools (latest)**,
> and apply the change before running the Android build commands below.

> **Java version heads up:** This project uses Gradle 8.14.x, which cannot run
> on Java 25. If a build reports `Unsupported class file major version 69`, it
> is running with Java 25. Install a full **Oracle JDK 21** (not a JRE); the
> Android project selects it for the Gradle daemon. Do not upgrade Gradle
> independently; its version must remain compatible with the Android Gradle
> Plugin and Capacitor.

During Android Studio's first-run setup, allow it to install the recommended
SDK components. Then open **Tools > SDK Manager** and confirm that these are
installed:

- Android SDK Platform 36
- Android SDK Platform-Tools
- Android SDK Build-Tools
- Android Emulator, if you plan to use a virtual device
- Android SDK Command-line Tools (latest)

The project currently compiles against Android API 36 and supports Android API
24 or newer.

Android Studio includes a compatible JDK, so a separate Java installation is
normally not necessary.

## First-time project setup

Install the dependencies listed in `package.json`:

```powershell
npm install
```

Confirm that the web application builds and passes its code checks:

```powershell
npm run build
npm run lint
```

Both commands should finish without errors.

## Test the application in a web browser

The browser is the quickest place to develop and test most CaraPaws screens.

Start the Vite development server:

```powershell
npm run dev
```

Vite prints a local address, normally:

```text
http://localhost:5173/
```

Open that address in a browser. Vite automatically refreshes the page when you
save most source-code changes.

When developing, use your browsers development tools to simulate running the application on a phone screen.

To stop the server, return to its PowerShell window and press `Ctrl+C`.

### Test the production web build

The development server is convenient, but it is also useful to test the
optimized build that Capacitor will package:

```powershell
npm run build
npm run preview
```

Open the address printed by Vite. Press `Ctrl+C` when finished.

## Run the application on an Android emulator

### Create an emulator for the first time

The simplest beginner-friendly method is Android Studio:

1. Open Android Studio.
2. Open **Tools > Device Manager**.
3. Select **Create Virtual Device**.
4. Choose a phone profile, such as a recent Pixel device.
5. Select or download an API 36 system image.
6. Finish the wizard and start the device with its play button.

The first emulator start can be slow. Later starts are normally faster.

### Run CaraPaws on the emulator

With the emulator running, return to the project directory in PowerShell and
run:

```powershell
npm run android:run
```

This script:

1. Creates the latest Vite build.
2. Synchronizes it with the Android project.
3. Compiles the Android application.
4. Lets you select a running emulator or connected device.
5. Installs and launches CaraPaws.

If prompted for a target, select the emulator you just started.

If you run into trouble setting up an emulator or the JDK, you can configure the Android studio project of the application with:

```powershell
    npx cap open android
```

### Start an existing emulator from PowerShell

After an emulator has been created, Android Studio does not need to remain open.
If the Android SDK emulator command is available on your `PATH`, list and start
virtual devices with:

```powershell
emulator -list-avds
emulator -avd YourEmulatorName
```

Replace `YourEmulatorName` with a name returned by the first command. Leave that
PowerShell window open while the emulator is running, and use another window to
run `npm run android:run`.

## Run the application on a physical Android device

Testing on a real phone is often faster than using an emulator.

### Enable development access on the phone

The precise menu wording differs slightly between phone manufacturers:

1. Open the phone's **Settings**.
2. Open **About phone**.
3. Tap **Build number** seven times, until developer mode is enabled.
4. Return to Settings and open **Developer options**.
5. Enable **USB debugging**.
6. Connect the phone to the computer with a USB data cable.
7. Unlock the phone and accept the USB debugging authorization prompt.

Some Windows computers also need the phone manufacturer's USB driver.

### Confirm that the phone is connected

If Android Platform-Tools are available on your `PATH`, run:

```powershell
adb devices
```

The phone should be listed as `device`. If it says `unauthorized`, unlock the
phone and accept the authorization prompt. If no device appears, try another
USB cable or USB port and confirm that the cable supports data transfer.

### Install and run CaraPaws

Run:

```powershell
npm run android:run
```

Select the physical phone if Capacitor asks which target to use. Keep the phone
unlocked during the first installation.

## Everyday development workflow

For normal UI development, keep this running:

```powershell
npm run dev
```

Use the browser for quick feedback. When you need to test Android-specific
behaviour, run:

```powershell
npm run android:run
```

If you only want to update the native Android project without launching it,
run:

```powershell
npm run android:sync
```

The project scripts are:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the browser development server |
| `npm run build` | Type-check and create the production build in `dist/` |
| `npm run preview` | Preview the current production build in a browser |
| `npm run lint` | Check the source code for common mistakes |
| `npm run android:sync` | Build the web app and synchronize Android |
| `npm run android:run` | Build, synchronize, install, and launch Android |

## Installing or updating packages

After pulling changes that modify `package.json` or `package-lock.json`, run:

```powershell
npm install
```

To add a normal web package, use:

```powershell
npm install package-name
```

For example, MUI icons would be installed with:

```powershell
npm install @mui/icons-material
```

Capacitor plugins need an additional synchronization step. For example:

```powershell
npm install @capacitor/camera@^8
npm run android:sync
```

Keep official Capacitor packages on the same major version as the project,
which is currently Capacitor 8. Commit changes to both `package.json` and
`package-lock.json` when intentionally adding or updating a dependency.

## Create Android build files from the command line

### Debug APK

A debug APK can be installed directly on a device:

```powershell
npm run android:sync
cd android
.\gradlew.bat assembleDebug
```

The APK is normally created at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Return to the project directory afterward:

```powershell
cd ..
```

### Release bundle

Google Play normally uses an Android App Bundle (`.aab`):

```powershell
npm run android:sync
cd android
.\gradlew.bat bundleRelease
```

The bundle is normally created at:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

A public release must be signed with the team's release key. Do not create or
publish a new release key without coordinating with the team, and never commit
keystore files or passwords to Git.

## Troubleshooting

### Android shows an older version of the UI

The browser source does not copy itself into Android automatically. Run:

```powershell
npm run android:sync
```

Then launch the app again.

### Capacitor cannot find the web assets directory

Run:

```powershell
npm run build
```

This creates `dist/`. The project's `capacitor.config.ts` is already configured
to use that directory.

### No Android target is available

Make sure that either:

- an emulator is fully started, or
- a physical phone is connected with USB debugging authorized.

If available, check with:

```powershell
adb devices
```

### `adb` or `emulator` is not recognized

The Android SDK tools are installed, but their directories are not on your
Windows `PATH`. They are usually located below:

```text
%LOCALAPPDATA%\Android\Sdk\platform-tools
%LOCALAPPDATA%\Android\Sdk\emulator
%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin
```

Add the required directories to your user `PATH`, then close and reopen
PowerShell.

### Gradle takes a long time or appears stuck

The first Android build downloads Gradle and Android dependencies and can take
several minutes. Let it finish. Later builds should be faster.

### Gradle reports missing Android SDK command-line tools

Open Android Studio and go to **Tools > SDK Manager > SDK Tools**. Install
**Android SDK Command-line Tools (latest)**, apply the change, and then rerun:

```powershell
npm run android:sync
```

### Gradle reports `Unsupported class file major version 69`

Class-file version 69 means the Gradle build tried to run with Java 25. This
project selects a full Oracle JDK 21 for its Gradle daemon. Install that JDK,
then check that Gradle can find it from the `android` directory:

```powershell
cd android
.\gradlew.bat --version
cd ..
```

The output should say `Daemon JVM: Compatible with Java 21, Oracle`. Java 25
may still appear as the *launcher* JVM; the daemon is what runs the build. If
Gradle cannot find JDK 21, point this PowerShell session at its installation:

```powershell
$env:JAVA_HOME = "C:\path\to\oracle-jdk-21"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
npm run android:run
```

Replace the example path with the actual Oracle JDK 21 installation directory.

### A build fails after pulling new code

Try the normal clean setup first:

```powershell
npm install
npm run build
npm run android:sync
```

Read the first actual error in the output rather than only the final "build
failed" message. Ask a teammate before deleting generated project directories
or changing Gradle versions.

## Important project files

| Path | Purpose |
| --- | --- |
| `src/` | React and MUI application source code |
| `public/` | Static files copied into the web build |
| `dist/` | Generated Vite build; do not edit it manually |
| `capacitor.config.ts` | Capacitor app name, ID, and web build location |
| `android/` | Native Android project managed by Capacitor and Gradle |
| `package.json` | Dependencies and reusable npm commands |
| `package-lock.json` | Exact dependency versions used by the team |

Continue making normal UI changes in `src/`. Only edit files under `android/`
when the change is genuinely Android-specific, such as permissions, signing,
icons, or native plugin configuration.
