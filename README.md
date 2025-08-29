# City Pulse  

## Project Setup  

### 1. Clone project
git clone <your-repo-url>

###Optional 
###Project creation if not able clone from git
npx @react-native-community/cli init CityPulse

###Check package name should be
com.citypulse

### 2. Setup in VS code
cd CityPulse

### 3. Install Dependencies  

npm install @react-native-firebase/app @react-native-firebase/auth
npm install @react-native-async-storage/async-storage
npm install react-native-biometrics
npm install react-native-maps
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/stack
npm install axios i18next
npm install react-native-biometrics react-native-localize react-native-maps


### 4. iOS Setup  

cd ios
pod install
cd ..

---

## Run the App  

### Android  
npx react-native run-android

### iOS  
npx react-native run-ios

---

## Features in the App  

- **User Authentication** (Signup, Login, Logout with Firebase)  
- **Local Storage** using AsyncStorage  
- **Biometric Authentication** (Fingerprint / FaceID login)  
- **Maps Integration** in Detail Screen (requires Google Maps API key for Android)  
