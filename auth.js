import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const googleBtn = document.getElementById("googleAuthBtn");
const appleBtn = document.getElementById("appleAuthBtn");
const logoutBtn = document.getElementById("logoutAuthBtn");

const firebaseConfig = window.FIREBASE_CONFIG || null;

function isValidConfig(config) {
  return Boolean(config && config.apiKey && config.authDomain && config.projectId && config.appId);
}

function setUiSignedOut() {
  if (googleBtn) googleBtn.disabled = false;
  if (appleBtn) appleBtn.disabled = false;
  if (logoutBtn) logoutBtn.classList.add("hidden");
}

function setUiSignedIn() {
  if (googleBtn) googleBtn.disabled = true;
  if (appleBtn) appleBtn.disabled = true;
  if (logoutBtn) logoutBtn.classList.remove("hidden");
}

if (!isValidConfig(firebaseConfig)) {
  setUiSignedOut();
  if (googleBtn) googleBtn.title = "Set window.FIREBASE_CONFIG to enable auth";
  if (appleBtn) appleBtn.title = "Set window.FIREBASE_CONFIG to enable auth";
} else {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const appleProvider = new OAuthProvider("apple.com");

  setPersistence(auth, browserLocalPersistence).catch(() => {});

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUiSignedIn();
    } else {
      setUiSignedOut();
    }
  });

  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (error) {
        console.error("Google sign-in failed", error);
        alert("Google sign-in failed. Check Firebase settings.");
      }
    });
  }

  if (appleBtn) {
    appleBtn.addEventListener("click", async () => {
      try {
        await signInWithPopup(auth, appleProvider);
      } catch (error) {
        console.error("Apple sign-in failed", error);
        alert("Apple sign-in failed. Check Firebase + Apple provider settings.");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Sign-out failed", error);
      }
    });
  }
}
