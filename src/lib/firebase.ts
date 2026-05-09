// Import types and functions
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';

// Prioritize Environment Variables (for Vercel/Production)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID;

// Helper to check if we have enough config to initialize from env
const hasEnvConfig = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'missing';

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  if (hasEnvConfig) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    console.log("Firebase initialized from environment variables.");
  } else {
    // If no env vars, we might be in the Studio or environment initialization is incomplete.
    console.warn("Firebase environment variables missing or incomplete. Check Vercel Settings.");
    
    // We only use placeholders in development/preview to avoid 'invalid-api-key' errors in production
    const isProduction = import.meta.env.PROD;
    
    if (!isProduction) {
      const placeholderConfig = {
        apiKey: "AIza-Placeholder", 
        authDomain: "placeholder.firebaseapp.com",
        projectId: "placeholder-id",
        storageBucket: "placeholder.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abcdef"
      };
      app = !getApps().length ? initializeApp(placeholderConfig) : getApp();
    } else {
      // In production, if keys are missing, we don't initialize with fake keys
      // This will cause auth to be undefined/null, which we handle below
      throw new Error("Missing mandatory Firebase environment variables in Production.");
    }
  }
  
  db = getFirestore(app, databaseId);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase Initialization Failed:", error);
  // Last resort to prevent top-level crashes
  app = {} as FirebaseApp;
  db = {} as Firestore;
  auth = {} as Auth;
}

export { app, db, auth };
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
