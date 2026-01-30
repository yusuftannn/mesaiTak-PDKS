import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { auth, db } from "./firebase";
import {
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { AuthUser } from "../store/auth.store";

export async function login(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function register(
  email: string,
  password: string,
  name?: string
): Promise<UserCredential> {
  const cred = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = cred.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    name: name ?? null,

    role: "employee",
    status: "active",

    companyId: null,
    branchId: null,
    country: null,
    phone: null,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return cred;
}

export async function getUserProfile(
  uid: string
): Promise<AuthUser> {
  const snap = await getDoc(doc(db, "users", uid));

  if (!snap.exists()) {
    throw new Error("USER_PROFILE_NOT_FOUND");
  }

  return snap.data() as AuthUser;
}
