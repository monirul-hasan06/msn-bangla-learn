import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Smartphone, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "আমার প্রোফাইল — MSN" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading]);

  const load = async () => {
    if (!user) return;
    const [{ data: p }, { data: e }, { data: d }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("enrollments").select("*, courses(title, class_level, price)").eq("user_id", user.id),
      supabase.from("user_devices").select("*").eq("user_id", user.id).order("last_seen", { ascending: false }),
    ]);
    setProfile(p);
    setEnrollments(e || []);
    setDevices(d || []);
    setLoading(false);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const save = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name, phone: profile.phone, class_level: profile.class_level,
    }).eq("id", user.id);
    if (error) toast.error(error.message); else toast.success("প্রোফাইল আপডেট হয়েছে");
  };

  const removeDevice = async (id: string) => {
    await supabase.from("user_devices").delete().eq("id", id);
    toast.success("ডিভাইস সরানো হয়েছে");
    load();
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">আমার <span className="text-gradient">প্রোফাইল</span></h1>
            <Button variant="outline" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
              <LogOut className="h-4 w-4 mr-2" /> লগআউট
            </Button>
          </div>

          <Card className="p-6 gradient-card">
            <h2 className="font-bold text-lg mb-4">ব্যক্তিগত তথ্য</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>নাম</Label><Input className="mt-1.5" value={profile?.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
              <div><Label>ইমেইল</Label><Input className="mt-1.5" value={profile?.email || ""} disabled /></div>
              <div><Label>ফোন</Label><Input className="mt-1.5" value={profile?.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
              <div><Label>ক্লাস</Label><Input className="mt-1.5" value={profile?.class_level || ""} onChange={(e) => setProfile({ ...profile, class_level: e.target.value })} /></div>
            </div>
            <Button className="mt-4 gradient-hero text-primary-foreground border-0" onClick={save}>সংরক্ষণ করুন</Button>
          </Card>

          <Card className="p-6 gradient-card">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> আমার কোর্সসমূহ</h2>
            {enrollments.length === 0 ? (
              <p className="text-sm text-muted-foreground">এখনো কোনো কোর্স নেই। <Link to="/courses" className="text-primary underline">কোর্স দেখুন</Link></p>
            ) : (
              <div className="space-y-2">
                {enrollments.map((en) => (
                  <div key={en.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <div className="font-medium">{en.courses?.title}</div>
                      <div className="text-xs text-muted-foreground">ক্লাস {en.courses?.class_level} • ৳{en.courses?.price}</div>
                    </div>
                    <Badge variant={en.status === "approved" ? "default" : "secondary"} className={en.status === "approved" ? "bg-success" : ""}>
                      {en.status === "approved" ? "অনুমোদিত" : en.status === "pending" ? "অপেক্ষমাণ" : "প্রত্যাখ্যাত"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 gradient-card">
            <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><Smartphone className="h-5 w-5 text-primary" /> সক্রিয় ডিভাইসসমূহ</h2>
            <p className="text-xs text-muted-foreground mb-4">সর্বোচ্চ ২টি ডিভাইসে লগইন থাকতে পারবেন।</p>
            <div className="space-y-2">
              {devices.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="text-xs truncate flex-1 mr-2">{d.user_agent}</div>
                  <Button size="sm" variant="ghost" onClick={() => removeDevice(d.id)}>সরান</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
