import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: REPLACE THIS WITH YOUR REAL FIREBASE CONFIGURATION OBJECT
// 1. Go to console.firebase.google.com
// 2. Create a new project (e.g. "Thiranmozhi")
// 3. Add a Web App, and copy the firebaseConfig below:
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Bind to global window so HTML buttons can trigger it
window.loginWithGoogle = async () => {
    try {
        console.log("Initiating Real Google Authentication...");
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        console.log("Successfully logged in:", user.displayName);

        // Fetch user data from real Firestore database
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // Restore from database
            const data = userSnap.data();
            localStorage.setItem('thiranmozhi_student', JSON.stringify({ name: data.name, age: data.age }));
            window.location.href = 'dashboard.html';
        } else {
            // First time login - redirect to student info setup
            localStorage.setItem('thiranmozhi_temp_uid', user.uid); 
            localStorage.setItem('thiranmozhi_temp_email', user.email); 
            localStorage.setItem('thiranmozhi_temp_name', user.displayName); 
            window.location.href = 'student-info.html';
        }

    } catch (error) {
        console.error("Google Auth Error:", error.code, error.message);
        alert("Authentication failed. Please verify your Firebase configuration.");
    }
};

window.logoutUser = async () => {
    try {
        await signOut(auth);
        localStorage.clear();
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Logout Error:", error);
    }
};

// Listen for actual auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is validated by Google:", user.email);
        // Optionally update UI if user is already logged in on the landing page
        const loginBtn = document.getElementById('google-login-btn');
        if (loginBtn) {
            loginBtn.innerHTML = `Continue as ${user.displayName} <i class="fa-solid fa-arrow-right"></i>`;
            loginBtn.onclick = () => window.location.href = 'dashboard.html';
        }
    }
});
