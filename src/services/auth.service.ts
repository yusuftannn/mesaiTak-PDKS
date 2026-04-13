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
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import type { AuthUser } from "../store/auth.store";

type UserLookup = {
  email: string;
};
export async function login(
  identifier: string,
  password: string,
): Promise<UserCredential> {
  let emailToUse = identifier.trim();

  const isEmail = emailToUse.includes("@");

  if (!isEmail) {
    const user = await findUserByUsername(emailToUse);

    if (!user) {
      throw { code: "auth/user-not-found" };
    }

    emailToUse = user.email;
  }

  return signInWithEmailAndPassword(auth, emailToUse, password);
}

export async function findUserByUsername(
  userName: string,
): Promise<UserLookup | null> {
  const q = query(
    collection(db, "users"),
    where("userName", "==", userName.toLowerCase()),
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const data = snap.docs[0].data();

  return {
    email: data.email as string,
  };
}

export async function register(
  email: string,
  password: string,
  name?: string,
): Promise<UserCredential> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

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

export async function getUserProfile(uid: string): Promise<AuthUser> {
  const snap = await getDoc(doc(db, "users", uid));

  if (!snap.exists()) {
    throw new Error("USER_PROFILE_NOT_FOUND");
  }

  return snap.data() as AuthUser;
}
