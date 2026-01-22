import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";

export async function login(email: string, password: string): Promise<UserCredential> {
	return signInWithEmailAndPassword(auth, email, password);
}


	export async function register(email: string, password: string): Promise<UserCredential> {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		await setDoc(doc(db, "users", user.uid), {
			uid: user.uid,
			email: user.email,
			createdAt: new Date().toISOString(),
		});
		return userCredential;
	}
