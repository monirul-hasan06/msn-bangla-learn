import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "সাইন আপ — MSN একাডেমি" }] }),
  component: SignupPage,
});

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cls, setCls] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pwd,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: name },
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from("profiles").update({ full_name: name, phone, class_level: cls }).eq("id", data.user.id);
    }
    setLoading(false);
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে! স্বাগতম 🎉");
    navigate({ to: "/" });
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error("Google সাইন আপ ব্যর্থ");
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-warm px-4 py-10">
      <Card className="w-full max-w-md p-8 gradient-card border-border/50 shadow-glow">
        <Link to="/" className="flex items-center justify-center gap-2 font-bold text-2xl mb-6">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-gradient">MSN</span>
        </Link>
        <h1 className="text-2xl font-bold text-center mb-2">নতুন অ্যাকাউন্ট তৈরি করুন</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">শেখার যাত্রা শুরু করো আজই</p>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <Label htmlFor="name">পূর্ণ নাম</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="আপনার নাম" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">ইমেইল (Gmail)</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="phone">ফোন নম্বর</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+৮৮০ ১XXX-XXXXXX" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="cls">আপনার ক্লাস</Label>
            <Select value={cls} onValueChange={setCls}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="ক্লাস নির্বাচন করুন" /></SelectTrigger>
              <SelectContent>
                {[5, 6, 7, 8, 9, 10, 11, 12].map((c) => (
                  <SelectItem key={c} value={String(c)}>ক্লাস {c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="pwd">পাসওয়ার্ড</Label>
            <Input id="pwd" type="password" required minLength={6} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••" className="mt-1.5" />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-hero text-primary-foreground border-0 shadow-soft hover:shadow-glow transition-all">
            {loading ? "তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </Button>
          <Button type="button" onClick={handleGoogle} variant="outline" className="w-full">Google দিয়ে সাইন আপ</Button>
        </form>
        <p className="text-sm text-center text-muted-foreground mt-6">
          ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/login" className="text-primary font-medium hover:underline">লগইন করুন</Link>
        </p>
      </Card>
    </div>
  );
}
