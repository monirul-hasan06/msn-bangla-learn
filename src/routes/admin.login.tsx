import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "অ্যাডমিন লগইন — MNS Academy" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, role } = useAuth();

  useEffect(() => {
    if (user && role === "admin") navigate({ to: "/admin/dashboard" });
  }, [user, role]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    if (error) {
      // Try auto-signup for the seeded admin emails on first login
      const isSeed = ["monirul.hasan513@gmail.com","mnsacademy32@gmail.com","munna.uk.bd@gmail.com"].includes(email);
      if (isSeed && /invalid/i.test(error.message)) {
        const { error: signErr } = await supabase.auth.signUp({
          email, password: pwd,
          options: { emailRedirectTo: window.location.origin + "/admin/dashboard" },
        });
        if (signErr) { setLoading(false); return toast.error(signErr.message); }
        const { error: e2 } = await supabase.auth.signInWithPassword({ email, password: pwd });
        if (e2) { setLoading(false); return toast.error(e2.message); }
      } else {
        setLoading(false);
        return toast.error(error.message);
      }
    }
    setLoading(false);
    toast.success("সফলভাবে লগইন হয়েছে");
    navigate({ to: "/admin/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-warm px-4 py-10">
      <Card className="w-full max-w-md p-8 gradient-card border-border/50 shadow-glow">
        <Link to="/" className="flex items-center justify-center gap-2 font-bold text-2xl mb-2">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-gradient">MNS Academy</span>
        </Link>
        <div className="flex items-center justify-center gap-2 mb-6 text-primary">
          <ShieldCheck className="h-4 w-4" /> <span className="text-sm font-medium">অ্যাডমিন প্যানেল</span>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="email">অ্যাডমিন ইমেইল</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="pwd">পাসওয়ার্ড</Label>
            <Input id="pwd" type="password" required value={pwd} onChange={(e) => setPwd(e.target.value)} className="mt-1.5" />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-hero text-primary-foreground border-0">
            {loading ? "লগইন হচ্ছে..." : "লগইন"}
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-6">
          শুধু অনুমোদিত অ্যাডমিনদের জন্য
        </p>
      </Card>
    </div>
  );
}
