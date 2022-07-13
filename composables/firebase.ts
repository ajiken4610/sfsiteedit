// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQKqjlc4MXtSCkbKCVwCmJAY-6UQK18sk",
  authDomain: "sfsiteedit.firebaseapp.com",
  projectId: "sfsiteedit",
  storageBucket: "sfsiteedit.appspot.com",
  messagingSenderId: "472814968326",
  appId: "1:472814968326:web:273f8a26da409d6a45ad87",
  measurementId: "G-W5YRJGLW6L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const useFirebaseApp = () => app;
export const useAnalytics = () => analytics;

// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Lc57-ggAAAAALmdGVGJH0K12pT4ShdZlmCvuDHp"),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});

import { getAuth } from "firebase/auth";
const auth = getAuth();
export const useAuth = () => auth;
export const isLoggined = () => !!auth.currentUser;
