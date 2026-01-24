import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { getUserProfile } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";

export function useAuthBootstrap() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        return;
      }

      try {
        const profile = await getUserProfile(fbUser.uid);
        setUser(profile);
      } catch (err) {
        console.error("Auth bootstrap error:", err);
        setUser(null);
      }
    });

    return () => unsub();
  }, []);
}
