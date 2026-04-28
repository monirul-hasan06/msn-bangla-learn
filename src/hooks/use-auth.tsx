import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type Role = "admin" | "student" | null;

interface AuthCtx {
  user: User | null;
  session: Session | null;
  role: Role;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

function getDeviceId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("msn_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("msn_device_id", id);
  }
  return id;
}

async function registerDevice(userId: string) {
  try {
    const deviceId = getDeviceId();
    const ua = navigator.userAgent;
    // Upsert this device
    await supabase.from("user_devices").upsert(
      { user_id: userId, device_id: deviceId, user_agent: ua, device_name: ua.slice(0, 80), last_seen: new Date().toISOString() },
      { onConflict: "user_id,device_id" }
    );
    // Enforce 2-device limit: if more than 2 devices, sign out from this one
    const { data } = await supabase
      .from("user_devices")
      .select("device_id, last_seen")
      .eq("user_id", userId)
      .order("last_seen", { ascending: false });
    if (data && data.length > 2) {
      const allowed = data.slice(0, 2).map((d) => d.device_id);
      if (!allowed.includes(deviceId)) {
        alert("আপনি ইতিমধ্যে ২টি ডিভাইসে লগইন আছেন। অন্য ডিভাইস থেকে লগআউট করুন।");
        await supabase.auth.signOut();
      }
    }
  } catch (e) {
    console.error("device register failed", e);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => {
          registerDevice(sess.user.id);
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", sess.user.id)
            .then(({ data }) => {
              const isAdmin = data?.some((r) => r.role === "admin");
              setRole(isAdmin ? "admin" : "student");
            });
        }, 0);
      } else {
        setRole(null);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        registerDevice(data.session.user.id);
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.session.user.id)
          .then(({ data: roles }) => {
            const isAdmin = roles?.some((r) => r.role === "admin");
            setRole(isAdmin ? "admin" : "student");
          });
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return <Ctx.Provider value={{ user, session, role, loading, signOut }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
