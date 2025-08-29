#  City Pulse  

##  Project Setup  

### 1. Clone project  
```bash
git clone https://github.com/sohelkhan2309/CityPulse
```

### 2. (Optional) Create new project if not able to clone  
```bash
npx @react-native-community/cli init CityPulse
```

Make sure the **package name** is:  
```
com.citypulse
```

### 3. Open project in VS Code  
```bash
cd CityPulse
```

### 4. Install Dependencies  
```bash
npm install @react-native-firebase/app @react-native-firebase/auth
npm install @react-native-async-storage/async-storage
npm install react-native-biometrics
npm install react-native-maps
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/stack
npm install axios i18next
npm install react-native-localize
```

### 5. iOS Setup  
```bash
cd ios
pod install
cd ..
```

---

## Run the App  

### Android  
```bash
npx react-native run-android
```

### iOS  
```bash
npx react-native run-ios
```

---

## Features in the App  

-  **User Authentication** (Signup, Login, Logout with Firebase)  
-  **Local Storage** using AsyncStorage  
-  **Biometric Authentication** (Fingerprint / FaceID login)  
-  **Maps Integration** in Detail Screen (requires Google Maps API key for Android)  
